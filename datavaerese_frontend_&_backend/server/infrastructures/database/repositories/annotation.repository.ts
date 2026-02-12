import { Prisma } from '@prisma/client'
import type { Annotation, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface IAnnotationRepository {
  findMany(args?: Prisma.AnnotationFindManyArgs): Promise<Annotation[]>
  create(args: Prisma.AnnotationCreateArgs): Promise<{ id: string }>
  update(args: Prisma.AnnotationUpdateArgs): Promise<{ id: string }>
  count(args?: Prisma.AnnotationCountArgs): Promise<number>
  delete(args: Prisma.AnnotationDeleteArgs): Promise<{ id: string }>
}

export class AnnotationRepository implements IAnnotationRepository {
  findMany(args?: Prisma.AnnotationFindManyArgs): PrismaPromise<Annotation[]> {
    return db.annotation.findMany(args)
  }

  create(args: Prisma.AnnotationCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.AnnotationSelect>()({
      id: true,
    })

    return db.annotation.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.AnnotationUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.AnnotationSelect>()({
      id: true,
    })

    return db.annotation.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.AnnotationCountArgs): PrismaPromise<number> {
    return db.annotation.count(args)
  }

  delete(args: Prisma.AnnotationDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.AnnotationSelect>()({
      id: true,
    })

    return db.annotation.delete({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }
}