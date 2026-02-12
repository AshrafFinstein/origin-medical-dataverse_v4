import type { ExtractedResourcesInCESessions, PrismaPromise } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { db } from '..'
import type { CESessionWithUsers } from '~/types/CESession'

export interface ICESessionRepository {
  findMany(args?: Prisma.CESessionFindManyArgs): Promise<CESessionWithUsers[]>
  findOne(args: Prisma.CESessionFindUniqueArgs): Promise<CESessionWithUsers | null>
  count(args?: Prisma.CESessionCountArgs): Promise<number>
  create(args: Prisma.CESessionCreateArgs): Promise<{ id: string }>
  update(args: Prisma.CESessionUpdateArgs): Promise<{ id: string }>
  delete(args: Prisma.CESessionDeleteArgs): Promise<{ id: string }>
  createManyExtractedResources(args: Prisma.ExtractedResourcesInCESessionsCreateManyArgs): Promise<{ count: number }>
  saveEvaluationResult(args: Prisma.ExtractedResourcesInCESessionsUpdateArgs): Promise<{ extractedResourceId: string }>
  findOneExtractedResource(args: Prisma.ExtractedResourcesInCESessionsWhereUniqueInput): Promise<ExtractedResourcesInCESessions | null>
  updateOneExtractedResource(args: Prisma.ExtractedResourcesInCESessionsUpdateArgs): Promise<{ cESessionId: string ; extractedResourceId: string }>
  updateExtractedResource(args: Prisma.ExtractedResourcesInCESessionsUpdateArgs): Promise<{ extractedResourceId: string }>
}

export class CESessionRepository implements ICESessionRepository {
  findMany(args?: Prisma.CESessionFindManyArgs): PrismaPromise<any> {
    const includeArgs = Prisma.validator<Prisma.CESessionInclude>()({
      users: true,
      UserGroupInCESessions: {
        where: {
          deletedAt: null
        },
        select: {
          cESessionId: true,
          userGroupId: true,
          userRole: true,
          userGroup: {
            select: {
              UserGroupInCESessions: true
            }
          }
        }
      }
    })

    return db.cESession.findMany({
      ...args,
      include: includeArgs,
    })
  }

  count(args?: Prisma.CESessionCountArgs) {
    return db.cESession.count(args)
  }

  findOne(args: Prisma.CESessionFindUniqueArgs): PrismaPromise<any> {
    const includeArgs = Prisma.validator<Prisma.CESessionInclude>()({
      users: true,
      project : {
        select : {
          name : true,
          id : true,
          epic : {
            select : {
              name : true,
              id : true
            }
          }
        }
      }
    })

    return db.cESession.findUnique({
      ...args,
      include: includeArgs,
    })
  }

  create(args: Prisma.CESessionCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.CESessionSelect>()({
      id: true,
    })

    return db.cESession.create({
      ...args,
      select: selectArgs,
    })
  }

  update(args: Prisma.CESessionUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.CESessionSelect>()({
      id: true,
    })

    return db.cESession.update({
      ...args,
      select: selectArgs,
    })
  }

  delete(args: Prisma.CESessionDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.CESessionSelect>()({
      id: true,
    })

    return db.cESession.delete({
      ...args,
      select: selectArgs,
    })
  }

  saveEvaluationResult(args: Prisma.ExtractedResourcesInCESessionsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourcesInCESessionsSelect>()({
      extractedResourceId: true,
    })
    return db.extractedResourcesInCESessions.update({
      ...args,
      select: selectArgs,
    })
  }

  findOneExtractedResource(args: Prisma.ExtractedResourcesInCESessionsWhereUniqueInput) {
    return db.extractedResourcesInCESessions.findUnique({
      where: {
        ...args,
      },
    })
  }

  updateOneExtractedResource(args: Prisma.ExtractedResourcesInCESessionsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourcesInCESessionsSelect>()({
      cESessionId: true,
      extractedResourceId: true,
    })
    return db.extractedResourcesInCESessions.update({
      ...args,
      select: selectArgs,
    })
  }

  createManyExtractedResources(args: Prisma.ExtractedResourcesInCESessionsCreateManyArgs) {
    return db.extractedResourcesInCESessions.createMany(args)
  }

  updateExtractedResource(args: Prisma.ExtractedResourcesInCESessionsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourcesInCESessionsSelect>()({
      extractedResourceId: true,
    })

    return db.extractedResourcesInCESessions.update({
      ...args,
      select: selectArgs,
    })
  }
}
