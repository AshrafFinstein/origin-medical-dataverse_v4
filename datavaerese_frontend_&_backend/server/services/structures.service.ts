import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { TRPCError } from '@trpc/server'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import { db } from '../infrastructures/database'
import type { StructureGroupCreateInput, StructureGroupFindManyInput, StructureGroupDeleteInput,  StructureGroupUpdateManyInput } from '../trpc/routers/structures'


export class StrucutureService {
  static readonly structureRepository = resolve(TOKEN.structureRepository)

  static async findMany(input?: StructureGroupFindManyInput) {
    try {
    const args = Prisma.validator<Prisma.StructureGroupsFindManyArgs>()({
        where: {
          ...(input?.search
            ? {
                OR: [
                  { name: { contains: input.search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: input?.sort,
        skip: input?.offset,
        take: input?.limit,
        include: {
          StructureInStructureGroup: true,
        },
    });
    const queryPromise = this.structureRepository().findMany(args);
    const countPromise = this.structureRepository().count();
    const [queryResult, totalCount] = await Promise.all([queryPromise, countPromise]);
    
    return [queryResult, totalCount];
    } catch (error) {
      throw handlePrismaReadError(error, 'Structure Group', 'findMany')
    }
  }

  static async createNewStructureGroup(input: StructureGroupCreateInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const structureGroupArgs = Prisma.validator<Prisma.StructureGroupsCreateArgs>()({
      data: {
        name: input.name,
      },
    })
    const structure = await this.structureRepository().create(structureGroupArgs)

    for (const item of input.structureInStructureGroup) {
        try {
      const structureInStructureGroupArgs = Prisma.validator<Prisma.StructureInStructureGroupCreateManyArgs>()({
        data: {
          name: item.name,
          structureGroupId: structure.id
        },
      });
          await db.structureInStructureGroup.create(structureInStructureGroupArgs);
        } catch (error) {
          throw handlePrismaError(error, 'Structure', item, { action: 'create' })
        }
      }
    } catch (error) {
      throw handlePrismaError(error, 'Structure Group', input, { action: 'create' })
    }
  }

  static async updateStructureGroup(input: StructureGroupUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const taxonomyArgs = Prisma.validator<Prisma.StructureGroupsUpdateArgs>()({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
        },
    });
    const updatedStructure = await this.structureRepository().update(taxonomyArgs);

    for (const item of input.structureInStructureGroup) {
        try {
      const structureInStructureGroupArgs : any = Prisma.validator<any>()({
          where: {
            id: item.id,
          },
          create: {
            name: item.name,
            structureGroupId: item.structureGroupId
          },
          update: {
            name: item.name,
            structureGroupId: item.structureGroupId
          },
      });

      await db.structureInStructureGroup.upsert(structureInStructureGroupArgs);
        } catch (error) {
          throw handlePrismaError(error, 'Structure', item, { action: 'update' })
        }
      }
    } catch (error) {
      throw handlePrismaError(error, 'Structure Group', input, { action: 'update' })
    }
  }

  static async deleteStructureGroup(input: StructureGroupDeleteTypeInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const structureGroupDeleteArgs = Prisma.validator<Prisma.StructureGroupsDeleteArgs>()({
      where: {
        id: input.id,
      },
    });

    return await db.structureGroups.delete(structureGroupDeleteArgs);
    } catch (error) {
      throw handlePrismaError(error, 'Structure Group', undefined, { 
        action: 'delete',
        context: 'in one or more sessions'
      })
    }
  }

  static async deleteStructureInStructureGroup(input: StructureGroupDeleteTypeInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const structureInStructureGroupArgs = Prisma.validator<Prisma.StructureInStructureGroupDeleteArgs>()({
      where: {
        id: input.id,
      },
    });

    return await db.structureInStructureGroup.delete(structureInStructureGroupArgs);
    } catch (error) {
      throw handlePrismaError(error, 'Structure', undefined, { 
        action: 'delete',
        context: 'in one or more sessions'
      })
    }
  }
}