import { z } from 'zod'
import { ApiService } from '~/server/services/api.service'
import { Module, Action } from '~/types/enum'
import { db } from '~/server/infrastructures/database'

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
  
  return !!isAbility
}

export default defineEventHandler(async (event) => {
  // Set default handler to prevent H3 from serializing response
  event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  
  const query = getQuery(event)
  
  try {
    const schema = z.strictObject({
      dLSessionId: z.string().uuid(),
    })
    const input = schema.parse({ dLSessionId: query.dLSessionId })
    
    // Get user from context
    const session = event.context.session
    const user = session?.user
    if (!user?.sub) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Check if user is admin
    const isAdmin = user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    
    // Get user permissions for VIEWALL on Session module
    const canViewAll = await getAbility(Module.Session, Action.VIEWALL, user.sub)
    
    const result = await ApiService.findTaxonomyData(
      input,
      canViewAll,
      isAdmin,
      user.sub
    )

    if (!result || !result.excelFile) {
      throw createError({
        statusCode: 404,
        message: 'Taxonomy data not found or Excel file generation failed'
      })
    }

    // Convert base64 back to buffer
    const excelBuffer = Buffer.from(result.excelFile, 'base64')
    const fileName = result.fileName || 'taxonomy_data.xlsx'
    
    // Check if headers are already sent
    if (event.node.res.headersSent) {
      return
    }
    
    // Write headers and buffer directly to response using writeHead
    event.node.res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      'Content-Length': excelBuffer.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    })
    
    // Write the buffer and end the response
    event.node.res.write(excelBuffer)
    event.node.res.end()
    
    // Don't return anything - response is already sent
  } catch (e: any) {
    // If headers are already sent, we can't send error response
    if (event.node.res.headersSent) {
      event.node.res.end()
      return
    }
    
    if (e.statusCode) {
      throw e
    }
    throw createError({
      statusCode: 500,
      message: e.message || 'Failed to download taxonomy data'
    })
  }
})

