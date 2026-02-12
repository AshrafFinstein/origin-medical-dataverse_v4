/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import type { Context } from '~/server/trpc/context'
import { Module, Action } from '~/types/enum'
import { Prisma } from '@prisma/client'
import { db } from '../infrastructures/database'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST'
            && error.cause instanceof ZodError
            ? error.cause!.flatten()
            : null,
      },
    }
  },
})

export const router = t.router
export const middleware = t.middleware
export const mergeRouters = t.mergeRouters

const pathAbilityMap: { [key: string]: { module: Module, action: Action } } = {
  // EPIC
  'epic.create': { module: Module.EPIC, action: Action.CREATE },
  'epic.update': { module: Module.EPIC, action: Action.UPDATE },
  'epic.list': { module: Module.EPIC, action: Action.READ },
  'epic.delete': { module: Module.EPIC, action: Action.DELETE },

  // PROJECT
  'project.create': { module: Module.Project, action: Action.CREATE },
  'project.update': { module: Module.Project, action: Action.UPDATE },
  'project.list': { module: Module.Project, action: Action.READ },
  'project.delete': { module: Module.Project, action: Action.DELETE },

  // SESSION
  'dLSession.create': { module: Module.Session, action: Action.CREATE },
  'dLSession.update': { module: Module.Session, action: Action.UPDATE },
  'dLSession.list': { module: Module.Session, action: Action.READ },
  'dLSession.delete': { module: Module.Session, action: Action.DELETE },
  'dLSession.analyseSessionData': { module: Module.Session, action: Action.Analyse },
  'dLSession.lockSession': { module: Module.Session, action: Action.Lock },
  'dLSession.unlockSession': { module: Module.Session, action: Action.Lock },

  'cESession.create': { module: Module.Session, action: Action.CREATE },
  'cESession.update': { module: Module.Session, action: Action.UPDATE },
  'cESession.list': { module: Module.Session, action: Action.READ },
  'cESession.delete': { module: Module.Session, action: Action.DELETE },
  'cESession.analyseSessionData': { module: Module.Session, action: Action.Analyse },

  // LABEL
  'label.create': { module: Module.Label, action: Action.CREATE },
  'label.update': { module: Module.Label, action: Action.UPDATE },

  // TAXONOMY
  'taxonomy.createTaxonomy': { module: Module.Taxonomy, action: Action.CREATE },
  'taxonomy.updateTaxonomy': { module: Module.Taxonomy, action: Action.UPDATE },

  // STRUCTURES
  'structures.createStructureGroup': { module: Module.StructureGroup, action: Action.CREATE },
  'structures.updateStructureGroup': { module: Module.StructureGroup, action: Action.UPDATE },

  // STRUCTURES
  'userGroup.create': { module: Module.UserGroup, action: Action.CREATE },
  'userGroup.update': { module: Module.UserGroup, action: Action.UPDATE },

  // JSON
  'dLSession.linkExtractedResources': { module: Module.JSON, action: Action.UploadJSON },
  'cESession.linkExtractedResources': { module: Module.JSON, action: Action.UploadJSON },

  // Session Codes
  'sessionCodes.createAnatomyPlaneCode': { module: Module.SessionCodes, action: Action.CREATE },
  'sessionCodes.anatomyPlaneCode' : { module: Module.SessionCodes, action: Action.READ },
  'sessionCodes.updateAnatomyPlaneCode': { module: Module.SessionCodes, action: Action.UPDATE },

  'sessionCodes.createCenterCode': { module: Module.SessionCodes, action: Action.CREATE },
  'sessionCodes.centerCode' : { module: Module.SessionCodes, action: Action.READ },
  'sessionCodes.updateCenterCode': { module: Module.SessionCodes, action: Action.UPDATE },

  'sessionCodes.createProjectCode': { module: Module.SessionCodes, action: Action.CREATE },
  'sessionCodes.projectCode' : { module: Module.SessionCodes, action: Action.READ },
  'sessionCodes.updateProjectCode': { module: Module.SessionCodes, action: Action.UPDATE },

  'sessionCodes.createSubProjectCode': { module: Module.SessionCodes, action: Action.CREATE },
  'sessionCodes.subProjectCode' : { module: Module.SessionCodes, action: Action.READ },
  'sessionCodes.updateSubProjectCode': { module: Module.SessionCodes, action: Action.UPDATE },

  'sessionCodes.createUseCaseCode': { module: Module.SessionCodes, action: Action.CREATE },
  'sessionCodes.useCaseCode' : { module: Module.SessionCodes, action: Action.READ },
  'sessionCodes.updateUseCaseCode': { module: Module.SessionCodes, action: Action.UPDATE },

  'sessionCodes.createUserTypeCode': { module: Module.SessionCodes, action: Action.CREATE },
  'sessionCodes.userTypeCode' : { module: Module.SessionCodes, action: Action.READ },
  'sessionCodes.updateUserTypeCode': { module: Module.SessionCodes, action: Action.UPDATE },

  // User Roles
  'rolePermission.create': { module: Module.UserRoles, action: Action.CREATE },
  'rolePermission.list' : { module: Module.UserRoles, action: Action.READ },
  'rolePermission.update': { module: Module.UserRoles, action: Action.UPDATE },

  // Users
  'rolePermission.roleList' : { module: Module.Users, action: Action.READ },
  'rolePermission.updateUserRoleMappinglist': { module: Module.Users, action: Action.UPDATE },

  // Annotation
  'annotation.createAnnotation': { module: Module.Annotation, action: Action.CREATE },
  'annotation.updateAnnotation': { module: Module.Annotation, action: Action.UPDATE },

};

async function checkAbility(module: Module, action: Action, userId: string) {

  // Check if there is a mapping that matches the user's roles, action, and module
  const isAbility = await db.roleModuleActionMapping.findFirst({
    where: {
      Roles: {
        UserRoleMapping: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
      deletedAt: null,
      ModuleActionMapping: {
        deletedAt: null,
        moduleId: module,
        actionId: action,
      },
    },
  });
  
  if (!isAbility) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  } else {
    return true
  }
}

async function getAbility(module: Module, action: Action, userId: string) {
  // Check if there is a mapping that matches the user's roles, action, and module
  const isAbility = await db.roleModuleActionMapping.findFirst({
    where: {
      Roles: {
        UserRoleMapping: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
      deletedAt: null,
      ModuleActionMapping: {
        deletedAt: null,
        moduleId: module,
        actionId: action,
      },
    },
  });
  
  if (isAbility) {
    return true
  } else {
    return false
  }
}

const isAuthed = middleware(async(opts) => {
  const { ctx } = opts
  if (!ctx.user)
    throw new TRPCError({ code: 'UNAUTHORIZED' })


  const abilityCheck = pathAbilityMap[opts.path];
  if (abilityCheck) {
    await checkAbility(abilityCheck.module, abilityCheck.action, ctx.user.sub);
  }

  return opts.next({
    ctx: {
      user: ctx.user,
      userViewAllPermission: {
        epic: await getAbility(Module.EPIC, Action.VIEWALL, ctx.user.sub),
        project: await getAbility(Module.Project, Action.VIEWALL, ctx.user.sub),
        session: await getAbility(Module.Session, Action.VIEWALL, ctx.user.sub)
      }
    },
  })
})

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(isAuthed)
