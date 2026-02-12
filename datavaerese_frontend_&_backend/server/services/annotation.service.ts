import { Prisma } from '@prisma/client'
import { TOKEN, resolve } from '../di'
import { TRPCError } from '@trpc/server'
import { handlePrismaError, handlePrismaReadError } from '../utils/errorMessages'
import { db } from '../infrastructures/database'
import type { AnnotationCreateManyInput, AnnotationFindManyInput, AnnotationUpdateManyInput, AnnotationDeleteInput } from '../trpc/routers/annotation'

export class AnnotationService {
  static readonly annotationRepository = resolve(TOKEN.annotationRepository)

  static async findMany(input?: AnnotationFindManyInput) {
    try {
    const args = Prisma.validator<Prisma.AnnotationFindManyArgs>()({
        where: {
            ...(input?.search
              ? {
                  OR: [
                    { name: { contains: input.search, mode: 'insensitive' } },
                    { abbreviation: { contains: input.search, mode: 'insensitive' } },
                  ],
                }
              : {}),
        },
        orderBy: input?.sort,
        skip: input?.offset,
        take: input?.limit,
        include: {
          taxonomyType: true,
        },
    });
    const queryPromise = this.annotationRepository().findMany(args);
    const countPromise = this.annotationRepository().count({
        where: args.where
    });
    const [queryResult, totalCount] = await Promise.all([queryPromise, countPromise]);
    
    return [queryResult, totalCount];
    } catch (error) {
      throw handlePrismaReadError(error, 'Annotation', 'findMany')
    }
  }

  static async createNewAnnotation(input: AnnotationCreateManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    try {
      const annotationArgs = Prisma.validator<Prisma.AnnotationCreateArgs>()({
        data: {
          name: input.name,
          abbreviation: input.abbreviation,
          colorCode: input.colorCode,
          taxonomyTypeId: input.taxonomyTypeId,
          createdBy: userId,
          updatedBy: userId
        },
      });
      const annotation = await this.annotationRepository().create(annotationArgs);
      return annotation;
    } catch (error) {
      throw handlePrismaError(error, 'Annotation', input, { action: 'create' })
    }
  }
  
  static async updateAnnotation(input: AnnotationUpdateManyInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    try {
      const annotationArgs = Prisma.validator<Prisma.AnnotationUpdateArgs>()({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          abbreviation: input.abbreviation,
          colorCode: input.colorCode,
          taxonomyTypeId: input.taxonomyTypeId,
          updatedBy: userId
        },
      });
      const updatedAnnotation = await this.annotationRepository().update(annotationArgs);
      return updatedAnnotation;
    } catch (error) {
      throw handlePrismaError(error, 'Annotation', input, { action: 'update' })
    }
  }
  static async deleteAnnotation(input: AnnotationDeleteInput, isAdmin: boolean, userId: string | undefined) {
    if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
    const annotationArgs = Prisma.validator<Prisma.AnnotationDeleteArgs>()({
        where: {
          id: input.id,
        },
    });

    const annotation = await this.annotationRepository().delete(annotationArgs);
    return annotation;
    } catch (error) {
      throw handlePrismaError(error, 'Annotation', undefined, { 
        action: 'delete',
        context: 'in one or more sessions'
      })
    }
  }
  static async fetchAllAnnotations() {
    try {
      const args = Prisma.validator<Prisma.AnnotationFindManyArgs>()({
        orderBy: {
          name: 'asc'
        },
        include: {
          taxonomyType: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      const annotations = await this.annotationRepository().findMany(args);
      //  console.log("annotations",annotations)
      // Format the annotations to match the expected structure by the client
      return annotations.map(annotation => ({
        id: annotation.id,
        name: annotation.name,
        abbreviation: annotation.abbreviation,
        colorCode: annotation.colorCode,
        taxonomyTypeId: annotation.taxonomyTypeId,
        taxonomyTypeName: annotation.taxonomyType?.name,
        createdAt: annotation.createdAt,
        updatedAt: annotation.updatedAt
      }));
    } catch (error) {
      throw handlePrismaReadError(error, 'Annotation', 'findMany')
    }
  }
}