import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { CESession, Prisma, PrismaPromise } from '@prisma/client'
import { SessionUserRole } from '@prisma/client'
import { TYPE, container } from '../container'
import type { ICESessionRepository } from '../infrastructures/database/repositories'
import type { CESessionCreateSingleInput, CESessionDeleteSingleInput, CESessionFindManyInput, CESessionFindSingleInput, CESessionSaveEvaluationResultInput, CESessionUpdateSingleInput } from '../trpc/routers/cESession'
import { db } from '../infrastructures/database'
import { CESessionService } from './'
import type { CESessionWithUsers } from '~/types/CESession'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN cESession service', () => {
  describe.each([
    [
      [
        {
          id: randomUUID(),
          name: 'CESession 1',
          description: 'Description 1',
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
          sop: ['www.example.com'],
          resultTemplate: {
            just: 'random',
          },
          priority: 1,
          projectId: randomUUID(),
        },
      ],
    ],
  ])('WHEN cESession repository is mocked to return valid results', (cESessions: CESession[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<ICESessionRepository>(TYPE.CESessionRepository).to(MockedCESessionRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedCESessionRepository implements ICESessionRepository {
      findMany(): PrismaPromise<CESessionWithUsers[]> {
        return Promise.resolve(cESessions.map(session => ({
          ...session,
          users: [
            {
              cESessionId: cESessions[0].id,
              userId: 'test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        }))) as PrismaPromise<CESessionWithUsers[]>
      }

      count(): PrismaPromise<number> {
        return Promise.resolve(cESessions.length) as PrismaPromise<number>
      }

      findOne(): Prisma.Prisma__CESessionClient<CESessionWithUsers | null> {
        return Promise.resolve({
          ...cESessions[0],
          users: [
            {
              cESessionId: cESessions[0].id,
              userId: 'test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        }) as Prisma.Prisma__CESessionClient<CESessionWithUsers | null>
      }

      create(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: cESessions[0].id }) as PrismaPromise<{ id: string }>
      }

      update(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: cESessions[0].id }) as PrismaPromise<{ id: string }>
      }

      delete(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: cESessions[0].id }) as PrismaPromise<{ id: string }>
      }

      saveEvaluationResult(): PrismaPromise<{ extractedResourceId: string }> {
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
            projectId: cESessions[0].projectId,
          },
          limit: 10,
          offset: 0,
        } as CESessionFindManyInput,
      ],
    ])('THEN cESession service should returns valid results when finding many cESessions with good inputs', async (input: CESessionFindManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([cESessions.map(session => ({
        ...session,
        users: [
          {
            cESessionId: cESessions[0].id,
            userId: 'test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })), cESessions.length])
      await expect(CESessionService.findMany(input, true, 'test')).resolves.toEqual([cESessions.map(session => ({
        ...session,
        users: [
          {
            cESessionId: cESessions[0].id,
            userId: 'test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })), cESessions.length])
    })

    test.each([
      [
        cESessions[0].id,
      ],
    ])('THEN cESession service should returns valid results when finding one cESession with valid uuid', async (input: CESessionFindSingleInput) => {
      await expect(CESessionService.find(input, true, 'test')).resolves.toEqual({
        ...cESessions[0],
        users: [
          {
            cESessionId: cESessions[0].id,
            userId: 'test',
            userRole: SessionUserRole.ACTIVITY,
          },
        ],
      })
    })

    test.each([
      [
        {
          name: cESessions[0].name,
          description: cESessions[0].description,
          priority: cESessions[0].priority,
          sop: ['www.example.com'],
          resultTemplate: {
            just: 'random',
          },
          projectId: cESessions[0].projectId,
          users: [
            {
              userId: 'test',
              userRole: SessionUserRole.ACTIVITY,
            },
          ],
        },
      ],
    ])('THEN cESession service should returns valid results when creating a new cESession with good inputs', async (input: CESessionCreateSingleInput) => {
      await expect(CESessionService.create(input, true, 'test')).resolves.toEqual({ id: cESessions[0].id })
    })

    test.each([
      [
        {
          id: cESessions[0].id,
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
    ])('THEN cESession service should returns valid results when updating an cESession with good inputs', async (input: CESessionUpdateSingleInput) => {
      await expect(CESessionService.update(input, true, 'test')).resolves.toEqual({ id: cESessions[0].id })
    })

    test.each([
      [cESessions[0].id],
    ])('THEN cESession service should returns valid results when deleting an cESession with good inputs', async (input: CESessionDeleteSingleInput) => {
      await expect(CESessionService.delete(input, true, 'test')).resolves.toEqual({ id: cESessions[0].id })
    })

    test.each([
      [
        {
          extractedResourceId: 'test.png',
          cESessionId: cESessions[0].id,
          result: {
            just: 'random',
          },
        },
      ],
    ])('THEN extractedResource service should returns valid results when saving evaluation result with good inputs', async (input: CESessionSaveEvaluationResultInput) => {
      await expect(CESessionService.saveEvaluationResult(input, true, 'test')).resolves.toEqual({ extractedResourceId: 'test.png' })
    })
  })
})
