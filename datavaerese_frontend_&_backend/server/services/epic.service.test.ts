import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { Epic, Prisma, PrismaPromise } from '@prisma/client'
import { TYPE, container } from '../container'
import type { IEpicRepository } from '../infrastructures/database/repositories'
import type { EpicCreateSingleInput, EpicDeleteSingleInput, EpicFindManyInput, EpicFindSingleInput, EpicUpdateSingleInput } from '../trpc/routers/epic'
import { db } from '../infrastructures/database'
import { EpicService } from './'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN epic service', () => {
  describe.each([
    [
      [
        {
          id: randomUUID(),
          name: 'Epic 1',
          description: 'Description 1',
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        },
      ],
    ],
  ])('WHEN epic repository is mocked to return valid results', (epics: Epic[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<IEpicRepository>(TYPE.EpicRepository).to(MockedEpicRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedEpicRepository implements IEpicRepository {
      findMany(): PrismaPromise<Epic[]> {
        return Promise.resolve(epics) as PrismaPromise<Epic[]>
      }

      count(): PrismaPromise<number> {
        return Promise.resolve(epics.length) as PrismaPromise<number>
      }

      findOne(): Prisma.Prisma__EpicClient<Epic | null> {
        return Promise.resolve(epics[0]) as Prisma.Prisma__EpicClient<Epic | null>
      }

      create(): PrismaPromise<Epic> {
        return Promise.resolve(epics[0]) as PrismaPromise<Epic>
      }

      update(): PrismaPromise<Epic> {
        return Promise.resolve(epics[0]) as PrismaPromise<Epic>
      }

      delete(): PrismaPromise<Epic> {
        return Promise.resolve(epics[0]) as PrismaPromise<Epic>
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
          limit: 10,
          offset: 0,
        } as EpicFindManyInput,
      ],
    ])('THEN epic service should returns valid results when finding many epics with good inputs', async (input: EpicFindManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([epics, epics.length])
      await expect(EpicService.findMany(input)).resolves.toEqual([epics, epics.length])
    })

    test.each([
      [epics[0].id],
    ])('THEN epic service should returns valid results when finding one epic with valid uuid', async (input: EpicFindSingleInput) => {
      await expect(EpicService.find(input)).resolves.toEqual(epics[0])
    })

    test.each([
      [
        {
          name: epics[0].name,
          description: epics[0].description,
        },
      ],
    ])('THEN epic service should returns valid results when creating a new epic with good inputs', async (input: EpicCreateSingleInput) => {
      await expect(EpicService.create(input)).resolves.toEqual(epics[0])
    })

    test.each([
      [
        {
          id: epics[0].id,
          name: 'New name',
          description: 'Updated description',
        },
      ],
    ])('THEN epic service should returns valid results when update an epic with good inputs', async (input: EpicUpdateSingleInput) => {
      await expect(EpicService.update(input)).resolves.toEqual(epics[0])
    })

    test.each([
      [epics[0].id],
    ])('THEN epic service should returns valid results when update an epic with good inputs', async (input: EpicDeleteSingleInput) => {
      await expect(EpicService.delete(input)).resolves.toEqual(epics[0])
    })
  })
})
