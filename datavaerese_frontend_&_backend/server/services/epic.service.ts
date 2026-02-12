import type { Epic } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import type { EpicCreateSingleInput, EpicDeleteSingleInput, EpicFindManyInput, EpicFindSingleInput, EpicUpdateSingleInput, SearchEpicFindManyInput } from '../trpc/routers/epic'
import { db } from '../infrastructures/database'

export class EpicService {
  static readonly epicRepository = resolve(TOKEN.epicRepository)

  static async findMany(input: EpicFindManyInput, canViewAll: boolean, userId: string): Promise<[Epic[], number]> {
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
    const args = Prisma.validator<Prisma.EpicFindManyArgs>()({
      where: {
        projects: canViewAll
          ? undefined
          : {
            some: {
              OR: [
                { users: { some: { userId } } },
                {
                  UserGroupInProjects: {
                    some: {
                      userGroupId: {
                        in: (await groupIdOfUser).map(d => d.id)
                      }
                    }
                  }
                }
              ]
            }
          },
        deletedAt : null,
        // AND: [
        //   {
        //     OR: input.search
        //       ? [
        //           { name: { contains: input.search , mode: 'insensitive' } },
        //           { description: { contains: input.search , mode: 'insensitive'} },
        //         ]
        //       : [],
        //   },
        // ],
      },
      orderBy: input.sort,
      skip: input.offset,
      take: input.limit,
    })

    const countArgs = Prisma.validator<Prisma.EpicFindManyArgs>()({
      where: {
        projects: canViewAll
          ? undefined
          : {
            some: {
              OR: [
                { users: { some: { userId } } },
                {
                  UserGroupInProjects: {
                    some: {
                      userGroupId: {
                        in: (await groupIdOfUser).map(d => d.id)
                      }
                    }
                  }
                }
              ]
            }
          },
        deletedAt : null,
      }
    })

      return await Promise.all([
      this.epicRepository().findMany(args),
      this.epicRepository().count(countArgs),
    ])
    } catch (error) {
      throw handlePrismaReadError(error, 'Epic', 'findMany')
    }
  }

  static async find(input: EpicFindSingleInput, canViewAll: boolean, userId: string) {
    try {
    const args = Prisma.validator<Prisma.EpicFindFirstArgs>()({
      where: {
        id: input,
        projects: canViewAll
          ? undefined
          : {
              some: {
                users: { some: { userId } },
              },
            },
      },
    })
      return await this.epicRepository().findOne(args)
    } catch (error) {
      throw handlePrismaReadError(error, 'Epic', 'find')
    }
  }

  static async create(input: EpicCreateSingleInput): Promise<Epic> {
    try {
    const args = Prisma.validator<Prisma.EpicCreateArgs>()({
      data: input,
    })
      return await this.epicRepository().create(args)
    } catch (error) {
      throw handlePrismaError(error, 'Epic', input, { action: 'create' })
    }
  }

  static async update(input: EpicUpdateSingleInput): Promise<Epic> {
    try {
    const args = Prisma.validator<Prisma.EpicUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: input,
    })
      return await this.epicRepository().update(args)
    } catch (error) {
      throw handlePrismaError(error, 'Epic', input, { action: 'update' })
    }
  }

  static async delete(input: EpicDeleteSingleInput): Promise<Epic> {
    try {
    const args = Prisma.validator<Prisma.EpicUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        deletedAt: input.deletedAt
      }
    })
      return await this.epicRepository().update(args)
    } catch (error) {
      throw handlePrismaError(error, 'Epic', undefined, { action: 'delete' })
    }
  }

  static async searchFindMany(input: SearchEpicFindManyInput, isEpicViewAll: boolean, isProjectViewAll: boolean, isSessionViewAll: boolean, userId: string) {
    try {
    if(!input.search){
      return [[],0]
    }
    
    const searchTerm = input.search.trim();
    
    if (searchTerm.length === 0) {
      return [[], 0];
    }
    
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
    const userGroupIds = groupIdOfUser.map(d => d.id);
    
    const sessionUserCondition = !isSessionViewAll ? {
      OR: [
        { users: { some: { userId } } },
        ...(userGroupIds.length > 0 ? [{
          UserGroupInDLSessions: {
            some: {
              userGroupId: { in: userGroupIds }
            }
          }
        }] : [])
      ]
    } : undefined;
    
    const projectSessionCondition = !isProjectViewAll ? {
      OR: [
        { users: { some: { userId } } },
        ...(userGroupIds.length > 0 ? [{
          UserGroupInProjects: {
            some: {
              userGroupId: { in: userGroupIds }
            }
          }
        }] : []),
        {
          dLSessions: {
            some: {
              deletedAt: null,
              ...sessionUserCondition
            }
          }
        }
      ]
    } : undefined;
    
    const epicProjectCondition = !isEpicViewAll ? {
      projects: {
        some: {
          deletedAt: null,
          ...projectSessionCondition
        }
      }
    } : undefined;
    
    const matchesSearchTerm = (text: string | null | undefined): boolean => {
      if (!text) return false;
      return text.toLowerCase().includes(searchTerm.toLowerCase());
    };
    
    // Build session assignment condition (always include assigned sessions, even if they don't match search)
    const sessionAssignmentCondition: Prisma.DLSessionWhereInput = {
      OR: [
        { users: { some: { userId } } },
        ...(userGroupIds.length > 0 ? [{
          UserGroupInDLSessions: {
            some: {
              deletedAt: null,
              userGroupId: { in: userGroupIds }
            }
          }
        }] : [])
      ]
    };

    // Build session where condition:
    // - If View All = YES: (matches search OR is assigned) - show all matches + assigned
    // - If View All = NO: ONLY assigned (search doesn't matter for unassigned - they're never shown)
    const sessionWhereCondition: Prisma.DLSessionWhereInput = isSessionViewAll ? {
      deletedAt: null,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        sessionAssignmentCondition
      ]
    } : {
      deletedAt: null,
      // NO View All: ONLY show assigned sessions (ignore search for unassigned items)
      ...sessionAssignmentCondition
    };

    // Build project assignment condition (always include assigned projects, even if they don't match search)
    const projectAssignmentCondition: Prisma.ProjectWhereInput = {
      OR: [
        { users: { some: { userId } } },
        ...(userGroupIds.length > 0 ? [{
          UserGroupInProjects: {
            some: {
              deletedAt: null,
              userGroupId: { in: userGroupIds }
            }
          }
        }] : [])
      ]
    };

    // Build project has assigned sessions condition
    const projectHasAssignedSessionsCondition: Prisma.ProjectWhereInput = {
      dLSessions: {
        some: {
          deletedAt: null,
          ...sessionAssignmentCondition
        }
      }
    };

    // Build project where condition:
    // - If View All = YES: (matches search OR has matching/assigned sessions OR is assigned)
    // - If View All = NO: (is assigned OR has assigned sessions) - search only applies to assigned items
    const projectWhereCondition: Prisma.ProjectWhereInput = isProjectViewAll ? {
      deletedAt: null,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        {
          dLSessions: {
            some: sessionWhereCondition
          }
        },
        projectAssignmentCondition
      ]
    } : {
      deletedAt: null,
      // NO View All: ONLY show assigned projects or projects with assigned sessions
      OR: [
        projectAssignmentCondition,
        projectHasAssignedSessionsCondition
      ]
    };

    // Build epic has assigned items condition
    const epicHasAssignedItemsCondition: Prisma.EpicWhereInput = {
      projects: {
        some: {
          deletedAt: null,
          OR: [
            projectAssignmentCondition,
            projectHasAssignedSessionsCondition
          ]
        }
      }
    };

    // Build epic where condition:
    // - If View All = YES: (matches search OR has matching/assigned projects)
    // - If View All = NO: (has assigned projects/sessions) - search only applies to assigned items
    const epicWhereCondition: Prisma.EpicWhereInput = isEpicViewAll ? {
      deletedAt: null,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        {
          projects: {
            some: projectWhereCondition
          }
        }
      ]
    } : {
      deletedAt: null,
      // NO View All: ONLY show epics with assigned projects/sessions
      ...epicHasAssignedItemsCondition
    };

    const epicArgs: Prisma.EpicFindManyArgs = {
      where: epicWhereCondition,
      include: {
        projects: {
          where: projectWhereCondition,
          include: {
            users: {
              where: {
                userId: userId
              },
              select: {
                userId: true
              }
            },
            UserGroupInProjects: {
              where: {
                deletedAt: null,
                userGroupId: { in: userGroupIds }
              },
              select: {
                userGroupId: true
              }
            },
            dLSessions: {
              where: sessionWhereCondition,
              include: {
                users: {
                  where: {
                    userId: userId
                  },
                  select: {
                    userId: true
                  }
                },
                UserGroupInDLSessions: {
                  where: {
                    deletedAt: null,
                    userGroupId: { in: userGroupIds }
                  },
                  select: {
                    userGroupId: true
                  }
                }
              }
            }
          }
        }
      }
    };
    
    const epics = await db.epic.findMany(epicArgs);
    
    const rawResults: any[] = [];
    
    for (const epic of epics) {
      const epicMatches = matchesSearchTerm(epic.name);
      const epicWithProjects = epic as any; // Type assertion for included relations
      
      // Check if user is directly assigned to any project in this epic
      const userAssignedToEpic = epicWithProjects.projects?.some((project: any) => 
        project.users?.length > 0 || project.UserGroupInProjects?.length > 0
      ) || false;
      
      for (const project of epicWithProjects.projects || []) {
        const projectMatches = matchesSearchTerm(project.name);
        const userAssignedToProject = (project.users?.length > 0) || (project.UserGroupInProjects?.length > 0);
        
        for (const session of project.dLSessions || []) {
          const sessionMatches = matchesSearchTerm(session.name);
          const userAssignedToSession = (session.users?.length > 0) || (session.UserGroupInDLSessions?.length > 0);
          
          if (epicMatches || projectMatches || sessionMatches) {
            rawResults.push({
              id: epic.id,
              name: epic.name,
              projectId: project.id,
              projectName: project.name,
              sessionId: session.id,
              sessionName: session.name,
              userAssignedToEpic,
              userAssignedToProject,
              userAssignedToSession
            });
          }
        }
        
        if (projectMatches && (!project.dLSessions || project.dLSessions.length === 0)) {
          rawResults.push({
            id: epic.id,
            name: epic.name,
            projectId: project.id,
            projectName: project.name,
            sessionId: null,
            sessionName: null,
            userAssignedToEpic,
            userAssignedToProject,
            userAssignedToSession: false
          });
        }
      }
      
      if (epicMatches && (!epicWithProjects.projects || epicWithProjects.projects.length === 0)) {
        rawResults.push({
          id: epic.id,
          name: epic.name,
          projectId: null,
          projectName: null,
          sessionId: null,
          sessionName: null,
          userAssignedToEpic: false,
          userAssignedToProject: false,
          userAssignedToSession: false
        });
      }
    }
    
    const keys = input.sort ? Object.keys(input.sort[0]) : [];
    const values = input.sort ? Object.values(input.sort[0]) : [];
    const sortField = keys[0] || 'name';
    const sortOrder = values[0] || 'asc';
    
    rawResults.sort((a, b) => {
      let aValue: string;
      let bValue: string;
      
      if (sortField === 'name') {
        aValue = a.name || '';
        bValue = b.name || '';
      } else if (sortField === 'projectName') {
        aValue = a.projectName || '';
        bValue = b.projectName || '';
      } else {
        aValue = a.sessionName || '';
        bValue = b.sessionName || '';
      }
      
      const comparison = aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    const epicMap = new Map<string, any>();
    
    for (const row of rawResults) {
      if (!epicMap.has(row.id)) {
        epicMap.set(row.id, {
          id: row.id,
          name: row.name,
          userAssignedToEpic: row.userAssignedToEpic,
          projects: new Map()
        });
      }
      
      const epic = epicMap.get(row.id);
      
      if (row.projectId) {
        if (!epic.projects.has(row.projectId)) {
          epic.projects.set(row.projectId, {
            id: row.projectId,
            name: row.projectName,
            userAssignedToProject: row.userAssignedToProject,
            dLSessions: []
          });
        }
        
        const project = epic.projects.get(row.projectId);
        
        if (row.sessionId) {
          // Check if session already added
          if (!project.dLSessions.find((s: any) => s.id === row.sessionId)) {
            project.dLSessions.push({
              id: row.sessionId,
              name: row.sessionName,
              userAssignedToSession: row.userAssignedToSession
            });
          }
        }
      }
    }
    
    // Convert Maps to arrays
    const epicData = Array.from(epicMap.values()).map(epic => ({
      ...epic,
      projects: Array.from(epic.projects.values())
    }));
    
    // Transform results to match expected format with simpler permission-based logic
    const transformData = (data: any) =>
      data.map((epic: any) => {
        // If epic has accessible projects
        if (epic.projects && epic.projects.length > 0) {
          const projectResults = epic.projects.map((project: any) => {
            // If project has accessible sessions
            if (project.dLSessions && project.dLSessions.length > 0) {
              return project.dLSessions.map((session: any) => {
                // Check if user is assigned to this session (direct or via group)
                const userHasSessionAccess = !isSessionViewAll 
                  ? (session.userAssignedToSession || false)
                  : true;
                
                return {
                  id: epic.id,
                  name: isEpicViewAll ? epic.name : (userHasSessionAccess ? epic.name : ""), // Show epic name if has permission OR user assigned to this session
                  projectId: project.id,
                  projectName: isProjectViewAll ? project.name : (userHasSessionAccess ? project.name : ""), // Show project name if has permission OR user assigned to this session
                  sessionId: session.id,
                  sessionName: session.name, // Always show session name when accessible
                };
              });
            } else {
              // Project exists but no accessible sessions
              // Show project-only row if user has project permission or is assigned
              if (isProjectViewAll || project.userAssignedToProject) {
                return [{
                  id: epic.id,
                  name: isEpicViewAll ? epic.name : (project.userAssignedToProject ? epic.name : ""), // Show epic name only if has epic permission or project assignment
                  projectId: project.id,
                  projectName: project.name, // Show project name since user has project permission or assignment
                  sessionId: "",
                  sessionName: "",
                }];
              } else {
                // User doesn't have project permission and no accessible sessions
                return [];
              }
            }
          }).flat();
          
          // If we got project results, return them
          if (projectResults.length > 0) {
            return projectResults;
          } else {
            // No accessible projects/sessions, but if user has epic permission or assignment, show epic-only row
            if (isEpicViewAll || epic.userAssignedToEpic) {
              return [{
                id: epic.id,
                name: epic.name, // Show epic name since user has epic permission or assignment
                projectId: "",
                projectName: "",
                sessionId: "",
                sessionName: "",
              }];
            } else {
              return [];
            }
          }
        } else {
          // Epic has no projects at all
          // Show epic-only row if user has epic permission or assignment
          if (isEpicViewAll || epic.userAssignedToEpic) {
            return [{
              id: epic.id,
              name: epic.name, // Show epic name since user has epic permission or assignment
              projectId: "",
              projectName: "",
              sessionId: "",
              sessionName: "",
            }];
          } else {
            return [];
          }
        }
      }).flat();
  
    const result = transformData(epicData);
  
    return [result, result.length];
    } catch (error) {
      throw handlePrismaReadError(error, 'Epic', 'search')
    }
  }
}