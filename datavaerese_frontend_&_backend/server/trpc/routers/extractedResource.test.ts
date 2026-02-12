import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import type { ExtractedResource } from '@prisma/client'
import { createContextInner, router } from '..'
import { ExtractedResourceService } from '../../services'
import type {
  ExtractedResourceCreateManyInput,
  ExtractedResourceCreateSingleInput,
  ExtractedResourceDeleteSingleInput,
  ExtractedResourceFindSingleInput,
  ExtractedResourceUpdateManyInput,
  ExtractedResourceUpdateSingleInput,
} from './extractedResource'

await setup({
  server: true,
  browser: true,
})

const findSpy = vi.spyOn(ExtractedResourceService, 'find')
const findManySpy = vi.spyOn(ExtractedResourceService, 'findManyinDLSession')
const createSpy = vi.spyOn(ExtractedResourceService, 'create')
const createManySpy = vi.spyOn(ExtractedResourceService, 'createMany')
const updateSpy = vi.spyOn(ExtractedResourceService, 'update')
const updateManySpy = vi.spyOn(ExtractedResourceService, 'updateMany')
const deleteSpy = vi.spyOn(ExtractedResourceService, 'delete')

describe('GIVEN extractedResource route', () => {
  // describe.each([
  //   [
  //     [{
  //       id: 'extractedResource/1',
  //       createdAt: new Date('2022-05-20T11:14:01.257Z'),
  //       updatedAt: new Date('2022-05-20T11:14:01.257Z'),
  //       metadata: {},
  //       rawResourceId: 'rawResource/1',
  //     }, {
  //       id: 'extractedResource/2',
  //       createdAt: new Date('2022-05-20T11:14:01.257Z'),
  //       updatedAt: new Date('2022-05-20T11:14:01.257Z'),
  //       metadata: {},
  //       rawResourceId: 'rawResource/1',
  //     }, {
  //       id: 'extractedResource/3',
  //       createdAt: new Date('2022-05-20T11:14:01.257Z'),
  //       updatedAt: new Date('2022-05-20T11:14:01.257Z'),
  //       metadata: {},
  //       rawResourceId: 'rawResource/1',
  //     }],
  //   ],
  // ])(
  //   'WHEN extractedResource service is mocked to find many valid extractedResources',
  //   async (
  //     extractedResources: ExtractedResource[],
  //   ) => {
  //     beforeAll(() => {
  //       findManySpy.mockResolvedValue([
  //         extractedResources,
  //         extractedResources.length,
  //         [{
  //           patientId: 'patient1',
  //           extractedResourcesCount: 1,
  //         }],
  //       ])
  //     })
  //
  //     afterAll(() => {
  //       findManySpy.mockClear()
  //     })
  //
  //     describe.each([
  //       [
  //         {
  //           filter: {
  //             dLSessionId: randomUUID(),
  //             labelIds: [randomUUID()],
  //           },
  //           sort: [
  //             {
  //               createdAt: 'asc',
  //             },
  //           ],
  //           limit: 2,
  //           offset: 0,
  //         },
  //       ],
  //       [
  //         {
  //           filter: {
  //             dLSessionId: randomUUID(),
  //           },
  //           limit: 2,
  //           offset: 10,
  //         },
  //       ],
  //     ])(
  //       'AND querying route extractedResource.list-dLSession with good inputs',
  //       async (input: ExtractedResourceFindManyInput) => {
  //         test('THEN extractedResource route should return valid results', async () => {
  //           const ctx = await createContextInner({
  //             user: {
  //               id: '1',
  //             },
  //           })
  //           const caller = router.createCaller(ctx)
  //
  //           vi.spyOn(CloudService.s3Repository, 'getSignedURL').mockResolvedValueOnce('test.png')
  //
  //           await expect(caller.query('extractedResource.list-dLSession', input)).resolves
  //             .toEqual({
  //               data: extractedResources.map((item: ExtractedResource | PrismaExtractedResourceWithLabelsAndStatus) => ({
  //                 id: item.id,
  //                 createdAt: item.createdAt,
  //                 updatedAt: item.updatedAt,
  //                 fullPath: 'test.png',
  //                 metadata: item.metadata,
  //                 rawResourceId: item.rawResourceId,
  //                 status: (item as PrismaExtractedResourceWithLabelsAndStatus)?.dLSessions?.[0]?.status,
  //                 labels: (item as PrismaExtractedResourceWithLabelsAndStatus)?.dLSessions?.[0]?.labels.flatMap(item => item.label),
  //               })),
  //               metadata: {
  //                 limit: input?.limit,
  //                 offset: input?.offset,
  //                 totalCount: extractedResources.length,
  //                 patientIdsWithExtractedResourcesCount: [
  //                   {
  //                     patientId: 'patient1',
  //                     extractedResourcesCount: 1,
  //                   },
  //                 ],
  //               },
  //             })
  //           expect(ExtractedResourceService.findMany).toHaveBeenCalledWith(
  //             input,
  //           )
  //         })
  //       },
  //     )
  //
  //     describe.each([
  //       [
  //         {
  //           sort: [
  //             {
  //               createdAt: 'WRONG INPUT',
  //             },
  //           ],
  //           limit: 2,
  //           offset: 0,
  //         },
  //       ],
  //       [
  //         'random string',
  //       ],
  //     ])(
  //       'AND querying route extractedResource.list-dLSession with bad inputs',
  //       async (input: any) => {
  //         test('THEN extractedResource route should throw error', async () => {
  //           const ctx = await createContextInner({
  //             user: {
  //               id: '1',
  //             },
  //           })
  //           const caller = router.createCaller(ctx)
  //           await expect(caller.query('extractedResource.list-dLSession', input)).rejects
  //             .toThrow()
  //         })
  //       },
  //     )
  //   },
  // )

  describe.each([
    [
      {
        id: 'extractedResource/1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        metadata: {},
        rawResourceId: '1',
      },
    ],
  ])(
    'WHEN extractedResource service is mocked to find single valid extractedResource',
    async (extractedResource: ExtractedResource) => {
      beforeAll(() => {
        findSpy.mockResolvedValue(extractedResource)
      })

      afterAll(() => {
        findSpy.mockClear()
      })

      describe.each([
        [randomUUID()],
      ])(
        'AND querying route extractedResource.one with good inputs',
        async (input: ExtractedResourceFindSingleInput) => {
          test('THEN extractedResource route should return valid results', async () => {
            const ctx = await createContextInner({
              user: {
                id: '1',
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.query('extractedResource.one', input)).resolves
              .toEqual(extractedResource)
            expect(ExtractedResourceService.find).toHaveBeenCalledWith(input)
          })
        },
      )

      describe.each([
        [0],
        [{ random: 'random' }],
        [{ id: 'wrong input' }],
      ])(
        'AND querying route extractedResource.one with bad inputs',
        async (input: any) => {
          test('THEN extractedResource route should throw error', async () => {
            const ctx = await createContextInner({
              user: {
                id: '1',
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.query('extractedResource.one', input)).rejects
              .toThrow()
          })
        },
      )
    },
  )

  describe.each([
    [
      {
        id: 'extractedResource/1',
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        metadata: {},
        rawResourceId: 'rawResource/1',
      },
    ],
  ])(
    'WHEN extractedResource service is mocked to create valid extractedResource',
    async (extractedResource: ExtractedResource) => {
      beforeAll(() => {
        createSpy.mockResolvedValue({
          id: extractedResource.id,
        })
      })

      afterAll(() => {
        createSpy.mockClear()
      })

      describe.each([
        [
          {
            id: extractedResource.id,
            metadata: {},
            rawResourceId: extractedResource.rawResourceId,
          },
        ],
      ])(
        'AND mutating route extractedResource.create with good inputs',
        async (input: ExtractedResourceCreateSingleInput) => {
          test('THEN extractedResource route should return valid results', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.mutation('extractedResource.create', input))
              .resolves.toEqual({
                id: extractedResource.id,
              })
            expect(ExtractedResourceService.create).toHaveBeenCalledWith(input)
          })
        },
      )

      describe.each([
        [0],
        [{ random: 'random' }],
        [{ id: 'wrong input' }],
      ])(
        'AND mutating route extractedResource.create with bad inputs',
        async (input: any) => {
          test('THEN extractedResource route should throw error', async () => {
            const ctx = await createContextInner({
              user: {
                id: '1',
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.mutation('extractedResource.create', input))
              .rejects.toThrow()
          })
        },
      )

      describe('AND mutating route extractedResource.create with no authorization', async () => {
        test('THEN extractedResource route should throw error', async () => {
          const ctx = await createContextInner({
            user: {
              id: '1',
            },
          })
          const caller = router.createCaller(ctx)
          await expect(caller.mutation('extractedResource.create', {
            id: 'extractedResource/1',
            metadata: {},
            rawResourceId: '1',
          })).rejects.toThrow()
        })
      })
    },
  )

  describe.each([
    [
      [
        {
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
          id: 'extractedResource/1',
          metadata: {},
          rawResourceId: randomUUID(),
        },
      ],
    ],
  ])(
    'WHEN extractedResource service is mocked to create many valid extractedResources',
    async (extractedResources: ExtractedResource[]) => {
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
          extractedResources.map(extractedResource => ({
            id: extractedResource.id,
            metadata: {},
            rawResourceId: extractedResource.rawResourceId,
          })),
        ],
      ])(
        'AND mutating route extractedResource.create-many with good inputs',
        async (input: ExtractedResourceCreateManyInput) => {
          test('THEN extractedResource route should return valid results', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(
              caller.mutation('extractedResource.create-many', input),
            ).resolves.toEqual({
              count: 1,
            })
            expect(ExtractedResourceService.createMany).toHaveBeenCalledWith(
              input,
            )
          })
        },
      )

      describe.each([
        [0],
        [{ random: 'random' }],
        [{ id: 'wrong input' }],
      ])(
        'AND mutating route extractedResource.create-many with bad inputs',
        async (input: any) => {
          test('THEN extractedResource route should throw error', async () => {
            const ctx = await createContextInner({
              user: {
                id: '1',
              },
            })
            const caller = router.createCaller(ctx)
            await expect(
              caller.mutation('extractedResource.create-many', input),
            ).rejects.toThrow()
          })
        },
      )

      describe('AND mutating route extractedResource.create-many with no authorization', async () => {
        test('THEN extractedResource route should throw error', async () => {
          const ctx = await createContextInner({
            user: {
              id: '1',
            },
          })
          const caller = router.createCaller(ctx)
          await expect(caller.mutation('extractedResource.create-many', [{
            id: 'extractedResource/1',
            metadata: {},
            rawResourceId: '1',
          }])).rejects.toThrow()
        })
      })
    },
  )

  describe.each([
    [
      {
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        id: 'extractedResource/1',
        metadata: {},
        rawResourceId: randomUUID(),
      },
    ],
  ])(
    'WHEN extractedResource service is mocked to update valid extractedResource',
    async (extractedResource: ExtractedResource) => {
      beforeAll(() => {
        updateSpy.mockResolvedValue({
          id: extractedResource.id,
        })
      })

      afterAll(() => {
        updateSpy.mockClear()
      })

      describe.each([
        [
          {
            id: extractedResource.id,
            newId: 'New',
            metadata: {},
            rawResourceId: extractedResource.rawResourceId,
          },
        ],
      ])(
        'AND mutating route extractedResource.update with good inputs',
        async (input: ExtractedResourceUpdateSingleInput) => {
          test('THEN extractedResource route should return valid results', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.mutation('extractedResource.update', input))
              .resolves.toEqual({
                id: extractedResource.id,
              })
            expect(ExtractedResourceService.update).toHaveBeenCalledWith(input)
          })
        },
      )

      describe.each([
        [0],
        [{ random: 'random' }],
        [{ id: 5 }],
      ])(
        'AND mutating route extractedResource.update with bad inputs',
        async (input: any) => {
          test('THEN extractedResource route should throw error', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.mutation('extractedResource.update', input))
              .rejects.toThrow()
          })
        },
      )
    },
  )

  describe.each([
    [
      [
        {
          createdAt: new Date('2022-05-20T11:14:01.257Z'),
          updatedAt: new Date('2022-05-20T11:14:01.257Z'),
          id: 'extractedResource/1',
          metadata: {},
          rawResourceId: randomUUID(),
        },
      ],
    ],
  ])(
    'WHEN extractedResource service is mocked to update many extractedResources',
    async (extractedResources: ExtractedResource[]) => {
      beforeAll(() => {
        updateManySpy.mockResolvedValue({
          count: 1,
        })
      })

      afterAll(() => {
        updateManySpy.mockClear()
      })

      describe.each([
        [
          extractedResources.map(extractedResource => ({
            id: extractedResource.id,
            metadata: {},
            rawResourceId: extractedResource.rawResourceId,
          })),
        ],
      ])(
        'AND mutating route extractedResource.update-many with good inputs',
        async (input: ExtractedResourceUpdateManyInput) => {
          test('THEN extractedResource route should return valid results', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(
              caller.mutation('extractedResource.update-many', input),
            ).resolves.toEqual({
              count: 1,
            })
            expect(ExtractedResourceService.updateMany).toHaveBeenCalledWith(
              input,
            )
          })
        },
      )

      describe.each([
        [0],
        [{ random: 'random' }],
        [{ id: 'wrong input' }],
      ])(
        'AND mutating route extractedResource.update-many with bad inputs',
        async (input: any) => {
          test('THEN extractedResource route should throw error', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(
              caller.mutation('extractedResource.update-many', input),
            ).rejects.toThrow()
          })
        },
      )
    },
  )

  describe.each([
    [
      {
        createdAt: new Date('2022-05-20T11:14:01.257Z'),
        updatedAt: new Date('2022-05-20T11:14:01.257Z'),
        id: 'extractedResource/1',
        metadata: {},
        rawResourceId: randomUUID(),
      },
    ],
  ])(
    'WHEN extractedResource service is mocked to delete valid extractedResource',
    async (extractedResource: ExtractedResource) => {
      beforeAll(() => {
        deleteSpy.mockResolvedValue({
          id: extractedResource.id,
        })
      })

      afterAll(() => {
        deleteSpy.mockClear()
      })

      describe.each([
        [extractedResource.id],
      ])(
        'AND mutating route extractedResource.delete with good inputs',
        async (input: ExtractedResourceDeleteSingleInput) => {
          test('THEN extractedResource route should return valid results', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.mutation('extractedResource.delete', input))
              .resolves.toEqual({
                id: extractedResource.id,
              })
            expect(ExtractedResourceService.delete).toHaveBeenCalledWith(input)
          })
        },
      )

      describe.each([
        [0],
        [{ random: 'random' }],
        [{ id: 'wrong input' }],
      ])(
        'AND mutating route extractedResource.delete with bad inputs',
        async (input: any) => {
          test('THEN extractedResource route should throw error', async () => {
            const ctx = await createContextInner({
              user: {
                'id': '1',
                'https://www.originhealth.ai/roles': ['dataverse-admin'],
              },
            })
            const caller = router.createCaller(ctx)
            await expect(caller.mutation('extractedResource.delete', input))
              .rejects.toThrow()
          })
        },
      )
    },
  )

  describe('WHEN extractedResource service is mocked to throw an error', async () => {
    beforeAll(() => {
      findManySpy.mockRejectedValue(new Error('FIND MANY ERROR'))
      findSpy.mockRejectedValue(new Error('FIND SINGLE ERROR'))
      createManySpy.mockRejectedValue(new Error('CREATE MANY ERROR'))
      createSpy.mockRejectedValue(new Error('CREATE ERROR'))
      updateManySpy.mockRejectedValue(new Error('UPDATE MANY ERROR'))
      updateSpy.mockRejectedValue(new Error('UPDATE ERROR'))
      deleteSpy.mockRejectedValue(new Error('DELETE ERROR'))
    })

    afterAll(() => {
      findManySpy.mockClear()
      findSpy.mockClear()
      createManySpy.mockClear()
      createSpy.mockClear()
      updateManySpy.mockClear()
      updateSpy.mockClear()
      deleteSpy.mockClear()
    })

    test('THEN extractedResource route should throw an error', async () => {
      const ctx = await createContextInner({
        user: {
          'id': '1',
          'https://www.originhealth.ai/roles': ['dataverse-admin'],
        },
      })
      const caller = router.createCaller(ctx)
      const uuid = randomUUID()
      const extractedResource = {
        id: 'extractedResource/1',
        metadata: {},
        rawResourceId: 'rawResource/1',
      }

      await expect(caller.query('extractedResource.list-dLSession', {
        filter: {
          dLSessionId: uuid,
        },
      })).rejects.toThrow('FIND MANY ERROR')
      expect(ExtractedResourceService.findManyinDLSession).toHaveBeenCalledWith({
        filter: {
          dLSessionId: uuid,
        },
      })

      await expect(caller.query('extractedResource.one', 'extractedResource/1'))
        .rejects.toThrow('FIND SINGLE ERROR')
      expect(ExtractedResourceService.find).toHaveBeenCalledWith('extractedResource/1')

      await expect(
        caller.mutation('extractedResource.create', extractedResource),
      ).rejects.toThrow('CREATE ERROR')
      expect(ExtractedResourceService.create).toHaveBeenCalledWith(
        extractedResource,
      )

      await expect(
        caller.mutation('extractedResource.create-many', [extractedResource]),
      ).rejects.toThrow('CREATE MANY ERROR')
      expect(ExtractedResourceService.createMany).toHaveBeenCalledWith([
        extractedResource,
      ])

      await expect(
        caller.mutation('extractedResource.update-many', [extractedResource]),
      ).rejects.toThrow('UPDATE MANY ERROR')
      expect(ExtractedResourceService.updateMany).toHaveBeenCalledWith([
        extractedResource,
      ])

      await expect(caller.mutation('extractedResource.update', {
        newId: 'extractedResource/2',
        ...extractedResource,
      })).rejects.toThrow('UPDATE ERROR')
      expect(ExtractedResourceService.update).toHaveBeenCalledWith({
        newId: 'extractedResource/2',
        ...extractedResource,
      })

      await expect(
        caller.mutation('extractedResource.delete', 'extractedResource/1'),
      ).rejects.toThrow('DELETE ERROR')
      expect(ExtractedResourceService.delete).toHaveBeenCalledWith(
        'extractedResource/1',
      )
    })
  })

  describe('WHEN accessing protected extractedResource routes without being authenticated', async () => {
    const ctx = await createContextInner({})
    const caller = router.createCaller(ctx)

    test('then extractedResource route should throw errors', async () => {
      await expect(caller.mutation('extractedResource.create', {
        id: 'extractedResource/1',
        metadata: {},
        rawResourceId: 'rawResource/1',
      })).rejects.toThrow()

      await expect(caller.mutation('extractedResource.create-many', [{
        id: 'extractedResource/1',
        metadata: {},
        rawResourceId: 'rawResource/1',
      }])).rejects.toThrow()

      await expect(caller.mutation('extractedResource.update', {
        id: 'extractedResource/1',
        newId: 'random',
        metadata: {},
        rawResourceId: 'rawResource/1',
      })).rejects.toThrow()

      await expect(caller.mutation('extractedResource.update-many', [{
        id: 'extractedResource/1',
        newId: 'random',
        metadata: {},
        rawResourceId: 'rawResource/1',
      }])).rejects.toThrow()

      await expect(caller.mutation('extractedResource.delete', randomUUID()))
        .rejects.toThrow()
    })
  })
})
