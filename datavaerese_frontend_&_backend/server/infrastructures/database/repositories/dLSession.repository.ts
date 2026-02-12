import type { PrismaPromise } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { db } from '..'
import type { DLSessionWithLabelsAndUsers, DLSessionWithUsers } from '~/types/DLSession'

export type TaxonomyDataInDLSessionsCreateManyArgs = {
  dLSessionId: string,
  extractedResourceId: string,
  typesInTaxonomyId: string,
  taxonomiesAnnotationsInDLSessionsId: string,
  taxonomyData: object,
  createdBy: string,
  updatedBy: string,
}

export type TaxonomyDataInDLSessionsCreateManyArgs1 = {
  data: TaxonomyDataInDLSessionsCreateManyArgs
  skipDuplicates?: boolean
}

export type AnnotationDetailsFindManyArgs = {
  annotationId: string[];
}

export interface IDLSessionRepository {
  findMany(args?: Prisma.DLSessionFindManyArgs): Promise<DLSessionWithUsers[]>
  findOne(args: Prisma.DLSessionFindUniqueArgs): Promise<DLSessionWithLabelsAndUsers | null>
  count(args?: Prisma.DLSessionCountArgs): Promise<number>
  create(args: Prisma.DLSessionCreateArgs): Promise<{ id: string }>
  update(args: Prisma.DLSessionUpdateArgs): Promise<{ id: string }>
  delete(args: Prisma.DLSessionDeleteArgs): Promise<{ id: string }>
  createManyExtractedResources(args: Prisma.ExtractedResourcesInDLSessionsCreateManyArgs): Promise<{ count: number }>
  createManyLabelsInExtractedResources(args: Prisma.LabelsInExtractedResourcesInDLSessionsCreateManyArgs): Promise<{ count: number }>
  updateExtractedResource(args: Prisma.ExtractedResourcesInDLSessionsUpdateArgs): Promise<{ extractedResourceId: string }>
  createManyTaxonomyDataInDLSessions(args: TaxonomyDataInDLSessionsCreateManyArgs1): Promise<{ count: number }>
  findAnnotationIdsInTaxonomiesAnotationInDlSession(args:TaxonomyDataInDLSessionsCreateManyArgs1):Promise<{annotationId:string}>
  findTypesInTaxonomyIds(args:TaxonomyDataInDLSessionsCreateManyArgs1):Promise<{typesInTaxonomyId:string}>
  findAnnotationDetailsWithType(args:AnnotationDetailsFindManyArgs):Promise<{annotationDetails:string}>

}

export class DLSessionRepository implements IDLSessionRepository {
  findMany(args?: Prisma.DLSessionFindManyArgs): PrismaPromise<any> {
    const includeArgs = Prisma.validator<Prisma.DLSessionInclude>()({
      users: true,
      UserGroupInDLSessions: {
        where: {
          deletedAt: null
        },
        select: {
          dLSessionId: true,
          userGroupId: true,
          userRole: true,
          userGroup: {
            select: {
              UserGroupInDLSessions: true
            }
          }
        }
      },
      sessionLabels: {
        where: {
          isActive: true,
        },
        select: {
          sessionLabel: {
            select: {
              id: true,
              name: true,
              description: true,
              colorCode: true
            }
          }
        }
      },
      sessionStatusInDLSessions: {
        select: {
          id: true,
          sessionStatusId: true,
          isActive: true,
          sessionStatus: {
            select: {
              id: true,
              name: true,
              description: true,
              colorCode: true
            }
          }
        }
      },
      dLSessionLockHistory: {
        where: {
          deletedAt: null  // Database-level filter: only active records (faster than app-level)
        },
        orderBy: {
          lockedAt: 'desc'  // Most recent lock/unlock activity first
        },
        take: 3,  // Safety margin: handles edge cases with multiple active records
        select: {
          id: true,               // Lock history ID
          isLocked: true,        // Current lock state (true = locked, false = unlocked)
          lockReason: true,      // Reason why session was locked
          unlockReason: true,    // Reason why session was unlocked
          lockedAt: true,        // Timestamp when session was locked
          unlockedAt: true,       // Timestamp when session was unlocked
          lockedBy: true,        // User ID who locked the session
          unlockedBy: true,       // User ID who unlocked the session
          deletedAt: true        // Soft delete flag (null = active, Date = archived)
        }
      }
    })

    return db.dLSession.findMany({
      ...args,
      include: {
        ...includeArgs,
      },
    })
  }

  count(args?: Prisma.DLSessionCountArgs) {
    return db.dLSession.count(args)
  }

  findOne(args: Prisma.DLSessionFindUniqueArgs): PrismaPromise<any> {
    const includeArgs = Prisma.validator<Prisma.DLSessionInclude>()({
      labels: {
        select: {
          label: true,
        },
      },
      sessionLabels: {
        where: {
          isActive: true,
        },
        select: {
          sessionLabel: true,
        },
      },
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
      },
      users: true,
      dLSessionJsons: {
        select: {
          id: true,
          filename: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        // take: 3,
      },
    })

    return db.dLSession.findUnique({
      ...args,
      include: {
        ...includeArgs,
      },
    })
  }

  create(args: Prisma.DLSessionCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.DLSessionSelect>()({
      id: true,
    })

    return db.dLSession.create({
      ...args,
      select: selectArgs,
    })
  }

  update(args: Prisma.DLSessionUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.DLSessionSelect>()({
      id: true,
    })

    return db.dLSession.update({
      ...args,
      select: selectArgs,
    })
  }

  delete(args: Prisma.DLSessionDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.DLSessionSelect>()({
      id: true,
    })

    return db.dLSession.delete({
      ...args,
      select: selectArgs,
    })
  }

  createManyExtractedResources(args: Prisma.ExtractedResourcesInDLSessionsCreateManyArgs) {
    return db.extractedResourcesInDLSessions.createMany(args)
  }

  createManyLabelsInExtractedResources(args: Prisma.LabelsInExtractedResourcesInDLSessionsCreateManyArgs) {
    return db.labelsInExtractedResourcesInDLSessions.createMany(args)
  }

  createManyTaxonomyDataInDLSessions(args: TaxonomyDataInDLSessionsCreateManyArgs1) {
    return db.taxonomyDataInDLSessions.createMany(args)
  }

  findAnnotationIdsInTaxonomiesAnotationInDlSession(args: TaxonomyDataInDLSessionsCreateManyArgs1){
    return db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        annotationId: {
          in: args.data.map((entry) => entry.annotationId),
        },
      },
      select: {
        id:true,
        taxonomyId:true,
        annotationId: true,
      },
    });
  }

  

  findTypesInTaxonomyIds(args: TaxonomyDataInDLSessionsCreateManyArgs1) {
    return db.typesInTaxonomy.findMany({
      where: {
        AND: [
          {
            annotationId: {
              in: args.data.map((entry) => entry.annotationId),
            },
          },
          {
            taxonomyId: {
              in: args.data.map((entry) => entry.taxonomyId),
            },
          },
        ],
      },
      select: {
        id: true,
        annotationId:true
      },
    });
  }

//   async findAnnotationDetailsWithType(args:AnnotationDetailsFindManyArgs) {
//     return db.annotation.findMany({
//         where: {
//             id: {
//                 in: args.data.map((entry)=>entry.annotationId)
//             }
//         },
//         select: {
//             id: true,
//             name: true,
//             abbreviation: true,
//             taxonomyType: {
//                 select: {
//                     id: true,
//                     name: true
//                 }
//             }
//         }
//     });
// }

 findAnnotationDetailsWithType(args: AnnotationDetailsFindManyArgs) {
  return db.annotation.findMany({
      where: {
          id: {
              in: args.annotationId
          }
      },
      select: {
          id: true,
          name: true,
          abbreviation: true,
          taxonomyType: {
              select: {
                  name: true
              }
          }
      }
  });
}
  

  updateExtractedResource(args: Prisma.ExtractedResourcesInDLSessionsUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsSelect>()({
      extractedResourceId: true,
    })

    return db.extractedResourcesInDLSessions.update({
      ...args,
      select: selectArgs,
    })
  }
}
