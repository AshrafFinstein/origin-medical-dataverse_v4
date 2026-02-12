import type { PrismaPromise } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { db } from '..'
import type { DLSessionWithLabelsAndUsers, DLSessionWithUsers } from '~/types/DLSession'

export type TaxonomyDataInDLSessionsCreateManyArgs = {
  dLSessionId: string,
  extractedResourceId: string,
  typesInTaxonomyId: string,
  taxonomiesAnnotationsInDLSessionsId: string,
  taxonomyData: object,
  createdBy: string,
  updatedBy: string,
}

export type TaxonomyDataInDLSessionsCreateManyArgs1 = {
  data: TaxonomyDataInDLSessionsCreateManyArgs
  skipDuplicates?: boolean
}

export type AnnotationDetailsFindManyArgs = {
  annotationId: string[];
}

export interface IDLSessionJsonRepository {
  findMany(args?: Prisma.DLSessionFindManyArgs): Promise<DLSessionWithUsers[]>
  findOne(args: Prisma.DLSessionFindUniqueArgs): Promise<DLSessionWithLabelsAndUsers | null>
  count(args?: Prisma.DLSessionCountArgs): Promise<number>
  create(args: Prisma.DLSessionCreateArgs): Promise<{ id: string }>
  update(args: Prisma.DLSessionUpdateArgs): Promise<{ id: string }>
  delete(args: Prisma.DLSessionDeleteArgs): Promise<{ id: string }>
  createManyExtractedResources(args: Prisma.ExtractedResourcesInDLSessionsCreateManyArgs): Promise<{ count: number }>
  createManyLabelsInExtractedResources(args: Prisma.LabelsInExtractedResourcesInDLSessionsCreateManyArgs): Promise<{ count: number }>
  updateExtractedResource(args: Prisma.ExtractedResourcesInDLSessionsUpdateArgs): Promise<{ extractedResourceId: string }>
  createManyTaxonomyDataInDLSessions(args: TaxonomyDataInDLSessionsCreateManyArgs1): Promise<{ count: number }>
  findAnnotationIdsInTaxonomiesAnotationInDlSession(args:TaxonomyDataInDLSessionsCreateManyArgs1):Promise<{annotationId:string}>
  findTypesInTaxonomyIds(args:TaxonomyDataInDLSessionsCreateManyArgs1):Promise<{typesInTaxonomyId:string}>
  createDLSessionJson(args: Prisma.DLSessionJsonCreateArgs): Promise<{ id: string }>
  findAnnotationDetailsWithType(args:AnnotationDetailsFindManyArgs):Promise<{annotationDetails:string}>

}

export class DLSessionJsonRepository implements IDLSessionJsonRepository {
  createDLSessionJson(args: Prisma.DLSessionJsonCreateArgs): PrismaPromise<any> {
    const selectArgs = Prisma.validator<Prisma.DLSessionSelect>()({
      id: true,
    })

    return db.dLSessionJson.create({
      ...args,
      select: selectArgs,
    })
  }

  
}
