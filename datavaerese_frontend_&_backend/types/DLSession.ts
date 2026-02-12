import type { Prisma } from '@prisma/client'
import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type CreateDLSessionInput = RouterInput['dLSession']['create']
export type ListPatientsInput = RouterInput['dLSession']['listPatients']

export type DLSessionWithUsers = Prisma.DLSessionGetPayload<{
  include: {
    users: true
  }
}>

export type DLSessionWithLabelsAndUsers = Prisma.DLSessionGetPayload<{
  include: {
    labels: {
      select: {
        label: true
      }
    }
    users: true
  }
}>

export interface IGenerateVersion{
  purposeForDownload : string | null;
  majorVersion : string | null;
  minorVersion : string | null;
  date : Date;
}