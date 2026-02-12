import type { Prisma } from '@prisma/client'
import type { inferRouterInputs } from '@trpc/server'
import { LocationQueryValue } from '~/.nuxt/vue-router'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type CreateCESessionInput = RouterInput['cESession']['create']

export type CESessionWithUsers = Prisma.CESessionGetPayload<{
  include: { users: true }
}>

export type CESessionWithUsersAndWithoutResultTemplate = Prisma.CESessionGetPayload<{
  select: {
    id: true
    createdAt: true
    updatedAt: true
    name: true
    description: true
    priority: true
    users: true
  }
}>

export type MeasurementType = 'angle' | 'distance' | 'crossAngle'

export interface Assessment {
  index: number
  name: string
  options: string[]
  value?: string
}

export interface Measurement {
  index: number
  name: string
  type: MeasurementType
  points?: number[]
  value?: number
  isReliable?: boolean
}

export interface Section {
  index: number
  name: string
  measurements: Measurement[]
  assessments: Assessment[]
}

export interface Result {
  startAt: Date | null
  finishAt: Date | null
  sections: Section[]
}

export interface SectionTemplate {
  index: number
  name: string
  measurements: Pick<Measurement, 'index' | 'name' | 'type'>[]
  assessments: Pick<Assessment, 'index' | 'name' | 'options'>[]
}

export interface ResultTemplate {
  sections: SectionTemplate[]
}

export interface ISessionNameAutoGenerateCodes{
  projectCode : IGenerateSessionCode[];
  subProjectCode : IGenerateSessionCode[];
  useCaseCode : IGenerateSessionCode[];
  anatomyPlaneCode : IGenerateSessionCode[];
  centerCode : IGenerateSessionCode[];
  userTypeCode : IGenerateSessionCode[];
}

export interface IGenerateSessionCode {
  createdAt: Date ;
  id : string ;
  name : string ; 
  updatedAt : Date ;
}

export type TSessionCodeTabs = string | LocationQueryValue[];