import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { Project } from '@prisma/client'
import { ProjectUserRole } from '@prisma/client'
import { createContextInner, router } from '..'
import { ProjectService } from '../../services'
import type { ProjectCreateSingleInput, ProjectDeleteSingleInput, ProjectFindManyInput, ProjectFindSingleInput, ProjectUpdateSingleInput } from './project'
import type { ProjectWithUsers } from '~/types/Project'

await setup({
  server: true,
  browser: true,
})
const findManySpy = vi.spyOn(ProjectService, 'findMany')
const findSpy = vi.spyOn(ProjectService, 'find')
const createSpy = vi.spyOn(ProjectService, 'create')
const updateSpy = vi.spyOn(ProjectService, 'update')
const deleteSpy = vi.spyOn(ProjectService, 'delete')

describe('GIVEN project route', () => {
  describe.each([
    [
      [{
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        epicId: randomUUID(),
        users: [
          {
            projectId: '1',
            userId: 'test',
            userRole: ProjectUserRole.PROJECT_MASTER,
          },
        ],
      },
      {
        id: '2',
        name: 'Project 2',
        description: 'Description 2',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        epicId: randomUUID(),
        users: [
          {
            projectId: '2',
            userId: 'test',
            userRole: ProjectUserRole.PROJECT_MASTER,
          },
        ],
      },
      {
        id: '3',
        name: 'Project 3',
        description: 'Description 3',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        epicId: randomUUID(),
        users: [
          {
            projectId: '3',
            userId: 'test',
            userRole: ProjectUserRole.PROJECT_MASTER,
          },
        ],
      }],
    ],
  ])('WHEN project service is mocked to find many valid projects', async (projects: ProjectWithUsers[]) => {
    beforeAll(() => {
      findManySpy.mockResolvedValue([projects, projects.length])
    })

    afterAll(() => {
      findManySpy.mockClear()
    })

    describe.each([
      [
        {
          filter: {
            epicId: projects[0].epicId,
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
            epicId: projects[1].epicId,
          },
          limit: 2,
          offset: 10,
        },
      ],
    ])('AND querying route project.list with good inputs', async (input: ProjectFindManyInput) => {
      test('THEN project route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('project.list', input)).resolves.toEqual({
          data: projects,
          metadata: {
            limit: input?.limit,
            offset: input?.offset,
            totalCount: projects.length,
          },
        })
        expect(ProjectService.findMany).toHaveBeenCalledWith(input, false)
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
    ])('AND querying route project.list with bad inputs', async (input: any) => {
      test('THEN project route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('project.list', input)).rejects.toThrow()
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
      epicId: randomUUID(),
      users: [
        {
          projectId: '1',
          userId: 'test',
          userRole: ProjectUserRole.PROJECT_MASTER,
        },
      ],
    }],
  ])('WHEN project service is mocked to find single valid project', async (project: ProjectWithUsers) => {
    beforeAll(() => {
      findSpy.mockResolvedValue(project)
    })

    afterAll(() => {
      findSpy.mockClear()
    })

    describe.each([
      [randomUUID()],
    ])('AND querying route project.one with good inputs', async (input: ProjectFindSingleInput) => {
      test('THEN project route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('project.one', input)).resolves.toEqual(project)
        expect(ProjectService.find).toHaveBeenCalledWith(input, false)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND querying route project.one with bad inputs', async (input: any) => {
      test('THEN project route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.query('project.one', input)).rejects.toThrow()
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
      epicId: randomUUID(),
    }],
  ])('WHEN project service is mocked to create valid project', async (project: Project) => {
    beforeAll(() => {
      createSpy.mockResolvedValue(project)
    })

    afterAll(() => {
      createSpy.mockClear()
    })

    describe.each([
      [
        {
          name: project.name,
          description: project.description,
          users: [
            {
              userId: 'auth0|test',
              userRole: ProjectUserRole.NORMAL,
            },
          ],
          epicId: randomUUID(),
        },
      ],
    ])('AND mutating route project.create with good inputs', async (input: ProjectCreateSingleInput) => {
      test('THEN project route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.create', input)).resolves.toEqual(project)
        expect(ProjectService.create).toHaveBeenCalledWith(input)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route project.create with bad inputs', async (input: any) => {
      test('THEN project route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.create', input)).rejects.toThrow()
      })
    })

    describe('AND mutating route project.create with no authorization', async () => {
      test('THEN project route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            id: '1',
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.create', {
          name: 'Project 1',
          description: 'Description 1',
          users: [
            {
              userId: 'auth0|test',
              userRole: ProjectUserRole.NORMAL,
            },
          ],
          epicId: randomUUID(),
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
      epicId: randomUUID(),
    }],
  ])('WHEN project service is mocked to update valid project', async (project: Project) => {
    beforeAll(() => {
      updateSpy.mockResolvedValue(project)
    })

    afterAll(() => {
      updateSpy.mockClear()
    })

    describe.each([
      [
        {
          id: project.id,
          name: 'New',
          description: 'New',
          users: [
            {
              userId: 'auth0|test',
              userRole: ProjectUserRole.NORMAL,
            },
            {
              userId: 'auth0|test2',
              userRole: ProjectUserRole.LEAD_ANALYST,
            },
          ],
          epicId: randomUUID(),
        },
      ],
    ])('AND mutating route project.create with good inputs', async (input: ProjectUpdateSingleInput) => {
      test('THEN project route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.update', input)).resolves.toEqual(project)
        expect(ProjectService.update).toHaveBeenCalledWith(input, true)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route project.update with bad inputs', async (input: any) => {
      test('THEN project route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.update', input)).rejects.toThrow()
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
      epicId: randomUUID(),
    }],
  ])('WHEN project service is mocked to delete valid project', async (project: Project) => {
    beforeAll(() => {
      deleteSpy.mockResolvedValue(project)
    })

    afterAll(() => {
      deleteSpy.mockClear()
    })

    describe.each([
      [project.id],
    ])('AND mutating route project.delete with good inputs', async (input: ProjectDeleteSingleInput) => {
      test('THEN project route should return valid results', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.delete', input)).resolves.toEqual(project)
        expect(ProjectService.delete).toHaveBeenCalledWith(input, true)
      })
    })

    describe.each([
      [0], [{ random: 'random' }], [{ id: 'wrong input' }],
    ])('AND mutating route project.delete with bad inputs', async (input: any) => {
      test('THEN project route should throw error', async () => {
        const ctx = await createContextInner({
          user: {
            'id': '1',
            'https://www.originhealth.ai/roles': ['dataverse-admin'],
          },
        })
        const caller = router.createCaller(ctx)
        await expect(caller.mutation('project.delete', input)).rejects.toThrow()
      })
    })
  })

  describe('WHEN project service is mocked to throw an error', async () => {
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

    test('THEN project route should throw an error', async () => {
      const ctx = await createContextInner({
        user: {
          'id': '1',
          'https://www.originhealth.ai/roles': ['dataverse-admin'],
        },
      })
      const caller = router.createCaller(ctx)
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles'].includes('dataverse-admin')
      const uuid = randomUUID()
      const project = {
        name: 'Project 1',
        description: 'Description 1',
        users: [
          {
            userId: 'auth0|test',
            userRole: ProjectUserRole.NORMAL,
          },
        ],
        epicId: uuid,
      }

      await expect(caller.query('project.list', {
        filter: {
          epicId: uuid,
        },
      })).rejects.toThrow('FIND MANY ERROR')
      expect(ProjectService.findMany).toHaveBeenCalledWith({
        filter: {
          epicId: uuid,
        },
      }, isAdmin)

      await expect(caller.query('project.one', uuid)).rejects.toThrow('FIND SINGLE ERROR')
      expect(ProjectService.find).toHaveBeenCalledWith(uuid, isAdmin)

      await expect(caller.mutation('project.create', project)).rejects.toThrow('CREATE ERROR')
      expect(ProjectService.create).toHaveBeenCalledWith(project)

      await expect(caller.mutation('project.update', {
        id: uuid,
        ...project,
      })).rejects.toThrow('UPDATE ERROR')
      expect(ProjectService.update).toHaveBeenCalledWith({
        id: uuid,
        ...project,
      }, isAdmin)

      await expect(caller.mutation('project.delete', uuid)).rejects.toThrow('DELETE ERROR')
      expect(ProjectService.delete).toHaveBeenCalledWith(uuid, isAdmin)
    })
  })

  describe('WHEN accessing protected project routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then project route should throw errors', async () => {
      await expect(caller.mutation('project.create', {
        name: 'Project 1',
        description: 'Description 1',
        users: [
          {
            userId: 'auth0|test',
            userRole: ProjectUserRole.NORMAL,
          },
        ],
        epicId: randomUUID(),
      })).rejects.toThrow()
    })
  })
})
