import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { Prisma, PrismaPromise, Project } from '@prisma/client'
import { ProjectUserRole } from '@prisma/client'
import { TYPE, container } from '../container'
import type { IProjectRepository } from '../infrastructures/database/repositories'
import type { ProjectCreateSingleInput, ProjectDeleteSingleInput, ProjectFindManyInput, ProjectFindSingleInput, ProjectUpdateSingleInput } from '../trpc/routers/project'
import { db } from '../infrastructures/database'
import { ProjectService } from './'
import type { ProjectWithUsers } from '~/types/Project'

await setup({
  server: true,
  browser: true,
})

describe('GIVEN project service', () => {
  describe.each([
    [
      [
        {
          id: randomUUID(),
          name: 'Project 1',
          description: 'Description 1',
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
          epicId: randomUUID(),
        },
      ],
    ],
  ])('WHEN project repository is mocked to return valid results', (projects: Project[]) => {
    beforeEach(() => {
      container.snapshot()
      container.rebind<IProjectRepository>(TYPE.ProjectRepository).to(MockedProjectRepository)
    })

    afterEach(() => {
      container.restore()
    })

    class MockedProjectRepository implements IProjectRepository {
      findMany(): PrismaPromise<ProjectWithUsers[]> {
        return Promise.resolve(projects) as PrismaPromise<ProjectWithUsers[]>
      }

      count(): PrismaPromise<number> {
        return Promise.resolve(projects.length) as PrismaPromise<number>
      }

      findOne(): Prisma.Prisma__ProjectClient<ProjectWithUsers | null> {
        return Promise.resolve(projects[0]) as Prisma.Prisma__ProjectClient<ProjectWithUsers | null>
      }

      create(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: projects[0].id }) as PrismaPromise<{ id: string }>
      }

      update(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: projects[0].id }) as PrismaPromise<{ id: string }>
      }

      delete(): PrismaPromise<{ id: string }> {
        return Promise.resolve({ id: projects[0].id }) as PrismaPromise<{ id: string }>
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
            epicId: projects[0].epicId,
          },
          limit: 10,
          offset: 0,
        } as ProjectFindManyInput,
      ],
    ])('THEN project service should returns valid results when finding many projects with good inputs', async (input: ProjectFindManyInput) => {
      vi.spyOn(db, '$transaction').mockResolvedValueOnce([projects, projects.length])
      await expect(ProjectService.findMany(input, true)).resolves.toEqual([projects, projects.length])
    })

    test.each([
      [projects[0].id],
    ])('THEN project service should returns valid results when finding one project with valid uuid', async (input: ProjectFindSingleInput) => {
      await expect(ProjectService.find(input, true)).resolves.toEqual(projects[0])
    })

    test.each([
      [
        {
          name: projects[0].name,
          description: projects[0].description,
          epicId: projects[0].epicId,
          users: [
            {
              userId: '1',
              userRole: ProjectUserRole.NORMAL,
            },
          ],
        },
      ],
    ])('THEN project service should returns valid results when creating a new project with good inputs', async (input: ProjectCreateSingleInput) => {
      await expect(ProjectService.create(input)).resolves.toEqual({ id: projects[0].id })
    })

    test.each([
      [
        {
          id: projects[0].id,
          name: 'New name',
          description: 'Updated description',
          users: [
            {
              userId: '1',
              userRole: ProjectUserRole.NORMAL,
            },
            {
              userId: '2',
              userRole: ProjectUserRole.PROJECT_MASTER,
            },
          ],
        },
      ],
    ])('THEN project service should returns valid results when update an project with good inputs', async (input: ProjectUpdateSingleInput) => {
      await expect(ProjectService.update(input, true)).resolves.toEqual({ id: projects[0].id })
    })

    test.each([
      [projects[0].id],
    ])('THEN project service should returns valid results when update an project with good inputs', async (input: ProjectDeleteSingleInput) => {
      await expect(ProjectService.delete(input, true)).resolves.toEqual({ id: projects[0].id })
    })
  })
})
