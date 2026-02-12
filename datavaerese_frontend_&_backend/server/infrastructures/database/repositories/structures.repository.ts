import { Prisma } from '@prisma/client'
import type { StructureGroups, PrismaPromise, StructureInStructureGroup } from '@prisma/client'
import { db } from '..'

export interface IStructureRepository {
  findMany(args?: Prisma.StructureGroupsFindManyArgs): Promise<StructureGroups[]>
  create(args: Prisma.StructureGroupsCreateArgs): Promise<{ id: string }>
  update(args: Prisma.StructureGroupsUpdateArgs): Promise<{ id: string }>
  count(args?: Prisma.StructureGroupsCountArgs): Promise<number>
  updateStructure(args: Prisma.StructureGroupsUpdateArgs): Promise<{ extractedResourceId: string }>
}

export class StructureRepository implements IStructureRepository {
  findMany(args?: Prisma.StructureGroupsFindManyArgs): PrismaPromise<StructureGroups[]> {
    return db.structureGroups.findMany(args)
  }

  create(args: Prisma.StructureGroupsCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.StructureGroupsSelect>()({
      id: true,
    })

    return db.structureGroups.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.StructureGroupsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.StructureGroupsSelect>()({
      id: true,
    })

    return db.structureGroups.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.StructureGroupsCountArgs): PrismaPromise<number> {
    return db.structureGroups.count(args)
  }

  updateStructure(args: Prisma.StructureGroupsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.StructureGroupsSelect>()({
      id: true,
    })

    return db.structureGroups.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }
}