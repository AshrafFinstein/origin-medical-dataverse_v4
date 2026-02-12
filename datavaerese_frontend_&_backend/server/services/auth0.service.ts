import type { GetUsersData, User } from 'auth0'
import type { Auth0FindManyUserInput } from '../trpc/routers/auth0'
import { TOKEN, resolve } from '../di'

export class Auth0Service {
  static readonly userRepository = resolve(TOKEN.auth0UserRepository)

  static async findMany(input?: Auth0FindManyUserInput): Promise<User[]> {
    const args: GetUsersData = {}
    if (input) {
      args.page = input.page
      args.per_page = input.perPage
      if (input.searchQuery) {
        let query = ''
        if (input.searchQuery.userIds)
          query = `user_id:(${input.searchQuery.userIds.join(' OR ')}) `
        if (input.searchQuery.names)
          query = `name:(${input.searchQuery.names.join(' OR ')}) `
        args.q = query
      }
    }

    return this.userRepository().findMany(args)
  }
  static async findUserIdByEmail(email: string): Promise<string | null> {
    try {
      const args: GetUsersData = {
        q: `email:"${email}"`,
        per_page: 1,
      }
      const users = await this.userRepository().findMany(args)
      if (users && users.length > 0) {
        return users[0].user_id || null
      }
      return null
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }
}
