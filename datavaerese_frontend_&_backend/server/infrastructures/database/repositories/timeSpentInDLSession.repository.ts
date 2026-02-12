import { Prisma } from '@prisma/client'
import type { PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ITimeSpentInDLSessionRepository {
  create(args: Prisma.TimeSpentInDLSessionsCreateArgs): Promise<{ id: string }>
  findMany(args: Prisma.TimeSpentInDLSessionsFindManyArgs): PrismaPromise<any[]>
}

export class TimeSpentInDLSessionRepository implements ITimeSpentInDLSessionRepository {
  create(args: Prisma.TimeSpentInDLSessionsCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TimeSpentInDLSessionsSelect>()({
      id: true,
    })

    return db.timeSpentInDLSessions.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  findMany(args: Prisma.TimeSpentInDLSessionsFindManyArgs): PrismaPromise<any[]> {
    return db.timeSpentInDLSessions.findMany(args)
  }
}