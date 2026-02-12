/**
 * Form Validation Utilities
 * 
 * Centralized error message generation for form validation.
 * Follows best practices for consistency and maintainability.
 * 
 * @example
 * const { getErrorMessage } = useFormValidation()
 * const error = getErrorMessage('Name', 'required')
 */

export type ValidationErrorType =
  | 'required'
  | 'spacesNotAllowed'
  | 'invalidCharacters'
  | 'invalidCharactersWithUppercase'
  | 'uppercaseOnly'
  | 'atLeastOneRequired'
  | 'minLength'
  | 'maxLength'
  | 'emojiNotAllowed'
  | 'custom'

/**
 * Error message templates
 * Centralized for consistency and easy maintenance
 */
const ERROR_MESSAGES = {
  required: (fieldName: string) => `${fieldName} is required`,
  spacesNotAllowed: () => 'Spaces are not allowed',
  invalidCharacters: () => 'Only letters, numbers, underscore (_), and hyphen (-) are allowed',
  invalidCharactersWithUppercase: () => 'Only Uppercase letters, numbers, underscore (_), and hyphen (-) are allowed',
  uppercaseOnly: () => 'Only uppercase letters are allowed',
  atLeastOneRequired: (fieldName: string) => `At least one ${fieldName.toLowerCase()} is required`,
  minLength: (fieldName: string, min: number) => `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) => `${fieldName} must be at most ${max} characters`,
  emojiNotAllowed: () => 'Reason cannot contain emojis',
  custom: (message: string) => message,
} as const

/**
 * Composable for form validation error messages
 * 
 * @returns Object with error message generation functions
 */
export function useFormValidation() {
  /**
   * Get error message based on field name and error type
   * 
   * @param fieldName - The name of the field (e.g., "Name", "Abbreviation", "Group Name")
   * @param errorType - The type of validation error
   * @param customMessage - Optional custom message for 'custom' error type
   * @returns Formatted error message string
   * 
   * @example
   * getErrorMessage('Name', 'required') // "Name is required"
   * getErrorMessage('Abbreviation', 'spacesNotAllowed') // "Spaces are not allowed"
   * getErrorMessage('Assignees', 'atLeastOneRequired') // "At least one assignee is required"
   */
  const getErrorMessage = (
    fieldName: string,
    errorType: ValidationErrorType,
    customMessage?: string
  ): string => {
    switch (errorType) {
      case 'required':
        return ERROR_MESSAGES.required(fieldName)
      case 'spacesNotAllowed':
        return ERROR_MESSAGES.spacesNotAllowed()
      case 'invalidCharacters':
        return ERROR_MESSAGES.invalidCharacters()
      case 'invalidCharactersWithUppercase':
        return ERROR_MESSAGES.invalidCharactersWithUppercase()
      case 'uppercaseOnly':
        return ERROR_MESSAGES.uppercaseOnly()
      case 'atLeastOneRequired':
        return ERROR_MESSAGES.atLeastOneRequired(fieldName)
      case 'minLength':
        return ERROR_MESSAGES.minLength(fieldName, customMessage ? parseInt(customMessage) : 0)
      case 'maxLength':
        return ERROR_MESSAGES.maxLength(fieldName, customMessage ? parseInt(customMessage) : 0)
      case 'emojiNotAllowed':
        return ERROR_MESSAGES.emojiNotAllowed()
      case 'custom':
        return customMessage || ERROR_MESSAGES.custom('Validation error')
      default:
        return `${fieldName} is invalid`
    }
  }

  /**
   * Validate required field
   * 
   * @param value - The value to validate
   * @param fieldName - The name of the field
   * @returns Error message if invalid, empty string if valid
   */
  const validateRequired = (value: any, fieldName: string): string => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return getErrorMessage(fieldName, 'required')
    }
    return ''
  }

  /**
   * Validate pattern (letters, numbers, underscore, hyphen)
   * 
   * @param value - The value to validate
   * @param fieldName - The name of the field
   * @param pattern - Optional custom regex pattern (default: /^[A-Za-z0-9_-]+$/)
   * @returns Error message if invalid, empty string if valid
   */
  const validatePattern = (
    value: string,
    fieldName: string,
    pattern: RegExp = /^[A-Za-z0-9_-]+$/
  ): string => {
    if (!value) return ''
    
    if (!pattern.test(value)) {
      if (value.includes(' ')) {
        return getErrorMessage(fieldName, 'spacesNotAllowed')
      }
      return getErrorMessage(fieldName, 'invalidCharacters')
    }
    
    return ''
  }

  // const validatePatternWithUppercase = (

  //   value: string,
  //   fieldName: string,
  //   pattern: RegExp = /^[A-Z0-9_-]+$/
  // ): string => {
  //   if (!value) return ''
    
  // }
  const validatePatternWithUppercase = (
    value: string,
    fieldName: string,
    pattern: RegExp = /^[A-Z0-9_-]+$/
  ): string => {
    if (!value) return ''
    
    if (!pattern.test(value)) {
      if (value.includes(' ')) {
        return getErrorMessage(fieldName, 'spacesNotAllowed')
      }
      return getErrorMessage(fieldName, 'invalidCharactersWithUppercase')
    }
    
    return ''
  }

  /**
   * Validate uppercase only pattern
   * 
   * @param value - The value to validate
   * @param fieldName - The name of the field
   * @returns Error message if invalid, empty string if valid
   */
  const validateUppercaseOnly = (value: string, fieldName: string): string => {
    if (!value) return ''
    
    const pattern = /^[A-Z0-9_-]+$/
    if (!pattern.test(value)) {
      if (value.includes(' ')) {
        return getErrorMessage(fieldName, 'spacesNotAllowed')
      }
      if (/[a-z]/.test(value)) {
        return getErrorMessage(fieldName, 'uppercaseOnly')
      }
      return getErrorMessage(fieldName, 'invalidCharactersWithUppercase')
    }
    
    return ''
  }

  /**
   * Validate at least one item in array/collection
   * 
   * @param items - The array/collection to validate
   * @param fieldName - The name of the field
   * @returns Error message if invalid, empty string if valid
   */
  const validateAtLeastOne = (items: any[] | undefined, fieldName: string): string => {
    if (!items || items.length === 0) {
      return getErrorMessage(fieldName, 'atLeastOneRequired')
    }
    return ''
  }

  /**
   * Validate lock/unlock reason field
   * 
   * STEP-BY-STEP VALIDATION:
   * 1. Check if field is required (not empty)
   * 2. Check minimum length (10 characters)
   * 3. Check maximum length (100 characters)
   * 4. Check for emojis (not allowed)
   * @example
   * const error = validateLockUnlockReason(reason, 'lock')
   * if (error) {
   *   reasonError.value = error
   * }
   */
  const validateLockUnlockReason = (value: string, action: 'lock' | 'unlock' = 'lock'): string => {
    const actionText = action === 'lock' ? 'lock' : 'unlock'
    const actionCapitalized = action === 'lock' ? 'Lock' : 'Unlock'
    
    // Step 1: Check required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${actionCapitalized} reason is required`
    }
    
    const trimmedValue = value.trim()
    
    // Step 2: Check minimum length (10 characters)
    if (trimmedValue.length < 10) {
      return `Please enter a valid ${actionText} reason (minimum 10 characters required).`
    }
    
    // Step 3: Check maximum length (100 characters)
    if (value.length > 100) {
      return `Please enter a valid ${actionText} reason (maximum 100 characters allowed).`
    }
    
    // Step 4: Check for emojis (not allowed)
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(value)) {
      return `${actionCapitalized} reason cannot contain emojis`
    }
    
    // All validations passed
    return ''
  }

  return {
    getErrorMessage,
    validateRequired,
    validatePattern,
    validateUppercaseOnly,
    validateAtLeastOne,
    validateLockUnlockReason,
    ERROR_MESSAGES,
  }
}

