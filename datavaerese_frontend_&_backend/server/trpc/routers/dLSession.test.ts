import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { DLSession } from '@prisma/client'
import { ExtractedResourceStatus, SessionUserRole } from '@prisma/client'

import { createContextInner, router } from '..'
import { DLSessionService } from '../../services'
import type { DLSessionCreateSingleInput, DLSessionDeleteSingleInput, DLSessionFindManyInput, DLSessionFindSingleInput, DLSessionLinkExtractedResourcesInput, DLSessionUpdateManyExtractedResourcesInput, DLSessionUpdateSingleInput } from './dLSession'
import type { DLSessionWithLabelsAndUsers, DLSessionWithUsers } from '~/types/DLSession'

await setup({
  server: true,
  browser: true,
})
const findManySpy = vi.spyOn(DLSessionService, 'findMany')
const findSpy = vi.spyOn(DLSessionService, 'find')
const createSpy = vi.spyOn(DLSessionService, 'create')
const updateSpy = vi.spyOn(DLSessionService, 'update')
const deleteSpy = vi.spyOn(DLSessionService, 'delete')
const linkExtractedResourcesSpy = vi.spyOn(DLSessionService, 'linkExtractedResources')
const updateManyExtractedResourcesSpy = vi.spyOn(DLSessionService, 'updateManyExtractedResources')

describe('GIVEN dLSession route', () => {
  describe.each([
    [
      [{
        id: '1',
        name: 'DLSession 1',
        description: 'Description 1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        priority: 1,
        sop: ['www.example.com'],
        projectId: randomUUID(),
        users: [],
      },
      {
        id: '2',
        name: 'DLSession 2',
        description: 'Description 2',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        priority: 2,
        sop: ['www.example.com'],
        projectId: randomUUID(),
        users: [],
      },
      {
        id: '3',
        name: 'DLSession 3',
        description: 'Description 3',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        priority: 3,
        sop: ['www.example.com'],
        projectId: randomUUID(),
        users: [],
      }],
    ],
  ])('WHEN dLSession service is mocked to find many valid dLSessions', async (dLSessions: DLSessionWithUsers[]) => {
    beforeAll(() => {
      findManySpy.mockResolvedValue([dLSessions, dLSessions.length])
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    describe.each([
      [
        {
          filter: {
            projectId: dLSessions[0].projectId,
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
            projectId: dLSessions[1].projectId,
          },
          limit: 2,
          offset: 10,
        },
      ],
    ])('AND querying route dLSession.list with good inputs', async (input: DLSessionFindManyInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('dLSession.list', input)).resolves.toEqual({
          data: dLSessions,
          metadata: {
            limit: input?.limit,
            offset: input?.offset,
            totalCount: dLSessions.length,
          },
        })
        expect(DLSessionService.findMany).toHaveBeenCalledWith(input, true, '1')
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
    ])('AND querying route dLSession.list with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('dLSession.list', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'DLSession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      projectId: randomUUID(),
      labels: [],
      users: [],
    }],
  ])('WHEN dLSession service is mocked to find single valid dLSession', async (dLSession: DLSessionWithLabelsAndUsers) => {
    beforeAll(() => {
      findSpy.mockResolvedValue(dLSession)
    })

    afterAll(() => {
      findSpy.mockClear()
    })

    describe.each([
      [randomUUID()],
    ])('AND querying route dLSession.one with good inputs', async (input: DLSessionFindSingleInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('dLSession.one', input)).resolves.toEqual(dLSession)
        expect(DLSessionService.find).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND querying route dLSession.one with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('dLSession.one', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'DLSession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      projectId: randomUUID(),
    }],
  ])('WHEN dLSession service is mocked to create valid dLSession', async (dLSession: DLSession) => {
    beforeAll(() => {
      createSpy.mockResolvedValue(dLSession)
    })

    afterAll(() => {
      createSpy.mockClear()
    })

    describe.each([
      [
        {
          name: 'DLSession 1',
          description: 'Description 1',
          priority: 1,
          sop: ['www.example.com'],
          projectId: randomUUID(),
          users: [
            {
              userId: 'auth0|test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
          labelIds: [randomUUID(), randomUUID()] as [ string, ...string[] ],
        },
      ],
    ])('AND mutating route dLSession.create with good inputs', async (input: DLSessionCreateSingleInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.create', input)).resolves.toEqual(dLSession)
        expect(DLSessionService.create).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route dLSession.create with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.create', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route dLSession.create with no authorization', async () => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({})
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.create', {
          name: 'DLSession 1',
          description: 'Description 1',
          priority: 1,
          sop: ['www.example.com'],
          projectId: randomUUID(),
          users: [
            {
              userId: 'auth0|test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
          labelIds: [randomUUID(), randomUUID()],
        })).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'DLSession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      projectId: randomUUID(),
    }],
  ])('WHEN dLSession service is mocked to update valid dLSession', async (dLSession: DLSession) => {
    beforeAll(() => {
      updateSpy.mockResolvedValue(dLSession)
    })

    afterAll(() => {
      updateSpy.mockClear()
    })

    describe.each([
      [
        {
          id: dLSession.id,
          name: 'New',
          description: 'New',
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
          projectId: randomUUID(),
        },
      ],
    ])('AND mutating route dLSession.create with good inputs', async (input: DLSessionUpdateSingleInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.update', input)).resolves.toEqual(dLSession)
        expect(DLSessionService.update).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route dLSession.update with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.update', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'DLSession 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      priority: 1,
      sop: ['www.example.com'],
      projectId: randomUUID(),
    }],
  ])('WHEN dLSession service is mocked to delete valid dLSession', async (dLSession: DLSession) => {
    beforeAll(() => {
      deleteSpy.mockResolvedValue(dLSession)
    })

    afterAll(() => {
      deleteSpy.mockClear()
    })

    describe.each([
      [dLSession.id],
    ])('AND mutating route dLSession.delete with good inputs', async (input: DLSessionDeleteSingleInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.delete', input)).resolves.toEqual(dLSession)
        expect(DLSessionService.delete).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route dLSession.delete with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.delete', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN dLSession service is mocked to link dLSession with many extracted resources', async () => {
    beforeAll(() => {
      linkExtractedResourcesSpy.mockResolvedValue([{
        count: 1,
      }, {
        count: 1,
      }])
    })

    afterAll(() => {
      linkExtractedResourcesSpy.mockClear()
    })

    describe.each([
      [
        {
          dLSessionId: randomUUID(),
          extractedResources: [
            {
              id: 'extractedResource/1',
              labelIds: [randomUUID()],
            },
          ],
        },
      ],
    ])('AND mutating route dLSession.create with good inputs', async (input: DLSessionLinkExtractedResourcesInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.linkExtractedResources', input)).resolves.toEqual({
          count: 1,
        })
        expect(DLSessionService.linkExtractedResources).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route dLSession.update with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.linkExtractedResources', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN dLSession service is mocked to update many extracted resources in a dLSession', async () => {
    beforeAll(() => {
      updateManyExtractedResourcesSpy.mockResolvedValue(
        [
          {
            extractedResourceId: 'test1.png',
          },
          {
            extractedResourceId: 'test2.png',
          },
        ],
      )
    })

    afterAll(() => {
      updateManyExtractedResourcesSpy.mockClear()
    })

    describe.each([
      [
        {
          dLSessionId: randomUUID(),
          extractedResources: [
            {
              id: 'test1.png',
              labelIds: [randomUUID()],
            },
            {
              id: 'test2.png',
              labelIds: [randomUUID()],
              status: ExtractedResourceStatus.PENDING,
            },
          ],
        },
      ],
    ])('AND mutating route dLSession.updateManyExtractedResources with good inputs', async (input: DLSessionUpdateManyExtractedResourcesInput) => {
      test('THEN dLSession route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.updateManyExtractedResources', input)).resolves.toEqual([
          {
            extractedResourceId: 'test1.png',
          },
          {
            extractedResourceId: 'test2.png',
          },
        ])
        expect(DLSessionService.updateManyExtractedResources).toHaveBeenCalledWith(input, true, '1')
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route dLSession.updateManyExtractedResources with bad inputs', async (input: any) => {
      test('THEN dLSession route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
            'sub': '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('dLSession.updateManyExtractedResources', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN dLSession service is mocked to throw an error', async () => {
    beforeAll(() => {
      findManySpy.mockRejectedValue(new Error('FIND MANY ERROR'))
      findSpy.mockRejectedValue(new Error('FIND SINGLE ERROR'))
      createSpy.mockRejectedValue(new Error('CREATE ERROR'))
      updateSpy.mockRejectedValue(new Error('UPDATE ERROR'))
      deleteSpy.mockRejectedValue(new Error('DELETE ERROR'))
      linkExtractedResourcesSpy.mockRejectedValue(new Error('LINK EXTRACTED RESOURCES ERROR'))
      updateManyExtractedResourcesSpy.mockRejectedValue(new Error('UPDATE MANY EXTRACTED RESOURCES ERROR'))
    })

    afterAll(() => {
      findManySpy.mockClear()
      findSpy.mockClear()
      createSpy.mockClear()
      updateSpy.mockClear()
      deleteSpy.mockClear()
      linkExtractedResourcesSpy.mockClear()
      updateManyExtractedResourcesSpy.mockClear()
    })

    test('THEN dLSession route should throw an error', async () => {
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
      const dLSession: DLSession = {
        id: uuid,
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        name: 'DLSession 1',
        description: 'Description 1',
        priority: 1,
        sop: ['www.example.com'],
        projectId: uuid,
      }

      await expect(caller.query('dLSession.list', {
        filter: {
          projectId: uuid,
        },
      })).rejects.toThrow('FIND MANY ERROR')
      expect(DLSessionService.findMany).toHaveBeenCalledWith({
        filter: {
          projectId: uuid,
        },
      }, isAdmin, userId)

      await expect(caller.query('dLSession.one', uuid)).rejects.toThrow('FIND SINGLE ERROR')
      expect(DLSessionService.find).toHaveBeenCalledWith(uuid, isAdmin, userId)

      await expect(caller.mutation('dLSession.create', {
        name: dLSession.name,
        description: dLSession.description,
        priority: dLSession.priority,
        sop: ['www.example.com'],
        projectId: dLSession.projectId,
        users: [
          {
            userId: 'auth0|test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
        labelIds: [uuid],
      })).rejects.toThrow('CREATE ERROR')
      expect(DLSessionService.create).toHaveBeenCalledWith({
        name: dLSession.name,
        description: dLSession.description,
        priority: dLSession.priority,
        sop: ['www.example.com'],
        projectId: dLSession.projectId,
        users: [
          {
            userId: 'auth0|test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
        labelIds: [uuid],
      }, isAdmin, userId)

      await expect(caller.mutation('dLSession.update', {
        ...dLSession,
      })).rejects.toThrow('UPDATE ERROR')
      expect(DLSessionService.update).toHaveBeenCalledWith({
        id: dLSession.id,
        name: dLSession.name,
        description: dLSession.description,
        priority: dLSession.priority,
        sop: ['www.example.com'],
        projectId: dLSession.projectId,
      }, isAdmin, userId)

      await expect(caller.mutation('dLSession.delete', uuid)).rejects.toThrow('DELETE ERROR')
      expect(DLSessionService.delete).toHaveBeenCalledWith(uuid, isAdmin, userId)

      await expect(caller.mutation('dLSession.linkExtractedResources', {
        dLSessionId: uuid,
        extractedResources: [{
          id: 'extractedResource/1',
          labelIds: [uuid],
        }],
      })).rejects.toThrow('LINK EXTRACTED RESOURCES ERROR')
      expect(DLSessionService.linkExtractedResources).toHaveBeenCalledWith({
        dLSessionId: uuid,
        extractedResources: [{
          id: 'extractedResource/1',
          labelIds: [uuid],
        }],
      }, isAdmin, userId)

      await expect(caller.mutation('dLSession.updateManyExtractedResources', {
        dLSessionId: uuid,
        extractedResources: [{
          id: 'extractedResource/1',
          labelIds: [uuid],
        }],
      })).rejects.toThrow('UPDATE MANY EXTRACTED RESOURCES ERROR')
      expect(DLSessionService.updateManyExtractedResources).toHaveBeenCalledWith({
        dLSessionId: uuid,
        extractedResources: [{
          id: 'extractedResource/1',
          labelIds: [uuid],
        }],
      }, isAdmin, userId)
    })
  })

  describe('WHEN accessing protected dLSession routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then dLSession route should throw errors', async () => {
      await expect(caller.mutation('dLSession.create', {
        name: 'DLSession 1',
        description: 'Description 1',
        priority: 1,
        sop: ['www.example.com'],
        projectId: randomUUID(),
        users: [
          {
            userId: 'auth0|test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
        labelIds: [randomUUID()],
      })).rejects.toThrow()
    })
  })
})
