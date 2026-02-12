import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { TOKEN, resolve } from '../di'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import type { ProjectCreateSingleInput, ProjectDeleteSingleInput, ProjectFindManyInput, ProjectFindSingleInput, ProjectUpdateSingleInput } from '../trpc/routers/project'
import { db } from '../infrastructures/database'
import { DateTime } from 'luxon'
import { Auth0Service } from './auth0.service'

export class ProjectService {
  static readonly projectRepository = resolve(TOKEN.projectRepository)

  static async findMany(input: ProjectFindManyInput, canViewAll: boolean, userId: string) {
    try {
    const findGroupIdArg = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where : {
        usersInGroup : {
          some : {
            userId : userId
          }
        }
      },
      select : {
        id : true
      }
    })
    const groupIdOfUser = db.userGroup.findMany(findGroupIdArg);
    const args = Prisma.validator<Prisma.ProjectFindManyArgs>()({
      where: {
        ...input.filter,
          OR : canViewAll
          ? undefined
          : [
            {
              users: canViewAll
              ? undefined
              : { some: { userId } },
            },{
              UserGroupInProjects: {
                some: {
                  userGroupId: {
                    in: (await groupIdOfUser).map(d => d.id)
                  }
                }
              }
            }
          ],
        deletedAt : null,
        epic : {
          is : {
            deletedAt: null
          }
        },
        // AND: [
        //   {
        //     OR: input.search
        //       ? [
        //           { name: { contains: input.search , mode: 'insensitive' } },
        //           { description: { contains: input.search , mode: 'insensitive'} }
        //         ]
        //       : [],
        //   },
        // ]
      },
      include: {
        epic: {
          select: {
            name: true
          }
        },
        UserGroupInProjects: {
          where : {
            deletedAt : null
          },
          select : {
            projectId : true,
            userGroupId : true
          }
        }
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })
    const findEpicArgs = Prisma.validator<Prisma.EpicFindUniqueArgs>()({
      where: {
        id: input.filter.epicId,
      },
      select : {
        name : true
      }
    })
    const countArgs = Prisma.validator<Prisma.ProjectCountArgs>()({
      where: {
        ...input?.filter,
        OR : canViewAll
          ? undefined
          : [
            {
              users: canViewAll
              ? undefined
              : { some: { userId } },
            },{
              UserGroupInProjects: {
                some: {
                  userGroupId: {
                    in: (await groupIdOfUser).map(d => d.id)
                  }
                }
              }
            }
        ],
        deletedAt : null,
        epic : {
          is : {
            deletedAt: null
          }
        }
      }
    })

      return await Promise.all([
      this.projectRepository().findMany(args),
      this.projectRepository().count(countArgs),
      db.epic.findUnique(findEpicArgs)
    ])
    } catch (error) {
      throw handlePrismaReadError(error, 'Project', 'findMany')
    }
  }

  static async find(input: ProjectFindSingleInput, canViewAll: boolean, userId: string) {
    try {
    const args = Prisma.validator<Prisma.ProjectFindUniqueArgs>()({
      where: {
        id: input,
      },
      include: {
        UserGroupInProjects: {
          where : {
            deletedAt : null
          },
          select: {
            projectId: true,
            userGroupId: true
          }
        },
        epic : {
          select : {
            name : true
          }
        }
      }
    })
    const project: any = await this.projectRepository().findOne(args)

      if (!project) {
        throw new TRPCError({ 
          code: 'NOT_FOUND', 
          message: 'The project you are looking for does not exist.' 
        })
      }

    const updatedProject = {
      ...project,
      users: [
        ...project.users,
        ...project.UserGroupInProjects.map((group: any) => ({
          userId: group.userGroupId,
          projectId: group.projectId,
          userRole: group.userRole ? group.userRole : 'NORMAL'
        }))
      ],
      UserGroupInProjects: []
    };

    const usersInUserGroupArg = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where: {
        id: {
          in: updatedProject.users.filter((d: any) => !d.userId.includes('auth0')).map((d: any) => d.userId)
        }
      },
      select: {
        usersInGroup: {
          select: {
            userId: true
          },
          where: {
            deletedAt: null
          }
        }
      }
    })
    const usersInUserGroup = await db.userGroup.findMany(usersInUserGroupArg);
    let userIds = usersInUserGroup.flatMap((d: any) => {
      return d.usersInGroup.map((e: any)=>e.userId);
    })
    if (canViewAll || userIds.includes(userId) || updatedProject.users.map((d: any) => d.userId).includes(userId)) {
      return updatedProject
    } else {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw handlePrismaReadError(error, 'Project', 'find')
    }
  }

  static async create(input: ProjectCreateSingleInput, userId: string) {
    const groupList = input.users.filter((element) => !element.userId.includes('auth0'));
   
    const userList = input.users.filter((element:any) => element.userId.includes('auth0'));
    let FormattedGroup: any = []
 
    groupList.map((e:any)=>{
      FormattedGroup.push({
        userGroupId : e.userId,
        createdBy: userId,
        updatedBy: userId
      })
    })
    try {
    const args = Prisma.validator<Prisma.ProjectCreateArgs>()({
      data: {
        name: input.name,
        description: input.description,
        epicId: input.epicId,
        users: {
          createMany: {
            data: userList,
          },
        },
        UserGroupInProjects: {
          createMany: {
            data : FormattedGroup
          }
        }
      },
      select: {
        id: true,
      },
    })

      return await this.projectRepository().create(args)
    } catch (error) {
      throw handlePrismaError(error, 'Project', input, { action: 'create' })
    }
  }

  static async update(input: ProjectUpdateSingleInput, userId: string) {
    let removedAssigneeIds: string[] = [];
    
    // Check if user removal confirmation is required
    if(!input.confirmUserRemoval) {
      const confirmationCheck = await this.checkUserAndGroupRemovalConfirmation(input);
      
      if (confirmationCheck?.confirmUserRemoval) {
        return confirmationCheck;
      }
    }

    // If confirmation is provided, get the list of users to remove BEFORE updating project
    if (input.confirmUserRemoval) {
      const confirmationCheck = await this.checkUserAndGroupRemovalConfirmation(input);
      
      // Check if either users or groups are being removed
      if ((confirmationCheck?.removedAssigneeIds && confirmationCheck.removedAssigneeIds.length > 0) ||
          (confirmationCheck?.removedGroupAssigneeIds && confirmationCheck.removedGroupAssigneeIds.length > 0)) {
        
        if (confirmationCheck?.removedAssigneeIds) {
          removedAssigneeIds = confirmationCheck.removedAssigneeIds;
        }
        
        // FIRST: Remove users and groups from sessions
        await this.removeUserAndGroupFromSession(
          input, 
          confirmationCheck.removedAssigneeIds, 
          confirmationCheck.removedGroupAssigneeIds
        );
      }
    }

    const groupList = input.users?.filter((element) => !element.userId.includes('auth0'));
    const userList = input.users?.filter((element: any) => element.userId.includes('auth0'));
    let FormattedGroup: any = [];

    groupList?.map((e: any) => {
      FormattedGroup.push({
        userGroupId: e.userId,
        createdBy: userId,
        updatedBy: userId
      })
    });

    const args = Prisma.validator<Prisma.ProjectUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
        epicId: input.epicId,
        users: userList
          ? {
              deleteMany: {},
              createMany: {
                data: userList,
              },
            }
          : undefined,
        UserGroupInProjects: FormattedGroup
          ? {
              updateMany: {
                where: {
                  projectId: input.id
                },
                data: {
                  deletedAt: DateTime.now().toJSDate()
                }
              },
              createMany: {
                data: FormattedGroup,
              },
            }
          : undefined,
      },
    })

    // SECOND: Update the project after session cleanup
    try {
    const updatedProject = await this.projectRepository().update(args);
    return updatedProject;
    } catch (error) {
      throw handlePrismaError(error, 'Project', input, { action: 'update' })
    }
  }

  static async checkUserAndGroupRemovalConfirmation(input: ProjectUpdateSingleInput) {
    // Check current project assignments
    const isAssingedUserToProject = await db.usersInProjects.findMany({
      where: {
        projectId: {
          in: [input.id]
        }
      }
    });

    const isAssignedGroupToProject = await db.userGroupInProjects.findMany({
      where: {
        projectId: {
          in: [input.id]
        },
        deletedAt: null
      }
    });


    const isSessionAvailableInProject = await db.dLSession.findMany({
      select: {
        id: true
      },
      where: {
        projectId: {
          in: [input.id]
        },
        deletedAt: null
      }
    });


    const isAssignedGroupToSession = await db.userGroupInDLSessions.findMany({
      where: {
        userGroupId: {
          in: isAssignedGroupToProject.map(u => u.userGroupId)
        },
        dLSessionId: {
          in: isSessionAvailableInProject.map(u => u.id)
        },
        deletedAt: null
      }
    });


    // Filter out group users and get only auth0 users
    const userList = input.users?.filter((element: any) => element.userId.includes('auth0'));
    const groupList = input.users?.filter((element: any) => !element.userId.includes('auth0')); // Add this back
    
    // Get current and new assignee IDs
    const newAssigneeIds = userList?.map(u => u.userId);
    const newGroupIds = groupList?.map(u => u.userId); // Add this back
    const dbCurrentAssigneeIds = isAssingedUserToProject?.map(u => u.userId);
    const dbCurrentGroupAssigneeIds = isAssignedGroupToProject?.map(u => u.userGroupId);
    
    
    // Find removed assignees (individual users)
    const removedAssigneeIds = dbCurrentAssigneeIds?.filter(id => !newAssigneeIds?.includes(id));

    // Find removed groups (compare group IDs with group IDs)
    const removedGroupAssigneeIds = dbCurrentGroupAssigneeIds?.filter(id => !newGroupIds?.includes(id));


          // Check if either users or groups are being removed
      if ((removedAssigneeIds?.length && removedAssigneeIds?.length > 0) || 
          (removedGroupAssigneeIds?.length && removedGroupAssigneeIds?.length > 0)) {
        
        // Only call Auth0 if there are actual users to fetch
        let removedUsers = [];
        if (removedAssigneeIds && removedAssigneeIds.length > 0) {
          removedUsers = await Auth0Service.findMany({
            searchQuery: {
              userIds: removedAssigneeIds
            }
          });
        }

        // Get session counts for both users and groups
        const userSessionCounts = await this.getUserAndGroupSessionCounts(
          removedAssigneeIds || [], 
          input.id, 
          removedGroupAssigneeIds || []
        );

        return {
          confirmUserRemoval: true,
          userSessionCounts: userSessionCounts,
          currentAssigneeIds: dbCurrentAssigneeIds,
          removedAssigneeIds: removedAssigneeIds || [],
          removedGroupAssigneeIds: removedGroupAssigneeIds || []
        };
      }

    // No confirmation needed
    return {
      confirmUserRemoval: false,
      removedAssigneeIds: [],
      currentAssigneeIds: [],
      removedUsers: [],
      userSessionCounts: []
    };
  }

  /**
   * Get individual session counts for specific users on a project
   * @param userIds - Array of user IDs to check
   * @param projectId - The project ID
   * @returns Array of user session counts with names
   */
  static async getUserAndGroupSessionCounts(userIds: string[], projectId: string, groupIds: string[]) {


    // Early return if no users or groups to check
    if ((!userIds || userIds.length === 0) && (!groupIds || groupIds.length === 0)) {
      return [];
    }

    // Get all sessions for the project
    const projectSessions = await db.dLSession.findMany({
      select: {
        id: true
      },
      where: {
        projectId: projectId,
        deletedAt: null
      }
    });

    const sessionIds = projectSessions.map(s => s.id);

    const result = [];

    // Only process users if there are any
    if (userIds && userIds.length > 0) {
      // Get user session assignments
      const userSessionAssignments = await db.usersInDLSessions.findMany({
        where: {
          userId: {
            in: userIds
          },
          dLSessionId: {
            in: sessionIds
          },
        },
        select: {
          userId: true,
          dLSessionId: true
        }
      });

      // Get user details from Auth0
      const userDetails = await Auth0Service.findMany({
        searchQuery: {
          userIds: userIds
        }
      });

      // Add user session counts
      for (const userId of userIds) {
        const userSessionCount = userSessionAssignments.filter(assignment => assignment.userId === userId).length;
        const userInfo = userDetails.find((user: any) => user.user_id === userId);
        
        result.push({
          type: 'user',
          id: userId,
          name: userInfo ? userInfo.email : 'Unknown User',
          sessionCount: userSessionCount
        });
      }
    }

    // Only process groups if there are any
    if (groupIds && groupIds.length > 0) {
      // Get group session assignments
      const groupSessions = await db.userGroupInDLSessions.findMany({
        where: {
          userGroupId: {
            in: groupIds
          },
          dLSessionId: {
            in: sessionIds
          },
          deletedAt: null
        },
        select: {
          userGroupId: true,
          dLSessionId: true
        }
      });

      // Get group details from userGroup table (not Auth0)
      const groupDetails = await db.userGroup.findMany({
        where: {
          id: {
            in: groupIds
          }
        },
        select: {
          id: true,
          groupName: true
        }
      });

      // Add group session counts
      for (const groupId of groupIds) {
        const groupSessionCount = groupSessions.filter(assignment => assignment.userGroupId === groupId).length;
        const groupInfo = groupDetails.find(group => group.id === groupId);
        
        result.push({
          type: 'group',
          id: groupId,
          name: groupInfo ? groupInfo.groupName : 'Unknown Group',
          sessionCount: groupSessionCount
        });
      }
    }

    return result;
  }

  static async delete(input: ProjectDeleteSingleInput) {
    try {
    const args = Prisma.validator<Prisma.ProjectUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        deletedAt: input.deletedAt
      }
    })
      return await this.projectRepository().update(args)
    } catch (error) {
      throw handlePrismaError(error, 'Project', undefined, { action: 'delete' })
    }
  }

  static async removeUserAndGroupFromSession(input: ProjectUpdateSingleInput, userIds?: string[], groupIds?: string[]) {
    try {
      const projectSessions = await db.dLSession.findMany({
        select: {
          id: true,
        },
        where: {
          projectId: input.id
        }
      });

      // Remove users from DL sessions with single bulk operation
      if (projectSessions.length > 0 && userIds && userIds?.length > 0) {
        await db.usersInDLSessions.deleteMany({
          where: {
            dLSessionId: { in: projectSessions.map(s => s.id) },
            userId: { in: userIds }
          }
        });
      }

      if(projectSessions.length > 0 && groupIds && groupIds?.length > 0) {
        await db.userGroupInDLSessions.updateMany({
          where: {
            dLSessionId: { in: projectSessions.map(s => s.id) },
            userGroupId: { in: groupIds }
          },
          data: {
            deletedAt: DateTime.now().toJSDate()
          }
        });
      }

      return {
        success: true,
        removedFromDLSessions: projectSessions.length > 0,
        totalSessionsAffected: projectSessions.length,
        message: `Users removed from ${projectSessions.length} DL sessions`
      };
    } catch (error) {
      throw handlePrismaReadError(error, 'Project', 'findMany')
    }
  }
}
