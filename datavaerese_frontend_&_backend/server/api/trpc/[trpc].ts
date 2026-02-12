import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '~/server/trpc/routers'
import { createContext } from '~/server/trpc/context'
import { ApiService } from '~/server/services/api.service'
import { Module, Action } from '~/types/enum'
import { db } from '~/server/infrastructures/database'

const handler = createNuxtApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error)
    }
  },
})

async function getAbility(module: Module, action: Action, userId: string) {
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
  const query = getQuery(event)
  
  // Check if this is getTaxonomyData or getLabelData request by URL path or query params
  const url = event.node.req.url || ''
  const path = (query.path as string) || ''
  
  // Check URL path and query parameter for procedure name
  const isGetTaxonomyDataPath = url.includes('getTaxonomyMasterData') || path.includes('getTaxonomyMasterData')
  const isGetLabelDataPath = url.includes('getLabelData') || path.includes('getLabelData')
  
  // Check if this is a download request for procedures that don't require input params
  if (isGetTaxonomyDataPath || isGetLabelDataPath) {
    try {
      // Check if it's getTaxonomyData or getLabelData request
      // These procedures don't require input params, so we check URL path and query params
      const isTaxonomyDataRequest = url.includes('apiService.getTaxonomyMasterData') || path.includes('apiService.getTaxonomyMasterData') || isGetTaxonomyDataPath
      const isLabelDataRequest = url.includes('apiService.getLabelData') || path.includes('apiService.getLabelData') || isGetLabelDataPath
      
      if (isTaxonomyDataRequest || isLabelDataRequest) {
        // Get user from context (same as tRPC does)
        const session = event.context.session
        const user = session?.user
        
        if (user?.sub) {
          // Check if user is admin
          const isAdmin = user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
          
          // Get user permissions for VIEWALL on Session module
          const canViewAll = await getAbility(Module.Session, Action.VIEWALL, user.sub)
          
          let result: any = null
          let defaultFileName = 'data.xlsx'
          
          // Call the appropriate service based on request type
          if (isTaxonomyDataRequest) {
            result = await ApiService.findTaxonomyData(
              canViewAll,
              isAdmin,
              user.sub
            )
            defaultFileName = 'taxonomy_data.xlsx'
          } else if (isLabelDataRequest) {
            result = await ApiService.getLabelData(
              canViewAll,
              user.sub
            )
            defaultFileName = 'labels_data.xlsx'
          }
          
          if (result?.excelFile) {
            const excelBuffer = Buffer.from(result.excelFile, 'base64')
            const fileName = result.fileName || defaultFileName
            
            // Check if headers already sent
            if (!event.node.res.headersSent) {
              // Set headers for binary download
              event.node.res.writeHead(200, {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
                'Content-Length': excelBuffer.length.toString(),
                'Cache-Control': 'no-cache'
              })
              
              // Write buffer and end response
              event.node.res.write(excelBuffer)
              event.node.res.end()
              return
            }
          }
        }
      }
    } catch (e) {
      // If parsing fails, continue with normal tRPC handling
      console.error('Error in binary download handler:', e)
    }
  }
  
  // Default tRPC handler for all other requests
  return handler(event)
})
