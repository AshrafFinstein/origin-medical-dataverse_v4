import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type TimeSpentInExtractedResourceCreateInput = RouterInput['timeSpent']['createTimeSpentInExtractedResource']
export type TimeSpentInDLSessionCreateInput = RouterInput['timeSpent']['createTimeSpentInDLSession']
