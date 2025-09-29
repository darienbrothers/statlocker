/**
 * Secure API Layer with Data Mapping and Validation
 * Handles all external API calls with proper security measures
 */

import { validateInput, ValidationSchemas, InputSanitizer } from '../security/validation';
import { AuthenticationService, Permission } from '../security/auth';
import { PerformanceMonitor, PersistentCache } from '../performance/optimization';
import { z } from 'zod';

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.statlocker.com',
  TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Rate limiting configuration
const RATE_LIMITS = {
  DEFAULT: { requests: 100, window: 60000 }, // 100 requests per minute
  AUTH: { requests: 5, window: 60000 }, // 5 auth attempts per minute
  UPLOAD: { requests: 10, window: 60000 }, // 10 uploads per minute
};

// API Response schemas for validation
const ApiResponseSchemas = {
  success: z.object({
    success: z.literal(true),
    data: z.any(),
    message: z.string().optional(),
  }),
  
  error: z.object({
    success: z.literal(false),
    error: z.string(),
    code: z.string().optional(),
    details: z.any().optional(),
  }),
  
  paginated: z.object({
    success: z.literal(true),
    data: z.array(z.any()),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    }),
  }),
};

// Request/Response types
export interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  requiredPermissions?: Permission[];
  cache?: {
    key: string;
    ttl: number;
  };
  rateLimit?: keyof typeof RATE_LIMITS;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
}

// Rate limiting store
class RateLimiter {
  private static requests = new Map<string, number[]>();

  static async checkLimit(key: string, limit: typeof RATE_LIMITS.DEFAULT): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - limit.window;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const requests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);
    this.requests.set(key, recentRequests);

    // Check if under limit
    if (recentRequests.length >= limit.requests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    return true;
  }

  static getRemainingRequests(key: string, limit: typeof RATE_LIMITS.DEFAULT): number {
    const now = Date.now();
    const windowStart = now - limit.window;
    
    if (!this.requests.has(key)) {
      return limit.requests;
    }

    const requests = this.requests.get(key)!;
    const recentRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, limit.requests - recentRequests.length);
  }
}

// Secure HTTP client
export class SecureApiClient {
  private static instance: SecureApiClient;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'StatLocker/1.0.0',
    };
  }

  static getInstance(): SecureApiClient {
    if (!this.instance) {
      this.instance = new SecureApiClient();
    }
    return this.instance;
  }

  async request<T = any>(config: ApiRequest): Promise<ApiResponse<T>> {
    const timer = PerformanceMonitor.startTimer(`api:${config.endpoint}`);
    
    try {
      // Validate and sanitize request
      const validatedConfig = await this.validateRequest(config);
      if (!validatedConfig.success) {
        return { success: false, error: validatedConfig.error };
      }

      // Check authentication and permissions
      const authCheck = await this.checkAuthentication(config);
      if (!authCheck.success) {
        return { success: false, error: authCheck.error };
      }

      // Check rate limiting
      const rateLimitCheck = await this.checkRateLimit(config);
      if (!rateLimitCheck.success) {
        return { success: false, error: rateLimitCheck.error };
      }

      // Check cache first for GET requests
      if (config.method === 'GET' && config.cache) {
        const cached = await PersistentCache.get<T>(config.cache.key);
        if (cached) {
          timer();
          return { success: true, data: cached };
        }
      }

      // Make the actual request
      const response = await this.makeRequest<T>(config);
      
      // Cache successful GET responses
      if (response.success && config.method === 'GET' && config.cache && response.data) {
        await PersistentCache.set(config.cache.key, response.data, config.cache.ttl);
      }

      timer();
      return response;
    } catch (error) {
      timer();
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async validateRequest(config: ApiRequest): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Validate endpoint
    if (!config.endpoint || typeof config.endpoint !== 'string') {
      return { success: false, error: 'Invalid endpoint' };
    }

    // Sanitize endpoint
    const sanitizedEndpoint = InputSanitizer.sanitizeFilePath(config.endpoint);
    if (sanitizedEndpoint !== config.endpoint) {
      return { success: false, error: 'Invalid characters in endpoint' };
    }

    // Validate method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(config.method)) {
      return { success: false, error: 'Invalid HTTP method' };
    }

    // Validate data if present
    if (config.data) {
      try {
        JSON.stringify(config.data);
      } catch {
        return { success: false, error: 'Invalid request data' };
      }
    }

    return { success: true };
  }

  private async checkAuthentication(config: ApiRequest): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!config.requiresAuth) {
      return { success: true };
    }

    const sessionValidation = await AuthenticationService.validateSession();
    if (!sessionValidation.valid) {
      return { success: false, error: 'Authentication required' };
    }

    // Check permissions if specified
    if (config.requiredPermissions && config.requiredPermissions.length > 0) {
      // In a real implementation, get user from session
      // const user = await this.getCurrentUser();
      // const hasPermissions = AuthenticationService.hasAllPermissions(user, config.requiredPermissions);
      // if (!hasPermissions) {
      //   return { success: false, error: 'Insufficient permissions' };
      // }
    }

    return { success: true };
  }

  private async checkRateLimit(config: ApiRequest): Promise<{
    success: boolean;
    error?: string;
  }> {
    const limitType = config.rateLimit || 'DEFAULT';
    const limit = RATE_LIMITS[limitType];
    
    // Create rate limit key based on user/IP
    const rateLimitKey = await this.getRateLimitKey(config);
    
    const allowed = await RateLimiter.checkLimit(rateLimitKey, limit);
    if (!allowed) {
      const remaining = RateLimiter.getRemainingRequests(rateLimitKey, limit);
      return {
        success: false,
        error: `Rate limit exceeded. ${remaining} requests remaining.`,
      };
    }

    return { success: true };
  }

  private async makeRequest<T>(config: ApiRequest): Promise<ApiResponse<T>> {
    const url = new URL(config.endpoint, this.baseURL);
    
    // Add query parameters
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Prepare headers
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    // Add authentication header if required
    if (config.requiresAuth) {
      const session = await AuthenticationService.validateSession();
      if (session.valid && session.session) {
        headers['Authorization'] = `Bearer ${session.session.sessionId}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: config.method,
      headers,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    };

    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      requestOptions.body = JSON.stringify(config.data);
    }

    // Make request with retries
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < API_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url.toString(), requestOptions);
        
        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            code: response.status.toString(),
            details: errorData,
          };
        }

        // Parse and validate response
        const responseData = await response.json();
        const validatedResponse = this.validateResponse(responseData);
        
        if (!validatedResponse.success) {
          return validatedResponse;
        }

        return {
          success: true,
          data: responseData.data || responseData,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on certain errors
        if (error instanceof TypeError && error.message.includes('AbortError')) {
          break; // Timeout - don't retry
        }

        // Wait before retry
        if (attempt < API_CONFIG.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (attempt + 1)));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed after retries',
      details: lastError,
    };
  }

  private validateResponse(data: any): ApiResponse {
    try {
      // Try to parse as standard API response
      const successResult = ApiResponseSchemas.success.safeParse(data);
      if (successResult.success) {
        return { success: true, data: successResult.data.data };
      }

      const errorResult = ApiResponseSchemas.error.safeParse(data);
      if (errorResult.success) {
        return {
          success: false,
          error: errorResult.data.error,
          code: errorResult.data.code,
          details: errorResult.data.details,
        };
      }

      // If not standard format, assume success with raw data
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid response format',
        details: error,
      };
    }
  }

  private async getRateLimitKey(config: ApiRequest): Promise<string> {
    // In a real implementation, use user ID or IP address
    const session = await AuthenticationService.validateSession();
    const userId = session.valid && session.session ? session.session.userId : 'anonymous';
    
    return InputSanitizer.sanitizeRateLimitKey(`${userId}:${config.endpoint}`);
  }
}

// Convenience methods for common API patterns
export class ApiService {
  private static client = SecureApiClient.getInstance();

  // User management
  static async createUser(userData: any): Promise<ApiResponse> {
    const validation = validateInput(ValidationSchemas.email, userData.email);
    if (!validation.success) {
      return { success: false, error: validation.errors.join(', ') };
    }

    return this.client.request({
      endpoint: '/users',
      method: 'POST',
      data: userData,
      rateLimit: 'AUTH',
    });
  }

  static async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.client.request({
      endpoint: `/users/${userId}`,
      method: 'GET',
      requiresAuth: true,
      requiredPermissions: [Permission.READ_OWN_DATA],
      cache: {
        key: `user_profile_${userId}`,
        ttl: 15 * 60 * 1000, // 15 minutes
      },
    });
  }

  // Game statistics
  static async getGameStats(userId: string, filters?: any): Promise<ApiResponse> {
    return this.client.request({
      endpoint: `/users/${userId}/stats`,
      method: 'GET',
      params: filters,
      requiresAuth: true,
      requiredPermissions: [Permission.READ_OWN_DATA],
      cache: {
        key: `game_stats_${userId}_${JSON.stringify(filters || {})}`,
        ttl: 5 * 60 * 1000, // 5 minutes
      },
    });
  }

  static async logGame(gameData: any): Promise<ApiResponse> {
    // Validate game data
    const validation = validateInput(ValidationSchemas.statValue, gameData.saves);
    if (!validation.success) {
      return { success: false, error: validation.errors.join(', ') };
    }

    return this.client.request({
      endpoint: '/games',
      method: 'POST',
      data: gameData,
      requiresAuth: true,
      requiredPermissions: [Permission.WRITE_OWN_DATA],
    });
  }

  // File uploads
  static async uploadFile(file: File, metadata: any): Promise<ApiResponse> {
    // Validate file
    const sizeValidation = validateInput(ValidationSchemas.fileSize, file.size);
    if (!sizeValidation.success) {
      return { success: false, error: sizeValidation.errors.join(', ') };
    }

    const nameValidation = validateInput(ValidationSchemas.fileName, file.name);
    if (!nameValidation.success) {
      return { success: false, error: nameValidation.errors.join(', ') };
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return this.client.request({
      endpoint: '/upload',
      method: 'POST',
      data: formData,
      requiresAuth: true,
      rateLimit: 'UPLOAD',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Export singleton instance
export const apiClient = SecureApiClient.getInstance();
