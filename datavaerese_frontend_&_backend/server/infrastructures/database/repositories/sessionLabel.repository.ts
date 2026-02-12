import { Prisma } from '@prisma/client'
import type { SessionLabel, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ISessionLabelRepository {
  findMany(args?: Prisma.SessionLabelFindManyArgs): Promise<SessionLabel[]>
  create(args: Prisma.SessionLabelCreateArgs): Promise<{ id: string }>
  update(args: Prisma.SessionLabelUpdateArgs): Promise<{ id: string }>
  count(args?: Prisma.SessionLabelCountArgs): Promise<number>
  delete(args: Prisma.SessionLabelDeleteArgs): Promise<{ id: string }>
}

export class SessionLabelRepository implements ISessionLabelRepository {
  findMany(args?: Prisma.SessionLabelFindManyArgs): PrismaPromise<SessionLabel[]> {
    return db.sessionLabel.findMany(args)
  }

  create(args: Prisma.SessionLabelCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.SessionLabelSelect>()({
      id: true,
    })

    return db.sessionLabel.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.SessionLabelUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.SessionLabelSelect>()({
      id: true,
    })

    return db.sessionLabel.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.SessionLabelCountArgs): PrismaPromise<number> {
    return db.sessionLabel.count(args)
  }

  delete(args: Prisma.SessionLabelDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.SessionLabelSelect>()({
      id: true,
    })

    return db.sessionLabel.delete({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }
}

