import { Prisma } from '@prisma/client'
import type { Label, PrismaPromise } from '@prisma/client'
import { db } from '..'

export interface ILabelRepository {
  findMany(args?: Prisma.LabelFindManyArgs): Promise<Label[]>
  findOne(args: Prisma.LabelFindUniqueArgs): Promise<Label | null>
  createMany(args: Prisma.LabelCreateManyArgs): Promise<{ count: number }>
  create(args: Prisma.LabelCreateArgs): Promise<{ id: string }>
  update(args: Prisma.LabelUpdateArgs): Promise<{ id: string }>
  delete(args: Prisma.LabelDeleteArgs): Promise<{ id: string }>
  count(args?: Prisma.LabelCountArgs): Promise<number>
}

export class LabelRepository implements ILabelRepository {
  findMany(args?: Prisma.LabelFindManyArgs): PrismaPromise<Label[]> {
    return db.label.findMany(args)
  }

  findOne(args: Prisma.LabelFindUniqueArgs) {
    return db.label.findUnique(args)
  }

  createMany(args: Prisma.LabelCreateManyArgs) {
    return db.label.createMany({
      ...args,
      skipDuplicates: true,
    })
  }

  create(args: Prisma.LabelCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.LabelSelect>()({
      id: true,
    })

    return db.label.create({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  update(args: Prisma.LabelUpdateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.LabelSelect>()({
      id: true,
    })

    return db.label.update({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  delete(args: Prisma.LabelDeleteArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.LabelSelect>()({
      id: true,
    })

    return db.label.delete({
      ...args,
      select: {
        ...args.select,
        ...selectArgs,
      },
    })
  }

  count(args?: Prisma.LabelCountArgs): PrismaPromise<number> {
    return db.label.count(args)
  }
}
