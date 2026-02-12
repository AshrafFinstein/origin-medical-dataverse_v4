import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { TRPCError } from '@trpc/server'
import type { TimeSpentInDLSessionCreateInput, TimeSpentInExtractedResourceCreateInput, TimeSpentInExtractedResourceUpdateInput } from '../trpc/routers/timeSpent'
import { db } from '../infrastructures/database'

export class TimeSpentService {
  static readonly timeSpentInExtractedResourceRepository = resolve(TOKEN.timeSpentInExtractedResourcesRepository)
  static readonly timeSpentInDLSessionRepository = resolve(TOKEN.TimeSpentInDLSessionRepository)

  static async createNewTimeSpentInExtractedResource(input: TimeSpentInExtractedResourceCreateInput, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    const timeSpentArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesCreateArgs>()({
      data: {
        userId: userId,
        extractedResourceId: input.extractedResourceId,
        dLSessionId: input.dLSessionId,
        startTime: new Date(input.startTime)
      }
    })
    const timeSpent = await this.timeSpentInExtractedResourceRepository().create(timeSpentArgs)
    return timeSpent
  }

  static async updateTimeSpentInExtractedResource(input: TimeSpentInExtractedResourceUpdateInput, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    // First verify the record belongs to the user
    const existingRecord = await this.timeSpentInExtractedResourceRepository().findFirst({
      where: {
        id: input.id,
        userId: userId
      }
    })

    if (!existingRecord)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Time spent record not found or access denied' });

    const updateArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesUpdateArgs>()({
      where: {
        id: input.id
      },
      data: {
        endTime: new Date(input.endTime)
      }
    })
    
    const updated = await this.timeSpentInExtractedResourceRepository().update(updateArgs)
    return updated
  }

  static async createNewTimeSpentInDLSession(input: TimeSpentInDLSessionCreateInput, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    const timeSpentArgs = Prisma.validator<Prisma.TimeSpentInDLSessionsCreateArgs>()({
      data: {
        userId: userId,
        dLSessionId: input.dlSessionId,
        startTime: new Date(input.startTime)
      }
    })
    const timeSpent = await this.timeSpentInDLSessionRepository().create(timeSpentArgs)
    return timeSpent
  }

  static async getTotalTimeSpentInDLSession(dLSessionId: string, userId: string | undefined, isAdmin: boolean) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Get time spent from TimeSpentInDLSessions (session-level time)
    const sessionTimeSpentArgs = Prisma.validator<Prisma.TimeSpentInDLSessionsFindManyArgs>()({
      where: {
        dLSessionId: dLSessionId,
        userId: userId,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    const sessionTimeSpentRecords = await this.timeSpentInDLSessionRepository().findMany(sessionTimeSpentArgs)
    
    // Calculate session-level time spent in milliseconds
    const sessionTimeMs = sessionTimeSpentRecords.reduce((total, record) => {
      const startTime = new Date(record.startTime).getTime()
      const endTime = new Date(record.endTime).getTime()
      return total + (endTime - startTime)
    }, 0)

    // Get time spent from TimeSpentInExtractedResources (image-level time)
    const imageTimeSpentArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesFindManyArgs>()({
      where: {
        dLSessionId: dLSessionId,
        userId: userId,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    const imageTimeSpentRecords = await db.timeSpentInExtractedResources.findMany(imageTimeSpentArgs)
    
    // Calculate image-level time spent in milliseconds
    const imageTimeMs = imageTimeSpentRecords.reduce((total, record) => {
      const startTime = new Date(record.startTime).getTime()
      const endTime = new Date(record.endTime).getTime()
      return total + (endTime - startTime)
    }, 0)

    // Total time = session time + image time
    const totalTimeMs = sessionTimeMs + imageTimeMs

    // Get count of images (extracted resources) in the DL session
    const imageCount = await db.extractedResourcesInDLSessions.count({
      where: {
        dLSessionId: dLSessionId,
      },
    })

    return {
      totalTimeMs,
      imageCount,
      isAdmin,
    }
  }

  static async getTimeSpentInExtractedResource(extractedResourceId: string, dLSessionId: string, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Now we can query directly using dLSessionId column (more efficient)
    const findArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesFindManyArgs>()({
      where: {
        extractedResourceId: extractedResourceId,
        dLSessionId: dLSessionId,
        userId: userId,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    const timeSpentRecords = await db.timeSpentInExtractedResources.findMany(findArgs)
    
    // Calculate total time spent in milliseconds
    const totalTimeMs = timeSpentRecords.reduce((total, record) => {
      const startTime = new Date(record.startTime).getTime()
      const endTime = new Date(record.endTime).getTime()
      return total + (endTime - startTime)
    }, 0)

    return {
      totalTimeMs,
    }
  }

  static async getAnnotatedImageTimeSpentInDLSession(dLSessionId: string, userId: string | undefined, isAdmin: boolean) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Get list of annotated extracted resource IDs
    // An image is considered annotated if it has taxonomy data OR labels
    const annotatedResourcesQuery = Prisma.sql`
      SELECT DISTINCT erid."extractedResourceId"
      FROM "ExtractedResourcesInDLSessions" erid
      WHERE erid."dLSessionId" = ${dLSessionId}
        AND (
          EXISTS (
            SELECT 1
            FROM "TaxonomyDataInDLSessions" tax
            WHERE tax."extractedResourceId" = erid."extractedResourceId"
              AND tax."dLSessionId" = erid."dLSessionId"
              AND tax."deletedAt" IS NULL
          )
          OR EXISTS (
            SELECT 1
            FROM "LabelsInExtractedResourcesInDLSessions" lier
            WHERE lier."extractedResourceId" = erid."extractedResourceId"
              AND lier."dLSessionId" = erid."dLSessionId"
              AND lier."deletedAt" IS NULL
          )
        )
    `;

    const annotatedResources = await db.$queryRaw<Array<{ extractedResourceId: string }>>(annotatedResourcesQuery);
    const annotatedResourceIds = annotatedResources.map(r => r.extractedResourceId);

    if (annotatedResourceIds.length === 0) {
      return {
        totalTimeMs: 0,
        annotatedImageCount: 0,
        isAdmin,
      };
    }

    // Get time spent ONLY from TimeSpentInExtractedResources for annotated images
    // We only count time spent on the specific annotated images, not session-level time
    const annotatedImageTimeSpentArgs = Prisma.validator<Prisma.TimeSpentInExtractedResourcesFindManyArgs>()({
      where: {
        dLSessionId: dLSessionId,
        userId: userId,
        extractedResourceId: {
          in: annotatedResourceIds,
        },
      },
      select: {
        startTime: true,
        endTime: true,
        extractedResourceId: true,
      },
    })

    const annotatedImageTimeSpentRecords = await db.timeSpentInExtractedResources.findMany(annotatedImageTimeSpentArgs)
    
    // Calculate annotated image-level time spent in milliseconds
    // Only count time spent on the annotated images themselves
    const totalTimeMs = annotatedImageTimeSpentRecords.reduce((total, record) => {
      const startTime = new Date(record.startTime).getTime()
      const endTime = new Date(record.endTime).getTime()
      return total + (endTime - startTime)
    }, 0)

    return {
      totalTimeMs,
      annotatedImageCount: annotatedResourceIds.length,
      isAdmin,
    }
  }
}