import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { TRPCError } from '@trpc/server'
import { db } from '../infrastructures/database'
import type { TaxonomyCreateManyInput, TaxonomyFindManyInput, TaxonomyUpdateManyInput, TaxonomyDeleteTypeInput } from '../trpc/routers/taxonomy'
import { now } from '@vueuse/core'

export class TaxonomyService {
  static readonly taxonomyRepository = resolve(TOKEN.taxonomyRepository)

  static async findMany(input?: TaxonomyFindManyInput) {
    const args = Prisma.validator<Prisma.TaxonomyFindManyArgs>()({
      where: {
        ...(input?.search
          ? {
              OR: [
                { name: { contains: input.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
      include: {
        typesInTaxonomies: {
          where: {deletedAt: null},
          include: {
            annotation: true // Include annotation to get its details
          }
        },
      },
    });
    const queryPromise = this.taxonomyRepository().findMany(args);
    const countPromise = this.taxonomyRepository().count();
    const [queryResult, totalCount] = await Promise.all([queryPromise, countPromise]);
    
    return [queryResult, totalCount];
  }

  static async findAutoSessionCodeListMany(input?: TaxonomyFindManyInput) {
    const projectCodeResult = await db.projectCode.findMany();
    const subProjectCodeResult = await db.subProjectCode.findMany();
    const useCaseCodeResult = await db.useCaseCode.findMany();
    const anatomyPlaneCodeResult = await db.anatomyPlaneCode.findMany();
    const centerCodeResult = await db.centerCode.findMany();
    const userTypeCodeResult = await db.userTypeCode.findMany();
    
    const [projectCodeResultList, subProjectCodeResultList, useCaseCodeList, anatomyPlaneCodeList, centerCodeList, userTypeCodeList] = 
      await Promise.all([projectCodeResult, subProjectCodeResult, useCaseCodeResult, anatomyPlaneCodeResult, centerCodeResult, userTypeCodeResult]);
    
    return [projectCodeResultList, subProjectCodeResultList, useCaseCodeList, anatomyPlaneCodeList, centerCodeList, userTypeCodeList];
  }

  static async taxonomyTypeList(input: TaxonomyFindManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
  
    const taxonomies = await db.taxonomyType.findMany({
      where: {
        deletedAt: null
      }
    });
    return taxonomies;
  }
  

  static async createNewTaxonomy(input: TaxonomyCreateManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    const taxonomyArgs = Prisma.validator<Prisma.TaxonomyCreateArgs>()({
      data: {
        name: input[0].name,
      },
    })
    const taxonomy = await this.taxonomyRepository().create(taxonomyArgs)

    // Create TypesInTaxonomy entries with annotation references
    for (const item of input[0].typesInTaxonomies) {
      const typesInTaxonomyArgs = Prisma.validator<Prisma.TypesInTaxonomyCreateArgs>()({
        data: {
          taxonomyId: taxonomy.id,
          annotationId: item.annotationId,
          colorCode: item.colorCode ? item.colorCode : 'rgb(0,0,0)'
        },
      });
      await db.typesInTaxonomy.create(typesInTaxonomyArgs);
    }

    return taxonomy;
  }
  static async getAffectedRecords(typeIds: string[]): Promise<TypeWithCounts[]> {
    const affectedRecords = await db.typesInTaxonomy.findMany({
      where: {
        id: { in: typeIds },
        deletedAt: null
      },
      include: {
        annotation: {
          select: {
            id: true,
            name: true
          }
        },
        taxonomy: {
          select: {
            id: true
          }
        }
      }
    });
  
    const result: TypeWithCounts[] = [];
  
    for (const record of affectedRecords) {
      // Find all affected sessions and their related counts
      const affectedSessions = await db.taxonomiesAnnotationsInDLSessions.findMany({
        where: {
          taxonomyId: record.taxonomy.id,
          annotationId: record.annotationId,
          deletedAt: null
        },
        include: {
          dLSession: {
            select: {
              id: true,
              name: true
            }
          },
          TaxonomyDataInDLSessions: {
            where: { deletedAt: null }
          },
          ChildTaxonomyDataInDLSessions: {
            where: { deletedAt: null }
          }
        }
      });
  
      const sessionCounts = affectedSessions.map(session => ({
        sessionId: session.dLSession.id,
        sessionName: session.dLSession.name,
        taxonomyDataCount: session.TaxonomyDataInDLSessions.length,
        childTaxonomyCount: session.ChildTaxonomyDataInDLSessions.length
      }));
  
      result.push({
        id: record.id,
        taxonomyId: record.taxonomy.id,
        annotationId: record.annotationId,
        relatedCounts: {
          affectedDLSessions: sessionCounts,
          totalSessions: sessionCounts.length,
          totalRecords: sessionCounts.reduce((sum, session) => 
            sum + session.taxonomyDataCount + session.childTaxonomyCount, 0)
        },
        annotationName: record.annotation.name
      });
    }
  
    return result;
  }
  
  static async deleteTaxonomyType(
    input: TaxonomyDeleteTypeInput, 
    isAdmin: boolean, 
    userId: string | undefined,
    confirmDelete: boolean = false
  ) {
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
  
    try {
      // Get all affected records first
      const affectedRecords = await this.getAffectedRecords(
        input.typesInTaxonomies.map(type => type.id)
      );
  
      // Check if there are any records with dependencies
      const hasAffectedSessions = affectedRecords.some(
        record => record.relatedCounts.totalSessions > 0
      );
  
      // If there are affected sessions and confirmation is not provided, return the affected data
      if (hasAffectedSessions && !confirmDelete) {
        return {
          requiresConfirmation: true,
          affectedRecords,
          message: 'Deletion requires confirmation due to existing session usage'
        };
      }
  
      // If confirmed or no sessions affected, proceed with deletion in a transaction
      const result = await db.$transaction(async (tx) => {
        const now = new Date();
  
        for (const record of affectedRecords) {
          // Find all related session records
          const sessionRecords = await tx.taxonomiesAnnotationsInDLSessions.findMany({
            where: {
              taxonomyId: record.taxonomyId,
              annotationId: record.annotationId,
              deletedAt: null
            }
          });
  
          // Soft delete all related records
          for (const sessionRecord of sessionRecords) {
            // Delete child taxonomy data
            await tx.childTaxonomyDataInDLSessions.updateMany({
              where: {
                taxonomiesAnnotationsInDLSessionsId: sessionRecord.id,
                deletedAt: null
              },
              data: { deletedAt: now }
            });
  
            // Delete taxonomy data
            await tx.taxonomyDataInDLSessions.updateMany({
              where: {
                taxonomiesAnnotationsInDLSessionsId: sessionRecord.id,
                deletedAt: null
              },
              data: { deletedAt: now }
            });
  
            // Delete child taxonomies
            await tx.childTaxonomy.updateMany({
              where: {
                taxonomiesAnnotationsInDLSessionsId: sessionRecord.id,
                deletedAt: null
              },
              data: { deletedAt: now }
            });
  
            // Delete the session record itself
            await tx.taxonomiesAnnotationsInDLSessions.update({
              where: { id: sessionRecord.id },
              data: {
                deletedAt: now,
                deletedBy: userId
              }
            });
          }
  
          // Finally, soft delete the type itself
          await tx.typesInTaxonomy.update({
            where: { id: record.id },
            data: {
              deletedAt: now,
              deletedBy: userId
            }
          });
        }
  
        return {
          success: true,
          deletedCount: affectedRecords.length,
          affectedSessionsCount: affectedRecords.reduce(
            (sum, record) => sum + record.relatedCounts.totalSessions, 0
          )
        };
      });
  
      return result;
  
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to delete taxonomy types: ${error.message}`
      });
    }
  }


static async fetchTaxonomyAnnotations(taxonomyId: string, isAdmin: boolean, userId: string | undefined) {
  if (!userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // First, get the taxonomy details
  const taxonomy = await db.taxonomy.findUnique({
    where: {
      id: taxonomyId
    },
    select: {
      id: true,
      name: true,
      typesInTaxonomies: {
        where: {
          deletedAt: null // Only get records that haven't been deleted
        },
        select: {
          id: true,
          annotation: {
            select: {
              id: true, 
              name: true,
              taxonomyTypeId: true,
              taxonomyType: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!taxonomy) {
    throw new TRPCError({ 
      code: 'NOT_FOUND',
      message: 'Taxonomy not found'
    });
  }

  // Transform the data into a more usable format
  const annotations = taxonomy.typesInTaxonomies.map(type => ({
    id: type.annotation.id,
    name: type.annotation.name,
    typeInTaxonomyId: type.id,
    taxonomyTypeId: type.annotation.taxonomyTypeId,
    taxonomyTypeName: type.annotation.taxonomyType.name
  }));

  return {
    id: taxonomy.id,
    name: taxonomy.name,
    annotations: annotations
  };
}


static async calculateChanges(
  existingTypes: TaxonomyType[],
  newTypes: TaxonomyType[],
  taxonomyId: string
) {

  const existingMap = new Map(existingTypes.map(type => [type.id, type]));

  const annotationChanges: AnnotationChangeDetail[] = [];
  const normalUpdates: TaxonomyType[] = [];
  const newAdditions: TaxonomyType[] = [];


  for (const newType of newTypes) {
    if (!newType.id) {

      newAdditions.push(newType);
      continue;
    }

    const existingType = existingMap.get(newType.id);
    if (existingType) {
      if (newType.annotationId !== existingType.annotationId) {
        annotationChanges.push({
          typeId: newType.id,
          oldAnnotationId: existingType.annotationId,
          newAnnotationId: newType.annotationId,
          colorCode: newType.colorCode || 'rgb(0,0,0)',
          affectedSessions: []
        });
      } else if (newType.colorCode !== existingType.colorCode) {

        normalUpdates.push(newType);
      }
    }
  }

  if (annotationChanges.length > 0) {

    const affectedSessionsData = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        AND: [
          { taxonomyId: taxonomyId },
          {
            OR: annotationChanges.map(change => ({
              AND: [{ annotationId: change.oldAnnotationId }]
            }))
          }
        ],
        deletedAt: null
      },
      include: {
        dLSession: { select: { id: true, name: true } },
        annotation: { select: { id: true, name: true } }
      }
    });



    annotationChanges.forEach(change => {
      const sessions = affectedSessionsData
        .filter(session => session.annotationId === change.oldAnnotationId)
        .map(session => ({
          sessionId: session.dLSession.id,
          sessionName: session.dLSession.name,
          currentAnnotationName: session.annotation.name
        }));

      change.affectedSessions = sessions;
    });
  }


  return {
    annotationChanges: {
      hasChanges: annotationChanges.length > 0,
      changes: annotationChanges,
      reqiresConfirmation: annotationChanges.some(change => change.affectedSessions.length > 0)
    },
    normalUpdates,
    newAdditions
  };
}

static async updateTaxonomy(
  input: TaxonomyUpdateManyInput, 
  isAdmin: boolean, 
  userId: string | undefined,
  confirmAnnotationChange: boolean = false
) {

  if (!userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  try {
    const existingTypes = await db.typesInTaxonomy.findMany({
      where: { taxonomyId: input.id }
    });
    const { annotationChanges, normalUpdates, newAdditions } = await this.calculateChanges(
      existingTypes,
      input.typesInTaxonomies,
      input.id
    );

    if (annotationChanges.hasChanges && !confirmAnnotationChange&& annotationChanges.reqiresConfirmation) {

      return {
        requiresConfirmation: true,
        annotationChanges: annotationChanges.changes,
        message: 'Annotation changes require confirmation due to existing session usage'
      };
    }


    const updatedTaxonomy = await db.$transaction(async (tx) => {
      const now = new Date();
      const taxonomy = await tx.taxonomy.update({
        where: { id: input.id },
        data: { name: input.name }
      });

      if (newAdditions.length > 0) {
        await tx.typesInTaxonomy.createMany({
          data: newAdditions.map(newType => ({
            taxonomyId: input.id,
            annotationId: newType.annotationId,
            colorCode: newType.colorCode || 'rgb(0,0,0)'
          }))
        });
      }

      if (annotationChanges.hasChanges && (confirmAnnotationChange || !annotationChanges.reqiresConfirmation) ){

        for (const change of annotationChanges.changes) {
          // Soft delete existing records
          const updateResult = await tx.typesInTaxonomy.updateMany({
            where: {
           taxonomyId: input.id,
           annotationId: change.oldAnnotationId,
           deletedAt: null
            },
           data: {
           deletedAt: new Date(),
           deletedBy: userId
            }
            });
      
          // Create new records

          const newRecordsData = change.affectedSessions.map(session => ({
            taxonomyId: input.id,
            annotationId: change.newAnnotationId,
            colorCode:change.colorCode,

          }));
          if(newRecordsData.length===0){
            const newRecord=input.typesInTaxonomies.map(item=>{
              return{
                taxonomyId: input.id,
                annotationId: item.annotationId,
                colorCode: item.colorCode || 'rgb(0,0,0)'
              }

            });
            const insert=  await tx.typesInTaxonomy.createMany({
                data: newRecord
              });

          }
        const insert=  await tx.typesInTaxonomy.createMany({
            data: newRecordsData
          });

      
          const taxonomiesAnnotationsInDLSessionsDeletion = await tx.taxonomiesAnnotationsInDLSessions.findMany({
            where: {
              taxonomyId: input.id,
              annotationId: change.oldAnnotationId,
              deletedAt: null
            },
            select: {
              id: true
            }
          });
          for (const deleteItem of taxonomiesAnnotationsInDLSessionsDeletion) {
            // Soft delete dependent records first
            await tx.childTaxonomyDataInDLSessions.updateMany({
              where: {
                taxonomiesAnnotationsInDLSessionsId: deleteItem.id
              },
              data: {
                deletedAt: now
              }
            });
        
            await tx.taxonomyDataInDLSessions.updateMany({
              where: {
                taxonomiesAnnotationsInDLSessionsId: deleteItem.id
              },
              data: {
                deletedAt: now
              }
            });
        
            await tx.childTaxonomy.updateMany({
              where: {
                taxonomiesAnnotationsInDLSessionsId: deleteItem.id
              },
              data: {
                deletedAt: now
              }
            });
            await tx.taxonomiesAnnotationsInDLSessions.update({
              where: {
                id: deleteItem.id
              },
              data: {
                deletedAt: now,
                deletedBy: userId
              }
            });
          }

      
        }
      }

      if (normalUpdates.length > 0) {

        for (const update of normalUpdates) {

          await tx.typesInTaxonomy.update({
            where: { id: update.id },
            data: { colorCode: update.colorCode }
          });
        }
      }

      return taxonomy;
    });
    return {
      success: true,
      taxonomy: updatedTaxonomy,
      annotationChangesApplied: annotationChanges.hasChanges,
      normalUpdatesApplied: normalUpdates.length > 0,
      newAdditionsApplied: newAdditions.length > 0,
      stats: {
        changed: annotationChanges.changes.length,
        updated: normalUpdates.length,
        added: newAdditions.length
      }
    };

  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Failed to update taxonomy: ${error.message}`
    });
  }
}


}
interface TypeWithCounts {
  id: string;
  taxonomyId: string;
  annotationId: string;
  relatedCounts: {
    affectedDLSessions: {
      sessionId: string;
      sessionName: string;
      taxonomyDataCount: number;
      childTaxonomyCount: number;
    }[];
    totalSessions: number;
    totalRecords: number;
  };
  annotationName: string;
}

interface TaxonomyDiffResult {
  toCreate: TaxonomyType[];
  toUpdate: TaxonomyType[];
  toDelete: TypeWithCounts[];
}

interface TaxonomyType {
  id: string;
  taxonomyId: string;
  annotationId: string;
  colorCode: string;
}
interface AnnotationChangeDetail {
  typeId: string;
  oldAnnotationId: string;
  newAnnotationId: string;
  colorCode: string;
  affectedSessions: {
    sessionId: string;
    sessionName: string;
    currentAnnotationName: string;
  }[];
}

interface AnnotationChangeResult {
  hasChanges: boolean;
  changes: AnnotationChangeDetail[];
  reqiresConfirmation: boolean;
}