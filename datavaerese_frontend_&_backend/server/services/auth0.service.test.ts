import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { User } from 'auth0'
import { TYPE, container } from '../container'
import type { IAuth0UserRepository } from '../infrastructures/auth0/repositories'
import type { Auth0FindManyUserInput } from '../trpc/routers/auth0'
import { Auth0Service } from './auth0.service'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN auth0 service', () => {
  describe.each([
    [
      [
        {
          user_id: 'auth0 1',
        },
        {
          user_id: 'auth0 2',
        },
      ],
    ],
  ])('WHEN user repository is mocked to return valid results', (users: User[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<IAuth0UserRepository>(TYPE.Auth0UserRepository).to(MockedAuth0UserRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedAuth0UserRepository implements IAuth0UserRepository {
      findMany(): Promise<User[]> {
        return Promise.resolve(users)
      }
    }

    test.each([
      [
        {
          searchQuery: {
            userIds: ['auth0 1', 'auth0 2'],
          },
          page: 0,
          perPage: 50,
        },
      ],
    ])('THEN auth0 service should returns valid results when finding many auth0s with good inputs', async (input: Auth0FindManyUserInput) => {
      const spy = vi.spyOn(MockedAuth0UserRepository.prototype, 'findMany')
      await expect(Auth0Service.findMany(input)).resolves.toEqual([
        {
          user_id: 'auth0 1',
        },
        {
          user_id: 'auth0 2',
        },
      ])
      expect(spy).toHaveBeenCalledWith({
        q: 'user_id:(auth0 1 OR auth0 2) ',
        page: 0,
        per_page: 50,
      })
    })
  })
})
