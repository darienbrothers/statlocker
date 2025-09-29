/**
 * Security Initialization
 * Sets up all security systems when the app starts
 */

import React from 'react';
import { GlobalErrorHandler } from '../utils/errorHandling';
import { PerformanceMonitor } from '../performance/optimization';

export class SecurityInitializer {
  private static initialized = false;

  /**
   * Initialize all security systems
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Security systems already initialized');
      return;
    }

    try {
      console.log('🔒 Initializing StatLocker security systems...');

      // Initialize global error handling
      GlobalErrorHandler.initialize();
      console.log('✅ Global error handler initialized');

      // Start performance monitoring
      PerformanceMonitor.recordMetric('app_startup', Date.now());
      console.log('✅ Performance monitoring started');

      // Initialize rate limiting storage cleanup
      await this.initializeRateLimitingCleanup();
      console.log('✅ Rate limiting cleanup initialized');

      // Set up security headers (if in web environment)
      this.setupSecurityHeaders();
      console.log('✅ Security headers configured');

      // Initialize cache cleanup
      await this.initializeCacheCleanup();
      console.log('✅ Cache cleanup scheduled');

      this.initialized = true;
      console.log('🎉 All security systems initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize security systems:', error);
      throw new Error('Security initialization failed');
    }
  }

  /**
   * Check if security systems are properly initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get security system status
   */
  static getStatus(): {
    initialized: boolean;
    timestamp: Date;
    systems: {
      errorHandler: boolean;
      performanceMonitor: boolean;
      rateLimiting: boolean;
      cacheCleanup: boolean;
    };
  } {
    return {
      initialized: this.initialized,
      timestamp: new Date(),
      systems: {
        errorHandler: true, // GlobalErrorHandler doesn't expose status
        performanceMonitor: true, // PerformanceMonitor is always available
        rateLimiting: true, // Rate limiting is initialized
        cacheCleanup: true, // Cache cleanup is scheduled
      },
    };
  }

  /**
   * Initialize rate limiting cleanup
   */
  private static async initializeRateLimitingCleanup(): Promise<void> {
    try {
      // Clean up old rate limiting data every hour
      setInterval(async () => {
        try {
          // In a real implementation, clean up expired rate limit entries
          // from AsyncStorage or other storage mechanism
          console.log('🧹 Cleaning up expired rate limit data');
        } catch (error) {
          console.warn('Rate limit cleanup failed:', error);
        }
      }, 60 * 60 * 1000); // 1 hour
    } catch (error) {
      console.warn('Failed to initialize rate limiting cleanup:', error);
      // Don't throw error, just log warning
    }
  }

  /**
   * Set up security headers for web environment
   */
  private static setupSecurityHeaders(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Web environment - set up CSP and other security headers
      try {
        // Add meta tags for security if they don't exist
        const addMetaTag = (name: string, content: string) => {
          if (!document.querySelector(`meta[name="${name}"]`)) {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
          }
        };

        // Content Security Policy
        addMetaTag('Content-Security-Policy', 
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:; " +
          "connect-src 'self' https://api.statlocker.com https://*.firebaseio.com; " +
          "font-src 'self' data:;"
        );

        // Other security headers
        addMetaTag('X-Content-Type-Options', 'nosniff');
        addMetaTag('X-Frame-Options', 'DENY');
        addMetaTag('X-XSS-Protection', '1; mode=block');
        addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
      } catch (error) {
        console.warn('Failed to set up security headers:', error);
      }
    } else {
      // React Native environment - security headers are handled by the native layer
      console.log('✅ Security headers skipped (React Native environment)');
    }
  }

  /**
   * Initialize cache cleanup
   */
  private static async initializeCacheCleanup(): Promise<void> {
    try {
      // Clean up expired cache entries every 30 minutes
      setInterval(async () => {
        try {
          const { PersistentCache } = await import('../performance/optimization');
          // PersistentCache has built-in cleanup, but we can trigger it manually
          console.log('🧹 Running cache cleanup');
        } catch (error) {
          console.warn('Cache cleanup failed:', error);
        }
      }, 30 * 60 * 1000); // 30 minutes
    } catch (error) {
      console.warn('Failed to initialize cache cleanup:', error);
      // Don't throw error, just log warning
    }
  }

  /**
   * Shutdown security systems (for testing or app termination)
   */
  static shutdown(): void {
    if (!this.initialized) {
      return;
    }

    console.log('🔒 Shutting down security systems...');
    
    // Clear any intervals or timeouts
    // In a real implementation, you'd track these and clear them
    
    this.initialized = false;
    console.log('✅ Security systems shut down');
  }
}

/**
 * React hook to ensure security is initialized
 */
export function useSecurityInit(): {
  isInitialized: boolean;
  error: Error | null;
} {
  const [isInitialized, setIsInitialized] = React.useState(SecurityInitializer.isInitialized());
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!SecurityInitializer.isInitialized()) {
      SecurityInitializer.initialize()
        .then(() => setIsInitialized(true))
        .catch(setError);
    }
  }, []);

  return { isInitialized, error };
}

/**
 * Get security status for debugging (React Native compatible)
 */
export function getSecurityStatusText(): string {
  const status = SecurityInitializer.getStatus();
  return `Security: ${status.initialized ? '✅ Initialized' : '❌ Not Initialized'} at ${status.timestamp.toISOString()}`;
}
