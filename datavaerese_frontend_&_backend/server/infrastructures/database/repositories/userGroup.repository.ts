
import type { PrismaPromise, UserGroup } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { db } from '..'


export interface IUserGroupRepository {
  findMany(args?: Prisma.UserGroupFindManyArgs): Promise<UserGroup[]>
  create(args: Prisma.UserGroupCreateArgs): Promise<{ id: string }>
  count(args?: Prisma.UserGroupCountArgs): Promise<number>
  update(args: Prisma.UserGroupUpdateArgs): Promise<{ id: string }>
}

export class UserGroupRepository implements IUserGroupRepository {

  findMany(args?: Prisma.UserGroupFindManyArgs): PrismaPromise<UserGroup[]> {
    return db.userGroup.findMany(args)
  }

  create(args: Prisma.UserGroupCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.UserGroupSelect>()({
      id: true,
    })

    return db.userGroup.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.UserGroupUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.UserGroupSelect>()({
      id: true,
    })

    return db.userGroup.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.UserGroupCountArgs): PrismaPromise<number> {
    return db.userGroup.count(args)
  }

}