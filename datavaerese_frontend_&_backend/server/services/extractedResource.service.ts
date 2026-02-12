import { Readable } from 'node:stream'
import type { ExtractedResource, ExtractedResourceStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import type {
  ExtractedResourceCreateManyInput,
  ExtractedResourceCreateSingleInput,
  ExtractedResourceDeleteSingleInput,
  ExtractedResourceFindManyInputinCESession,
  ExtractedResourceFindSingleInput,
  ExtractedResourceUpdateManyInput,
  ExtractedResourceUpdateSingleInput,
} from '../trpc/routers/extractedResource'
import { db } from '../infrastructures/database'
import transaction from '../infrastructures/database/transaction'
import { TaxonomyService } from './taxonomy.service'

interface StreamExtractedResourcesOptions {
  batchSize: number
  dLSessionId: string
  labelIds?: string[]
  patientId?: string
  status?: ExtractedResourceStatus
  name?: string
  versionName?: string
  purpose?: string
}

interface StreamExtractedResourcesCESessionOptions {
  batchSize: number
  cESessionId: string
  status?: ExtractedResourceStatus
}

export class ExtractedResourceService {
  static readonly extractedResourceRepository = resolve(TOKEN.extractedResourceRepository)
  static readonly taxonomyRepository = resolve(TOKEN.taxonomyRepository)

  static async find(input: ExtractedResourceFindSingleInput) {
    const args = Prisma.validator<Prisma.ExtractedResourceFindUniqueArgs>()({
      where: {
        id: input,
      },
    })
    return this.extractedResourceRepository().findOne(args)
  }

  static async findManyinCESession(input?: ExtractedResourceFindManyInputinCESession) {
    const args = Prisma.validator<Prisma.ExtractedResourceFindManyArgs>()({
      include: {
        cESessions: input?.filter?.cESessionId
          ? {
              where: {
                cESessionId: input.filter.cESessionId,
              },
              select: {
                cESessionId: true,
                status: true,
              },
            }
          : undefined,
      },
      where: {
        cESessions: input?.filter?.cESessionId
          ? {
              some: {
                cESessionId: input.filter.cESessionId,
                status: input?.filter?.status,
              },
            }
          : undefined,
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })

    const countArgs = Prisma.validator<Prisma.ExtractedResourceCountArgs>()({
      where: {
        cESessions: input?.filter?.cESessionId
          ? {
              some: {
                cESessionId: input.filter.cESessionId,
                status: input?.filter?.status,
              },
            }
          : undefined,
      },
    })

    const UserIdsWithExtractedResourcesCountQuery = Prisma.sql`
    SELECT "UsersInCESessions".userId AS "userId", "sessionId", "projectId", "ExtractedResourceIndex", "extractedResourceId", SUM("CountExtractedResource_2")::int AS "noExtractedResources"
    FROM "UsersInCESessions"
    INNER JOIN (
      SELECT "CESession".id AS "sessionId", "CESession"."projectId" AS "projectId", "ExtractedResourceIndex", "extractedResourceId", SUM("CountExtractedResource") AS "CountExtractedResource_2"
      FROM "CESession"
      INNER JOIN (
        SELECT "ExtractedResourcesInCESessions".index AS "ExtractedResourceIndex", "ExtractedResourcesInCESessions"."cESessionId" AS "cESessionId", "ExtractedResource"."rawResourceId", COUNT("ExtractedResourcesInCESessions".extractedResourceId) AS "CountExtractedResource"
        FROM "ExtractedResourcesInCESessions"
        INNER JOIN "ExtractedResource"
        ON "ExtractedResource".id = "ExtractedResourcesInCESessions"."extractedResourceId"
        GROUP BY "ExtractedResource".id, 
        )
      ON "sessionId" = "cESessionId"
      ${input?.filter?.cESessionId
        ? Prisma.sql`WHERE sessionId = ${input.filter.cESessionId}`
        : Prisma.empty}
    )
    ON "UsersInCESessions"."cESessionId" = "sessionId"
    ${input?.filter?.userId
      ? Prisma.sql`WHERE userId = ${input.filter.userId}`
      : Prisma.empty}
    `
    return transaction([
      this.extractedResourceRepository().findMany(args),
      this.extractedResourceRepository().count(countArgs),
      db.$queryRaw<{ patientId: string; extractedResourcesCount: number }[]>(
        UserIdsWithExtractedResourcesCountQuery,
      ),
    ])
  }

  static async create(input: ExtractedResourceCreateSingleInput) {
    const args = Prisma.validator<Prisma.ExtractedResourceCreateArgs>()({
      data: input,
    })
    return this.extractedResourceRepository().createOne(args)
  }

  static async createMany(input: ExtractedResourceCreateManyInput) {
    const args = Prisma.validator<Prisma.ExtractedResourceCreateManyArgs>()({
      data: input,
    })
    return this.extractedResourceRepository().createMany(args)
  }

  static async update(input: ExtractedResourceUpdateSingleInput) {
    const args = Prisma.validator<Prisma.ExtractedResourceUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        id: input.newId ?? input.id,
        metadata: input.metadata,
        rawResourceId: input.rawResourceId,
      },
    })
    return this.extractedResourceRepository().updateOne(args)
  }

  static async updateMany(input: ExtractedResourceUpdateManyInput) {
    return {
      count: (await db.$transaction(
        input.map((item) => {
          const args = Prisma.validator<Prisma.ExtractedResourceUpdateArgs>()({
            where: {
              id: item.id,
            },
            data: {
              id: item.newId ?? item.id,
              metadata: item.metadata,
              rawResourceId: item.rawResourceId,
            },
          })
          return this.extractedResourceRepository().updateOne(args)
        }),
      )).length,
    }
  }

  static async delete(input: ExtractedResourceDeleteSingleInput) {
    const args = Prisma.validator<Prisma.ExtractedResourceDeleteArgs>()({
      where: {
        id: input,
      },
    })
    return this.extractedResourceRepository().deleteOne(args)
  }

  static async getAssigneesForExtractedResources(
    extractedResourceIds: string[],
    sessionId: string
  ): Promise<Map<string, Array<{ email: string }>>> {
    if (!extractedResourceIds.length || !sessionId) {
      return new Map();
    }

    const assigneesMap = new Map<string, Array<{ email: string }>>();

    // Fetch assignees from both TaxonomyDataInDLSessions and ChildTaxonomyDataInDLSessions in a single query
    // Using LEFT JOIN to combine both tables
    const query = Prisma.sql`
      SELECT DISTINCT ON (td."createdBy", td."updatedBy", td."extractedResourceId")
        td."extractedResourceId",
        uc."email" AS "createdByEmail",
        uu."email" AS "updatedByEmail",
        uc2."email" AS "childCreatedByEmail",
        uu2."email" AS "childUpdatedByEmail"
      FROM "TaxonomyDataInDLSessions" td
      LEFT JOIN "users" uc ON uc."userid" = td."createdBy"
      LEFT JOIN "users" uu ON uu."userid" = td."updatedBy"
      LEFT JOIN "ChildTaxonomyDataInDLSessions" ctd 
        ON ctd."dLSessionId" = td."dLSessionId"
        AND ctd."extractedResourceId" = td."extractedResourceId"
      LEFT JOIN "users" uc2 ON uc2."userid" = ctd."createdBy"
      LEFT JOIN "users" uu2 ON uu2."userid" = ctd."updatedBy"
      WHERE td."dLSessionId" = ${sessionId}
        AND td."extractedResourceId" = ANY(${extractedResourceIds})
      ORDER BY td."createdBy", td."updatedBy", td."extractedResourceId", td."createdAt" DESC
    `;

    try {
      const assignees = await db.$queryRaw<Array<{
        extractedResourceId: string;
        createdByEmail: string | null;
        updatedByEmail: string | null;
        childCreatedByEmail: string | null;
        childUpdatedByEmail: string | null;
      }>>(query);

      // Group assignees by extracted resource ID and collect unique assignees
      assignees.forEach((assignee) => {
        const resourceId = assignee.extractedResourceId;
        if (!assigneesMap.has(resourceId)) {
          assigneesMap.set(resourceId, []);
        }
        
        const existingAssignees = assigneesMap.get(resourceId)!;
        const existingEmails = new Set(existingAssignees.map(a => a.email));

        // Add createdBy from TaxonomyDataInDLSessions as assignee if not already present
        if (assignee.createdByEmail && !existingEmails.has(assignee.createdByEmail)) {
          existingAssignees.push({
            email: assignee.createdByEmail
          });
          existingEmails.add(assignee.createdByEmail);
        }

        // Add updatedBy from TaxonomyDataInDLSessions as assignee if not already present
        if (assignee.updatedByEmail && !existingEmails.has(assignee.updatedByEmail)) {
          existingAssignees.push({
            email: assignee.updatedByEmail
          });
          existingEmails.add(assignee.updatedByEmail);
        }

        // Add createdBy from ChildTaxonomyDataInDLSessions as assignee if not already present
        if (assignee.childCreatedByEmail && !existingEmails.has(assignee.childCreatedByEmail)) {
          existingAssignees.push({
            email: assignee.childCreatedByEmail
          });
          existingEmails.add(assignee.childCreatedByEmail);
        }

        // Add updatedBy from ChildTaxonomyDataInDLSessions as assignee if not already present
        if (assignee.childUpdatedByEmail && !existingEmails.has(assignee.childUpdatedByEmail)) {
          existingAssignees.push({
            email: assignee.childUpdatedByEmail
          });
          existingEmails.add(assignee.childUpdatedByEmail);
        }
      });
    } catch (err) {
      console.error('Error fetching assignees:', err);
    }

    return assigneesMap;
  }

  static async getReviewersForExtractedResources(
    extractedResourceIds: string[],
    sessionId: string
  ): Promise<Map<string, Array<{ email: string; approvalLevel: number; status: string }>>> {
    if (!extractedResourceIds.length || !sessionId) {
      return new Map();
    }

    const reviewersMap = new Map<string, Array<{ email: string; approvalLevel: number; status: string }>>();

    // Fetch all reviewers for all extracted resources in batch
    // First, get all approval records to find all reviewers at each level
    const allApprovalsQuery = Prisma.sql`
      SELECT 
        ua."approvalModuleUniqueId",
        ua."approvalLevel",
        ua."approvalStatusId",
        u."email" AS "approvedByEmail",
        ua."updatedAt"
      FROM "UserApproval" ua
      LEFT JOIN "users" u ON u."userid" = ua."updatedBy"
      WHERE ua."sessionId" = ${sessionId}
        AND ua."approvalModuleUniqueId" = ANY(${extractedResourceIds})
        AND ua."updatedBy" IS NOT NULL
      ORDER BY ua."approvalModuleUniqueId", ua."approvalLevel" ASC, ua."updatedAt" DESC
    `;

    try {
      const allApprovals = await db.$queryRaw<Array<{
        approvalModuleUniqueId: string;
        approvalLevel: number;
        approvalStatusId: string | null;
        approvedByEmail: string | null;
        updatedAt: Date;
      }>>(allApprovalsQuery);

      // First, find the last approver (highest approval level with approved/rejected status) for each resource
      const lastApproverLevel = new Map<string, number>();
      allApprovals.forEach((approval) => {
        if (approval.approvalStatusId && (approval.approvalStatusId === '1' || approval.approvalStatusId === '2')) {
          const resourceId = approval.approvalModuleUniqueId;
          const currentMax = lastApproverLevel.get(resourceId) || 0;
          if (approval.approvalLevel > currentMax) {
            lastApproverLevel.set(resourceId, approval.approvalLevel);
          }
        }
      });

      // Group reviewers by extracted resource ID
      // Keep all reviewers up to the last approver, avoiding duplicates by email and approvalLevel
      allApprovals.forEach((approval) => {
        const resourceId = approval.approvalModuleUniqueId;
        const maxLevel = lastApproverLevel.get(resourceId);
        
        // Only include reviewers up to the last approver level (if last approver exists)
        // If no last approver exists, don't include any reviewers
        if (maxLevel && approval.approvalLevel <= maxLevel) {
          if (!reviewersMap.has(resourceId)) {
            reviewersMap.set(resourceId, []);
          }
          if (approval.approvedByEmail) {
            const existingReviewers = reviewersMap.get(resourceId)!;
            // Check if this reviewer at this level already exists
            const exists = existingReviewers.some(
              r => r.email === approval.approvedByEmail && r.approvalLevel === approval.approvalLevel
            );
            
            if (!exists) {
              // Map approvalStatusId to readable status
              const status = approval.approvalStatusId === '1' ? 'Accepted' : approval.approvalStatusId === '2' ? 'Rejected' : 'Accepted';
              existingReviewers.push({
                email: approval.approvedByEmail,
                approvalLevel: approval.approvalLevel,
                status: status,
              });
              // Sort by approval level to maintain order
              existingReviewers.sort((a, b) => a.approvalLevel - b.approvalLevel);
            }
          }
        }
      });
    } catch (err) {
      console.error('Error fetching reviewers:', err);
    }

    return reviewersMap;
  }

  static async getAnnotatorsForLabels(
    extractedResourceIds: string[],
    dLSessionId: string
  ): Promise<Map<string, Map<string, Array<{ email: string }>>>> {
    if (!extractedResourceIds.length || !dLSessionId) {
      return new Map();
    }

    // Create a nested Map: extractedResourceId -> labelId -> array of annotators
    const annotatorsMap = new Map<string, Map<string, Array<{ email: string }>>>();

    // Fetch annotators from LabelsInExtractedResourcesInDLSessions table
    // Join with users table to get email addresses
    const query = Prisma.sql`
      SELECT DISTINCT ON (lier."extractedResourceId", lier."labelId", lier."createdBy", lier."updatedBy")
        lier."extractedResourceId",
        lier."labelId",
        uc."email" AS "createdByEmail",
        uu."email" AS "updatedByEmail"
      FROM "LabelsInExtractedResourcesInDLSessions" lier
      LEFT JOIN "users" uc ON uc."userid" = lier."createdBy"
      LEFT JOIN "users" uu ON uu."userid" = lier."updatedBy"
      WHERE lier."dLSessionId" = ${dLSessionId}
        AND lier."extractedResourceId" = ANY(${extractedResourceIds})
        AND lier."deletedAt" IS NULL
      ORDER BY lier."extractedResourceId", lier."labelId", lier."createdBy", lier."updatedBy", lier."createdAt" DESC
    `;

    try {
      const annotators = await db.$queryRaw<Array<{
        extractedResourceId: string;
        labelId: string;
        createdByEmail: string | null;
        updatedByEmail: string | null;
      }>>(query);

      // Group annotators by extracted resource ID and label ID
      annotators.forEach((annotator) => {
        const resourceId = annotator.extractedResourceId;
        const labelId = annotator.labelId;

        // Initialize nested map structure if needed
        if (!annotatorsMap.has(resourceId)) {
          annotatorsMap.set(resourceId, new Map());
        }
        
        const labelMap = annotatorsMap.get(resourceId)!;
        if (!labelMap.has(labelId)) {
          labelMap.set(labelId, []);
        }

        const existingAnnotators = labelMap.get(labelId)!;
        const existingEmails = new Set(existingAnnotators.map(a => a.email));

        // Add createdBy as annotator if not already present
        if (annotator.createdByEmail && !existingEmails.has(annotator.createdByEmail)) {
          existingAnnotators.push({
            email: annotator.createdByEmail
          });
          existingEmails.add(annotator.createdByEmail);
        }

        // Add updatedBy as annotator if not already present
        if (annotator.updatedByEmail && !existingEmails.has(annotator.updatedByEmail)) {
          existingAnnotators.push({
            email: annotator.updatedByEmail
          });
          existingEmails.add(annotator.updatedByEmail);
        }
      });
    } catch (err) {
      console.error('Error fetching label annotators:', err);
    }

    return annotatorsMap;
  }

  static async getExtractedResourceIds({ batchSize, dLSessionId, labelIds, patientId, status }: StreamExtractedResourcesOptions) {

    return new Promise<any[]>(async (resolve, reject) => {
      let subQuery: any[] = [];
      let subQuery1: any[] = [];
      let subQuery2: any[] = [];

      labelIds?.forEach((label,index) => {
        if (index == labelIds.length-1) {
          subQuery.push(Prisma.raw(`max(abc.l${index+1}) l${index+1} `))
          
          subQuery1.push(Prisma.sql`select "extractedResourceId", `)
            
          labelIds?.forEach((label, index1) => {
            if (index1 == labelIds.length-1) {
              subQuery1.push(Prisma.raw(`${index1 == index ? '"labelId"' : null } as l${index1+1} `))
            }
            else {
              subQuery1.push(Prisma.raw(`${index1 == index ? '"labelId"' : null } as l${index1+1}, `))
            }
          })
          subQuery1.push(Prisma.sql`from "LabelsInExtractedResourcesInDLSessions" where "labelId" = ${label} and "dLSessionId"  = ${dLSessionId} and "deletedAt" is null `)
        }
        else {
          subQuery.push(Prisma.raw(`max(abc.l${index+1}) l${index+1}, `))
          
          subQuery1.push(Prisma.sql`select "extractedResourceId", `)
            
          labelIds?.forEach((label, index1) => {
            if (index1 == labelIds.length-1) {
              subQuery1.push(Prisma.raw(`${index1 == index ? '"labelId"' : null } as l${index1+1} `))
            }
            else {
              subQuery1.push(Prisma.raw(`${index1 == index ? '"labelId"' : null } as l${index1+1}, `))
            }
          })
          subQuery1.push(Prisma.sql`from "LabelsInExtractedResourcesInDLSessions" where "labelId" = ${label} and "dLSessionId"  = ${dLSessionId} and "deletedAt" is null union all `)
        }

        subQuery2.push(Prisma.raw(`l${index+1} is not null`))
      })

      const query = Prisma.sql`
        ${labelIds ?
          Prisma.sql`
            select extractedResourceId from ( select max(abc."extractedResourceId") as extractedResourceId,
              ${subQuery.length ? Prisma.join(subQuery,'') : Prisma.empty}
              ${labelIds ? Prisma.sql`from (` : Prisma.empty}
              ${subQuery1.length ? Prisma.join(subQuery1,'') : Prisma.empty}
              ${labelIds ? Prisma.sql`) abc group by "extractedResourceId"` : Prisma.empty}
            ) xyz
            join "ExtractedResourcesInDLSessions" erid on erid."extractedResourceId" = extractedResourceId`
          : Prisma.sql`
            SELECT erid."extractedResourceId"
            FROM "ExtractedResourcesInDLSessions" erid
            JOIN "ExtractedResource" r ON r."id" = erid."extractedResourceId"
          `
        }
        
        ${
          patientId ?
            Prisma.sql`
              left join "ExtractedResource" er on er.id = extractedResourceId
              join "RawResource" rr on rr.id = er."rawResourceId"
              JOIN "Visit" V ON V.id = RR."visitId"
              JOIN "Patient" P ON P.id = V."patientId"
            ` : Prisma.empty
        }
        where
        ${dLSessionId ? Prisma.sql`erid."dLSessionId" = ${dLSessionId}` : Prisma.empty}
        ${labelIds ?  Prisma.sql` and ` : Prisma.empty}
        ${labelIds && subQuery2.length ? Prisma.join(subQuery2, ' and '): Prisma.empty}
        ${status ? Prisma.sql` and erid.status::text = ${status}` : Prisma.empty}
        ${patientId ? Prisma.sql` and P.id = ${patientId}` : Prisma.empty}
      `
      await db.$queryRaw<(ExtractedResource & { extractedresourceid: string[] } )[]>(
        query,
      ).then(async (data) => {
        resolve(data)
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    })
  }
  
  static stream = (
    { batchSize, dLSessionId, labelIds, patientId, status, name, versionName, purpose }: StreamExtractedResourcesOptions,
  ): Readable => {
    let cursorId: string;
    let fetchExtractedResourceId = true;
    let extractedResourceIds: any[] = [];
    const limit = 32700;
    const that = this;
    let temp: any[] = [];
  
    return new Readable({
      objectMode: true,
      highWaterMark: batchSize,
      async read() {
        if (fetchExtractedResourceId) {
          extractedResourceIds = await that.getExtractedResourceIds({batchSize, dLSessionId, labelIds, patientId, status});
          temp = extractedResourceIds.splice(-limit);
          fetchExtractedResourceId = false;
        }

        const taxonomyDataArgs = Prisma.validator<Prisma.TaxonomyDataInDLSessionsFindManyArgs>()({
          select: {
            extractedResourceId: true,
            id: true,
          },
          where: {
            dLSessionId,
            deletedAt: null
          },
          distinct: 'extractedResourceId'
        });
        const taxonomyDataExtractedResources = await TaxonomyService.taxonomyRepository().findTaxonomyDataInDLSessions(taxonomyDataArgs);
  
        const args = Prisma.validator<Prisma.ExtractedResourceFindManyArgs>()({
          include: {
            dLSessions: dLSessionId
              ? {
                  where: {
                    dLSessionId,
                  },
                  select: {
                    status: true,
                    labels: {
                      select: {
                        id: true,
                        labelId: true,
                        label: {
                          select: {
                            id: true,
                            name: true,
                            abbreviation: true,
                          }
                        }
                      },
                      where: {
                        deletedAt: null
                      }
                    },
                  }
                }
              : undefined,
            TaxonomyDataInDLSessions: {
              select: {
                taxonomyData: true,
                taxonomiesAnnotationsInDLSessionsId: true,
                taxonomiesAnnotationsInDLSessions: {
                  select: {
                    annotationId: true,
                    annotation:{
                      select:{
                      name:true,
                      abbreviation: true,
                      }
                    },
                    taxonomy: {
                      select: {
                        id: true,
                        name: true,
                      }
                    }
                  }
                }
              },
              where: {
                dLSessionId,
                extractedResourceId: {
                  in: taxonomyDataExtractedResources.map((id) => id.extractedResourceId),
                },
                deletedAt: null
              }
            },
            // Get ALL child taxonomy data for the session, not filtered by parent
            ChildTaxonomyDataInDLSessions: {
              select: {
                taxonomyData: true,
                taxonomiesAnnotationsInDLSessionsId: true,
                taxonomiesAnnotationsInDLSessions: {
                  select: {
                    id: true,
                    annotationId: true,
                    annotation: {
                      select: {
                        name: true,
                        abbreviation: true,
                      }
                    },
                    taxonomy: {
                      select: {
                        id: true,
                        name: true
                      }
                    }
                  }
                }
              },
              where: {
                dLSessionId,
                deletedAt: null
              }
            }
          },
          where: {
            id: {
              in: temp.map((d) => {
                return d.extractedResourceId
              })
            }
          },
          take: batchSize,
          skip: cursorId ? 1 : 0,
          cursor: cursorId ? { id: cursorId } : undefined,
        });
  
        try {
          const items: any = await ExtractedResourceService.extractedResourceRepository().findMany(args);
          
          // Fetch assignees and reviewers for all items in this batch
          const extractedResourceIds = items.map((item: any) => item.id);
          const assigneesMap = dLSessionId 
            ? await ExtractedResourceService.getAssigneesForExtractedResources(extractedResourceIds, dLSessionId)
            : new Map();
          const reviewersMap = dLSessionId 
            ? await ExtractedResourceService.getReviewersForExtractedResources(extractedResourceIds, dLSessionId)
            : new Map();
          
          // Fetch annotators for labels in this batch
          const labelAnnotatorsMap = dLSessionId
            ? await ExtractedResourceService.getAnnotatorsForLabels(extractedResourceIds, dLSessionId)
            : new Map();

          for (const item of items) {
            // Get assignees and reviewers for this extracted resource
            const assignees = assigneesMap.get(item.id) || [];
            const reviewers = reviewersMap.get(item.id) || [];

            // Create formatted JSON for each item
            const formattedItem = {
              id: item.id,
              sessionName: name || "",
              versionName: versionName || "",
              purpose: purpose || "",
              dLSessionId: dLSessionId || "",
              status: (item.dLSessions && item.dLSessions[0]?.status) || status || "PENDING",
              assignees: assignees,
              reviewers: reviewers,
              metadata: {
                type: item.metadata?.type || "image/png",
                width: item.metadata?.width || 0,
                height: item.metadata?.height || 0,
                pixelResolution: item.metadata?.pixelResolution || 0
              },
              rawResourceId: item.rawResourceId || "",
              labels: [],
              taxonomy: []
            };
  
            // Process labels
            if (item.dLSessions && item.dLSessions[0]?.labels) {
              const uniqueLabels = new Map();
              item.dLSessions[0].labels.forEach(labelObj => {
                if (labelObj.label) {
                  const labelId = labelObj.label.id;
                  // Get annotators for this label
                  const resourceAnnotators = labelAnnotatorsMap.get(item.id);
                  const annotators = resourceAnnotators?.get(labelObj.labelId) || [];
                  
                  // Create label object with annotators
                  const labelWithAnnotators = {
                    ...labelObj.label,
                    annotators: annotators
                  };
                  
                  uniqueLabels.set(labelId, labelWithAnnotators);
                }
              });
              formattedItem.labels = Array.from(uniqueLabels.values());
            }
  
            // Process parent taxonomy data
            if (item.TaxonomyDataInDLSessions && item.TaxonomyDataInDLSessions.length > 0) {
              const parentTaxonomyEntries = item.TaxonomyDataInDLSessions.map(taxData => {
                // Clean taxonomy data by removing unnecessary fields
                const taxonomyData = {...taxData.taxonomyData};
                if (taxonomyData.taxonomiesAnnotationsInDLSessionsId) delete taxonomyData.taxonomiesAnnotationsInDLSessionsId;
                if (taxonomyData.TypesInTaxonomyId) delete taxonomyData.TypesInTaxonomyId;
                if (taxonomyData.typesInTaxonomyId) delete taxonomyData.typesInTaxonomyId;
                
                // Override name and abbreviation with current annotation data
                const currentAnnotation = taxData.taxonomiesAnnotationsInDLSessions?.annotation;
                if (currentAnnotation) {
                  taxonomyData.name = currentAnnotation.name;
                  taxonomyData.abbreviation = currentAnnotation.abbreviation;
                }
                
                // Create taxonomy entry with correct group name
                return {
                  annotationId: taxData.taxonomiesAnnotationsInDLSessions?.annotationId || "",
                  taxonomyGroupName: taxData.taxonomiesAnnotationsInDLSessions?.taxonomy?.name || "",
                  taxonomyData: taxonomyData || {},
                  childAnnotation: []
                };
              });
              
              formattedItem.taxonomy.push(...parentTaxonomyEntries);
            }

            // Process child taxonomy data independently (without requiring parent)
            if (item.ChildTaxonomyDataInDLSessions && item.ChildTaxonomyDataInDLSessions.length > 0) {
              // Group children by annotationId first to handle naming properly
              const childrenByAnnotation = new Map();
              
              item.ChildTaxonomyDataInDLSessions.forEach(childData => {
                const annotationId = childData.taxonomiesAnnotationsInDLSessions?.annotationId || "";
                if (!childrenByAnnotation.has(annotationId)) {
                  childrenByAnnotation.set(annotationId, []);
                }
                childrenByAnnotation.get(annotationId).push(childData);
              });

              const childTaxonomyEntries = [];
              
              childrenByAnnotation.forEach((children, annotationId) => {
                const processedChildren = children.map((childData, index) => {
                  // Clean child taxonomy data
                  const childTaxonomyData = {...childData.taxonomyData};
                  
                  // Remove unnecessary fields
                  if (childTaxonomyData.taxonomiesAnnotationsInDLSessionsId) delete childTaxonomyData.taxonomiesAnnotationsInDLSessionsId;
                  if (childTaxonomyData.TypesInTaxonomyId) delete childTaxonomyData.TypesInTaxonomyId;
                  if (childTaxonomyData.typesInTaxonomyId) delete childTaxonomyData.typesInTaxonomyId;
                  if (childTaxonomyData.annotationId) delete childTaxonomyData.annotationId;
                  if (childTaxonomyData.ParentId) delete childTaxonomyData.ParentId;

                  // Handle name and abbreviation logic
                  const currentAnnotation = childData.taxonomiesAnnotationsInDLSessions?.annotation;
                  
                  // If name and abbreviation exist in taxonomyData, use them as-is
                  // Otherwise, get from current annotation and make unique for children
                  if (!childTaxonomyData.name || !childTaxonomyData.abbreviation) {
                    if (currentAnnotation) {
                      // For children from old sessions, append index to make unique
                      const baseIndex = childTaxonomyData.index !== undefined ? childTaxonomyData.index + 1 : index + 1;
                      childTaxonomyData.name = currentAnnotation.name + baseIndex;
                      childTaxonomyData.abbreviation = currentAnnotation.abbreviation + baseIndex;
                    }
                  }
                  // If name/abbreviation already exist in taxonomyData, keep them as-is

                  // Try to find parent annotation to get parent name
                  let parentAnnotationName = "";
                  if (item.TaxonomyDataInDLSessions && item.TaxonomyDataInDLSessions.length > 0) {
                    const parentTaxonomy = item.TaxonomyDataInDLSessions.find(parent => 
                      parent.taxonomiesAnnotationsInDLSessions?.annotationId === annotationId
                    );
                    if (parentTaxonomy) {
                      parentAnnotationName = parentTaxonomy.taxonomyData?.name || "";
                    }
                  }
                  
                  return {
                    annotationId: annotationId,
                    parentAnnotationName: parentAnnotationName,
                    taxonomyData: childTaxonomyData || {}
                  };
                });

                // Create child annotation entry for this annotation group
                const firstChild = children[0];
                childTaxonomyEntries.push({
                  annotationId: annotationId,
                  taxonomyGroupName: firstChild.taxonomiesAnnotationsInDLSessions?.taxonomy?.name || "",
                  taxonomyData: {}, // Empty object for children-only entries
                  childAnnotation: processedChildren
                });
              });

              // Check if any of these children already have parent entries in taxonomy
              childTaxonomyEntries.forEach(childEntry => {
                const existingParentIndex = formattedItem.taxonomy.findIndex(parent => 
                  parent.annotationId === childEntry.annotationId
                );
                
                if (existingParentIndex >= 0) {
                  // Add children to existing parent
                  formattedItem.taxonomy[existingParentIndex].childAnnotation.push(...childEntry.childAnnotation);
                } else {
                  // Add as new entry (orphaned children)
                  formattedItem.taxonomy.push(childEntry);
                }
              });
            }
  
            // Push the formatted item to the stream
            this.push(formattedItem);
          }
  
          if (items.length < batchSize && extractedResourceIds.length == 0) {
            this.push(null);
            return;
          }
          
          if (items.length < batchSize && extractedResourceIds.length != 0) {
            temp = extractedResourceIds.splice(-limit);
            cursorId = '';
          } else {
            cursorId = items[items.length - 1].id;
          }
        }
        catch (err: any) {
          this.destroy(err);
        }
      },
    });
  }

  static async getExtractedResourceIdsCESession({ batchSize, cESessionId, status }: StreamExtractedResourcesCESessionOptions) {

    return new Promise<any[]>(async (resolve, reject) => {
      const query = Prisma.sql`
        SELECT erid."extractedResourceId"
        FROM "ExtractedResourcesInCESessions" erid
        JOIN "ExtractedResource" r ON r."id" = erid."extractedResourceId"
        where
        ${cESessionId ? Prisma.sql`erid."cESessionId" = ${cESessionId}` : Prisma.empty}
        ${status ? Prisma.sql` and erid.status::text = ${status}` : Prisma.empty}
      `

      await db.$queryRaw<(ExtractedResource & { extractedresourceid: string[] } )[]>(
        query,
      ).then(async (data) => {
        resolve(data)
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    })
  }

  static streamCESession = (
    { batchSize, cESessionId, status }: StreamExtractedResourcesCESessionOptions,
  ): Readable => {
    let cursorId: string
    let fetchExtractedResourceId = true
    let extractedResourceIds: any[] = [];
    const limit = 32700;
    const that = this;
    let temp: any[] = [];

    return new Readable({
      objectMode: true,
      highWaterMark: batchSize,
      async read() {
        if (fetchExtractedResourceId) {
          extractedResourceIds = await that.getExtractedResourceIdsCESession({batchSize, cESessionId, status})
          temp = extractedResourceIds.splice(-limit)
          fetchExtractedResourceId = false
        }

        const args = Prisma.validator<Prisma.ExtractedResourceFindManyArgs>()({
          include: {
            cESessions: cESessionId
              ? {
                  where: {
                    cESessionId,
                  },
                  select: {
                    cESessionId: true,
                    status: true,
                  },
                }
              : undefined,
            StructureDataInCESessions: {
              select: {
                structureInStructureGroup: {
                  select: {
                    StructureGroups: true,
                    StructureDataInCESessions: {
                      select: {
                        structureInStructureGroup: true
                      },
                      distinct: 'structureInStructureGroupId'
                    },
                  }
                },
              },
              where: {
                cESessionId,
                deletedAt: null
              }
            }
          },
          where: {
            id: {
              in: temp.map((d) => d.extractedResourceId)
            }
          },
          take: batchSize,
          skip: cursorId ? 1 : 0,
          cursor: cursorId ? { id: cursorId } : undefined,
        })

        try {
          const items = await ExtractedResourceService.extractedResourceRepository().findMany(args)
          for (const item of items) {
            if (item.cESessions && item.cESessions[0].labels) {
              const uniqueLabels = new Map();
              item.cESessions[0].labels.forEach(label => {
                uniqueLabels.set(label.label.id, label.label); // Assuming each label has a unique 'id'
              });
              item.cESessions[0].labels = Array.from(uniqueLabels.values());
              this.push(item)
            } else {
              this.push(item)
            }
          }

          if (items.length < batchSize && extractedResourceIds.length == 0) {
            this.push(null)
            return
          }
          if (items.length < batchSize && extractedResourceIds.length != 0) {
            temp = extractedResourceIds.splice(-limit)
            cursorId = ''
          } else {
            cursorId = items[items.length - 1].id
          }
        }
        catch (err: any) {
          this.destroy(err)
        }
      },
    })
  }

  static async updateComment(input: ExtractedResourceUpdateSingleInput) {
    const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsUpdateArgs>()({
      where: {
        extractedResourceId_dLSessionId:{
        extractedResourceId: input.id,
        dLSessionId:input.sessionId,
        },
      },
      data: {
        // markupData:input.metadata,
        comment:input.metadata?.comment,
      },
    })
    return db.extractedResourcesInDLSessions.update(args)
  }
}
