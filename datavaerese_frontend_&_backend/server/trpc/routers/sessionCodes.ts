import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { SessionCodesService } from '~/server/services/sessionCodes.service'

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
        search:z.string().default(''),
    }).optional()

// Validation pattern: allows letters (uppercase and lowercase), numbers, underscores, and hyphens (NO spaces, NO dots)
const validCharactersPattern = /^[A-Za-z0-9_-]+$/

const updateManyInput = z.strictObject({
    id: z.string().uuid(),
    name: z.string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be 100 characters or less" })
        .refine(val => validCharactersPattern.test(val), {
            message: "Name can only contain letters, numbers, underscores, and hyphens"
        })
        .optional()
});

const createManyInput = z.array(
    z.strictObject({
        name: z.string()
            .min(1, { message: "Name is required" })
            .max(100, { message: "Name must be 100 characters or less" })
            .refine(val => validCharactersPattern.test(val), {
                message: "Name can only contain letters, numbers, underscores, and hyphens"
            })
    })
);

export type SessionCodesFindManyInput = z.infer<typeof findManyInput>
export type SessionCodesCreateManyInput = z.infer<typeof createManyInput>
export type SessionCodesUpdateManyInput = z.infer<typeof updateManyInput>

export const sessionCodes = router({
    projectCode: protectedProcedure
        .input(findManyInput)
        .query(async ({ input }) => {
            return await SessionCodesService.findProjectCodeListMany(input).then(({ listResult, metadata }) => {
                return {
                    data: listResult,
                    metadata: metadata
                }
            })
        }),
    updateProjectCode: protectedProcedure
        .input(updateManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.updateProjectCode(input, isAdmin, userId)
        }),
    createProjectCode: protectedProcedure
        .input(createManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.createProjectCodeMany(input, isAdmin, userId)
        }),
    subProjectCode: protectedProcedure
        .input(findManyInput)
        .query(async ({ input }) => {
            return await SessionCodesService.findSubProjectCodeListMany(input).then(({ listResult, metadata }) => {
                return {
                    data: listResult,
                    metadata: metadata
                }
            })
        }),
    createSubProjectCode: protectedProcedure
        .input(createManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.createSubProjectCode(input, isAdmin, userId)
        }),
    updateSubProjectCode: protectedProcedure
        .input(updateManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.updateSubProjectCode(input, isAdmin, userId)
        }),
    useCaseCode: protectedProcedure
        .input(findManyInput)
        .query(async ({ input }) => {
            return await SessionCodesService.findUseCaseCodeListMany(input).then(({ listResult, metadata }) => {
                return {
                    data: listResult,
                    metadata: metadata
                }
            })
        }),
    createUseCaseCode: protectedProcedure
        .input(createManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.createUseCaseCode(input, isAdmin, userId)
        }),
    updateUseCaseCode: protectedProcedure
        .input(updateManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.updateUseCaseCode(input, isAdmin, userId)
        }),
    userTypeCode: protectedProcedure
        .input(findManyInput)
        .query(async ({ input }) => {
            return await SessionCodesService.findUserTypeCodeListMany(input).then(({ listResult, metadata }) => {
                return {
                    data: listResult,
                    metadata: metadata
                }
            })
        }),
    createUserTypeCode: protectedProcedure
        .input(createManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.createUserTypeCode(input, isAdmin, userId)
        }),
    updateUserTypeCode: protectedProcedure
        .input(updateManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            console.log(input, 'inside ts');

            return SessionCodesService.updateUserTypeCode(input, isAdmin, userId)
        }),
    anatomyPlaneCode: protectedProcedure
        .input(findManyInput)
        .query(async ({ input }) => {
            return await SessionCodesService.findAnatomyPlaneCodeListMany(input).then(({ listResult, metadata }) => {
                return {
                    data: listResult,
                    metadata: metadata
                }
            })
        }),
    createAnatomyPlaneCode: protectedProcedure
        .input(createManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.createAnatomyPlaneCode(input, isAdmin, userId)
        }),
    updateAnatomyPlaneCode: protectedProcedure
        .input(updateManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.updateAnatomyPlaneCode(input, isAdmin, userId)
        }),
    centerCode: protectedProcedure
        .input(findManyInput)
        .query(async ({ input }) => {
            return await SessionCodesService.findCenterCodeListMany(input).then(({ listResult, metadata }) => {
                return {
                    data: listResult,
                    metadata: metadata
                }
            })
        }),
    createCenterCode: protectedProcedure
        .input(createManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.createCenterCode(input, isAdmin, userId)
        }),
    updateCenterCode: protectedProcedure
        .input(updateManyInput)
        .mutation(async ({ ctx, input }) => {
            const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
            const userId = ctx?.user.sub
            return SessionCodesService.updateCenterCode(input, isAdmin, userId)
        }),
})