import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { AnnotationService } from '~/server/services/annotation.service'

const findManyInput = z
  .strictObject({
    filter: z.strictObject({
    }).optional(),
    sort: z.record(
      z.string().refine(s => ['id', 'createdAt', 'updatedAt', 'name', 'base'].includes(s)),
      z.string().refine(s => ['asc', 'desc'].includes(s)).or(z.never()),
    ).array().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    search : z.string().default(''),
  }).optional()

// Validation pattern: allows only uppercase letters, numbers, underscores, and hyphens (NO spaces, NO lowercase)
const validCharactersPattern = /^[A-Z0-9_-]+$/;

const createManyInput = z.strictObject({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain uppercase letters, numbers, underscores, and hyphens"
    }),
  abbreviation: z.string()
    .min(1, { message: "Abbreviation is required" })
    .max(300, { message: "Abbreviation must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Abbreviation can only contain uppercase letters, numbers, underscores, and hyphens" 
    }),
  taxonomyTypeId: z.string()
    .uuid({ message: "Taxonomy Type is required and must be a valid UUID" })
    .min(1, { message: "Taxonomy Type is required" }),
  colorCode: z.string()
    .min(1, { message: "Color is required" })
})

const updateManyInput = z.strictObject({
  id: z.string().uuid({ message: "ID is required and must be a valid UUID" }),
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(300, { message: "Name must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Name can only contain uppercase letters, numbers, underscores, and hyphens"
    }),
  abbreviation: z.string()
    .min(1, { message: "Abbreviation is required" })
    .max(300, { message: "Abbreviation must be 300 characters or less" })
    .refine(val => validCharactersPattern.test(val), {
      message: "Abbreviation can only contain uppercase letters, numbers, underscores, and hyphens" 
    }),
  taxonomyTypeId: z.string()
    .uuid({ message: "Taxonomy Type is required and must be a valid UUID" })
    .min(1, { message: "Taxonomy Type is required" }),
  colorCode: z.string()
    .min(1, { message: "Color is required" })
})

const deleteInput = z.strictObject({
  id: z.string().uuid()
})

const fetchAllAnnotationsInput = z.object({}).optional()

export type AnnotationFindManyInput = z.infer<typeof findManyInput>
export type AnnotationCreateManyInput = z.infer<typeof createManyInput>
export type AnnotationUpdateManyInput = z.infer<typeof updateManyInput>
export type AnnotationDeleteInput = z.infer<typeof deleteInput>
export type AnnotationFetchAllInput = z.infer<typeof fetchAllAnnotationsInput>

export const annotation = router({
  list: protectedProcedure
    .input(findManyInput)
    .query(async ({ input }) => {
      const [annotations, count] = await AnnotationService.findMany(input)
      return {
        data: annotations,
        metadata: {
          offset: input?.offset,
          limit: input?.limit,
          totalCount: count,
        },
      }
    }),

  createAnnotation: protectedProcedure
    .input(createManyInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return AnnotationService.createNewAnnotation(input, isAdmin, userId)
    }),

  updateAnnotation: protectedProcedure
    .input(updateManyInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return AnnotationService.updateAnnotation(input, isAdmin, userId)
    }),

  deleteAnnotation: protectedProcedure
    .input(deleteInput)
    .mutation(async ({ ctx, input }) => {
      const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
      const userId = ctx?.user.sub
      return AnnotationService.deleteAnnotation(input, isAdmin, userId)
    }),
    fetchAllAnnotations: protectedProcedure
    .input(fetchAllAnnotationsInput)
    .query(async ({ ctx }) => {
      try {
        // Call the service method to fetch all annotations
        const annotations = await AnnotationService.fetchAllAnnotations()
        
        return {
          annotations,
          success: true
        }
      } catch (error) {
        console.error('Error fetching all annotations:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch annotations',
          cause: error
        })
      }
    }),
})