import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { RolePermissionService } from '~/server/services/rolePermission.service'


const findManyInput = z.strictObject({
    filter: z.strictObject({
      dLSessionId: z.string().uuid().optional(),
      extractedResourceId: z.string().uuid().optional(),
    }).optional(),
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name', 'abbreviation', 'roleName'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search :z.string().default('')
  }).optional()

// Validation pattern: allows letters (uppercase and lowercase), numbers, spaces, underscores, and hyphens
const validCharactersPattern = /^[A-Za-z0-9_ -]+$/

const createSingleInput = z.strictObject({
    name: z.string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be 100 characters or less" })
      .refine(val => validCharactersPattern.test(val), {
        message: "Name can only contain letters, numbers, spaces, underscores, and hyphens"
      }),
    permissions:  z.array(
      z.strictObject({
          moduleId: z.number(),
          actionId: z.number(),
      })
    ),
  })

const updateSingleInput = z.strictObject({
    name: z.string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be 100 characters or less" })
      .refine(val => validCharactersPattern.test(val), {
        message: "Name can only contain letters, numbers, spaces, underscores, and hyphens"
      }),
    id:  z.string().optional(),
    permissions:  z.array(
      z.strictObject({
          moduleId: z.number(),
          actionId: z.number(),
      })
    ),
  })

const findSingleInput = z.strictObject({
    roleId: z.string().uuid()
  })

const updateUserRoleMappinglistInput = z.object({
    userId: z.string(),
    roleId: z.string().array()
  })


export type RolePermissionFindManyInput = z.infer<typeof findManyInput>
export type RolePermissionCreateSingleInput = z.infer<typeof createSingleInput>
export type RolePermissionUpdateSingleInput = z.infer<typeof updateSingleInput>
export type RolePermissionFindSingleInput = z.infer<typeof findSingleInput>
export type updateUserRoleMappinglistInput = z.infer<typeof updateUserRoleMappinglistInput>


export const rolePermission = router({
  list: protectedProcedure
  .input(findManyInput)
  .query(async ({ input }) => {
    const [labels, count] = await RolePermissionService.findMany(input)
    return {
      data: labels,
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
    const userId = ctx.user.sub ? ctx.user.sub : ''
    // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
    //   throw new TRPCError({ code: 'UNAUTHORIZED' })
    return await RolePermissionService.create(input,userId)
  }),

  update: protectedProcedure
  .input(updateSingleInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user.sub ? ctx.user.sub : ''
    // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
    //   throw new TRPCError({ code: 'UNAUTHORIZED' })
    return await RolePermissionService.update(input,userId)
  }),

  findSinglevalue: protectedProcedure
  .input(findSingleInput)
  .mutation(async ({ ctx, input }) => {
    // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
    //   throw new TRPCError({ code: 'UNAUTHORIZED' })
    return await RolePermissionService.find(input)
  }),

  findModuleActions: protectedProcedure
  .mutation(async ({ ctx, input }) => {
    // if (ctx.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
    //   throw new TRPCError({ code: 'UNAUTHORIZED' })
    return await RolePermissionService.findModuleActions(input)
  }),

  roleList: protectedProcedure
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return RolePermissionService.roleList(isAdmin, userId)
  }),

  getRolePermission: protectedProcedure
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return RolePermissionService.getRolePermission(input, isAdmin, userId)
  }),

  userRoleMappinglist: protectedProcedure
  .input(findManyInput)
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub ?? ''
    return RolePermissionService.userRoleMappinglist(input, isAdmin, userId)
  }),

  updateUserRoleMappinglist: protectedProcedure
  .input(updateUserRoleMappinglistInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin';
    const userId = ctx?.user.sub ? ctx?.user.sub : '';
    return RolePermissionService.updateUserRoleMappinglist(input, isAdmin, userId);
  }),
  
})