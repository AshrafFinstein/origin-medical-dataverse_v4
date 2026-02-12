import type { Prisma } from '@prisma/client'
import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type CreateProjectInput = RouterInput['project']['create']
export type ProjectImageSearchInput = RouterInput['dLSession']['projectImageSearch']
export type GetPageProjectImageSearchInput = RouterInput['dLSession']['getPageProjectImageSearchInput']

export type ProjectWithUsers = Prisma.ProjectGetPayload<{
  include: { users: true }
}>
