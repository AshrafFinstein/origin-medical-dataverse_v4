import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { Label } from '@prisma/client'
import { createContextInner, router } from '..'
import { LabelService } from '../../services'
import type { LabelCreateManyInput, LabelCreateSingleInput, LabelDeleteSingleInput, LabelFindManyInput, LabelFindSingleInput, LabelUpdateSingleInput } from './label'

await setup({
  server: true,
  browser: true,
})
const findManySpy = vi.spyOn(LabelService, 'findMany')
const findSpy = vi.spyOn(LabelService, 'find')
const createManySpy = vi.spyOn(LabelService, 'createMany')
const createSpy = vi.spyOn(LabelService, 'create')
const updateSpy = vi.spyOn(LabelService, 'update')
const deleteSpy = vi.spyOn(LabelService, 'delete')

describe('GIVEN label route', () => {
  describe.each([
    [
      [{
        id: '1',
        name: 'Label 1',
        abbreviation: 'L1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      },
      {
        id: '2',
        name: 'Label 2',
        abbreviation: 'L2',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      },
      {
        id: '3',
        name: 'Label 3',
        abbreviation: 'L3',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      }],
    ],
  ])('WHEN label service is mocked to find many valid labels', async (labels: Label[]) => {
    beforeAll(() => {
      findManySpy.mockResolvedValue([labels, labels.length])
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    describe.each([
      [
        {
          filter: {
            dLSessionId: randomUUID(),
            extractedResourceId: randomUUID(),
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
            dLSessionId: randomUUID(),
          },
          limit: 2,
          offset: 10,
        },
      ],
    ])('AND querying route label.list with good inputs', async (input: LabelFindManyInput) => {
      test('THEN label route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('label.list', input)).resolves.toEqual({
          data: labels,
          metadata: {
            limit: input?.limit,
            offset: input?.offset,
            totalCount: labels.length,
          },
        })
        expect(LabelService.findMany).toHaveBeenCalledWith(input)
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
    ])('AND querying route label.list with bad inputs', async (input: any) => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('label.list', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: '1',
      name: 'Label 1',
      abbreviation: 'L1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
    }],
  ])('WHEN label service is mocked to find single valid label', async (label: Label) => {
    beforeAll(() => {
      findSpy.mockResolvedValue(label)
    })

    afterAll(() => {
      findSpy.mockClear()
    })

    describe.each([
      [randomUUID()],
    ])('AND querying route label.one with good inputs', async (input: LabelFindSingleInput) => {
      test('THEN label route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('label.one', input)).resolves.toEqual(label)
        expect(LabelService.find).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND querying route label.one with bad inputs', async (input: any) => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('label.one', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'Label 1',
      abbreviation: 'L1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
    }],
  ])('WHEN label service is mocked to create valid label', async (label: Label) => {
    beforeAll(() => {
      createSpy.mockResolvedValue({
        id: label.id,
      })
    })

    afterAll(() => {
      createSpy.mockClear()
    })

    describe.each([
      [
        {
          name: label.name,
          abbreviation: label.abbreviation,
        },
      ],
    ])('AND mutating route label.create with good inputs', async (input: LabelCreateSingleInput) => {
      test('THEN label route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.create', input)).resolves.toEqual({
          id: label.id,
        })
        expect(LabelService.create).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route label.create with bad inputs', async (input: any) => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.create', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route label.create with no authorization', async () => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.create', {
          name: 'Label 1',
          abbreviation: 'L1',
        })).rejects.toThrow()
      })
    })
  })

  describe.each([
    [
      {
        id: randomUUID(),
        name: 'Label 1',
        abbreviation: 'L1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      },
    ],
  ])('WHEN label service is mocked to create many valid labels', async (label: Label) => {
    beforeAll(() => {
      createManySpy.mockResolvedValue(
        {
          count: 1,
        },
      )
    })

    afterAll(() => {
      createManySpy.mockClear()
    })

    describe.each([
      [
        [
          {
            name: label.name,
            abbreviation: label.abbreviation,
          },
        ],
      ],
    ])('AND mutating route label.create-many with good inputs', async (input: LabelCreateManyInput) => {
      test('THEN label route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.create-many', input)).resolves.toEqual({
          count: 1,
        })
        expect(LabelService.createMany).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route label.create-many with bad inputs', async (input: any) => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.create-many', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route label.create-many with no authorization', async () => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.create-many', [{
          name: 'Label 1',
          abbreviation: 'L1',
        }])).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'Label 1',
      abbreviation: 'L1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      dLSessionId: randomUUID(),
    }],
  ])('WHEN label service is mocked to update valid label', async (label: Label) => {
    beforeAll(() => {
      updateSpy.mockResolvedValue({
        id: label.id,
      })
    })

    afterAll(() => {
      updateSpy.mockClear()
    })

    describe.each([
      [
        {
          id: label.id,
          name: 'New',
          abbreviation: 'New',
        },
      ],
    ])('AND mutating route label.update with good inputs', async (input: LabelUpdateSingleInput) => {
      test('THEN label route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.update', input)).resolves.toEqual({
          id: label.id,
        })
        expect(LabelService.update).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route label.update with bad inputs', async (input: any) => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.update', input)).rejects.toThrow()
      })
    })
  })

  describe.each([
    [{
      id: randomUUID(),
      name: 'Label 1',
      abbreviation: 'L1',
      createdAt: new Date('2022-05-20T11:14:01.257Z'),
      updatedAt: new Date('2022-05-20T11:14:01.257Z'),
      dLSessionId: randomUUID(),
    }],
  ])('WHEN label service is mocked to delete valid label', async (label: Label) => {
    beforeAll(() => {
      deleteSpy.mockResolvedValue({
        id: label.id,
      })
    })

    afterAll(() => {
      deleteSpy.mockClear()
    })

    describe.each([
      [label.id],
    ])('AND mutating route label.delete with good inputs', async (input: LabelDeleteSingleInput) => {
      test('THEN label route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.delete', input)).resolves.toEqual({
          id: label.id,
        })
        expect(LabelService.delete).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route label.delete with bad inputs', async (input: any) => {
      test('THEN label route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('label.delete', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN label service is mocked to throw an error', async () => {
    beforeAll(() => {
      findManySpy.mockRejectedValue(new Error('FIND MANY ERROR'))
      findSpy.mockRejectedValue(new Error('FIND SINGLE ERROR'))
      createManySpy.mockRejectedValue(new Error('CREATE MANY ERROR'))
      createSpy.mockRejectedValue(new Error('CREATE ERROR'))
      updateSpy.mockRejectedValue(new Error('UPDATE ERROR'))
      deleteSpy.mockRejectedValue(new Error('DELETE ERROR'))
    })

    afterAll(() => {
      findManySpy.mockClear()
      findSpy.mockClear()
      createManySpy.mockClear()
      createSpy.mockClear()
      updateSpy.mockClear()
      deleteSpy.mockClear()
    })

    test('THEN label route should throw an error', async () => {
      const ctx = await createContextInner({
        user: {
          'id': '1',
          'https://www.originhealth.ai/roles': ['dataverse-admin'],
        },
      })
      const caller = router.createCaller(ctx)
      const uuid = randomUUID()
      const label = {
        name: 'Label 1',
        abbreviation: 'L1',
      }

      await expect(caller.query('label.list', {
        filter: {
          dLSessionId: uuid,
        },
      })).rejects.toThrow('FIND MANY ERROR')
      expect(LabelService.findMany).toHaveBeenCalledWith({
        filter: {
          dLSessionId: uuid,
        },
      })

      await expect(caller.query('label.one', uuid)).rejects.toThrow('FIND SINGLE ERROR')
      expect(LabelService.find).toHaveBeenCalledWith(uuid)

      await expect(caller.mutation('label.create', label)).rejects.toThrow('CREATE ERROR')
      expect(LabelService.create).toHaveBeenCalledWith(label)

      await expect(caller.mutation('label.create-many', [label])).rejects.toThrow('CREATE MANY ERROR')
      expect(LabelService.createMany).toHaveBeenCalledWith([label])

      await expect(caller.mutation('label.update', {
        id: uuid,
        ...label,
      })).rejects.toThrow('UPDATE ERROR')
      expect(LabelService.update).toHaveBeenCalledWith({
        id: uuid,
        ...label,
      })

      await expect(caller.mutation('label.delete', uuid)).rejects.toThrow('DELETE ERROR')
      expect(LabelService.delete).toHaveBeenCalledWith(uuid)
    })
  })

  describe('WHEN accessing protected label routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then label route should throw errors', async () => {
      await expect(caller.mutation('label.create', {
        name: 'Label 1',
        abbreviation: 'L1',
      })).rejects.toThrow()

      await expect(caller.mutation('label.create-many', [{
        name: 'Label 1',
        abbreviation: 'L1',
      }])).rejects.toThrow()

      await expect(caller.mutation('label.update', {
        id: randomUUID(),
        name: 'Label 1',
        abbreviation: 'L1',
      })).rejects.toThrow()

      await expect(caller.mutation('label.delete', randomUUID())).rejects.toThrow()
    })
  })
})
