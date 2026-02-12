import { ExtractedResourceStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { CloudService, ExtractedResourceService } from '../../services'
import { protectedProcedure, router } from '../trpc'
import type { CEExtractedResourceShort, PrismaCEExtractedResourceShort } from '~/types/ExtractedResource'

const findManyInputInCESession = z
  .strictObject({
    filter: z.strictObject({
      cESessionId: z.string().uuid(),
      userId: z.string(),
      status: z.nativeEnum(ExtractedResourceStatus).optional(),
    }).optional(),
    sort: z.record(
      z.string().refine(s =>
        ['id', 'createdAt', 'updatedAt'].includes(s),
      ),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }).optional()

const findSingleInput = z.string()

const findSingleInputInCESession = z.strictObject({
  filter: z.strictObject({
    cESessionId: z.string().uuid(),
    extractedResourceId: z.string().uuid(),
  }),
})

const createManyInput = z.strictObject({
  id: z.string(),
  metadata: z.record(z.string(), z.any()),
  rawResourceId: z.string(),
  thumbnailUrl: z.string(),
}).array()

const createSingleInput = z.strictObject({
  id: z.string(),
  metadata: z.record(z.string(), z.any()),
  rawResourceId: z.string(),
  thumbnailUrl: z.string(),
})

const updateManyInput = z.strictObject({
  id: z.string(),
  newId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  thumbnailUrl: z.string().optional(),
  rawResourceId: z.string().optional(),
}).array()

const updateSingleInput = z.strictObject({
  id: z.string(),
  newId: z.string().optional(),
  sessionId : z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  thumbnailUrl: z.string().optional(),
  rawResourceId: z.string().optional(),
})

const deleteSingleInput = z.string()

export type ExtractedResourceFindSingleInput = z.infer<typeof findSingleInput>
export type ExtractedResourceFindSingleInputinCESession = z.infer<typeof findSingleInputInCESession>
export type ExtractedResourceFindManyInputinCESession = z.infer<typeof findManyInputInCESession>
export type ExtractedResourceCreateManyInput = z.infer<typeof createManyInput>
export type ExtractedResourceCreateSingleInput = z.infer<
  typeof createSingleInput
>
export type ExtractedResourceUpdateManyInput = z.infer<typeof updateManyInput>
export type ExtractedResourceUpdateSingleInput = z.infer<
  typeof updateSingleInput
>
export type ExtractedResourceDeleteSingleInput = z.infer<
  typeof deleteSingleInput
>

export const extractedResource = router({
  listCESession: protectedProcedure
    .input(findManyInputInCESession)
    .query(async ({ input }) => {
      const [extractedResources, count, patientIdsWithExtractedResourcesCount] = await ExtractedResourceService
        .findManyinCESession(input)
      const data: CEExtractedResourceShort[] = []
      for (const item of extractedResources) {
        const fullPath = await CloudService.getS3SignedURL(item.id)
        const extractedResource: Record<string, string | number> = {
          id: item.id,
          fullPath,
        }
        if ((item as PrismaCEExtractedResourceShort)?.cESessions?.[0]?.status)
          extractedResource.status = (item as PrismaCEExtractedResourceShort)?.cESessions?.[0]?.status
        if ((item as PrismaCEExtractedResourceShort)?.cESessions?.[0]?.index)
          extractedResource.index = (item as PrismaCEExtractedResourceShort)?.cESessions?.[0]?.index

        data.push(extractedResource as unknown as CEExtractedResourceShort)
      }
      return {
        data,
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          totalCount: count,
          patientIdsWithExtractedResourcesCount,
        },
      }
    }),
  one: protectedProcedure
    .input(findSingleInput)
    .query(async ({ input }) => {
      return await ExtractedResourceService.find(input)
    }),
  createMany: protectedProcedure
    .input(createManyInput)
    .mutation(async ({ ctx, input }) => {
      // if (
      //   ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin'
      // )
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await ExtractedResourceService.createMany(input)
    }),
  create: protectedProcedure
    .input(createSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (
      //   ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin'
      // )
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await ExtractedResourceService.create(input)
    }),
  updateMany: protectedProcedure
    .input(updateManyInput)
    .mutation(async ({ ctx, input }) => {
      // if (
      //   ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin'
      // )
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await ExtractedResourceService.updateMany(input)
    }),
  update: protectedProcedure
    .input(updateSingleInput)
    .mutation(async ({ ctx, input }) => {
      return await ExtractedResourceService.updateComment(input)
    }),
  delete: protectedProcedure
    .input(deleteSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (
      //   ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin'
      // )
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await ExtractedResourceService.delete(input)
    }),
})
