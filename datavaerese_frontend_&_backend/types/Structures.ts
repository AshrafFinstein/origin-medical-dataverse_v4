import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type StructureGroupCreateInput = RouterInput['structures']['createStructureGroup']
export type StructureInput = RouterInput['cESession']['structureData']