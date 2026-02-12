import { Prisma, PrismaPromise } from "@prisma/client";
import { db } from "..";

export interface IApprovalModuleRepository {
   createApprovalMatrix(args: Prisma.ApprovalMatrixCreateArgs): Promise<{ id: string }>
   createUserApproval(args: Prisma.UserApprovalCreateArgs): Promise<{ id: string }>
   createApprovers(args: Prisma.UserApprovalCreateArgs): Promise<{ id : string }>
   insertDynamicApproval(sessionId: string, primaryId: string,userId: string): Promise<any>
   insertDynamicModifyApproval(sessionId: string, primaryId: string,userId: string): Promise<any>
   InsertApprovalMatrix(MatrixDat:any,sessionId : any,sessionTypeId :number,userId: string,isUpdate:boolean): Promise<any>
   syncUserApprovalForNewUsers(sessionId: string, sessionTypeId: number, userId: string): Promise<any>
   autoApproveModule(sessionId: string, primaryId: string,userId: string): Promise<any>
   updateApproval(sessionId: string, primaryId: string, userId: string, status: string,): Promise<any>
   findMany(args: Prisma.ApprovalMatrixFindManyArgs): Promise<any>
   resubmitApproval(sessionId: string, primaryId: string, userId: string): Promise<boolean>
}

export class ApprovalModuleRepository implements IApprovalModuleRepository {

    findMany(args?: Prisma.ApprovalMatrixFindManyArgs): PrismaPromise<any> {
        return db.approvalMatrix.findMany({
          ...args,
        })
    }

    async createApprovalMatrix(args: Prisma.ApprovalMatrixCreateArgs): Promise<any> {
        const selectArgs = Prisma.validator<Prisma.ApprovalMatrixSelect>()({
            id: true,
        })

        return await db.approvalMatrix.create({
            ...args,
            select: selectArgs,
        })
    }
    
    async createUserApproval(args: Prisma.UserApprovalCreateArgs): Promise<any> {
        const selectArgs = Prisma.validator<Prisma.UserApprovalSelect>()({
            id: true,
        })

        return await db.userApproval.create({
            ...args,
            select: selectArgs,
        })
    }

    async createApprovers(args: Prisma.UserApprovalCreateArgs): Promise<any> {
        const selectArgs = Prisma.validator<Prisma.UserApprovalSelect>()({
            id: true,
        })

        return await db.userApproval.create({
            ...args,
            select: selectArgs,
        })
    }

    async insertDynamicModifyApproval(sessionId: string, primaryId: string,userId: string): Promise<any> {
        let baseApprovalMatrix = await db.approvalMatrix.findMany({
            where: {sessionId: sessionId,isActive:true}
        });
    
        if (baseApprovalMatrix.length === 0) {
            return false;
        }

        const minLevel = Math.min(...baseApprovalMatrix.map((l:any) => l.approvalLevel));
        let userApprovals: any =[];
    
        baseApprovalMatrix = baseApprovalMatrix.sort((a: { approvalLevel: number; }, b: { approvalLevel: number; }) => a.approvalLevel - b.approvalLevel);
    
        for (const item of baseApprovalMatrix) {
            
            let user = {
                sessionId: sessionId,
                approvalModuleUniqueId: primaryId,
                approvalLevel: item.approvalLevel,
                approvalUserId: item.toUserId,
                isNextApprover: minLevel === item.approvalLevel ? true: false,
                isCurrApprover: false,
                createdBy: userId,
                isReSubmitApprover : false,
                isActive: true,
                approvalStatusId :"",
            };
            userApprovals.push(user);
        }
    
        await db.userApproval.createMany({
            data: userApprovals,
        });
    
        const isUpdateApproval = userApprovals.length > 0;
        return isUpdateApproval;
    }

    async insertDynamicApproval(sessionId: string, primaryId: string,userId: string): Promise<any> {
        const baseApprovalMatrix = await db.approvalMatrix.findMany({
            where: {sessionId: sessionId, isActive: true}
        });
    
        if (baseApprovalMatrix.length === 0) {
            return false;
        }
    
        let tempApprovalMatrix = [...baseApprovalMatrix];
        const minOfOrder = Math.min(...tempApprovalMatrix.map(l => l.approvalLevel));
        let userApprovals: any =[];
        const getCurrRoleId = userId;
        const matrixRole = tempApprovalMatrix.map(l => l.toUserId);
        let maxApprovalOrderRole:any = 0;
        let isMaxApprove = false;
        let partiallyAppOrderList: any = [];
    
        if (matrixRole.includes(getCurrRoleId)) {
            let maxApprovalOrder:any = await this.getMaxApprovalOrder(sessionId);
            maxApprovalOrderRole = await this.getMaxApprovalOrderRole(sessionId, getCurrRoleId, maxApprovalOrder);
            let approvalOrder = await this.getPartialList(sessionId, getCurrRoleId) ?? 0;
            partiallyAppOrderList = await this.getPartiallyAppOrderList(sessionId, approvalOrder,getCurrRoleId);
            isMaxApprove = maxApprovalOrderRole == getCurrRoleId;
        }
    
        let isTempNextApprover = false;
        let isNextApproverState = 0;
    
        tempApprovalMatrix = tempApprovalMatrix.sort((a, b) => a.approvalLevel - b.approvalLevel);
    
        for (const item of tempApprovalMatrix) {
            let partialApproveList = 0;
    
            if (partiallyAppOrderList.some((l:any) => l.id === item.id)) {
                let itemdata = partiallyAppOrderList.find((l:any) => l.id === item.id);
                partialApproveList = itemdata?.id;
            }
    
            let user = {
                sessionId: sessionId,
                approvalModuleUniqueId: primaryId,
                approvalLevel: item.approvalLevel,
                approvalUserId: item.toUserId,
                isNextApprover: false,
                isCurrApprover: false,
                createdBy: userId,
                isActive: true,
                approvalStatusId :"",
                isReSubmitApprover: false
            };
    
            if (isTempNextApprover) {
                isNextApproverState = 1;
            }
    
            if (isMaxApprove || partialApproveList !== 0) {
                user.approvalStatusId = "1";
            } else {
                if (item.toUserId === getCurrRoleId) {
                    user.approvalStatusId = "1";
                    isTempNextApprover = true;
                } else {
                    user.approvalStatusId = "";
                }
            }
    
            if (!matrixRole.includes(getCurrRoleId)) {
                user.isNextApprover = minOfOrder === item.approvalLevel;
            } else {
                user.isNextApprover = isMaxApprove ? false : (item.toUserId === getCurrRoleId ? false : isNextApproverState === 1);
            }
    
            user.isCurrApprover = isMaxApprove ? false : item.toUserId === getCurrRoleId;
            userApprovals.push(user);
    
            if (isNextApproverState === 1) {
                isNextApproverState = 0;
                isTempNextApprover = false;
            }
        }
    
        await db.userApproval.createMany({
            data: userApprovals,
        });
    
        const isUpdateApproval = userApprovals.length > 0;
        return isUpdateApproval;
    }

    async getMaxApprovalOrder(sessionId: string): Promise<number | null> {
        try {
            const maxApprovalOrder : any = await db.$queryRaw<{ maxApprovalOrder: number | null }>
            `
            SELECT "approvalLevel" AS "maxApprovalOrder"
            FROM "ApprovalMatrix"
            WHERE "sessionId" = ${sessionId}
            AND "isActive" = true
            `;
            const maxOfOrder = Math.max(...maxApprovalOrder.map((l:any) => l.maxApprovalOrder));
            return maxOfOrder ?? null;

          } catch (error) {
            console.error(error);
            return null;
          }
    }


    async getMaxApprovalOrderRole(sessionId: string, getCurrRoleId: string, order: number): Promise<number | null> 
    {
        try {
            const maxApprovalOrderRole:any = await db.$queryRaw<number | null>
            `
            SELECT "toUserId" AS "maxApprovalOrderRole"
            FROM "ApprovalMatrix"
            WHERE "sessionId" = ${sessionId}
            AND "toUserId" = ${getCurrRoleId}
            AND "approvalLevel" = ${order}
            AND "isActive" = true
            `;
        
            return maxApprovalOrderRole[0]?.maxApprovalOrderRole || null;
          } catch (error) {
            console.error(error);
            return null;
          }
        
    }
      
    async getPartialList(sessionId: string, getCurrRoleId: string): Promise<number | null> 
    {
        const partialList:any = await db.$queryRaw<number | null>
        `
        SELECT "approvalLevel"
        FROM "ApprovalMatrix"
        WHERE "sessionId" = ${sessionId}
        AND "toUserId" = ${getCurrRoleId}
        AND "isActive" = true
        `;
        return partialList[0]?.approvalLevel || null;
    }
      
    async  getPartiallyAppOrderList(sessionId: string, approvalOrder: number,getCurrRoleId: string): Promise<any> {
        const partiallyAppOrderList = await db.approvalMatrix.findMany({
          where: {
            sessionId,
            approvalLevel: approvalOrder,
            toUserId : { lt: getCurrRoleId },
            isActive: true
          },
        });
      
        return partiallyAppOrderList;
    }
    
      
    async isMaxApprove(maxApprovalOrderRole: string, getCurrRoleId: string): Promise<boolean> {
        return maxApprovalOrderRole === getCurrRoleId;
    }
      
    async  autoApproveModule(sessionId: string, primaryId: string,userId: string): Promise<boolean> 
    {
        try {
            const subHmQuery: number[] = [1, 2];
            const isAutoApproved:any = await db.$queryRaw<number>
            `
            SELECT COUNT(*) as count
            FROM UserApproval
            WHERE sessionId = ${sessionId}
            AND approvalModuleUniqueId = ${primaryId}
            AND isActive = true
            AND userRoleId IN (${subHmQuery})
            AND approvalStatusId = 1
            `;
        
            if (!isAutoApproved[0]?.count) {
                const approvedCount:any = await db.$queryRaw<number>
                `
                SELECT COUNT(*) as count
                FROM UserApproval
                WHERE sessionId = ${sessionId}
                AND approvalModuleUniqueId = ${primaryId}
                AND isActive = true
                AND approvalStatusId = 1
                `;
            
                const totalCount:any = await db.$queryRaw<number>
                `
                SELECT COUNT(*) as count
                FROM UserApproval
                WHERE sessionId = ${sessionId}
                AND approvalModuleUniqueId = ${primaryId}
                AND isActive = true
                `;
            
                return approvedCount[0]?.count === totalCount[0]?.count;
            }
        
            return true;
        } catch (error) {
            return false;
        }
    }

    async InsertApprovalMatrix(MatrixData : any = [],sessionId :string,sessionTypeId :number,userId: string, isUpdate: boolean){
        try
        {
            if(isUpdate){
                // OPTIMIZED: Single updateMany instead of loop (much faster)
                await db.approvalMatrix.updateMany({
                    where: {
                        sessionId: sessionId,
                        isActive: true
                    },
                    data: {
                        isActive: false,
                        updatedBy: userId
                    }
                });
            }

            let approvalMatrixList: any = [];
            let index = 0;
            let copyMatrix = MatrixData
            const filteredUserIds = copyMatrix.flat().filter((userId: any) => !userId.includes('auth0|'));
            let updatedMatrixData: any = [];
            
            if (filteredUserIds.length > 0) {
                const argForUserGroup = Prisma.validator<Prisma.UsersInUserGroupFindManyArgs>()({
                    where: {
                        deletedAt: null,
                        userGroupId: {
                            in: filteredUserIds
                        }
                    },
                });
            
                const userListForUserGroup = await db.usersInUserGroup.findMany(argForUserGroup);
            
                const filteredMatrixData = copyMatrix.map((array: any) => {
                    return array.map((userId: any) => userId.includes('auth0|') ? null : userId);
                });
            
                filteredMatrixData.forEach((array: any, index: any) => {
                    let newArray: any = [];
                    let userIdSet = new Set<string>();
                    array.forEach((userGroupId: any, i: any) => {
                        if (userGroupId === null) {
                            const userId = copyMatrix[index][i];
                            if (!userIdSet.has(userId)) {
                                newArray.push({ userId: userId });
                                userIdSet.add(userId);
                            }
                        } else {
                            const matchingUsers = userListForUserGroup.filter(user => user.userGroupId === userGroupId);
                            matchingUsers.forEach(matchingUser => {
                                if (!userIdSet.has(matchingUser.userId)) {
                                    newArray.push({
                                        userId: matchingUser.userId,
                                        userGroupId: matchingUser.userGroupId,
                                    });
                                    userIdSet.add(matchingUser.userId);
                                } else {
                                    userIdSet.delete(matchingUser.userId);
                                    newArray.push({
                                        userId: matchingUser.userId,
                                        userGroupId: matchingUser.userGroupId,
                                    });
                                    userIdSet.add(matchingUser.userId);
                                }
                            });
                        }
                    });
                    updatedMatrixData.push(newArray);
                });
                for (const nestedArray of updatedMatrixData) {
                    index++;
                
                    const objectsToInsert = nestedArray.map((object: any) => ({
                        userId : object.userId ? object.userId : object,
                        userGroupId : object.userGroupId ? object.userGroupId : null
                    }));

                    const filteredData = objectsToInsert.reduce((acc: any[], obj: any) => {
                        const existing = acc.find((item) => item.userId === obj.userId);
                        // If an entry for this userId already exists, and the current obj has a non-null userGroupId, replace it
                        if (existing) {
                          if (obj.userGroupId !== null) {
                            // Replace the existing entry
                            acc = acc.filter((item) => item.userId !== obj.userId);
                            acc.push(obj);
                          }
                        } else {
                          // Add new entry if not already present
                          acc.push(obj);
                        }
                        return acc;
                    }, []);
                
                    approvalMatrixList = approvalMatrixList.concat(
                        filteredData.map((obj: any) => ({
                            sessionId: sessionId,
                            sessionTypeId : sessionTypeId,
                            toUserId: obj.userId,
                            approvalLevel: index,
                            approvalGroup: index,
                            isParallel: true,
                            isActive: true,
                            createdBy : userId,
                            updatedBy : userId,
                            userGroupId : obj.userGroupId
                        }))
                    );
                }
            } else {
                for (const nestedArray of MatrixData) {
                    index++;
                
                    const objectsToInsert = nestedArray.map((userId: any) => ({
                        userId,
                    }));
                
                    approvalMatrixList = approvalMatrixList.concat(
                        objectsToInsert.map((obj: any) => ({
                            sessionId: sessionId,
                            sessionTypeId : sessionTypeId,
                            toUserId: obj.userId,
                            approvalLevel: index,
                            approvalGroup: index,
                            isParallel: true,
                            isActive: true,
                            createdBy : userId,
                            updatedBy : userId,
                            userGroupId : null
                        }))
                    );
                }
            }

            if (approvalMatrixList.length > 0) {
                await Promise.all(
                    approvalMatrixList.map(async (data: any) => {
                        await db.approvalMatrix.create({
                            data,
                        });
                    })
                );
            }

            // After updating approval matrix, sync UserApproval entries for new users
            if (isUpdate) {
                await this.syncUserApprovalForNewUsers(sessionId, sessionTypeId, userId);
            }

        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async syncUserApprovalForNewUsers(sessionId: string, sessionTypeId: number, userId: string): Promise<any> {
        try {
            // Get the new active ApprovalMatrix entries
            const newApprovalMatrix = await db.approvalMatrix.findMany({
                where: {
                    sessionId: sessionId,
                    isActive: true
                },
                orderBy: {
                    approvalLevel: 'asc'
                }
            });

            if (newApprovalMatrix.length === 0) {
                return false;
            }

            // Get all existing UserApproval entries
            const existingUserApprovals = await db.userApproval.findMany({
                where: {
                    sessionId: sessionId,
                    isActive: true
                },
                select: {
                    approvalLevel: true,
                    approvalUserId: true,
                    approvalModuleUniqueId: true,
                    isNextApprover: true,
                    isCurrApprover: true,
                    isReSubmitApprover: true,
                    approvalStatusId: true,
                    isActive: true
                }
            });

            // STEP 1: Build current users in ApprovalMatrix by level
            const currentUsersByLevel = new Map<number, Set<string>>();
            newApprovalMatrix.forEach(matrix => {
                if (!currentUsersByLevel.has(matrix.approvalLevel)) {
                    currentUsersByLevel.set(matrix.approvalLevel, new Set<string>());
                }
                currentUsersByLevel.get(matrix.approvalLevel)!.add(matrix.toUserId);
            });

            // STEP 2: Deactivate UserApproval entries for users NOT in current ApprovalMatrix
            const toDeactivate = new Map<string, { level: number; moduleId: string; userIds: string[] }>();
            existingUserApprovals.forEach(ua => {
                const currentUserIds = currentUsersByLevel.get(ua.approvalLevel);
                if (!currentUserIds || !currentUserIds.has(ua.approvalUserId)) {
                    // Use a more reliable key that won't break if moduleId has underscores
                    const key = `${ua.approvalLevel}|||${ua.approvalModuleUniqueId}`;
                    if (!toDeactivate.has(key)) {
                        toDeactivate.set(key, {
                            level: ua.approvalLevel,
                            moduleId: ua.approvalModuleUniqueId,
                            userIds: []
                        });
                    }
                    toDeactivate.get(key)!.userIds.push(ua.approvalUserId);
                }
            });

            // Execute deactivation
            for (const [key, deactivateData] of toDeactivate.entries()) {
                await db.userApproval.updateMany({
                    where: {
                        sessionId: sessionId,
                        approvalLevel: deactivateData.level,
                        approvalModuleUniqueId: deactivateData.moduleId,
                        approvalUserId: { in: deactivateData.userIds },
                        isActive: true
                    },
                    data: { isActive: false, updatedBy: userId }
                });
            }

            // STEP 3: Get all unique resources (approvalModuleUniqueId) from existing UserApproval
            const allResources = new Set<string>();
            existingUserApprovals.forEach(ua => {
                allResources.add(ua.approvalModuleUniqueId);
            });

            // STEP 4: Create Set of existing combinations to avoid duplicates
            const existingCombinations = new Set<string>();
            existingUserApprovals.forEach(ua => {
                const key = `${ua.approvalLevel}_${ua.approvalUserId}_${ua.approvalModuleUniqueId}`;
                existingCombinations.add(key);
            });

            // STEP 5: Group ApprovalMatrix by level (only active entries)
            const matrixByLevel = new Map<number, any[]>();
            newApprovalMatrix.forEach(matrix => {
                // Double-check: only process active ApprovalMatrix entries
                if (matrix.isActive === true) {
                    if (!matrixByLevel.has(matrix.approvalLevel)) {
                        matrixByLevel.set(matrix.approvalLevel, []);
                    }
                    matrixByLevel.get(matrix.approvalLevel)!.push(matrix);
                }
            });

            // STEP 6: Create UserApproval for all users in ApprovalMatrix for all resources
            const userApprovalsToCreate: any[] = [];

            // For each resource
            for (const resourceId of allResources) {
                // Find existing UserApproval for this resource at any level (to copy template data)
                const resourceUserApprovals = existingUserApprovals.filter(
                    ua => ua.approvalModuleUniqueId === resourceId
                );

                // For each level in ApprovalMatrix (only active entries)
                for (const [level, matrices] of matrixByLevel.entries()) {
                    // Find template UserApproval at this level for this resource (if exists)
                    const templateUA = resourceUserApprovals.find(ua => ua.approvalLevel === level);
                    
                    // For each user at this level in ApprovalMatrix (only active)
                    for (const matrix of matrices) {
                        // Ensure we only process active ApprovalMatrix entries
                        if (matrix.isActive !== true) {
                            continue;
                        }
                        
                        const key = `${level}_${matrix.toUserId}_${resourceId}`;
                        
                        // Create UserApproval if it doesn't exist
                        if (!existingCombinations.has(key)) {
                            userApprovalsToCreate.push({
                                sessionId: sessionId,
                                approvalModuleUniqueId: resourceId,
                                approvalLevel: level,
                                approvalUserId: matrix.toUserId,
                                isNextApprover: templateUA?.isNextApprover ?? false,
                                isCurrApprover: templateUA?.isCurrApprover ?? false,
                                isReSubmitApprover: templateUA?.isReSubmitApprover ?? false,
                                approvalStatusId: templateUA?.approvalStatusId ?? "",
                                isActive: true,
                                createdBy: userId
                            });
                        }
                    }
                }
            }

            // Create all UserApproval entries in batch
            if (userApprovalsToCreate.length > 0) {
                await db.userApproval.createMany({
                    data: userApprovalsToCreate,
                    skipDuplicates: true
                });
            }

            return userApprovalsToCreate.length > 0;
        } catch (error) {
            console.error('Error syncing UserApproval for new users:', error);
            return false;
        }
    }
   

    async updateApproval(sessionId: string, primaryId: string, userId: string, status: string): Promise<boolean> {
        try {
            const allApproverData = await db.userApproval.findMany({
                where: {
                    sessionId,
                approvalModuleUniqueId: primaryId,
                isActive: true,
                },
            });
        
            let changeStatus = await db.userApproval.findFirst({
                where: {
                approvalModuleUniqueId: primaryId,
                sessionId,
                isActive: true,
                approvalUserId: userId,
                    AND: [ 
                        {
                            OR: [
                            { approvalStatusId: "" },   // Check if approvalStatusId is an empty string
                            { approvalStatusId : '1' }  // Check if approvalStatusId is true
                            ]
                        },
                        {
                            OR: [
                            { isNextApprover: true },   // Check if isNextApprover is true
                            { isReSubmitApprover: true } // Check if isReSubmitApprover is true
                            ]
                        }
                    ]
                },
                orderBy: {
                    approvalLevel: 'asc',
                },
            });

            if (allApproverData && allApproverData.length > 0) {
                for (const item of allApproverData) {
                    item.isCurrApprover = false;
                    item.approvalStatusId = "";
                    await db.userApproval.update({
                        where: {
                            id: item.id
                        },
                        data: item
                    });
                }
            }
      
            if (!changeStatus) {
                return false;
            }
            
            const approvalLevelsWithoutMin = allApproverData.filter(level => level.approvalLevel !== changeStatus?.approvalLevel &&  level.approvalLevel > changeStatus!.approvalLevel).map(l => l.approvalLevel);
            let prechangeStatus: any = [];
            if(approvalLevelsWithoutMin.length != 0 && approvalLevelsWithoutMin && status != "REJECTED")
            {
                    const secondMinOfApprovalLevel = Math.min(...approvalLevelsWithoutMin);
                    prechangeStatus = await db.userApproval.findMany({
                    where: {
                        approvalLevel :  secondMinOfApprovalLevel ,
                        approvalModuleUniqueId: primaryId,
                        isActive: true,
                        sessionId,
                        isCurrApprover: false,
                    },
                    orderBy: {
                        approvalLevel: 'asc',
                    },
                    });

                    if (prechangeStatus && prechangeStatus.length > 0) 
                    {
                        for (const item of prechangeStatus) {
                            item.isNextApprover = true;
                            item.isCurrApprover = false;
                            await db.userApproval.updateMany({
                                where: {
                                    id: item.id
                                },
                                data: item
                            });
                        }
                    }
            }
          
          
          const previesdata = allApproverData.filter(level => level.approvalLevel === changeStatus?.approvalLevel);
            // if (previesdata && previesdata.length > 0 && approvalLevelsWithoutMin.length != 0) 
            if (previesdata && previesdata.length > 0) 
            {
                for (const item of previesdata) {
                    item.isNextApprover = false;
                    item.isCurrApprover = true;
                    item.isReSubmitApprover = false;
                    await db.userApproval.updateMany({
                        where: {
                            id: item.id
                        },
                        data: item
                    });
                }
            }

            if (status === "REJECTED") {
                if(changeStatus?.approvalLevel > 1){
                    let previesAppLevel = changeStatus?.approvalLevel-1;
                    const previesAppdata = allApproverData.filter((level:any) => level.approvalLevel === previesAppLevel);
                    if(previesAppdata.length > 0){
                        for (const item of previesAppdata) {
                            await db.userApproval.updateMany({
                                where: {
                                    id: item.id
                                },
                                data: { 
                                    isReSubmitApprover: true
                                }
                            });
                        }
                    }
                }
                changeStatus.isCurrApprover = true;
                allApproverData.forEach(l => l.isNextApprover = false);
            } else {
                changeStatus.isCurrApprover = prechangeStatus.length === 0 ? false : true;
            }

            changeStatus.isReSubmitApprover = false;
            changeStatus.isNextApprover = false;
            changeStatus.approvalStatusId =  status === "ACCEPTED" ? '1' : '2',
            changeStatus.updatedBy = userId,

          await db.userApproval.update({
            where: { id: changeStatus.id },
            data: changeStatus
          });
          
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
    }

    async resubmitApproval(sessionId: string, primaryId: string, userId: string): Promise<boolean> {
        try {
            const allApproverData = await db.userApproval.findMany({
                where: {
                    sessionId,
                    approvalModuleUniqueId: primaryId,
                    isActive: true,
                },
            });
      
            let changeStatus = await db.userApproval.findFirst({
                where: {
                    approvalModuleUniqueId: primaryId,
                    sessionId,
                    isActive: true,
                    approvalStatusId : "2"
                }
            });
      
          if (!changeStatus) {
            return false;
          }
 
          let nextApprovalLevel = changeStatus.approvalLevel === 1 ? 1 : changeStatus.approvalLevel+1;
          const updatedApproverData = allApproverData.map((item: any) => ({
              ...item,
              isCurrApprover: item.isReSubmitApprover === true ? true :  false,
              isReSubmitApprover : false,
              isNextApprover: item.approvalLevel === changeStatus?.approvalLevel,
              approvalStatusId: item.approvalLevel === changeStatus?.approvalLevel ? '' : item.approvalStatusId,
              updatedBy: item.approvalLevel === changeStatus?.approvalLevel ? userId : item.updatedBy,
          }));
        
           await Promise.all(updatedApproverData.map(async (item) => {
                await db.userApproval.updateMany({
                    where: {
                        id: item.id,
                    },
                    data: {...item,isCurrApprover:item.approvalLevel == 1 && item.resubmitApproval == 1 ? item.isCurrApprover = false : item.isCurrApprover},
                });
            }));
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
    }
}