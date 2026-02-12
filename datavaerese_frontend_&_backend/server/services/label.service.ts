import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import type { LabelCreateManyInput, LabelCreateSingleInput, LabelDeleteSingleInput, LabelFindManyInput, LabelFindSingleInput, LabelUpdateSingleInput } from '../trpc/routers/label'

export class LabelService {
  static readonly labelRepository = resolve(TOKEN.labelRepository)

  static async findMany(input?: LabelFindManyInput) {
    try {
    const args = Prisma.validator<Prisma.LabelFindManyArgs>()({
      where: {
        ...(input?.search
          ? {
              OR: [
                { name: { contains: input.search, mode: 'insensitive' } },
                { abbreviation: { contains: input.search, mode: 'insensitive' } },
              ],
            }
          : {}),
        dLSessions: input?.filter?.dLSessionId
          ? {
              some: {
                dLSessionId: input.filter.dLSessionId,
              },
            }
          : undefined,
        extractedResourcesInDLSessions: input?.filter?.dLSessionId && input?.filter?.extractedResourceId
          ? {
              some: {
                dLSessionId: input.filter.dLSessionId,
                extractedResourceId: input.filter.extractedResourceId,
              },
            }
          : undefined,
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })

      return await Promise.all([
      this.labelRepository().findMany(args),
      this.labelRepository().count(),
    ])
    } catch (error) {
      throw handlePrismaReadError(error, 'Label', 'findMany')
    }
  }

  static async find(input: LabelFindSingleInput) {
    try {
    const args = Prisma.validator<Prisma.LabelFindUniqueArgs>()({
      where: {
        id: input,
      },
    })
      return await this.labelRepository().findOne(args)
    } catch (error) {
      throw handlePrismaReadError(error, 'Label', 'find')
    }
  }

  static async createMany(input: LabelCreateManyInput) {
    try {
    const args = Prisma.validator<Prisma.LabelCreateManyArgs>()({
      data: input,
    })
      return await this.labelRepository().createMany(args)
    } catch (error) {
      throw handlePrismaError(error, 'Label', input, { action: 'create' })
    }
  }

  static async create(input: LabelCreateSingleInput) {
    try {
    const args = Prisma.validator<Prisma.LabelCreateArgs>()({
      data: input,
    })
      return await this.labelRepository().create(args)
    } catch (error) {
      throw handlePrismaError(error, 'Label', input, { action: 'create' })
    }
  }

  static async update(input: LabelUpdateSingleInput) {
    try {
    const args = Prisma.validator<Prisma.LabelUpdateArgs>()({
      where: {
        id: input.id,
      },
      data: input,
    })
      return await this.labelRepository().update(args)
    } catch (error) {
      throw handlePrismaError(error, 'Label', input, { action: 'update' })
    }
  }

  static async delete(input: LabelDeleteSingleInput) {
    try {
    const args = Prisma.validator<Prisma.LabelDeleteArgs>()({
      where: {
        id: input,
      },
    })
      return await this.labelRepository().delete(args)
    } catch (error) {
      throw handlePrismaError(error, 'Label', undefined, { 
        action: 'delete',
        context: 'in one or more sessions'
      })
    }
  }
}
