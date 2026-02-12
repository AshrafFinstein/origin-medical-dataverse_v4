import { ExtractedResourceStatus, SessionUserRole } from '@prisma/client'
import { z } from 'zod'
import { CloudService, DLSessionService } from '../../services'
import { protectedProcedure, router } from '../trpc'
import type { ExtractedResourceLong, ExtractedResourceLongPageCount } from '~/types'
import { TRPCError } from '@trpc/server'
import { db } from '../../infrastructures/database'

const findManyInput = z
  .object({
    sort: z.record(
      z.string().refine(s => ['createdAt', 'updatedAt', 'name', 'priority'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    filter: z.object({
      projectId: z.string().uuid(),
      priority: z.number().int().min(1).max(3).optional(),
    }),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search : z.string().default('')
  })

const findSingleSessionInput = z
  .object({
    sort: z.record(
      z.string().refine(s => ['createdAt', 'updatedAt', 'name', 'priority', 'count', 'extractedResourceCount', 'extractedresourcecount'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    filter: z.object({
      projectId: z.string().uuid(),
      priority: z.number().int().min(1).max(3).optional(),
      dLSessionId: z.string().uuid(),
      name: z.array(z.string()).optional(),
      extractedresourcecount: z.array(z.string()).optional(),
    }),
    limit: z.number().optional(),
    offset: z.number().optional(),
})

const findSingleInput = z.string().uuid()

const createSingleInput = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" })
    .refine(val => val.trimStart() === val, {
      message: "Name cannot start with a space"
    }),
  description: z.string().default(''),
  priority: z.number().int().min(1).max(3),
  sop: z.object({
    name:z.string(),
    sopLink:z.string()
  }).array(),
  projectId: z.string().uuid(),
  users: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(SessionUserRole),
  }).array(),
  labelIds: z.array(z.string().uuid()),
  sessionLabelIds: z.array(z.string().uuid()).optional(),
  sessionStatusId: z.string().uuid().optional(),
  taxonomies: z.array(
    z.object({
      taxonomyId: z.string(),
      taxonomyName:z.string(),
      annotations: z.array(z.string().uuid()),
      changeAppearance: z.array(z.string()).optional()
    })
  ).optional(),
  approval : z.array(z.array(z.any()).min(1, { message: "Each approval level must have at least one user selected" })).max(5, { message: "Maximum of 5 approval levels allowed" }),
  masterValue:z.object({
    projectCode : z.string().default(''),
    subProjectCode : z.string().default(''),
    useCaseCode : z.string().default(''),
    anatomyPlaneCode : z.string().default(''),
    centerCode : z.string().default(''),
    userTypeCode : z.string().default(''),
  }).optional()
})

const updateSingleInput = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" })
    .refine(val => val.trimStart() === val, {
      message: "Name cannot start with a space"
    })
    .optional(),
  description: z.string().optional(),
  priority: z.number().int().min(1).max(3).optional(),
  sop: z.object({
    name:z.string(),
    sopLink:z.string()
  }).array().optional(),
  projectId: z.string().uuid().optional(),
  users: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(SessionUserRole),
  }).array().optional(),
  labelIds: z.string().uuid().array().optional(),
  sessionLabelIds: z.array(z.string().uuid()).optional(),
  sessionStatusId: z.string().uuid().optional(),
  taxonomies: z.array(
    z.object({
      taxonomyId: z.string().uuid().optional(),
      taxonomyName:z.string(),
      annotations: z.array(z.string().uuid()),
      changeAppearance: z.array(z.string()).optional()
    })
  ).optional(),
  approval : z.array(z.array(z.any()).min(1, { message: "Each approval level must have at least one user selected" })).max(5, { message: "Maximum of 5 approval levels allowed" }),
  confirmTaxonomyDeletion: z.boolean().optional()
})

const deleteSingleInput = z.object({
  id :z.string().uuid(),
  deletedAt : z.string()
})

const linkExtractedResourcesInput = z.preprocess(
  (data: any) => {
    if (data && Array.isArray(data.extractedResources)) {
      data.extractedResources = data.extractedResources.map((resource: any) => {
        const { assignees, reviewers, ...rest } = resource;
        return rest;
      });
    }
    return data;
  },
  z.strictObject({
    dLSessionId: z.string().uuid(),
    skipDuplicates: z.boolean().optional().default(false),
    returnDuplicateInfo: z.boolean().optional().default(false),
    extractedResources: z.array(
      z.strictObject({
        id: z.string(),
        sessionName: z.string().optional(),
        versionName: z.string().optional(),
        purpose: z.string().optional(),
        dLSessionId: z.string().uuid().optional(),
        status: z.string().optional(),
        metadata: z.any().optional(),
        rawResourceId: z.string().optional(),
        labels: z.array(
          z.strictObject({
            id: z.string().uuid({ message: 'labels[].id must be a valid UUID' })
          })
        ).optional(),
        labelIds: z.array(z.string().uuid()).optional(),
        taxonomy: z.array(
          z.object({
            annotationId: z.string(),
            taxonomyGroupName: z.string(),
            taxonomyData: z.record(z.string(), z.any(), { 
              required_error: 'taxonomyData is required for each taxonomy annotation',
              invalid_type_error: 'taxonomyData must be an object'
            }).refine(
              (val) => val && typeof val === 'object' && Object.keys(val).length > 0,
              { message: 'taxonomyData cannot be empty' }
            ),
            childAnnotation: z.array(
              z.object({
                annotationId: z.string(),
                taxonomyData: z.record(z.string(), z.any(), {
                  required_error: 'taxonomyData is required for each childAnnotation',
                  invalid_type_error: 'taxonomyData must be an object'
                }).refine(
                  (val) => val && typeof val === 'object' && Object.keys(val).length > 0,
                  { message: 'taxonomyData cannot be empty for childAnnotation' }
                ),
              })
            , { 
              required_error: 'childAnnotation is required',
              invalid_type_error: 'childAnnotation must be an array'
            })
            .optional()
          })
        ).optional()
      })
    ),
    filename: z.string().nonempty('Filename is required'),
    fileType: z.string().optional(),
    fileBuffer: z.string().optional(), // base64 encoded buffer
  })
);

const updateManyExtractedResourcesInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  extractedResources: z.strictObject({
    id: z.string(),
    labelIds: z.string().uuid().array().optional(),
    status: z.nativeEnum(ExtractedResourceStatus).optional(),
    isFinalApproval: z.boolean().optional(),
    isReSubmit: z.boolean().optional(),
  }).array(),
  isApproved: z.boolean().optional(),
})

const listExtractedResourcesInput = z
  .strictObject({
    filter: z.strictObject({
      dLSessionId: z.string().uuid(),
      labelIds: z.string().uuid().array().optional(),
      unLabelled: z.boolean().optional(),
      unAnnotated: z.boolean().optional(),
      annotated: z.boolean().optional(),
      patientId: z.string().optional(),
      imageId: z.string().optional(),
      status: z.nativeEnum(ExtractedResourceStatus).optional(),
      isApproved: z.boolean().optional(),
      freeze: z.boolean().optional(),
    }),
    sort: z.record(
      z.literal('id').or(z.literal('createdAt')).or(z.literal('updatedAt')),
      z.literal('asc').or(z.literal('desc')),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  })

const listPatientsInput = z.strictObject({
  filter: z.strictObject({
    dLSessionId: z.string().uuid(),
    labelIds: z.string().uuid().array().optional(),
    status: z.nativeEnum(ExtractedResourceStatus).optional(),
    unLabelled: z.boolean().optional(),
    unAnnotated: z.boolean().optional(),
    annotated: z.boolean().optional(),
    isApproved: z.boolean().optional(),
    freeze: z.boolean().optional(),
  }),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

const listFilterOptionsInput = z.strictObject({
  filter: z.strictObject({
    dLSessionId: z.string().uuid(),
    freeze: z.boolean().optional(),
  }),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

const listApprovalInput = z.strictObject({
  filter: z.strictObject({
    dLSessionId: z.string().uuid(),
    labelIds: z.string().uuid().array().optional(),
    status: z.nativeEnum(ExtractedResourceStatus).optional(),
    unLabelled: z.boolean().optional(),
    isApproved: z.boolean().optional(),
  }),
  sort: z.record(
    z.literal('id').or(z.literal('createdAt')).or(z.literal('updatedAt')),
    z.literal('asc').or(z.literal('desc')),
  ).array().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

const taxonomyInput = z.strictObject({
  filter: z.strictObject({
    dLSessionId: z.string().uuid(),
    extractedResourceId: z.string()
  }),
})

const updateTaxonomyDataInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  extractedResourceId: z.string(),
  taxonomies: z.strictObject({
    taxonomyTypeId: z.string(),
    taxonomyData: z.record(z.string(), z.any()),
    isChild : z.boolean().optional(),
    taxonomiesAnnotationsInDLSessionsId:z.string()
  }).array(),
})

const updateMarkupDataInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  extractedResourceId: z.string(),
  markupData: z.string()
});

const getTaxonomyDataInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  extractedResourceId: z.string()
})

const getMarkupDataInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  extractedResourceId: z.string()
})

const saveAnnotationOrderInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  taxonomyId: z.string().uuid(),
  annotationIds: z.string().uuid().array(),
})

const saveAllAnnotationOrdersInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  orders: z.array(z.strictObject({
    annotationId: z.string().uuid(),
    order: z.number().int().min(1),
    taxonomyId: z.string().uuid().optional(),
    taxonomyOrder: z.number().int().min(1).optional(),
    groupId: z.number().int().min(1).optional(),
  })),
})

const getAnnotationOrderInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  taxonomyId: z.string().uuid(),
})

const getAllAnnotationOrdersInput = z.strictObject({
  dLSessionId: z.string().uuid(),
})

const deleteSingleTaxonomyDataInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  extractedResourceId: z.string(),
  taxonomyId: z.string().array()
})

const sendPatientForQCInput = z.strictObject({
  dLSessionId: z.string().uuid(),
  patientId: z.string(),
  patientApproval : z.strictObject({
    id: z.string(),
    status : z.string(),
    isReSubmit : z.boolean().optional()
  }).array().min(1)
})

const projectImageSearchInput = z.object({
  projectId: z.string().uuid(),
  imageId: z.string()
})

const getPageProjectImageSearchInput = z.object({
  projectId: z.string().uuid(),
  dLSessionId: z.string().uuid(),
  imageId: z.string(),
})


const createVersionInput = z.object({
  dLSessionId: z.string().uuid(),
  purpose: z.string(),
  majorVersion: z.string(),
  minorVersion: z.string(),
  versionMetaData: z.any().optional(),
})

const listVersionsInput = z.object({
  dLSessionId: z.string().uuid(),
})

const getVersionMetadataInput = z.object({
  versionId: z.string().uuid(),
})

const checkVersionExistsInput = z.object({
  dLSessionId: z.string().uuid(),
  majorVersion: z.string(),
  minorVersion: z.string(),
})

export type DLSessionFindManyInput = z.infer<typeof findManyInput>
export type DLSessionFindSingleSessionInput = z.infer<typeof findSingleSessionInput>
export type DLSessionFindSingleInput = z.infer<typeof findSingleInput>
export type DLSessionCreateSingleInput = z.infer<typeof createSingleInput>
export type DLSessionUpdateSingleInput = z.infer<typeof updateSingleInput>
export type DLSessionDeleteSingleInput = z.infer<typeof deleteSingleInput>
export type DLSessionLinkExtractedResourcesInput = z.infer<typeof linkExtractedResourcesInput>
export type DLSessionUpdateManyExtractedResourcesInput = z.infer<typeof updateManyExtractedResourcesInput>
export type DLSessionListExtractedResourcesInput = z.infer<typeof listExtractedResourcesInput>
export type DLSessionListPatientsInput = z.infer<typeof listPatientsInput>
export type DLSessionTaxonomyInput = z.infer<typeof taxonomyInput>
export type UpdateTaxonomyDataInput = z.infer<typeof updateTaxonomyDataInput>
export type GetTaxonomyDataInput = z.infer<typeof getTaxonomyDataInput>
export type GetMarkupDataInput = z.infer<typeof getMarkupDataInput>
export type DeleteSingleTaxonomyDataInput = z.infer<typeof deleteSingleTaxonomyDataInput>
export type SendPatientForQCInput = z.infer<typeof sendPatientForQCInput>
export type ProjectImageSearchInput = z.infer<typeof projectImageSearchInput>
export type GetPageProjectImageSearchInput = z.infer<typeof getPageProjectImageSearchInput>
export type DLSessionListApprovalInput = z.infer<typeof listApprovalInput>
export type UpdateMarkupDataInput = z.infer<typeof updateMarkupDataInput>
export type DLSessionListFilterOptionsInput = z.infer<typeof listFilterOptionsInput>
export type CreateVersionInput = z.infer<typeof createVersionInput>
export type ListVersionsInput = z.infer<typeof listVersionsInput>
export type GetVersionMetadataInput = z.infer<typeof getVersionMetadataInput>
export type CheckVersionExistsInput = z.infer<typeof checkVersionExistsInput>
export type SaveAnnotationOrderInput = z.infer<typeof saveAnnotationOrderInput>
export type SaveAllAnnotationOrdersInput = z.infer<typeof saveAllAnnotationOrdersInput>
export type GetAnnotationOrderInput = z.infer<typeof getAnnotationOrderInput>
export type GetAllAnnotationOrdersInput = z.infer<typeof getAllAnnotationOrdersInput>

const pushJsonToS3Input = z.object({
  dLSessionId: z.string().uuid(),
  key: z.string().min(1, 'S3 key is required'),
  jsonData: z.any(),
})

const downloadJsonFromS3Input = z.object({
  s3Key: z.string().min(1, 'S3 key is required'),
})

const checkS3FolderExistsInput = z.object({
  folderPath: z.string().min(1, 'Folder path is required'),
})

export type PushJsonToS3Input = z.infer<typeof pushJsonToS3Input>
export type DownloadJsonFromS3Input = z.infer<typeof downloadJsonFromS3Input>
export type CheckS3FolderExistsInput = z.infer<typeof checkS3FolderExistsInput>

export const dLSession = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.findMany(input, ctx.userViewAllPermission.session, userId)
        .then(([dlSessions, count]) => {
          const updatedDlSession = dlSessions.map((dlSession: any) => {
            const transformedUserGroups = dlSession?.UserGroupInDLSessions.map((group: any) => ({
              userId: group.userGroupId,
              dLSessionId: group.dLSessionId,
              userRole: group.userRole
            }));

            const updatedUsers = [...dlSession.users, ...transformedUserGroups];

            return {
              ...dlSession,
              users: updatedUsers,
              UserGroupInDLSessions: []
            };
          });
          return {
            data: updatedDlSession,
            metadata: {
              offset: input?.offset,
              limit: input?.limit,
              totalCount: count,
            },
          }
        })
    }),

  fetchSessionData: protectedProcedure
    .input(findSingleSessionInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.findSingleSession(input, ctx.userViewAllPermission.session, userId).then(([dlSessions, count, taxonomy, labels, userApproval]) => {
        const updatedDlSession = dlSessions.map((dlSession: any) => {
          const transformedUserGroups = dlSession?.UserGroupInDLSessions.map((group: any) => ({
            userId: group.userGroupId,
            dLSessionId: group.dLSessionId,
            userRole: group.userRole,
            userGroup: group.userGroup ? {
              id: group.userGroup.id,
              groupName: group.userGroup.groupName
            } : null
          }));
          const updatedUsers = [...dlSession.users, ...transformedUserGroups];
          return {
            ...dlSession,
            users: updatedUsers,
            UserGroupInDLSessions: []
          };
        });
        // Group approval by level and split group/users into separate fields
        const groupedApproval = ([] as Array<{ group: { id: string, groupName: string | null } | null, users: Array<{ id: string }>, approvalLevel: number }>);
        if (Array.isArray(userApproval)) {
          const byLevel: Record<number, { group: { id: string, groupName: string | null } | null, users: Array<{ id: string }> }> = {};
          for (const a of userApproval as any[]) {
            const level = Number(a.approvalLevel) || 0;
            if (!byLevel[level]) byLevel[level] = { group: null, users: [] };
            if (a.userGroupId) {
              byLevel[level].group = {
                id: a.userGroup?.id ?? a.userGroupId,
                groupName: a.userGroup?.groupName ?? null,
              };
            }
            if (a.toUserId) {
              byLevel[level].users.push({ id: a.toUserId });
            }
          }
          Object.keys(byLevel).sort((a,b)=>Number(a)-Number(b)).forEach(k => {
            groupedApproval.push({ approvalLevel: Number(k), ...byLevel[Number(k)] })
          })
        }

        return {
          data: updatedDlSession,
          taxonomy: taxonomy,
          labels: labels,
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
            totalCount: count,
          },
          userApproval: groupedApproval.length ? groupedApproval : userApproval,
        }
      })
    }),
  labelsAnalyseData: protectedProcedure
    .input(findSingleSessionInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.labelsAnalyseData(input, isAdmin, userId).then((result) => {
        const [data, count, filterOptions] = Array.isArray(result) && result.length >= 3 
          ? [result[0], result[1], result[2]]
          : [result[0] || [], result[1] || 0, { name: [], extractedresourcecount: [] }]
        return {
          data: [data, count],
          filterOptions: filterOptions || { name: [], extractedresourcecount: [] },
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
          },
        }
      })
  }),
  statusAnalyseData: protectedProcedure
    .input(findSingleSessionInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.statusAnalyseData(input, isAdmin, userId).then((result) => {
        const [data, count, filterOptions] = Array.isArray(result) && result.length >= 3 
          ? [result[0], result[1], result[2]]
          : [result[0] || [], result[1] || 0, { name: [], extractedresourcecount: [] }]
        return {
          data: [data, count],
          filterOptions: filterOptions || { name: [], extractedresourcecount: [] },
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
          },
        }
      })
    }),
  annotationAnalyseData: protectedProcedure
    .input(findSingleSessionInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.analyseAnnotationData(input, isAdmin, userId).then((result) => {
        const [rows, count, filterOptions] = Array.isArray(result) && result.length >= 3
          ? [result[0], result[1], result[2]]
          : [result[0] || [], result[1] || 0, { name: [], extractedresourcecount: [] }];

        const formattedRows = Array.isArray(rows)
          ? rows.map((row: any) => {
              const extracted = row?.extractedResourceCount ?? row?.extractedresourcecount ?? 0;
              const childCount = row?.childTaxonomyCount ?? row?.childtaxonomycount ?? 0;
              return {
                ...row,
                extractedResourceCount: Number(extracted),
                childTaxonomyCount: Number(childCount),
                isChild: Boolean(row?.isChild),
              };
            })
          : [];

        return {
          data: [formattedRows, count],
          filterOptions: filterOptions || { name: [], extractedresourcecount: [] },
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
          },
        }
      })
    }),
  one: protectedProcedure
    .input(findSingleInput)
    .query(async ({ ctx, input }) => {
      try {
        // Check if session is locked before allowing access
        await DLSessionService.checkSessionLocked(input)
        
        const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
        const userId = ctx?.user.sub
        const res = await DLSessionService.find(input, ctx.userViewAllPermission.session, userId)
        return res
      } catch (e: any) {
        // Re-throw lock error as-is
        if (e.code === 'FORBIDDEN' && e.message === 'Session is locked') {
          throw e
        }
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    }),
  listExtractedResources: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      
      // Check if the session exists and is not deleted
      const session = await DLSessionService.checkSessionExists(input.filter.dLSessionId, userId);
      if (!session) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Session not found'});
      }

      try {
        const data = await DLSessionService.listExtractedResources(input, isAdmin, userId)
        const response = {
          data: [] as ExtractedResourceLong[],
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
          },
        }
        if (data) {
          for (const item of data) {
            const thumbnailUrl = item.thumbnailUrl
            const thumbnailPath = thumbnailUrl 
              ? String((await CloudService.getThumbnailS3SignedURL(thumbnailUrl)) || '')
              : null

            response.data.push({
              id: item.id,
              fullPath: await CloudService.getS3SignedURL(item.id),
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              metadata: item.metadata,
              rawResourceId: item.rawResourceId,
              status: item.status,
              labelIds: item.labelIds,
              isNextApprover: item.isNextApprover,
              isFinalApproval: item.isFinalApproval,
              isCurrApprover: item.isCurrApprover,
              isReSubmitApprover: item.isReSubmitApprover,
              approvalLevel: item.approvalLevel,
              thumbnailPath,
              comment: item.comment ?? ''
            } as ExtractedResourceLong)
          }
        }
        return response
      } catch (error) {
        console.error('Error in listExtractedResources:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while fetching extracted resources' });
      }
    }),
  listExtractedResourcesTotalCount: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const totalCount = await DLSessionService.listExtractedResourcesTotalCount(input, isAdmin, userId)
      const response = {
        totalCount: Number(totalCount[0]?.count) ?? 0,
      }
      return response
    }),
  listExtractedResourcesLabelCount: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const result = await DLSessionService.listExtractedResourcesLabelCount(input, isAdmin, userId)
      const response = {
        // unlabelledcount: Number(result.labelCount[0]?.unlabelledcount) ?? 0,
        labelledcount: Number(result.labelCount[0]?.labelledcount) ?? 0,
        totalCount: Number(result.labelCount[0]?.totalcount) ?? 0,
        frozenTotalCount: result.frozenTotalCount ?? null,
        fullDatasetTotalCount: result.fullDatasetTotalCount ?? 0
      }
      return response
    }),
  listExtractedResourcesAnnotatedCount: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const annotatedCount = await DLSessionService.listExtractedResourcesAnnotatedCount(input, isAdmin, userId)
      const response = {
        annotatedcount: Number(annotatedCount[0]?.annotatedcount) ?? 0
      }
      return response
    }),
  extractedResourcesPageCount: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const data = await DLSessionService.extractedResourcesPageCount(input, isAdmin, userId)
      const response = {
        data: {} as ExtractedResourceLongPageCount,
      }
      if (data) {
        for (const item of data) {
          response.data['pageNumber'] = item.pagenumber
          response.data['imageIndex'] = item.imageindex
        }
      }
      return response
    }),
  listPatients: protectedProcedure
    .input(listPatientsInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.listPatients(input, isAdmin, userId)
    }),
  listFilterOptions: protectedProcedure
    .input(listFilterOptionsInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.listFilterOptions(input, isAdmin, userId)
    }),
  taxonomyData: protectedProcedure
  .input(taxonomyInput)
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return DLSessionService.taxonomyData(input, isAdmin, userId)
  }),
  create: protectedProcedure
    .input(createSingleInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.create(input, isAdmin, userId)
    }),
  update: protectedProcedure
    .input(updateSingleInput)
    .mutation(async ({ ctx, input }) => {
      // Check if session is locked before allowing update
      await DLSessionService.checkSessionLocked(input.id)
      
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const { confirmTaxonomyDeletion, ...updateInput } = input;
      return DLSessionService.update(updateInput , isAdmin, userId, confirmTaxonomyDeletion ?? false)
    }),
  delete: protectedProcedure
    .input(deleteSingleInput)
    .mutation(async ({ ctx, input }) => {
      // Check if session is locked before allowing delete
      await DLSessionService.checkSessionLocked(input.id)
      
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.delete(input, isAdmin, userId)
    }),
  linkExtractedResources: protectedProcedure
    .input(linkExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub      
      try {
        const result = await DLSessionService.linkExtractedResources(input, isAdmin, userId, input.skipDuplicates, input.returnDuplicateInfo)
        // If returnDuplicateInfo is true, return the duplicate info
        if (input.returnDuplicateInfo) {
          return result
        }
        return {
          count: result.count,
        }
      } catch (error: unknown) {
        // Re-throw TRPCError as-is (already properly formatted)
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // Handle duplicate resources error
        if (error instanceof Error && error.message.includes('already exist')) {
          throw new TRPCError({ 
            code: 'CONFLICT', 
            message: error.message 
          })
        }
        
        // For other errors, wrap in TRPCError with user-friendly message
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while linking extracted resources'
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to link extracted resources: ${errorMessage}. Please check the JSON file format and try again.`
        })
      }
    }),
  updateManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.updateManyExtractedResources(input, isAdmin, userId)
    }),
  submitManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.submitManyExtractedResources(input, isAdmin, userId)
    }),
  rejectManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.rejectManyExtractedResources(input, isAdmin, userId)
    }),
  acceptManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.acceptManyExtractedResources(input, isAdmin, userId)
    }),
  getTaxonomyData: protectedProcedure
    .input(getTaxonomyDataInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return await DLSessionService.getTaxonomyData(input, isAdmin, userId)
    }),
  getMarkupData: protectedProcedure
    .input(getMarkupDataInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return await DLSessionService.getMarkupData(input, isAdmin, userId)
    }),
  deleteSingleTaxonomyData: protectedProcedure
    .input(deleteSingleTaxonomyDataInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return await DLSessionService.deleteSingleTaxonomyData(input, isAdmin, userId)
    }),

  deleteChildTaxonomyData: protectedProcedure
    .input(deleteSingleTaxonomyDataInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return await DLSessionService.deleteChildTaxonomyData(input, isAdmin, userId)
    }),
  updateTaxonomyData: protectedProcedure
    .input(updateTaxonomyDataInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.updateTaxonomyData(input, isAdmin, userId)
    }),
  updateMarkupData: protectedProcedure
  .input(updateMarkupDataInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return DLSessionService.updateMarkupData(input, isAdmin, userId)
    }),
  sendPatientForQC: protectedProcedure
    .input(sendPatientForQCInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.sendPatientForQC(input, isAdmin, userId)
    }),
  projectImageSearch: protectedProcedure
    .input(projectImageSearchInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const data = await DLSessionService.projectImageSearch(input, isAdmin, userId)
      return data
    }),
  getPageForProjectImageSearch: protectedProcedure
    .input(getPageProjectImageSearchInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const data = await DLSessionService.getPageForProjectImageSearch(input, isAdmin, userId)
      return data
    }),

  createVersion: protectedProcedure
    .input(createVersionInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.createVersion(input, userId)
    }),
  listVersions: protectedProcedure
    .input(listVersionsInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return DLSessionService.listVersions(input, userId)
    }),
  getVersionMetadata: protectedProcedure
    .input(getVersionMetadataInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      return DLSessionService.getVersionMetadata(input.versionId, userId)
    }),
  checkVersionExists: protectedProcedure
    .input(checkVersionExistsInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      return DLSessionService.checkVersionExists(input.dLSessionId, input.majorVersion, input.minorVersion, userId)
    }),
  pushJsonToS3: protectedProcedure
    .input(pushJsonToS3Input)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        })
      }
      return DLSessionService.pushJsonToS3(input.dLSessionId, input.key, input.jsonData)
    }),
  downloadJsonFromS3: protectedProcedure
    .input(downloadJsonFromS3Input)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        })
      }
      return DLSessionService.downloadJsonFromS3(input.s3Key)
    }),
  checkS3FolderExists: protectedProcedure
    .input(checkS3FolderExistsInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        })
      }
      return DLSessionService.checkS3FolderExists(input.folderPath)
    }),
  saveAnnotationOrder: protectedProcedure
    .input(saveAnnotationOrderInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return DLSessionService.saveAnnotationOrder(input, userId)
    }),
  
  saveAllAnnotationOrders: protectedProcedure
    .input(saveAllAnnotationOrdersInput)
   .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return DLSessionService.saveAllAnnotationOrders(input, userId)
    }),
  
  getAllSessionStatus: protectedProcedure
    .query(async () => {
      const sessionStatuses = await db.sessionStatus.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return {
        data: sessionStatuses,
      }
    }),
  
    updateSessionStatus: protectedProcedure
    .input(z.strictObject({
      dLSessionId: z.string().uuid(),
      sessionStatusId: z.string().uuid(),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      // Always create a new entry and deactivate all existing statuses
      const result = await db.$transaction([
        // Deactivate all existing statuses for this session
        db.sessionStatusInDLSessions.updateMany({
          where: {
            dLSessionId: input.dLSessionId,
          },
          data: {
            isActive: false,
          },
        }),
        // Create new session status entry
        db.sessionStatusInDLSessions.create({
          data: {
            dLSessionId: input.dLSessionId,
            sessionStatusId: input.sessionStatusId,
            isActive: true,
          },
        }),
      ])

      // Return the created entry (second element in the transaction result)
      return result[1]
    }),
  
  getAnnotationOrder: protectedProcedure
    .input(getAnnotationOrderInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return DLSessionService.getAnnotationOrder(input, userId)
    }),
  
  getAllAnnotationOrders: protectedProcedure
    .input(getAllAnnotationOrdersInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return DLSessionService.getAllAnnotationOrders(input, userId)
    }),
  
  
  /**
   * Lock a session
   * 
   * PERMISSION: Requires Session Lock permission (checked via pathAbilityMap)
   * 
   * STEP-BY-STEP FLOW:
   * 1. Validates user authentication (userId from context)
   * 2. Validates input (dLSessionId UUID, reason 10-100 chars)
   * 3. Calls DLSessionService.lockSession() which:
   *    - Validates reason (length, no emojis)
   *    - Archives old unlocked records if exists
   *    - Creates new lock history record with isLocked=true
   * 4. Returns simple response: { success: true, message: string, lockReason: string }

   */
  lockSession: protectedProcedure
    .input(z.strictObject({
      dLSessionId: z.string().uuid(),  // Session ID to lock
      reason: z.string().min(10).max(100),  // Lock reason (10-100 characters)
    }))
    .mutation(async ({ ctx, input }) => {
      // Step 1: Validate user authentication
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      // Step 2-4: Call service and return simple response
      return DLSessionService.lockSession(input.dLSessionId, input.reason, userId)
    }),

  /**
   * Unlock a session and update status to "Re-open"
   * 
   * PERMISSION: Requires Session Lock permission (checked via pathAbilityMap)
   * 
   * STEP-BY-STEP FLOW:
   * 1. Validates user authentication (userId from context)
   * 2. Validates input (dLSessionId UUID, reason 10-100 chars)
   * 3. Calls DLSessionService.unlockSession() which:
   *    - Validates reason (length, no emojis)
   *    - Updates most recent locked record to isLocked=false
   *    - Sets unlockReason, unlockedAt, unlockedBy
   *    - Finds or creates "Re-open" session status
   *    - Deactivates all existing session statuses
   *    - Activates "Re-open" status for the session
   * 4. Returns simple response: { success: true, message: string, unlockReason: string }
   */
  unlockSession: protectedProcedure
    .input(z.strictObject({
      dLSessionId: z.string().uuid(),  // Session ID to unlock
      reason: z.string().min(10).max(100),  // Unlock reason (10-100 characters)
    }))
    .mutation(async ({ ctx, input }) => {
      // Step 1: Validate user authentication
      const userId = ctx?.user.sub
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      // Step 2-4: Call service and return simple response
      return DLSessionService.unlockSession(input.dLSessionId, input.reason, userId)
    }),

  getSessionLockStatus: protectedProcedure
    .input(z.strictObject({
      dLSessionId: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      return DLSessionService.getSessionLockStatus(input.dLSessionId)
    }),
})

