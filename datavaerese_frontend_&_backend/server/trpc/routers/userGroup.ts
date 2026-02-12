import { ProjectUserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { UserGroupService } from '../../services/userGroup.service'
import { protectedProcedure, router } from '../trpc'

 
const findManyInput = z
  .strictObject({
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'groupName', 'description'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search:z.string().default(''),
}).optional()

// Validation pattern: allows letters (uppercase and lowercase), numbers, underscores, and hyphens (NO spaces, NO dots)
const validCharactersPattern = /^[A-Za-z0-9_-]+$/
 
const createSingleInput = z.strictObject({
  groupName: z.string()
    .min(1, { message: "Group Name is required" })
    .max(100, { message: "Group Name must be 100 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Group Name can only contain letters, numbers, underscores, and hyphens"
    }),
  description: z.union([z.string().max(1000), z.literal('')]).optional(),
  users: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(ProjectUserRole),
  }).array()
    .min(1, { message: "At least one assignee is required" }),
})
 
const updateSingleInput = z.strictObject({
  id: z.string().uuid(),
  groupName: z.string()
    .min(1, { message: "Group Name is required" })
    .max(100, { message: "Group Name must be 100 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Group Name can only contain letters, numbers, underscores, and hyphens"
    })
    .optional(),
  description: z.union([z.string().max(1000), z.literal('')]).optional(),
  usersInGroup: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(ProjectUserRole),
  }).array()
    .min(1, { message: "At least one assignee is required" })
    .optional(),
})
 
export type UserGroupFindManyInput = z.infer<typeof findManyInput>
export type UserGroupCreateSingleInput = z.infer<typeof createSingleInput>
export type UserGroupUpdateSingleInput = z.infer<typeof updateSingleInput>
 
export const userGroup = router({
  list: protectedProcedure
  .input(findManyInput)
  .query(async ({ input }) => {
    const [userGroups, count] = await UserGroupService.findMany(input)
    return {
      data: userGroups,
      metadata: {
        offset: input?.offset,
        limit: input?.limit,
        totalCount: count,
      },
    }
  }),
 
  create: protectedProcedure
  .input(createSingleInput)
  .mutation(async ({ ctx, input }) => {
    // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
    //   throw new TRPCError({ code: 'UNAUTHORIZED' })
    const userId = ctx?.user.sub ?? ''
    return await UserGroupService.create(input, userId)
  }),
 
  update: protectedProcedure
  .input(updateSingleInput)
  .mutation(async ({ ctx, input }) => {
    // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
    //   throw new TRPCError({ code: 'UNAUTHORIZED' })
    return await UserGroupService.update(input)
  })
})