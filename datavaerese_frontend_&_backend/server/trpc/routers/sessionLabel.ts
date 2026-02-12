import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { SessionLabelService } from '../../services/sessionLabel.service'

const findManyInput = z
  .strictObject({
    filter: z.strictObject({
    }).optional(),
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name', 'description'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search : z.string().default('')
  }).optional()

// Validation pattern: allows letters (uppercase and lowercase), numbers, underscores, and hyphens (NO spaces, NO dots)
const validCharactersPattern = /^[A-Za-z0-9_-]+$/

const createManyInput = z.strictObject({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain letters, numbers, underscores, and hyphens"
    }),
  description: z.string().min(1).max(500),
  colorCode: z.string().max(50).optional(),
})

const updateManyInput = z.strictObject({
  id: z.string().uuid(),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain letters, numbers, underscores, and hyphens"
    })
    .optional(),
  description: z.string().min(1).max(500).optional(),
  colorCode: z.string().max(50).optional(),
})

const deleteInput = z.strictObject({
  id: z.string().uuid()
})

export type SessionLabelFindManyInput = z.infer<typeof findManyInput>
export type SessionLabelCreateManyInput = z.infer<typeof createManyInput>
export type SessionLabelUpdateManyInput = z.infer<typeof updateManyInput>
export type SessionLabelDeleteInput = z.infer<typeof deleteInput>

export const sessionLabel = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ input }) => {
      const [sessionLabels, count] = await SessionLabelService.findMany(input)
      return {
        data: sessionLabels,
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          totalCount: count,
        },
      }
    }),

  createSessionLabel: protectedProcedure
    .input(createManyInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return SessionLabelService.createNewSessionLabel(input, isAdmin, userId)
    }),

  updateSessionLabel: protectedProcedure
    .input(updateManyInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return SessionLabelService.updateSessionLabel(input, isAdmin, userId)
    }),

  getUsageCount: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return SessionLabelService.getSessionLabelUsageCount(input)
    }),

  deleteSessionLabel: protectedProcedure
    .input(deleteInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return SessionLabelService.deleteSessionLabel(input, isAdmin, userId)
    }),
})

