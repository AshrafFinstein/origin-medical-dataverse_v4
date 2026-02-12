import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { ExtractedResource, Prisma, PrismaPromise } from '@prisma/client'
import { TYPE, container } from '../container'
import type { IExtractedResourceRepository } from '../infrastructures/database/repositories'
import type { ExtractedResourceCreateManyInput, ExtractedResourceCreateSingleInput, ExtractedResourceDeleteSingleInput, ExtractedResourceFindManyInput, ExtractedResourceFindSingleInput, ExtractedResourceUpdateManyInput, ExtractedResourceUpdateSingleInput } from '../trpc/routers/extractedResource'
import { db } from '../infrastructures/database'
import { ExtractedResourceService } from './'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN extractedResource service', () => {
  describe.each([
    [
      [
        {
          id: 'extractedResource/1',
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
          metadata: {},
          rawResourceId: randomUUID(),
        },
      ],
    ],
  ])('WHEN extractedResource repository is mocked to return valid results', (extractedResources: ExtractedResource[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<IExtractedResourceRepository>(TYPE.ExtractedResourceRepository).to(MockedExtractedResourceRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedExtractedResourceRepository implements IExtractedResourceRepository {
      findMany(): PrismaPromise<ExtractedResource[]> {
        return Promise.resolve(extractedResources) as PrismaPromise<ExtractedResource[]>
      }

      findOne(): Prisma.Prisma__ExtractedResourceClient<ExtractedResource | null> {
        return Promise.resolve(extractedResources[0]) as Prisma.Prisma__ExtractedResourceClient<ExtractedResource | null>
      }

      createMany(): PrismaPromise<{ count: number }> {
        return Promise.resolve({ count: 1 }) as PrismaPromise<{ count: 1 }>
      }

      createOne(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: extractedResources[0].id }) as PrismaPromise<{ id: string }>
      }

      updateOne(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: extractedResources[0].id }) as PrismaPromise<{ id: string }>
      }

      deleteOne(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: extractedResources[0].id }) as PrismaPromise<{ id: string }>
      }

      count(): PrismaPromise<number> {
        return Promise.resolve(extractedResources.length) as PrismaPromise<number>
      }

      label(): PrismaPromise<{ extractedResourceId: string; dLSessionId: string }> {
        return Promise.resolve({ extractedResourceId: extractedResources[0].id, dLSessionId: 'test' }) as PrismaPromise<{ extractedResourceId: string; dLSessionId: string }>
      }

      saveEvaluationResult(): PrismaPromise<{ extractedResourceId: string; cESessionId: string }> {
        return Promise.resolve({ extractedResourceId: extractedResources[0].id, cESessionId: 'test' }) as PrismaPromise<{ extractedResourceId: string; cESessionId: string }>
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
        } as ExtractedResourceFindManyInput,
      ],
    ])('THEN extractedResource service should returns valid results when finding many extractedResources with good inputs', async (input: ExtractedResourceFindManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([extractedResources, extractedResources.length])
      await expect(ExtractedResourceService.findMany(input)).resolves.toEqual([extractedResources, extractedResources.length])
    })

    test.each([
      [extractedResources[0].id],
    ])('THEN extractedResource service should returns valid results when finding one extractedResource with valid uuid', async (input: ExtractedResourceFindSingleInput) => {
      await expect(ExtractedResourceService.find(input)).resolves.toEqual(extractedResources[0])
    })

    test.each([
      [
        extractedResources.map(resource => ({
          id: resource.id,
          metadata: resource.metadata,
          rawResourceId: resource.rawResourceId,
        })) as ExtractedResourceCreateManyInput,
      ],
    ])('THEN extractedResource service should returns valid results when creating many extractedResources with good inputs', async (input: ExtractedResourceCreateManyInput) => {
      await expect(ExtractedResourceService.createMany(input)).resolves.toEqual({ count: 1 })
    })

    test.each([
      [
        {
          id: extractedResources[0].id,
          metadata: extractedResources[0].metadata,
          rawResourceId: extractedResources[0].rawResourceId,
        } as ExtractedResourceCreateSingleInput,
      ],
    ])('THEN extractedResource service should returns valid results when creating a new extractedResource with good inputs', async (input: ExtractedResourceCreateSingleInput) => {
      await expect(ExtractedResourceService.create(input)).resolves.toEqual({ id: extractedResources[0].id })
    })

    test.each([
      [
        extractedResources.map(resource => ({
          id: resource.id,
          metadata: {},
        })),
      ],
    ])('THEN extractedResource service should returns valid results when updating many extractedResources with good inputs', async (input: ExtractedResourceUpdateManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce(
        input.map(_ => ({
          id: randomUUID(),
        })),
      )
      await expect(ExtractedResourceService.updateMany(input)).resolves.toEqual({ count: 1 })
    })

    test.each([
      [
        {
          id: extractedResources[0].id,
          newId: 'New name',
          metadata: {},
        },
      ],
    ])('THEN extractedResource service should returns valid results when updating an extractedResource with good inputs', async (input: ExtractedResourceUpdateSingleInput) => {
      await expect(ExtractedResourceService.update(input)).resolves.toEqual({ id: extractedResources[0].id })
    })

    test.each([
      [extractedResources[0].id],
    ])('THEN extractedResource service should returns valid results when deleting an extractedResource with good inputs', async (input: ExtractedResourceDeleteSingleInput) => {
      await expect(ExtractedResourceService.delete(input)).resolves.toEqual({ id: extractedResources[0].id })
    })
  })
})
