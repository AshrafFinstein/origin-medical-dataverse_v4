import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { EpicService } from '../../services'
import { protectedProcedure, router } from '../trpc'

const findManyInput = z
  .object({
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name', 'description'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().default(50),
    offset: z.number().default(0),
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
})

const updateSingleInput = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" })
    .refine(val => val.trimStart() === val, {
      message: "Name cannot start with a space"
    }),
  description: z.string().default('').optional(),
})

const deleteSingleInput = z.object({
  id : z.string().uuid(),
  deletedAt : z.string()
})

const searchFindManyInput = z
  .object({
    sort: z.record(
      z.string().refine(s => ['name','projectName', 'sessionName'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().default(50),
    offset: z.number().default(0),
    search: z.string().default('')
  })

export type EpicFindManyInput = z.infer<typeof findManyInput>
export type EpicFindSingleInput = z.infer<typeof findSingleInput>
export type EpicCreateSingleInput = z.infer<typeof createSingleInput>
export type EpicUpdateSingleInput = z.infer<typeof updateSingleInput>
export type EpicDeleteSingleInput = z.infer<typeof deleteSingleInput>
export type SearchEpicFindManyInput = z.infer<typeof searchFindManyInput>

export const epic = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ ctx, input }) => {
      // const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return EpicService.findMany(input, ctx.userViewAllPermission.epic, userId).then(([epics, count]) => {
        return {
          data: epics,
          metadata: {
            offset: input.offset,
            limit: input.limit,
            totalCount: count,
          },
        }
      })
    }),
  one: protectedProcedure
    .input(findSingleInput)
    .query(async ({ ctx, input }) => {
      // const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return EpicService.find(input, ctx.userViewAllPermission.epic, userId)
    }),
  create: protectedProcedure
    .input(createSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return EpicService.create(input)
    }),
  update: protectedProcedure
    .input(updateSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return EpicService.update(input)
    }),
  delete: protectedProcedure
    .input(deleteSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles'][0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return await EpicService.delete(input)
    }),
  
  searchList: protectedProcedure
    .input(searchFindManyInput)
    .query(async ({ ctx, input }) => {
      // const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub
      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return EpicService.searchFindMany(input, ctx.userViewAllPermission.epic, ctx.userViewAllPermission.project, ctx.userViewAllPermission.session, userId).then(([epics, count]) => {
        return {
          data: epics,
          metadata: {
            // offset: input.offset,
            // limit: input.limit,
            totalCount: count,
          },
        }
      })
    }),
})
