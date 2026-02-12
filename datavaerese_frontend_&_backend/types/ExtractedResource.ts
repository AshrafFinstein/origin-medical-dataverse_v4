import type { ExtractedResource, ExtractedResourceStatus, Prisma } from '@prisma/client'
import type { inferRouterInputs } from '@trpc/server'
import type { Result } from './CESession'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>
export type ListExtractedResourcesInDLSessionInput = RouterInput['extractedResource']['listDLSession']
export type ListExtractedResourcesInCESessionInput = RouterInput['cESession']['listExtractedResources']

export type ExtractedResourceLong = ExtractedResource & {
  fullPath: string
  thumbnailPath: string
  status: ExtractedResourceStatus
  labelIds: string[]
  isNextApprover: boolean,
  isFinalApproval: boolean,
  isCurrApprover : boolean,
  isReSubmitApprover : boolean
  approvalLevel: string
  comment: string
}

export type ExtractedResourceLongPageCount = {
  pageNumber: string
  imageIndex: string
}

export type PrismaExtractedResourceWithLabelsAndStatus = Prisma.ExtractedResourceGetPayload<{
  include: {
    dLSessions: {
      select: {
        status: true
        labels: {
          select: {
            label: true
          }
        }
      }
    }
  }
}>

export type PrismaCEExtractedResourceShort = Prisma.ExtractedResourceGetPayload<{
  include: {
    cESessions: {
      select: {
        status: true
        index: true
      }
    }
  }
}>

export type PrismaCEExtractedResourceLong = Prisma.ExtractedResourceGetPayload<{
  include: {
    cESessions: {
      select: {
        id: true
        status: true
        index: true
      }
    }
    extractedResource: {
      select: {
        id: true
        result: true
      }
    }
  }
}>

export interface ExtractedResourceMetadata {
  height: number
  width: number
  pixelResolution: number
  type: string
  comment: string
}

export interface CEExtractedResourceShort {
  id: string
  fullPath: string
  index: number
  status: ExtractedResourceStatus
}

export interface CEExtractedResourceLong extends ExtractedResource {
  fullPath: string
  index: number
  status: ExtractedResourceStatus
  result: Result
}
