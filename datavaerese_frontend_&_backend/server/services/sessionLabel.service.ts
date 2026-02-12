import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { TRPCError } from '@trpc/server'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import { db } from '../infrastructures/database'
import type { SessionLabelCreateManyInput, SessionLabelFindManyInput, SessionLabelUpdateManyInput, SessionLabelDeleteInput } from '../trpc/routers/sessionLabel'

export class SessionLabelService {
  static readonly sessionLabelRepository = resolve(TOKEN.sessionLabelRepository)

  static async findMany(input?: SessionLabelFindManyInput) {
    try {
    const args = Prisma.validator<Prisma.SessionLabelFindManyArgs>()({
      where: {
        deletedAt: null, // Only show non-deleted records
        ...(input?.search
          ? {
              OR: [
                { name: { contains: input.search, mode: 'insensitive' } },
                { description: { contains: input.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: input?.sort,
      skip: input?.offset,
      take: input?.limit,
    })
    const queryPromise = this.sessionLabelRepository().findMany(args)
    const countPromise = this.sessionLabelRepository().count({
      where: args.where,
    })
    const [queryResult, totalCount] = await Promise.all([queryPromise, countPromise])
    
    return [queryResult, totalCount]
    } catch (error) {
      throw handlePrismaReadError(error, 'Session Label', 'findMany')
    }
  }

  static async createNewSessionLabel(input: SessionLabelCreateManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    try {
      const sessionLabelArgs = Prisma.validator<Prisma.SessionLabelCreateArgs>()({
        data: {
          name: input.name,
          description: input.description,
          colorCode: input.colorCode,
          deletedAt: null, // Explicitly set to null for new records
        },
      })
      const sessionLabel = await this.sessionLabelRepository().create(sessionLabelArgs)
      return sessionLabel
    } catch (error) {
      throw handlePrismaError(error, 'Session Label', input, { action: 'create' })
    }
  }

  static async updateSessionLabel(input: SessionLabelUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    try {
      const sessionLabelArgs = Prisma.validator<Prisma.SessionLabelUpdateArgs>()({
        where: {
          id: input.id,
        },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.colorCode !== undefined && { colorCode: input.colorCode }),
        },
      })
      const sessionLabel = await this.sessionLabelRepository().update(sessionLabelArgs)
      return sessionLabel
    } catch (error) {
      throw handlePrismaError(error, 'Session Label', input, { action: 'update' })
    }
  }

  static async getSessionLabelUsageCount(sessionLabelId: string) {
    try {
      // Count how many DL Sessions are using this session label (only active ones)
      const count = await db.sessionLabelsInDLSessions.count({
        where: {
          sessionLabelId: sessionLabelId,
          isActive: true,
        },
      })
      
      // Get the list of sessions using this label (only active ones)
      const sessions = await db.sessionLabelsInDLSessions.findMany({
        where: {
          sessionLabelId: sessionLabelId,
          isActive: true,
        },
        select: {
          dLSession: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      
      return {
        count,
        sessions: sessions.map(s => ({
          id: s.dLSession.id,
          name: s.dLSession.name,
        })),
      }
    } catch (error) {
      throw handlePrismaReadError(error, 'Session Label', 'findMany')
    }
  }

  static async deleteSessionLabel(input: SessionLabelDeleteInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    try {
      // Soft delete by setting deletedAt instead of hard deleting
      const sessionLabelArgs = Prisma.validator<Prisma.SessionLabelUpdateArgs>()({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
        },
      })
      const sessionLabel = await this.sessionLabelRepository().update(sessionLabelArgs)
      return sessionLabel
    } catch (error) {
      throw handlePrismaError(error, 'Session Label', undefined, { 
        action: 'delete',
        context: 'in one or more sessions'
      })
    }
  }
}

