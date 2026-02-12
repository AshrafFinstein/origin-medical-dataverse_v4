import type { Epic, Prisma, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface IEpicRepository {
  findMany(args?: Prisma.EpicFindManyArgs): Promise<Epic[]>
  count(args?: Prisma.EpicCountArgs): Promise<number>
  findOne(args: Prisma.EpicFindUniqueArgs): Promise<Epic | null>
  create(args: Prisma.EpicCreateArgs): Promise<Epic>
  update(args: Prisma.EpicUpdateArgs): Promise<Epic>
  delete(args: Prisma.EpicDeleteArgs): Promise<Epic>
}

export class EpicRepository implements IEpicRepository {
  findMany(args?: Prisma.EpicFindManyArgs): PrismaPromise<Epic[]> {
    return db.epic.findMany(args)
  }

  count(args?: Prisma.EpicCountArgs): PrismaPromise<number> {
    return db.epic.count(args)
  }

  findOne(args: Prisma.EpicFindFirstArgs) {
    return db.epic.findFirst(args)
  }

  create(args: Prisma.EpicCreateArgs): PrismaPromise<Epic> {
    return db.epic.create(args)
  }

  update(args: Prisma.EpicUpdateArgs): PrismaPromise<Epic> {
    return db.epic.update(args)
  }

  delete(args: Prisma.EpicDeleteArgs): PrismaPromise<Epic> {
    return db.epic.delete(args)
  }
}
