import { Prisma } from '@prisma/client'
import type { TaxonomiesAnnotationsInDLSessions, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ITaxonomiesAnnotationsInDLSessionsRepository {
  findMany(args?: Prisma.TaxonomiesAnnotationsInDLSessionsFindManyArgs): Promise<TaxonomiesAnnotationsInDLSessions[]>
  create(args: Prisma.TaxonomiesAnnotationsInDLSessionsCreateArgs): Promise<{ id: string }>
  update(args: Prisma.TaxonomiesAnnotationsInDLSessionsUpdateArgs): Promise<{ id: string }>
  count(args?: Prisma.TaxonomiesAnnotationsInDLSessionsCountArgs): Promise<number>
  delete(args: Prisma.TaxonomiesAnnotationsInDLSessionsDeleteArgs): Promise<{ id: string }>
}

export class TaxonomiesAnnotationsInDLSessionsRepository implements ITaxonomiesAnnotationsInDLSessionsRepository {
  findMany(args?: Prisma.TaxonomiesAnnotationsInDLSessionsFindManyArgs): PrismaPromise<TaxonomiesAnnotationsInDLSessions[]> {
    return db.taxonomiesAnnotationsInDLSessions.findMany(args)
  }

  create(args: Prisma.TaxonomiesAnnotationsInDLSessionsCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TaxonomiesAnnotationsInDLSessionsSelect>()({
      id: true,
    })
    return db.taxonomiesAnnotationsInDLSessions.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.TaxonomiesAnnotationsInDLSessionsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TaxonomiesAnnotationsInDLSessionsSelect>()({
      id: true,
    })
    return db.taxonomiesAnnotationsInDLSessions.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.TaxonomiesAnnotationsInDLSessionsCountArgs): PrismaPromise<number> {
    return db.taxonomiesAnnotationsInDLSessions.count(args)
  }

  delete(args: Prisma.TaxonomiesAnnotationsInDLSessionsDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TaxonomiesAnnotationsInDLSessionsSelect>()({
      id: true,
    })
    return db.taxonomiesAnnotationsInDLSessions.delete({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }
}