/**
 * Error Type Definitions
 * 
 * Provides proper TypeScript types for error handling across the application.
 * Replaces all 'any' and 'unknown' types with specific interfaces.
 */

/**
 * Zod Error Structure
 * Matches the structure returned by TRPC's errorFormatter
 */
export interface ZodErrorData {
  fieldErrors?: Record<string, string[]>
  formErrors?: string[]
}

/**
 * TRPC Error Data Structure
 * Matches the structure of TRPC errors
 */
export interface TRPCErrorData {
  zodError?: ZodErrorData
  message?: string
  code?: string
}

/**
 * TRPC Error JSON Structure
 * Structure for errors from TRPC client
 */
export interface TRPCErrorJson {
  message?: string
  code?: string
}

/**
 * Complete Error Structure
 * Represents all possible error formats from TRPC/Zod/Prisma
 */
export interface ErrorWithData {
  data?: TRPCErrorData
  json?: TRPCErrorJson
  message?: string
}

/**
 * Error with TRPC Data Code
 * Used for checking error codes in catch blocks
 */
export interface ErrorWithCode {
  data?: {
    code?: string
    message?: string
  }
  message?: string
}

/**
 * File Upload Error Context
 * Additional context for file upload errors
 */
export interface FileUploadErrorContext {
  filename?: string
  fileSize?: number
  fileType?: string
}

/**
 * JSON Upload Error
 * Specific error structure for JSON file uploads
 */
export interface JSONUploadError extends ErrorWithCode {
  filename?: string
  fileError?: Error
}

/**
 * Extracted Resource Structure
 * Type for extracted resources in JSON files
 */
export interface ExtractedResource {
  id: string
  sessionName?: string
  versionName?: string
  purpose?: string
  dLSessionId?: string
  status?: string
  metadata?: Record<string, unknown>
  rawResourceId?: string
  labels?: unknown[]
  labelIds?: string[]
  taxonomy?: Array<{
    annotationId: string
    taxonomyGroupName: string
    taxonomyData: Record<string, unknown>
    isChild?: boolean
  }>
}

/**
 * Prepared File Data
 * Structure for prepared file data before upload
 */
export interface PreparedFileData {
  file: File
  filename: string
  extractedResources: ExtractedResource[]
}

/**
 * File Upload Result
 * Result structure for file upload operations
 */
export interface FileUploadResult {
  totalLinked: number
  totalSkipped: number
  uploadedFilesList: Array<{
    filename: string
    count: number
  }>
}

/**
 * Duplicate Check Response
 * Response structure for duplicate checking
 */
export interface DuplicateCheckResponse {
  hasDuplicates: boolean
  duplicateCount?: number
  filesWithDuplicates?: Array<{
    filename: string
    totalImages: number
    duplicateCount: number
  }>
}
