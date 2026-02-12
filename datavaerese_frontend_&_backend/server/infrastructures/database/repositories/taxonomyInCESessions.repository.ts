import { Prisma } from '@prisma/client'
import type { TaxonomyInCESessions, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ITaxonomyInCESessionsRepository {
  findMany(args?: Prisma.TaxonomyInCESessionsFindManyArgs): Promise<TaxonomyInCESessions[]>
}

export class TaxonomyInCESessionsRepository implements ITaxonomyInCESessionsRepository {
  findMany(args?: Prisma.TaxonomyInCESessionsFindManyArgs): PrismaPromise<TaxonomyInCESessions[]> {
    return db.taxonomyInCESessions.findMany(args)
  }
}