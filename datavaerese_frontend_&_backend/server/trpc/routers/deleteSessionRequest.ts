import { z } from 'zod'
import { DeleteSessionRequestService } from '../../services'
import { protectedProcedure, router } from '../trpc'

/**
 * Input schema for creating a delete session request
 */
const createInput = z.object({
  dLSessionId: z.string().uuid({ message: 'Valid DL Session ID is required' }),
  reason: z.string().min(1, { message: 'Reason is required' }).max(500, { message: 'Reason must be 500 characters or less' }),
})

/**
 * Input schema for finding delete session requests
 */
const findManyInput = z.object({
  dLSessionId: z.string().uuid().optional(),
})

export type DeleteSessionRequestCreateInput = z.infer<typeof createInput>
export type DeleteSessionRequestFindManyInput = z.infer<typeof findManyInput>

export const deleteSessionRequest = router({
  /**
   * Create a new delete session request
   */
  create: protectedProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      const userEmail = ctx?.user.email
      
      if (!userEmail) {
        throw new Error('User email is required')
      }

      return DeleteSessionRequestService.create(input, userId, userEmail)
    }),

  /**
   * Find many delete session requests
   */
  findMany: protectedProcedure
    .input(findManyInput)
    .query(async ({ ctx, input }) => {
      return DeleteSessionRequestService.findMany(input.dLSessionId)
    }),

  /**
   * Find a single delete session request by ID
   */
  findOne: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return DeleteSessionRequestService.findOne(input)
    }),

  /**
   * Approve a delete session request
   */
  approve: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      
      if (!userId) {
        throw new Error('User authentication required')
      }

      return DeleteSessionRequestService.approve(input, userId)
    }),

  /**
   * Reject a delete session request
   */
  reject: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      rejectionReason: z.string().max(500, { message: 'Rejection reason must be 500 characters or less' }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.user.sub
      
      if (!userId) {
        throw new Error('User authentication required')
      }

      return DeleteSessionRequestService.reject(input.id, userId, input.rejectionReason)
    }),
})

