import type { ExtractedResourceStatus } from '@prisma/client'

interface ExtractedResourceDownloadFilter {
  sessionName?: string
  dLSessionId: string
  labelIds?: string[]
  patientId?: string
  unLabelled?: boolean
  unAnnotated?: boolean
  annotated?: boolean
  isApproved?: boolean
  imageId?: string
  status?: ExtractedResourceStatus
  name?: string,
  versionName?: string
  purpose?: string
}

interface ExtractedResourceDownloadCESessionFilter {
  sessionName?: string
  cESessionId: string
  status?: ExtractedResourceStatus
}

async function downloadExtractedResources(filter: ExtractedResourceDownloadFilter) {
  const config = useRuntimeConfig()
  const streamSaver = await import('streamsaver')

  const params = new URLSearchParams()

  params.set('dLSessionId', filter.dLSessionId)
  if (filter.labelIds !== undefined) {
    for (const labelId of filter.labelIds)
      params.append('labelIds', labelId)
  }
  if (filter.patientId !== undefined)
    params.set('patientId', filter.patientId)
  if (filter.status !== undefined)
    params.set('status', filter.status)

  if (filter.name !== undefined)
    params.set('name', filter.name)

  if (filter.versionName !== undefined)
    params.set('versionName', filter.versionName)

  if (filter.purpose !== undefined)
    params.set('purpose', filter.purpose)

  const res = await fetch(`${config.public.API_URL}/api/extracted-resource/download?${params.toString()}`)
  const fileStream = streamSaver.createWriteStream(`${filter.sessionName}.json`)
  const writer = fileStream.getWriter()
  const reader = res.body?.getReader()

  const pump: () => Promise<any> | undefined = () =>
    reader?.read().then(({ value, done }) => {
      if (done)
        writer.close()
      else
        writer.write(value).then(pump)
    })
  pump()
}

async function fetchExtractedResourcesJSON(filter: ExtractedResourceDownloadFilter): Promise<string> {
  const config = useRuntimeConfig()
  const params = new URLSearchParams()

  params.set('dLSessionId', filter.dLSessionId)
  if (filter.labelIds !== undefined) {
    for (const labelId of filter.labelIds)
      params.append('labelIds', labelId)
  }
  if (filter.patientId !== undefined)
    params.set('patientId', filter.patientId)
  if (filter.status !== undefined)
    params.set('status', filter.status)
  if (filter.name !== undefined)
    params.set('name', filter.name)
  if (filter.versionName !== undefined)
    params.set('versionName', filter.versionName)
  if (filter.purpose !== undefined)
    params.set('purpose', filter.purpose)

  const res = await fetch(`${config.public.API_URL}/api/extracted-resource/download?${params.toString()}`)
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  let jsonString = ''

  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      jsonString += decoder.decode(value, { stream: true })
    }
  }

  return jsonString
}

async function downloadExtractedResourcesCESession(filter: ExtractedResourceDownloadCESessionFilter) {
  const config = useRuntimeConfig()
  const streamSaver = await import('streamsaver')

  const params = new URLSearchParams()

  params.set('cESessionId', filter.cESessionId)
  if (filter.status !== undefined)
    params.set('status', filter.status)

  const res = await fetch(`${config.public.API_URL}/api/extracted-resource/downloadCESession?${params.toString()}`)
  const fileStream = streamSaver.createWriteStream(`${filter.sessionName}.json`)
  const writer = fileStream.getWriter()
  const reader = res.body?.getReader()

  const pump: () => Promise<any> | undefined = () =>
    reader?.read().then(({ value, done }) => {
      if (done)
        writer.close()
      else
        writer.write(value).then(pump)
    })
  pump()
}

async function downloadVersionMetadata(versionId: string, fileName: string) {
  const config = useRuntimeConfig()
  const streamSaver = await import('streamsaver')

  const params = new URLSearchParams()
  params.set('versionId', versionId)

  const res = await fetch(`${config.public.API_URL}/api/extracted-resource/download?${params.toString()}`)
  
  if (!res.ok) {
    throw new Error(`Failed to download version: ${res.statusText}`)
  }

  const fileStream = streamSaver.createWriteStream(fileName)
  const writer = fileStream.getWriter()
  const reader = res.body?.getReader()

  const pump: () => Promise<any> | undefined = () =>
    reader?.read().then(({ value, done }) => {
      if (done)
        writer.close()
      else
        writer.write(value).then(pump)
    })
  pump()
}

export default () => {
  return {
    downloadExtractedResources,
    downloadExtractedResourcesCESession,
    fetchExtractedResourcesJSON,
    downloadVersionMetadata
  }
}
