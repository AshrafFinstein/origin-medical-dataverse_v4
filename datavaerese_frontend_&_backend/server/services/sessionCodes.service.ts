import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import { db } from '../infrastructures/database'
import { SessionCodesCreateManyInput, SessionCodesFindManyInput, SessionCodesUpdateManyInput } from '../trpc/routers/sessionCodes'

export class SessionCodesService {
    static async findProjectCodeListMany(input?: SessionCodesFindManyInput) {
        try {
        const args = Prisma.validator<Prisma.ProjectCodeFindManyArgs>()({
            where: input?.search ? {
                OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: input?.sort,
            skip: input?.offset,
            take: input?.limit,
        })
        const list = await db.projectCode.findMany(args);
        const count = await db.projectCode.count();
        const [listResult, countResult] = await Promise.all([list, count]);
        return {
            listResult: listResult,
            metadata: {
                offset: input?.offset,
                limit: input?.limit,
                totalCount: countResult,
            },
            }
        } catch (error) {
            throw handlePrismaReadError(error, 'Project Code', 'findMany')
        }
    }
    static async createProjectCodeMany(input: SessionCodesCreateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.ProjectCodeCreateManyArgs>()({
            data: input
        })
        await db.projectCode.createMany(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Project Code', input, { action: 'create' })
        }
    }

    static async updateProjectCode(input: SessionCodesUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.ProjectCodeUpdateArgs>()({
            where: {
                id: input.id
            },
            data: {
                name: input.name
            }
        })
        await db.projectCode.update(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Project Code', input, { action: 'update' })
        }
    }

    static async findSubProjectCodeListMany(input?: SessionCodesFindManyInput) {
        try {
        const args = Prisma.validator<Prisma.SubProjectCodeFindManyArgs>()({
            where: input?.search ? {
                OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: input?.sort,
            skip: input?.offset,
            take: input?.limit,
        })

        const list = await db.subProjectCode.findMany(args);
        const count = await db.subProjectCode.count();
        const [listResult, countResult] = await Promise.all([list, count]);
        return {
            listResult: listResult,
            metadata: {
                offset: input?.offset,
                limit: input?.limit,
                totalCount: countResult,
            },
            }
        } catch (error) {
            throw handlePrismaReadError(error, 'Sub-Project Code', 'findMany')
        }
    }
    static async createSubProjectCode(input: SessionCodesCreateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.SubProjectCodeCreateManyArgs>()({
            data: input
        })
        await db.subProjectCode.createMany(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Sub-Project Code', input, { action: 'create' })
        }
    }

    static async updateSubProjectCode(input: SessionCodesUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.ProjectCodeUpdateArgs>()({
            where: {
                id: input.id
            },
            data: {
                name: input.name
            }
        })
        await db.subProjectCode.update(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Sub-Project Code', input, { action: 'update' })
        }
    }

    static async findUseCaseCodeListMany(input?: SessionCodesFindManyInput) {
        const args = Prisma.validator<Prisma.UseCaseCodeFindManyArgs>()({
            where: input?.search ? {
                OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: input?.sort,
            skip: input?.offset,
            take: input?.limit,
        })
        const list = await db.useCaseCode.findMany(args);
        const count = await db.useCaseCode.count();
        const [listResult, countResult] = await Promise.all([list, count]);
        return {
            listResult: listResult,
            metadata: {
                offset: input?.offset,
                limit: input?.limit,
                totalCount: countResult,
            },
        }
    }

    static async createUseCaseCode(input: SessionCodesCreateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.UseCaseCodeCreateManyArgs>()({
            data: input
        })
        await db.useCaseCode.createMany(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Use Case Code', input, { action: 'create' })
        }
    }

    static async updateUseCaseCode(input: SessionCodesUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.UseCaseCodeUpdateArgs>()({
            where: {
                id: input.id
            },
            data: {
                name: input.name
            }
        })
        await db.useCaseCode.update(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Use Case Code', input, { action: 'update' })
        }
    }
    static async findAnatomyPlaneCodeListMany(input?: SessionCodesFindManyInput) {
        try {
        const args = Prisma.validator<Prisma.AnatomyPlaneCodeFindManyArgs>()({
            where: input?.search ? {
                OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: input?.sort,
            skip: input?.offset,
            take: input?.limit,
        })
        const list = await db.anatomyPlaneCode.findMany(args);
        const count = await db.anatomyPlaneCode.count();
        const [listResult, countResult] = await Promise.all([list, count]);
        return {
            listResult: listResult,
            metadata: {
                offset: input?.offset,
                limit: input?.limit,
                totalCount: countResult,
            },
            }
        } catch (error) {
            throw handlePrismaReadError(error, 'Anatomy Plane Code', 'findMany')
        }
    }

    static async createUserTypeCode(input: SessionCodesCreateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.UserTypeCodeCreateManyArgs>()({
            data: input
        })
        await db.userTypeCode.createMany(arg)
        } catch (error) {
            throw handlePrismaError(error, 'User Type Code', input, { action: 'create' })
        }
    }

    static async updateUserTypeCode(input: SessionCodesUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.UserTypeCodeUpdateArgs>()({
            where: {
                id: input.id
            },
            data: {
                name: input.name
            }
        })
        await db.userTypeCode.update(arg)
        } catch (error) {
            throw handlePrismaError(error, 'User Type Code', input, { action: 'update' })
        }
    }
    static async findCenterCodeListMany(input?: SessionCodesFindManyInput) {
        try {
        const args = Prisma.validator<Prisma.CenterCodeFindManyArgs>()({
            where: input?.search ? {
                OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: input?.sort,
            skip: input?.offset,
            take: input?.limit,
        })
        const list = await db.centerCode.findMany(args);
        const count = await db.centerCode.count();
        const [listResult, countResult] = await Promise.all([list, count]);
        return {
            listResult: listResult,
            metadata: {
                offset: input?.offset,
                limit: input?.limit,
                totalCount: countResult,
            },
            }
        } catch (error) {
            throw handlePrismaReadError(error, 'Center Code', 'findMany')
        }
    }

    static async createAnatomyPlaneCode(input: SessionCodesCreateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.AnatomyPlaneCodeCreateManyArgs>()({
            data: input
        })
        await db.anatomyPlaneCode.createMany(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Anatomy Plane Code', input, { action: 'create' })
        }
    }

    static async updateAnatomyPlaneCode(input: SessionCodesUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.AnatomyPlaneCodeUpdateArgs>()({
            where: {
                id: input.id
            },
            data: {
                name: input.name
            }
        })
        await db.anatomyPlaneCode.update(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Anatomy Plane Code', input, { action: 'update' })
        }
    }
    static async findUserTypeCodeListMany(input?: SessionCodesFindManyInput) {
        try {
        const args = Prisma.validator<Prisma.UserTypeCodeFindManyArgs>()({
            where: input?.search ? {
                OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: input?.sort,
            skip: input?.offset,
            take: input?.limit,
        })
        const list = await db.userTypeCode.findMany(args);
        const count = await db.userTypeCode.count();
        const [listResult, countResult] = await Promise.all([list, count]);
        return {
            listResult: listResult,
            metadata: {
                offset: input?.offset,
                limit: input?.limit,
                totalCount: countResult,
            },
            }
        } catch (error) {
            throw handlePrismaReadError(error, 'User Type Code', 'findMany')
        }
    }

    static async createCenterCode(input: SessionCodesCreateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.CenterCodeCreateManyArgs>()({
            data: input
        })
        await db.centerCode.createMany(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Center Code', input, { action: 'create' })
        }
    }
    static async updateCenterCode(input: SessionCodesUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
        if (!userId)
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        try {
        const arg = Prisma.validator<Prisma.CenterCodeUpdateArgs>()({
            where: {
                id: input.id
            },
            data: {
                name: input.name
            }
        })
        await db.centerCode.update(arg)
        } catch (error) {
            throw handlePrismaError(error, 'Center Code', input, { action: 'update' })
        }
    }
}