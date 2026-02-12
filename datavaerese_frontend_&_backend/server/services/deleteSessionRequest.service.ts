import { TRPCError } from '@trpc/server'
import { TOKEN, resolve } from '../di'
import type { DeleteSessionRequestCreateInput } from '../trpc/routers/deleteSessionRequest'
import { Auth0Service } from './auth0.service'
import { DateTime } from 'luxon'
import { db } from '../infrastructures/database'
import { Module } from '~/types/enum'

export class DeleteSessionRequestService {
  static readonly deleteSessionRequestRepository = resolve(TOKEN.deleteSessionRequestRepository)
  

  static async checkIfApproverExists(): Promise<boolean> {
    try {
      // Step 1: Check if "Delete Request" action exists in Actions table
      const deleteRequestAction = await db.actions.findFirst({
        where: {
          name: 'Delete Request',
          deletedAt: null,
        },
      })
      if (!deleteRequestAction) {
        return false
      }

      // Step 2: Check if that action is mapped to ModuleActionMapping table with Module 3 (Session)
      const moduleActionMapping = await db.moduleActionMapping.findFirst({
        where: {
          moduleId: Module.Session, // Module 3 - Session
          actionId: deleteRequestAction.id,
          deletedAt: null,
        },
      })
      if (!moduleActionMapping) {
        return false
      }

      // Step 3: Check if that ModuleActionMapping.id is mapped in RoleModuleActionMapping table
      const roleModuleActionMappings = await db.roleModuleActionMapping.findMany({
        where: {
          moduleActionMappingId: moduleActionMapping.id,
          deletedAt: null,
        },
        select: {
          roleId: true,
        },
      })
      if (roleModuleActionMappings.length === 0) {
        return false
      }

      const roleIds = roleModuleActionMappings.map((mapping) => mapping.roleId)

      // Step 4: Check if that role is assigned to some user in UserRoleMapping table
      const userRoleMapping = await db.userRoleMapping.findFirst({
        where: {
          roleId: {
            in: roleIds,
          },
          deletedAt: null,
        },
      })
      return !!userRoleMapping
    } catch (error) {
      console.error('Error checking if approver exists:', error)
      return false
    }
  }

  static async create(
    input: DeleteSessionRequestCreateInput,
    userId: string | undefined,
    userEmail: string | undefined,
  ) {
    if (!userId || !userEmail) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required' })
    }

    if (!input.reason || input.reason.trim().length === 0) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: 'Reason is required for delete session request' 
      })
    }

    // Check if there are any users assigned to approve delete requests
    const hasApprover = await this.checkIfApproverExists()
    
    if (!hasApprover) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No user assigned to approve delete',
      })
    }

    

    const args = {
      data: {
        dLSessionId: input.dLSessionId,
        requestedBy: userId, // Store user ID (UUID) instead of email
        reason: input.reason.trim(),
        status: 'PENDING' as const,
        actionBy: userId,
        actionAt: DateTime.now().toJSDate(),
      },
    }

    return this.deleteSessionRequestRepository().create(args)
  }

  /**
   * Find many delete session requests
   * @param dLSessionId - Optional filter by DL session ID
   * @returns Array of delete session requests
   */
  static async findMany(dLSessionId?: string) {
    const args = dLSessionId
      ? {
          where: {
            dLSessionId,
          },
          orderBy: {
            createdAt: 'desc' as const,
          },
        }
      : {
          orderBy: {
            createdAt: 'desc' as const,
          },
        }

    return this.deleteSessionRequestRepository().findMany(args)
  }

  static async findOne(id: string) {
    return this.deleteSessionRequestRepository().findOne({
      where: {
        id,
      },
    })
  }

  static async approve(id: string, approverUserId: string) {
    // First, verify the request exists and get it
    const request = await this.deleteSessionRequestRepository().findOne({
      where: { id },
    })

    if (!request) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Delete session request not found',
      })
    }

    // Verify the user is the assigned approver


    // Check if request is already processed
    if (request.status !== 'PENDING') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Request is already ${request.status.toLowerCase()}`,
      })
    }

    // Update the delete session request status to APPROVED
    const updatedRequest = await this.deleteSessionRequestRepository().update({
      where: { id },
      data: {
        status: 'APPROVED',
        actionBy: id,
        actionAt: DateTime.now().toJSDate(),
      },
    })

    // Set deletedAt on the DLSession
    const deletedAt = DateTime.now().toJSDate()
    await db.dLSession.update({
      where: { id: request.dLSessionId },
      data: { deletedAt },
    })

    return updatedRequest
  }

  static async reject(id: string, approverUserId: string, rejectionReason?: string) {
    // First, verify the request exists and get it
    const request = await this.deleteSessionRequestRepository().findOne({
      where: { id },
    })

    if (!request) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Delete session request not found',
      })
    }

    // Check if request is already processed
    if (request.status !== 'PENDING') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Request is already ${request.status.toLowerCase()}`,
      })
    }

    // Update the delete session request status to REJECTED with optional rejection reason
    return this.deleteSessionRequestRepository().update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectionReason?.trim() || null,
        actionBy: id,
        actionAt: DateTime.now().toJSDate(),
      },
    })
  }
}

