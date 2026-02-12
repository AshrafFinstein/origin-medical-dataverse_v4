import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { Epic } from '@prisma/client'
import { createContextInner, router } from '..'
import { EpicService } from '../../services'
import type { EpicCreateSingleInput, EpicDeleteSingleInput, EpicFindManyInput, EpicFindSingleInput, EpicUpdateSingleInput } from './epic'

await setup({
  server: true,
  browser: true,
})
const findManySpy = vi.spyOn(EpicService, 'findMany')
const findSpy = vi.spyOn(EpicService, 'find')
const createSpy = vi.spyOn(EpicService, 'create')
const updateSpy = vi.spyOn(EpicService, 'update')
const deleteSpy = vi.spyOn(EpicService, 'delete')

describe('GIVEN epic route', () => {
  describe.each([
    [
      [{
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      },
      {
        id: '2',
        name: 'Project 2',
        description: 'Description 2',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      },
      {
        id: '3',
        name: 'Project 3',
        description: 'Description 3',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      }],
    ],
  ])('WHEN epic service is mocked to find many valid epics', async (epics: Epic[]) => {
    beforeAll(() => {
      findManySpy.mockResolvedValue([epics, epics.length])
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    describe.each([
      [
        {
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
          limit: 2,
          offset: 10,
        },
      ],
    ])('AND querying route epic.list with good inputs', async (input: EpicFindManyInput) => {
      test('THEN epic route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('epic.list', input)).resolves.toEqual({
          data: epics,
          metadata: {
            limit: input?.limit,
            offset: input?.offset,
            totalCount: epics.length,
          },
        })
        expect(EpicService.findMany).toHaveBeenCalledWith(input)
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
    ])('AND querying route epic.list with bad inputs', async (input: any) => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('epic.list', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: '1',
      name: 'Project 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
    }],
  ])('WHEN epic service is mocked to find single valid epic', async (epic: Epic) => {
    beforeAll(() => {
      findSpy.mockResolvedValue(epic)
    })

    afterAll(() => {
      findSpy.mockClear()
    })

    describe.each([
      [randomUUID()],
    ])('AND querying route epic.one with good inputs', async (input: EpicFindSingleInput) => {
      test('THEN epic route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('epic.one', input)).resolves.toEqual(epic)
        expect(EpicService.find).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND querying route epic.one with bad inputs', async (input: any) => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('epic.one', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'Project 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
    }],
  ])('WHEN epic service is mocked to create valid epic', async (epic: Epic) => {
    beforeAll(() => {
      createSpy.mockResolvedValue(epic)
    })

    afterAll(() => {
      createSpy.mockClear()
    })

    describe.each([
      [
        {
          name: epic.name,
          description: epic.description,
        },
      ],
    ])('AND mutating route epic.create with good inputs', async (input: EpicCreateSingleInput) => {
      test('THEN epic route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.create', input)).resolves.toEqual(epic)
        expect(EpicService.create).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route epic.create with bad inputs', async (input: any) => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.create', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route epic.create with no authorization', async () => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.create', {
          name: 'Epic 1',
          description: 'Description 1',
        })).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'Project 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
    }],
  ])('WHEN epic service is mocked to update valid epic', async (epic: Epic) => {
    beforeAll(() => {
      updateSpy.mockResolvedValue(epic)
    })

    afterAll(() => {
      updateSpy.mockClear()
    })

    describe.each([
      [{
        id: epic.id,
        name: 'New',
        description: 'New',
      }],
    ])('AND mutating route epic.create with good inputs', async (input: EpicUpdateSingleInput) => {
      test('THEN epic route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.update', input)).resolves.toEqual(epic)
        expect(EpicService.update).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route epic.update with bad inputs', async (input: any) => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.update', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route epic.update with no authorization', async () => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.update', {
          id: randomUUID(),
          name: 'Epic 1',
          description: 'Description 1',
        })).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'Project 1',
      description: 'Description 1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
    }],
  ])('WHEN epic service is mocked to delete valid epic', async (epic: Epic) => {
    beforeAll(() => {
      deleteSpy.mockResolvedValue(epic)
    })

    afterAll(() => {
      deleteSpy.mockClear()
    })

    describe.each([
      [epic.id],
    ])('AND mutating route epic.delete with good inputs', async (input: EpicDeleteSingleInput) => {
      test('THEN epic route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.delete', input)).resolves.toEqual(epic)
        expect(EpicService.delete).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route epic.delete with bad inputs', async (input: any) => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.delete', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route epic.delete with no authorization', async () => {
      test('THEN epic route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('epic.delete', randomUUID())).rejects.toThrow()
      })
    })
  })

  describe('WHEN epic service is mocked to throw an error', async () => {
    beforeAll(() => {
      findManySpy.mockRejectedValue(new Error('FIND MANY ERROR'))
      findSpy.mockRejectedValue(new Error('FIND SINGLE ERROR'))
      createSpy.mockRejectedValue(new Error('CREATE ERROR'))
      updateSpy.mockRejectedValue(new Error('UPDATE ERROR'))
      deleteSpy.mockRejectedValue(new Error('DELETE ERROR'))
    })

    afterAll(() => {
      findManySpy.mockClear()
      findSpy.mockClear()
      createSpy.mockClear()
      updateSpy.mockClear()
      deleteSpy.mockClear()
    })

    test('THEN epic route should throw an error', async () => {
      const ctx = await createContextInner({
        user: {
          'id': '1',
          'https://www.originhealth.ai/roles': ['dataverse-admin'],
        },
      })
      const caller = router.createCaller(ctx)
      const uuid = randomUUID()
      const epic = {
        name: 'Project 1',
        description: 'Description 1',
      }

      await expect(caller.query('epic.list')).rejects.toThrow('FIND MANY ERROR')
      expect(EpicService.findMany).toHaveBeenCalled()

      await expect(caller.query('epic.one', uuid)).rejects.toThrow('FIND SINGLE ERROR')
      expect(EpicService.find).toHaveBeenCalledWith(uuid)

      await expect(caller.mutation('epic.create', epic)).rejects.toThrow('CREATE ERROR')
      expect(EpicService.create).toHaveBeenCalledWith(epic)

      await expect(caller.mutation('epic.update', {
        id: uuid,
        ...epic,
      })).rejects.toThrow('UPDATE ERROR')
      expect(EpicService.update).toHaveBeenCalledWith({
        id: uuid,
        ...epic,
      })

      await expect(caller.mutation('epic.delete', uuid)).rejects.toThrow('DELETE ERROR')
      expect(EpicService.delete).toHaveBeenCalledWith(uuid)
    })
  })

  describe('WHEN accessing protected epic routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then epic route should throw errors', async () => {
      await expect(caller.query('epic.list')).rejects.toThrow()
      await expect(caller.query('epic.one', '1')).rejects.toThrow()
      await expect(caller.mutation('epic.create', {
        name: 'Project 1',
        description: 'Description 1',
      })).rejects.toThrow()
      await expect(caller.mutation('epic.update', {
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
      })).rejects.toThrow()
      await expect(caller.mutation('epic.delete', '1')).rejects.toThrow()
    })
  })
})
