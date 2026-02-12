import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { CESession } from '@prisma/client'
import { SessionUserRole } from '@prisma/client'
import { createContextInner, router } from '..'
import { CESessionService } from '../../services'
import type { CESessionCreateSingleInput, CESessionDeleteSingleInput, CESessionFindManyInput, CESessionFindSingleInput, CESessionSaveEvaluationResultInput, CESessionUpdateSingleInput } from './cESession'
import type { CESessionWithUsers } from '~/types/CESession'

await setup({
  server: true,
  browser: true,
})
const findManySpy = vi.spyOn(CESessionService, 'findMany')
const findSpy = vi.spyOn(CESessionService, 'find')
const createSpy = vi.spyOn(CESessionService, 'create')
const updateSpy = vi.spyOn(CESessionService, 'update')
const deleteSpy = vi.spyOn(CESessionService, 'delete')
const saveEvaluationResultSpy = vi.spyOn(CESessionService, 'saveEvaluationResult')

describe('GIVEN cESession route', () => {
  describe.each([
    [
      [{
        id: '1',
        name: 'CESession 1',
        description: 'Description 1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        resultTemplate: {
          just: 'random',
        },
        priority: 1,
        sop: ['www.example.com'],
        projectId: randomUUID(),
        users: [],
      },
      {
        id: '2',
        name: 'CESession 2',
        description: 'Description 2',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        resultTemplate: {
          just: 'random',
        },
        priority: 2,
        sop: ['www.example.com'],
        projectId: randomUUID(),
        users: [],
      },
      {
        id: '3',
        name: 'CESession 3',
        description: 'Description 3',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        priority: 3,
        sop: ['www.example.com'],
        resultTemplate: {
          just: 'random',
        },
        projectId: randomUUID(),
        users: [],
      }],
    ],
  ])('WHEN cESession service is mocked to find many valid cESessions', async (cESessions: CESessionWithUsers[]) => {
    beforeAll(() => {
      findManySpy.mockResolvedValue([cESessions, cESessions.length])
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    describe.each([
      [
        {
          filter: {
            projectId: cESessions[0].projectId,
          },
          sort: [
            {
              createdAt: 'asc',
            },
          ],
          limit: 2,
          offset: 0,
        },
      ],
      [
        {
          filter: {
            projectId: cESessions[1].projectId,
          },
          limit: 2,
          offset: 10,
        },
      ],
    ])('AND querying route cESession.list with good inputs', async (input: CESessionFindManyInput) => {
      test('THEN cESession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('cESession.list', input)).resolves.toEqual({
          data: cESessions,
          metadata: {
            limit: input?.limit,
            offset: input?.offset,
            totalCount: cESessions.length,
          },
        })
        expect(CESessionService.findMany).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [
        {
          sort: [
            {
              createdAt: 'WRONG INPUT',
            },
          ],
          limit: 2,
          offset: 0,
        },
      ],
      [
        'random string',
      ],
    ])('AND querying route cESession.list with bad inputs', async (input: any) => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('cESession.list', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'CESession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      resultTemplate: {
        just: 'random',
      },
      projectId: randomUUID(),
      users: [],
    }],
  ])('WHEN cESession service is mocked to find single valid cESession', async (cESession: CESessionWithUsers) => {
    beforeAll(() => {
      findSpy.mockResolvedValue(cESession)
    })

    afterAll(() => {
      findSpy.mockClear()
    })

    describe.each([
      [randomUUID()],
    ])('AND querying route cESession.one with good inputs', async (input: CESessionFindSingleInput) => {
      test('THEN cESession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('cESession.one', input)).resolves.toEqual(cESession)
        expect(CESessionService.find).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND querying route cESession.one with bad inputs', async (input: any) => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('cESession.one', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'CESession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      resultTemplate: {
        just: 'random',
      },
      projectId: randomUUID(),
    }],
  ])('WHEN cESession service is mocked to create valid cESession', async (cESession: CESession) => {
    beforeAll(() => {
      createSpy.mockResolvedValue(cESession)
    })

    afterAll(() => {
      createSpy.mockClear()
    })

    describe.each([
      [
        {
          name: 'CESession 1',
          description: 'Description 1',
          priority: 1,
          sop: ['www.example.com'],
          resultTemplate: {
            just: 'random',
          },
          projectId: randomUUID(),
          users: [
            {
              userId: 'auth0|test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        },
      ],
    ])('AND mutating route cESession.create with good inputs', async (input: CESessionCreateSingleInput) => {
      test('THEN cESession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.create', input)).resolves.toEqual(cESession)
        expect(CESessionService.create).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route cESession.create with bad inputs', async (input: any) => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.create', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route cESession.create with no authorization', async () => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({})
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.create', {
          name: 'CESession 1',
          description: 'Description 1',
          priority: 1,
          sop: ['www.example.com'],
          resultTemplate: {
            just: 'random',
          },
          projectId: randomUUID(),
          users: [
            {
              userId: 'auth0|test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        })).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'CESession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      resultTemplate: {
        just: 'random',
      },
      projectId: randomUUID(),
    }],
  ])('WHEN cESession service is mocked to update valid cESession', async (cESession: CESession) => {
    beforeAll(() => {
      updateSpy.mockResolvedValue(cESession)
    })

    afterAll(() => {
      updateSpy.mockClear()
    })

    describe.each([
      [
        {
          id: cESession.id,
          name: 'New',
          description: 'New',
          projectId: randomUUID(),
          users: [
            {
              userId: 'auth0|test',
              userRole: SessionUserRole.ACTIVITY,
            },
            {
              userId: 'auth0|test2',
              userRole: SessionUserRole.QUALITY_CONTROLLER,
            },
          ],
        },
      ],
    ])('AND mutating route cESession.update with good inputs', async (input: CESessionUpdateSingleInput) => {
      test('THEN cESession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.update', input)).resolves.toEqual(cESession)
        expect(CESessionService.update).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route cESession.update with bad inputs', async (input: any) => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.update', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'CESession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      resultTemplate: {
        just: 'random',
      },
      projectId: randomUUID(),
    }],
  ])('WHEN cESession service is mocked to delete valid cESession', async (cESession: CESession) => {
    beforeAll(() => {
      deleteSpy.mockResolvedValue(cESession)
    })

    afterAll(() => {
      deleteSpy.mockClear()
    })

    describe.each([
      [cESession.id],
    ])('AND mutating route cESession.delete with good inputs', async (input: CESessionDeleteSingleInput) => {
      test('THEN cESession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.delete', input)).resolves.toEqual(cESession)
        expect(CESessionService.delete).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route cESession.delete with bad inputs', async (input: any) => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.delete', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN cESession service is mocked to save valid extracted resource in a cESession', async () => {
    beforeAll(() => {
      saveEvaluationResultSpy.mockResolvedValue({
        extractedResourceId: 'test.png',
      })
    })

    afterAll(() => {
      saveEvaluationResultSpy.mockClear()
    })

    describe.each([
      [
        {
          cESessionId: randomUUID(),
          extractedResourceId: 'test.png',
          result: {},
        },
      ],
    ])('AND mutating route cESession.saveEvaluationResult with good inputs', async (input: CESessionSaveEvaluationResultInput) => {
      test('THEN cESession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.saveEvaluationResult', input)).resolves.toEqual({
          extractedResourceId: 'test.png',
        })
        expect(CESessionService.saveEvaluationResult).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route cESession.saveEvaluationResult with bad inputs', async (input: any) => {
      test('THEN cESession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('cESession.saveEvaluationResult', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN cESession service is mocked to throw an error', async () => {
    beforeAll(() => {
      findManySpy.mockRejectedValue(new Error('FIND MANY ERROR'))
      findSpy.mockRejectedValue(new Error('FIND SINGLE ERROR'))
      createSpy.mockRejectedValue(new Error('CREATE ERROR'))
      updateSpy.mockRejectedValue(new Error('UPDATE ERROR'))
      deleteSpy.mockRejectedValue(new Error('DELETE ERROR'))
      saveEvaluationResultSpy.mockRejectedValue(new Error('SAVE EVALUATION RESULT ERROR'))
    })

    afterAll(() => {
      findManySpy.mockClear()
      findSpy.mockClear()
      createSpy.mockClear()
      updateSpy.mockClear()
      deleteSpy.mockClear()
      saveEvaluationResultSpy.mockClear()
    })

    test('THEN cESession route should throw an error', async () => {
      const ctx = await createContextInner({
        user: {
          'https://www.originhealth.ai/roles': ['dataverse-admin'],
          'sub': '1',
        },
      })
      const caller = router.createCaller(ctx)
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles'].includes('dataverse-admin')
      const userId = ctx?.user.sub

      const uuid = randomUUID()
      const cESession: CESession = {
        id: uuid,
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        name: 'CESession 1',
        description: 'Description 1',
        priority: 1,
        sop: ['www.example.com'],
        resultTemplate: {
          just: 'random',
        },
        projectId: uuid,
      }

      await expect(caller.query('cESession.list', {
        filter: {
          projectId: uuid,
        },
      })).rejects.toThrow('FIND MANY ERROR')
      expect(CESessionService.findMany).toHaveBeenCalledWith({
        filter: {
          projectId: uuid,
        },
      }, isAdmin, userId)

      await expect(caller.query('cESession.one', uuid)).rejects.toThrow('FIND SINGLE ERROR')
      expect(CESessionService.find).toHaveBeenCalledWith(uuid, isAdmin, userId)

      await expect(caller.mutation('cESession.create', {
        name: cESession.name,
        description: cESession.description,
        priority: cESession.priority,
        sop: cESession.sop,
        projectId: cESession.projectId,
        resultTemplate: {
          just: 'random',
        },
        users: [
          {
            userId: 'auth0|test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })).rejects.toThrow('CREATE ERROR')
      expect(CESessionService.create).toHaveBeenCalledWith({
        name: cESession.name,
        description: cESession.description,
        priority: cESession.priority,
        sop: cESession.sop,
        projectId: cESession.projectId,
        resultTemplate: {
          just: 'random',
        },
        users: [
          {
            userId: 'auth0|test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      }, isAdmin, userId)

      await expect(caller.mutation('cESession.update', {
        id: cESession.id,
        name: cESession.name,
        description: cESession.description,
        priority: cESession.priority,
        projectId: cESession.projectId,
      })).rejects.toThrow('UPDATE ERROR')
      expect(CESessionService.update).toHaveBeenCalledWith({
        id: cESession.id,
        name: cESession.name,
        description: cESession.description,
        priority: cESession.priority,
        projectId: cESession.projectId,
      }, isAdmin, userId)

      await expect(caller.mutation('cESession.delete', uuid)).rejects.toThrow('DELETE ERROR')
      expect(CESessionService.delete).toHaveBeenCalledWith(uuid, isAdmin, userId)

      await expect(caller.mutation('cESession.saveEvaluationResult', {
        cESessionId: cESession.id,
        extractedResourceId: 'test.png',
        result: {
          placeholder: 'placeholder',
        },
      })).rejects.toThrow('SAVE EVALUATION RESULT ERROR')
      expect(CESessionService.saveEvaluationResult).toHaveBeenCalledWith({
        cESessionId: cESession.id,
        extractedResourceId: 'test.png',
        result: {
          placeholder: 'placeholder',
        },
      }, isAdmin, userId)
    })
  })

  describe('WHEN accessing protected cESession routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then cESession route should throw errors', async () => {
      await expect(caller.mutation('cESession.create', {
        name: 'CESession 1',
        description: 'Description 1',
        priority: 1,
        sop: ['www.example.com'],
        resultTemplate: {
          just: 'random',
        },
        projectId: randomUUID(),
        users: [
          {
            userId: 'auth0|test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })).rejects.toThrow()
    })
  })
})
