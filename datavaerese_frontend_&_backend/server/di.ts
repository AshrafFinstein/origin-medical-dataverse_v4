import { Container, createResolve, token } from '@owja/ioc'
import type { IAuth0UserRepository } from './infrastructures/auth0/repositories'
import type { ICESessionRepository, IDLSessionRepository, IEpicRepository, ITaxonomyRepository, ITaxonomyInDLSessionsRepository, ITaxonomyInCESessionsRepository, IExtractedResourceRepository, ILabelRepository, ILabelInDLSessionsRepository, IProjectRepository, ITimeSpentInExtractedResourcesRepository, ITimeSpentInDLSessionRepository, IApprovalModuleRepository, IStructureRepository, IStructureGroupInCESessionsRepository, IStructureDataInCESessionsRepository, IUserGroupRepository, IDeleteSessionRequestRepository } from './infrastructures/database/repositories'
import type { IS3Repository } from './infrastructures/cloud/repositories'
import { Auth0UserRepository } from './infrastructures/auth0/repositories'
import { CESessionRepository, DLSessionRepository, EpicRepository, TaxonomyRepository, TaxonomyInDLSessionsRepository, TaxonomyInCESessionsRepository, ExtractedResourceRepository, LabelRepository, LabelInDLSessionsRepository, ProjectRepository, TimeSpentInExtractedResourcesRepository, TimeSpentInDLSessionRepository, ApprovalModuleRepository, StructureRepository, StructureGroupInCESessionsRepository, StructureDataInCESessionsRepository, UserGroupRepository, DeleteSessionRequestRepository } from './infrastructures/database/repositories'
import { DLSessionJsonRepository, IDLSessionJsonRepository } from './infrastructures/database/repositories/dlsessionjson.repository'
import { S3Repository } from './infrastructures/cloud/repositories'
import { IRolePermissionRepository, RolePermissionRepository } from './infrastructures/database/repositories/rolePermission.repository'
import { AnnotationRepository, IAnnotationRepository } from './infrastructures/database/repositories/annotation.repository'
import { c } from 'naive-ui'
import { ITaxonomiesAnnotationsInDLSessionsRepository, TaxonomiesAnnotationsInDLSessionsRepository } from './infrastructures/database/repositories/taxonomiesAnnotationInDlSession'
import { SessionLabelRepository, ISessionLabelRepository } from './infrastructures/database/repositories/sessionLabel.repository'

const container = new Container()
const resolve = createResolve(container)

const TOKEN = {
  auth0UserRepository: token<IAuth0UserRepository>('Auth0UserRepository'),
  extractedResourceRepository: token<IExtractedResourceRepository>('ExtractedResourceRepository'),
  labelRepository: token<ILabelRepository>('LabelRepository'),
  labelInDLSessionsRepository: token<ILabelInDLSessionsRepository>('LabelInDLSessionsRepository'),
  taxonomyInDLSessionsRepository: token<ITaxonomyInDLSessionsRepository>('TaxonomyInDLSessionsRepository'),
  taxonomyInCESessionsRepository: token<ITaxonomyInCESessionsRepository>('TaxonomyInCESessionsRepository'),
  epicRepository: token<IEpicRepository>('EpicRepository'),
  taxonomyRepository: token<ITaxonomyRepository>('TaxonomyRepository'),
  projectRepository: token<IProjectRepository>('ProjectRepository'),
  dLSessionRepository: token<IDLSessionRepository>('DLSessionRepository'),
  dLSessionJsonRepository: token<IDLSessionJsonRepository>('DLSessionJsonRepository'),
  cESessionRepository: token<ICESessionRepository>('CESessionRepository'),
  s3Repository: token<IS3Repository>('S3Repository'),
  timeSpentInExtractedResourcesRepository : token<TimeSpentInExtractedResourcesRepository>('TimeSpentInExtractedResourcesRepository'),
  TimeSpentInDLSessionRepository : token<TimeSpentInDLSessionRepository>('TimeSpentInDLSessionRepository'),
  approvalModuleRepository: token<IApprovalModuleRepository>('ApprovalModuleRepository'),
  structureRepository: token<IStructureRepository>('StructureRepository'),
  structureGroupInCESessionsRepository: token<IStructureGroupInCESessionsRepository>('StructureGroupInCESessionsRepository'),
  structureDataInCESessionsRepository: token<IStructureDataInCESessionsRepository>('StructureDataInCESessionsRepository'),
  userGroupRepository: token<IUserGroupRepository>('UserGroupRepository'),
  rolePermissionRepository: token<IRolePermissionRepository>('RolePermissionRepository'),
  annotationRepository: token<IAnnotationRepository>('AnnotationRepository'),
  taxonomiesAnnotationsInDLSessionsRepository: token<ITaxonomiesAnnotationsInDLSessionsRepository>('TaxonomiesAnnotationsInDLSessionsRepository'),
  sessionLabelRepository: token<ISessionLabelRepository>('SessionLabelRepository'),
  deleteSessionRequestRepository: token<IDeleteSessionRequestRepository>('DeleteSessionRequestRepository'),
}

container.bind<IS3Repository>(TOKEN.s3Repository).to(S3Repository)

container.bind<IAuth0UserRepository>(TOKEN.auth0UserRepository).to(Auth0UserRepository)

container.bind<IExtractedResourceRepository>(TOKEN.extractedResourceRepository).to(ExtractedResourceRepository)
container.bind<ILabelRepository>(TOKEN.labelRepository).to(LabelRepository)
container.bind<ILabelInDLSessionsRepository>(TOKEN.labelInDLSessionsRepository).to(LabelInDLSessionsRepository)
container.bind<ITaxonomyInDLSessionsRepository>(TOKEN.taxonomyInDLSessionsRepository).to(TaxonomyInDLSessionsRepository)
container.bind<ITaxonomyInCESessionsRepository>(TOKEN.taxonomyInCESessionsRepository).to(TaxonomyInCESessionsRepository)

container.bind<IEpicRepository>(TOKEN.epicRepository).to(EpicRepository)
container.bind<ITaxonomyRepository>(TOKEN.taxonomyRepository).to(TaxonomyRepository)
container.bind<IProjectRepository>(TOKEN.projectRepository).to(ProjectRepository)
container.bind<IDLSessionRepository>(TOKEN.dLSessionRepository).to(DLSessionRepository)
container.bind<IDLSessionJsonRepository>(TOKEN.dLSessionJsonRepository).to(DLSessionJsonRepository)
container.bind<ICESessionRepository>(TOKEN.cESessionRepository).to(CESessionRepository)
container.bind<ITimeSpentInExtractedResourcesRepository>(TOKEN.timeSpentInExtractedResourcesRepository).to(TimeSpentInExtractedResourcesRepository)
container.bind<ITimeSpentInDLSessionRepository>(TOKEN.TimeSpentInDLSessionRepository).to(TimeSpentInDLSessionRepository)
container.bind<IApprovalModuleRepository>(TOKEN.approvalModuleRepository).to(ApprovalModuleRepository)

container.bind<IStructureRepository>(TOKEN.structureRepository).to(StructureRepository)
container.bind<IStructureGroupInCESessionsRepository>(TOKEN.structureGroupInCESessionsRepository).to(StructureGroupInCESessionsRepository)
container.bind<IStructureDataInCESessionsRepository>(TOKEN.structureDataInCESessionsRepository).to(StructureDataInCESessionsRepository)
container.bind<IUserGroupRepository>(TOKEN.userGroupRepository).to(UserGroupRepository)
container.bind<IRolePermissionRepository>(TOKEN.rolePermissionRepository).to(RolePermissionRepository)
container.bind<IAnnotationRepository>(TOKEN. annotationRepository).to(AnnotationRepository)
container.bind<ITaxonomiesAnnotationsInDLSessionsRepository>(TOKEN.taxonomiesAnnotationsInDLSessionsRepository).to(TaxonomiesAnnotationsInDLSessionsRepository)
container.bind<ISessionLabelRepository>(TOKEN.sessionLabelRepository).to(SessionLabelRepository)
container.bind<IDeleteSessionRequestRepository>(TOKEN.deleteSessionRequestRepository).to(DeleteSessionRequestRepository)

export { container, TOKEN, resolve }
