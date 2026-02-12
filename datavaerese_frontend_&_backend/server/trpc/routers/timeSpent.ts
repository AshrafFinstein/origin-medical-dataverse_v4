import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { TimeSpentService } from '~/server/services/timeSpent.service'

const createTimeSpentInExtractedResourcesInput = z.strictObject({
  extractedResourceId: z.string(),
  dLSessionId: z.string(),
  startTime: z.number()
})

const updateTimeSpentInExtractedResourceInput = z.strictObject({
  id: z.string(),
  endTime: z.number()
})

const createTimeSpentInDLSessionInput = z.strictObject({
  dlSessionId: z.string(),
  startTime: z.number()
})

const getTimeSpentInDLSessionInput = z.strictObject({
  dLSessionId: z.string(),
})

const getTimeSpentInExtractedResourceInput = z.strictObject({
  extractedResourceId: z.string(),
  dLSessionId: z.string(),
})

export type TimeSpentInExtractedResourceCreateInput = z.infer<typeof createTimeSpentInExtractedResourcesInput>
export type TimeSpentInExtractedResourceUpdateInput = z.infer<typeof updateTimeSpentInExtractedResourceInput>
export type TimeSpentInDLSessionCreateInput = z.infer<typeof createTimeSpentInDLSessionInput>

export const timeSpent = router({
  createTimeSpentInExtractedResource: protectedProcedure
  .input(createTimeSpentInExtractedResourcesInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx?.user.sub
    return TimeSpentService.createNewTimeSpentInExtractedResource(input, userId)
  }),

  createTimeSpentInDLSession: protectedProcedure
  .input(createTimeSpentInDLSessionInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx?.user.sub
    return TimeSpentService.createNewTimeSpentInDLSession(input, userId)
  }),

  getTotalTimeSpentInDLSession: protectedProcedure
  .input(getTimeSpentInDLSessionInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx?.user.sub
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    return TimeSpentService.getTotalTimeSpentInDLSession(input.dLSessionId, userId, isAdmin)
  }),

  getAnnotatedImageTimeSpentInDLSession: protectedProcedure
  .input(getTimeSpentInDLSessionInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx?.user.sub
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    return TimeSpentService.getAnnotatedImageTimeSpentInDLSession(input.dLSessionId, userId, isAdmin)
  }),

  getTimeSpentInExtractedResource: protectedProcedure
  .input(getTimeSpentInExtractedResourceInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx?.user.sub
    return TimeSpentService.getTimeSpentInExtractedResource(input.extractedResourceId, input.dLSessionId, userId)
  }),

  updateTimeSpentInExtractedResource: protectedProcedure
  .input(updateTimeSpentInExtractedResourceInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx?.user.sub
    return TimeSpentService.updateTimeSpentInExtractedResource(input, userId)
  })
})
