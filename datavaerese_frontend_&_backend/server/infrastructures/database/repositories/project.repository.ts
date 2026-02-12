import { Prisma } from '@prisma/client'
import type { PrismaPromise } from '@prisma/client'
import { db } from '..'
import type { ProjectWithUsers } from '~/types/Project'

export interface IProjectRepository {
  findMany(args?: Prisma.ProjectFindManyArgs): Promise<ProjectWithUsers[]>
  count(args?: Prisma.ProjectCountArgs): Promise<number>
  findOne(args: Prisma.ProjectFindUniqueArgs): Promise<ProjectWithUsers | null>
  create(args: Prisma.ProjectCreateArgs): Promise<{ id: string }>
  update(args: Prisma.ProjectUpdateArgs): Promise<{ id: string }>
  delete(args: Prisma.ProjectDeleteArgs): Promise<{ id: string }>
}

export class ProjectRepository implements IProjectRepository {
  findMany(args?: Prisma.ProjectFindManyArgs): PrismaPromise<any> {
    const includeArgs = Prisma.validator<Prisma.ProjectInclude>()({
      users: true,
    })

    return db.project.findMany({
      ...args,
      include: {
        ...args?.include,
        ...includeArgs,
      },
    })
  }

  count(args?: Prisma.ProjectCountArgs): PrismaPromise<any> {
    return db.project.count(args)
  }

  findOne(args: Prisma.ProjectFindUniqueArgs): PrismaPromise<any> {
    const includeArgs = Prisma.validator<Prisma.ProjectInclude>()({
      users: true,
    })

    return db.project.findUnique({
      ...args,
      include: {
        ...args.include,
        ...includeArgs,
      },
    })
  }

  create(args: Prisma.ProjectCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ProjectSelect>()({
      id: true,
    })

    return db.project.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.ProjectUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ProjectSelect>()({
      id: true,
    })

    return db.project.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  delete(args: Prisma.ProjectDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.ProjectSelect>()({
      id: true,
    })

    return db.project.delete({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }
}
