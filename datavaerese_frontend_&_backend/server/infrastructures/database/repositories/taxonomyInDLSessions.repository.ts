import { Prisma } from '@prisma/client'
import type { TaxonomyInDLSessions, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ITaxonomyInDLSessionsRepository {
  findMany(args?: Prisma.TaxonomyInDLSessionsFindManyArgs): Promise<TaxonomyInDLSessions[]>
}

export class TaxonomyInDLSessionsRepository implements ITaxonomyInDLSessionsRepository {
  findMany(args?: Prisma.TaxonomyInDLSessionsFindManyArgs): PrismaPromise<TaxonomyInDLSessions[]> {
    return db.taxonomyInDLSessions.findMany(args)
  }
}