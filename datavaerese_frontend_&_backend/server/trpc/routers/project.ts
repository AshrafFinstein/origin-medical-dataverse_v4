import { ProjectUserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { ProjectService } from '../../services'
import { protectedProcedure, router } from '../trpc'

const findManyInput = z
  .object({
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    filter: z.object({
      epicId: z.string().uuid(),
    }),
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
  users: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(ProjectUserRole),
  }).array()
    .min(1, { message: "At least one assignee is required" }),
  epicId: z.string().uuid(),
})

const updateSingleInput = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" })
    .refine(val => val.trimStart() === val, {
      message: "Name cannot start with a space"
    }),
  description: z.string().optional(),
  users: z.object({
    userId: z.string(),
    userRole: z.nativeEnum(ProjectUserRole),
  }).array()
    .min(1, { message: "At least one assignee is required" })
    .optional(),
  epicId: z.string().uuid().optional(),
  confirmUserRemoval: z.boolean().optional(),
})

const deleteSingleInput = z.object({
  id : z.string().uuid(),
  deletedAt : z.string()
})

export type ProjectFindManyInput = z.infer<typeof findManyInput>
export type ProjectFindSingleInput = z.infer<typeof findSingleInput>
export type ProjectCreateSingleInput = z.infer<typeof createSingleInput>
export type ProjectUpdateSingleInput = z.infer<typeof updateSingleInput>
export type ProjectDeleteSingleInput = z.infer<typeof deleteSingleInput>

export const project = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ ctx, input }) => {
      // const isAdmin = ctx.user?.['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx.user.sub

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return ProjectService.findMany(input, ctx.userViewAllPermission.project, userId).then(([projects, count, epicName]) => {
        const updatedProjects = projects.map((project: any) => {
          const transformedUserGroups = project?.UserGroupInProjects.map((group: any) => ({
            userId: group.userGroupId,
            projectId: group.projectId,
            userRole: group.userRole
          }));

          const updatedUsers = [...project.users, ...transformedUserGroups];

          return {
            ...project,
            users: updatedUsers,
            UserGroupInProjects: []
          };
        });
        return {
          data: updatedProjects,
          epicName : epicName,
          metadata: {
            offset: input?.offset,
            limit: input?.limit,
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

      return ProjectService.find(input, ctx.userViewAllPermission.project, userId).catch(() => {
        throw new TRPCError({ code: 'NOT_FOUND' })
      })
    }),
  create: protectedProcedure
    .input(createSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles']?.[0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      const userId = ctx.user.sub ?? ''
      return ProjectService.create(input, userId)
    }),
  update: protectedProcedure
    .input(updateSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles']?.[0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      const userId = ctx.user.sub ?? ''
      return ProjectService.update(input, userId)
    }),
  delete: protectedProcedure
    .input(deleteSingleInput)
    .mutation(async ({ ctx, input }) => {
      // if (ctx?.user['https://www.originhealth.ai/roles']?.[0] !== 'dataverse-admin')
      //   throw new TRPCError({ code: 'UNAUTHORIZED' })
      return await ProjectService.delete(input)
    }),
})
