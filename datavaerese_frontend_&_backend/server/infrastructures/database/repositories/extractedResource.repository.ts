import { Prisma } from '@prisma/client'
import type { ExtractedResource, PrismaPromise } from '@prisma/client'
import { db } from '..'
import type { PrismaCEExtractedResourceShort, PrismaExtractedResourceWithLabelsAndStatus } from '~/types/ExtractedResource'

export interface IExtractedResourceRepository {
  findMany(args: Prisma.ExtractedResourceFindManyArgs): PrismaPromise<ExtractedResource[] | PrismaExtractedResourceWithLabelsAndStatus[] | PrismaCEExtractedResourceShort[]>
  findOne(args: Prisma.ExtractedResourceFindUniqueArgs): PrismaPromise<ExtractedResource | null>
  createMany(args: Prisma.ExtractedResourceCreateManyArgs): PrismaPromise<{ count: number }>
  createOne(args: Prisma.ExtractedResourceCreateArgs): PrismaPromise<{ id: string }>
  updateOne(args: Prisma.ExtractedResourceUpdateArgs): PrismaPromise<{ id: string }>
  deleteOne(args: Prisma.ExtractedResourceDeleteArgs): PrismaPromise<{ id: string }>
  count(args: Prisma.ExtractedResourceCountArgs): PrismaPromise<number>
}

export class ExtractedResourceRepository implements IExtractedResourceRepository {
  findMany(args: Prisma.ExtractedResourceFindManyArgs) {
    return db.extractedResource.findMany(args)
  }

  findOne(args: Prisma.ExtractedResourceFindUniqueArgs) {
    return db.extractedResource.findUnique(args)
  }

  createMany(args: Prisma.ExtractedResourceCreateManyArgs) {
    return db.extractedResource.createMany(args)
  }

  createOne(args: Prisma.ExtractedResourceCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourceSelect>()({
      id: true,
    })

    return db.extractedResource.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  updateOne(args: Prisma.ExtractedResourceUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourceSelect>()({
      id: true,
    })

    return db.extractedResource.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  deleteOne(args: Prisma.ExtractedResourceDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourceSelect>()({
      id: true,
    })

    return db.extractedResource.delete({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args: Prisma.ExtractedResourceCountArgs) {
    return db.extractedResource.count(args)
  }
}
