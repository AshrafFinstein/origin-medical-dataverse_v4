import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { DLSession, Label, Prisma, PrismaPromise } from '@prisma/client'
import { ExtractedResourceStatus, SessionUserRole } from '@prisma/client'

import { TYPE, container } from '../container'
import type { IDLSessionRepository } from '../infrastructures/database/repositories'
import type { DLSessionCreateSingleInput, DLSessionDeleteSingleInput, DLSessionFindManyInput, DLSessionFindSingleInput, DLSessionLinkExtractedResourcesInput, DLSessionUpdateManyExtractedResourcesInput, DLSessionUpdateSingleInput } from '../trpc/routers/dLSession'
import { db } from '../infrastructures/database'
import { DLSessionService } from './'
import type { DLSessionWithLabelsAndUsers, DLSessionWithUsers } from '~/types/DLSession'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN dLSession service', () => {
  describe.each([
    [
      [
        {
          id: randomUUID(),
          name: 'DLSession 1',
          description: 'Description 1',
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
          priority: 1,
          sop: ['www.example.com'],
          projectId: randomUUID(),
        },
      ],
    ],
  ])('WHEN dLSession repository is mocked to return valid results', (dLSessions: DLSession[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<IDLSessionRepository>(TYPE.DLSessionRepository).to(MockedDLSessionRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedDLSessionRepository implements IDLSessionRepository {
      findMany(): PrismaPromise<DLSessionWithUsers[]> {
        return Promise.resolve(dLSessions.map(session => ({
          ...session,
          users: [
            {
              dLSessionId: dLSessions[0].id,
              userId: 'test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        }))) as PrismaPromise<DLSessionWithUsers[]>
      }

      count(): PrismaPromise<number> {
        return Promise.resolve(dLSessions.length) as PrismaPromise<number>
      }

      findOne(): Prisma.Prisma__DLSessionClient<DLSessionWithLabelsAndUsers | null> {
        return Promise.resolve({
          ...dLSessions[0],
          labels: [] as {
            label: Label
          }[],
          users: [
            {
              dLSessionId: dLSessions[0].id,
              userId: 'test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        }) as Prisma.Prisma__DLSessionClient<DLSessionWithLabelsAndUsers | null>
      }

      create(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: dLSessions[0].id }) as PrismaPromise<{ id: string }>
      }

      update(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: dLSessions[0].id }) as PrismaPromise<{ id: string }>
      }

      delete(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: dLSessions[0].id }) as PrismaPromise<{ id: string }>
      }

      createManyExtractedResources() {
        return Promise.resolve({ count: 1 }) as PrismaPromise<{ count: number }>
      }

      createManyLabelsInExtractedResources() {
        return Promise.resolve({ count: 1 }) as PrismaPromise<{ count: number }>
      }

      updateExtractedResource(): PrismaPromise<{ extractedResourceId: string }> {
        return Promise.resolve({ extractedResourceId: 'test.png' }) as PrismaPromise<{ extractedResourceId: string }>
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
            projectId: dLSessions[0].projectId,
          },
          limit: 10,
          offset: 0,
        } as DLSessionFindManyInput,
      ],
    ])('THEN dLSession service should returns valid results when finding many dLSessions with good inputs', async (input: DLSessionFindManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([dLSessions.map(session => ({
        ...session,
        users: [
          {
            dLSessionId: dLSessions[0].id,
            userId: 'test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })), dLSessions.length])
      await expect(DLSessionService.findMany(input, true, 'test')).resolves.toEqual([dLSessions.map(session => ({
        ...session,
        users: [
          {
            dLSessionId: dLSessions[0].id,
            userId: 'test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })), dLSessions.length])
    })

    test.each([
      [
        dLSessions[0].id,
      ],
    ])('THEN dLSession service should returns valid results when finding one dLSession with valid uuid', async (input: DLSessionFindSingleInput) => {
      await expect(DLSessionService.find(input, true, 'test')).resolves.toEqual({
        ...dLSessions[0],
        labels: [],
        users: [
          {
            dLSessionId: dLSessions[0].id,
            userId: 'test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })
    })

    test.each([
      [
        {
          name: dLSessions[0].name,
          description: dLSessions[0].description,
          priority: dLSessions[0].priority,
          sop: dLSessions[0].sop,
          projectId: dLSessions[0].projectId,
          users: [
            {
              userId: 'test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
          labelIds: ['test'] as [string, ...string[]],
        },
      ],
    ])('THEN dLSession service should returns valid results when creating a new dLSession with good inputs', async (input: DLSessionCreateSingleInput) => {
      await expect(DLSessionService.create(input, true, 'test')).resolves.toEqual({ id: dLSessions[0].id })
    })

    test.each([
      [
        {
          id: dLSessions[0].id,
          name: 'New name',
          description: 'Updated description',
          users: [
            {
              userId: '1',
              userRole: SessionUserRole.ACTIVITY,
            },
            {
              userId: '2',
              userRole: SessionUserRole.QUALITY_CONTROLLER,
            },
          ],
        },
      ],
    ])('THEN dLSession service should returns valid results when update an dLSession with good inputs', async (input: DLSessionUpdateSingleInput) => {
      await expect(DLSessionService.update(input, true, 'test')).resolves.toEqual({ id: dLSessions[0].id })
    })

    test.each([
      [dLSessions[0].id],
    ])('THEN dLSession service should returns valid results when deleting an dLSession with good inputs', async (input: DLSessionDeleteSingleInput) => {
      await expect(DLSessionService.delete(input, true, 'test')).resolves.toEqual({ id: dLSessions[0].id })
    })

    test.each([
      [
        {
          dLSessionId: randomUUID(),
          extractedResources: [{
            id: 'test.png',
            labelIds: [randomUUID()],
          }],
        },
      ],
    ])('THEN extractedResource service should returns valid results when linking many extractedResources with good inputs', async (input: DLSessionLinkExtractedResourcesInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([1, 1])
      await expect(DLSessionService.linkExtractedResources(input, true, 'test')).resolves.toEqual([1, 1])
    })

    test.each([
      [
        {
          dLSessionId: randomUUID(),
          extractedResources: [{
            id: 'test.png',
            labelIds: [randomUUID()],
            status: ExtractedResourceStatus.ACCEPTED,
          }],
        },
      ],
    ])('THEN extractedResource service should returns valid results when updating many extractedResources with good inputs', async (input: DLSessionUpdateManyExtractedResourcesInput) => {
      await expect(DLSessionService.updateManyExtractedResources(input, true, 'test')).resolves.toEqual([{ extractedResourceId: 'test.png' }])
    })
  })
})
