import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type UpdateTaxonomyDataInput = RouterInput['dLSession']['updateTaxonomyData']
export type TaxonomyInput = RouterInput['dLSession']['taxonomyData']
export type GetTaxonomyDataInput = RouterInput['dLSession']['getTaxonomyData']
export type GetMarkupDataInput = RouterInput['dLSession']['getMarkupData']
export type DeleteSingleTaxonomyDataInput = RouterInput['dLSession']['deleteSingleTaxonomyData']