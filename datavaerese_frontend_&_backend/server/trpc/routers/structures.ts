import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { StrucutureService } from '~/server/services/structures.service'

const findManyInput = z
  .strictObject({
    filter: z.strictObject({
    }).optional(),
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search:z.string().default(''),
  }).optional()

// Validation pattern: allows letters (uppercase and lowercase), numbers, underscores, and hyphens (NO spaces, NO dots)
const validCharactersPattern = /^[A-Za-z0-9_-]+$/

const createManyInput = z.strictObject({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(1, { message: "Structure Group Name is required" })
    .max(100, { message: "Structure Group Name must be 100 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Structure Group Name can only contain letters, numbers, underscores, and hyphens"
    }),
  structureInStructureGroup: z.array(
    z.object({
      id: z.string().uuid().optional(),
      name: z.string()
        .min(1, { message: "Structure Name is required" })
        .max(100, { message: "Structure Name must be 100 characters or less" })
        .refine(val => validCharactersPattern.test(val), {
          message: "Structure Name can only contain letters, numbers, underscores, and hyphens"
        }),
      structureId: z.string().optional(),
    })
  )
})

const updateManyInput = z.strictObject({
  id: z.string().uuid(),
  name: z.string()
    .min(1, { message: "Structure Group Name is required" })
    .max(100, { message: "Structure Group Name must be 100 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Structure Group Name can only contain letters, numbers, underscores, and hyphens"
    })
    .optional(),
  structureInStructureGroup: z.array(
    z.object({
      id: z.string(),
      name: z.string()
        .min(1, { message: "Structure Name is required" })
        .max(100, { message: "Structure Name must be 100 characters or less" })
        .refine(val => validCharactersPattern.test(val), {
          message: "Structure Name can only contain letters, numbers, underscores, and hyphens"
        }),
      structureGroupId: z.string().optional(),
    })
  )
})

const deleteStructureGroupInput = z.strictObject({
  id: z.string().uuid()
})

const deleteStructureInStructureGroup = z.strictObject({
  id: z.string().uuid()
})

export type StructureGroupFindManyInput = z.infer<typeof findManyInput>
export type StructureGroupCreateInput = z.infer<typeof createManyInput>
export type StructureGroupUpdateManyInput = z.infer<typeof updateManyInput>
export type StructureGroupDeleteInput = z.infer<typeof deleteStructureGroupInput>
export type StructureInStructureGroupDeleteInput = z.infer<typeof deleteStructureInStructureGroup>

export const structures = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ input }) => {
      const [structures, count] = await StrucutureService.findMany(input)
      return {
        data: structures,
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          totalCount: count,
        },
      }
  }),
  createStructureGroup: protectedProcedure
  .input(createManyInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return StrucutureService.createNewStructureGroup(input, isAdmin, userId)
  }),
  updateStructureGroup: protectedProcedure
  .input(updateManyInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return StrucutureService.updateStructureGroup(input, isAdmin, userId)
  }),
  deleteStructureGroup: protectedProcedure
  .input(deleteStructureGroupInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return StrucutureService.deleteStructureGroup(input, isAdmin, userId)
  }),
  deleteStructureInStructureGroup: protectedProcedure
  .input(deleteStructureInStructureGroup)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return StrucutureService.deleteStructureInStructureGroup(input, isAdmin, userId)
  }),
})