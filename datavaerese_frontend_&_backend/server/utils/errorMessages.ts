/**
 * Centralized Error Message Utilities
 * 
 * Provides consistent error messages for database operations across all services.
 * Follows the same pattern as composables/useFormValidation.ts for consistency.
 * 
 * @example
 * import { getDatabaseErrorMessage } from '~/server/utils/errorMessages'
 * const message = getDatabaseErrorMessage('duplicateName', 'Label', 'MyLabel')
 */

export type EntityType =
  | 'Label'
  | 'Annotation'
  | 'Session Label'
  | 'User Group'
  | 'Structure Group'
  | 'Structure'
  | 'Project Code'
  | 'Sub-Project Code'
  | 'Use Case Code'
  | 'User Type Code'
  | 'Anatomy Plane Code'
  | 'Center Code'
  | 'Role'
  | 'Epic'
  | 'Project'
  | 'Session'
  | 'Record'

export type ErrorMessageType =
  | 'duplicateName'
  | 'duplicateAbbreviation'
  | 'duplicateGroupName'
  | 'duplicateGeneric'
  | 'notFound'
  | 'foreignKeyConstraint'
  | 'foreignKeyInUse'

/**
 * Error message templates
 * Centralized for consistency and easy maintenance
 */
const ERROR_MESSAGES = {
  duplicateName: (entityType: EntityType, name: string) =>
    `${entityType} name already exists. Please use a different name.`,
  
  duplicateNameWithValue: (entityType: EntityType, name: string) =>
    `A ${entityType.toLowerCase()} with the name "${name}" already exists. Please choose a different name.`,
  
  duplicateAbbreviation: (entityType: EntityType) =>
    `This abbreviation already exists. Please use a different abbreviation.`,
  
  duplicateAbbreviationWithValue: (entityType: EntityType, abbreviation: string) =>
    `A ${entityType.toLowerCase()} with the abbreviation "${abbreviation}" already exists. Please use a different abbreviation.`,
  
  duplicateGroupName: (name: string) =>
    `A user group with the name "${name}" already exists. Please choose a different name.`,
  
  duplicateGeneric: () =>
    'A duplicate entry was detected. Please check your input and try again.',
  
  notFound: (entityType: EntityType, action: 'update' | 'delete' = 'update') =>
    `The ${entityType.toLowerCase()} you are trying to ${action} does not exist.`,
  
  foreignKeyConstraint: (entityType?: EntityType) =>
    entityType
      ? `Invalid reference. Please check that the related ${entityType.toLowerCase()} exists and is valid.`
      : 'Invalid reference. Please check the related record exists.',
  
  foreignKeyInUse: (entityType: EntityType, context?: string) =>
    context
      ? `This ${entityType.toLowerCase()} cannot be deleted because it is currently being used ${context}. Please remove all references before deleting.`
      : `This ${entityType.toLowerCase()} cannot be deleted because it is currently being used. Please remove all references to this ${entityType.toLowerCase()} before deleting.`,
} as const

/**
 * Get database error message based on error type and entity
 * 
 * @param errorType - The type of error message needed
 * @param entityType - The type of entity (e.g., 'Label', 'Annotation')
 * @param value - Optional value (name, abbreviation, etc.) for context
 * @param options - Additional options for message customization
 * @returns Formatted error message string
 * 
 * @example
 * getDatabaseErrorMessage('duplicateName', 'Label', 'MyLabel')
 * // "A label with the name "MyLabel" already exists. Please choose a different name."
 * 
 * getDatabaseErrorMessage('notFound', 'Label', undefined, { action: 'delete' })
 * // "The label you are trying to delete does not exist."
 */
export function getDatabaseErrorMessage(
  errorType: ErrorMessageType,
  entityType: EntityType = 'Record',
  value?: string,
  options?: {
    action?: 'update' | 'delete'
    context?: string
  }
): string {
  switch (errorType) {
    case 'duplicateName':
      return value
        ? ERROR_MESSAGES.duplicateNameWithValue(entityType, value)
        : ERROR_MESSAGES.duplicateName(entityType, value || '')
    
    case 'duplicateAbbreviation':
      return value
        ? ERROR_MESSAGES.duplicateAbbreviationWithValue(entityType, value)
        : ERROR_MESSAGES.duplicateAbbreviation(entityType)
    
    case 'duplicateGroupName':
      return ERROR_MESSAGES.duplicateGroupName(value || '')
    
    case 'duplicateGeneric':
      return ERROR_MESSAGES.duplicateGeneric()
    
    case 'notFound':
      return ERROR_MESSAGES.notFound(entityType, options?.action || 'update')
    
    case 'foreignKeyConstraint':
      return ERROR_MESSAGES.foreignKeyConstraint(options?.context as EntityType | undefined)
    
    case 'foreignKeyInUse':
      return ERROR_MESSAGES.foreignKeyInUse(entityType, options?.context)
    
    default:
      return 'An error occurred. Please try again.'
  }
}

/**
 * Handle Prisma database errors and return appropriate TRPCError
 * 
 * @param error - The Prisma error
 * @param entityType - The type of entity being operated on
 * @param input - The input data (for extracting names/values)
 * @param options - Additional options for error handling
 * @returns TRPCError with appropriate message
 * 
 * @example
 * try {
 *   await repository.create(args)
 * } catch (error) {
 *   throw handlePrismaError(error, 'Label', input)
 * }
 */
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'

export function handlePrismaError(
  error: unknown,
  entityType: EntityType = 'Record',
  input?: { name?: string; abbreviation?: string; groupName?: string } | Array<{ name?: string }>,
  options?: {
    action?: 'create' | 'update' | 'delete'
    context?: string
  }
): never {

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined
      
      // Extract name from input (handle both object and array inputs)
      const inputName = Array.isArray(input) 
        ? input[0]?.name 
        : (input && !Array.isArray(input) ? input.name : undefined)
      const inputAbbreviation = Array.isArray(input) 
        ? undefined 
        : (input && !Array.isArray(input) ? input.abbreviation : undefined)
      const inputGroupName = Array.isArray(input) 
        ? undefined 
        : (input && !Array.isArray(input) ? input.groupName : undefined)
      
      // Check for case-insensitive abbreviation constraint
      if (target && target[0] && target[0].includes('lower(abbreviation::text)')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: getDatabaseErrorMessage('duplicateAbbreviation', entityType, inputAbbreviation),
        })
      }
      
      // Check for case-insensitive name constraint
      if (target && target[0] && target[0].includes('lower(name::text)')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: getDatabaseErrorMessage('duplicateName', entityType, inputName),
        })
      }
      
      // Check for case-insensitive groupName constraint
      if (target && target[0] && target[0].includes('lower(groupName::text)')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: getDatabaseErrorMessage('duplicateGroupName', entityType, inputGroupName),
        })
      }
      
      // Check for regular name constraint
      if (target?.includes('name') || target?.[0] === `unique_${entityType.toLowerCase().replace(' ', '_')}_name`) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: getDatabaseErrorMessage('duplicateName', entityType, inputName),
        })
      }
      
      // Check for regular abbreviation constraint
      if (target?.includes('abbreviation') || 
          target?.[0] === `unique_${entityType.toLowerCase().replace(' ', '_')}_abbreviation` ||
          target?.[0] === `unique_${entityType.toLowerCase().replace(' ', '_')}_abbreviation_case_insensitive`) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: getDatabaseErrorMessage('duplicateAbbreviation', entityType, inputAbbreviation),
        })
      }
      
      // Check for groupName constraint
      if (target?.includes('groupName') || target?.[0] === 'unique_user_group_name') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: getDatabaseErrorMessage('duplicateGroupName', entityType, inputGroupName),
        })
      }
      
      // Generic fallback for other unique constraints
      throw new TRPCError({
        code: 'CONFLICT',
        message: getDatabaseErrorMessage('duplicateGeneric'),
      })
    }
    
    if (error.code === 'P2025') {
      // Record not found
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: getDatabaseErrorMessage('notFound', entityType, undefined, { 
          action: options?.action === 'delete' ? 'delete' : 'update' 
        }),
      })
    }
    
    if (error.code === 'P2003') {
      // Foreign key constraint violation
      if (options?.action === 'delete') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: getDatabaseErrorMessage('foreignKeyInUse', entityType, options?.context),
        })
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: getDatabaseErrorMessage('foreignKeyConstraint', entityType),
      })
    }
  }
  
  // Re-throw any other errors
  throw error
}

/**
 * Handle Prisma errors for read operations (find, findMany, etc.)
 * Read operations typically don't throw "not found" errors, but can have other issues
 * 
 * @param error - The Prisma error
 * @param entityType - The type of entity being queried
 * @param operation - The read operation being performed
 * @returns TRPCError with appropriate message
 * 
 * @example
 * try {
 *   await repository.findMany(args)
 * } catch (error) {
 *   throw handlePrismaReadError(error, 'Epic', 'findMany')
 * }
 */
export function handlePrismaReadError(
  error: unknown,
  entityType: EntityType = 'Record',
  operation: 'find' | 'findMany' | 'search' = 'findMany'
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2000: Invalid value for field
    if (error.code === 'P2000') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid query parameter. Please check your input and try again.`,
      })
    }
    
    // P2001: Record not found (for find operations, this is usually handled by returning null)
    // But if we want to throw an error, we can do it here
    if (error.code === 'P2001') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The ${entityType.toLowerCase()} you are looking for does not exist.`,
      })
    }
    
    // P2015: Record not found (alternative code)
    if (error.code === 'P2015') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The ${entityType.toLowerCase()} you are looking for does not exist.`,
      })
    }
    
    // P2016: Query interpretation error
    if (error.code === 'P2016') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid query. Please check your search parameters and try again.`,
      })
    }
    
    // P2025: Record not found (for update/delete, but can occur in reads too)
    if (error.code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The ${entityType.toLowerCase()} you are looking for does not exist.`,
      })
    }
  }
  
  // Handle Prisma client initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Database connection error. Please try again later.`,
    })
  }
  
  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invalid query parameters. Please check your input and try again.`,
    })
  }
  
  // Re-throw any other errors
  throw error
}

/**
 * Export error messages for direct access if needed
 */
export { ERROR_MESSAGES }
