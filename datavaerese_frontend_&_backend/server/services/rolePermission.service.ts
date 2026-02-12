
import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { RolePermissionFindManyInput } from '../trpc/routers/rolePermission'
import { TRPCError } from '@trpc/server'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import { db } from '../infrastructures/database'
import { DateTime } from 'luxon'

export class RolePermissionService {
  static readonly rolePermissionRepository = resolve(TOKEN.rolePermissionRepository)

  static async findMany(input?: RolePermissionFindManyInput) {
    const args = Prisma.validator<Prisma.UserRolesFindManyArgs>()({
      where: {
        deletedAt: null,
        ...(input?.search
          ? {
              OR: [
                { name: { contains: input.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })

    return Promise.all([
      this.rolePermissionRepository().findMany(args),
      this.rolePermissionRepository().count(),
    ])
  }

  static async create(input: any, userId: string) {
    try {
    const args = Prisma.validator<Prisma.RoleModuleActionMappingCreateArgs>()({
      data: input,
    })
      return await this.rolePermissionRepository().create(args, userId)
    } catch (error) {
      throw handlePrismaError(error, 'Role', input, { action: 'create' })
    }
  }

  static async update(input: any, userId: string) {
    try {
    const updateargs = Prisma.validator<Prisma.RoleModuleActionMappingUpdateArgs>()({
      where: {
        id: input.id
      },
      data: input,
    })
      return await this.rolePermissionRepository().update(updateargs, userId)
    } catch (error) {
      throw handlePrismaError(error, 'Role', input, { action: 'update' })
    }
  }

  static async find(input: any) {
    try {
    const args = Prisma.validator<Prisma.UserRolesFindManyArgs>()({
      select: {
        id: true,
        name: true,
        RoleModuleActionMapping: {
          select : {
            ModuleActionMapping: {
              select : {
                Modules : {
                  select : {
                    id : true,
                    name : true
                  }
                },
                Actions : {
                  select : {
                    id : true,
                    name : true
                  }
                }
              }
            }
          },
          where : {
            deletedAt : null
          }
        }
      },
      where: {
        id: input.roleId,
      },
    })
      return await this.rolePermissionRepository().findOne(args)
    } catch (error) {
      throw handlePrismaReadError(error, 'Role', 'find')
    }
  }


  static async findModuleActions(input?: any) {
    try {
    const args = Prisma.validator<Prisma.ModuleActionMappingFindManyArgs>()({
      where: {
        deletedAt : null
      },
      select: {
        Modules: {
          select : {
            id: true,
            name: true
          }
        },
        Actions : {
          select : {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { moduleId: 'asc' },
        { actionId: 'asc' },
      ]
    })
      return await this.rolePermissionRepository().findModuleActions(args)
    } catch (error) {
      throw handlePrismaReadError(error, 'Role', 'findMany')
    }
  }

  static async roleList(isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const taxonomies = await db.userRoles.findMany();
    return taxonomies;
    } catch (error) {
      throw handlePrismaReadError(error, 'Role', 'findMany')
    }
  }

  static async getRolePermission(input: any, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const uniqueargs = Prisma.validator<Prisma.UserRoleMappingFindManyArgs>()({
      where: {
        userId: userId,
        deletedAt: null
      },
      select : {
        roleId: true
      }

    })

    const uniqueArgs = await db.userRoleMapping.findMany(uniqueargs)

    
    const args = Prisma.validator<Prisma.RoleModuleActionMappingFindManyArgs>()({
      where: {
        roleId:{
          in: uniqueArgs?.map((e)=> e.roleId),
        },
        deletedAt: null
      },
      select : {
        ModuleActionMapping: {
          select: {
            moduleId: true,
            actionId: true
          }
        }
      }
    })

      const  rolePermission =  await this.rolePermissionRepository().getRolePermission(args);
    return rolePermission;
    } catch (error) {
      throw handlePrismaReadError(error, 'Role', 'findMany')
    }
  }

  static async userRoleMappinglist(input: any, isAdmin: boolean, userId: string) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

      const args = Prisma.validator<Prisma.UserRoleMappingFindManyArgs>()({
        where: {
          deletedAt: null
        },
        distinct: ['userId'],
        select : {
          id: true,
          updatedAt: true,
          createdAt: true,
          userId: true,
          UserRoles: {
            select : {
              id: true,
              name: true,
              RoleModuleActionMapping: {
                distinct: ['moduleActionMappingId'],
                select : {
                  ModuleActionMapping: {
                    select : {
                      Modules:{
                        select : {
                          id: true,
                          name: true
                        }
                      },
                      Actions: {
                        select : {
                          id: true,
                          name: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      const results = await db.userRoleMapping.findMany(args);

      const groupedResults = results.reduce((acc, item) => {
         // Prepare UserRoles with optimized viewPermissions
        const roleViewPermissions = item.UserRoles.RoleModuleActionMapping.reduce((permissionsMap, curr) => {
          const moduleId = curr.ModuleActionMapping.Modules.id;

          if (!permissionsMap[moduleId]) {
            permissionsMap[moduleId] = {
              Module: curr.ModuleActionMapping.Modules,
              Actions: new Set()
            };
          }
          permissionsMap[moduleId].Actions.add(curr.ModuleActionMapping.Actions);

          return permissionsMap;
        }, {});

        if (!acc[item.userId]) {
          acc[item.userId] = {
            id: item.id,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            userId: item.userId,
            UserRoles: [],
            viewPermissions:  Object.values(roleViewPermissions).map(permission => ({
              Module: permission.Module,
              Actions: Array.from(permission.Actions)
            }))
          };
        }

        acc[item.userId].UserRoles.push({
          id: item.UserRoles.id,
          name: item.UserRoles.name
        });

        return acc;
      }, {});

      const transformedResults = Object.values(groupedResults);

      return transformedResults
  }

  static async updateUserRoleMappinglist(input: any, isAdmin: boolean, userId: string) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    try {
    await db.userRoleMapping.updateMany({
      where: {
        userId: input.userId
      },
      data: {
        deletedAt: DateTime.now().toJSDate()
      }
    });
  
    const newRoleMappings = input.roleId.map((roleId: string) => ({
      userId: input.userId,
      roleId: roleId,
      createdBy: userId,
      updatedBy: userId
    }));
  
    await db.userRoleMapping.createMany({
      data: newRoleMappings
    });

      return { success: true };
    } catch (error) {
      throw handlePrismaError(error, 'Role', input, { action: 'update' })
    }
  }
}