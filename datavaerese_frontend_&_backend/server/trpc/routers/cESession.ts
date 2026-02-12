import { ExtractedResourceStatus, SessionUserRole } from '@prisma/client'
import { z } from 'zod'
import { CloudService, CESessionService } from '../../services'
import { protectedProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'
import { structures } from './structures'
import type { ExtractedResourceLong } from '~/types'
import { cE } from 'naive-ui'

const findManyInput = z
  .strictObject({
    sort: z.record(
      z.string().refine(s => ['createdAt', 'updatedAt', 'name', 'priority'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    filter: z.strictObject({
      projectId: z.string().uuid(),
      priority: z.number().int().min(1).max(3).optional(),
    }),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search: z.string().default('')
  })

const findSingleSessionInput = z
  .object({
    sort: z.record(
      z.string().refine(s => ['createdAt', 'updatedAt', 'name', 'priority'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    filter: z.object({
      projectId: z.string().uuid(),
      priority: z.number().int().min(1).max(3).optional(),
      dLSessionId: z.string().uuid(),
    }),
    limit: z.number().optional(),
    offset: z.number().optional(),
})

const structureInput = z.strictObject({
  filter: z.strictObject({
    cESessionId: z.string().uuid(),
    extractedResourcesId: z.string(),
  }),
})

const updateCommentInput = z.strictObject({
  extractedResourcesId: z.string(),
  cESessionId: z.string().uuid(),
  comment: z.string().optional()
})

const listExtractedResourcesInput = z
  .strictObject({
    filter: z.strictObject({
      cESessionId: z.string().uuid(),
      labelIds: z.string().uuid().array().optional(),
      unLabelled: z.boolean().optional(),
      unAnnotated: z.boolean().optional(),
      annotated: z.boolean().optional(),
      patientId: z.string().optional(),
      imageId: z.string().optional(),
      status: z.nativeEnum(ExtractedResourceStatus).optional(),
      isApproved: z.boolean().optional(),
    }),
    sort: z.record(
      z.literal('id').or(z.literal('createdAt')).or(z.literal('updatedAt')),
      z.literal('asc').or(z.literal('desc')),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
})

const linkExtractedResourcesInput = z.strictObject({
  cESessionId: z.string().uuid(),
  extractedResources: z.strictObject({
    id: z.string()
  }).array(),
})

const updateManyExtractedResourcesInput = z.strictObject({
  cESessionId: z.string().uuid(),
  extractedResources: z.strictObject({
    id: z.string(),
    status: z.nativeEnum(ExtractedResourceStatus).optional(),
    isFinalApproval: z.boolean().optional(),
    isReSubmit: z.boolean().optional(),
  }).array(),
  isApproved: z.boolean().optional(),
})

const saveStructuresInput = z.strictObject({
  cESessionId: z.string().uuid(),
  extractedResourcesId: z.string(),
  structures: z.string().array()
})

const findSingleInput = z.string().uuid()
const findSingleExtractedResourceInput = z.strictObject({
  filter: z.strictObject({
    cESessionId: z.string().uuid(),
    extractedResourceId: z.string().uuid(),
  }),
})
const createSingleInput = z.strictObject({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" })
    .refine(val => val.trimStart() === val, {
      message: "Name cannot start with a space"
    }),
  description: z.string().default(''),
  priority: z.number().int().min(1).max(3),
  sop: z.string().array(),
  resultTemplate: z.any(),
  projectId: z.string().uuid(),
  users: z.strictObject({
    cESessionId: z.string().optional(),
    userId: z.string(),
    userRole: z.nativeEnum(SessionUserRole),
  }).array(),
  structures: z.array(z.string().uuid()).optional(),
  approval : z.array(z.array(z.any()).min(1)).max(5)
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
  sop: z.string().array().optional(),
  projectId: z.string().uuid().optional(),
  users: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(SessionUserRole),
  }).array().optional(),
  structures: z.array(z.string().uuid()).optional(),
  approval : z.array(z.array(z.any()).min(1)).max(5)
})
const updateSingleExtractedResourceInput = z.strictObject({
  cESessionId: z.string().uuid(),
  extractedResourceId: z.string().uuid(),
  result: z.record(z.string(), z.any()).optional(),
  comment: z.string().optional(),
  status: z.nativeEnum(ExtractedResourceStatus),
})

const deleteSingleInput = z.object({
  id :z.string().uuid(),
  deletedAt : z.string()
})

const saveEvaluationResultInput = z.strictObject({
  cESessionId: z.string().uuid(),
  extractedResourceId: z.string(),
  result: z.record(z.string(), z.any()),
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

export type CESessionFindManyInput = z.infer<typeof findManyInput>
export type CESessionFindSingleSessionInput = z.infer<typeof findSingleSessionInput>
export type CESessionFindSingleInput = z.infer<typeof findSingleInput>
export type CESessionCreateSingleInput = z.infer<typeof createSingleInput>
export type CESessionUpdateSingleInput = z.infer<typeof updateSingleInput>
export type CESessionUpdateSingleExtractedResourceInput = z.infer<typeof updateSingleExtractedResourceInput>
export type CESessionDeleteSingleInput = z.infer<typeof deleteSingleInput>
export type CESessionSaveEvaluationResultInput = z.infer<typeof saveEvaluationResultInput>
export type ListExtractedResourcesInCESessionInput = z.infer<typeof listExtractedResourcesInput>
export type CESessionListExtractedResourcesInput = z.infer<typeof listExtractedResourcesInput>
export type CESessionStructureInput = z.infer<typeof structureInput>
export type CESessionStructureCommentInput = z.infer<typeof updateCommentInput>
export type CESessionUpdateManyExtractedResourcesInput = z.infer<typeof updateManyExtractedResourcesInput>
export type CESessionSaveStructuresInput = z.infer<typeof saveStructuresInput>
export type CESessionFindSingleExtractedResourceInput = z.infer<typeof findSingleExtractedResourceInput>
export type ProjectImageSearchInput = z.infer<typeof projectImageSearchInput>
export type GetPageProjectImageSearchInput = z.infer<typeof getPageProjectImageSearchInput>
export type CESessionLinkExtractedResourcesInput = z.infer<typeof linkExtractedResourcesInput>

export const cESession = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.findMany(input, ctx.userViewAllPermission.session, userId).then(([cESessions, count]) => {
        const updatedCeSession = cESessions.map((cESession: any) => {
          const transformedUserGroups = cESession?.UserGroupInCESessions.map((group: any) => ({
            userId: group.userGroupId,
            cESessionId: group.cESessionId,
            userRole: group.userRole
          }));

          const updatedUsers = [...cESession.users, ...transformedUserGroups];

          return {
            ...cESession,
            users: updatedUsers,
            UserGroupInDLSessions: []
          };
        });
        return {
          data: updatedCeSession,
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
      return CESessionService.findSingleSession(input, ctx.userViewAllPermission.session, userId).then(([dlSessions, count, userApproval, structures]) => {
        const updatedCeSession = dlSessions.map((dlSession: any) => {
          const transformedUserGroups = dlSession?.UserGroupInCESessions.map((group: any) => ({
            userId: group.userGroupId,
            cESessionId: group.cESessionId,
            userRole: group.userRole
          }));

          const updatedUsers = [...dlSession.users, ...transformedUserGroups];

          return {
            ...dlSession,
            users: updatedUsers,
            UserGroupInCESessions: []
          };
        });
        return {
          data: updatedCeSession,
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
            totalCount: count,
          },
          structures: structures,
          userApproval: userApproval,
        }
      })
    }),
  one: protectedProcedure
    .input(findSingleInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return await CESessionService.find(input, ctx.userViewAllPermission.session, userId)
    }),
  create: protectedProcedure
    .input(createSingleInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.create(input, isAdmin, userId)
    }),
  update: protectedProcedure
    .input(updateSingleInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.update(input, isAdmin, userId)
    }),
  delete: protectedProcedure
    .input(deleteSingleInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.delete(input, isAdmin, userId)
    }),
  findExtractedResource: protectedProcedure
    .input(findSingleExtractedResourceInput)
    .query(async ({ input }) => {
      return CESessionService.findOneExtractedResource(input)
    }),
  updateExtractedResource: protectedProcedure
    .input(updateSingleExtractedResourceInput)
    .mutation(async ({ input }) => {
      return CESessionService.updateInExtractedResource(input)
    }),
  saveEvaluationResultInput: protectedProcedure
    .input(saveEvaluationResultInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.saveEvaluationResult(input, isAdmin, userId)
    }),
  projectImageSearch: protectedProcedure
    .input(projectImageSearchInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const data = await CESessionService.projectImageSearch(input, isAdmin, userId)
      return data
    }),
    getPageForProjectImageSearch: protectedProcedure
      .input(getPageProjectImageSearchInput)
      .query(async ({ ctx, input }) => {
        const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
        const userId = ctx.user.sub
  
        if (!userId)
          throw new TRPCError({ code: 'UNAUTHORIZED' })
  
        // const data = await CESessionService.getPageForProjectImageSearch(input, isAdmin, userId)
        // return data
      }),
  linkExtractedResources: protectedProcedure
    .input(linkExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const result = await CESessionService.linkExtractedResources(input, isAdmin, userId)
      return {
        count: result[0].count,
      }
    }),
  listExtractedResources: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const data = await CESessionService.listExtractedResources(input, isAdmin, userId)
      const response = {
        data: [] as ExtractedResourceLong[],
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          // totalCount: Number(totalCount[0]?.count) ?? 0,
          // unlabelledcount: Number(labelCount[0]?.unlabelledcount) ?? 0,
          // labelledcount: Number(labelCount[0]?.labelledcount) ?? 0
        },
      }
      if (data) {
        for (const item of data) {
          response.data.push({
            id: item.id,
            fullPath: await CloudService.getS3SignedURL(item.id),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            metadata: item.metadata,
            rawResourceId: item.rawResourceId,
            status: item.status,
            labelIds: item.labelIds,
            isNextApprover : item.isNextApprover,
            isFinalApproval : item.isFinalApproval,
            isCurrApprover : item.isCurrApprover,
            isReSubmitApprover : item.isReSubmitApprover,
            approvalLevel: item.approvalLevel,
            comment: item.comment
          })
        }
      }
      return response
    }),
  listExtractedResourcesTotalCount: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const totalCount = await CESessionService.listExtractedResourcesTotalCount(input, isAdmin, userId)
      const response = {
        totalCount: Number(totalCount[0]?.count) ?? 0,
      }
      return response
    }),
  structureData: protectedProcedure
    .input(structureInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.structureData(input, isAdmin, userId)
    }),
  updateComment: protectedProcedure
    .input(updateCommentInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.updateComment(input, isAdmin, userId)
    }),
  submitManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.submitManyExtractedResources(input, isAdmin, userId)
    }),
  rejectManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.rejectManyExtractedResources(input, isAdmin, userId)
    }),
  acceptManyExtractedResources: protectedProcedure
    .input(updateManyExtractedResourcesInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.acceptManyExtractedResources(input, isAdmin, userId)
    }),
  saveStructures: protectedProcedure
    .input(saveStructuresInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return CESessionService.saveStructures(input, isAdmin, userId)
    }),
  listExtractedResourcesStatusCount: protectedProcedure
    .input(listExtractedResourcesInput)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      const statusCount = await CESessionService.listExtractedResourcesStatusCount(input, isAdmin, userId)
      return statusCount
    }),
})
