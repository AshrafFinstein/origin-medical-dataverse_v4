import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
  getSignedUrl,
} from '@aws-sdk/s3-request-presigner'

export interface IS3Repository {
  signUrl(key: string, bucket?: string): Promise<string>
  signThumbnailUrl(key: string, bucket?: string): Promise<string | boolean>
  uploadVersionJson(key: string, jsonData: any, bucket?: string): Promise<void>
  downloadVersionJson(key: string, bucket?: string): Promise<any>
  uploadFile(key: string, fileBuffer: Buffer, fileType: string, bucket?: string): Promise<void>
  uploadJsonToCustomBucket(key: string, jsonData: any, bucket?: string, region?: string): Promise<void>
  downloadJsonFromCustomBucketKey(key: string, bucket?: string, region?: string): Promise<any>
  checkFolderExists(folderPath: string, bucket?: string, region?: string): Promise<boolean>
}

export class S3Repository implements IS3Repository {
  private readonly defaultRegion: string | null
  private readonly clientCache: Map<string, S3Client>

  constructor() {
    // Try to get default region from config, but it's optional
    try {
      const { AWS_REGION } = useRuntimeConfig()
      this.defaultRegion = AWS_REGION || null
    } catch {
      this.defaultRegion = null
    }
    this.clientCache = new Map()
  }

  /**
   * Check if string is a valid S3 URI
   */
  private isValidS3Uri(uri: string): boolean {
    if (!uri || typeof uri !== 'string') {
      return false
    }
    return uri.startsWith('s3://') && uri.length > 5 && uri.includes('/', 5)
  }

  /**
   * Check if string is a valid HTTPS S3 URL
   */
  private isValidHttpsS3Url(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false
    }
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'https:' && 
             (urlObj.hostname.includes('.amazonaws.com') || urlObj.hostname.includes('s3.'))
    } catch {
      return false
    }
  }
  
  private extractRegionFromUrl(url: string): string | null {
    if (!url || typeof url !== 'string') {
      return null
    }

    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname

      // Pattern 1: bucket-name.s3.region.amazonaws.com (captures region with hyphens like ap-south-1)
      const pattern1 = /\.s3\.([a-z0-9-]+)\.amazonaws\.com$/
      const match1 = hostname.match(pattern1)
      if (match1 && match1[1]) {
        return match1[1]
      }

      // Pattern 2: bucket-name.s3-region.amazonaws.com (legacy format with hyphen before region)
      const pattern2 = /\.s3-([a-z0-9-]+)\.amazonaws\.com$/
      const match2 = hostname.match(pattern2)
      if (match2 && match2[1]) {
        return match2[1]
      }

      // Pattern 3: s3.region.amazonaws.com/bucket/path (path-style URLs)
      const pattern3 = /^s3\.([a-z0-9-]+)\.amazonaws\.com$/
      const match3 = hostname.match(pattern3)
      if (match3 && match3[1]) {
        return match3[1]
      }

      // If it's an HTTPS URL but we can't extract region, throw error
      throw new Error(`Cannot extract region from S3 HTTPS URL: ${url}`)
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('Cannot extract region')) {
        throw error
      }
      return null
    }
  }

  /**
   * Get or create S3Client with the specified region
   * Region must be provided either via parameter or from constructor default
   */
  private getS3Client(region?: string | null): S3Client {
    // Determine target region
    const targetRegion = region || this.defaultRegion

    if (!targetRegion) {
      throw new Error('Region must be provided either in URL or via AWS_REGION config')
    }

    // Check if we already have a client for this region
    if (this.clientCache.has(targetRegion)) {
      return this.clientCache.get(targetRegion)!
    }

    // Create a new client for this region and cache it
    const client = new S3Client({
      region: targetRegion,
    })
    
    this.clientCache.set(targetRegion, client)
    return client
  }

  /**
   * Parse S3 HTTPS URL: https://bucket-name.s3.region.amazonaws.com/path/to/file.png
   * Returns: { bucket: 'bucket-name', key: 'path/to/file.png' }
   */
  private parseHttpsS3Url(url: string): { bucket: string; key: string } {
    if (!url) {
      throw new Error('URL cannot be empty')
    }

    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname
      const pathname = urlObj.pathname

      // Pattern 1: bucket-name.s3.region.amazonaws.com/path/to/file
      // Matches bucket names with hyphens (e.g., origin-ai-medical-data)
      const pattern1 = /^([a-z0-9][a-z0-9.-]*[a-z0-9])\.s3\.([a-z0-9-]+)\.amazonaws\.com$/
      const match1 = hostname.match(pattern1)
      if (match1 && match1[1]) {
        const bucket = match1[1]
        const key = pathname.startsWith('/') ? pathname.substring(1) : pathname
        if (!key) {
          throw new Error(`Invalid S3 HTTPS URL format: ${url} - missing key path`)
        }
        return { bucket, key }
      }

      // Pattern 2: bucket-name.s3-region.amazonaws.com/path/to/file
      const pattern2 = /^([a-z0-9][a-z0-9.-]*[a-z0-9])\.s3-([a-z0-9-]+)\.amazonaws\.com$/
      const match2 = hostname.match(pattern2)
      if (match2 && match2[1]) {
        const bucket = match2[1]
        const key = pathname.startsWith('/') ? pathname.substring(1) : pathname
        if (!key) {
          throw new Error(`Invalid S3 HTTPS URL format: ${url} - missing key path`)
        }
        return { bucket, key }
      }

      // Pattern 3: s3.region.amazonaws.com/bucket/path/to/file
      const pattern3 = /^s3\.([a-z0-9-]+)\.amazonaws\.com$/
      const match3 = hostname.match(pattern3)
      if (match3) {
        const pathParts = pathname.split('/').filter(p => p)
        if (pathParts.length < 2) {
          throw new Error(`Invalid S3 HTTPS URL format: ${url} - missing bucket or key path`)
        }
        const bucket = pathParts[0]
        const key = pathParts.slice(1).join('/')
        return { bucket, key }
      }

      throw new Error(`Invalid S3 HTTPS URL format: ${url}`)
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('Invalid S3 HTTPS URL')) {
        throw error
      }
      throw new Error(`Failed to parse S3 HTTPS URL: ${url} - ${error.message}`)
    }
  }

  /**
   * Parse S3 URI: s3://bucket-name/path/to/file.png
   * Returns: { bucket: 'bucket-name', key: 'path/to/file.png' }
   */
  private parseS3Uri(uri: string): { bucket: string; key: string } {
    if (!uri) {
      throw new Error('URI cannot be empty')
    }

    if (uri.startsWith('s3://')) {
      const withoutProtocol = uri.substring(5) // Remove 's3://'
      const firstSlash = withoutProtocol.indexOf('/')
      
      if (firstSlash === -1) {
        throw new Error(`Invalid S3 URI format: ${uri} - missing key path`)
      }
      
      const bucket = withoutProtocol.substring(0, firstSlash)
      const key = withoutProtocol.substring(firstSlash + 1)
      
      if (!bucket || !key) {
        throw new Error(`Invalid S3 URI format: ${uri} - bucket or key is empty`)
      }
      
      return { bucket, key }
    }
    
    throw new Error(`Not an S3 URI: ${uri}`)
  }

  /**
   * Parse S3 URI, HTTPS URL, or use legacy key format
   * Supports:
   * - HTTPS URL: https://bucket.s3.region.amazonaws.com/path/to/file.png (region extracted from URL)
   * - S3 URI: s3://bucket-name/path/to/file.png
   * - Legacy key: path/to/file.png (uses default bucket)
   */
  private parseS3Input(keyOrUri: string, bucket?: string): { bucket: string; key: string } {
    // Check if it's an HTTPS S3 URL (priority - region must be extracted from URL)
    if (this.isValidHttpsS3Url(keyOrUri)) {
      return this.parseHttpsS3Url(keyOrUri)
    }
    
    // Check if it's an S3 URI
    if (this.isValidS3Uri(keyOrUri)) {
      return this.parseS3Uri(keyOrUri)
    }
    
    // Legacy format: treat as key, use provided bucket or default
    const { AWS_S3_BUCKET } = useRuntimeConfig()
    return {
      bucket: bucket ?? AWS_S3_BUCKET,
      key: keyOrUri,
    }
  }

  signUrl = (key: string, bucket?: string) => {
    // Extract region from URL if it's an HTTPS URL (region MUST come from URL)
    const region = this.extractRegionFromUrl(key)
    
    if (!region && !this.defaultRegion) {
      throw new Error('Region cannot be determined. Provide full HTTPS S3 URL with region or configure AWS_REGION')
    }
    
    const client = this.getS3Client(region)
    
    const { bucket: targetBucket, key: targetKey } = this.parseS3Input(key, bucket)
    const command = new GetObjectCommand({ Bucket: targetBucket, Key: targetKey })
    return getSignedUrl(client, command, {
      expiresIn: 86400,
    })
  }

  signThumbnailUrl = async (key: string, bucket?: string) => {
    const { AWS_S3_BUCKET_THUMBNAIL_IMAGES } = useRuntimeConfig()

    try {
      // Extract region from URL if it's an HTTPS URL (region MUST come from URL)
      const region = this.extractRegionFromUrl(key)
      
      if (!region && !this.defaultRegion) {
        throw new Error('Region cannot be determined. Provide full HTTPS S3 URL with region or configure AWS_REGION')
      }
      
      const client = this.getS3Client(region)
      
      const { bucket: targetBucket, key: targetKey } = this.parseS3Input(key, bucket ?? AWS_S3_BUCKET_THUMBNAIL_IMAGES)
      const command = new GetObjectCommand({ Bucket: targetBucket, Key: targetKey })
      return await getSignedUrl(client, command, {
        expiresIn: 86400, // URL expiration time in seconds
      })
    }
    catch (error: any) {
      if (error.name === 'NotFound') {
        console.error('The specified object does not exist.')
        return false
      }
      return false
    }
  }

  uploadVersionJson = async (key: string, jsonData: any, bucket?: string) => {
    const { AWS_S3_BUCKET_VERSIONS, AWS_VERSION_REGION } = useRuntimeConfig()
    const targetBucket = bucket ?? AWS_S3_BUCKET_VERSIONS

    if (!targetBucket) {
      throw new Error('AWS_S3_BUCKET_VERSIONS is not configured')
    }

    if (!AWS_VERSION_REGION) {
      throw new Error('AWS_VERSION_REGION is not configured')
    }
    
    const client = this.getS3Client(AWS_VERSION_REGION)

    const jsonString = JSON.stringify(jsonData)
    const command = new PutObjectCommand({
      Bucket: targetBucket,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
    })

    try {
      await client.send(command)
    } catch (error: any) {
      throw new Error('Failed to upload version to S3: ' + error.message)
    }
  }

  downloadVersionJson = async (key: string, bucket?: string) => {
    const { AWS_S3_BUCKET_VERSIONS, AWS_VERSION_REGION } = useRuntimeConfig()
    const targetBucket = bucket ?? AWS_S3_BUCKET_VERSIONS

    if (!targetBucket) {
      throw new Error('AWS_S3_BUCKET_VERSIONS is not configured')
    }

    if (!AWS_VERSION_REGION) {
      throw new Error('AWS_VERSION_REGION is not configured')
    }
    
    const client = this.getS3Client(AWS_VERSION_REGION)

    const command = new GetObjectCommand({
      Bucket: targetBucket,
      Key: key,
    })

    try {
      const response = await client.send(command)
      
      if (!response.Body) {
        throw new Error('No body in S3 response')
      }

      const bodyString = await response.Body.transformToString()
      return JSON.parse(bodyString)
    } catch (error: any) {
      throw new Error('Failed to download version from S3: ' + error.message)
    }
  }

  uploadFile = async (key: string, fileBuffer: Buffer, fileType: string, bucket?: string) => {
    const { AWS_S3_BUCKET_VERSIONS, AWS_VERSION_REGION } = useRuntimeConfig()
    const targetBucket = bucket ?? AWS_S3_BUCKET_VERSIONS

    if (!targetBucket) {
      throw new Error('AWS_S3_BUCKET_VERSIONS is not configured')
    }

    if (!AWS_VERSION_REGION) {
      throw new Error('AWS_VERSION_REGION is not configured')
    }
    
    const client = this.getS3Client(AWS_VERSION_REGION)

    const command = new PutObjectCommand({
      Bucket: targetBucket,
      Key: key,
      Body: fileBuffer,
      ContentType: fileType || 'application/octet-stream',
    })

    try {
      await client.send(command)
    } catch (error: any) {
      throw new Error('Failed to upload file to S3: ' + error.message)
    }
  }

  /**
   * Upload JSON to a custom S3 bucket/folder
   * Uses AWS_S3_BUCKET and AWS_REGION from environment variables
   * @param key - S3 key (folder path + filename)
   * @param jsonData - JSON data to upload
   * @param bucket - Optional bucket name (defaults to AWS_S3_BUCKET)
   * @param region - Optional region (defaults to AWS_REGION)
   */
  uploadJsonToCustomBucket = async (key: string, jsonData: any, bucket?: string, region?: string) => {
    const { AWS_S3_BUCKET, AWS_REGION } = useRuntimeConfig()
    const targetBucket = bucket ?? AWS_S3_BUCKET
    const targetRegion = region ?? AWS_REGION ?? this.defaultRegion

    if (!targetBucket) {
      throw new Error('AWS_S3_BUCKET is not configured')
    }

    if (!targetRegion) {
      throw new Error('AWS_REGION is not configured')
    }
    
    const client = this.getS3Client(targetRegion)

    const jsonString = JSON.stringify(jsonData)
    const command = new PutObjectCommand({
      Bucket: targetBucket,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
    })

    try {
      await client.send(command)
    } catch (error: any) {
      throw new Error('Failed to upload JSON to S3: ' + error.message)
    }
  }

  /**
   * Download JSON from an S3 key (NOT a URL). Uses AWS_S3_BUCKET / AWS_REGION by default.
   * This is the mirror of uploadJsonToCustomBucket.
   */
  downloadJsonFromCustomBucketKey = async (key: string, bucket?: string, region?: string) => {
    const { AWS_S3_BUCKET, AWS_REGION } = useRuntimeConfig()
    const targetBucket = bucket ?? AWS_S3_BUCKET
    const targetRegion = region ?? AWS_REGION ?? this.defaultRegion

    if (!targetBucket) {
      throw new Error('AWS_S3_BUCKET is not configured')
    }
    if (!targetRegion) {
      throw new Error('AWS_REGION is not configured')
    }

    if (!key || typeof key !== 'string') {
      throw new Error('S3 key is required')
    }

    const trimmed = key.trim()
    // Enforce "key only" contract: callers must not pass HTTPS URLs or s3:// URIs
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('s3://')) {
      throw new Error(`Please provide an S3 key (e.g. 'SampleLinkJSON/file+1.json'), not a URL: '${trimmed}'`)
    }

    const finalKey = trimmed.replace(/\/+$/, '')
    if (!finalKey) {
      throw new Error('Invalid S3 key: key cannot be empty')
    }

    const client = this.getS3Client(targetRegion)

    try {
      const command = new GetObjectCommand({ Bucket: targetBucket, Key: finalKey })
      const response = await client.send(command)
      if (!response.Body) {
        throw new Error('No body in S3 response')
      }
      const bodyString = await response.Body.transformToString()
      return JSON.parse(bodyString)
    } catch (error: any) {
      // If key was copy/pasted and '+' got converted to spaces, try safe alternates when we hit 404.
      const isNoSuchKey =
        error?.name === 'NoSuchKey' ||
        error?.Code === 'NoSuchKey' ||
        error?.$metadata?.httpStatusCode === 404 ||
        (typeof error?.message === 'string' && /NoSuchKey|specified key does not exist/i.test(error.message))

      if (isNoSuchKey) {
        const candidateKeys = Array.from(
          new Set(
            [
              finalKey,
              finalKey.includes('+') ? finalKey.replaceAll('+', ' ') : null,
              finalKey.includes(' ') ? finalKey.replaceAll(' ', '+') : null,
            ].filter((k): k is string => !!k && k.length > 0)
          )
        )

        for (const candidateKey of candidateKeys) {
          if (candidateKey === finalKey) continue
          try {
            const head = new HeadObjectCommand({ Bucket: targetBucket, Key: candidateKey })
            await client.send(head)

            const get = new GetObjectCommand({ Bucket: targetBucket, Key: candidateKey })
            const response = await client.send(get)
            if (!response.Body) throw new Error('No body in S3 response')
            const bodyString = await response.Body.transformToString()
            return JSON.parse(bodyString)
          } catch {
            // ignore and continue
          }
        }

        const quotedCandidates = candidateKeys.map(k => "'" + k + "'").join(', ')
        const alsoTried = candidateKeys.length > 1 ? ' Also tried: ' + quotedCandidates + '.' : ''
        const original = error?.message || String(error)
        throw new Error(
          `Failed to download JSON from S3 (bucket: ${targetBucket}). Tried key: '${finalKey}'.${alsoTried} Original error: ${original}`
        )
      }

      throw new Error(
        `Failed to download JSON from S3 (bucket: ${targetBucket}, key: ${finalKey}): ${error?.message || String(error)}`
      )
    }
  }

  /**
   * Check if a folder (prefix) exists in S3
   * @param folderPath - Folder path to check (e.g., 'folder/subfolder' or 'folder/subfolder/')
   * @param bucket - Optional bucket name (defaults to AWS_S3_BUCKET)
   * @param region - Optional region (defaults to AWS_REGION)
   * @returns true if folder exists (has at least one object), false otherwise
   */
  checkFolderExists = async (folderPath: string, bucket?: string, region?: string): Promise<boolean> => {
    const { AWS_S3_BUCKET, AWS_REGION } = useRuntimeConfig()
    const targetBucket = bucket ?? AWS_S3_BUCKET
    const targetRegion = region ?? AWS_REGION ?? this.defaultRegion

    if (!targetBucket) {
      throw new Error('AWS_S3_BUCKET is not configured')
    }

    if (!targetRegion) {
      throw new Error('AWS_REGION is not configured')
    }

    if (!folderPath || typeof folderPath !== 'string') {
      throw new Error('Folder path is required')
    }

    // Normalize folder path: trim, remove trailing slashes, then add one trailing slash
    const normalizedPath = folderPath.trim().replace(/\/+$/, '')
    if (!normalizedPath) {
      // Empty path means root bucket - always exists
      return true
    }
    const prefix = normalizedPath + '/'

    const client = this.getS3Client(targetRegion)

    try {
      const command = new ListObjectsV2Command({
        Bucket: targetBucket,
        Prefix: prefix,
        MaxKeys: 1, // Only need to check existence, not fetch all objects
      })

      const response = await client.send(command)
      // Folder exists if there are any objects with this prefix
      return response.Contents !== undefined && response.Contents.length > 0
    } catch (error: any) {
      // If folder doesn't exist or bucket doesn't exist, return false
      if (
        error?.name === 'NoSuchBucket' ||
        error?.name === 'NotFound' ||
        error?.Code === 'NoSuchBucket' ||
        error?.Code === 'NotFound' ||
        error?.$metadata?.httpStatusCode === 404
      ) {
        return false
      }
      // For other errors, throw to let caller handle
      throw new Error(`Failed to check folder existence in S3: ${error?.message || String(error)}`)
    }
  }
}