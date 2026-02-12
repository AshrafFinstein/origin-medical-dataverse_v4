import { Prisma } from '@prisma/client'
import type { DeleteSessionRequest, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface IDeleteSessionRequestRepository {
  findMany(args?: Prisma.DeleteSessionRequestFindManyArgs): Promise<DeleteSessionRequest[]>
  findOne(args: Prisma.DeleteSessionRequestFindUniqueArgs): Promise<DeleteSessionRequest | null>
  create(args: Prisma.DeleteSessionRequestCreateArgs): Promise<{ id: string }>
  update(args: Prisma.DeleteSessionRequestUpdateArgs): Promise<{ id: string }>
  count(args?: Prisma.DeleteSessionRequestCountArgs): Promise<number>
}

export class DeleteSessionRequestRepository implements IDeleteSessionRequestRepository {
  findMany(args?: Prisma.DeleteSessionRequestFindManyArgs): PrismaPromise<DeleteSessionRequest[]> {
    return db.deleteSessionRequest.findMany(args)
  }

  findOne(args: Prisma.DeleteSessionRequestFindUniqueArgs): PrismaPromise<DeleteSessionRequest | null> {
    return db.deleteSessionRequest.findUnique(args)
  }

  create(args: Prisma.DeleteSessionRequestCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.DeleteSessionRequestSelect>()({
      id: true,
    })

    return db.deleteSessionRequest.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.DeleteSessionRequestUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.DeleteSessionRequestSelect>()({
      id: true,
    })

    return db.deleteSessionRequest.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.DeleteSessionRequestCountArgs): PrismaPromise<number> {
    return db.deleteSessionRequest.count(args)
  }
}

