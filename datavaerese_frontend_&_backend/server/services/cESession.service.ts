import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import type {
  CESessionCreateSingleInput,
  CESessionDeleteSingleInput,
  CESessionFindManyInput,
  CESessionFindSingleExtractedResourceInput,
  CESessionFindSingleInput,
  CESessionSaveEvaluationResultInput,
  CESessionUpdateSingleExtractedResourceInput,
  CESessionUpdateSingleInput,
  CESessionFindSingleSessionInput,
  ProjectImageSearchInput,
  CESessionLinkExtractedResourcesInput,
  ListExtractedResourcesInCESessionInput,
  CESessionListExtractedResourcesInput,
  CESessionStructureInput,
  CESessionStructureCommentInput,
  CESessionUpdateManyExtractedResourcesInput,
  CESessionSaveStructuresInput
} from '../trpc/routers/cESession'
import { db } from '../infrastructures/database'
import transaction from '../infrastructures/database/transaction'
import { TOKEN, resolve } from '../di'
import type { ExtractedResource, ExtractedResourceStatus } from '@prisma/client'
import { DateTime } from 'luxon'

export class CESessionService {
  static readonly cESessionRepository = resolve(TOKEN.cESessionRepository)
  static readonly taxonomyInCESessionsRepository = resolve(TOKEN.taxonomyInCESessionsRepository)
  // static readonly labelInCESessionsRepository = resolve(TOKEN.labelInCESessionsRepository)
  static readonly approvalModuleRepository = resolve(TOKEN.approvalModuleRepository)
  static readonly structureGroupInCESessionsRepository = resolve(TOKEN.structureGroupInCESessionsRepository)
  static readonly structureDataInCESessionsRepository = resolve(TOKEN.structureDataInCESessionsRepository)

  static async findMany(
    input: CESessionFindManyInput,
    canViewAll: boolean,
    userId: string | undefined,
  ) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const findGroupIdArg = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where: {
        usersInGroup: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true
      }
    });
    const groupIdOfUser = await db.userGroup.findMany(findGroupIdArg);
    const args = Prisma.validator<Prisma.CESessionFindManyArgs>()({
      where: {
        priority: input?.filter.priority,
        projectId: input?.filter.projectId,
        deletedAt : null,
        project: {
          is: {
            deletedAt: null,
            epic : {
              is : {
                deletedAt: null
              }
            }
          }
        },
        AND: [
          {
            ...(canViewAll
              ? {}
              : {
                OR: [
                  { users: { some: { userId } } },
                  {
                    UserGroupInCESessions: {
                      some: {
                        userGroupId: {
                          in: (await groupIdOfUser).map((d) => d.id),
                        }
                      },
                    },
                  },
                ],
              }),
          },
          {
            OR: input.search
              ? [
                  { name: { contains: input.search , mode: 'insensitive' } },
                  { description: { contains: input.search , mode: 'insensitive'} },
                ]
              : [],
          }
        ],
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })

    const countArgs = Prisma.validator<Prisma.CESessionCountArgs>()({
      where: {
        priority: input?.filter.priority,
        projectId: input?.filter.projectId,
        deletedAt : null,
        project: {
          is: {
            deletedAt: null,
            epic : {
              is : {
                deletedAt: null
              }
            }
          }
        },
        AND: [
          {
            ...(canViewAll
              ? {}
              : {
                OR: [
                  { users: { some: { userId } } },
                  {
                    UserGroupInCESessions: {
                      some: {
                        userGroupId: {
                          in: (await groupIdOfUser).map((d) => d.id),
                        }
                      },
                    },
                  },
                ],
              }),
          },
          {
            OR: input.search
              ? [
                  { name: { contains: input.search , mode: 'insensitive' } },
                  { description: { contains: input.search , mode: 'insensitive'} },
                ]
              : [],
          }
        ]
      },
    })

    return Promise.all([
      this.cESessionRepository().findMany(args),
      this.cESessionRepository().count(countArgs),
    ])
  }

  static async findSingleSession(input: CESessionFindSingleSessionInput, canViewAll: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const findGroupIdArg = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where: {
        usersInGroup: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true
      }
    });
    const groupIdOfUser = db.userGroup.findMany(findGroupIdArg);
 
    const args = Prisma.validator<Prisma.CESessionFindManyArgs>()({
      where: {
        priority: input?.filter.priority,
        id: input.filter.dLSessionId,
        projectId: input?.filter.projectId,
        AND: [
          {
            ...(canViewAll
              ? {}
              : {
                OR: [
                  { users: { some: { userId } } },
                  {
                    UserGroupInCESessions: {
                      some: {
                        userGroupId: {
                          in: (await groupIdOfUser).map((d) => d.id),
                        },
                      },
                    },
                  },
                ],
              }),
          },
        ],
        users: canViewAll
          ? undefined
          : {
              some: {
                userId,
              },
            },
      },
     
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })
 
    const countArgs = Prisma.validator<Prisma.CESessionCountArgs>()({
      where: {
        priority: input?.filter.priority,
        projectId: input?.filter.projectId,
        users: canViewAll
          ? undefined
          : {
              some: {
                userId,
              },
            },
      },
    })

    const approvalArgs = Prisma.validator<Prisma.ApprovalMatrixFindManyArgs>()({
      select: {
        userGroupId: true,
        toUserId: true,
        approvalLevel: true
      },
      where: {
        sessionId : input.filter.dLSessionId,
        isActive: true
      }
    })

    const structureGroupArgs = Prisma.validator<Prisma.StructureGroupInCESessionsFindManyArgs>()({
      select: {
        structureGroups: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: {
        cESessionId : input.filter.dLSessionId
      }
    })
 
    return Promise.all([
      this.cESessionRepository().findMany(args),
      this.cESessionRepository().count(countArgs),
      this.approvalModuleRepository().findMany(approvalArgs),
      this.structureGroupInCESessionsRepository().findMany(structureGroupArgs)
    ])
  }

  static async find(
    input: CESessionFindSingleInput,
    canViewAll: boolean,
    userId: string | undefined,
  ) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const args = Prisma.validator<Prisma.CESessionFindUniqueArgs>()({
      where: {
        id: input,
      },
    })

    const approvalLevelArgs = Prisma.validator<Prisma.ApprovalMatrixFindManyArgs>()({
      select: {
        approvalLevel: true
      },
      where: {
        toUserId: userId,
        sessionId: input,
        isActive: true
      },
      orderBy:{
        approvalLevel: 'asc'
      }
    })

    const userGroupArgs = Prisma.validator<Prisma.UserGroupInCESessionsFindManyArgs>()({
      where: {
        cESessionId: input
      },
      select: {
        userGroupId: true,
        userRole: true
      }
    })

    const userGroupInCESession = await db.userGroupInCESessions.findMany(userGroupArgs);
    const approvalLevel = await this.approvalModuleRepository().findMany(approvalLevelArgs)
    const cESession: any = await this.cESessionRepository().findOne(args)

    if (userGroupInCESession.length > 0) {
      const argForUserGroup = Prisma.validator<Prisma.UsersInUserGroupFindManyArgs>()({
        where: {
          deletedAt: null,
          userGroupId: {
            in: userGroupInCESession.map((e: any) => e.userGroupId),
          },
        },
      });
  
      const userListForUserGroup = await db.usersInUserGroup.findMany(argForUserGroup);
      userListForUserGroup.forEach((e: any) => {
        e['userRole'] = userGroupInCESession.filter((element: any)=> element.userGroupId == e.userGroupId)[0].userRole;
        cESession.users.push(e);
      });
    }
    
    if (approvalLevel[0]) {
      cESession['approvalLevel'] = approvalLevel
    }

    if (canViewAll || cESession?.users.some((user: any) => user.userId === userId))
      return cESession
    else
      throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  static async findOneExtractedResource(input: CESessionFindSingleExtractedResourceInput) {
    const args = Prisma.validator<Prisma.ExtractedResourcesInCESessionsWhereUniqueInput>()(
      {
        extractedResourceId_cESessionId: { extractedResourceId: input.filter.extractedResourceId, cESessionId: input.filter.cESessionId },
      },
    )
    return this.cESessionRepository().findOneExtractedResource(args)
  }

  static async create(
    input: CESessionCreateSingleInput,
    isAdmin: boolean,
    userId: string | undefined,
  ) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const groupList = input.users.filter((element) => !element.userId.includes('auth0'));
    const userList = input.users.filter((element: any) => element.userId.includes('auth0'));
    let FormattedGroup: any = []

    groupList.map((e: any) => {
      FormattedGroup.push({
        userGroupId: e.userId,
        userRole: e.userRole,
        createdBy: userId,
        updatedBy: userId
      })
    })

    const args = Prisma.validator<Prisma.CESessionCreateArgs>()({
      data: {
        name: input.name,
        description: input.description,
        priority: input.priority,
        sop: input.sop,
        resultTemplate: {"startAt": null, "finishAt": null, "sections": [{"name": "Section 1", "index": 0, "assessments": [], "measurements": []}]},
        projectId: input.projectId,
        users: {
          createMany: {
            data: userList,
          },
        },
        structureGroupInCESessions: input.structures
        ? {
            createMany: {
              data: input.structures.map((structure) => ({
                structureGroupId: structure,
              })),
            },
          } : undefined,
        UserGroupInCESessions: {
          createMany: {
            data: FormattedGroup,
          }
        },
      },
    })
    
    const cESessionCreate = await this.cESessionRepository().create(args)
    let sessionTypeId = 2;
    await this.approvalModuleRepository().InsertApprovalMatrix(input.approval, cESessionCreate.id, sessionTypeId, userId, false);

    return cESessionCreate
  }

  static async update(
    input: CESessionUpdateSingleInput,
    isAdmin: boolean,
    userId: string | undefined,
  ) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const groupList = input.users?.filter((element) => !element.userId.includes('auth0'));
    const userList = input.users?.filter((element: any) => element.userId.includes('auth0'));
    let FormattedGroup: any = []
    groupList?.forEach((e: any) => {
      FormattedGroup.push({
        userGroupId: e.userId,
        userRole: e.userRole,
        createdBy: userId,
        updatedBy: userId
      })
    })

    const args = Prisma.validator<Prisma.CESessionUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
        priority: input.priority,
        sop: input.sop,
        projectId: input.projectId,
        users: userList
          ? {
              deleteMany: {},
              createMany: {
                data: userList,
              },
            }
          : undefined,
        structureGroupInCESessions: input.structures
          ? {
              deleteMany:{},
              createMany: {
                data: input.structures.map((structure) => ({
                  structureGroupId: structure,
                })),
                skipDuplicates: true,
              },
            }
            : undefined,
        UserGroupInCESessions: FormattedGroup
          ? {
              updateMany: {
                where : {
                  cESessionId : input.id
                },
                data: {
                  deletedAt: DateTime.now().toJSDate()
                }
              },
              createMany: {
                data: FormattedGroup,
              }
            }
            : undefined,
      },
    })
    
    let sessionTypeId = 2;
    await this.approvalModuleRepository().InsertApprovalMatrix(input.approval,input.id,sessionTypeId,userId,true);
    return this.cESessionRepository().update(args)
  }

  static async updateInExtractedResource(input: CESessionUpdateSingleExtractedResourceInput) {
    const args = Prisma.validator<Prisma.ExtractedResourcesInCESessionsUpdateArgs>()({
      where: {
        extractedResourceId_cESessionId: {
          extractedResourceId: input.extractedResourceId,
          cESessionId: input.cESessionId,
        },
      },
      data: {
        status: input.status,
        result: input.result,
        // comment: input.comment,
      },
    })
    return this.cESessionRepository().updateOneExtractedResource(args)
  }

  static async delete(
    input: CESessionDeleteSingleInput,
    isAdmin: boolean,
    userId: string | undefined,
  ) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const args = Prisma.validator<Prisma.CESessionUpdateArgs>() ({
      where: {
        id: input.id,
      },
      data: {
        deletedAt: input.deletedAt
      }
    })

    return this.cESessionRepository().update(args)
  }

  static async saveEvaluationResult(
    input: CESessionSaveEvaluationResultInput,
    isAdmin: boolean,
    userId: string | undefined,
  ) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const args = Prisma.validator<
      Prisma.ExtractedResourcesInCESessionsUpdateArgs
    >()({
      where: {
        extractedResourceId_cESessionId: {
          cESessionId: input.cESessionId,
          extractedResourceId: input.extractedResourceId,
        },
      },
      data: {
        cESession: {
          update: {
            updatedAt: new Date(),
          },
        },
        result: input.result,
      },
    })
    return this.cESessionRepository().saveEvaluationResult(args)
  }

  static async projectImageSearch(input: ProjectImageSearchInput, isAdmin: boolean, userId: string) {
    const query = Prisma.sql`
      WITH resources_in_session AS (
        SELECT 
          ERDLS."extractedResourceId",
          ERDLS."cESessionId",
          ERDLS."status"
        FROM "ExtractedResourcesInCESessions" ERDLS
        GROUP BY ERDLS."extractedResourceId", ERDLS."cESessionId"
      ),
      resources_by_patient AS (
          SELECT 
              ER.*,
              RS."cESessionId",
              p.id as "patientId",
              d.name,
              RS."status",
              d."projectId"
          FROM "ExtractedResource" ER
          JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
          JOIN "Visit" V ON V.id = RR."visitId"
          JOIN "Patient" P ON P.id = V."patientId"
          JOIN resources_in_session RS ON ER.id = RS."extractedResourceId"
          join "CESession" d on d.id = RS."cESessionId"
      ),
      paginated_data AS (
          SELECT 
              RP.*,
              ROW_NUMBER() OVER (PARTITION BY RP."cESessionId" ORDER BY RP.id) AS row_num
          FROM resources_by_patient RP
      )
      SELECT 
          PD."cESessionId",
          PD."patientId",
          PD.name,
          PD."status",
          CEIL(PD.row_num::decimal / 200)::int AS pageNumber,
          PD.row_num::int as imageindex
      FROM paginated_data PD
      WHERE PD."projectId" = ${input.projectId} and PD.id = ${input.imageId}
    `
    return db.$queryRaw(query)
  }

  static async linkExtractedResources(input: CESessionLinkExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const firstArgs = Prisma.validator<Prisma.ExtractedResourcesInCESessionsCreateManyArgs>()({
      data: input.extractedResources.map(resource => ({
        cESessionId: input.cESessionId,
        extractedResourceId: resource.id,
        comment: ''
      })),
      skipDuplicates: true,
    })

    return transaction([
      this.cESessionRepository().createManyExtractedResources(firstArgs)
    ])
  }

  static async listExtractedResources(input: ListExtractedResourcesInCESessionInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const query = Prisma.sql`
        WITH 
        resources_in_session AS (
          SELECT
            ERCES."extractedResourceId",
            ERCES."status",
            ERCES."comment"
          FROM 
            "ExtractedResourcesInCESessions" ERCES
          WHERE ERCES."cESessionId" = ${input.filter.cESessionId}
          ${input.filter?.status ? Prisma.sql`AND ERCES.status::text = ${input.filter.status}` : Prisma.empty}
        ),
        resources_by_patient AS (
          SELECT ER.*
          FROM "ExtractedResource" ER
          ${input.filter?.patientId
            ? Prisma.sql`
            JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
            JOIN "Visit" V ON V.id = RR."visitId"
            JOIN "Patient" P ON P.id = V."patientId"
            WHERE P.id = ${input.filter.patientId}
            `
            : Prisma.empty}
        ),
        filtered_resources AS (
          SELECT 
            RBP.*, 
            RIS."status",
            RIS."comment"
          FROM 
            resources_by_patient RBP
            JOIN resources_in_session RIS ON RBP.id = RIS."extractedResourceId"
        ),
        user_approval as (
          SELECT 
           ua."approvalModuleUniqueId",
           ua."isNextApprover",
           ua."isCurrApprover",
           CASE WHEN (max(ua."approvalLevel") = '1' AND max(ua."createdBy") = ${userId} and max(ua."approvalStatusId")='2')
           THEN TRUE  ELSE ua."isReSubmitApprover" END as "isReSubmitApprover",
           CASE WHEN max(subquery."maxApproval") = MAX(CASE WHEN ua."isNextApprover" THEN ua."approvalLevel" END) THEN TRUE ELSE FALSE END as "isFinalApproval"
           FROM "UserApproval" ua 
            LEFT JOIN (
                SELECT 
                    MAX(am."approvalLevel") as "maxApproval", 
                    am."sessionId"
                FROM "ApprovalMatrix" am 
                WHERE am."sessionId" = ${input.filter.cESessionId} AND am."isActive" = true
                GROUP BY am."sessionId"
            ) subquery ON ua."sessionId" = subquery."sessionId"
            WHERE ua."sessionId" = ${input.filter.cESessionId}
            AND (ua."approvalUserId" = ${userId}  OR ua."createdBy" = ${userId} AND ua."approvalLevel" = '1' and ua."approvalStatusId"='2')
            AND (ua."isNextApprover" = true OR ua."isReSubmitApprover" = true OR (ua."createdBy" = ${userId} AND ua."approvalLevel" = '1' and ua."approvalStatusId"='2'))
          GROUP BY ua."approvalModuleUniqueId", ua."isNextApprover", ua."isCurrApprover", ua."isReSubmitApprover"
        ),
        current_approval_level as (
        	select 
        		ua."approvalModuleUniqueId",
        		max(ua."approvalLevel") as "approvalLevel"
        	from "UserApproval" ua
        	where ua."sessionId" = ${input.filter.cESessionId} and (ua."isNextApprover" = true or ua."isReSubmitApprover" = true)
        	group by ua."approvalModuleUniqueId"
        )
      SELECT 
        FR.*,
        UA."approvalModuleUniqueId",
        CUA."approvalLevel",
        COALESCE(UA."isNextApprover",false) AS "isNextApprover",
        COALESCE(UA."isFinalApproval",false) AS "isFinalApproval",
        COALESCE(UA."isCurrApprover",false) AS "isCurrApprover",
        COALESCE(UA."isReSubmitApprover",false) AS "isReSubmitApprover"
      FROM 
      filtered_resources FR
        ${ input.filter.isApproved ? 
          Prisma.sql` 
            JOIN user_approval UA ON FR."id" = UA."approvalModuleUniqueId" 
            LEFT JOIN current_approval_level CUA on FR."id" = CUA."approvalModuleUniqueId" 
          ` :
          Prisma.sql` 
            LEFT JOIN user_approval UA ON FR."id" = UA."approvalModuleUniqueId" 
            LEFT JOIN current_approval_level CUA on FR."id" = CUA."approvalModuleUniqueId" 
          `
        }
      ORDER BY FR.id
      LIMIT ${input.limit} OFFSET ${input.offset}
    `
    const data = await db.$queryRaw<(ExtractedResource & { comment: string, labelIds: string[]; status: ExtractedResourceStatus; isNextApprover : boolean; isFinalApproval : boolean; isCurrApprover : boolean; isReSubmitApprover: boolean, approvalLevel: string})[]>(
      query,
    )
    return data
  }

  static async listExtractedResourcesTotalCount(input: CESessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const totalQuery = Prisma.sql`
      select COUNT(*) from (
        SELECT ERCES."extractedResourceId"
        FROM "ExtractedResourcesInCESessions" ERCES
        ${input.filter?.patientId ? 
          Prisma.sql`
            join "ExtractedResource" ER on ER.id = ERCES."extractedResourceId"
            JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
            JOIN "Visit" V ON V.id = RR."visitId"
            JOIN "Patient" P ON P.id = V."patientId"
          ` : Prisma.empty}
        ${input.filter.isApproved ? Prisma.sql` JOIN "UserApproval" UA ON ERCES."extractedResourceId" = UA."approvalModuleUniqueId" ` : Prisma.sql` `}
        WHERE ERCES."cESessionId" = ${input.filter.cESessionId}
        ${input.filter?.status ? Prisma.sql`AND ERCES.status::text = ${input.filter.status}` : Prisma.empty}
        GROUP BY ERCES."extractedResourceId"
      ) res
    `
    const totalCount = await db.$queryRaw<{count: number | null}[]>(totalQuery)
    return totalCount
  }

  static async structureData(input: CESessionStructureInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const structureArgs = Prisma.validator<Prisma.StructureGroupInCESessionsFindManyArgs>()({
      select: {
        structureGroups:  {
          select: {
              id: true,
              name: true,
              StructureInStructureGroup:{
                select: {
                  id: true,
                  name: true
                }
              }
          }
        },
      },
      where: {
        cESessionId : input.filter.cESessionId
      }
    })
    
    const data = await this.structureGroupInCESessionsRepository().findMany(structureArgs)

    const structureDataArgs = Prisma.validator<Prisma.StructureDataInCESessionsFindManyArgs>()({
      select: {
        structureInStructureGroup: {
          select: {
            id: true
          }
        }
      },
      where: {
        cESessionId : input.filter.cESessionId,
        extractedResourceId: input.filter.extractedResourcesId,
        deletedAt: null
      }
    })
    
    const structureData = await this.structureDataInCESessionsRepository().findMany(structureDataArgs)
    
    const structureInStructureGroupIds = structureData.map((d) => {
      return d.structureInStructureGroup.id
    })

    data.forEach((d) => {
      d.structureGroups.StructureInStructureGroup.forEach((e) => {
        if (structureInStructureGroupIds.includes(e.id)) {
          e.selected = true
        } else {
          e.selected = false
        }
      })
    })

    return data;
  }

  static async updateComment(input: CESessionStructureCommentInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    
    const query = Prisma.sql`
      update "ExtractedResourcesInCESessions" erid
      set comment = ${input.comment}
      where erid."cESessionId" = ${input.cESessionId} and erid."extractedResourceId" = ${input.extractedResourcesId}
    `
    const result = await db.$queryRaw(query)
    return true;
  }

  static async submitManyExtractedResources(input: CESessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return db.$transaction(input.extractedResources.map((resource) => {
      
      const args = Prisma.validator<Prisma.ExtractedResourcesInCESessionsUpdateArgs>()({
        where: {
          extractedResourceId_cESessionId: {
            cESessionId: input.cESessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          status: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW',
          cESession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      if(resource.isReSubmit == true){
        let resubmit =  this.approvalModuleRepository().resubmitApproval(input.cESessionId,resource.id,userId)
      } else if(resource.status == "IN_REVIEW"){
        let insertApproval = this.approvalModuleRepository().insertDynamicModifyApproval(input.cESessionId,resource.id,userId)
      }
      return this.cESessionRepository().updateExtractedResource(args)
    }) as any)
  }

  static async rejectManyExtractedResources(input: CESessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return db.$transaction(input.extractedResources.map((resource) => {
      const args = Prisma.validator<Prisma.ExtractedResourcesInCESessionsUpdateArgs>()({
        where: {
          extractedResourceId_cESessionId: {
            cESessionId: input.cESessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          status: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW',
          cESession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      if(resource.isReSubmit == true){
        let resubmit =  this.approvalModuleRepository().resubmitApproval(input.cESessionId,resource.id,userId)
      } else if(resource.status == "REJECTED" || resource.status == "ACCEPTED"){
        let UpdateApproval =  this.approvalModuleRepository().updateApproval(input.cESessionId,resource.id,userId,resource.status)
      }
      return this.cESessionRepository().updateExtractedResource(args)
    }) as any)
  }

  static async acceptManyExtractedResources(input: CESessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return db.$transaction(input.extractedResources.map((resource) => {
      console.log((resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW');
      const args = Prisma.validator<Prisma.ExtractedResourcesInCESessionsUpdateArgs>()({
        where: {
          extractedResourceId_cESessionId: {
            cESessionId: input.cESessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          status: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW',
          cESession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      if(resource.isReSubmit == true){
        let resubmit =  this.approvalModuleRepository().resubmitApproval(input.cESessionId,resource.id,userId)
      } else if(resource.status == "REJECTED" || resource.status == "ACCEPTED"){
        let UpdateApproval =  this.approvalModuleRepository().updateApproval(input.cESessionId,resource.id,userId,resource.status)
      }
      return this.cESessionRepository().updateExtractedResource(args)
    }) as any)
  }
  
  static async saveStructures(input: CESessionSaveStructuresInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    
    console.log(input);

    const deleteQuery = Prisma.sql`UPDATE "StructureDataInCESessions" SET "deletedAt" = ${Prisma.sql`current_timestamp`} WHERE "cESessionId" = ${input.cESessionId} and "extractedResourceId" = ${input.extractedResourcesId} and "deletedAt" is null`
    await db.$executeRaw(deleteQuery)

    const data = [];
    input.structures.forEach((d) => {
      data.push([Prisma.sql`gen_random_uuid()`, input.cESessionId, input.extractedResourcesId, d, userId, userId, Prisma.sql`CURRENT_TIMESTAMP`])
    })

    const insertQuery = Prisma.sql`
      INSERT INTO "StructureDataInCESessions" ("id", "cESessionId", "extractedResourceId", "structureInStructureGroupId", "createdBy", "updatedBy", "updatedAt")
      VALUES ${Prisma.join(
        data.map((row) => Prisma.sql`(${Prisma.join(row)})`)
      )}
      ON CONFLICT DO NOTHING;
    `
    
    return await db.$executeRaw(insertQuery);
  }

  static async listExtractedResourcesStatusCount(input: CESessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const statusCountQuery = Prisma.sql`
      select 
        eric.status, COUNT(*)
      from "ExtractedResourcesInCESessions" eric
      where "cESessionId" = ${input.filter.cESessionId}
      group by eric.status
    `
    const statusCount = await db.$queryRaw<{ statusCountQuery: number | null}[]>(statusCountQuery)
    const response = {
      'IN_REVIEW': 0,
      'ACCEPTED': 0,
      'PENDING': 0,
      'REJECTED': 0
    }
    statusCount.forEach((d) => {
      response[d.status] = Number(d.count)
    })
    return response
  }
}
