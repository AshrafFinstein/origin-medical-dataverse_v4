import { ManagementClient } from 'auth0'
import type { GetUsersData, User } from 'auth0'

export interface IAuth0UserRepository {
  findMany(params?: GetUsersData): Promise<User[]>
}

export class Auth0UserRepository implements IAuth0UserRepository {
  protected auth0: ManagementClient

  constructor() {
    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } = useRuntimeConfig()
    this.auth0 = new ManagementClient({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      scope: 'read:users',
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      tokenProvider: {
        enableCache: true,
      },
    })
  }

  async findMany(params?: GetUsersData) {
    const { AUTH0_DATABASE_CONNECTION } = useRuntimeConfig()
    const q = params?.q ? `${params.q} AND identities.connection:"${AUTH0_DATABASE_CONNECTION}"` : `identities.connection:"${AUTH0_DATABASE_CONNECTION}"`

    try {
      const users = await this.getAllUsers(params, q);
      return users;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }
  
  async getAllUsers(params?: GetUsersData, q?: string, page = 0, perPage = 100, allUsers: any[] = []): Promise<any> {
    const paginationParams = {
      per_page: perPage,
      page: page,
      include_totals: true,
      ...params,
      q,
      sort: 'name:1',
      search_engine: 'v3',
    };

    try {
      const { users, total } = await this.auth0.getUsers(paginationParams);
      allUsers.push(...users);
  
      if (allUsers.length < total) {
        return this.getAllUsers(params, q, page + 1, perPage, allUsers);
      }

      return allUsers;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }
}
