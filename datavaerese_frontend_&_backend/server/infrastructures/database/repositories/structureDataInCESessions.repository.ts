import { Prisma } from '@prisma/client'
import type { StructureDataInCESessions, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface IStructureDataInCESessionsRepository {
  findMany(args?: Prisma.StructureDataInCESessionsFindManyArgs): Promise<StructureDataInCESessions[]>
}

export class StructureDataInCESessionsRepository implements IStructureDataInCESessionsRepository {
  findMany(args?: Prisma.StructureDataInCESessionsFindManyArgs): PrismaPromise<StructureDataInCESessions[]> {
    return db.structureDataInCESessions.findMany(args)
  }
}