import { Prisma } from '@prisma/client'
import type { TimeSpentInExtractedResources, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ITimeSpentInExtractedResourcesRepository {
  create(args: Prisma.TimeSpentInExtractedResourcesCreateArgs): Promise<{ id: string }>
  update(args: Prisma.TimeSpentInExtractedResourcesUpdateArgs): Promise<{ id: string }>
  findFirst(args: Prisma.TimeSpentInExtractedResourcesFindFirstArgs): PrismaPromise<TimeSpentInExtractedResources | null>
}

export class TimeSpentInExtractedResourcesRepository implements ITimeSpentInExtractedResourcesRepository {
  create(args: Prisma.TimeSpentInExtractedResourcesCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesSelect>()({
      id: true,
    })

    return db.timeSpentInExtractedResources.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.TimeSpentInExtractedResourcesUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesSelect>()({
      id: true,
    })

    return db.timeSpentInExtractedResources.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  findFirst(args: Prisma.TimeSpentInExtractedResourcesFindFirstArgs): PrismaPromise<TimeSpentInExtractedResources | null> {
    return db.timeSpentInExtractedResources.findFirst(args)
  }
}