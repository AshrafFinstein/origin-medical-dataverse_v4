import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { Label, Prisma, PrismaPromise } from '@prisma/client'
import { TYPE, container } from '../container'
import type { ILabelRepository } from '../infrastructures/database/repositories'
import type { LabelCreateManyInput, LabelCreateSingleInput, LabelDeleteSingleInput, LabelFindManyInput, LabelFindSingleInput, LabelUpdateSingleInput } from '../trpc/routes/label'
import { db } from '../infrastructures/database'
import { LabelService } from './'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN label service', () => {
  describe.each([
    [
      [
        {
          id: randomUUID(),
          name: 'Label 1',
          abbreviation: 'L1',
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        },
      ],
    ],
  ])('WHEN label repository is mocked to return valid results', (labels: Label[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<ILabelRepository>(TYPE.LabelRepository).to(MockedLabelRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedLabelRepository implements ILabelRepository {
      findMany(): PrismaPromise<Label[]> {
        return Promise.resolve(labels) as PrismaPromise<Label[]>
      }

      findOne(): Prisma.Prisma__LabelClient<Label | null> {
        return Promise.resolve(labels[0]) as Prisma.Prisma__LabelClient<Label | null>
      }

      createMany(): PrismaPromise<{ count: number }> {
        return Promise.resolve({ count: 1 }) as PrismaPromise<{ count: 1 }>
      }

      create(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: labels[0].id }) as PrismaPromise<{ id: string }>
      }

      update(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: labels[0].id }) as PrismaPromise<{ id: string }>
      }

      delete(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: labels[0].id }) as PrismaPromise<{ id: string }>
      }

      count(): PrismaPromise<number> {
        return Promise.resolve(labels.length) as PrismaPromise<number>
      }
    }

    test.each([
      [
        {
          sort: [
            {
              name: 'asc',
            },
            {
              createdAt: 'asc',
            },
          ],
          filter: {
            dLSessionId: randomUUID(),
          },
          limit: 10,
          offset: 0,
        } as LabelFindManyInput,
      ],
    ])('THEN label service should returns valid results when finding many labels with good inputs', async (input: LabelFindManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([labels, labels.length])
      await expect(LabelService.findMany(input)).resolves.toEqual([labels, labels.length])
    })

    test.each([
      [labels[0].id],
    ])('THEN label service should returns valid results when finding one label with valid uuid', async (input: LabelFindSingleInput) => {
      await expect(LabelService.find(input)).resolves.toEqual(labels[0])
    })

    test.each([
      [
        [
          {
            name: labels[0].name,
            abbreviation: labels[0].abbreviation,
          },
        ],
      ],
    ])('THEN label service should returns valid results when creating a new label with good inputs', async (input: LabelCreateManyInput) => {
      await expect(LabelService.createMany(input)).resolves.toEqual({ count: 1 })
    })

    test.each([
      [
        {
          name: labels[0].name,
          abbreviation: labels[0].abbreviation,
        },
      ],
    ])('THEN label service should returns valid results when creating a new label with good inputs', async (input: LabelCreateSingleInput) => {
      await expect(LabelService.create(input)).resolves.toEqual({ id: labels[0].id })
    })

    test.each([
      [
        {
          id: labels[0].id,
          name: 'New name',
          abbreviation: 'Updated abbreviation',
        },
      ],
    ])('THEN label service should returns valid results when update an label with good inputs', async (input: LabelUpdateSingleInput) => {
      await expect(LabelService.update(input)).resolves.toEqual({ id: labels[0].id })
    })

    test.each([
      [labels[0].id],
    ])('THEN label service should returns valid results when update an label with good inputs', async (input: LabelDeleteSingleInput) => {
      await expect(LabelService.delete(input)).resolves.toEqual({ id: labels[0].id })
    })
  })
})
