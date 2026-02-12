import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { LabelService } from '../../services'
import { protectedProcedure, router } from '../trpc'

const findManyInput = z
  .strictObject({
    filter: z.strictObject({
      dLSessionId: z.string().uuid().optional(),
      extractedResourceId: z.string().uuid().optional(),
    }).optional(),
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name', 'abbreviation'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search : z.string().default('')
  }).optional()

const findSingleInput = z.string().uuid()

const validCharactersPattern = /^[A-Za-z0-9_-]+$/
const abbreviationPattern = /^[A-Za-z0-9_-]+$/

const createSingleInput = z.strictObject({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain uppercase letters, numbers, and underscores"
    }),
  abbreviation: z.string()
    .min(1, { message: "Abbreviation is required" })
    .max(50, { message: "Abbreviation must be 50 characters or less" })
    .refine(val => abbreviationPattern.test(val), {
      message: "Abbreviation can only contain letters (uppercase and lowercase), numbers, hyphens, and underscores"
    }),
})

const createManyInput = z.strictObject({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain uppercase letters, numbers, and underscores"
    }),
  abbreviation: z.string()
    .min(1, { message: "Abbreviation is required" })
    .max(50, { message: "Abbreviation must be 50 characters or less" })
    .refine(val => abbreviationPattern.test(val), {
      message: "Abbreviation can only contain letters (uppercase and lowercase), numbers, hyphens, and underscores"
    }),
}).array()

const updateSingleInput = z.strictObject({
  id: z.string().uuid(),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain letters, numbers, underscores, and hyphens"
    })
    .optional(),
  abbreviation: z.string()
    .min(1, { message: "Abbreviation is required" })
    .max(50, { message: "Abbreviation must be 50 characters or less" })
    .refine(val => abbreviationPattern.test(val), {
      message: "Abbreviation can only contain letters (uppercase and lowercase), numbers, hyphens, and underscores"
    })
    .optional(),
})

const deleteSingleInput = z.string().uuid()

export type LabelFindManyInput = z.infer<typeof findManyInput>
export type LabelFindSingleInput = z.infer<typeof findSingleInput>
export type LabelCreateManyInput = z.infer<typeof createManyInput>
export type LabelCreateSingleInput = z.infer<typeof createSingleInput>
export type LabelUpdateSingleInput = z.infer<typeof updateSingleInput>
export type LabelDeleteSingleInput = z.infer<typeof deleteSingleInput>

export const label = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ input }) => {
      const [labels, count] = await LabelService.findMany(input)
      return {
        data: labels,
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          totalCount: count,
        },
      }
    }),
  one: protectedProcedure
    .input(findSingleInput)
    .query(async ({ input }) => {
      return await LabelService.find(input)
    }),
  create: protectedProcedure
    .input(createSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return await LabelService.create(input)
    }),
  createMany: protectedProcedure
    .input(createManyInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return await LabelService.createMany(input)
    }),
  update: protectedProcedure
    .input(updateSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return await LabelService.update(input)
    }),
  delete: protectedProcedure
    .input(deleteSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return await LabelService.delete(input)
    }),
})
