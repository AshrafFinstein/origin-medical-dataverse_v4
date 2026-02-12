import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { TaxonomyService } from '~/server/services/taxonomy.service'

const findManyInput = z
  .strictObject({
    filter: z.strictObject({
    }).optional(),
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search: z.string().default(''),
  }).optional()

const createManyInput = z.array(
  z.strictObject({
    name: z.string().min(1).max(100),
    typesInTaxonomies: z.array(
      z.object({
        annotationId: z.string().uuid(),  // Added annotationId
        colorCode: z.string().optional(),
      })
    ).superRefine((types, ctx) => {
      const uniqueAnnotationIds = new Set(types.map(type => type.annotationId));
      if (uniqueAnnotationIds.size !== types.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each annotation in taxonomy must be unique",
          path: ["typesInTaxonomies"],
        });
      }
    })
  })
);

const updateManyInput = z.strictObject({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  typesInTaxonomies: z.array(
    z.object({
      id: z.string().optional(),
      annotationId: z.string().uuid(),  
      taxonomyId: z.string().optional(),
      colorCode: z.string().optional(),
    })
    
  ).superRefine((types, ctx) => {
    const uniqueAnnotationIds = new Set(types.map(type => type.annotationId));
    if (uniqueAnnotationIds.size !== types.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each annotation in taxonomy must be unique",
        path: ["typesInTaxonomies"],
      });
    }
  }),
  confirmDeletion: z.boolean().optional()
});

const deleteTaxonomyTypeInput = z.strictObject({
  typesInTaxonomies: z.array(
    z.object({
      id: z.string(),
    }),
   
  ),
  confirmDelete: z.boolean().optional()
})

const fetchTaxonomyInput = z.strictObject({
  taxonomyId: z.string().uuid()
})
export type TaxonomyFindManyInput = z.infer<typeof findManyInput>
export type TaxonomyCreateManyInput = z.infer<typeof createManyInput>
export type TaxonomyUpdateManyInput = z.infer<typeof updateManyInput>
export type TaxonomyDeleteTypeInput = z.infer<typeof deleteTaxonomyTypeInput>
export type TaxonomyFetchInput = z.infer<typeof fetchTaxonomyInput>


export const taxonomy = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ input }) => {
      const [taxonomys, count] = await TaxonomyService.findMany(input)
      return {
        data: taxonomys,
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          totalCount: count,
        },
      }
  }),
  taxonomyTypeList: protectedProcedure
  .input(findManyInput)
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return TaxonomyService.taxonomyTypeList(input, isAdmin, userId)
  }),
  createTaxonomy: protectedProcedure
  .input(createManyInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return TaxonomyService.createNewTaxonomy(input, isAdmin, userId)
  }),
  updateTaxonomy: protectedProcedure
  .input(updateManyInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    const confirmAnnotationChange= input.confirmDeletion
    return TaxonomyService.updateTaxonomy(input, isAdmin, userId, confirmAnnotationChange)
  }),
  deleteTaxonomyType: protectedProcedure
  .input(deleteTaxonomyTypeInput)
  .mutation(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    const confirmDelete= input.confirmDelete
    return TaxonomyService.deleteTaxonomyType(input, isAdmin, userId,confirmDelete)
  }),
  autoSessionCodesList: protectedProcedure
    .input(findManyInput)
    .query(async ({ input }) => {
      const [projectCodeList, subProjectCodeList, useCaseCodeList, anatomyPlaneCodeList, centerCodeList, userTypeCodeList] = await TaxonomyService.findAutoSessionCodeListMany(input)
      return {
        data: [projectCodeList, subProjectCodeList, useCaseCodeList, anatomyPlaneCodeList, centerCodeList, userTypeCodeList]
      }
    }),
    fetchTaxonomyAnnotations: protectedProcedure
  .input(fetchTaxonomyInput)
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub
    return TaxonomyService.fetchTaxonomyAnnotations(input.taxonomyId, isAdmin, userId)
  }),
})