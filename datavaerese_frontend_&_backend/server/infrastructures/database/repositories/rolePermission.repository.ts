import { Prisma } from '@prisma/client'
import type { ModuleActionMapping, PrismaPromise, RoleModuleActionMapping, UserRoles } from '@prisma/client'
import { db } from '..'
import { DateTime } from 'luxon'

export interface IRolePermissionRepository {
  findMany(args?: Prisma.UserRolesFindManyArgs): Promise<UserRoles[]>
  create(args: Prisma.RoleModuleActionMappingCreateArgs, userId: string): Promise<{ id: string }>
  update(args: Prisma.RoleModuleActionMappingUpdateArgs, userId: string): Promise<{ id: string }>
  count(args?: Prisma.UserRolesCountArgs): Promise<number>
  findOne(args?: any): Promise<UserRoles[]>
  findModuleActions(args?: Prisma.ModuleActionMappingFindManyArgs): Promise<ModuleActionMapping[]>
  getRolePermission(args?: Prisma.RoleModuleActionMappingFindManyArgs): Promise<RoleModuleActionMapping[]>

}

export class RolePermissionRepository implements IRolePermissionRepository {

  findMany(args?: Prisma.UserRolesFindManyArgs): PrismaPromise<UserRoles[]> {
    return db.userRoles.findMany(args)
  }

  findModuleActions(args?: Prisma.ModuleActionMappingFindManyArgs): PrismaPromise<ModuleActionMapping[]> {
    return db.moduleActionMapping.findMany(args)
  }

  async create(args: any, userId: string): Promise<any> {
    const createUserRoleArgs : any=  Prisma.validator<Prisma.UserRolesCreateArgs>()({
      data: {
        name : args.data.name,
        createdBy: userId,
        updatedBy: userId
      },
    })

    const createUserRole = await db.userRoles.create(createUserRoleArgs)

    const findModuleActionIdArgs: any[] = args.data.permissions.map((permission: any) => ({
      where: {
        moduleId: String(permission.moduleId),
        actionId: String(permission.actionId),
      },
      select: {
        id: true,
      },
    }));

    const moduleActionIds = [];
    
    for (const arg of findModuleActionIdArgs) {
      const result = await db.moduleActionMapping.findMany(arg);
      moduleActionIds.push(...result);
    }
    
    const createArgs: any[] = moduleActionIds.map((module: any) => ({
      data: {
        roleId: createUserRole.id,
        moduleActionMappingId: module.id,
        createdBy: userId,
        updatedBy: userId,
      },
    }));

    await db.roleModuleActionMapping.createMany({
      data: createArgs.map(arg => arg.data),
    });
  }

  async update(args: any, userId: string): Promise<any> {
    const updateUserRoleArgs : any=  Prisma.validator<Prisma.UserRolesUpdateArgs>()({
      where: {
        id: args.data.id,
      },
      data: {
        name : args.data.name,
        createdBy: userId,
        updatedBy: userId
      },
    })

    await db.roleModuleActionMapping.updateMany({ 
      where: { 
         roleId: args.data.id, 
      },
      data: { 
        deletedAt : DateTime.now().toJSDate()
      }
    });
   
    const createUserRole = await db.userRoles.update(updateUserRoleArgs)

    const moduleActionIds = await db.moduleActionMapping.findMany({
      where: {
        OR: args.data.permissions.map((permission: any) => ({
          moduleId: String(permission.moduleId),
          actionId: String(permission.actionId),
        })),
      },
      select: { id: true },
    });
      
    const updateArgs = moduleActionIds.map((module: any) => ({
      roleId: createUserRole.id,
      moduleActionMappingId: module.id,
      createdBy: userId,
      updatedBy: userId,
    }));

    await db.roleModuleActionMapping.createMany({ data: updateArgs });
  }

  count(args?: Prisma.UserRolesCountArgs): PrismaPromise<number> {
    return db.userRoles.count(args)
  }

  findOne(args: any) {
    return db.userRoles.findMany(args)
  }

  getRolePermission(args: Prisma.RoleModuleActionMappingFindManyArgs) {
    return db.roleModuleActionMapping.findMany(args)
  }
}