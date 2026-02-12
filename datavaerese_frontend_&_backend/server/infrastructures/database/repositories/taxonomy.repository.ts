import { Prisma } from '@prisma/client'
import type { Taxonomy, PrismaPromise, TaxonomyDataInDLSessions } from '@prisma/client'
import { db } from '..'

export interface ITaxonomyRepository {
  findMany(args?: Prisma.TaxonomyFindManyArgs): Promise<Taxonomy[]>
  create(args: Prisma.TaxonomyCreateArgs): Promise<{ id: string }>
  update(args: Prisma.TaxonomyUpdateArgs): Promise<{ id: string }>
  count(args?: Prisma.TaxonomyCountArgs): Promise<number>
  updateTaxonomy(args: Prisma.TaxonomyUpdateArgs): Promise<{ extractedResourceId: string }>
  findTaxonomyDataInDLSessions(args?: Prisma.TaxonomyDataInDLSessionsFindManyArgs): Promise<TaxonomyDataInDLSessions[]>
}

export class TaxonomyRepository implements ITaxonomyRepository {
  findMany(args?: Prisma.TaxonomyFindManyArgs): PrismaPromise<Taxonomy[]> {
    return db.taxonomy.findMany(args)
  }

  create(args: Prisma.TaxonomyCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TaxonomySelect>()({
      id: true,
    })

    return db.taxonomy.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.TaxonomyUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TaxonomySelect>()({
      id: true,
    })

    return db.taxonomy.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.TaxonomyCountArgs): PrismaPromise<number> {
    return db.taxonomy.count(args)
  }

  updateTaxonomy(args: Prisma.TaxonomyUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TaxonomySelect>()({
      id: true,
    })

    return db.taxonomy.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  findTaxonomyDataInDLSessions(args?: Prisma.TaxonomyDataInDLSessionsFindManyArgs): PrismaPromise<TaxonomyDataInDLSessions[]> {
    return db.taxonomyDataInDLSessions.findMany(args)
  }
}