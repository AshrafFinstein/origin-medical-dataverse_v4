import type { PrismaPromise } from '@prisma/client'
import { db } from '.'

export default function transaction(calls: Promise<any>[]) {
  return db.$transaction(calls as PrismaPromise<any>[])
}
