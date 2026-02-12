import { publicProcedure, router } from '../trpc'
import { extractedResource } from './extractedResource'
import { auth0 } from './auth0'
import { cESession } from './cESession'
import { dLSession } from './dLSession'
import { epic } from './epic'
import { label } from './label'
import { project } from './project'
import { taxonomy } from './taxonomy'
import { timeSpent } from './timeSpent'
import { structures } from './structures'
import { userGroup } from './userGroup'
import { sessionCodes } from './sessionCodes'
import { rolePermission } from './rolePermission'
import { annotation } from './annotation'
import { sessionLabel } from './sessionLabel'
import { apiService } from './api'
import { deleteSessionRequest } from './deleteSessionRequest'

export const appRouter = router({
  health: publicProcedure.query(() => 'ok!'),
  auth0,
  extractedResource,
  label,
  epic,
  project,
  dLSession,
  cESession,
  taxonomy,
  annotation,
  timeSpent,
  structures,
  userGroup,
  sessionCodes,
  rolePermission,
  sessionLabel,
  apiService,
  deleteSessionRequest,
})

export type AppRouter = typeof appRouter
