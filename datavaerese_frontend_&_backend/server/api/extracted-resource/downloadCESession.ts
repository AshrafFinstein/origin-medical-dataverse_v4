import { ExtractedResourceStatus } from '@prisma/client'
import { z } from 'zod'
import { ExtractedResourceService } from '~/server/services'

export default defineEventHandler(async (event) => {
  let input
  try {
    const schema = z.strictObject({
      cESessionId: z.string().uuid(),
      status: z.nativeEnum(ExtractedResourceStatus).optional(),
    })
    const query = getQuery(event)
    input = schema.parse({ ...query })
  }
  catch (e: any) {
    throw new Error(e)
  }
  let atFirstResource = true
  event.node.res.write('[')
  for await (const resource of ExtractedResourceService.streamCESession({ ...input, batchSize: 5000 })) {
    if (!atFirstResource)
      event.node.res.write(', ')
    event.node.res.write(JSON.stringify(resource))
    atFirstResource = false
  }

  event.node.res.write(']')
  event.node.res.end()
})
