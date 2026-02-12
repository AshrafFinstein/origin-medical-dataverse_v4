import { Prisma } from '@prisma/client'
import type { StructureGroupInCESessions, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface IStructureGroupInCESessionsRepository {
  findMany(args?: Prisma.StructureGroupInCESessionsFindManyArgs): Promise<StructureGroupInCESessions[]>
}

export class StructureGroupInCESessionsRepository implements IStructureGroupInCESessionsRepository {
  findMany(args?: Prisma.StructureGroupInCESessionsFindManyArgs): PrismaPromise<StructureGroupInCESessions[]> {
    return db.structureGroupInCESessions.findMany(args)
  }
}