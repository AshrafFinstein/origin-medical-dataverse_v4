import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { User } from 'auth0'
import { createContextInner, router } from '..'
import { Auth0Service } from '../../services'
import type { Auth0FindManyUserInput } from './auth0'

await setup({
  server: true,
  browser: true,
})
const findManySpy = vi.spyOn(Auth0Service, 'findMany')

describe('GIVEN auth0 route', () => {
  describe.each([
    [
      [
        {
          name: 'auth0 1',
        },
        {
          name: 'auth0 2',
        },
      ],
    ],
  ])('WHEN auth0 service is mocked to find many users', async (users: User[]) => {
    beforeAll(() => {
      findManySpy.mockResolvedValue(users)
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    describe.each([
      [
        {
          searchQuery: {
            names: ['auth0 1'],
          },
          page: 0,
        },
      ],
      [
        {
          page: 2,
          perPage: 5,
        },
      ],
    ])('AND querying route auth0.list-users with good inputs', async (input: Auth0FindManyUserInput) => {
      test('THEN auth0 route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('auth0.list-users', input)).resolves.toEqual(users)
        expect(Auth0Service.findMany).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [
        {
          searchQuery: {
            names: 'random string',
          },
        },
      ],
    ])('AND querying route auth0.list-users with bad inputs', async (input: any) => {
      test('THEN auth0 route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('auth0.list-users', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN auth0 service is mocked to throw an error', async () => {
    beforeAll(() => {
      findManySpy.mockRejectedValue(new Error('FIND MANY ERROR'))
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    test('THEN auth0 route should throw an error', async () => {
      const ctx = await createContextInner({
        user: {
          'sub': '1',
          'https://www.originhealth.ai/roles': ['dataverse-admin'],
        },
      })
      const caller = router.createCaller(ctx)

      await expect(caller.query('auth0.list-users')).rejects.toThrow('FIND MANY ERROR')
      expect(Auth0Service.findMany).toHaveBeenCalled()
    })
  })

  describe('WHEN accessing protected auth0 routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then auth0 route should throw errors', async () => {
      await expect(caller.query('auth0.list-users')).rejects.toThrow()
    })
  })
})
