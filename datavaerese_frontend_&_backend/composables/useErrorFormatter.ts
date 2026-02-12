/**
 * Error Formatter Utility
 * 
 * Extracts user-friendly error messages from TRPC/Zod/Prisma errors.
 * Handles structured Zod validation errors, TRPC errors, and file upload errors.
 * Follows best practices for consistent error messaging across the application.
 * 
 * @example
 * const { formatErrorMessage } = useErrorFormatter()
 * const message = formatErrorMessage(error)
 */

import type { ErrorWithData } from '~/types/error'

export function useErrorFormatter() {
  /**
   * Format error message from TRPC/Zod/Prisma errors
   * Extracts the actual validation message from structured error formats.
   * Handles multiple error formats to provide consistent user-friendly messages.
   * 
   * @param error - The error object from TRPC, Zod, or Prisma
   * @returns User-friendly error message string
   * 
   * @example
   * formatErrorMessage(error)
   * // "Abbreviation can only contain uppercase letters, hyphens, and underscores"
   * 
   * @example
   * formatErrorMessage(zodError)
   * // "Name can only contain letters, numbers, underscores, and hyphens"
   */
  /**
   * Type guard to check if error has ErrorWithData structure
   */
  const isErrorWithData = (error: unknown): error is ErrorWithData => {
    return typeof error === 'object' && error !== null
  }

  /**
   * Extract field name from error path, handling nested paths with array indices
   * Prioritizes important nested fields like childAnnotation, taxonomyData over top-level fields
   * @param path - Error path (string or array of strings/numbers)
   * @returns Field name to display in error message
   */
  const extractFieldNameFromPath = (path: string | (string | number)[] | undefined): string => {
    if (!path) return 'field'
    
    const pathArray = Array.isArray(path) ? path.map(String) : path.split('.')
    
    // Priority fields that should be shown even if they're not the last field
    const priorityFields = ['childAnnotation', 'taxonomyData', 'labels', 'labelIds', 'id']
    
    // First, check if any priority field exists in the path
    for (const priorityField of priorityFields) {
      if (pathArray.includes(priorityField)) {
        return priorityField
      }
    }
    
    // Find the last meaningful field name (skip numeric indices)
    for (let i = pathArray.length - 1; i >= 0; i--) {
      const part = pathArray[i]
      // Skip numeric indices
      if (isNaN(Number(part))) {
        return part
      }
    }
    
    // Fallback to last part if all are numeric (shouldn't happen, but safe)
    return pathArray[pathArray.length - 1] || 'field'
  }

  const formatErrorMessage = (error: unknown): string => {
    // Handle case where error is directly an array (raw Zod errors)
    if (Array.isArray(error)) {
      if (error.length > 0 && error[0]?.message) {
        let errorMessage = error[0].message
        // If message is generic "Required" or contains "required", enhance it with field name from path
        if ((errorMessage === 'Required' || errorMessage.toLowerCase().includes('required')) && error[0]?.path) {
          const fieldName = extractFieldNameFromPath(error[0].path)
          // Use more user-friendly names for common fields
          const friendlyNames: Record<string, string> = {
            'childAnnotation': 'childAnnotation',
            'taxonomyData': 'taxonomyData',
            'labels': 'labels',
            'labelIds': 'labelIds',
            'extractedResources': 'extractedResources',
            'taxonomy': 'taxonomy',
            'id': 'label id'
          }
          const displayName = friendlyNames[fieldName] || fieldName
          errorMessage = `"${displayName}" is required.`
        }
        return errorMessage
      }
      // If array contains error objects without message, try to construct one
      if (error.length > 0 && error[0]?.code && error[0]?.path) {
        const path = Array.isArray(error[0].path) ? error[0].path.join('.') : error[0].path
        return `Validation error in ${path}: ${error[0].code}`
      }
      return 'Validation error occurred. Please check your input.'
    }
    
    // Type guard to check if error has expected structure
    if (!isErrorWithData(error)) {
      // If not ErrorWithData, check if it's a standard Error
      if (error instanceof Error) {
        // Check if error.message is a JSON string (array of error objects)
        // This handles cases where Zod errors are serialized as JSON arrays
        if (error.message && typeof error.message === 'string') {
          try {
            const parsed = JSON.parse(error.message)
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Get the first error object's message
              if (parsed[0]?.message) {
                let errorMessage = parsed[0].message
                // If message is generic "Required" or contains "required", enhance it with field name from path
                if ((errorMessage === 'Required' || errorMessage.toLowerCase().includes('required')) && parsed[0]?.path) {
                  const fieldName = extractFieldNameFromPath(parsed[0].path)
                  // Use more user-friendly names for common fields
                  const friendlyNames: Record<string, string> = {
                    'childAnnotation': 'childAnnotation',
                    'taxonomyData': 'taxonomyData',
                    'labels': 'labels',
                    'labelIds': 'labelIds',
                    'extractedResources': 'extractedResources',
                    'taxonomy': 'taxonomy',
                    'id': 'label id'
                  }
                  const displayName = friendlyNames[fieldName] || fieldName
                  errorMessage = `"${displayName}" is required.`
                }
                return errorMessage
              }
              // If no message but has code and path, construct one
              if (parsed[0]?.code && parsed[0]?.path) {
                const path = Array.isArray(parsed[0].path) ? parsed[0].path.join('.') : parsed[0].path
                return `Validation error in ${path}: ${parsed[0].code}`
              }
            }
          } catch {
            // Not JSON, continue to check other formats
          }
        }
        return error.message
      }
      return 'An error occurred. Please try again.'
    }
    
    const errorWithData = error
    // 1. Check if error has zodError data structure (Zod validation errors)
    if (errorWithData?.data?.zodError) {
      const zodError = errorWithData.data.zodError
      
      // Check for fieldErrors (flattened format) - field-specific errors
      if (zodError.fieldErrors) {
        const fieldErrors = zodError.fieldErrors
        // Get the first error message from any field
        const firstField = Object.keys(fieldErrors)[0]
        if (firstField && fieldErrors[firstField] && fieldErrors[firstField].length > 0) {
          let errorMessage = fieldErrors[firstField][0]
          // Check if error message already contains a quoted field name (e.g., "childAnnotation" is required)
          const quotedFieldMatch = errorMessage.match(/"([^"]+)"/)
          if (quotedFieldMatch && quotedFieldMatch[1]) {
            // Error already has a field name, use it as-is
            return errorMessage
          }
          
          // If message is generic "Required" or contains "required", enhance it with field name
          if (errorMessage === 'Required' || errorMessage.toLowerCase().includes('required')) {
            const fieldName = extractFieldNameFromPath(firstField)
            // Use more user-friendly names for common fields
            const friendlyNames: Record<string, string> = {
              'childAnnotation': 'childAnnotation',
              'taxonomyData': 'taxonomyData',
              'labels': 'labels',
              'labelIds': 'labelIds',
              'extractedResources': 'extractedResources',
              'taxonomy': 'taxonomy',
              'id': 'label id'
            }
            const displayName = friendlyNames[fieldName] || fieldName
            errorMessage = `"${displayName}" is required.`
          }
          return errorMessage
        }
      }
      
      // Check for formErrors (general form errors)
      if (zodError.formErrors && zodError.formErrors.length > 0) {
        return zodError.formErrors[0]
      }
    }
    
    // 2. Check for TRPC error structure (Prisma errors, etc.)
    // Format: error.json.message (from TRPC client)
    if (errorWithData?.json?.message) {
      return errorWithData.json.message
    }
    
    // Format: error.data.message (from TRPC server)
    if (errorWithData?.data?.message) {
      return errorWithData.data.message
    }
    
    // 3. Check if error.message is a JSON string (array of error objects)
    // This handles cases where error message is serialized JSON (raw Zod errors)
    if (errorWithData?.message && typeof errorWithData.message === 'string') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(errorWithData.message)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Get the first error object's message
          if (parsed[0]?.message) {
            let errorMessage = parsed[0].message
            // If message is generic "Required" or contains "required", enhance it with field name from path
            if ((errorMessage === 'Required' || errorMessage.toLowerCase().includes('required')) && parsed[0]?.path) {
              const fieldName = extractFieldNameFromPath(parsed[0].path)
              // Use more user-friendly names for common fields
              const friendlyNames: Record<string, string> = {
                'childAnnotation': 'childAnnotation',
                'taxonomyData': 'taxonomyData',
                'labels': 'labels',
                'labelIds': 'labelIds',
                'extractedResources': 'extractedResources',
                'taxonomy': 'taxonomy',
                'id': 'label id'
              }
              const displayName = friendlyNames[fieldName] || fieldName
              errorMessage = `"${displayName}" is required.`
            }
            return errorMessage
          }
          // If no message but has code and path, construct user-friendly message
          if (parsed[0]?.code && parsed[0]?.path) {
            const fieldName = extractFieldNameFromPath(parsed[0].path)
            // Map common Zod error codes to user-friendly messages
            switch (parsed[0].code) {
              case 'too_big':
                return `"${fieldName}" must be ${parsed[0].maximum} characters or less`
              case 'too_small':
                return `"${fieldName}" must be at least ${parsed[0].minimum} characters`
              case 'invalid_type':
                return `Invalid "${fieldName}" format`
              case 'invalid_string':
                return `Invalid "${fieldName}" format`
              default:
                return `Validation error in "${fieldName}"`
            }
          }
        }
      } catch {
        // Not JSON, continue to check other formats
      }
      
      // Check if message contains JSON-like structure (embedded JSON in string)
      if (errorWithData.message.includes('"message"') && errorWithData.message.includes('"code"')) {
        try {
          // Try to extract message from JSON-like string using regex
          const match = errorWithData.message.match(/"message"\s*:\s*"([^"]+)"/)
          if (match && match[1]) {
            return match[1]
          }
        } catch {
          // Continue to return original message
        }
      }
    }
    
    // 4. Check if error is a standard Error object
    if (error instanceof Error) {
      return error.message
    }
    
    // 5. Fallback to error.message or default message
    // If message looks like raw JSON, try to parse it one more time
    const fallbackMessage = errorWithData?.message || 'An error occurred. Please try again.'
    if (typeof fallbackMessage === 'string' && (fallbackMessage.startsWith('[') || fallbackMessage.startsWith('{'))) {
      try {
        const parsed = JSON.parse(fallbackMessage)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.message) {
          let errorMessage = parsed[0].message
          // If message is generic "Required" or contains "required", enhance it with field name from path
          if ((errorMessage === 'Required' || errorMessage.toLowerCase().includes('required')) && parsed[0]?.path) {
            const fieldName = extractFieldNameFromPath(parsed[0].path)
            // Use more user-friendly names for common fields
            const friendlyNames: Record<string, string> = {
              'childAnnotation': 'childAnnotation',
              'taxonomyData': 'taxonomyData',
              'labels': 'labels',
              'labelIds': 'labelIds',
              'extractedResources': 'extractedResources',
              'taxonomy': 'taxonomy',
              'id': 'label id'
            }
            const displayName = friendlyNames[fieldName] || fieldName
            errorMessage = `"${displayName}" is required.`
          }
          return errorMessage
        }
      } catch {
        // Not JSON, return as-is
      }
    }
    return fallbackMessage
  }

  return {
    formatErrorMessage,
  }
}
