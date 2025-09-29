/**
 * Input Validation and Sanitization Layer
 * Provides secure input handling for all user data
 */

import { z } from 'zod';

// Base validation schemas
export const ValidationSchemas = {
  // User input schemas
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
    .transform(str => str.trim()),

  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .transform(str => str.toLowerCase().trim()),

  sport: z.enum(['lacrosse', 'soccer', 'basketball', 'hockey', 'baseball', 'football'], {
    errorMap: () => ({ message: 'Invalid sport selection' })
  }),

  position: z.string()
    .min(1, 'Position is required')
    .max(30, 'Position name too long')
    .regex(/^[a-zA-Z\s/-]+$/, 'Position contains invalid characters')
    .transform(str => str.trim()),

  graduationYear: z.number()
    .int('Graduation year must be a whole number')
    .min(new Date().getFullYear(), 'Graduation year cannot be in the past')
    .max(new Date().getFullYear() + 10, 'Graduation year too far in future'),

  // Game data schemas
  statValue: z.number()
    .min(0, 'Stat values cannot be negative')
    .max(1000, 'Stat value unreasonably high')
    .finite('Stat value must be finite'),

  percentage: z.number()
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100')
    .finite('Percentage must be finite'),

  gameDate: z.date()
    .max(new Date(), 'Game date cannot be in the future')
    .min(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), 'Game date too old'),

  // Security-focused schemas
  userId: z.string()
    .uuid('Invalid user ID format'),

  teamId: z.string()
    .min(1, 'Team ID required')
    .max(50, 'Team ID too long')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Team ID contains invalid characters'),

  // File upload validation
  fileName: z.string()
    .min(1, 'Filename required')
    .max(255, 'Filename too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Filename contains invalid characters')
    .refine(name => !name.startsWith('.'), 'Hidden files not allowed'),

  fileSize: z.number()
    .max(5 * 1024 * 1024, 'File size cannot exceed 5MB'),

  // Text content validation
  description: z.string()
    .max(500, 'Description too long')
    .transform(str => str.trim())
    .refine(str => !/<script|javascript:|data:/i.test(str), 'Invalid content detected'),

  // Numeric constraints for performance
  pageSize: z.number()
    .int()
    .min(1)
    .max(100, 'Page size too large'),

  pageNumber: z.number()
    .int()
    .min(0),
} as const;

// Composite validation schemas
export const CompositeSchemas = {
  userProfile: z.object({
    firstName: ValidationSchemas.name,
    lastName: ValidationSchemas.name.optional(),
    email: ValidationSchemas.email,
    sport: ValidationSchemas.sport,
    position: ValidationSchemas.position,
    graduationYear: ValidationSchemas.graduationYear,
  }),

  gameStats: z.object({
    saves: ValidationSchemas.statValue,
    goals: ValidationSchemas.statValue,
    assists: ValidationSchemas.statValue,
    savePercentage: ValidationSchemas.percentage,
    gameDate: ValidationSchemas.gameDate,
    opponent: ValidationSchemas.name,
  }),

  pagination: z.object({
    page: ValidationSchemas.pageNumber,
    limit: ValidationSchemas.pageSize,
  }),
} as const;

// Input sanitization utilities
export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize for SQL-like operations (though we use Firestore)
   */
  static sanitizeForDatabase(input: string): string {
    return input
      .replace(/['"\\]/g, '')
      .trim()
      .substring(0, 1000); // Prevent extremely long inputs
  }

  /**
   * Sanitize file paths
   */
  static sanitizeFilePath(path: string): string {
    return path
      .replace(/\.\./g, '') // Prevent directory traversal
      .replace(/[<>:"|?*]/g, '') // Remove invalid filename chars
      .replace(/^\/+/, '') // Remove leading slashes
      .trim();
  }

  /**
   * Rate limiting key sanitization
   */
  static sanitizeRateLimitKey(key: string): string {
    return key
      .replace(/[^a-zA-Z0-9-_.:]/g, '')
      .substring(0, 100);
  }
}

// Validation result types
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: string[];
};

// Main validation function
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message),
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}

// Async validation for database-dependent checks
export async function validateWithContext<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  context?: {
    checkEmailExists?: (email: string) => Promise<boolean>;
    checkTeamExists?: (teamId: string) => Promise<boolean>;
  }
): Promise<ValidationResult<T>> {
  const baseResult = validateInput(schema, input);
  
  if (!baseResult.success) {
    return baseResult;
  }

  // Additional context-based validations
  if (context && typeof input === 'object' && input !== null) {
    const data = input as any;
    
    if (data.email && context.checkEmailExists) {
      const emailExists = await context.checkEmailExists(data.email);
      if (emailExists) {
        return {
          success: false,
          errors: ['Email already in use'],
        };
      }
    }
  }

  return baseResult;
}

// Export types for use in components
export type UserProfileInput = z.infer<typeof CompositeSchemas.userProfile>;
export type GameStatsInput = z.infer<typeof CompositeSchemas.gameStats>;
export type PaginationInput = z.infer<typeof CompositeSchemas.pagination>;
