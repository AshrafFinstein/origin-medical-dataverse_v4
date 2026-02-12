import type { ExtractedResource, ExtractedResourceStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { TOKEN, resolve } from '../di'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import type { DLSessionCreateSingleInput, DLSessionDeleteSingleInput, DLSessionFindManyInput, DLSessionFindSingleInput, DLSessionLinkExtractedResourcesInput, DLSessionListExtractedResourcesInput, DLSessionUpdateManyExtractedResourcesInput, DLSessionUpdateSingleInput, DLSessionFindSingleSessionInput, DLSessionTaxonomyInput, GetTaxonomyDataInput, SendPatientForQCInput, DeleteSingleTaxonomyDataInput, ProjectImageSearchInput, GetPageProjectImageSearchInput, UpdateTaxonomyDataInput, UpdateMarkupDataInput, GetMarkupDataInput, ListVersionsInput, SaveAnnotationOrderInput, SaveAllAnnotationOrdersInput, GetAnnotationOrderInput, GetAllAnnotationOrdersInput } from '../trpc/routers/dLSession'

import { db } from '../infrastructures/database'
import transaction from '../infrastructures/database/transaction'
import { DateTime } from 'luxon'
import { Auth0Service } from './auth0.service'
import { CloudService } from './cloud.service'


export type TaxonomyDataInDLSessionsCreateManyArgs = {
  dLSessionId: string,
  extractedResourceId: string,
  annotationId: string,
  taxonomyData: object,
  typesInTaxonomyId:string,
  taxonomiesAnnotationsInDLSessionsId: string,
  createdBy: string,
  updatedBy: string,
}

export type TaxonomyDataInDLSessionsCreateManyArgs1 = {
  data: TaxonomyDataInDLSessionsCreateManyArgs
  skipDuplicates?: boolean
}

export enum ExtractedResourceStatusEnum {
  IN_REVIEW = 'IN_REVIEW',
  ACCEPTED = 'ACCEPTED',  
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export class DLSessionService {
  static readonly dLSessionRepository = resolve(TOKEN.dLSessionRepository)
  static readonly taxonomyInDLSessionsRepository = resolve(TOKEN.taxonomyInDLSessionsRepository)
  static readonly labelInDLSessionsRepository = resolve(TOKEN.labelInDLSessionsRepository)
  static readonly approvalModuleRepository = resolve(TOKEN.approvalModuleRepository)
  static readonly taxonomiesAnnotationsInDLSessionsRepository = resolve(TOKEN.taxonomiesAnnotationsInDLSessionsRepository)
  static readonly dLSessionJsonRepository = resolve(TOKEN.dLSessionJsonRepository)
  static readonly s3Repository = resolve(TOKEN.s3Repository)


  static async findMany(input: DLSessionFindManyInput, canViewAll: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    try {
    const findGroupIdArg = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where: {
        usersInGroup: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true
      }
    });
    const groupIdOfUser = db.userGroup.findMany(findGroupIdArg);
    const args = Prisma.validator<Prisma.DLSessionFindManyArgs>()({
      where: {
        priority: input?.filter.priority,
        projectId: input?.filter.projectId,
        deletedAt : null,
        project: {
          is: {
            deletedAt: null,
            epic : {
              is : {
                deletedAt: null
              }
            }
          }
        },
        AND: [
          {
            ...(canViewAll
              ? {}
              : {
                OR: [
                  { users: { some: { userId } } },
                  {
                    UserGroupInDLSessions: {
                      some: {
                        userGroupId: {
                          in: (await groupIdOfUser).map((d) => d.id),
                        },
                      },
                    },
                  },
                ],
              }),
          },
          {
            OR: input.search
              ? [
                  { name: { contains: input.search , mode: 'insensitive' } },
                  { description: { contains: input.search , mode: 'insensitive'} },
                ]
              : [],
          }
        ],
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })

    const countArgs = Prisma.validator<Prisma.DLSessionCountArgs>()({
      where: {
        priority: input?.filter.priority,
        projectId: input?.filter.projectId,
        deletedAt : null,
        project: {
          is: {
            deletedAt: null,
            epic : {
              is : {
                deletedAt: null
              }
            }
          }
        },
        AND: [
          {
            ...(canViewAll
              ? {}
              : {
                OR: [
                  { users: { some: { userId } } },
                  {
                    UserGroupInDLSessions: {
                      some: {
                        userGroupId: {
                          in: (await groupIdOfUser).map((d) => d.id),
                        },
                      },
                    },
                  },
                ],
              }),
          },
          {
            OR: input.search
              ? [
                  { name: { contains: input.search , mode: 'insensitive' } },
                  { description: { contains: input.search , mode: 'insensitive'} },
                ]
              : [],
          }
        ],
      },
    })

      return await Promise.all([
      this.dLSessionRepository().findMany(args),
      this.dLSessionRepository().count(countArgs),
    ])
    } catch (error) {
      throw handlePrismaReadError(error, 'Session', 'findMany')
    }
  }

  static async findSingleSession(input: DLSessionFindSingleSessionInput, canViewAll: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    
    try {
    const findGroupIdArg = Prisma.validator<Prisma.UserGroupFindManyArgs>()({
      where: {
        usersInGroup: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true
      }
    });
    
    const groupIdOfUser = db.userGroup.findMany(findGroupIdArg);
    
    const args = Prisma.validator<Prisma.DLSessionFindManyArgs>()({
      where: {
        priority: input?.filter.priority,
        id: input.filter.dLSessionId,
        projectId: input?.filter.projectId,
        AND: [
          {
            ...(canViewAll
              ? {}
              : {
                OR: [
                  { users: { some: { userId } } },
                  {
                    UserGroupInDLSessions: {
                      some: {
                        userGroupId: {
                          in: (await groupIdOfUser).map((d) => d.id),
                        },
                      },
                    },
                  },
                ],
              }),
          },
        ],
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    });
   
    const countArgs = Prisma.validator<Prisma.DLSessionCountArgs>()({
      where: {
        priority: input?.filter.priority,
        projectId: input?.filter.projectId,
        users: canViewAll
          ? undefined
          : {
              some: {
                userId,
              },
            },
      },
    });
  
    const taxonomyArgs = Prisma.validator<Prisma.TaxonomiesAnnotationsInDLSessionsFindManyArgs>()({
      where: {
        dLSessionId: input.filter.dLSessionId,
        deletedAt: null
      },
      select: {
        taxonomyId: true,
        annotationId: true,
        changeAppearance: true, 
        taxonomy: {
          select: {
            id: true,
            name: true
          }
        },
        annotation: {
          select: {
            id: true,
            name: true, 
            taxonomyType: {  
              select: {
                name: true
              }
            },
          }
        }
      }
    });
  
    const labelArgs = Prisma.validator<Prisma.LabelsInDLSessionsFindManyArgs>()({
      select: {
        label: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: {
        dLSessionId: input.filter.dLSessionId,
      }
    });
    
    const approvalArgs = Prisma.validator<Prisma.ApprovalMatrixFindManyArgs>()({
      select: {
        userGroupId: true,
        toUserId: true,
        approvalLevel: true,
        userGroup: {   
          select: {
              id: true,
              groupName: true,
          }
        }
      },
      where: {
        sessionId: input.filter.dLSessionId,
        isActive: true,
      }
    });

  
    const [rawDlSessions, count, taxonomies, labels, approvals] = await Promise.all([
      this.dLSessionRepository().findMany(args),
      this.dLSessionRepository().count(countArgs),
      this.taxonomiesAnnotationsInDLSessionsRepository().findMany(taxonomyArgs),
      this.labelInDLSessionsRepository().findMany(labelArgs),
      this.approvalModuleRepository().findMany(approvalArgs),
    ]);
  
    // Parse SOP JSON strings into objects
    const parsedDlSessions = rawDlSessions.map(session => {
      // Create a new session object with parsed SOP data
      return {
        ...session,
        sop: Array.isArray(session.sop) 
          ? session.sop.map(sopItem => {
              if (typeof sopItem === 'string') {
                try {
                  // Try to parse the SOP item as JSON
                  const parsed = JSON.parse(sopItem);
                  // Ensure the parsed object has the required structure
                  return {
                    name: parsed.name || parsed.docName || '',
                    sopLink: parsed.sopLink || parsed.link || ''
                  };
                } catch (e) {
                  // If parsing fails, use the string as the name
                  return { name: sopItem, sopLink: '' };
                }
              }
              // If it's already an object, ensure it has the right structure
              if (typeof sopItem === 'object' && sopItem !== null) {
                return {
                  name: sopItem.name || sopItem.docName || '',
                  sopLink: sopItem.sopLink || sopItem.link || ''
                };
              }
              // Default fallback
              return { name: '', sopLink: '' };
            })
          : [] // Default to empty array if sop is not an array
      };
    });
  
    // Return the parsed data
    return [
      parsedDlSessions,
      count,
      taxonomies,
      labels,
      approvals
    ];
    } catch (error) {
      throw handlePrismaReadError(error, 'Session', 'find')
    }
  }

  static async labelsAnalyseData(input: any,isAdmin: boolean, userId: string | undefined): Promise<any[]> {
    if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const sortObj = Array.isArray(input.sort) && input.sort.length > 0 ? input.sort[0] : {};
    const sortField = Object.keys(sortObj)[0] || 'name';
    const rawSortDirection = sortObj[sortField] || 'asc';
    const sortDirection = (rawSortDirection === 'desc' || rawSortDirection === 'DESC') ? 'DESC' : 'ASC';
    const allowedSortFields = ['name', 'count', 'extractedresourcecount', 'extractedResourceCount'];
    const safeSortField = allowedSortFields.includes(sortField.toLowerCase()) 
      ? sortField.toLowerCase() 
      : 'name';
    const dbSortField =
      ['count', 'extractedresourcecount'].includes(safeSortField)
        ? '"extractedResourceCount"'
        : '"name"';


    const nameFilter = Array.isArray(input.filter?.name) && input.filter.name.length > 0 ? input.filter.name : null;
    const countFilter = Array.isArray(input.filter?.extractedresourcecount) && input.filter.extractedresourcecount.length > 0 ? input.filter.extractedresourcecount : null;

  
    let nameFilterCondition = Prisma.empty;
    if (nameFilter && nameFilter.length > 0) {
      const escapedNames = nameFilter.map((n: string) => String(n).replace(/'/g, "''"));
      const nameArray = escapedNames.map((n: string) => `'${n}'`).join(', ');
      nameFilterCondition = Prisma.sql`AND array_to_string(name, ', ') = ANY(ARRAY[${Prisma.raw(nameArray)}])`;
    }

    let countFilterCondition = Prisma.empty;
    if (countFilter && countFilter.length > 0) {
      const escapedCounts = countFilter.map((c: string) => String(c).replace(/'/g, "''"));
      const countArray = escapedCounts.map((c: string) => `'${c}'`).join(', ');
      countFilterCondition = Prisma.sql`AND "extractedResourceCount"::text = ANY(ARRAY[${Prisma.raw(countArray)}])`;
    }

    const analyseQuery = Prisma.sql`
      WITH label_combinations AS (
        SELECT
          LERIDL."extractedResourceId",
          array_agg(DISTINCT LA."name" ORDER BY LA."name") AS name
        FROM
          "LabelsInExtractedResourcesInDLSessions" LERIDL
        JOIN
          "Label" LA ON LA.id = LERIDL."labelId"
        WHERE
          LERIDL."deletedAt" IS NULL
          AND LERIDL."dLSessionId" = ${input.filter.dLSessionId}
        GROUP BY
          LERIDL."extractedResourceId"
      )
      SELECT
        name,
        COUNT(*) AS "extractedResourceCount"
      FROM
        label_combinations
      WHERE
        1=1
        ${nameFilterCondition}
        ${countFilterCondition}
      GROUP BY name
      ORDER BY ${Prisma.raw(dbSortField)} ${Prisma.raw(sortDirection)}
      LIMIT ${input.limit} OFFSET ${input.offset}
    `

    const countQuery = Prisma.sql`
      SELECT COUNT(DISTINCT res.name) FROM (
        SELECT
          LERIDL."extractedResourceId",
          array_agg(DISTINCT LA."name" ORDER BY LA."name") AS name
        FROM
          "LabelsInExtractedResourcesInDLSessions" LERIDL
        JOIN
          "Label" LA ON LA.id = LERIDL."labelId"
        WHERE
          LERIDL."deletedAt" IS NULL
          AND LERIDL."dLSessionId" = ${input.filter.dLSessionId}
        GROUP BY
          LERIDL."extractedResourceId"
      ) res
      WHERE
        1=1
        ${nameFilterCondition}
        ${countFilterCondition}
    `

    const filterOptionsQuery = Prisma.sql`
      WITH label_combinations AS (
        SELECT
          LERIDL."extractedResourceId",
          array_agg(DISTINCT LA."name" ORDER BY LA."name") AS name
        FROM
          "LabelsInExtractedResourcesInDLSessions" LERIDL
        JOIN
          "Label" LA ON LA.id = LERIDL."labelId"
        WHERE
          LERIDL."deletedAt" IS NULL
          AND LERIDL."dLSessionId" = ${input.filter.dLSessionId}
        GROUP BY
          LERIDL."extractedResourceId"
      )
      SELECT
        name,
        COUNT(*)::text AS "extractedResourceCount"
      FROM
        label_combinations
      GROUP BY name
      ORDER BY name::text ASC
    `

    const [analyseData, countData, filterOptionsData] = await Promise.all([
      db.$queryRaw<any[]>(analyseQuery),
      db.$queryRaw<number>(countQuery),
      db.$queryRaw<any[]>(filterOptionsQuery).catch(() => [])
    ]);

    const distinctNames: string[] = [];
    const distinctCounts: string[] = [];
    const nameSet = new Set<string>();
    const countSet = new Set<string>();

    if (Array.isArray(filterOptionsData) && filterOptionsData.length > 0) {
      for (const row of filterOptionsData) {
        if (row?.name) {
          let nameStr: string;
          if (Array.isArray(row.name)) {
            nameStr = row.name.filter(Boolean).join(', ').trim();
          } else if (typeof row.name === 'string') {
            nameStr = row.name.trim();
          } else {
            continue;
          }
          
          if (nameStr && !nameSet.has(nameStr)) {
            nameSet.add(nameStr);
            distinctNames.push(nameStr);
          }
        }
        if (row?.extractedResourceCount != null) {
          const count = String(row.extractedResourceCount).trim();
          if (count && !countSet.has(count)) {
            countSet.add(count);
            distinctCounts.push(count);
          }
        }
      }
    }

    distinctNames.sort();
    distinctCounts.sort((a, b) => {
      const numA = parseInt(a, 10) || 0;
      const numB = parseInt(b, 10) || 0;
      return numA - numB;
    });

    return [analyseData || [], countData || 0, { name: distinctNames, extractedresourcecount: distinctCounts }];
  }

  static async analyseAnnotationData(input: any, isAdmin: boolean, userId: string | undefined): Promise<any[]> {
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const {
      sort = [{ name: 'asc' }],
      filter = {},
      limit,
      offset,
    } = input || {};
    const {
      name: nameFilter = [],
      extractedresourcecount: countFilter = [],
      dLSessionId,
    } = filter;

    const sortField = sort?.[0] ? Object.keys(sort[0])[0] : 'name';
    const sortDirection = sort?.[0]?.[sortField] || 'asc';
    const dbSortField =
      ['count', 'extractedresourcecount', 'extractedResourceCount'].includes(sortField)
        ? '"extractedResourceCount"'
        : sortField;

    let nameFilterCondition = Prisma.empty;
    if (nameFilter.length > 0) {
      const escapedNames = nameFilter.map((n: string) => n.replace(/'/g, "''"));
      const nameArray = escapedNames.map((n: string) => `'${n}'`).join(', ');
      nameFilterCondition = Prisma.sql`AND name = ANY(ARRAY[${Prisma.raw(nameArray)}])`;
    }

    let countFilterCondition = Prisma.empty;
    if (countFilter.length > 0) {
      const countArray = countFilter.map((c: string) => `'${c}'`).join(', ');
      countFilterCondition = Prisma.sql`AND "extractedResourceCount"::text = ANY(ARRAY[${Prisma.raw(countArray)}])`;
    }

    const combinedCte = Prisma.sql`
      WITH parent_counts AS (
        SELECT
          TAID.id AS "taxonomyAnnotationId",
          COUNT(DISTINCT TDDL.id)::int AS "extractedResourceCount"
        FROM "TaxonomiesAnnotationsInDLSessions" TAID
        LEFT JOIN "TaxonomyDataInDLSessions" TDDL
          ON TDDL."taxonomiesAnnotationsInDLSessionsId" = TAID.id
          AND TDDL."deletedAt" IS NULL
          AND TDDL."dLSessionId" = ${dLSessionId}
        WHERE TAID."dLSessionId" = ${dLSessionId}
          AND TAID."deletedAt" IS NULL
        GROUP BY TAID.id
      ),
      child_counts AS (
        SELECT
          TAID.id AS "taxonomyAnnotationId",
          COUNT(DISTINCT CTDID."childTaxonomyId")::int AS "childTaxonomyCount"
        FROM "TaxonomiesAnnotationsInDLSessions" TAID
        LEFT JOIN "ChildTaxonomyDataInDLSessions" CTDID
          ON CTDID."taxonomiesAnnotationsInDLSessionsId" = TAID.id
          AND CTDID."deletedAt" IS NULL
          AND CTDID."dLSessionId" = ${dLSessionId}
        WHERE TAID."dLSessionId" = ${dLSessionId}
          AND TAID."deletedAt" IS NULL
        GROUP BY TAID.id
      ),
      parent_rows AS (
        SELECT
          A.name::text AS name,
          NULL::text AS "parentAnnotationName",
          NULL::text AS "childTaxonomyName",
          COALESCE(PC."extractedResourceCount", 0)::int AS "extractedResourceCount",
          COALESCE(CC."childTaxonomyCount", 0)::int AS "childTaxonomyCount",
          false AS "isChild"
        FROM "TaxonomiesAnnotationsInDLSessions" TAID
        JOIN "Annotation" A ON A.id = TAID."annotationId"
        LEFT JOIN parent_counts PC ON PC."taxonomyAnnotationId" = TAID.id
        LEFT JOIN child_counts CC ON CC."taxonomyAnnotationId" = TAID.id
        WHERE TAID."dLSessionId" = ${dLSessionId}
          AND TAID."deletedAt" IS NULL
      ),
      child_rows AS (
        SELECT
          CT.name::text AS name,
          A.name::text AS "parentAnnotationName",
          CT.name::text AS "childTaxonomyName",
          COUNT(DISTINCT CTDID.id)::int AS "extractedResourceCount",
          COUNT(DISTINCT CTDID."childTaxonomyId")::int AS "childTaxonomyCount",
          true AS "isChild"
        FROM "ChildTaxonomy" CT
        JOIN "TaxonomiesAnnotationsInDLSessions" TAID ON TAID.id = CT."taxonomiesAnnotationsInDLSessionsId"
        JOIN "Annotation" A ON A.id = TAID."annotationId"
        LEFT JOIN "ChildTaxonomyDataInDLSessions" CTDID
          ON CTDID."childTaxonomyId" = CT.id
          AND CTDID."deletedAt" IS NULL
          AND CTDID."dLSessionId" = ${dLSessionId}
        WHERE CT."deletedAt" IS NULL
          AND CT."dLSessionId" = ${dLSessionId}
          AND TAID."deletedAt" IS NULL
          AND TAID."dLSessionId" = ${dLSessionId}
        GROUP BY CT.id, A.name, CT.name
      ),
      combined AS (
        SELECT * FROM parent_rows
        UNION ALL
        SELECT * FROM child_rows
      )
    `;

    const analyseQuery = Prisma.sql`
      ${combinedCte}
      SELECT
        name,
        "parentAnnotationName",
        "childTaxonomyName",
        "extractedResourceCount",
        "childTaxonomyCount",
        "isChild"
      FROM combined
      WHERE 1=1
        ${nameFilterCondition}
        ${countFilterCondition}
      ORDER BY ${Prisma.raw(dbSortField)} ${Prisma.raw(sortDirection)}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = Prisma.sql`
      ${combinedCte}
      SELECT COUNT(*)
      FROM combined
      WHERE 1=1
        ${nameFilterCondition}
        ${countFilterCondition}
    `;

    const filterOptionsQuery = Prisma.sql`
      ${combinedCte}
      SELECT DISTINCT ON (name)
        name,
        "extractedResourceCount"::text AS "extractedResourceCount"
      FROM combined
      WHERE name IS NOT NULL
      ORDER BY name ASC, "extractedResourceCount" DESC
    `;

    const [analyseData, countData, filterOptionsData] = await Promise.all([
      db.$queryRaw<any[]>(analyseQuery),
      db.$queryRaw<number>(countQuery),
      db.$queryRaw<any[]>(filterOptionsQuery).catch(() => []) // Graceful fallback if filter options query fails
    ]);

    const distinctNames: string[] = [];
    const distinctCounts: string[] = [];
    const nameSet = new Set<string>();
    const countSet = new Set<string>();

    if (Array.isArray(filterOptionsData) && filterOptionsData.length > 0) {
      for (const row of filterOptionsData) {
        if (row?.name && typeof row.name === 'string' && row.name.trim()) {
          const name = row.name.trim();
          if (!nameSet.has(name)) {
            nameSet.add(name);
            distinctNames.push(name);
          }
        }
        if (row?.extractedResourceCount != null) {
          const count = String(row.extractedResourceCount).trim();
          if (count && !countSet.has(count)) {
            countSet.add(count);
            distinctCounts.push(count);
          }
        }
      }
    }

    distinctNames.sort();
    distinctCounts.sort((a, b) => {
      const numA = parseInt(a, 10) || 0;
      const numB = parseInt(b, 10) || 0;
      return numA - numB;
    });

    return [analyseData || [], countData || 0, { name: distinctNames, extractedresourcecount: distinctCounts }];
  }

  static async taxonomyData(input: DLSessionTaxonomyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    const taxonomyArgs = Prisma.validator<Prisma.TaxonomiesAnnotationsInDLSessionsFindManyArgs>()({
      where: {
        dLSessionId: input.filter.dLSessionId,
        deletedAt: null
      },
      select: {
        id: true,
        changeAppearance: true,
        taxonomy: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        annotation: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            colorCode: true,
            taxonomyType: {
              select: {
                id: true,
                name: true,
                colorCode: true,
              }
            }
          }
        },
        ChildTaxonomy: {
          where: {
            extractedResourceId: input.filter.extractedResourceId,
            deletedAt: null
          },
          select: {
            id: true,
            name: true,
            dLSessionId: true,
            extractedResourceId: true,
            ChildTaxonomyDataInDLSessions: {
              where: {
                deletedAt: null,
                dLSessionId: input.filter.dLSessionId
              },
              select: {
                id: true,
                childTaxonomyId: true,
                taxonomyData: true,
                dLSessionId: true,
                index: true,
                extractedResourceId: true,
                taxonomiesAnnotationsInDLSessionsId: true,
                taxonomiesAnnotationsInDLSessions: {
              select: {
                id: true,
                annotationId: true,
                annotation: {
                  select: {
                    id: true,
                    colorCode: true
                  }
                }
              }
            }
              }
            }
          }
        },
        annotationId: true,
        taxonomyId: true
      }
    });
    
    // Fetch annotation orders from database (user-specific and session-specific)
    let orderMap: Record<string, number> = {};
    let taxonomyOrderMap: Record<string, number> = {}; // Map of taxonomyId -> taxonomyOrder (groupId)
    try {
      // First, get all valid annotation IDs for this session to ensure we only load orders for existing annotations
      const validAnnotationIds = await db.taxonomiesAnnotationsInDLSessions.findMany({
        where: {
          dLSessionId: input.filter.dLSessionId,
          deletedAt: null,
        },
        select: {
          id: true,
          taxonomyId: true, // Also get taxonomyId to map to taxonomyOrder
        },
      });
      
      const validIdsSet = new Set(validAnnotationIds.map(a => a.id));
      const annotationToTaxonomyMap = new Map(validAnnotationIds.map(a => [a.id, a.taxonomyId]));
      
      // Fetch annotation orders for this user and session (including taxonomyOrder/groupId)
      const orderEntries = await db.userSessionAnnotationOrder.findMany({
        where: {
          dLSessionId: input.filter.dLSessionId,
          userId, // Filter by userId to get this user's specific order
          annotationId: { not: null }, // Only get annotation orders, not taxonomy orders
        },
        select: {
          annotationId: true,
          order: true,
          taxonomyOrder: true, // Get taxonomyOrder (groupId) for sorting groups
        },
        orderBy: {
          order: 'asc',
        },
      });
      
      // Create a map of annotationId -> order for quick lookup
      // annotationId here refers to TaxonomiesAnnotationsInDLSessions.id
      // Only include orders for annotations that still exist in the session
      orderEntries.forEach((entry: { annotationId: string | null; order: number; taxonomyOrder: number | null }) => {
        if (entry.annotationId && validIdsSet.has(entry.annotationId)) {
          orderMap[entry.annotationId] = entry.order;
          
          // Map taxonomyId to taxonomyOrder (groupId) for group sorting
          // All annotations in the same taxonomy should have the same taxonomyOrder
          if (entry.taxonomyOrder !== null && entry.taxonomyOrder !== undefined) {
            const taxonomyId = annotationToTaxonomyMap.get(entry.annotationId);
            if (taxonomyId && !taxonomyOrderMap[taxonomyId]) {
              taxonomyOrderMap[taxonomyId] = entry.taxonomyOrder;
            }
          }
        }
      });
    } catch (error) {
      // If order doesn't exist, that's fine - will use default sorting
      console.debug('Error loading annotation orders:', error);
    }
    
    // Transform function to handle the matching in memory
    const transformResult = (result: any[], annotationOrderMap: Record<string, number>, taxonomyOrderMap: Record<string, number>) => {
      const groupedByTaxonomy = result.reduce((acc, item) => {
        const taxonomyId = item.taxonomy.id;
        if (!acc[taxonomyId]) {
          acc[taxonomyId] = {
            taxonomy: {
              id: item.taxonomy.id,
              name: item.taxonomy.name,
              typesInTaxonomies: []
            }
          };
        }

          // Transform ChildTaxonomy to match desired structure
          const transformedChildTaxonomy = (item.ChildTaxonomy || []).map(child => ({
            ...child,
            id: child.id,
            name: child.name,
            dLSessionId: child.dLSessionId,
            extractedResourceId: child.extractedResourceId,
            ChildTaxonomyDataInDLSessions: child.ChildTaxonomyDataInDLSessions
          }));
    
          acc[taxonomyId].taxonomy.typesInTaxonomies.push({
            id: item.id,  
            name: item.annotation.name,
            abbreviation: item.annotation.abbreviation,
            colorCode: item.annotation.colorCode|| item.annotation?.taxonomyType?.colorCode || '',
            taxonomyType: item.annotation?.taxonomyType,
            taxonomiesAnnotationsInDLSessionsId: item.id,
            changeAppearance: item.changeAppearance,
            ChildTaxonomy: transformedChildTaxonomy
          });
        
        return acc;
      }, {} as Record<string, any>);
    
      // Sort typesInTaxonomies by saved order for each taxonomy
      const taxonomies = Object.values(groupedByTaxonomy);
      taxonomies.forEach((taxonomy: any) => {
        if (taxonomy.taxonomy?.typesInTaxonomies) {
          taxonomy.taxonomy.typesInTaxonomies.sort((a: any, b: any) => {
            const orderA = annotationOrderMap[a.taxonomiesAnnotationsInDLSessionsId] || 9999;
            const orderB = annotationOrderMap[b.taxonomiesAnnotationsInDLSessionsId] || 9999;
            return orderA - orderB;
          });
        }
      });
    
      // Sort taxonomies by their taxonomyOrder (groupId) to preserve group order
      taxonomies.sort((a: any, b: any) => {
        const taxonomyIdA = a.taxonomy?.id;
        const taxonomyIdB = b.taxonomy?.id;
        const orderA = taxonomyIdA ? (taxonomyOrderMap[taxonomyIdA] ?? 9999) : 9999;
        const orderB = taxonomyIdB ? (taxonomyOrderMap[taxonomyIdB] ?? 9999) : 9999;
        return orderA - orderB;
      });
    
      return taxonomies;
    }
    
    // Add input validation
    if (!input.filter.dLSessionId || !input.filter.extractedResourceId) {
      throw new Error('dLSessionId and extractedResourceId are required');
    }
    
    try {
      const result = await this.taxonomiesAnnotationsInDLSessionsRepository().findMany(taxonomyArgs);
      return result.length > 0 ? [transformResult(result, orderMap, taxonomyOrderMap)] : [];
    } catch (error) {
      console.error('Error in taxonomyData:', error);
      throw error;
    }

  }

  static async find(input: DLSessionFindSingleInput, canViewAll: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    try {
    const args = Prisma.validator<Prisma.DLSessionFindUniqueArgs>()({
      where: {
        id: input,
      },
    })

    const approvalLevelArgs = Prisma.validator<Prisma.ApprovalMatrixFindManyArgs>()({
      select: {
        approvalLevel: true
      },
      where: {
        toUserId: userId,
        sessionId: input,
        isActive: true
      },
      orderBy:{
        approvalLevel: 'asc'
      }
    })

    const userGroupArgs = Prisma.validator<Prisma.UserGroupInDLSessionsFindManyArgs>()({
      where: {
        dLSessionId: input,
        deletedAt: null
      },
      select: {
        userGroupId: true,
        userRole: true
      }
    })

    const userGroupInDLSession = await db.userGroupInDLSessions.findMany(userGroupArgs);
    const approvalLevel = await this.approvalModuleRepository().findMany(approvalLevelArgs)
    const dLSession: any = await this.dLSessionRepository().findOne(args)
      
      if (!dLSession) {
        throw new TRPCError({ 
          code: 'NOT_FOUND', 
          message: 'The session you are looking for does not exist.' 
        })
      }

    if (userGroupInDLSession.length > 0) {
      const argForUserGroup = Prisma.validator<Prisma.UsersInUserGroupFindManyArgs>()({
        where: {
          deletedAt: null,
          userGroupId: {
            in: userGroupInDLSession.map((e: any) => e.userGroupId),
          },
        },
      });
  
      const userListForUserGroup = await db.usersInUserGroup.findMany(argForUserGroup);
      userListForUserGroup.forEach((e: any) => {
        e['userRole'] = userGroupInDLSession.filter((element: any)=> element.userGroupId == e.userGroupId)[0].userRole;
        dLSession.users.push(e);
      });
    }
    
    if (approvalLevel[0]) {
      dLSession['approvalLevel'] = approvalLevel
    }

    if (canViewAll || dLSession?.users.some((user: any) => user.userId === userId))
      return dLSession
    else
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw handlePrismaReadError(error, 'Session', 'find')
    }
  }

  static async create(input: DLSessionCreateSingleInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    
    // Process user and group data
    const groupList = input.users.filter((element) => !element.userId.includes('auth0'));
    const userList = input.users.filter((element: any) => element.userId.includes('auth0'));
    let FormattedGroup: any = [];
    groupList.map((e: any) => {
      FormattedGroup.push({
        userGroupId: e.userId,
        userRole: e.userRole,
        createdBy: userId,
        updatedBy: userId
      });
    });
  
    // Initialize taxonomy data structures
    let taxonomyAnnotationsData: any[] = [];
    let taxonomyMap: Record<string, string> = {}; // For mapping input taxonomy IDs to database IDs
    
    // Step 1: Process taxonomies if they exist in the input
    if (input.taxonomies && input.taxonomies.length > 0) {
      // Create new taxonomies and store ID mappings
      for (const taxonomy of input.taxonomies) {
        // Skip if no taxonomyName is provided
        if (!taxonomy.taxonomyName) {
          console.warn('Skipping taxonomy without name');
          continue;
        }
        
        // Create new taxonomy
        const newTaxonomy = await db.taxonomy.create({
          data: {
            name: taxonomy.taxonomyName

          }
        });
        
        // Store mapping between input ID and database ID
        taxonomyMap[taxonomy.taxonomyId] = newTaxonomy.id;
      }
      
      // Step 2: Process taxonomy annotations
      for (const taxonomy of input.taxonomies) {
        // Skip if no valid annotations
        if (!taxonomy.annotations || !taxonomy.taxonomyId) {
          console.warn('Skipping invalid taxonomy annotations');
          continue;
        }
        
        // Get database taxonomy ID from the mapping
        const databaseTaxonomyId = taxonomyMap[taxonomy.taxonomyId];
        
        // Skip if taxonomy ID not found in mapping
        if (!databaseTaxonomyId) {
          console.warn(`Warning: No database ID found for taxonomy ${taxonomy.taxonomyId}`);
          continue;
        }
        
        // Process each annotation
        for (const annotationId of taxonomy.annotations) {
          // Create annotation data
          const annotationData = {
            taxonomyId: databaseTaxonomyId,
            annotationId: annotationId,
            createdBy: userId,
            updatedBy: userId,
            // Add appearance flag if specified
            changeAppearance: taxonomy.changeAppearance?.includes(annotationId) || false
          };
          
          // Add to collection
          taxonomyAnnotationsData.push(annotationData);
        }
      }
    }
    
    // Debug: Log sessionLabelIds to verify data is received
    
    // Prepare session creation arguments
    const sessionLabelsData = input.sessionLabelIds && input.sessionLabelIds.length > 0 
      ? input.sessionLabelIds.map(sessionLabelId => ({
          sessionLabelId,
          isActive: true,
        }))
      : [];
    
    // Prepare session status data
    // If sessionStatusId is not provided, default to "Yet To Do" status
    let finalSessionStatusId = input.sessionStatusId;
    if (!finalSessionStatusId) {
      // Query for "Yet To Do" status with case-insensitive matching
      // Fetch all statuses and filter in JavaScript for reliable case-insensitive exact matching
      const allStatuses = await db.sessionStatus.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      
      // Find status with name matching "Yet To Do" (case-insensitive)
      const yetToDoStatus = allStatuses.find(
        (status) => status.name.toLowerCase().trim() === 'yet to do'
      );
      
      if (yetToDoStatus) {
        finalSessionStatusId = yetToDoStatus.id;
      }
      // If no status found, we'll leave it undefined and not create a status
    }
    
    const sessionStatusData = finalSessionStatusId 
      ? {
          sessionStatusId: finalSessionStatusId,
          isActive: true,
        }
      : undefined;
    
    
    const args = Prisma.validator<Prisma.DLSessionCreateArgs>()({
      data: {
        name: input.name,
        description: input.description,
        priority: input.priority,
        sop: input.sop.map(item => JSON.stringify(item)),
        projectId: input.projectId,
        users: {
          createMany: {
            data: userList,
          },
        },
        UserGroupInDLSessions: FormattedGroup.length > 0 ? {
          createMany: {
            data: FormattedGroup,
          }
        } : undefined,
        labels: input.labelIds && input.labelIds.length > 0 ? {
          createMany: {
            data: input.labelIds.map(labelId => ({
              labelId,
            })),
          },
        } : undefined,
        sessionLabels: sessionLabelsData.length > 0 ? {
          createMany: {
            data: sessionLabelsData,
          },
        } : undefined,
        sessionStatusInDLSessions: sessionStatusData ? {
          create: sessionStatusData,
        } : undefined,
        // Add taxonomy annotations data if available
        taxonomiesAnnotationsInDLSessions: taxonomyAnnotationsData.length > 0 ? {
          createMany: {
            data: taxonomyAnnotationsData
          }
        } : undefined,
      },
    });
    
    // Process code types
    const codeTypes = [
      { key: 'anatomyPlaneCode', dbModel: db.anatomyPlaneCode },
      { key: 'centerCode', dbModel: db.centerCode },
      { key: 'projectCode', dbModel: db.projectCode },
      { key: 'subProjectCode', dbModel: db.subProjectCode },
      { key: 'useCaseCode', dbModel: db.useCaseCode },
      { key: 'userTypeCode', dbModel: db.userTypeCode }
    ];
    
    for (const { key, dbModel } of codeTypes) {
      const codeValue = input.masterValue?.[key];
      if (codeValue) {
        const argForNewMasterValue = Prisma.validator<Prisma.ProjectCodeCreateArgs>()({
          data: {
            name: codeValue
          }
        });
        await dbModel.create(argForNewMasterValue);
      }
    }
    
    // Create the DL session
    let dlSessionCreate;
    try {
      dlSessionCreate = await this.dLSessionRepository().create(args);
    } catch (error: any) {
      throw handlePrismaError(error, 'Session', input, { action: 'create' })
    }
    
    // Fallback: Create session labels separately if they weren't created via nested create
    if (sessionLabelsData.length > 0) {
      try {
        // Check if session labels were created (only active ones)
        const createdSessionLabels = await db.sessionLabelsInDLSessions.findMany({
          where: {
            dLSessionId: dlSessionCreate.id,
            isActive: true,
          },
        });  
        // If no session labels were created, create them manually
        if (createdSessionLabels.length === 0) {
          await db.sessionLabelsInDLSessions.createMany({
            data: sessionLabelsData.map(item => ({
              ...item,
              dLSessionId: dlSessionCreate.id,
              isActive: true,
            })),
            skipDuplicates: true,
          });
        }
      } catch (error) {
        // Try to create them manually as fallback
        try {
          await db.sessionLabelsInDLSessions.createMany({
            data: sessionLabelsData.map(item => ({
              ...item,
              dLSessionId: dlSessionCreate.id,
              isActive: true,
            })),
            skipDuplicates: true,
          });
        } catch (fallbackError) {
        }
      }
    }
    
    // Process approval matrix
    let sessionTypeId = 1;
    await this.approvalModuleRepository().InsertApprovalMatrix(
      input.approval,
      dlSessionCreate.id,
      sessionTypeId,
      userId,
      false
    );
    
    return dlSessionCreate;
  }
  
  static async update(
    input: DLSessionUpdateSingleInput, 
    isAdmin: boolean, 
    userId: string | undefined,
    confirmTaxonomyDeletion: boolean = false 
  ) {

    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    
    let copyInput = input;
    const groupList = copyInput.users?.filter((element) => !element.userId.includes('auth0'));
    const userList = copyInput.users?.filter((element: any) => element.userId.includes('auth0'));
    
    let FormattedGroup: UserGroupInput[] = []
    groupList?.forEach((e) => {
      FormattedGroup.push({
        userGroupId: e.userId,
        userRole: e.userRole,
        createdBy: userId,
        updatedBy: userId
      })
    });

    // Helper function for quick taxonomy signature comparison
    const createTaxonomySignature = async (taxonomies: TaxonomyInput[]): Promise<string> => {
      const signatures = [];
      
      for (const taxonomy of taxonomies) {
        let taxonomyId = taxonomy.taxonomyId;
        
        if (!taxonomyId) {
          signatures.push(`new-${taxonomy.taxonomyName}-${taxonomy.annotations?.join(',') || ''}-${taxonomy.changeAppearance?.join(',') || ''}`);
        } else {
          // FIX: Include taxonomyName in signature for existing taxonomies
          for (const annotationId of taxonomy.annotations || []) {
            const changeAppearance = taxonomy.changeAppearance?.includes(annotationId) || false;
            signatures.push(`${taxonomyId}-${taxonomy.taxonomyName}-${annotationId}-${changeAppearance}`);
          }
        }
      }
      
      return signatures.sort().join('|');
    };
  
    // Helper function for full taxonomy processing (only when needed)
    const processFullTaxonomyData = async (taxonomies: TaxonomyInput[]): Promise<any[]> => {
      const taxonomyAnnotationsData: TaxonomyAnnotation[] = [];
      
      // Process taxonomies in batches to avoid timeout
      const BATCH_SIZE = 10;
      const taxonomyBatches:TaxonomyInput[] = [];
      
      for (let i = 0; i < taxonomies.length; i += BATCH_SIZE) {
        taxonomyBatches.push(taxonomies.slice(i, i + BATCH_SIZE));
      }
      
      for (const batch of taxonomyBatches) {
        const batchData = await Promise.all(
          batch.map(async (taxonomy) => {
            let taxonomyId = taxonomy.taxonomyId;

            // First check if taxonomyId is null or undefined
            if (!taxonomyId) {
              // Create new taxonomy since no ID was provided
              const newTaxonomy = await db.taxonomy.create({
                data: {
                  name: taxonomy.taxonomyName
                }
              });
              taxonomyId = newTaxonomy.id;
            } else {
              // If we have an ID, check if it exists
              const existingTaxonomy = await db.taxonomy.findUnique({
                where: { id: taxonomyId }
              });
              
              if (!existingTaxonomy) {
                // ID was provided but taxonomy doesn't exist
                const newTaxonomy = await db.taxonomy.create({
                  data: {
                    name: taxonomy.taxonomyName
                  }
                });
                taxonomyId = newTaxonomy.id;
              } else if (existingTaxonomy.name !== taxonomy.taxonomyName) {
                // Update the name if it has changed
                await db.taxonomy.update({
                  where: { id: taxonomyId },
                  data: { name: taxonomy.taxonomyName }
                });
              }
            }
  
            return taxonomy.annotations?.map(annotationId => ({
              taxonomyId: taxonomyId,
              annotationId: annotationId,
              dLSessionId: input.id,
              createdBy: userId,
              updatedBy: userId,
              changeAppearance: taxonomy.changeAppearance?.includes(annotationId) || false
            })) || [];
          })
        );
        
        taxonomyAnnotationsData.push(...batchData.flat());
      }
      
      return taxonomyAnnotationsData;
    };
  
    // Check if taxonomies field is explicitly provided (including empty array)
    const shouldUpdateTaxonomies = 'taxonomies' in input;
    
    // Early taxonomy change detection
    let taxonomyAnnotationsData: TaxonomyAnnotation[] = [];
    let taxonomyChangesDetected = false;
    let requiresConfirmation = false;
    let confirmationData: any = null;
  
    if (shouldUpdateTaxonomies) {
      // Quick database comparison first
      const currentTaxonomyCount = await db.taxonomiesAnnotationsInDLSessions.count({
        where: {
          dLSessionId: input.id,
          deletedAt: null
        }
      });
  
      const newTaxonomyCount = input.taxonomies?.reduce((total, taxonomy) => {
        return total + (taxonomy.annotations?.length || 0);
      }, 0) || 0;
  
      // If counts differ, we definitely have changes
      if (currentTaxonomyCount !== newTaxonomyCount) {
        taxonomyChangesDetected = true;
      } else if (currentTaxonomyCount === 0 && newTaxonomyCount === 0) {
        taxonomyChangesDetected = false;
      } else {
        // Quick content comparison if counts are the same
        const existingTaxonomyData = await db.taxonomiesAnnotationsInDLSessions.findMany({
          where: {
            dLSessionId: input.id,
            deletedAt: null
          },
          select: {
            taxonomyId: true,
            annotationId: true,
            changeAppearance: true
          },
          orderBy: [
            { taxonomyId: 'asc' },
            { annotationId: 'asc' }
          ]
        });
  
        // Create comparable data structures
        const existingSignature = existingTaxonomyData
          .map(item => `${item.taxonomyId}-${item.annotationId}-${item.changeAppearance}`)
          .sort()
          .join('|');
  
        // Pre-process new taxonomy data for comparison (minimal processing)
        const newTaxonomySignature = await createTaxonomySignature(input.taxonomies || []);
        
        if (existingSignature !== newTaxonomySignature) {
          taxonomyChangesDetected = true;
        } else {
          taxonomyChangesDetected = false;
        }
      }
  
      // Only process full taxonomy data if changes are detected
      if (taxonomyChangesDetected) {
        // Now do the full processing since we know there are changes
        taxonomyAnnotationsData = await processFullTaxonomyData(input.taxonomies || []);
  
        // Only check for confirmation if we have changes and not already confirmed
        if (!confirmTaxonomyDeletion) {
          try {
            const taxonomyResult = await DLSessionService.updateTaxonomyAnnotations(
              input.id,
              taxonomyAnnotationsData,
              userId,
              false, // Don't confirm deletion yet, just check
              true
            );
  
            if (taxonomyResult.requiresConfirmation) {
              requiresConfirmation = true;
              confirmationData = taxonomyResult.annotationsToDelete;
            }
          } catch (error) {
            console.error('Failed to validate taxonomy updates:', error);
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Failed to validate taxonomy updates: ${error.message}`
            });
          }
        }
      }
    }
  
    // Early return if confirmation is needed
    if (requiresConfirmation) {
      return {
        requiresConfirmation: true,
        taxonomyConfirmation: confirmationData,
        message: 'Taxonomy deletion requires confirmation due to related records'
      };
    }
  
    // Build the main update arguments
    const args = Prisma.validator<Prisma.DLSessionUpdateArgs>()({
      where: {
        id: copyInput.id,
      },
      data: {
        ...(copyInput.name !== undefined && { name: copyInput.name }),
        ...(copyInput.description !== undefined && { description: copyInput.description }),
        ...(copyInput.priority !== undefined && { priority: copyInput.priority }),
        ...(copyInput.sop !== undefined && { sop: copyInput.sop.map(item => JSON.stringify(item)) }),
        ...(copyInput.projectId !== undefined && { projectId: copyInput.projectId }),
        users: userList
          ? {
            deleteMany: {},
            createMany: {
              data: userList,
            },
          }
          : undefined,
        UserGroupInDLSessions: FormattedGroup
          ? {
            updateMany: {
              where: {
                dLSessionId: copyInput.id
              },
              data: {
                deletedAt: DateTime.now().toJSDate()
              }
            },
            createMany: {
              data: FormattedGroup,
            },
          }
          : undefined,
        labels: copyInput.labelIds
          ? {
            deleteMany: {},
            createMany: {
              data: copyInput.labelIds?.map(labelId => ({
                labelId,
              })),
              skipDuplicates: true,
            },
          }
          : undefined,
        sessionLabels: copyInput.sessionLabelIds !== undefined
          ? {
            updateMany: {
              where: {
                dLSessionId: copyInput.id,
              },
              data: {
                isActive: false,
              },
            },
            createMany: copyInput.sessionLabelIds && copyInput.sessionLabelIds.length > 0 ? {
              data: copyInput.sessionLabelIds.map(sessionLabelId => ({
                sessionLabelId,
                isActive: true,
              })),
              skipDuplicates: true,
            } : undefined,
          }
          : undefined,
      },
    });

    try {
      let updatedSession;
      
      // STEP 1: Check approval changes OUTSIDE transaction (faster, doesn't block)
      let approvalHasChanges = false;
      let approvalNeedsUpdate = false;
      
      if (input.approval) {
        // Get existing ApprovalMatrix entries BEFORE transaction
        const existingApprovalMatrix = await this.approvalModuleRepository().findMany({
          where: {
            sessionId: input.id,
            isActive: true
          },
          select: {
            approvalLevel: true,
            toUserId: true
          }
        });

        // Build existing approval structure: { level: Set<userIds> }
        const existingByLevel = new Map<number, Set<string>>();
        existingApprovalMatrix.forEach((matrix: any) => {
          if (!existingByLevel.has(matrix.approvalLevel)) {
            existingByLevel.set(matrix.approvalLevel, new Set<string>());
          }
          existingByLevel.get(matrix.approvalLevel)!.add(matrix.toUserId);
        });

        // Build incoming approval structure: { level: Set<userIds> }
        // Need to expand groups to individual users for proper comparison
        const incomingByLevel = new Map<number, Set<string>>();
        if (Array.isArray(input.approval)) {
          // Identify group IDs (those without 'auth0|' prefix)
          const groupIds = input.approval.flat().filter((id: any) => id && !id.includes('auth0|'));
          
          // Fetch users from groups if any groups exist
          let groupUsersMap = new Map<string, string[]>();
          if (groupIds.length > 0) {
            const usersInGroups = await db.usersInUserGroup.findMany({
              where: {
                deletedAt: null,
                userGroupId: { in: groupIds }
              },
              select: {
                userId: true,
                userGroupId: true
              }
            });
            
            // Build map: groupId -> [userIds]
            usersInGroups.forEach(ug => {
              if (!groupUsersMap.has(ug.userGroupId)) {
                groupUsersMap.set(ug.userGroupId, []);
              }
              groupUsersMap.get(ug.userGroupId)!.push(ug.userId);
            });
          }
          
          // Build incoming structure with groups expanded to users
          input.approval.forEach((levelUsers, index) => {
            const level = index + 1; // Levels are 1-indexed
            if (Array.isArray(levelUsers) && levelUsers.length > 0) {
              const expandedUsers = new Set<string>();
              levelUsers.forEach((id: string) => {
                if (id.includes('auth0|')) {
                  // Individual user
                  expandedUsers.add(id);
                } else {
                  // Group - expand to users
                  const groupUsers = groupUsersMap.get(id) || [];
                  groupUsers.forEach(userId => expandedUsers.add(userId));
                }
              });
              if (expandedUsers.size > 0) {
                incomingByLevel.set(level, expandedUsers);
              }
            }
          });
        }

        // Compare existing vs incoming
        if (existingByLevel.size !== incomingByLevel.size) {
          approvalHasChanges = true;
        } else {
          // Check if users at each level match
          for (const [level, incomingUsers] of incomingByLevel.entries()) {
            const existingUsers = existingByLevel.get(level);
            if (!existingUsers || 
                existingUsers.size !== incomingUsers.size ||
                !Array.from(incomingUsers).every(userId => existingUsers.has(userId))) {
              approvalHasChanges = true;
              break;
            }
          }
          
          // Check if any existing levels were removed
          if (!approvalHasChanges) {
            for (const [level, existingUsers] of existingByLevel.entries()) {
              const incomingUsers = incomingByLevel.get(level);
              if (!incomingUsers || 
                  incomingUsers.size !== existingUsers.size ||
                  !Array.from(existingUsers).every(userId => incomingUsers.has(userId))) {
                approvalHasChanges = true;
                break;
              }
            }
          }
        }
        
        approvalNeedsUpdate = approvalHasChanges;
      }

      // STEP 2: Main transaction (only for session update, no approval processing)
      try {
      updatedSession = await db.$transaction(async (tx) => {
        // Update main session only
        return await this.dLSessionRepository().update(args);
      }, {
        timeout: 15000, // Reduced timeout since we removed heavy operations
      });
      } catch (error) {
        // Handle Prisma errors from the update operation
        throw handlePrismaError(error, 'Session', input, { action: 'update' })
      }
      
      // STEP 3: Update approval matrix OUTSIDE transaction (parallel with other operations)
      if (approvalNeedsUpdate) {
        const sessionTypeId = 1;
        // This runs outside transaction, so it won't block the main update
        await this.approvalModuleRepository().InsertApprovalMatrix(
          input.approval,
          input.id,
          sessionTypeId,
          userId,
          true
        );
      }
      
      // Optimized session labels update (single function, no duplication)
      if (copyInput.sessionLabelIds !== undefined) {
        try {
          const sessionLabelIds = copyInput.sessionLabelIds || [];
          
          if (sessionLabelIds.length === 0) {
            // If empty array, soft delete all session labels
            await db.sessionLabelsInDLSessions.updateMany({
              where: { dLSessionId: input.id },
              data: { isActive: false },
            });
          } else {
            // Get all existing session labels for this session (including soft-deleted)
            const existingSessionLabels = await db.sessionLabelsInDLSessions.findMany({
              where: {
                dLSessionId: input.id,
              },
            });
            
            // Create maps for faster lookup
            const existingById = new Map<string, typeof existingSessionLabels[0]>();
            existingSessionLabels.forEach(sl => {
              existingById.set(sl.sessionLabelId, sl);
            });
            
            const incomingIds = new Set(sessionLabelIds);
            const toReactivate: string[] = [];
            const toCreate: Array<{ sessionLabelId: string; dLSessionId: string; isActive: boolean }> = [];
            const toDeactivate: string[] = [];
            
            // Process incoming labels
            for (const sessionLabelId of sessionLabelIds) {
              const existing = existingById.get(sessionLabelId);
              if (existing) {
                if (!existing.isActive) {
                  toReactivate.push(sessionLabelId);
                }
                // If already active, no action needed
              } else {
                toCreate.push({
                  sessionLabelId,
                  dLSessionId: input.id,
                  isActive: true
                });
              }
            }
            
            // Find labels to deactivate (exist but not in incoming list)
            for (const existing of existingSessionLabels) {
              if (!incomingIds.has(existing.sessionLabelId) && existing.isActive) {
                toDeactivate.push(existing.sessionLabelId);
              }
            }
            
            // Execute all updates in parallel where possible
            const updatePromises: Promise<any>[] = [];
            
            if (toDeactivate.length > 0) {
              updatePromises.push(
                db.sessionLabelsInDLSessions.updateMany({
                  where: {
                    dLSessionId: input.id,
                    sessionLabelId: { in: toDeactivate },
                  },
                  data: { isActive: false },
                })
              );
            }
            
            if (toReactivate.length > 0) {
              updatePromises.push(
                db.sessionLabelsInDLSessions.updateMany({
                  where: {
                    dLSessionId: input.id,
                    sessionLabelId: { in: toReactivate },
                  },
                  data: { isActive: true },
                })
              );
            }
            
            if (toCreate.length > 0) {
              updatePromises.push(
                db.sessionLabelsInDLSessions.createMany({
                  data: toCreate,
                  skipDuplicates: true,
                })
              );
            }
            
            // Execute all updates in parallel
            await Promise.all(updatePromises);
          }
        } catch (error) {
          console.error('Failed to update session labels:', error);
          // Don't throw - session update succeeded, labels are secondary
          // Log error for monitoring but don't fail the entire update
        }
      }
    
      // Handle session status updates
      if (input.sessionStatusId !== undefined) {
        try {
          if (input.sessionStatusId === null || input.sessionStatusId === '') {
            // Deactivate all session statuses if null/empty is provided
            await db.sessionStatusInDLSessions.updateMany({
              where: { dLSessionId: input.id },
              data: { isActive: false },
            });
          } else {
            // Always create a new entry and deactivate all existing statuses
            await db.$transaction([
              // Deactivate all existing statuses for this session
              db.sessionStatusInDLSessions.updateMany({
                where: { dLSessionId: input.id },
                data: { isActive: false },
              }),
              // Create new session status entry
              db.sessionStatusInDLSessions.create({
                data: {
                  dLSessionId: input.id,
                  sessionStatusId: input.sessionStatusId,
                  isActive: true,
                },
              }),
            ]);
          }
        } catch (error) {
          console.error('Failed to update session status:', error);
          // Don't throw - session update succeeded, status is secondary
        }
      }
    
      // Only update taxonomies if changes were detected
      if (shouldUpdateTaxonomies && taxonomyChangesDetected) {
        await DLSessionService.updateTaxonomyAnnotations(
          input.id,
          taxonomyAnnotationsData,
          userId,
          confirmTaxonomyDeletion,
          true
        );
      }
  
      return updatedSession;

    } catch (error) {
      console.error('Failed to update session:', error);
      
      // Handle specific timeout errors
      if (error.message && (error.message.includes('timeout') || error.message.includes('expired transaction'))) {
        throw new TRPCError({
          code: 'TIMEOUT',
          message: 'The operation took too long to complete. Please try again or contact support if the issue persists.'
        });
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to update session: ${error.message}`
      });
    }
  }

  static async delete(input: DLSessionDeleteSingleInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    try {
    const args = Prisma.validator<Prisma.DLSessionUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: {
        deletedAt: input.deletedAt
      }
    })
      return await this.dLSessionRepository().update(args)
    } catch (error) {
      throw handlePrismaError(error, 'Session', undefined, { action: 'delete' })
    }
  }

  // Helper: Check and handle duplicate extracted resources
  static async checkAndFilterDuplicates(
    dLSessionId: string,
    extractedResources: DLSessionLinkExtractedResourcesInput['extractedResources'],
    skipDuplicates: boolean,
    returnDuplicateInfo: boolean
  ): Promise<{
    resourcesToProcess: DLSessionLinkExtractedResourcesInput['extractedResources'];
    duplicateInfo?: any;
  }> {
    const extractedResourceIds = extractedResources.map(r => r.id).filter(Boolean);
    let duplicateResourceIds: string[] = [];
    let resourcesToProcess = extractedResources;
    
    if (extractedResourceIds.length > 0) {
      const uniqueResourceIds = Array.from(new Set(extractedResourceIds));
      
      const statusCount = await db.extractedResourcesInDLSessions.groupBy({
        by: ['status'],
        where: {
          dLSessionId,
          extractedResourceId: {
            in: uniqueResourceIds,
          },
        },
        _count: {
          _all: true,
        },
      });
      
      const statusCounts: Record<ExtractedResourceStatusEnum, number> = {
        [ExtractedResourceStatusEnum.IN_REVIEW]: 0,
        [ExtractedResourceStatusEnum.ACCEPTED]: 0,
        [ExtractedResourceStatusEnum.PENDING]: 0,
        [ExtractedResourceStatusEnum.REJECTED]: 0,
      };
      
      let totalExisting = 0;
      
      statusCount.forEach((row) => {
        statusCounts[row.status as ExtractedResourceStatusEnum] = Number(row._count._all);
        totalExisting += Number(row._count._all);
      });

      const existingResources = await db.extractedResourcesInDLSessions.findMany({
        where: {
          dLSessionId,
          extractedResourceId: {
            in: uniqueResourceIds,
          },
        },
        select: {
          extractedResourceId: true,
        },
      });

      duplicateResourceIds = Array.from(new Set(existingResources.map(r => r.extractedResourceId)));

      if (returnDuplicateInfo) {
        return {
          resourcesToProcess: [],
          duplicateInfo: {
            hasDuplicates: totalExisting > 0,
            duplicateCount: totalExisting,
            duplicateResourceIds,
            statusCounts,
            count: 0,
          },
        };
      }
      
      if (totalExisting > 0) {
        if (!skipDuplicates) {
          const parts: string[] = [];
        
          if (statusCounts[ExtractedResourceStatusEnum.PENDING])
            parts.push(`PENDING: ${statusCounts[ExtractedResourceStatusEnum.PENDING]}`);
          if (statusCounts[ExtractedResourceStatusEnum.IN_REVIEW])
            parts.push(`IN_REVIEW: ${statusCounts[ExtractedResourceStatusEnum.IN_REVIEW]}`);
          if (statusCounts[ExtractedResourceStatusEnum.REJECTED])
            parts.push(`REJECTED: ${statusCounts[ExtractedResourceStatusEnum.REJECTED]}`);
          if (statusCounts[ExtractedResourceStatusEnum.ACCEPTED])
            parts.push(`ACCEPTED: ${statusCounts[ExtractedResourceStatusEnum.ACCEPTED]}`);

          const errorMessage = parts.length
            ? `The extracted resources already exist in this session. Status: ${parts.join(', ')}`
            : `The extracted resources already exist in this session.`;
          
          throw new Error(errorMessage);
        }
        
        resourcesToProcess = extractedResources.filter(r => !duplicateResourceIds.includes(r.id));
      }
    }

    return { resourcesToProcess };
  }

  // Helper: Validate extracted resources structure (legacy keys, taxonomyData)
  static validateExtractedResourcesStructure(
    resources: DLSessionLinkExtractedResourcesInput['extractedResources'],
    filename: string
  ): void {
    for (const resource of resources) {
      // Check for legacy labelIds usage
      if (resource.labelIds && Array.isArray(resource.labelIds) && resource.labelIds.length > 0) {
        // If labelIds exists but labels is missing or empty, this is legacy JSON
        if (!resource.labels || !Array.isArray(resource.labels) || resource.labels.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `The uploaded JSON file "${filename}" uses legacy field "labelIds". Please use "labels": [{ "id": "<label-uuid>" }] instead.`
          });
        }
        // If both exist, prefer labels but warn - for now, we'll fail to avoid ambiguity
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `The uploaded JSON file "${filename}" contains both "labels" and "labelIds". Please use only "labels": [{ "id": "<label-uuid>" }].`
        });
      }

      // Validate labels structure if present
      if (resource.labels && Array.isArray(resource.labels)) {
        for (const label of resource.labels) {
          if (!label || typeof label !== 'object' || !label.id || typeof label.id !== 'string') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Invalid labels structure in file "${filename}": each entry in "labels" must have an "id" field.`
            });
          }
        }
      }

      // Validate taxonomyData / child taxonomy structure
      if (resource.taxonomy && Array.isArray(resource.taxonomy)) {
        for (const taxonomyItem of resource.taxonomy as any[]) {
          // Detect legacy childTaxonomy usage (old schema) when childAnnotation is missing
          if (!taxonomyItem.childAnnotation && Array.isArray(taxonomyItem.childTaxonomy)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `The uploaded JSON file "${filename}" uses legacy field "childTaxonomy". Please rename "childTaxonomy" to "childAnnotation" for annotation "${taxonomyItem.annotationId ?? 'unknown'}".`,
            });
          }

          // Check if childAnnotation is valid if present
          if (taxonomyItem.childAnnotation && (!Array.isArray(taxonomyItem.childAnnotation))) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `"childAnnotation" must be an array for taxonomy annotation "${taxonomyItem.annotationId ?? 'unknown'}" in file "${filename}".`,
            });
          }

          // Check if taxonomyData exists and is a non-empty object
          if (!taxonomyItem.taxonomyData || 
              typeof taxonomyItem.taxonomyData !== 'object' || 
              Array.isArray(taxonomyItem.taxonomyData) ||
              Object.keys(taxonomyItem.taxonomyData).length === 0) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Taxonomy data is required for annotation "${taxonomyItem.annotationId}" in file "${filename}".`
            });
          }

          // Validate childAnnotation taxonomyData if present
          if (taxonomyItem.childAnnotation && Array.isArray(taxonomyItem.childAnnotation)) {
            for (const childItem of taxonomyItem.childAnnotation) {
              if (!childItem.taxonomyData || 
                  typeof childItem.taxonomyData !== 'object' || 
                  Array.isArray(childItem.taxonomyData) ||
                  Object.keys(childItem.taxonomyData).length === 0) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: `Taxonomy data is required for childAnnotation "${childItem.annotationId}" under parent annotation "${taxonomyItem.annotationId}" in file "${filename}".`
                });
              }
            }
          }
        }
      }
    }
  }

  // Helper: Collect taxonomy and label IDs from resources
  static collectTaxonomyAndLabelIds(
    resources: DLSessionLinkExtractedResourcesInput['extractedResources']
  ): {
    taxonomyGroupNames: Set<string>;
    annotationIds: Set<string>;
    annotationToTaxonomyGroupMap: Map<string, string>;
    allLabelIds: Set<string>;
  } {
    const taxonomyGroupNames = new Set<string>();
    const annotationIds = new Set<string>();
    const annotationToTaxonomyGroupMap = new Map<string, string>();
    const allLabelIds = new Set<string>();

    for (const resource of resources) {
      if (resource.labels && Array.isArray(resource.labels)) {
        resource.labels.forEach(label => {
          allLabelIds.add(label.id);
        });
      }

      for (const taxonomy of resource.taxonomy || []) {
        const annotationId = taxonomy.annotationId;
        annotationIds.add(annotationId);

        let taxonomyGroupName = taxonomy.taxonomyGroupName;
        
        if (!taxonomyGroupName) {
          throw new Error(`Taxonomy group name is missing for annotation ID: ${annotationId}.`);
        }
        
        taxonomyGroupNames.add(taxonomyGroupName);
        annotationToTaxonomyGroupMap.set(annotationId, taxonomyGroupName);

        // Note: Child annotation IDs are not collected here because we validate
        // child taxonomies by name only, not by annotationId
      }
    }

    return {
      taxonomyGroupNames,
      annotationIds,
      annotationToTaxonomyGroupMap,
      allLabelIds,
    };
  }

  // Helper: Normalize taxonomy name for comparison (trim whitespace, lowercase)
  static normalizeTaxonomyName(name: string): string {
    return name.trim().toLowerCase();
  }

  // Helper: Validate and prepare taxonomy-related data
  static async validateAndPrepareTaxonomies(
    dLSessionId: string,
    taxonomyGroupNames: Set<string>,
    annotationIds: Set<string>,
    annotationToTaxonomyGroupMap: Map<string, string>
  ): Promise<{
    annotationDetailsMap: Map<string, any>;
    taxonomyTypeMap: Map<string, any>;
    taxonomyMap: Map<string, any>;
    mappedAnnotationIds: Set<string>;
    newMappings: any[];
  }> {
    const existingAnnotations = await db.annotation.findMany({
      where: {
        id: {
          in: Array.from(annotationIds)
        }
      },
      include: {
        taxonomyType: true
      }
    });

    const existingAnnotationIds = new Set(existingAnnotations.map(a => a.id));
    const missingAnnotationIds = Array.from(annotationIds).filter(id => !existingAnnotationIds.has(id));
    
    if (missingAnnotationIds.length > 0) {
      throw new Error(`Invalid annotation IDs: ${missingAnnotationIds.join(', ')}. These annotations do not exist in the database.`);
    }

    const annotationDetailsMap = new Map();
    existingAnnotations.forEach(annotation => {
      annotationDetailsMap.set(annotation.id, annotation);
    });

    const taxonomyTypeMap = new Map();
    existingAnnotations.forEach(annotation => {
      const groupName = annotationToTaxonomyGroupMap.get(annotation.id);
      if (groupName && annotation.taxonomyType) {
        taxonomyTypeMap.set(groupName, annotation.taxonomyType);
      }
    });

    const missingTaxonomyTypes = Array.from(taxonomyGroupNames).filter(groupName => 
      !taxonomyTypeMap.has(groupName)
    );
    
    if (missingTaxonomyTypes.length > 0) {
      throw new Error(`Missing taxonomyTypes for groups: ${missingTaxonomyTypes.join(', ')}. Ensure annotations have proper taxonomyType relationships.`);
    }

    // Get all existing taxonomies in the session to check for duplicates by normalized name
    const existingTaxonomiesInSession = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        dLSessionId,
        deletedAt: null
      },
      include: {
        taxonomy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      distinct: ['taxonomyId']
    });

    // Create a map: normalized taxonomy name -> existing taxonomy (from session)
    const normalizedTaxonomyNameToExistingTaxonomyMap = new Map<string, { id: string; name: string }>();
    existingTaxonomiesInSession.forEach(mapping => {
      const normalizedName = this.normalizeTaxonomyName(mapping.taxonomy.name);
      // Use the first taxonomy found for this normalized name
      if (!normalizedTaxonomyNameToExistingTaxonomyMap.has(normalizedName)) {
        normalizedTaxonomyNameToExistingTaxonomyMap.set(normalizedName, mapping.taxonomy);
      }
    });

    const taxonomyPromises = Array.from(taxonomyGroupNames).map(async (groupName) => {
      const normalizedGroupName = this.normalizeTaxonomyName(groupName);
      
      // First, check if a taxonomy with the same normalized name already exists in the session
      const existingTaxonomyInSession = normalizedTaxonomyNameToExistingTaxonomyMap.get(normalizedGroupName);
      
      if (existingTaxonomyInSession) {
        // Use existing taxonomy from session (merge into one group)
        return { groupName, taxonomy: existingTaxonomyInSession };
      }

      // If not in session, check database for taxonomy with exact name match
      let taxonomy = await db.taxonomy.findFirst({
        where: { name: groupName }
      });

      // If not found with exact match, check with normalized name
      if (!taxonomy) {
        // Find all taxonomies and check normalized names
        const allTaxonomies = await db.taxonomy.findMany();
        
        const matchingTaxonomy = allTaxonomies.find(t => this.normalizeTaxonomyName(t.name) === normalizedGroupName);
        if (matchingTaxonomy) {
          // Fetch full taxonomy object
          taxonomy = await db.taxonomy.findUnique({
            where: { id: matchingTaxonomy.id }
          });
        }
      }

      // If still not found, create new taxonomy
      if (!taxonomy) {
        taxonomy = await db.taxonomy.create({
          data: {
            name: groupName.trim(), // Store trimmed name
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      return { groupName, taxonomy };
    });
    
    const taxonomyResults = await Promise.all(taxonomyPromises);
    const taxonomyMap = new Map(
      taxonomyResults.map(({ groupName, taxonomy }) => [groupName, taxonomy])
    );

    // Get existing mappings by annotation ID (for quick lookup)
    const existingMappings = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        dLSessionId,
        annotationId: {
          in: Array.from(annotationIds)
        }
      }
    });

    const mappedAnnotationIds = new Set(existingMappings.map(m => m.annotationId));

    // Get all existing annotations in the session grouped by taxonomy name
    // This is used to check for duplicate annotation names within the same taxonomy
    const allExistingMappingsInSession = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        dLSessionId,
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
            id: true,
            name: true
          }
        }
      }
    });

    // Create a map: normalized taxonomy name -> set of annotation names
    // Use normalized names to merge taxonomies with same name (e.g., "TESTING" and " TESTING")
    const normalizedTaxonomyNameToAnnotationNamesMap = new Map<string, Set<string>>();
    allExistingMappingsInSession.forEach(mapping => {
      const normalizedTaxonomyName = this.normalizeTaxonomyName(mapping.taxonomy.name);
      const annotationName = mapping.annotation.name;
      
      if (!normalizedTaxonomyNameToAnnotationNamesMap.has(normalizedTaxonomyName)) {
        normalizedTaxonomyNameToAnnotationNamesMap.set(normalizedTaxonomyName, new Set());
      }
      normalizedTaxonomyNameToAnnotationNamesMap.get(normalizedTaxonomyName)!.add(annotationName);
    });

    const newMappings = [];
    for (const annotationId of annotationIds) {
      // Skip if annotation ID already exists in session
      if (mappedAnnotationIds.has(annotationId)) {
        continue;
      }

      const groupName = annotationToTaxonomyGroupMap.get(annotationId);
      if (!groupName) continue;

      const taxonomy = taxonomyMap.get(groupName);
      if (!taxonomy) continue;

      // Get annotation details to check name
      const annotation = annotationDetailsMap.get(annotationId);
      if (!annotation) continue;

      // Normalize taxonomy name for comparison (to merge "TESTING" and " TESTING")
      const normalizedGroupName = this.normalizeTaxonomyName(groupName);
      
      // Check if annotation name already exists for this normalized taxonomy name
      const existingAnnotationNames = normalizedTaxonomyNameToAnnotationNamesMap.get(normalizedGroupName);
      if (existingAnnotationNames && existingAnnotationNames.has(annotation.name)) {
        // Skip duplicate annotation name for this taxonomy
        console.log(`Skipping duplicate annotation name "${annotation.name}" for taxonomy "${groupName}" (normalized: "${normalizedGroupName}")`);
        continue;
      }

      try {
        const newMapping = await db.taxonomiesAnnotationsInDLSessions.create({
          data: {
            dLSession: {
              connect: { id: dLSessionId }
            },
            annotation: {
              connect: { id: annotationId }
            },
            taxonomy: {
              connect: { id: taxonomy.id }
            }
          }
        });
        
        newMappings.push(newMapping);
        mappedAnnotationIds.add(annotationId);
        
        // Update the map to include the new annotation name (using normalized taxonomy name)
        if (!normalizedTaxonomyNameToAnnotationNamesMap.has(normalizedGroupName)) {
          normalizedTaxonomyNameToAnnotationNamesMap.set(normalizedGroupName, new Set());
        }
        normalizedTaxonomyNameToAnnotationNamesMap.get(normalizedGroupName)!.add(annotation.name);
      } catch (err) {
        console.error(`Failed to create mapping for annotation ${annotationId}:`, err);
      }
    }

    return {
      annotationDetailsMap,
      taxonomyTypeMap,
      taxonomyMap,
      mappedAnnotationIds,
      newMappings,
    };
  }

  // Helper: Process and create label mappings
  static async processLabels(
    dLSessionId: string,
    allLabelIds: Set<string>
  ): Promise<{
    mappedLabelIds: Set<string>;
    newLabelMappings: any[];
  }> {
    // Validate that all label IDs exist in the database
    if (allLabelIds.size > 0) {
      const existingLabels = await db.label.findMany({
        where: {
          id: {
            in: Array.from(allLabelIds)
          }
        },
        select: {
          id: true
        }
      });

      const existingLabelIds = new Set(existingLabels.map(l => l.id));
      const missingLabelIds = Array.from(allLabelIds).filter(id => !existingLabelIds.has(id));

      if (missingLabelIds.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid label IDs found in JSON upload: ${missingLabelIds.join(', ')}. Please ensure all labels exist in the Label Master.`
        });
      }
    }

    const existingLabelMappings = await db.labelsInDLSessions.findMany({
      where: {
        dLSessionId,
        labelId: {
          in: Array.from(allLabelIds)
        }
      }
    });
    
    const mappedLabelIds = new Set(existingLabelMappings.map(m => m.labelId));

    const newLabelMappings = [];
    for (const labelId of allLabelIds) {
      if (!mappedLabelIds.has(labelId)) {
        try {
          const newLabelMapping = await db.labelsInDLSessions.create({
            data: {
              dLSession: {
                connect: { id: dLSessionId }
              },
              label: {
                connect: { id: labelId }
              }
            }
          });
          
          newLabelMappings.push(newLabelMapping);
          mappedLabelIds.add(labelId);
        } catch (err) {
          // This should not happen since we validated labels exist, but handle unexpected errors
          console.error(`Failed to create mapping for label ${labelId}:`, err);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create label mapping for label ${labelId}. Please try again.`
          });
        }
      }
    }

    return {
      mappedLabelIds,
      newLabelMappings,
    };
  }

  // Helper: Prepare label data for insertion
  static prepareLabelData(
    dLSessionId: string,
    resources: DLSessionLinkExtractedResourcesInput['extractedResources'],
    mappedLabelIds: Set<string>
  ) {
    return resources.flatMap(resource => 
      (resource.labels && Array.isArray(resource.labels))
        ? resource.labels
            .filter(label => mappedLabelIds.has(label.id))
            .map(label => ({
              dLSessionId,
              extractedResourceId: resource.id,
              labelId: label.id,
            }))
        : []
    );
  }

  // Helper: Prepare parent taxonomy data
  static prepareParentTaxonomyData(
    dLSessionId: string,
    userId: string,
    resources: DLSessionLinkExtractedResourcesInput['extractedResources'],
    annotationDetailsMap: Map<string, any>,
    taxonomyAnnotationIdMap: Map<string, any>
  ) {
    const DEFAULT_TAXONOMY_TYPE_ID = '00000000-0000-0000-0000-000000000000';

    function isNonEmptyObject(obj: any): boolean {
      return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
    }

    return resources.flatMap(resource =>
      (resource.taxonomy || [])
        .map(taxonomyType => {
          if (!isNonEmptyObject(taxonomyType.taxonomyData)) {
            return null;
          }
          const matchedAnnotation = annotationDetailsMap.get(taxonomyType.annotationId);
          const matchedTaxonomiesAnnotationInDlSession = taxonomyAnnotationIdMap.get(taxonomyType.annotationId);

          if (!matchedTaxonomiesAnnotationInDlSession) {
            return null;
          }

          const enhancedTaxonomyData = {
            ...taxonomyType.taxonomyData,
            type: matchedAnnotation?.taxonomyType?.name,
            name: matchedAnnotation?.name,
            abbreviation: matchedAnnotation?.abbreviation,
            taxonomiesAnnotationsInDLSessionsId: matchedTaxonomiesAnnotationInDlSession.id,
          };

          const taxonomyTypeId = matchedAnnotation?.taxonomyTypeId || DEFAULT_TAXONOMY_TYPE_ID;

          return {
            dLSessionId,
            extractedResourceId: resource.id,
            taxonomyData: enhancedTaxonomyData,
            typesInTaxonomyId: taxonomyTypeId,
            taxonomiesAnnotationsInDLSessionsId: matchedTaxonomiesAnnotationInDlSession.id,
            createdBy: userId,
            updatedBy: userId,
          };
        })
        .filter(item => item !== null)
    );
  }

  // Helper: Process child taxonomies
  static async processChildTaxonomies(
    dLSessionId: string,
    userId: string,
    resources: DLSessionLinkExtractedResourcesInput['extractedResources'],
    annotationDetailsMap: Map<string, any>,
    taxonomyAnnotationIdMap: Map<string, any>
  ): Promise<number> {
    type ChildTaxonomyDataItem = {
      name: string;
      dLSessionId: string;
      extractedResourceId: string;
      taxonomiesAnnotationsInDLSessionsId: string;
      parentAnnotationName: string;
    };

    type ChildTaxonomyRecord = {
      id: string;
      name: string;
      extractedResourceId: string;
      taxonomiesAnnotationsInDLSessionsId: string;
    };

    const createChildTaxonomyKey = (
      name: string,
      extractedResourceId: string,
      taxonomiesAnnotationsInDLSessionsId: string
    ): string => {
      return `${name}-${extractedResourceId}-${taxonomiesAnnotationsInDLSessionsId}`;
    };

    const validateChildTaxonomyNames = async (
      childTaxonomyData: ChildTaxonomyDataItem[]
    ): Promise<void> => {
      if (childTaxonomyData.length === 0) {
        return;
      }

      // Validate that child names exist in childTaxonomy table
      // Check by name only: SELECT "name" FROM "ChildTaxonomy" WHERE "name" = ? AND "deletedAt" IS NULL
      const missingChildTaxonomies: Array<{ parentAnnotationName: string; name: string }> = [];

      // Get unique child names to check (trimmed to handle whitespace issues)
      const uniqueChildNames = Array.from(new Set(
        childTaxonomyData.map(item => item.name.trim())
      ));

      // Check which child taxonomy names exist in the database
      const existingChildTaxonomies = await db.childTaxonomy.findMany({
        where: {
          name: {
            in: uniqueChildNames,
          },
          deletedAt: null,
        },
        select: {
          name: true,
        },
      });

      // Create a set of existing names for quick lookup
      const existingNamesSet = new Set(
        existingChildTaxonomies.map(ct => ct.name.trim())
      );

      // Check each child taxonomy and collect missing ones
      for (const item of childTaxonomyData) {
        const trimmedChildName = item.name.trim();
        
        if (!existingNamesSet.has(trimmedChildName)) {
          missingChildTaxonomies.push({
            parentAnnotationName: item.parentAnnotationName,
            name: trimmedChildName,
          });
        }
      }

      if (missingChildTaxonomies.length > 0) {
        const errorDetails = missingChildTaxonomies
          .map(item => `  • Parent: "${item.parentAnnotationName}"\n    • Child: "${item.name}"`)
          .join('\n');

        throw new Error(
          `The following child taxonomy names do not exist in the database. Parent and child name mismatch:\n${errorDetails}\n\n`
        );
      }
    };

    const createChildTaxonomyRecords = async (
      childTaxonomyData: ChildTaxonomyDataItem[],
      dLSessionId: string
    ): Promise<ChildTaxonomyRecord[]> => {
      if (childTaxonomyData.length === 0) {
        return [];
      }

      try {
        await db.childTaxonomy.createMany({
          data: childTaxonomyData.map(item => ({
            name: item.name,
            dLSessionId: item.dLSessionId,
            extractedResourceId: item.extractedResourceId,
            taxonomiesAnnotationsInDLSessionsId: item.taxonomiesAnnotationsInDLSessionsId,
          })),
          skipDuplicates: true,
        });

        const createdChildTaxonomies = await db.childTaxonomy.findMany({
          where: {
            dLSessionId,
            OR: childTaxonomyData.map(item => ({
              name: item.name,
              extractedResourceId: item.extractedResourceId,
              taxonomiesAnnotationsInDLSessionsId: item.taxonomiesAnnotationsInDLSessionsId,
            })),
          },
          select: {
            id: true,
            name: true,
            extractedResourceId: true,
            taxonomiesAnnotationsInDLSessionsId: true,
          },
        });

        return createdChildTaxonomies;
      } catch (error) {
        console.error('Failed to create child taxonomy records:', error);
        return [];
      }
    };

    const childTaxonomyData: ChildTaxonomyDataItem[] = resources.flatMap(resource =>
      (resource.taxonomy || []).flatMap(taxonomyType => {
        if (!taxonomyType.childAnnotation || taxonomyType.childAnnotation.length === 0) {
          return [];
        }

        const matchedTaxonomiesAnnotationInDlSession = taxonomyAnnotationIdMap.get(taxonomyType.annotationId);
        if (!matchedTaxonomiesAnnotationInDlSession) {
          return [];
        }

        const matchedParentAnnotation = annotationDetailsMap.get(taxonomyType.annotationId);

        return taxonomyType.childAnnotation.map(childAnnotation => ({
          name: childAnnotation.taxonomyData.name || childAnnotation.annotationId,
          dLSessionId, // Use parameter dLSessionId for all operations (creation, etc.)
          extractedResourceId: resource.id,
          taxonomiesAnnotationsInDLSessionsId: matchedTaxonomiesAnnotationInDlSession.id,
          parentAnnotationName: matchedParentAnnotation?.name || taxonomyType.annotationId,
        }));
      })
    );

    await validateChildTaxonomyNames(childTaxonomyData);

    const childTaxonomyIds = await createChildTaxonomyRecords(childTaxonomyData, dLSessionId);

    const childTaxonomyMap = new Map<string, ChildTaxonomyRecord>();
    childTaxonomyIds.forEach(child => {
      const key = createChildTaxonomyKey(
        child.name,
        child.extractedResourceId,
        child.taxonomiesAnnotationsInDLSessionsId
      );
      childTaxonomyMap.set(key, child);
    });

    const DEFAULT_TAXONOMY_TYPE_ID = '00000000-0000-0000-0000-000000000000';
    let childTaxonomyAssociations = [];
    
    if (childTaxonomyIds.length > 0) {
      for (const resource of resources) {
        for (const taxonomyType of resource?.taxonomy || []) {
          if (!taxonomyType.childAnnotation || taxonomyType.childAnnotation.length === 0) {
            continue;
          }

          const matchedTaxonomiesAnnotationInDlSession = taxonomyAnnotationIdMap.get(taxonomyType.annotationId);

          if (!matchedTaxonomiesAnnotationInDlSession) {
            continue;
          }

          for (const childAnnotation of taxonomyType.childAnnotation) {
            const name = childAnnotation.taxonomyData.name || childAnnotation.annotationId;
            const key = createChildTaxonomyKey(name, resource.id, matchedTaxonomiesAnnotationInDlSession.id);
            const createdChildTaxonomy = childTaxonomyMap.get(key);

            if (!createdChildTaxonomy) {
              continue;
            }
            
            const matchedChildAnnotation = annotationDetailsMap.get(childAnnotation.annotationId);
            
            const enhancedChildTaxonomyData = {
              ...childAnnotation.taxonomyData,
              type: childAnnotation.taxonomyData.type || (matchedChildAnnotation?.taxonomyType?.name || 'Unknown'),
              name: childAnnotation.taxonomyData.name || matchedChildAnnotation?.name,
              annotationId: childAnnotation.annotationId,
              taxonomiesAnnotationsInDLSessionsId: matchedTaxonomiesAnnotationInDlSession.id
            };

            if (!resource.id || !matchedTaxonomiesAnnotationInDlSession.id || !createdChildTaxonomy.id) {
              continue;
            }

            const childTaxonomyTypeId = matchedChildAnnotation?.taxonomyTypeId || DEFAULT_TAXONOMY_TYPE_ID;

            childTaxonomyAssociations.push([
              Prisma.sql`gen_random_uuid()`,
              dLSessionId,
              resource.id,
              Prisma.sql`${JSON.stringify(enhancedChildTaxonomyData)}::jsonb`,
              Prisma.sql`${childTaxonomyTypeId}::uuid`,
              (childAnnotation as any).index || 0,
              Prisma.sql`${matchedTaxonomiesAnnotationInDlSession.id}::uuid`,
              createdChildTaxonomy.id,
              userId,
              userId,
              Prisma.sql`CURRENT_TIMESTAMP`,
              Prisma.sql`CURRENT_TIMESTAMP`
            ]);
          }
        }
      }
    }

    if (childTaxonomyAssociations.length > 0) {
      try {
        const insertChildQuery = Prisma.sql`
          INSERT INTO "ChildTaxonomyDataInDLSessions" 
          ("id", "dLSessionId", "extractedResourceId", 
          "taxonomyData", "typesInTaxonomyId", "index", "taxonomiesAnnotationsInDLSessionsId", "childTaxonomyId", "createdBy", "updatedBy", "updatedAt", "createdAt")
          VALUES ${Prisma.join(childTaxonomyAssociations.map(row => 
            Prisma.sql`(${Prisma.join(row)})`))}
        `;
        
        await db.$executeRaw(insertChildQuery);
        return childTaxonomyAssociations.length;
      } catch (error) {
        console.error('Failed to create child taxonomy associations:', error);
        return 0;
      }
    }

    return 0;
  }

  static async linkExtractedResources(input: DLSessionLinkExtractedResourcesInput, isAdmin: boolean, userId: string | undefined, skipDuplicates: boolean = false, returnDuplicateInfo: boolean = false) {
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
  
    try {
      // Check for duplicate extracted resources before processing
      const { resourcesToProcess, duplicateInfo } = await this.checkAndFilterDuplicates(
        input.dLSessionId,
        input.extractedResources,
        skipDuplicates,
        returnDuplicateInfo
      );

      if (duplicateInfo) {
        return duplicateInfo as any;
      }

      // Validate JSON structure: check for legacy labelIds and validate taxonomyData
      this.validateExtractedResourcesStructure(resourcesToProcess, input.filename);

      // Collect taxonomy and label IDs
      const {
        taxonomyGroupNames,
        annotationIds,
        annotationToTaxonomyGroupMap,
        allLabelIds,
      } = this.collectTaxonomyAndLabelIds(resourcesToProcess);

      // Validate and prepare taxonomies
      const {
        annotationDetailsMap,
        taxonomyTypeMap,
        taxonomyMap,
        mappedAnnotationIds,
        newMappings,
      } = await this.validateAndPrepareTaxonomies(
        input.dLSessionId,
        taxonomyGroupNames,
        annotationIds,
        annotationToTaxonomyGroupMap
      );

      // Process labels
      const { mappedLabelIds, newLabelMappings } = await this.processLabels(
        input.dLSessionId,
        allLabelIds
      );

      // Prepare data for extracted resources
      const extractedResourcesData = resourcesToProcess.map(resource => ({
        dLSessionId: input.dLSessionId,
        extractedResourceId: resource.id,
      }));

      // Prepare data for labels
      const labelsData = this.prepareLabelData(
        input.dLSessionId,
        resourcesToProcess,
        mappedLabelIds
      );

      // Prepare taxonomy annotation data (only parent annotations, not child annotations)
      // Child taxonomies are validated by name only, not by annotationId
      const taxonomyAnnotationData = resourcesToProcess.flatMap(resource => 
        resource.taxonomy?.map(taxonomyType => ({
          dLSessionId: input.dLSessionId,
          annotationId: taxonomyType.annotationId
        })) || []
      );

      // Find annotation IDs in taxonomies annotations in DL session
      const taxonomiesAnnotationInDLSessionIds = await db.taxonomiesAnnotationsInDLSessions.findMany({
        where: {
          dLSessionId: input.dLSessionId,
          annotationId: {
            in: taxonomyAnnotationData.map(t => t?.annotationId).filter(Boolean) as string[]
          }
        },
        select: {
          id: true,
          annotationId: true,
          taxonomyId: true
        }
      });
      
      const taxonomyAnnotationIdMap = new Map();
      taxonomiesAnnotationInDLSessionIds.forEach(detail => {
        taxonomyAnnotationIdMap.set(detail.annotationId, detail);
      });

      // Prepare parent taxonomy data
      const taxonomyDataArray = this.prepareParentTaxonomyData(
        input.dLSessionId,
        userId,
        resourcesToProcess,
        annotationDetailsMap,
        taxonomyAnnotationIdMap
      );

      // Process child taxonomies
      const childTaxonomyAssociationsCount = await this.processChildTaxonomies(
        input.dLSessionId,
        userId,
        resourcesToProcess,
        annotationDetailsMap,
        taxonomyAnnotationIdMap
      );

      // Prepare all operations for transaction
      const firstArgs = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsCreateManyArgs>()({
        data: extractedResourcesData,
        skipDuplicates: true,
      });
      
      const secondArgs = Prisma.validator<Prisma.LabelsInExtractedResourcesInDLSessionsCreateManyArgs>()({
        data: labelsData,
        skipDuplicates: true,
      });
      
      const thirdArgs = Prisma.validator<Prisma.TaxonomyDataInDLSessionsCreateManyArgs>()({
        data: taxonomyDataArray,
        skipDuplicates: true,
      });

      // Execute the transaction for the main operations
      await transaction([
        this.dLSessionRepository().createManyExtractedResources(firstArgs),
        this.dLSessionRepository().createManyLabelsInExtractedResources(secondArgs),
        this.dLSessionRepository().createManyTaxonomyDataInDLSessions(thirdArgs),
      ]);
      
      // Upload file to S3 if fileBuffer and fileType are provided
      let s3Key: string | null = null
      if (input.fileBuffer && input.fileType && input.filename && userId) {
        try {
          // Convert base64 to Buffer
          const fileBuffer = Buffer.from(input.fileBuffer, 'base64')
          
          // Generate S3 key: {dLSessionId}/uploads/{filename}_{timestamp}
          const timestamp = DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss')
          const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
          s3Key = `${input.dLSessionId}/uploads/${sanitizedFilename}_${timestamp}`
          // Upload file to S3
          await CloudService.uploadFileToS3(s3Key, fileBuffer, input.fileType)
        } catch (error: unknown) {
          // Log detailed error for debugging
          console.error('Error uploading file to S3:', {
            filename: input.filename,
            sessionId: input.dLSessionId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          })
          
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error occurred'
          
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to upload file "${input.filename}" to storage. ${errorMessage}. Please try again or contact support if the problem persists.`
          })
        }
      }
      
      // Save uploaded filename when provided
      if (input.filename && userId) {
        const trimmedFilename = input.filename.trim()
        if (!trimmedFilename) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Filename cannot be empty. Please provide a valid filename for the uploaded JSON file.'
          })
        }
        if (trimmedFilename.startsWith('.')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Filename cannot start with a dot. Please provide a valid filename for the uploaded JSON file.'
          })
        }
        try {
          // Update fourthArgs to include s3Key if available
          // Note: s3Key will only be included if the Prisma client has been regenerated after schema migration
          const createArgsData: any = {
            dLSessionId: input.dLSessionId,
            filename: input.filename,
            createdBy: userId,
          }
          
          // Only include s3Key if it exists (after migration and Prisma client regeneration)
          if (s3Key) {
            createArgsData.s3Key = s3Key
          }
          
          const createArgs = Prisma.validator<Prisma.DLSessionJsonCreateArgs>()({
            data: createArgsData,
          })
          await this.dLSessionJsonRepository().createDLSessionJson(createArgs)
        } catch (error: unknown) {
          // Use centralized error handler for Prisma errors
          // Handle duplicate filename errors specifically
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: `A file with the name "${input.filename}" already exists in this session. Please use a different filename or remove the existing file first.`
            })
          }
          throw handlePrismaError(error, 'DLSession JSON', { name: input.filename }, { 
            action: 'create',
            context: 'while saving uploaded file information'
          })
        }
      }
    
      // Return success result with counts
      return { 
        success: true,
        count: resourcesToProcess.length,
        labelsCount: labelsData.length,
        newLabelMappings: newLabelMappings.length,
        childAssociationsCount: childTaxonomyAssociationsCount,
        newTaxonomyTypes: taxonomyTypeMap.size,
        newMappings: newMappings.length
      };
    } catch (error: unknown) {
      // Log detailed error for debugging
      console.error("Error in linkExtractedResources:", {
        sessionId: input.dLSessionId,
        filename: input.filename,
        extractedResourcesCount: input.extractedResources?.length || 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Re-throw TRPCError as-is (already properly formatted)
      if (error instanceof TRPCError) {
      throw error;
      }
      
      // For other errors, wrap in TRPCError with user-friendly message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while processing the JSON file'
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to process JSON file "${input.filename}": ${errorMessage}. Please check the file format and try again.`
      });
    }
  }

  static async listExtractedResources(input: DLSessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    try {
    // Check if the session exists and is not deleted
    const session = await db.dLSession.findFirst({
      where: {
        id: input.filter.dLSessionId,
        deletedAt: null
      }
    });
     
      if (!session) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Session not found or access denied.' })
      }

    const query = Prisma.sql`
      WITH 
      ${input.filter.freeze ? Prisma.sql`
      paginated_resource_ids AS (
        SELECT ERDLS."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        ORDER BY ERDLS."extractedResourceId"
        LIMIT ${input.limit} OFFSET ${input.offset}
      ),
      ` : Prisma.empty}
      resources_in_session AS (
        SELECT
          ERDLS."extractedResourceId", 
          array_remove(array_agg(distinct LERDLS."labelId"), NULL) AS "labelIds",
          MAX(ERDLS."status") as status,
          MAX(ERDLS."comment") as comment
        FROM 
          "ExtractedResourcesInDLSessions" ERDLS
          ${input.filter.freeze ? Prisma.sql`
          INNER JOIN paginated_resource_ids PRI ON PRI."extractedResourceId" = ERDLS."extractedResourceId"
          ` : Prisma.empty}
          LEFT JOIN (
            SELECT DISTINCT
              "extractedResourceId",
              "dLSessionId",
              "labelId"
            FROM
              "LabelsInExtractedResourcesInDLSessions"
            WHERE
              "deletedAt" IS NULL
              AND "dLSessionId" = ${input.filter.dLSessionId}
          ) LERDLS ON ERDLS."extractedResourceId" = LERDLS."extractedResourceId" AND ERDLS."dLSessionId" = LERDLS."dLSessionId"
        WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        ${input.filter.unLabelled ? Prisma.sql` AND LERDLS."labelId" IS NULL ` : Prisma.empty}
        ${input.filter.unAnnotated ? Prisma.sql` AND ERDLS."extractedResourceId" NOT IN ( SELECT DISTINCT tax."extractedResourceId"
        FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
        ${input.filter.annotated ? Prisma.sql` AND ERDLS."extractedResourceId" IN ( SELECT DISTINCT tax."extractedResourceId"
        FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
        ${input.filter?.status ? Prisma.sql`AND ERDLS.status::text = ${input.filter.status}` : Prisma.empty}
        GROUP BY ERDLS."extractedResourceId"
        ${input.filter?.labelIds?.length ? Prisma.sql`HAVING array_agg(LERDLS."labelId") @> ${input.filter.labelIds} AND array_length(array_agg(LERDLS."labelId"), 1) = ${input.filter.labelIds.length}`: Prisma.empty}
      ),
      resources_by_patient AS (
        SELECT ER.*
        FROM "ExtractedResource" ER
        ${input.filter?.patientId
          ? Prisma.sql`
          JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
          JOIN "Visit" V ON V.id = RR."visitId"
          JOIN "Patient" P ON P.id = V."patientId"
          WHERE P.id = ${input.filter.patientId}
          `
          : Prisma.empty}
      ),
      filtered_resources AS (
        SELECT 
          RBP.*, 
          RIS."labelIds",
          RIS."status",
          RIS."comment"
        FROM 
          resources_by_patient RBP
          JOIN resources_in_session RIS ON RBP.id = RIS."extractedResourceId"
          ${input.filter.freeze ? Prisma.sql`
          INNER JOIN paginated_resource_ids PRI ON PRI."extractedResourceId" = RBP.id
          ` : Prisma.empty}
      ),
      individual_assignees AS (
        SELECT DISTINCT uids."userId"
        FROM "UsersInDLSessions" uids
        WHERE uids."dLSessionId" = ${input.filter.dLSessionId}
          AND uids."userRole" = 'ACTIVITY'
          AND uids."userId" LIKE 'auth0|%'
      ),
      group_member_assignees AS (
        SELECT DISTINCT uig."userId"
        FROM "UserGroupInDLSessions" ugids
        JOIN "UserGroup" ug ON ug."id" = ugids."userGroupId"
          AND ug."deletedAt" IS NULL
        JOIN "UsersInUserGroup" uig ON uig."userGroupId" = ug."id"
          AND uig."deletedAt" IS NULL
        WHERE ugids."dLSessionId" = ${input.filter.dLSessionId}
          AND ugids."userRole" = 'ACTIVITY'
          AND ugids."deletedAt" IS NULL
      ),
      session_assignees AS (
        SELECT "userId" FROM individual_assignees
        UNION
        SELECT "userId" FROM group_member_assignees
      ),
      user_approval as (
        SELECT 
          ua."approvalModuleUniqueId",
          ua."isNextApprover",
          ua."isCurrApprover",
          CASE 
            WHEN (max(ua."approvalLevel") = '1' 
                  AND max(ua."approvalStatusId") = '2'
                  AND ${userId} IN (SELECT "userId" FROM session_assignees))
            THEN TRUE  
            ELSE ua."isReSubmitApprover" 
          END as "isReSubmitApprover",
          CASE WHEN max(subquery."maxApproval") = MAX(CASE WHEN ua."isNextApprover" THEN ua."approvalLevel" END) THEN TRUE ELSE FALSE END as "isFinalApproval"
        FROM "UserApproval" ua 
          LEFT JOIN (
              SELECT 
                  MAX(am."approvalLevel") as "maxApproval", 
                  am."sessionId"
              FROM "ApprovalMatrix" am 
              WHERE am."sessionId" = ${input.filter.dLSessionId} AND am."isActive" = true
              GROUP BY am."sessionId"
          ) subquery ON ua."sessionId" = subquery."sessionId"
        WHERE ua."sessionId" = ${input.filter.dLSessionId}
        AND ua."isActive" = true
        AND (ua."approvalUserId" = ${userId}  
             OR (${userId} IN (SELECT "userId" FROM session_assignees) 
                 AND ua."approvalLevel" = '1' 
                 AND ua."approvalStatusId" = '2'))
        AND (ua."isNextApprover" = true 
             OR ua."isReSubmitApprover" = true 
             OR (${userId} IN (SELECT "userId" FROM session_assignees) 
                 AND ua."approvalLevel" = '1' 
                 AND ua."approvalStatusId" = '2'))
        GROUP BY ua."approvalModuleUniqueId", ua."isNextApprover", ua."isCurrApprover", ua."isReSubmitApprover"
      ),
      current_approval_level as (
        select 
          ua."approvalModuleUniqueId",
          max(ua."approvalLevel") as "approvalLevel"
        from "UserApproval" ua
        where ua."sessionId" = ${input.filter.dLSessionId} 
        and ua."isActive" = true
        and (ua."isNextApprover" = true or ua."isReSubmitApprover" = true)
        group by ua."approvalModuleUniqueId"
      )
    SELECT 
      FR.*,
      UA."approvalModuleUniqueId",
      CUA."approvalLevel",
      COALESCE(UA."isNextApprover",false) AS "isNextApprover",
      COALESCE(UA."isFinalApproval",false) AS "isFinalApproval",
      COALESCE(UA."isCurrApprover",false) AS "isCurrApprover",
      COALESCE(UA."isReSubmitApprover",false) AS "isReSubmitApprover"
    FROM 
      filtered_resources FR
      ${ input.filter.isApproved ? 
        Prisma.sql` 
          JOIN user_approval UA ON FR."id" = UA."approvalModuleUniqueId" 
          LEFT JOIN current_approval_level CUA on FR."id" = CUA."approvalModuleUniqueId" 
        ` :
        Prisma.sql` 
          LEFT JOIN user_approval UA ON FR."id" = UA."approvalModuleUniqueId" 
          LEFT JOIN current_approval_level CUA on FR."id" = CUA."approvalModuleUniqueId" 
        `
      }
    ORDER BY FR.id
    ${input.filter.freeze ? Prisma.empty : Prisma.sql`LIMIT ${input.limit} OFFSET ${input.offset}`}
    `
    const data = await db.$queryRaw<(ExtractedResource & { labelIds: string[]; status: ExtractedResourceStatus; isNextApprover : boolean; isFinalApproval : boolean; isCurrApprover : boolean; isReSubmitApprover: boolean, approvalLevel: string;comment:string | null})[]>(
      query,
    )
    return data
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw handlePrismaReadError(error, 'Session', 'search')
    }
  }

  static async listExtractedResourcesTotalCount(input: DLSessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    try {
    const totalQuery = Prisma.sql`
      select COUNT(*) from (
        SELECT erdls."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        ${input.filter.freeze ? Prisma.sql`
        INNER JOIN (
          SELECT ERDLS2."extractedResourceId"
          FROM "ExtractedResourcesInDLSessions" ERDLS2
          WHERE ERDLS2."dLSessionId" = ${input.filter.dLSessionId}
          ORDER BY ERDLS2."extractedResourceId"
          LIMIT ${input.limit} OFFSET ${input.offset}
        ) PRI ON PRI."extractedResourceId" = ERDLS."extractedResourceId"
        ` : Prisma.empty}
        ${ input.filter?.labelIds?.length || input.filter.unLabelled ? 
            Prisma.sql`LEFT JOIN (
              SELECT DISTINCT
                "extractedResourceId",
                "dLSessionId",
                "labelId"
              FROM
                "LabelsInExtractedResourcesInDLSessions"
              WHERE
                "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
            ) LERDLS ON ERDLS."extractedResourceId" = LERDLS."extractedResourceId" AND ERDLS."dLSessionId" = LERDLS."dLSessionId"` 
            : 
            Prisma.empty
        }
        ${input.filter?.patientId ? 
          Prisma.sql`
            join "ExtractedResource" ER on ER.id = ERDLS."extractedResourceId"
            JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
            JOIN "Visit" V ON V.id = RR."visitId"
            JOIN "Patient" P ON P.id = V."patientId"
          ` : Prisma.empty}
        ${input.filter.isApproved ? Prisma.sql` JOIN "UserApproval" UA ON ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" ` : Prisma.sql` `}
        WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        ${input.filter?.patientId ? Prisma.sql` AND P.id = ${input.filter.patientId}` : Prisma.empty}
        ${input.filter.unLabelled ? Prisma.sql` AND LERDLS."labelId" IS NULL ` : Prisma.empty}
        ${input.filter.unAnnotated ? Prisma.sql` AND ERDLS."extractedResourceId" NOT IN ( SELECT DISTINCT tax."extractedResourceId"
        FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
        ${input.filter.annotated ? Prisma.sql` AND ERDLS."extractedResourceId" IN ( SELECT DISTINCT tax."extractedResourceId"
        FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
        ${input.filter?.status ? Prisma.sql`AND ERDLS.status::text = ${input.filter.status}` : Prisma.empty}
        GROUP BY ERDLS."extractedResourceId"
        ${input.filter?.labelIds?.length ? Prisma.sql`HAVING array_agg(LERDLS."labelId") @> ${input.filter.labelIds} AND array_length(array_agg(LERDLS."labelId"), 1) = ${input.filter.labelIds.length}` : Prisma.empty}
      ) res
    `
    const totalCount = await db.$queryRaw<{count: number | null}[]>(totalQuery)
    return totalCount
    } catch (error) {
      throw handlePrismaReadError(error, 'Session', 'search')
    }
  }

  static async listExtractedResourcesLabelCount(input: DLSessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const session = await db.dLSession.findFirst({
      where: {
        id: input.filter.dLSessionId,
        deletedAt: null
      }
    });

      if (!session) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

    const fullDatasetCountQuery = Prisma.sql`
      SELECT
        COUNT(DISTINCT ERDLS."extractedResourceId")::int as fullDatasetTotalCount
      FROM "ExtractedResourcesInDLSessions" ERDLS
      ${input.filter.isApproved ? Prisma.sql` JOIN "UserApproval" UA ON ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" and ERDLS."dLSessionId" = UA."sessionId" ` : Prisma.sql` `}
      WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
      ${input.filter.isApproved ? Prisma.sql` and UA."approvalUserId" = ${userId} and UA."isNextApprover" = true ` : Prisma.empty}
    `
    const fullDatasetCount = await db.$queryRaw<{fulldatasettotalcount: number | null}[]>(fullDatasetCountQuery)
    
    const labelCountQuery = Prisma.sql`
      WITH 
      ${input.filter.freeze ? Prisma.sql`
      paginated_resource_ids AS (
        SELECT ERDLS."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        ORDER BY ERDLS."extractedResourceId"
        LIMIT ${input.limit} OFFSET ${input.offset}
      ),
      ` : Prisma.empty}
      filtered_resources_base AS (
        SELECT DISTINCT ERDLS."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        ${input.filter?.labelIds?.length ? Prisma.sql`
          JOIN (
            select ERDLS."extractedResourceId"  from "ExtractedResourcesInDLSessions" ERDLS
            JOIN (
                SELECT DISTINCT
                  "extractedResourceId",
                  "dLSessionId",
                  "labelId"
                FROM
                  "LabelsInExtractedResourcesInDLSessions"
                WHERE
                  "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
            ) LERDLS ON ERDLS."extractedResourceId" = LERDLS."extractedResourceId" AND ERDLS."dLSessionId" = LERDLS."dLSessionId"
            WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
            GROUP BY ERDLS."extractedResourceId"
            HAVING array_agg(LERDLS."labelId") @> ${input.filter.labelIds} AND array_length(array_agg(LERDLS."labelId"), 1) = ${input.filter.labelIds.length}
          ) res on res."extractedResourceId" = erdls."extractedResourceId"
        ` : Prisma.sql`LEFT JOIN (
              SELECT DISTINCT
                "extractedResourceId",
                "dLSessionId",
                "labelId"
              FROM
                "LabelsInExtractedResourcesInDLSessions"
              WHERE
                "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
            ) res ON ERDLS."extractedResourceId" = res."extractedResourceId" AND ERDLS."dLSessionId" = res."dLSessionId"`}
        ${input.filter?.patientId ? 
          Prisma.sql`
            JOIN "ExtractedResource" ER on ER.id = ERDLS."extractedResourceId"
            JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
            JOIN "Visit" V ON V.id = RR."visitId"
            JOIN "Patient" P ON P.id = V."patientId"
          ` : Prisma.empty}
        ${input.filter.isApproved ? Prisma.sql` JOIN "UserApproval" UA ON ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" and ERDLS."dLSessionId" = UA."sessionId" ` : Prisma.sql` `}
        WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        ${input.filter.isApproved ? Prisma.sql` and UA."approvalUserId" = ${userId} and UA."isNextApprover" = true ` : Prisma.empty}
        ${input.filter.unLabelled ? Prisma.sql` AND res."labelId" is null ` : Prisma.empty}
        ${input.filter.unAnnotated ? Prisma.sql` AND ERDLS."extractedResourceId" NOT IN ( SELECT DISTINCT tax."extractedResourceId"
          FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
        ${input.filter.annotated ? Prisma.sql` AND ERDLS."extractedResourceId" IN ( SELECT DISTINCT tax."extractedResourceId"
          FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
        ${input.filter?.status ? Prisma.sql` AND ERDLS.status::text = ${input.filter.status}` : Prisma.empty}
        ${input.filter?.patientId ? Prisma.sql` AND P.id = ${input.filter.patientId}` : Prisma.empty}
      ),
      filtered_resources AS (
        SELECT FRB."extractedResourceId"
        FROM filtered_resources_base FRB
        ${input.filter.freeze ? Prisma.sql`INNER JOIN paginated_resource_ids PRI ON PRI."extractedResourceId" = FRB."extractedResourceId"` : Prisma.empty}
      )
      SELECT
        (SELECT COUNT(DISTINCT FRB."extractedResourceId")::int FROM filtered_resources_base FRB) as totalCount,
        COUNT(DISTINCT CASE WHEN res."extractedResourceId" IS NOT NULL THEN FR."extractedResourceId" END)::int AS labelledCount
        ${input.filter.freeze ? Prisma.sql`,
        COUNT(DISTINCT FR."extractedResourceId")::int as frozenTotalCount` : Prisma.empty}
      FROM filtered_resources FR
      LEFT JOIN (
        SELECT DISTINCT
          "extractedResourceId",
          "dLSessionId",
          "labelId"
        FROM
          "LabelsInExtractedResourcesInDLSessions"
        WHERE
          "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
      ) res ON FR."extractedResourceId" = res."extractedResourceId"
    `
    const labelCount = await db.$queryRaw<{labelledcount: number | null, unlabelledcount: number | null, totalcount: number | null, frozentotalcount?: number | null}[]>(labelCountQuery)
    
    const frozenTotalCount = input.filter.freeze ? (Number(labelCount[0]?.frozentotalcount) ?? 0) : null
    const fullDatasetTotalCount = Number(fullDatasetCount[0]?.fulldatasettotalcount) ?? 0
    
    return { labelCount, frozenTotalCount, fullDatasetTotalCount }
  }

  static async listExtractedResourcesAnnotatedCount(input: DLSessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const session = await db.dLSession.findFirst({
      where: {
      id: input.filter.dLSessionId,
      deletedAt: null
      }
      })

      if (!session) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

    const annotatedCountQuery = Prisma.sql`
      SELECT
        COUNT(DISTINCT CASE WHEN tax."extractedResourceId" IS NOT NULL AND tax."deletedAt" IS NULL THEN ERDLS."extractedResourceId" END)::int AS annotatedCount
      FROM "ExtractedResourcesInDLSessions" ERDLS
      ${input.filter?.labelIds?.length ? 
        Prisma.sql`
          JOIN "TaxonomyDataInDLSessions" tax on ERDLS."extractedResourceId" = tax."extractedResourceId" AND ERDLS."dLSessionId" = tax."dLSessionId"
          JOIN (
            select ERDLS."extractedResourceId"  from "ExtractedResourcesInDLSessions" ERDLS
            JOIN (
              SELECT
                "extractedResourceId",
                "dLSessionId",
                "labelId"
              FROM
                "LabelsInExtractedResourcesInDLSessions"
              WHERE
                "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
              GROUP BY "extractedResourceId", "dLSessionId", "labelId"
            ) LERDLS ON ERDLS."extractedResourceId" = LERDLS."extractedResourceId" AND ERDLS."dLSessionId" = LERDLS."dLSessionId"
            WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
            GROUP BY ERDLS."extractedResourceId"
            HAVING array_agg(LERDLS."labelId") @> ${input.filter.labelIds} AND array_length(array_agg(LERDLS."labelId"), 1) = ${input.filter.labelIds.length}
          ) res on res."extractedResourceId" = erdls."extractedResourceId"
        ` 
        : 
        Prisma.sql`
          JOIN "TaxonomyDataInDLSessions" tax on ERDLS."extractedResourceId" = tax."extractedResourceId" AND ERDLS."dLSessionId" = tax."dLSessionId"
          LEFT JOIN (
            SELECT
              "extractedResourceId",
              "dLSessionId",
              "labelId"
            FROM
              "LabelsInExtractedResourcesInDLSessions"
            WHERE
              "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
            GROUP BY "extractedResourceId", "dLSessionId", "labelId"
          ) res ON ERDLS."extractedResourceId" = res."extractedResourceId" AND ERDLS."dLSessionId" = res."dLSessionId"
        `
      }
      ${input.filter?.patientId ? 
        Prisma.sql`
          JOIN "ExtractedResource" ER on ER.id = ERDLS."extractedResourceId"
          JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
          JOIN "Visit" V ON V.id = RR."visitId"
          JOIN "Patient" P ON P.id = V."patientId"
        ` : Prisma.empty}
      ${input.filter.isApproved ? Prisma.sql` JOIN "UserApproval" UA ON ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" and ERDLS."dLSessionId" = UA."sessionId" ` : Prisma.sql` `}
      WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" is null 
      ${input.filter.isApproved ? Prisma.sql` and UA."approvalUserId" = ${userId} and UA."isNextApprover" = true ` : Prisma.empty}
      ${input.filter.unLabelled ? Prisma.sql` AND res."labelId" is null ` : Prisma.empty}
      ${input.filter?.status ? Prisma.sql` AND ERDLS.status::text = ${input.filter.status}` : Prisma.empty}
      ${input.filter?.patientId ? Prisma.sql` AND P.id = ${input.filter.patientId}` : Prisma.empty}
    `
    const annotatedCount = await db.$queryRaw<{ annotatedcount: number | null}[]>(annotatedCountQuery)
    return annotatedCount
  }

  static async listExtractedApprovalResources(input: DLSessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

      const query = Prisma.sql`
      SELECT 
      ua."approvalModuleUniqueId",
      ua."isNextApprover",
      CASE WHEN max(subquery."maxApproval") = MAX(CASE WHEN ua."isNextApprover" THEN ua."approvalLevel" END) THEN TRUE ELSE FALSE END as "isFinalApproval"
      FROM "UserApproval" ua 
      LEFT JOIN (
          SELECT 
              MAX(am."approvalLevel") as "maxApproval", 
              am."sessionId"
          FROM "ApprovalMatrix" am 
          WHERE am."sessionId" = ${input.filter.dLSessionId} AND am."isActive" = true
          GROUP BY am."sessionId"
      ) subquery ON ua."sessionId" = subquery."sessionId"
      WHERE ua."sessionId" = ${input.filter.dLSessionId}
          AND ua."isActive" = true
          AND ua."approvalUserId" = ${userId}
          AND ua."approvalStatusId" = ''
      GROUP BY ua."approvalModuleUniqueId", ua."isNextApprover"
      LIMIT ${input.limit} OFFSET ${input.offset};
      `
    return db.$queryRaw<(ExtractedResource)[]>(
      query,
    )
  }


  static async extractedResourcesPageCount(input: DLSessionListExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
  
    let subQuery: any[] = [];    
    input.filter?.labelIds?.forEach((label,index) => {
      subQuery.push(Prisma.raw(`INNER JOIN (
            SELECT DISTINCT
              "extractedResourceId",
              "dLSessionId",
              "labelId"
            FROM
              "LabelsInExtractedResourcesInDLSessions"
            WHERE
              "deletedAt" IS NULL AND "dLSessionId" = '${input.filter.dLSessionId}'
          ) LERDLS${index} 
          ON ERDLS."extractedResourceId" = LERDLS${index}."extractedResourceId" 
          AND ERDLS."dLSessionId" = LERDLS${index}."dLSessionId"
          AND LERDLS${index}."labelId" = 
      `))
      subQuery.push(Prisma.sql`${label}`)
    })

    const query = Prisma.sql`
      WITH 
      ${input.filter.freeze ? Prisma.sql`
      paginated_resource_ids AS (
        SELECT ERDLS."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        ORDER BY ERDLS."extractedResourceId"
        LIMIT ${input.limit} OFFSET ${input.offset}
      ),
      ` : Prisma.empty}
        eligible_resources AS (
          SELECT 
            ERDLS."extractedResourceId"
          FROM 
            "ExtractedResourcesInDLSessions" ERDLS
          ${input.filter.freeze ? Prisma.sql`
          INNER JOIN paginated_resource_ids PRI ON PRI."extractedResourceId" = ERDLS."extractedResourceId"
          ` : Prisma.empty}
          ${input.filter.unLabelled == true ? Prisma.sql`
            LEFT JOIN (
              SELECT DISTINCT
                "extractedResourceId",
                "dLSessionId",
                "labelId"
              FROM
                "LabelsInExtractedResourcesInDLSessions"
              WHERE
                "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
            ) LERDLS 
            ON ERDLS."extractedResourceId" = LERDLS."extractedResourceId" 
            AND ERDLS."dLSessionId" = LERDLS."dLSessionId"
            ` : Prisma.empty
          }
          ${input.filter?.labelIds?.length ? Prisma.join(subQuery,' ') : Prisma.empty}
          ${input.filter.isApproved ? Prisma.sql` JOIN "UserApproval" UA ON ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" and ERDLS."dLSessionId" = UA."sessionId" ` : Prisma.sql` `}
          WHERE 
            ERDLS."dLSessionId" = ${input.filter.dLSessionId}
            ${input.filter.isApproved ? Prisma.sql` AND UA."approvalUserId" = ${userId} and UA."isNextApprover" = true ` : Prisma.empty}
            ${input.filter?.status ? Prisma.sql`AND ERDLS.status::text = ${input.filter.status}` : Prisma.empty}
            ${input.filter.unLabelled ? Prisma.sql` AND LERDLS."labelId" IS NULL ` : Prisma.empty}
            ${input.filter.unAnnotated ? Prisma.sql` AND ERDLS."extractedResourceId" NOT IN ( SELECT DISTINCT tax."extractedResourceId"
            FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
            ${input.filter.annotated ? Prisma.sql` AND ERDLS."extractedResourceId" IN ( SELECT DISTINCT tax."extractedResourceId"
            FROM "TaxonomyDataInDLSessions" tax WHERE tax."dLSessionId" = ${input.filter.dLSessionId} AND tax."deletedAt" IS NULL) ` : Prisma.empty}
          GROUP BY 
            ERDLS."extractedResourceId"
        ),
        filtered_resources AS (
          SELECT 
            ER.id, 
            ER."rawResourceId",
            ROW_NUMBER() OVER (ORDER BY ER.id) AS row_num
          FROM 
            "ExtractedResource" ER
            INNER JOIN eligible_resources ER_ELIGIBLE ON ER.id = ER_ELIGIBLE."extractedResourceId"
            ${input.filter.freeze ? Prisma.sql`
            INNER JOIN paginated_resource_ids PRI ON PRI."extractedResourceId" = ER.id
            ` : Prisma.empty}
            ${input.filter?.patientId
              ? Prisma.sql`
            INNER JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
            INNER JOIN "Visit" V ON V.id = RR."visitId"
            INNER JOIN "Patient" P ON P.id = V."patientId"
          WHERE P.id = ${input.filter.patientId}`
          : Prisma.empty}
        )
      SELECT 
        CEIL(FR.row_num::decimal / ${input.limit})::int AS pageNumber, 
        FR.row_num::int as imageindex
      FROM 
        filtered_resources FR
      WHERE 
        FR.id = ${input.filter.imageId};
    `

    return db.$queryRaw<(ExtractedResource & { pagenumber: string; imageindex: string;})[]>(
      query,
    )
  }

  static async listPatients(input: DLSessionListPatientsInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const session = await db.dLSession.findFirst({
      where: {
        id: input.filter.dLSessionId,
        deletedAt: null
      }
    })

    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    const query = Prisma.sql`
      SELECT P.id as "patientId"
      FROM "ExtractedResourcesInDLSessions" ERDLS
      ${input.filter.freeze ? Prisma.sql`
      INNER JOIN (
        SELECT ERDLS2."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS2
        WHERE ERDLS2."dLSessionId" = ${input.filter.dLSessionId}
        ORDER BY ERDLS2."extractedResourceId"
        LIMIT ${input.limit} OFFSET ${input.offset}
      ) PRI ON PRI."extractedResourceId" = ERDLS."extractedResourceId"
      ` : Prisma.empty}
      ${input.filter?.labelIds?.length || input.filter.unLabelled ? 
        Prisma.sql`LEFT JOIN (
          SELECT DISTINCT
            "extractedResourceId",
            "dLSessionId",
            "labelId"
          FROM
            "LabelsInExtractedResourcesInDLSessions"
          WHERE
            "deletedAt" IS NULL AND "dLSessionId" = ${input.filter.dLSessionId}
        ) LERDLS ON ERDLS."extractedResourceId" = LERDLS."extractedResourceId" AND ERDLS."dLSessionId" = LERDLS."dLSessionId"` 
        : Prisma.empty
      }
      JOIN "ExtractedResource" ER ON ER.id = ERDLS."extractedResourceId"
      JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
      JOIN "Visit" V ON V.id = RR."visitId"
      JOIN "Patient" P on P.id = V."patientId"
      WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
      ${input.filter.unLabelled ? Prisma.sql` AND LERDLS."labelId" IS NULL ` : Prisma.empty}
      ${input.filter?.status ? Prisma.sql`AND ERDLS.status::text = ${input.filter.status}` : Prisma.empty}
      GROUP BY P.id
      ${input.filter?.labelIds?.length ? Prisma.sql`HAVING array_agg(LERDLS."labelId") @> ${input.filter.labelIds}` : Prisma.empty}
    `

    return db.$queryRaw<{ patientId: string; extractedResourcesCount: number }[]>(
      query,
    )
  }

  static async listFilterOptions(input: DLSessionListFilterOptionsInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const session = await db.dLSession.findFirst({
      where: {
        id: input.filter.dLSessionId,
        deletedAt: null
      }
    })

    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    // Get distinct statuses
    const statusQuery = Prisma.sql`
      SELECT DISTINCT ERDLS.status
      FROM "ExtractedResourcesInDLSessions" ERDLS
      ${input.filter.freeze ? Prisma.sql`
      INNER JOIN (
        SELECT ERDLS2."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS2
        WHERE ERDLS2."dLSessionId" = ${input.filter.dLSessionId}
        ORDER BY ERDLS2."extractedResourceId"
        LIMIT ${input.limit} OFFSET ${input.offset}
      ) PRI ON PRI."extractedResourceId" = ERDLS."extractedResourceId"
      ` : Prisma.empty}
      WHERE ERDLS."dLSessionId" = ${input.filter.dLSessionId}
      ORDER BY ERDLS.status
    `

    // Get labels that exist in the dataset
    const labelsQuery = Prisma.sql`
      SELECT DISTINCT
        L.id,
        L.name,
        L.abbreviation,
        L."createdAt",
        L."updatedAt"
      FROM "Label" L
      INNER JOIN "LabelsInDLSessions" LIDLS ON LIDLS."labelId" = L.id
      INNER JOIN "LabelsInExtractedResourcesInDLSessions" LIERDLS ON LIERDLS."labelId" = L.id
      ${input.filter.freeze ? Prisma.sql`
      INNER JOIN (
        SELECT ERDLS2."extractedResourceId"
        FROM "ExtractedResourcesInDLSessions" ERDLS2
        WHERE ERDLS2."dLSessionId" = ${input.filter.dLSessionId}
        ORDER BY ERDLS2."extractedResourceId"
        LIMIT ${input.limit} OFFSET ${input.offset}
      ) PRI ON PRI."extractedResourceId" = LIERDLS."extractedResourceId"
      ` : Prisma.empty}
      WHERE LIDLS."dLSessionId" = ${input.filter.dLSessionId}
        AND LIERDLS."dLSessionId" = ${input.filter.dLSessionId}
        AND LIERDLS."deletedAt" IS NULL
      ORDER BY L.name
    `

    const [statuses, labels] = await Promise.all([
      db.$queryRaw<{ status: ExtractedResourceStatus }[]>(statusQuery),
      db.$queryRaw<{ id: string; name: string; abbreviation: string; createdAt: Date; updatedAt: Date }[]>(labelsQuery)
    ])

    return {
      statuses: statuses.map(s => s.status),
      labels: labels
    }
  }

  static async updateManyExtractedResources(input: DLSessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return db.$transaction(input.extractedResources.map((resource) => {
      const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsUpdateArgs>()({
        where: {
          extractedResourceId_dLSessionId: {
            dLSessionId: input.dLSessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          labels: resource.labelIds !== undefined && resource.labelIds?.length ? {
            updateMany: {
              where: {
                dLSessionId: input.dLSessionId,
                extractedResourceId: resource.id
              },
              data : {
                deletedAt: new Date(),
              },
            },
            createMany: {
              data : resource.labelIds.map(labelId => ({
                labelId,
                createdBy: userId,
                updatedBy: userId,
                approvalLevel: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status,
              })),
            },
          } : {
            updateMany : {
              where : {
                dLSessionId: input.dLSessionId,
                extractedResourceId: resource.id,
              },
              data : {
                createdBy: userId,
                updatedBy: userId,
                deletedAt: new Date(),
                approvalLevel: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status,
              },
            },
          },
          dLSession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      return this.dLSessionRepository().updateExtractedResource(args)
    }) as any)
  }

  static async submitManyExtractedResources(input: DLSessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const approvalCheckArgs = Prisma.validator<Prisma.ApprovalMatrixFindManyArgs>()({
      select: {
        toUserId: true,
        approvalLevel: true
      },
      where: {
        sessionId : input.dLSessionId,
        isActive: true
      }
    })

    const list =  await this.approvalModuleRepository().findMany(approvalCheckArgs)

    if (list.length === 0) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active approvers found for the session' });
    }

    return db.$transaction(input.extractedResources.map((resource) => {
      
      const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsUpdateArgs>()({
        where: {
          extractedResourceId_dLSessionId: {
            dLSessionId: input.dLSessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          status: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW',
          dLSession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      if(resource.isReSubmit == true){
        let resubmit =  this.approvalModuleRepository().resubmitApproval(input.dLSessionId,resource.id,userId)
      } else if(resource.status == "IN_REVIEW"){
        let insertApproval = this.approvalModuleRepository().insertDynamicModifyApproval(input.dLSessionId,resource.id,userId)
      }
      return this.dLSessionRepository().updateExtractedResource(args)
    }) as any)
  }

  static async rejectManyExtractedResources(input: DLSessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return db.$transaction(input.extractedResources.map((resource) => {
      const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsUpdateArgs>()({
        where: {
          extractedResourceId_dLSessionId: {
            dLSessionId: input.dLSessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          status: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW',
          dLSession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      if(resource.isReSubmit == true){
        let resubmit =  this.approvalModuleRepository().resubmitApproval(input.dLSessionId,resource.id,userId)
      } else if(resource.status == "REJECTED" || resource.status == "ACCEPTED"){
        let UpdateApproval =  this.approvalModuleRepository().updateApproval(input.dLSessionId,resource.id,userId,resource.status)
      }
      return this.dLSessionRepository().updateExtractedResource(args)
    }) as any)
  }

  static async acceptManyExtractedResources(input: DLSessionUpdateManyExtractedResourcesInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return db.$transaction(input.extractedResources.map((resource) => {
      const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsUpdateArgs>()({
        where: {
          extractedResourceId_dLSessionId: {
            dLSessionId: input.dLSessionId,
            extractedResourceId: resource.id,
          },
        },
        data: {
          status: (resource.isFinalApproval == true  && resource.status == 'ACCEPTED') ? "ACCEPTED" : resource.status == 'REJECTED' ? resource.status : 'IN_REVIEW',
          dLSession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      })

      if(resource.isReSubmit == true){
        let resubmit =  this.approvalModuleRepository().resubmitApproval(input.dLSessionId,resource.id,userId)
      } else if(resource.status == "REJECTED" || resource.status == "ACCEPTED"){
        let UpdateApproval =  this.approvalModuleRepository().updateApproval(input.dLSessionId,resource.id,userId,resource.status)
      }
      return this.dLSessionRepository().updateExtractedResource(args)
    }) as any)
  }

  static async getTaxonomyData(input: GetTaxonomyDataInput, isAdmin: boolean, userId: string | undefined) {
    const query = Prisma.sql`
      SELECT t.*, tt."name" as type, a."name" as name, a."colorCode", tas."id" as "taxonomiesAnnotationsInDLSessionsId",tas."changeAppearance", a."abbreviation"as "annotation_abbreviation"
      FROM "TaxonomyDataInDLSessions" t
      LEFT JOIN "TaxonomiesAnnotationsInDLSessions" tas ON tas."id" = t."taxonomiesAnnotationsInDLSessionsId"
      LEFT JOIN "Annotation" a ON a."id" = tas."annotationId"
      LEFT JOIN "TaxonomyType" tt on tt.id = a."taxonomyTypeId"  
      WHERE t."dLSessionId" = ${input.dLSessionId} 
      AND t."extractedResourceId" = ${input.extractedResourceId} 
      AND t."deletedAt" is NULL
    `
    const results = await db.$queryRaw(query)
  
    const childQuery = Prisma.sql`
     SELECT ctt.*, tt."name" as type, a."name" as name, 
      a."colorCode",  
       tas."changeAppearance",
       tas."id" as "taxonomiesAnnotationsInDLSessionsId",
       a."abbreviation"as "annotation_abbreviation"
FROM "ChildTaxonomyDataInDLSessions" ctt
LEFT JOIN "ChildTaxonomy" ct on ct."id" = ctt."childTaxonomyId"
LEFT JOIN "TaxonomiesAnnotationsInDLSessions" tas ON tas."id" = ct."taxonomiesAnnotationsInDLSessionsId"
LEFT JOIN "Annotation" a ON a."id" = tas."annotationId"
LEFT JOIN "TaxonomyType" tt on tt.id = a."taxonomyTypeId"
WHERE ctt."dLSessionId" = ${input.dLSessionId}
AND ctt."extractedResourceId" = ${input.extractedResourceId}
AND ctt."deletedAt" IS NULL
AND ct."deletedAt" IS NULL
ORDER BY ct."name" asc
    `
    const secondResults: any = await db.$queryRaw(childQuery);
  
    const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsFindUniqueArgs>()({
      select: {
        markupData: true
      },
      where: {
        extractedResourceId_dLSessionId: {
          dLSessionId: input.dLSessionId,
          extractedResourceId: input.extractedResourceId
        }
      }
    })
  
    const markupDataResult = await db.extractedResourcesInDLSessions.findUnique(args)
    results['markupData'] = markupDataResult;
  
    return { parentData: results, childtaxonomydata: secondResults, markupDataResult }
  }

  static async getMarkupData(input: GetMarkupDataInput, isAdmin: boolean, userId: string | undefined) {
    const args = Prisma.validator<Prisma.ExtractedResourcesInDLSessionsFindUniqueArgs>()({
      select : {
        markupData : true
      },
      where : {
        extractedResourceId_dLSessionId : {
          dLSessionId : input.dLSessionId,
          extractedResourceId : input.extractedResourceId
        }
      }
    })
    const markupDataResult = await db.extractedResourcesInDLSessions.findUnique(args)
    return markupDataResult
  }

  static async deleteSingleTaxonomyData(input: DeleteSingleTaxonomyDataInput, isAdmin: boolean, userId: string | undefined) {
    // Query to delete parent TaxonomyDataInDLSessions records by taxonomiesAnnotationsInDLSessionsId
    // This matches when the input.taxonomyId is a TaxonomiesAnnotationsInDLSessions.id
    const parentQuery = Prisma.sql`
      UPDATE "TaxonomyDataInDLSessions" 
      SET "deletedAt" = ${Prisma.sql`current_timestamp`} 
      WHERE "dLSessionId" = ${input.dLSessionId} 
        AND "extractedResourceId" = ${input.extractedResourceId} 
        AND "deletedAt" is NULL 
        AND "taxonomiesAnnotationsInDLSessionsId" IN (${Prisma.join(input.taxonomyId)})
    `

    const childQuery = Prisma.sql`
      UPDATE "ChildTaxonomyDataInDLSessions" 
      SET "deletedAt" = ${Prisma.sql`current_timestamp`} 
      WHERE "dLSessionId" = ${input.dLSessionId} 
        AND "extractedResourceId" = ${input.extractedResourceId} 
        AND "deletedAt" is NULL 
        AND "id" IN (${Prisma.join(input.taxonomyId)})
        AND "id" NOT IN (
          SELECT DISTINCT "taxonomiesAnnotationsInDLSessionsId" 
          FROM "TaxonomyDataInDLSessions" 
          WHERE "dLSessionId" = ${input.dLSessionId} 
            AND "extractedResourceId" = ${input.extractedResourceId}
            AND "deletedAt" is NULL
        )
    `
    const results = await db.$executeRaw(parentQuery)
    const childResults = await db.$executeRaw(childQuery)
    return [results,childResults]
  }

  static async deleteChildTaxonomyData(input: DeleteSingleTaxonomyDataInput, isAdmin: boolean, userId: string | undefined) {
    const query = Prisma.sql`
      UPDATE "ChildTaxonomy" SET "deletedAt" = ${Prisma.sql`current_timestamp`} WHERE "dLSessionId" = ${input.dLSessionId} and "extractedResourceId" = ${input.extractedResourceId} and "deletedAt" is NULL and "id" IN (${Prisma.join(input.taxonomyId)})
    `
    const results = await db.$executeRaw(query)
    return results
  }

  static async updateTaxonomyData(input: UpdateTaxonomyDataInput, isAdmin: boolean, userId: string | undefined) {
    let parentOutputData;
    
    if(input.taxonomies.filter((d: any) => !d.isChild).length){
      const deleteQuery = Prisma.sql`UPDATE "TaxonomyDataInDLSessions" SET "deletedAt" = ${Prisma.sql`current_timestamp`} WHERE "dLSessionId" = ${input.dLSessionId} AND "extractedResourceId" = ${input.extractedResourceId} AND "deletedAt" is null`;
      await db.$executeRaw(deleteQuery)

      const data = [];
      input.taxonomies.filter((d: any) => !d.isChild).forEach((d: any) => {
        data.push([
          Prisma.sql`gen_random_uuid()`, 
          input.dLSessionId, 
          input.extractedResourceId,
          Prisma.sql`${d.taxonomiesAnnotationsInDLSessionsId}::uuid`,  // Cast to UUID
          d.taxonomyTypeId, 
          d.taxonomyData, 
          userId, 
          userId, 
          Prisma.sql`CURRENT_TIMESTAMP`
        ])
      })

      const insertQuery = Prisma.sql`
        INSERT INTO "TaxonomyDataInDLSessions" ("id", "dLSessionId", "extractedResourceId", "taxonomiesAnnotationsInDLSessionsId", "typesInTaxonomyId", "taxonomyData", "createdBy", "updatedBy", "updatedAt")
        VALUES ${Prisma.join(data.map((row) => Prisma.sql`(${Prisma.join(row)})`))};`;
      
      parentOutputData = await db.$executeRaw(insertQuery);
    }

    const childTaxonomyData = input.taxonomies.filter((d: any) => d.isChild)

    const existingNames = await db.childTaxonomy.findMany({
      where: {
        name: { in: childTaxonomyData.map(e => e.taxonomyData.name) },
        dLSessionId: input.dLSessionId,
        extractedResourceId: input.extractedResourceId,
        deletedAt: null
      },
      select: { name: true }
    });

    const existingNameSet = new Set(existingNames.map(e => e.name));
    const filteredChildTaxonomyData = childTaxonomyData.filter((e) => !existingNameSet.has(e.taxonomyData.name));

    if (filteredChildTaxonomyData.length > 0) {
      const createChildTaxonomyDataArgs = Prisma.validator<Prisma.ChildTaxonomyCreateManyArgs>()({
        data: filteredChildTaxonomyData.map((e) => ({
          name: e.taxonomyData.name,
          dLSessionId: input.dLSessionId,
          extractedResourceId: input.extractedResourceId,
          taxonomiesAnnotationsInDLSessionsId: e.taxonomiesAnnotationsInDLSessionsId
        }))
      });
    
      await db.childTaxonomy.createMany(createChildTaxonomyDataArgs);
    }

    async function findIds(data: any) {
      const findChildTaxonomyIdsArgs = Prisma.validator<Prisma.ChildTaxonomyFindManyArgs>()({
        select: {
          id: true,
          name: true,
        },
        where: {
          name: data.name,
          dLSessionId: input.dLSessionId,
          taxonomiesAnnotationsInDLSessionsId: data.taxonomiesAnnotationsInDLSessionsId,
          extractedResourceId: input.extractedResourceId,
          deletedAt: null
        }
      });
      return await db.childTaxonomy.findMany(findChildTaxonomyIdsArgs);
    }

    const childData: any[] = [];
    for (const d of input.taxonomies.filter((d: any) => d.isChild && !d.taxonomyData.unAnnotated)) {
      const taxonomyIds = await findIds(d.taxonomyData);
      childData.push([
        Prisma.sql`gen_random_uuid()`,
        input.dLSessionId,
        input.extractedResourceId,
        Prisma.sql`${d.taxonomiesAnnotationsInDLSessionsId}::uuid`,  // Cast to UUID
        d.taxonomyData,
        d.taxonomyData.typesInTaxonomyId,
        d.taxonomyData.index,
        taxonomyIds[0].id,
        userId,
        userId,
        Prisma.sql`CURRENT_TIMESTAMP`
      ]);
    }

    let childOutputData;
    if (childData.length > 0) {
      const deleteQuery = Prisma.sql`UPDATE "ChildTaxonomyDataInDLSessions" SET "deletedAt" = ${Prisma.sql`current_timestamp`} WHERE "dLSessionId" = ${input.dLSessionId} AND "extractedResourceId" = ${input.extractedResourceId} AND "deletedAt" IS NULL`;
      
      await db.$executeRaw(deleteQuery);

      const insertChildQuery = Prisma.sql`INSERT INTO "ChildTaxonomyDataInDLSessions" ("id", "dLSessionId", "extractedResourceId", "taxonomiesAnnotationsInDLSessionsId", "taxonomyData", "typesInTaxonomyId", "index", "childTaxonomyId", "createdBy", "updatedBy", "updatedAt")
        VALUES ${Prisma.join(childData.map((row: any) => Prisma.sql`(${Prisma.join(row)})`))}`;
      
      childOutputData = await db.$executeRaw(insertChildQuery);
    }

    return { parentOutputData, childOutputData };
}

  static async updateMarkupData(input: UpdateMarkupDataInput, isAdmin: boolean, userId: string | undefined) {
    const insertQuery = Prisma.sql`
      UPDATE "ExtractedResourcesInDLSessions" SET "markupData" = ${input.markupData} WHERE "dLSessionId" = ${input.dLSessionId} and "extractedResourceId" = ${input.extractedResourceId}
      `;
    await db.$executeRaw(insertQuery)
  }
  
  
  static async sendPatientForQC(input: SendPatientForQCInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const approvalCheckArgs = Prisma.validator<Prisma.ApprovalMatrixFindManyArgs>()({
      select: {
        toUserId: true,
        approvalLevel: true
      },
      where: {
        sessionId : input.dLSessionId,
        isActive: true
      }
    })

    const list =  await this.approvalModuleRepository().findMany(approvalCheckArgs)
    
    if (list.length === 0) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active approvers found for the session' });
    }

    const extractedResourcesQuery = Prisma.sql`
      select er.id, erid.status
      from "ExtractedResourcesInDLSessions" erid
      join "ExtractedResource" er on er.id = erid."extractedResourceId"
      join "RawResource" rr on rr.id = er."rawResourceId" 
      join "Visit" v on v.id = rr."visitId" 
      where 
      v."patientId" = ${input.patientId} and
      erid."status" = 'PENDING' and
      erid."dLSessionId" = ${input.dLSessionId}
    `
    const extractedResources = await db.$queryRaw(extractedResourcesQuery)

    const query = Prisma.sql`
      update "ExtractedResourcesInDLSessions" erid
      set status = 'IN_REVIEW'
      from "ExtractedResource" er  
      join "RawResource" rr on rr.id = er."rawResourceId" 
      join "Visit" v on v.id = rr."visitId" 
      where 
      er.id = erid."extractedResourceId" and 
      v."patientId" = ${input.patientId} and
      erid."status" = 'PENDING' and
      erid."dLSessionId" = ${input.dLSessionId}
    `
    const result = await db.$queryRaw(query)

    await Promise.all(extractedResources.map(async (resource) => {
      if (resource.status == "REJECTED") {
        await this.approvalModuleRepository().resubmitApproval(input.dLSessionId, resource.id, userId);
      } else if (resource.status == "PENDING") {
        await this.approvalModuleRepository().insertDynamicModifyApproval(input.dLSessionId, resource.id, userId);
      }
    }));
    return true;
  }

  static async projectImageSearch(input: ProjectImageSearchInput, isAdmin: boolean, userId: string) {
    const query = Prisma.sql`
      WITH resources_by_patient AS (
        SELECT 
            ER.*,
            ERDLS."dLSessionId",
            P.id as "patientId",
            D.name,
            ERDLS."status",
            D."projectId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        JOIN "DLSession" D ON D.id = ERDLS."dLSessionId"
        JOIN "ExtractedResource" ER on erdls."extractedResourceId" = er.id
        JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
        JOIN "Visit" V ON V.id = RR."visitId"
        JOIN "Patient" P ON P.id = V."patientId"
        WHERE D."projectId" = ${input.projectId}
      )
      SELECT 
        PD.id,
          PD."dLSessionId",
          PD."patientId",
          PD.name,
          PD."status"
      FROM resources_by_patient PD
      where PD.id = ${input.imageId};
    `
    return db.$queryRaw(query)
  }

  static async getPageForProjectImageSearch(input: GetPageProjectImageSearchInput, isAdmin: boolean, userId: string) {
    const query = Prisma.sql`
      WITH resources_by_patient AS (
        SELECT 
            ER.*,
            ERDLS."dLSessionId",
            P.id as "patientId",
            D.name,
            ERDLS."status",
            D."projectId"
        FROM "ExtractedResourcesInDLSessions" ERDLS
        JOIN "DLSession" D ON D.id = ERDLS."dLSessionId"
        JOIN "ExtractedResource" ER on erdls."extractedResourceId" = er.id
        JOIN "RawResource" RR ON RR.id = ER."rawResourceId"
        JOIN "Visit" V ON V.id = RR."visitId"
        JOIN "Patient" P ON P.id = V."patientId"
        WHERE D."projectId" = ${input.projectId} and D.id = ${input.dLSessionId}
      ),
      paginated_data AS (
          SELECT 
              RBP.*,
              ROW_NUMBER() OVER (PARTITION BY RBP."dLSessionId" ORDER BY RBP.id) AS row_num
          FROM resources_by_patient RBP
      )
      SELECT 
        PD.id,
          PD."dLSessionId",
          PD."patientId",
          PD.name,
          PD."status",
          CEIL(PD.row_num::decimal / 200)::int AS pageNumber,
          ((PD.row_num::int - 1) % 200) + 1 as imageindex
      FROM paginated_data PD
      where PD.id = ${input.imageId}
    `
    return db.$queryRaw(query)
  }
  static async calculateDifferences(
    existingAnnotations: TaxonomyAnnotation[],
    newAnnotations: TaxonomyAnnotation[],
    dLSessionId: string
  ): Promise<DiffResult> {
    const existingSet = new Set(
      existingAnnotations.map(ea => `${ea.taxonomyId}-${ea.annotationId}`)
    );
    const newSet = new Set(
      newAnnotations.map(ta => `${ta.taxonomyId}-${ta.annotationId}`)
    );
  
    const toCreate = newAnnotations.filter(ta => 
      !existingSet.has(`${ta.taxonomyId}-${ta.annotationId}`)
    );
  
    // Get records to soft delete with their counts
    const toDelete = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        dLSessionId,
        deletedAt: null,
        OR: existingAnnotations
          .filter(ea => !newSet.has(`${ea.taxonomyId}-${ea.annotationId}`))
          .map(({ taxonomyId, annotationId }) => ({
            taxonomyId,
            annotationId
          }))
      },
      include: {
        _count: {
          select: {
            TaxonomyDataInDLSessions: {
              where: { deletedAt: null }
            },
            ChildTaxonomyDataInDLSessions: {
              where: { deletedAt: null }
            },
            ChildTaxonomy: {
              where: { deletedAt: null }
            }
          }
        },
        taxonomy: {
          select: {
            name: true
          }
        },
        annotation: {
          select: {
            name: true
          }
        }
      }
    });
  
    const toDeleteWithCounts = toDelete.map(record => ({
      id: record.id,
      taxonomyId: record.taxonomyId,
      annotationId: record.annotationId,
      taxonomyName: record.taxonomy.name,
      annotationName: record.annotation.name,
      relatedCounts: {
        taxonomyDataCount: record._count.TaxonomyDataInDLSessions,
        childTaxonomyDataCount: record._count.ChildTaxonomyDataInDLSessions,
        childTaxonomyCount: record._count.ChildTaxonomy,
        totalCount: 
          record._count.TaxonomyDataInDLSessions +
          record._count.ChildTaxonomyDataInDLSessions +
          record._count.ChildTaxonomy
      }
    }));
  
    return { toCreate, toDelete: toDeleteWithCounts };
  }
  
  //Main Taxonomy Update Function
  static async updateTaxonomyAnnotations(
    dLSessionId: string,
    taxonomyAnnotationsData: TaxonomyAnnotation[],
    userId: string,
    confirmDeletion: boolean = false,
    handleEmptyAsDelete: boolean = false
  ): Promise<DeleteResult> {
    // Input validation
    if (!dLSessionId?.trim()) {
      return { error: 'dLSessionId is required' };
    }
    
    if (!userId?.trim()) {
      return { error: 'userId is required' };
    }
  
    if (!Array.isArray(taxonomyAnnotationsData)) {
      return { error: 'taxonomyAnnotationsData must be an array' };
    }
  
    // Validate each taxonomy annotation
    const validationErrors = taxonomyAnnotationsData
      .map((item, index) => {
        const errors = [];
        if (!item.taxonomyId?.trim()) errors.push(`taxonomyId at index ${index}`);
        if (!item.annotationId?.trim()) errors.push(`annotationId at index ${index}`);
        if (typeof item.changeAppearance !== 'boolean') errors.push(`changeAppearance at index ${index} must be boolean`);
        return errors;
      })
      .flat();
  
    if (validationErrors.length > 0) {
      return { error: `Invalid data: ${validationErrors.join(', ')}` };
    }
  
    try {
      return await db.$transaction(async (tx) => {
        // Step 1: Fetch existing annotations with better error handling
        const existingAnnotations = await tx.taxonomiesAnnotationsInDLSessions.findMany({
          where: { 
            dLSessionId,
            deletedAt: null
          },
          include: {
            _count: {
              select: {
                TaxonomyDataInDLSessions: {
                  where: { deletedAt: null }
                },
                ChildTaxonomyDataInDLSessions: {
                  where: { deletedAt: null }
                },
                ChildTaxonomy: {
                  where: { deletedAt: null }
                }
              }
            },
            taxonomy: {
              select: { 
                name: true,
                id: true // Include ID for better debugging
              }
            },
            annotation: {
              select: { 
                name: true,
                id: true // Include ID for better debugging
              }
            }
          }
        });
  
        // Step 2: Handle "Delete All" scenario (improved)
        if (handleEmptyAsDelete && taxonomyAnnotationsData.length === 0) {
          if (existingAnnotations.length === 0) {
            return {
              success: true,
              created: 0,
              deleted: 0,
              updated: 0
            };
          }
  
          const recordsWithDependencies = existingAnnotations.filter(record => {
            const totalDependencies = record._count.TaxonomyDataInDLSessions +
                                     record._count.ChildTaxonomyDataInDLSessions +
                                     record._count.ChildTaxonomy;
            return totalDependencies > 0;
          });
  
          // Require confirmation if there are dependencies
          if (recordsWithDependencies.length > 0 && !confirmDeletion) {
            return {
              requiresConfirmation: true,
              annotationsToDelete: recordsWithDependencies.map(record => ({
                taxonomyName: record.taxonomy?.name || 'Unknown',
                annotationName: record.annotation?.name || 'Unknown',
                counts: {
                  taxonomyDataCount: record._count.TaxonomyDataInDLSessions,
                  childTaxonomyDataCount: record._count.ChildTaxonomyDataInDLSessions,
                  childTaxonomyCount: record._count.ChildTaxonomy,
                  totalCount: 
                    record._count.TaxonomyDataInDLSessions +
                    record._count.ChildTaxonomyDataInDLSessions +
                    record._count.ChildTaxonomy
                }
              }))
            };
          }
  
          // Perform batch deletion with improved error handling
          const now = new Date();
          const recordIds = existingAnnotations.map(record => record.id);
          
          if (recordIds.length > 0) {
            // Batch soft delete related records with better error handling
            const deletePromises = [
              tx.taxonomyDataInDLSessions.updateMany({
                where: { taxonomiesAnnotationsInDLSessionsId: { in: recordIds } },
                data: { deletedAt: now }
              }),
              tx.childTaxonomyDataInDLSessions.updateMany({
                where: { taxonomiesAnnotationsInDLSessionsId: { in: recordIds } },
                data: { deletedAt: now }
              }),
              tx.childTaxonomy.updateMany({
                where: { taxonomiesAnnotationsInDLSessionsId: { in: recordIds } },
                data: { deletedAt: now }
              })
            ];
  
            await Promise.allSettled(deletePromises).then(results => {
              results.forEach((result, index) => {
                if (result.status === 'rejected') {
                  console.error(`Failed to delete related records (step ${index + 1}):`, result.reason);
                }
              });
            });
  
            // Batch soft delete the annotation records
            await tx.taxonomiesAnnotationsInDLSessions.updateMany({
              where: { id: { in: recordIds } },
              data: { 
                deletedAt: now,
                deletedBy: userId
              }
            });
          }
  
          return {
            success: true,
            created: 0,
            deleted: existingAnnotations.length,
            updated: 0
          };
        }
  
        // Step 3: Create efficient lookup maps with duplicate detection
        const existingMap = new Map(
          existingAnnotations.map(ea => [`${ea.taxonomyId}-${ea.annotationId}`, ea])
        );
  
        // Check for duplicates in input data
        const newMap = new Map<string, TaxonomyAnnotation>();
        const duplicateKeys = new Set<string>();
        
        for (const ta of taxonomyAnnotationsData) {
          const key = `${ta.taxonomyId}-${ta.annotationId}`;
          if (newMap.has(key)) {
            duplicateKeys.add(key);
          }
          newMap.set(key, ta);
        }
  
        if (duplicateKeys.size > 0) {
          return { 
            error: `Duplicate taxonomy-annotation combinations found: ${Array.from(duplicateKeys).join(', ')}` 
          };
        }
  
        // Step 4: Identify changes with better categorization
        const toUpdate = []; // Records with changed changeAppearance
        const toDelete = []; // Records not in new data
        const unchanged = []; // Records with no changes
  
        for (const existing of existingAnnotations) {
          const key = `${existing.taxonomyId}-${existing.annotationId}`;
          const newData = newMap.get(key);
          
          if (!newData) {
            toDelete.push(existing);
          } else if (newData.changeAppearance !== existing.changeAppearance) {
            toUpdate.push({ existing, newData });
          } else {
            unchanged.push(existing);
          }
        }
  
        // Step 5: Handle dependency checking for deletions only
        if (toDelete.length > 0) {
          const recordsWithDependencies = toDelete.filter(record => {
            const totalDependencies = record._count.TaxonomyDataInDLSessions +
                                     record._count.ChildTaxonomyDataInDLSessions +
                                     record._count.ChildTaxonomy;
            return totalDependencies > 0;
          });
  
          if (recordsWithDependencies.length > 0 && !confirmDeletion) {
            return {
              requiresConfirmation: true,
              annotationsToDelete: recordsWithDependencies.map(record => ({
                taxonomyName: record.taxonomy?.name || 'Unknown',
                annotationName: record.annotation?.name || 'Unknown',
                counts: {
                  taxonomyDataCount: record._count.TaxonomyDataInDLSessions,
                  childTaxonomyDataCount: record._count.ChildTaxonomyDataInDLSessions,
                  childTaxonomyCount: record._count.ChildTaxonomy,
                  totalCount: 
                    record._count.TaxonomyDataInDLSessions +
                    record._count.ChildTaxonomyDataInDLSessions +
                    record._count.ChildTaxonomy
                }
              }))
            };
          }
        }

        const now = new Date();
        let createdCount = 0;
        let deletedCount = 0;
        let updatedCount = 0;
  
        // Step 6: Process updates (changeAppearance changes)
        if (toUpdate.length > 0) {
          try {
            // Create new records for changeAppearance updates
            const newRecords = await Promise.all(
              toUpdate.map(({ existing, newData }) =>
                tx.taxonomiesAnnotationsInDLSessions.create({
                  data: {
                    taxonomyId: existing.taxonomyId,
                    annotationId: existing.annotationId,
                    dLSessionId,
                    changeAppearance: newData.changeAppearance,
                    createdBy: userId,
                    updatedBy: userId
                  }
                })
              )
            );
            
            // Update references to new records
            for (let i = 0; i < toUpdate.length; i++) {
              const oldRecord = toUpdate[i].existing;
              const newRecord = newRecords[i];
              
              const updatePromises = [
                tx.taxonomyDataInDLSessions.updateMany({
                  where: { taxonomiesAnnotationsInDLSessionsId: oldRecord.id },
                  data: { taxonomiesAnnotationsInDLSessionsId: newRecord.id }
                }),
                tx.childTaxonomyDataInDLSessions.updateMany({
                  where: { taxonomiesAnnotationsInDLSessionsId: oldRecord.id },
                  data: { taxonomiesAnnotationsInDLSessionsId: newRecord.id }
                }),
                tx.childTaxonomy.updateMany({
                  where: { taxonomiesAnnotationsInDLSessionsId: oldRecord.id },
                  data: { taxonomiesAnnotationsInDLSessionsId: newRecord.id }
                })
              ];
  
              await Promise.allSettled(updatePromises).then(results => {
                results.forEach((result, index) => {
                  if (result.status === 'rejected') {
                    console.error(`Failed to update references for record ${oldRecord.id} (step ${index + 1}):`, result.reason);
                  }
                });
              });
            }
  
            // Soft delete old records
            const oldRecordIds = toUpdate.map(({ existing }) => existing.id);
            await tx.taxonomiesAnnotationsInDLSessions.updateMany({
              where: { id: { in: oldRecordIds } },
              data: { 
                deletedAt: now,
                deletedBy: userId
              }
            });
  
            updatedCount = toUpdate.length;
          } catch (error) {
            console.error('Error processing updates:', error);
            throw error;
          }
        }
  
        // Step 7: Process deletions
        if (toDelete.length > 0) {
          try {
            const deleteIds = toDelete.map(record => record.id);
            
            // Batch soft delete related records
            const deletePromises = [
              tx.taxonomyDataInDLSessions.updateMany({
                where: { taxonomiesAnnotationsInDLSessionsId: { in: deleteIds } },
                data: { deletedAt: now }
              }),
              tx.childTaxonomyDataInDLSessions.updateMany({
                where: { taxonomiesAnnotationsInDLSessionsId: { in: deleteIds } },
                data: { deletedAt: now }
              }),
              tx.childTaxonomy.updateMany({
                where: { taxonomiesAnnotationsInDLSessionsId: { in: deleteIds } },
                data: { deletedAt: now }
              })
            ];
  
            await Promise.allSettled(deletePromises).then(results => {
              results.forEach((result, index) => {
                if (result.status === 'rejected') {
                  console.error(`Failed to delete related records (step ${index + 1}):`, result.reason);
                }
              });
            });
  
            // Soft delete the annotation records
            await tx.taxonomiesAnnotationsInDLSessions.updateMany({
              where: { id: { in: deleteIds } },
              data: { 
                deletedAt: now,
                deletedBy: userId
              }
            });
  
            deletedCount = toDelete.length;
          } catch (error) {
            console.error('Error processing deletions:', error);
            throw error;
          }
        }
  
        // Step 8: Create new annotations with improved batch processing
        const toCreate = taxonomyAnnotationsData.filter(newRecord => {
          const key = `${newRecord.taxonomyId}-${newRecord.annotationId}`;
          return !existingMap.has(key);
        });
  
        if (toCreate.length > 0) {
          try {
            const BATCH_SIZE = 100;
            let totalCreated = 0;
            
            for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
              const batch = toCreate.slice(i, i + BATCH_SIZE);
              const result = await tx.taxonomiesAnnotationsInDLSessions.createMany({
                data: batch.map(item => ({
                  taxonomyId: item.taxonomyId,
                  annotationId: item.annotationId,
                  changeAppearance: item.changeAppearance,
                  dLSessionId,
                  createdBy: userId,
                  updatedBy: userId
                })),
                skipDuplicates: true // Handle race conditions
              });
              
              totalCreated += result.count;
            }
            
            createdCount = totalCreated;
          } catch (error) {
            console.error('Error creating new annotations:', error);
            throw error;
          }
        }
  
        return {
          success: true,
          created: createdCount,
          deleted: deletedCount,
          updated: updatedCount
        };
      }, {
        timeout: 120000, // 2 minutes timeout
        maxWait: 5000,   // Max time to wait for transaction to start
        isolationLevel: 'ReadCommitted' // Appropriate isolation level
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async checkSessionExists(dLSessionId: string, userId: string | undefined) {
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Check if the session exists and is not deleted
    const session = await db.dLSession.findFirst({
      where: {
        id: dLSessionId,
        deletedAt: null
      }
    });

    return session !== null; // Return true if session exists, false otherwise
  }

  static async statusAnalyseData(input: any, isAdmin: boolean, userId: string | undefined): Promise<any[]> {
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
  
    const sortField = Object.keys(input.sort[0])[0];
    const sortDirection = input.sort[0][sortField];
    const dbSortField =
      sortField === 'count' || sortField === 'extractedresourcecount' || sortField === 'extractedResourceCount'
        ? '"extractedResourceCount"'
        : sortField
  
    // Query to get status counts with approval levels
    const statusQuery = Prisma.sql`
      WITH status_with_approval AS (
        SELECT 
          ERDLS.status,
          CASE 
            WHEN UA."approvalLevel" IS NOT NULL THEN 
              ERDLS.status || ' L' || UA."approvalLevel"::text
            ELSE 
              ERDLS.status::text
          END as status_with_level,
          COUNT(DISTINCT ERDLS."extractedResourceId") as count
        FROM "ExtractedResourcesInDLSessions" ERDLS
        LEFT JOIN "UserApproval" UA ON 
          ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" 
          AND ERDLS."dLSessionId" = UA."sessionId"
          AND UA."isNextApprover" = true
        WHERE 
          ERDLS."dLSessionId" = ${input.filter.dLSessionId}
          AND ERDLS.status IN ('IN_REVIEW', 'REJECTED')
        GROUP BY 
          ERDLS.status,
          CASE 
            WHEN UA."approvalLevel" IS NOT NULL THEN 
              ERDLS.status || ' L' || UA."approvalLevel"::text
            ELSE 
              ERDLS.status::text
          END
        
        UNION ALL
        
        SELECT 
          status,
          status::text as status_with_level,
          COUNT(*)
        FROM "ExtractedResourcesInDLSessions"
        WHERE 
          "dLSessionId" = ${input.filter.dLSessionId}
          AND status NOT IN ('IN_REVIEW', 'REJECTED')
        GROUP BY status
      ),
      filtered_status AS (
        SELECT 
          status_with_level as name,
          count::integer as "extractedResourceCount"
        FROM status_with_approval
        WHERE
          1=1
          ${(() => {
            if (input.filter.name && input.filter.name.length > 0) {
              const escapedNames = input.filter.name.map((n: string) => n.replace(/'/g, "''"))
              const nameArray = escapedNames.map((n: string) => `'${n}'`).join(', ')
              return Prisma.sql`AND status_with_level = ANY(ARRAY[${Prisma.raw(nameArray)}])`
            }
            return Prisma.empty
          })()}
          ${(() => {
            if (input.filter.extractedresourcecount && input.filter.extractedresourcecount.length > 0) {
              const countArray = input.filter.extractedresourcecount.map((c: string) => `'${c}'`).join(', ')
              return Prisma.sql`AND count::text = ANY(ARRAY[${Prisma.raw(countArray)}])`
            }
            return Prisma.empty
          })()}
      )
      SELECT 
        name,
        "extractedResourceCount"
      FROM filtered_status
      ORDER BY ${Prisma.raw(dbSortField)} ${Prisma.raw(sortDirection)}
      LIMIT ${input.limit} OFFSET ${input.offset}
    `;
  
    // Count total distinct status combinations
    const countQuery = Prisma.sql`
      WITH status_with_approval AS (
        SELECT 
          CASE 
            WHEN UA."approvalLevel" IS NOT NULL THEN 
              ERDLS.status || ' L' || UA."approvalLevel"::text
            ELSE 
              ERDLS.status::text
          END as status_with_level,
          COUNT(DISTINCT ERDLS."extractedResourceId") as count
        FROM "ExtractedResourcesInDLSessions" ERDLS
        LEFT JOIN "UserApproval" UA ON 
          ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" 
          AND ERDLS."dLSessionId" = UA."sessionId"
          AND UA."isNextApprover" = true
        WHERE 
          ERDLS."dLSessionId" = ${input.filter.dLSessionId}
        GROUP BY 
          CASE 
            WHEN UA."approvalLevel" IS NOT NULL THEN 
              ERDLS.status || ' L' || UA."approvalLevel"::text
            ELSE 
              ERDLS.status::text
          END
        
        UNION ALL
        
        SELECT 
          status::text as status_with_level,
          COUNT(DISTINCT "extractedResourceId") as count
        FROM "ExtractedResourcesInDLSessions"
        WHERE 
          "dLSessionId" = ${input.filter.dLSessionId}
          AND status NOT IN ('IN_REVIEW', 'REJECTED')
        GROUP BY status
      )
      SELECT COUNT(DISTINCT status_with_level)
      FROM status_with_approval
      WHERE
        1=1
        ${(() => {
          if (input.filter.name && input.filter.name.length > 0) {
            const escapedNames = input.filter.name.map((n: string) => n.replace(/'/g, "''"))
            const nameArray = escapedNames.map((n: string) => `'${n}'`).join(', ')
            return Prisma.sql`AND status_with_level = ANY(ARRAY[${Prisma.raw(nameArray)}])`
          }
          return Prisma.empty
        })()}
        ${(() => {
          if (input.filter.extractedresourcecount && input.filter.extractedresourcecount.length > 0) {
            const countArray = input.filter.extractedresourcecount.map((c: string) => `'${c}'`).join(', ')
            return Prisma.sql`AND count::text = ANY(ARRAY[${Prisma.raw(countArray)}])`
          }
          return Prisma.empty
        })()}
    `;
  
    const filterOptionsQuery = Prisma.sql`
      SELECT
        CASE 
          WHEN UA."approvalLevel" IS NOT NULL AND ERDLS.status IN ('IN_REVIEW', 'REJECTED') THEN 
            ERDLS.status || ' L' || UA."approvalLevel"::text
          ELSE 
            ERDLS.status::text
        END as name,
        COUNT(DISTINCT ERDLS."extractedResourceId")::text AS "extractedResourceCount"
      FROM "ExtractedResourcesInDLSessions" ERDLS
      LEFT JOIN "UserApproval" UA ON 
        ERDLS."extractedResourceId" = UA."approvalModuleUniqueId" 
        AND ERDLS."dLSessionId" = UA."sessionId"
        AND UA."isNextApprover" = true
        AND ERDLS.status IN ('IN_REVIEW', 'REJECTED')
      WHERE 
        ERDLS."dLSessionId" = ${input.filter.dLSessionId}
      GROUP BY
        CASE 
          WHEN UA."approvalLevel" IS NOT NULL AND ERDLS.status IN ('IN_REVIEW', 'REJECTED') THEN 
            ERDLS.status || ' L' || UA."approvalLevel"::text
          ELSE 
            ERDLS.status::text
        END
      ORDER BY name ASC
    `;
  
    const [statusData, countData, filterOptionsData] = await Promise.all([
      db.$queryRaw<any[]>(statusQuery),
      db.$queryRaw<number>(countQuery),
      db.$queryRaw<any[]>(filterOptionsQuery).catch(() => []) // Graceful fallback if filter options query fails
    ]);

    const distinctNames: string[] = [];
    const distinctCounts: string[] = [];
    const nameSet = new Set<string>();
    const countSet = new Set<string>();

    if (Array.isArray(filterOptionsData) && filterOptionsData.length > 0) {
      for (const row of filterOptionsData) {
        if (row?.name && typeof row.name === 'string' && row.name.trim()) {
          const name = row.name.trim();
          if (!nameSet.has(name)) {
            nameSet.add(name);
            distinctNames.push(name);
          }
        }
        if (row?.extractedResourceCount != null) {
          const count = String(row.extractedResourceCount).trim();
          if (count && !countSet.has(count)) {
            countSet.add(count);
            distinctCounts.push(count);
          }
        }
      }
    }

    distinctNames.sort();
    distinctCounts.sort((a, b) => {
      const numA = parseInt(a, 10) || 0;
      const numB = parseInt(b, 10) || 0;
      return numA - numB;
    });
  
    return [statusData || [], countData || 0, { name: distinctNames, extractedresourcecount: distinctCounts }];
    
  }

  
  static normalizeVersionMetadata(metaData: any): any {
    if (!metaData) return metaData;
    
    if (Array.isArray(metaData)) {
      return metaData.map((item: any) => {
        // Normalize child annotation: annotationId, parentAnnotationName, taxonomyData
        const normalizeChild = (child: any) => ({
          annotationId: child?.annotationId || "",
          parentAnnotationName: child?.parentAnnotationName || "",
          taxonomyData: child?.taxonomyData || {}
        });

        // Normalize taxonomy: annotationId, taxonomyGroupName, taxonomyData, childAnnotation
        const normalizeTax = (tax: any) => ({
          annotationId: tax?.annotationId || "",
          taxonomyGroupName: tax?.taxonomyGroupName || "",
          taxonomyData: tax?.taxonomyData || {},
          childAnnotation: Array.isArray(tax?.childAnnotation) ? tax.childAnnotation.map(normalizeChild) : []
        });

        // Normalize label: id, name, abbreviation, annotators
        const normalizeLabel = (label: any) => ({
          id: label?.id || "",
          name: label?.name || "",
          abbreviation: label?.abbreviation || "",
          annotators: Array.isArray(label?.annotators) 
            ? label.annotators.map((annotator: any) => ({
                email: annotator?.email || ""
              }))
            : []
        });

        // Normalize root item: id, sessionName, versionName, purpose, dLSessionId, status, assignees, reviewers, metadata, rawResourceId, labels, taxonomy
        return {
          id: item?.id || "",
          sessionName: item?.sessionName || "",
          versionName: item?.versionName || "",
          purpose: item?.purpose || "",
          dLSessionId: item?.dLSessionId || "",
          status: item?.status || "PENDING",
          assignees: Array.isArray(item?.assignees) ? item.assignees : [],
          reviewers: Array.isArray(item?.reviewers) ? item.reviewers : [],
          metadata: item?.metadata || {
            type: "image/png",
            width: 0,
            height: 0,
            pixelResolution: 0
          },
          rawResourceId: item?.rawResourceId || "",
          labels: Array.isArray(item?.labels) ? item.labels.map(normalizeLabel) : [],
          taxonomy: Array.isArray(item?.taxonomy) ? item.taxonomy.map(normalizeTax) : []
        };
      });
    }
    
    return metaData;
  }

  static async createVersion(input: CreateVersionInput, userId: string | undefined) {
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    const { dLSessionId, purpose, majorVersion, minorVersion, versionMetaData } = input;
    
    // Validate version format: prevent trailing zeros (e.g., 1.000000000)
    // Check if minor version has leading zeros or multiple zeros
    if (minorVersion !== String(parseInt(minorVersion, 10))) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Invalid minor version format: ${minorVersion}. Version must not have leading zeros or trailing zeros. Use single digit format (0-9).` 
      });
    }

    // Validate major version format: prevent trailing zeros
    if (majorVersion !== String(parseInt(majorVersion, 10))) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Invalid major version format: ${majorVersion}. Version must not have leading zeros.` 
      });
    }

    // Validate minor version format and range (0-9 only)
    const minorVersionNum = parseInt(minorVersion, 10);
    if (isNaN(minorVersionNum)) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Invalid minor version format: ${minorVersion}. Must be a number.` 
      });
    }

    // Validate major version format
    const majorVersionNum = parseInt(majorVersion, 10);
    if (isNaN(majorVersionNum)) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Invalid major version format: ${majorVersion}. Must be a number.` 
      });
    }

    // Prevent version 0.0 - only allow versions starting from 1.0
    if (majorVersionNum === 0 && minorVersionNum === 0) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Version 0.0 is not allowed. Versions must start from 1.0.` 
      });
    }

    // Prevent major version less than 1
    if (majorVersionNum < 1) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Major version must be at least 1. Version ${majorVersion}.${minorVersion} is invalid. Please start from 1.0.` 
      });
    }

    // Minor version must be between 0-9 (single digit)
    if (minorVersionNum < 0 || minorVersionNum > 9) {
      const nextMajorVersion = String(parseInt(majorVersion, 10) + 1);
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: `Minor version must be between 0-9. Version ${majorVersion}.${minorVersion} is invalid. Please start from ${nextMajorVersion}.0 instead.` 
      });
    }
    
    // Check if the version being created already exists
    const existingVersion = await this.checkVersionExists(dLSessionId, majorVersion, minorVersion, userId);
    
    if (existingVersion.exists) {
      throw new TRPCError({ 
        code: 'CONFLICT', 
        message: `Version ${majorVersion}.${minorVersion} already exists for this session` 
      });
    }

    // Pre-check: Validate that previous minor version exists (if minorVersion > 0)
    if (minorVersionNum > 0) {
      const previousMinorVersion = String(minorVersionNum - 1);
      const previousVersionCheck = await this.checkVersionExists(dLSessionId, majorVersion, previousMinorVersion, userId);
      
      if (!previousVersionCheck.exists) {
        throw new TRPCError({ 
          code: 'PRECONDITION_FAILED', 
          message: `Cannot create version ${majorVersion}.${minorVersion}. Previous version ${majorVersion}.${previousMinorVersion} does not exist. Please create ${majorVersion}.${previousMinorVersion} first.` 
        });
      }
    }

    // When creating a new major version (e.g., 2.0), check if previous major version's last minor (1.9) exists
    if (!isNaN(majorVersionNum) && majorVersionNum > 1 && minorVersionNum === 0) {
      const previousMajorVersion = String(majorVersionNum - 1);
      const lastMinorOfPreviousMajor = '9';
      const previousMajorLastMinorCheck = await this.checkVersionExists(dLSessionId, previousMajorVersion, lastMinorOfPreviousMajor, userId);
      
      if (!previousMajorLastMinorCheck.exists) {
        throw new TRPCError({ 
          code: 'PRECONDITION_FAILED', 
          message: `Cannot create version ${majorVersion}.${minorVersion}. Previous major version ${previousMajorVersion}.${lastMinorOfPreviousMajor} does not exist. Please create ${previousMajorVersion}.${lastMinorOfPreviousMajor} first.` 
        });
      }
    }

    let parsedMetaData: any = null;
    if (versionMetaData !== null && versionMetaData !== undefined) {
      if (typeof versionMetaData === 'string') {
        try {
          parsedMetaData = JSON.parse(versionMetaData);
        } catch (error) {
          parsedMetaData = versionMetaData;
        }
      } else {
        parsedMetaData = versionMetaData;
      }
    }

    parsedMetaData = this.normalizeVersionMetadata(parsedMetaData);
    
    // Get session name for S3 key generation
    const session = await db.dLSession.findUnique({
      where: { id: dLSessionId },
      select: { name: true }
    });

    if (!session) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' });
    }

    // Generate S3 key: {sessionId}/{sessionName}_version_{majorVersion}.{minorVersion}_created_{date}.json
    const createdAt = new Date();
    const day = String(createdAt.getDate()).padStart(2, '0');
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const year = String(createdAt.getFullYear());
    const dateStr = `${day}_${month}_${year}`;
    const versionFileName = `${session.name}_version_${majorVersion}.${minorVersion}_created_${dateStr}.json`;
    const s3Key = `${dLSessionId}/${versionFileName}`;

    // Upload version JSON to S3
    await this.s3Repository().uploadVersionJson(s3Key, parsedMetaData);
    
    const version = await db.dLSessionJsonVersions.create({
      data: {
        dLSessionId,
        purpose,
        majorVersion,
        minorVersion,
        s3Key: s3Key,
        createdBy: userId
      }
    });
    return {
      success: true,
      version: version
    };
  }

  static async checkVersionExists(dLSessionId: string, majorVersion: string, minorVersion: string, userId: string | undefined) {
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    
    const existingVersion = await db.dLSessionJsonVersions.findFirst({
      where: {
        dLSessionId,
        majorVersion,
        minorVersion
      },
      select: {
        id: true,
        majorVersion: true,
        minorVersion: true
      }
    });

    return {
      exists: existingVersion !== null,
      version: existingVersion ? `${existingVersion.majorVersion}.${existingVersion.minorVersion}` : null
    };
  }

  static async listVersions(input: ListVersionsInput, userId: string | undefined) {

    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const { dLSessionId } = input;
    const versions = await db.dLSessionJsonVersions.findMany({
      select: {
        id: true,
        purpose: true,
        majorVersion: true,
        minorVersion: true,
        createdAt: true,
        createdBy: true,
      },
      where: {
        dLSessionId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const uniqueUserIds = [...new Set(versions.map(v => v.createdBy).filter(Boolean))];
    
    let userDetails: any[] = [];
    if (uniqueUserIds.length > 0) {
      userDetails = await Auth0Service.findMany({
        searchQuery: {
          userIds: uniqueUserIds
        }
      });
    }

    return {
      success: true,
      versions: versions.map(version => {
        const userInfo = userDetails.find((user: any) => user.user_id === version.createdBy);
        const userName = userInfo?.nickname|| userInfo?.name || userInfo?.email || version.createdBy;
        
        return {
          ...version,
          createdBy: userName
        };
      })
    };  
  }

  static async getVersionMetadata(versionId: string, userId: string | undefined) {
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const version = await db.dLSessionJsonVersions.findUnique({
      where: { id: versionId },
      select: {
        id: true,
        s3Key: true,
        majorVersion: true,
        minorVersion: true,
        purpose: true,
        dLSessionId: true,
        createdAt: true,
        dLSession: {
          select: {
            name: true
          }
        }
      }
    });

    if (!version) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Version not found' });
    }

    if (!version.s3Key) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Version S3 key not found. Version data is missing.' });
    }

    // Download version data from S3
    let normalizedMetaData: any;
    try {
      const s3Data = await this.s3Repository().downloadVersionJson(version.s3Key);
      normalizedMetaData = this.normalizeVersionMetadata(s3Data);
    } catch (error: any) {
      throw new TRPCError({ 
        code: 'INTERNAL_SERVER_ERROR', 
        message: `Failed to download version from S3: ${error.message}` 
      });
    }

    // Extract filename from s3Key (s3Key format: {sessionId}/{filename}.json)
    // The s3Key already contains the correct filename with date, so we extract it directly
    const fileName = version.s3Key.split('/').pop() || `${version.dLSession.name}_version_${version.majorVersion}.${version.minorVersion}.json`;

    return {
      success: true,
      versionMetaData: normalizedMetaData,
      fileName: fileName
    };
  }

  /**
   * Push JSON to S3 bucket
   * @param dLSessionId - Session ID
   * @param key - S3 key (folder path + filename)
   * @param jsonData - JSON data to upload
   */
  static async pushJsonToS3(dLSessionId: string, key: string, jsonData: any) {
    try {
      await this.s3Repository().uploadJsonToCustomBucket(key, jsonData)
      return { success: true }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to push JSON to S3'
      })
    }
  }

  /**
   * Check if S3 folder exists
   * @param folderPath - Folder path to check (e.g., 'folder/subfolder')
   * @returns Object with exists boolean
   */
  static async checkS3FolderExists(folderPath: string) {
    try {
      const exists = await this.s3Repository().checkFolderExists(folderPath)
      return { exists }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to check S3 folder existence'
      })
    }
  }

  /**
   * Download JSON from S3 key (uses env bucket)
   * @param s3Key - S3 key (e.g., SampleLinkJSON/new_link_json_format+1.json)
   */
  static async downloadJsonFromS3(s3Key: string) {
    try {
      const jsonData = await this.s3Repository().downloadJsonFromCustomBucketKey(s3Key)
      return jsonData
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to download JSON from S3'
      })
    }
  }

  /**
   * Lock a session and create lock history record
   *
   * STEP-BY-STEP FLOW:
   * 1. Validates reason length (10-100 characters) and emoji check
   * 2. Starts database transaction for atomicity
   * 3. Checks for existing active lock history record
   * 4. Archives old unlocked record if exists (soft delete)
   * 5. Creates new lock history record with isLocked=true
   * 6. Returns success message and lockReason only
   */
  static async lockSession(dLSessionId: string, reason: string, userId: string) {
    // Step 1: Validate reason length (10-100 characters)
    if (reason.length < 10 || reason.length > 100) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: 'Reason must be between 10 and 100 characters' 
      })
    }

    // Step 2: Validate reason doesn't contain emojis
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(reason)) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: 'Reason cannot contain emojis' 
      })
    }

    // Step 3: Database transaction for atomicity
    return await db.$transaction(async (tx) => {
      // Step 4: Check if a lock/unlock record for the session already exists
      const existingLockHistory = await tx.dLSessionLockHistory.findFirst({
        where: {
          dLSessionId: dLSessionId,
          deletedAt: null, // Only check active records
        },
        orderBy: {
          lockedAt: 'desc', // Most recent first
        },
      })

      // Step 5: Archive old record if it exists and is unlocked
      // Condition: Record exists, is unlocked, and has both lock/unlock reasons (complete cycle)
      if (existingLockHistory && 
          existingLockHistory.isLocked === false && 
          existingLockHistory.lockReason !== null && 
          existingLockHistory.unlockReason !== null) {
        // Soft delete the old record (set deletedAt for audit trail)
        await tx.dLSessionLockHistory.update({
          where: {
            id: existingLockHistory.id,
          },
          data: {
            deletedAt: new Date(), // Archive timestamp
          },
        })
      }

      // Step 6: Create new lock history record
      await tx.dLSessionLockHistory.create({
        data: {
          dLSessionId: dLSessionId,
          isLocked: true,              // Session is now locked
          lockReason: reason,          // User's reason for locking
          lockedAt: new Date(),        // Lock timestamp
          lockedBy: userId,            // User who locked it
          deletedAt: null,             // Active record (not archived)
        },
      })

      // Step 7: Return simple success response with lockReason only
      return {
        success: true,
        message: 'Session locked successfully',
        lockReason: reason
      }
    })
  }

  /**
   * Unlock a session, update lock history, and change session status to "Re-open"
   * 
   * STEP-BY-STEP FLOW:
   * 1. Validates reason length (10-100 characters) and emoji check
   * 2. Starts database transaction for atomicity
   * 3. Finds most recent active locked record (isLocked=true, deletedAt=null)
   * 4. Updates existing record OR creates new one if none exists
   * 5. Sets isLocked=false, adds unlockReason, unlockedAt, unlockedBy
   * 6. Finds or creates "Re-open" session status
   * 7. Deactivates all existing session statuses
   * 8. Activates "Re-open" status for the session
   * 9. Returns success message and unlockReason only
   */
  static async unlockSession(dLSessionId: string, reason: string, userId: string) {
    // Step 1: Validate reason length (10-100 characters)
    if (reason.length < 10 || reason.length > 100) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: 'Reason must be between 10 and 100 characters' 
      })
    }

    // Step 2: Validate reason doesn't contain emojis
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(reason)) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: 'Reason cannot contain emojis' 
      })
    }

    // Step 3: Database transaction for atomicity
    return await db.$transaction(async (tx) => {
      // Step 4: Find most recent active locked record
      const latestLockHistory = await tx.dLSessionLockHistory.findFirst({
        where: {
          dLSessionId: dLSessionId,
          isLocked: true,        // Must be currently locked
          deletedAt: null,       // Only active records
        },
        orderBy: {
          lockedAt: 'desc',      // Most recent first
        },
      })

      // Step 5: Update existing record or create new one
      if (latestLockHistory) {
        // Update existing lock history record to mark as unlocked
        await tx.dLSessionLockHistory.update({
          where: {
            id: latestLockHistory.id,
          },
          data: {
            isLocked: false,         // Session is now unlocked
            unlockReason: reason,     // User's reason for unlocking
            unlockedAt: new Date(),  // Unlock timestamp
            unlockedBy: userId,       // User who unlocked it
          },
        })
      } else {
        // Edge case: No lock history exists, create new record
        await tx.dLSessionLockHistory.create({
          data: {
            dLSessionId: dLSessionId,
            isLocked: false,         // Session is unlocked
            unlockReason: reason,     // User's reason
            unlockedAt: new Date(),   // Unlock timestamp
            unlockedBy: userId,       // User who unlocked it
            deletedAt: null,         // Active record
          },
        })
      }

      // Step 6: Find or create "Re-open" session status
      let reOpenStatus = await tx.sessionStatus.findFirst({
        where: {
          name: {
            equals: 'Re-open',
            mode: 'insensitive', // Case-insensitive match
          },
        },
      })

      // Create "Re-open" status if it doesn't exist
      if (!reOpenStatus) {
        reOpenStatus = await tx.sessionStatus.create({
          data: {
            name: 'Re-open',
            description: 'Session has been reopened after being locked',
            colorCode: '#FFA500', // Orange color
          },
        })
      }

      // Step 7: Deactivate all existing statuses for this session
      await tx.sessionStatusInDLSessions.updateMany({
        where: {
          dLSessionId: dLSessionId,
        },
        data: {
          isActive: false, // Deactivate all
        },
      })

      // Step 8: Activate "Re-open" status for this session
      const existingStatus = await tx.sessionStatusInDLSessions.findFirst({
        where: {
          dLSessionId: dLSessionId,
          sessionStatusId: reOpenStatus.id,
        },
      })

      if (existingStatus) {
        // Update existing status to active
        await tx.sessionStatusInDLSessions.update({
          where: {
            id: existingStatus.id,
          },
          data: {
            isActive: true,
            updatedAt: new Date(),
          },
        })
      } else {
        // Create new session status entry
        await tx.sessionStatusInDLSessions.create({
          data: {
            dLSessionId: dLSessionId,
            sessionStatusId: reOpenStatus.id,
            isActive: true,
          },
        })
      }

      // Step 9: Return simple success response with unlockReason only
      return {
        success: true,
        message: 'Session unlocked successfully',
        unlockReason: reason
      }
    })
  }

  /**
   * Automatically lock inactive completed sessions
   * 
   * STEP-BY-STEP FLOW:
   * 1. Calculates 30 days ago threshold date
   * 2. Finds "completed" session status from database
   * 3. Finds all active sessions with "completed" status that are not already locked
   * 4. For each session, determines last activity date:
   *    - Primary: Most recent endTime from TimeSpentInDLSessions (tracks actual user activity)
   *    - Secondary: Most recent updatedAt from related tables if no time spent records:
   *      * TaxonomiesAnnotationsInDLSessions
   *      * TaxonomyDataInDLSessions
   *      * ChildTaxonomyDataInDLSessions
   *      * LabelsInExtractedResourcesInDLSessions
   *    - Fallback: Session's own updatedAt if no activity found
   * 5. If last activity is more than 30 days ago, locks the session:
   *    - Archives old unlocked lock history record if exists (soft delete)
   *    - Creates new lock history record with isLocked=true
   *    - Sets lockReason: "Due to inactivity for 30 days it's locked"
   *    - Note: Does NOT update session status (same behavior as manual lock)
   * 6. Returns summary with count and details of locked sessions
   */
  static async autoLockInactiveSessions(systemUserId: string = 'system') {
    // Step 1: Calculate 30 days ago threshold date
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const lockReason = 'Due to inactivity for 30 days it\'s locked'
    const lockedSessions: Array<{ id: string; name: string; lastActivity: Date | null }> = []
    
    try {
      // Step 2: Find "completed" session status
      const completedStatus = await db.sessionStatus.findFirst({
        where: { name: { equals: 'completed', mode: 'insensitive' } },
      })
      if (!completedStatus) {
        return { success: true, message: 'No "completed" status found. No sessions to check.', lockedCount: 0, sessions: [] }
      }
      
      // Step 3: Find all active sessions with "completed" status that are not already locked
      const completedSessions = await db.dLSession.findMany({
        where: {
          deletedAt: null, // Only active sessions
          sessionStatusInDLSessions: { some: { sessionStatusId: completedStatus.id, isActive: true } },
          dLSessionLockHistory: { none: { isLocked: true, deletedAt: null } }, // Exclude already locked
        },
        select: { id: true, name: true, updatedAt: true },
      })
      
      // Step 4: Process each session to determine last activity date
      for (const session of completedSessions) {
        // Step 4a: Query all activity sources in parallel for performance
        const [timeSpent, taxAnnotation, taxData, childTaxData, label] = await Promise.all([
          // Primary: TimeSpentInDLSessions (most reliable - tracks actual user activity)
          db.timeSpentInDLSessions.findFirst({ 
            where: { dLSessionId: session.id }, 
            orderBy: { endTime: 'desc' } 
          }),
          // Secondary: Related tables updatedAt (fallback if no time spent records)
          db.taxonomiesAnnotationsInDLSessions.findFirst({ 
            where: { dLSessionId: session.id, deletedAt: null }, 
            orderBy: { updatedAt: 'desc' } 
          }),
          db.taxonomyDataInDLSessions.findFirst({ 
            where: { dLSessionId: session.id, deletedAt: null }, 
            orderBy: { updatedAt: 'desc' } 
          }),
          db.childTaxonomyDataInDLSessions.findFirst({ 
            where: { dLSessionId: session.id, deletedAt: null }, 
            orderBy: { updatedAt: 'desc' } 
          }),
          db.labelsInExtractedResourcesInDLSessions.findFirst({ 
            where: { dLSessionId: session.id, deletedAt: null }, 
            orderBy: { updatedAt: 'desc' } 
          }),
        ])
        
        // Step 4b: Determine last activity date (primary > secondary > fallback)
        const lastActivityDate = timeSpent?.endTime || 
          [taxAnnotation?.updatedAt, taxData?.updatedAt, childTaxData?.updatedAt, label?.updatedAt, session.updatedAt]
            .filter(Boolean)
            .reduce((max, d) => (!max || d! > max ? d! : max), null as Date | null)
        
        // Step 5: Lock session if inactive for 30+ days
        if (lastActivityDate && lastActivityDate < thirtyDaysAgo) {
          await db.$transaction(async (tx) => {
            // Step 5a: Archive old unlocked lock history record if exists (soft delete)
            const oldRecord = await tx.dLSessionLockHistory.findFirst({
              where: { 
                dLSessionId: session.id, 
                deletedAt: null, 
                isLocked: false, 
                lockReason: { not: null }, 
                unlockReason: { not: null } 
              },
            })
            if (oldRecord) {
              await tx.dLSessionLockHistory.update({ 
                where: { id: oldRecord.id }, 
                data: { deletedAt: new Date() } 
              })
            }
            
            // Step 5b: Create new lock history record with isLocked=true
            await tx.dLSessionLockHistory.create({
              data: { 
                dLSessionId: session.id, 
                isLocked: true, 
                lockReason, 
                lockedAt: new Date(), 
                lockedBy: systemUserId, 
                deletedAt: null 
              },
            })
          })
          
          // Track locked session for return value
          lockedSessions.push({ id: session.id, name: session.name, lastActivity: lastActivityDate })
        }
      }
      
      // Step 6: Return summary with count and details of locked sessions
      return { 
        success: true, 
        message: `Successfully locked ${lockedSessions.length} inactive session(s)`, 
        lockedCount: lockedSessions.length, 
        sessions: lockedSessions 
      }
    } catch (error: any) {
      throw new TRPCError({ 
        code: 'INTERNAL_SERVER_ERROR', 
        message: `Failed to auto-lock inactive sessions: ${error.message}` 
      })
    }
  }


  static async getSessionLockStatus(dLSessionId: string) {
    // Get the most recent active lock history record (deletedAt is null)
    const latestLockHistory = await db.dLSessionLockHistory.findFirst({
      where: {
        dLSessionId: dLSessionId,
        deletedAt: null, // Only get active records
      },
      orderBy: {
        lockedAt: 'desc',
      },
    })

    if (!latestLockHistory) {
      return {
        isLocked: false,
        reason: null,
        lockedAt: null,
        unlockedAt: null,
      }
    }

    // Get lock reason: check if deletedAt is null, then return lockReason, else return null
    const lockReason = latestLockHistory.deletedAt === null 
      ? latestLockHistory.lockReason 
      : null

    // Get unlock reason: check if deletedAt is null, then return unlockReason, else return null
    const unlockReason = latestLockHistory.deletedAt === null 
      ? latestLockHistory.unlockReason 
      : null

    return {
      isLocked: latestLockHistory.isLocked,
      reason: latestLockHistory.isLocked ? lockReason : unlockReason,
      lockedAt: latestLockHistory.lockedAt,
      unlockedAt: latestLockHistory.unlockedAt,
    }
  }

  static async checkSessionLocked(dLSessionId: string): Promise<void> {
    const lockStatus = await this.getSessionLockStatus(dLSessionId)
    if (lockStatus.isLocked) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Session is locked'
      })
    }
  }

  /**
   * Save annotation order for a taxonomy in a session
   * @param input - Contains dLSessionId, taxonomyId, and ordered annotationIds
   * @param userId - User ID saving the order
   */
  static async saveAnnotationOrder(input: SaveAnnotationOrderInput, userId: string) {
    const { dLSessionId, taxonomyId, annotationIds } = input

    // First, get all existing TaxonomiesAnnotationsInDLSessions for this taxonomy and session
    const existingAnnotations = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        dLSessionId,
        taxonomyId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })

    const existingAnnotationIds = new Set(existingAnnotations.map(a => a.id))

    // Validate that all provided annotationIds exist
    const invalidIds = annotationIds.filter(id => !existingAnnotationIds.has(id))
    if (invalidIds.length > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid annotation IDs: ${invalidIds.join(', ')}`,
      })
    }

    // Use transaction to ensure atomicity
    return await db.$transaction(async (tx) => {
      // Delete existing order entries for this user, taxonomy and session
      // This ensures each user has their own custom order
      await tx.userSessionAnnotationOrder.deleteMany({
        where: {
          dLSessionId,
          userId, // Filter by userId to ensure user-specific order
          annotation: {
            taxonomyId,
            dLSessionId,
            deletedAt: null,
          },
        },
      })

      // Create new order entries with sequential order numbers (1, 2, 3, ...)
      // Each entry is saved with userId, so each user has their own order
      // Also save taxonomyId, taxonomyOrder, and groupId for each annotation
      const orderEntries = annotationIds.map((annotationId, index) => ({
        userId, // Save with userId - each user has their own order
        dLSessionId,
        annotationId,
        order: index + 1, // Order starts from 1, not 0 (1, 2, 3, ...)
        taxonomyId, // Save taxonomyId for each annotation
        taxonomyOrder: index + 1, // Save taxonomyOrder (order within this taxonomy)
        groupId: null, // groupId not available in this function (single taxonomy context)
      }))

      if (orderEntries.length > 0) {
        await tx.userSessionAnnotationOrder.createMany({
          data: orderEntries,
          skipDuplicates: true,
        })
      }

      return {
        success: true,
        message: 'Annotation order saved successfully',
      }
    })
  }


  static async saveAllAnnotationOrders(input: SaveAllAnnotationOrdersInput, userId: string) {
    const { dLSessionId, orders } = input

    // Validate that all annotationIds exist in the session
    const annotationIds = orders.map(o => o.annotationId)
    const existingAnnotations = await db.taxonomiesAnnotationsInDLSessions.findMany({
      where: {
        dLSessionId,
        id: { in: annotationIds },
        deletedAt: null,
      },
      select: {
        id: true,
        taxonomyId: true,
      },
    })

    const existingAnnotationIds = new Set(existingAnnotations.map(a => a.id))
    const invalidIds = annotationIds.filter(id => !existingAnnotationIds.has(id))
    
    if (invalidIds.length > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid annotation IDs: ${invalidIds.join(', ')}`,
      })
    }

    // Create a map of annotationId to taxonomyId for fallback (if not provided in payload)
    const annotationToTaxonomyMap = new Map<string, string>()
    existingAnnotations.forEach(ann => {
      annotationToTaxonomyMap.set(ann.id, ann.taxonomyId)
    })

    // Use transaction to ensure atomicity
    return await db.$transaction(async (tx) => {
      // Delete all existing order entries for this user and session
      await tx.userSessionAnnotationOrder.deleteMany({
        where: {
          dLSessionId,
          userId, // Filter by userId to ensure user-specific order
        },
      })

      // Create new order entries with the provided order numbers (1, 2, 3, ...)
      // Use taxonomyId, taxonomyOrder, and groupId from payload if provided, otherwise fallback to calculated values
      // Note: groupId is saved in the taxonomyOrder column
      const orderEntries = orders.map(({ annotationId, order, taxonomyId, taxonomyOrder, groupId }) => {
        // Use taxonomyId from payload if provided, otherwise fetch from database
        const finalTaxonomyId = taxonomyId || annotationToTaxonomyMap.get(annotationId) || null
        
        // If groupId is provided, use it as taxonomyOrder (saving groupId in taxonomyOrder column)
        // Otherwise, if taxonomyOrder is provided, use it
        // If neither is provided, calculate taxonomyOrder based on order within taxonomy
        let finalTaxonomyOrder: number | null = null
        
        if (groupId !== undefined && groupId !== null) {
          // Save groupId in taxonomyOrder column
          finalTaxonomyOrder = groupId
        } else if (taxonomyOrder !== undefined && taxonomyOrder !== null) {
          // Use provided taxonomyOrder
          finalTaxonomyOrder = taxonomyOrder
        } else if (finalTaxonomyId) {
          // Calculate taxonomyOrder if not provided
          const taxonomyOrders = orders
            .filter(o => {
              const oTaxonomyId = o.taxonomyId || annotationToTaxonomyMap.get(o.annotationId)
              return oTaxonomyId === finalTaxonomyId
            })
            .sort((a, b) => a.order - b.order)
          
          const taxonomyIndex = taxonomyOrders.findIndex(o => o.annotationId === annotationId)
          finalTaxonomyOrder = taxonomyIndex >= 0 ? taxonomyIndex + 1 : null
        }
        
        return {
          userId, // Save with userId - each user has their own order
          dLSessionId,
          annotationId,
          order, // Use the provided order number (1, 2, 3, ...)
          taxonomyId: finalTaxonomyId, // Use taxonomyId from payload or fallback to database value
          taxonomyOrder: finalTaxonomyOrder, // Save groupId here if provided, otherwise use taxonomyOrder or calculated value
        }
      })

      if (orderEntries.length > 0) {
        await tx.userSessionAnnotationOrder.createMany({
          data: orderEntries,
          skipDuplicates: true,
        })
      }

      return {
        success: true,
        message: 'All annotation orders saved successfully',
        savedCount: orderEntries.length,
      }
    })
  }

  
  static async getAnnotationOrder(input: GetAnnotationOrderInput, userId: string) {
    const { dLSessionId, taxonomyId } = input

    // Get order entries filtered by userId - each user has their own order
    const orderEntries = await db.userSessionAnnotationOrder.findMany({
      where: {
        dLSessionId,
        userId, // Filter by userId to get this user's specific order
        annotation: {
          taxonomyId,
          dLSessionId,
          deletedAt: null,
        },
      },
      include: {
        annotation: {
          select: {
            id: true,
            taxonomyId: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    // Return ordered annotation IDs
    return orderEntries.map(entry => entry.annotationId)
  }

 
  static async getAllAnnotationOrders(input: GetAllAnnotationOrdersInput, userId: string) {
    const { dLSessionId } = input

    // Get all order entries for this user and session, ordered by order field
    const orderEntries = await db.userSessionAnnotationOrder.findMany({
      where: {
        dLSessionId,
        userId, // Filter by userId to get this user's specific order
        annotation: {
          dLSessionId,
          deletedAt: null,
        },
      },
      include: {
        annotation: {
          select: {
            id: true,
            taxonomyId: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    // Return a map of annotationId to order and taxonomyOrder (groupId) for quick lookup
    // Format: { annotationId: { order: number, taxonomyOrder: number | null } }
    const orderMap: Record<string, { order: number; taxonomyOrder: number | null }> = {}
    orderEntries.forEach(entry => {
      if (entry.annotationId) {
        orderMap[entry.annotationId] = {
          order: entry.order,
          taxonomyOrder: entry.taxonomyOrder, // This contains the groupId
        }
      }
    })

    return orderMap
  }
}
// interface TaxonomyAnnotation {
//   taxonomyId: string;
//   annotationId: string;
//   createdBy: string|null;
//   updatedBy: string|null;
//   deletedAt?: Date|null;
//   deletedBy?: string|null;
//   changeAppearance: boolean;
// }

interface AnnotationWithCounts {
  id: string;
  taxonomyId: string;
  annotationId: string;
  relatedCounts: {
    taxonomyDataCount: number;
    childTaxonomyDataCount: number;
    childTaxonomyCount: number;
    totalCount: number;
  }
}
// interface DeleteResult {
//   requiresConfirmation?: boolean;
//   annotationsToDelete?: Array<{
//     taxonomyName: string;
//     annotationName: string;
//     counts: {
//       taxonomyDataCount: number;
//       childTaxonomyDataCount: number;
//       childTaxonomyCount: number;
//       totalCount: number;
//     }
//   }>;
//   success?: boolean;
//   created?: number;
//   deleted?: number;
//  }

 interface TaxonomyAnnotation {
  taxonomyId: string;
  annotationId: string;
  changeAppearance: boolean;
}


interface CreateVersionInput {
  dLSessionId: string;
  purpose: string;
  majorVersion: string;
  minorVersion: string;
  versionMetaData?: any;
}

interface DeleteResult {
  success?: boolean;
  created?: number;
  deleted?: number;
  updated?: number;
  requiresConfirmation?: boolean;
  annotationsToDelete?: Array<{
    taxonomyName: string;
    annotationName: string;
    counts: {
      taxonomyDataCount: number;
      childTaxonomyDataCount: number;
      childTaxonomyCount: number;
      totalCount: number;
    };
  }>;
  error?: string;
}

interface DiffResult {
  toCreate: TaxonomyAnnotation[];
  toDelete: AnnotationWithCounts[];
}

interface UserGroupInput {
  userGroupId: string;
  userRole: string;
  createdBy: string;
  updatedBy: string;
}

interface TaxonomyInput {
  taxonomyId?: string;
  taxonomyName: string;
  annotations?: string[];
  changeAppearance?: string[];
}
