import { Prisma } from '@prisma/client'
import type { LabelsInDLSessions, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ILabelInDLSessionsRepository {
  findMany(args?: Prisma.LabelsInDLSessionsFindManyArgs): Promise<LabelsInDLSessions[]>
}

export class LabelInDLSessionsRepository implements ILabelInDLSessionsRepository {
  findMany(args?: Prisma.LabelsInDLSessionsFindManyArgs): PrismaPromise<LabelsInDLSessions[]> {
    return db.labelsInDLSessions.findMany(args)
  }
}