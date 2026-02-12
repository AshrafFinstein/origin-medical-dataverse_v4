import type { inferAsyncReturnType } from '@trpc/server'
import type { User } from '@auth0/auth0-spa-js'
import type { H3Event } from 'h3'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export interface Meta {
  hasAuth: boolean
}

interface CreateContextOptions {
  user?: User
}

export async function createContextInner(_opts: CreateContextOptions) {
  const { user } = _opts
  return { user }
}

export async function createContext(event: H3Event) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you might want to do in your ctx fn
  const { session } = event.context
  return await createContextInner({ user: session?.user })
}

export type Context = inferAsyncReturnType<typeof createContextInner>
