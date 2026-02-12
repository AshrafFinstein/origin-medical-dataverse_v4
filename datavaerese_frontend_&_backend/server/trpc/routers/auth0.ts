import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { Auth0Service } from '~/server/services'

const findManyUserInput = z
  .object({
    searchQuery: z.object({
      userIds: z.string().array().optional(),
      names: z.string().array().optional(),
    }).optional(),
    page: z.number().optional(),
    perPage: z.number().optional(),
  }).optional()

export type Auth0FindManyUserInput = z.infer<typeof findManyUserInput>

export const auth0 = router({
  listUsers: publicProcedure
    .input(findManyUserInput)
    .query((req) => {
      return Auth0Service.findMany(req.input)
    }),
})
