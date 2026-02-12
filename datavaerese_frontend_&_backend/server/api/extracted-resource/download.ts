import { ExtractedResourceStatus } from '@prisma/client'
import { z } from 'zod'
import { ExtractedResourceService, DLSessionService } from '~/server/services'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Check if this is a version download request
  if (query.versionId) {
    try {
      const schema = z.strictObject({
        versionId: z.string().uuid(),
      })
      const input = schema.parse({ versionId: query.versionId })
      
      // Get user from context
      const session = event.context.session
      const user = session?.user
      if (!user?.sub) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized'
        })
      }

      const result = await DLSessionService.getVersionMetadata(input.versionId, user.sub)
      
      if (!result.success || !result.versionMetaData) {
        throw createError({
          statusCode: 404,
          message: 'Version not found'
        })
      }

      // Set headers for JSON download
      setHeader(event, 'Content-Type', 'application/json')
      setHeader(event, 'Content-Disposition', `attachment; filename="${result.fileName}"`)
      
      // Ensure versionMetaData is an array and stream it in the same format as regular downloads
      // (compact JSON, no pretty-printing, matching the structure from stream method)
      const versionData = Array.isArray(result.versionMetaData) 
        ? result.versionMetaData 
        : [result.versionMetaData]
      
      // Stream the JSON data in the same format as regular downloads (compact, no indentation)
      event.node.res.write(JSON.stringify(versionData))
      event.node.res.end()
      return
    }
    catch (e: any) {
      if (e.statusCode) {
        throw e
      }
      throw createError({
        statusCode: 400,
        message: e.message || 'Invalid input'
      })
    }
  }

  // Original extracted resources download logic
  let input
  try {
    const schema = z.strictObject({
      dLSessionId: z.string().uuid(),
      labelIds: z.string().uuid().array().optional(),
      patientId: z.string().optional(),
      status: z.nativeEnum(ExtractedResourceStatus).optional(),
      name: z.string().optional(),
      versionName:  z.string().optional(),
      purpose:  z.string().optional()
    })
    const query = getQuery(event)
    const labelIds = query.labelIds === undefined ? undefined : (Array.isArray(query.labelIds) ? query.labelIds : [query.labelIds])
    input = schema.parse({ ...query, labelIds })
  }
  catch (e: any) {
    throw new Error(e)
  }
  let atFirstResource = true
  event.node.res.write('[')
  for await (const resource of ExtractedResourceService.stream({ ...input, batchSize: 5000 })) {
    if (!atFirstResource)
      event.node.res.write(', ')
    event.node.res.write(JSON.stringify(resource))
    atFirstResource = false
  }

  event.node.res.write(']')
  event.node.res.end()
})
