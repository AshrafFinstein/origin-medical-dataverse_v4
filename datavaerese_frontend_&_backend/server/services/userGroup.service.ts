
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { TOKEN, resolve } from '../di'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import type { UserGroupCreateSingleInput, UserGroupFindManyInput, UserGroupUpdateSingleInput } from '../trpc/routers/userGroup'
import { db } from '../infrastructures/database'
import { DateTime } from 'luxon'


export class UserGroupService {
  static readonly userGroupRepository = resolve(TOKEN.userGroupRepository)
  
  static async findMany(input?: UserGroupFindManyInput) {
    try {
    const whereClause = {
      deletedAt: null,
      ...(input?.search
        ? {
            OR: [
              { groupName: { contains: input.search, mode: 'insensitive' } },
              { description: { contains: input.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  
    const args = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where: whereClause,
      select: {
        id: true,
        groupName: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        usersInGroup: {
          where: {
            deletedAt: null
          }
        }
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })
  
      return await Promise.all([
      this.userGroupRepository().findMany(args),
      this.userGroupRepository().count({
        where: whereClause // Use the same where clause for accurate counting
      }),
    ])
    } catch (error) {
      throw handlePrismaReadError(error, 'User Group', 'findMany')
    }
  }

  static async create(input: UserGroupCreateSingleInput, userId: string) {
    try {
    input.users = input.users.map((data: any)=>{
      data['createdBy'] = userId,
      data['updatedBy'] = userId
      return data
    })

    const args = Prisma.validator<Prisma.UserGroupCreateArgs>()({
      data: {
        groupName: input.groupName,
        description: input.description ?? '',
        usersInGroup: {
          createMany: {
            data : input.users
          }
        },
        updatedBy : userId,
        createdBy: userId
      },
      select: {
        id: true
      }
    })
      
      return await this.userGroupRepository().create(args)
    } catch (error) {
      throw handlePrismaError(error, 'User Group', input, { action: 'create' })
    }
  }

  static async update(input: UserGroupUpdateSingleInput) {
    try {
    const updateData: any = {}
    
    if (input.groupName !== undefined) {
      updateData.groupName = input.groupName
    }
    
    if (input.description !== undefined) {
      updateData.description = input.description ?? ''
    }
    
    const args = Prisma.validator<Prisma.UserGroupUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        ...updateData,
        usersInGroup: {
          updateMany: {
            where : {
              userGroupId: input.id,
            },
            data: {
              deletedAt: DateTime.now().toJSDate()
            }
          },
          createMany: input.usersInGroup ? {
            data: input.usersInGroup
          } : undefined
        }
      }
    })
      return await this.userGroupRepository().update(args)
    } catch (error) {
      throw handlePrismaError(error, 'User Group', input, { action: 'update' })
    }
  }
}