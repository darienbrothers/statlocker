/**
 * Performance Optimization Layer
 * Handles caching, memoization, and performance monitoring
 */

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo'; // Eviction strategy
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

// Memory cache with LRU eviction
export class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      strategy: 'lru',
      ...config,
    };
  }

  set(key: string, data: T): void {
    const now = Date.now();
    
    // Remove expired items before adding new one
    this.cleanup();
    
    // If at capacity, evict based on strategy
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = now;
    
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evict(): void {
    if (this.config.strategy === 'lru') {
      // Remove least recently used
      let oldestKey = '';
      let oldestTime = Date.now();
      
      for (const [key, item] of this.cache.entries()) {
        if (item.lastAccessed < oldestTime) {
          oldestTime = item.lastAccessed;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    } else {
      // FIFO - remove first item
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }
}

// Persistent cache using AsyncStorage
export class PersistentCache {
  private static readonly CACHE_PREFIX = '@statlocker/cache/';
  private static readonly METADATA_KEY = '@statlocker/cache_metadata';

  static async set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(item));
      await this.updateMetadata(key, ttl);
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const item = JSON.parse(cached);
      const now = Date.now();
      
      // Check if expired
      if (now - item.timestamp > item.ttl) {
        await this.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      await AsyncStorage.removeItem(cacheKey);
      await this.removeFromMetadata(key);
    } catch (error) {
      console.warn('Failed to delete cached data:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      await AsyncStorage.multiRemove([...cacheKeys, this.METADATA_KEY]);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  private static async updateMetadata(key: string, ttl: number): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      metadata[key] = {
        timestamp: Date.now(),
        ttl,
      };
      
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to update cache metadata:', error);
    }
  }

  private static async removeFromMetadata(key: string): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      delete metadata[key];
      
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to remove from cache metadata:', error);
    }
  }

  private static async getMetadata(): Promise<Record<string, any>> {
    try {
      const metadata = await AsyncStorage.getItem(this.METADATA_KEY);
      return metadata ? JSON.parse(metadata) : {};
    } catch (error) {
      return {};
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();
  private static readonly MAX_SAMPLES = 100;

  static startTimer(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  static recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const samples = this.metrics.get(label)!;
    samples.push(value);

    // Keep only recent samples
    if (samples.length > this.MAX_SAMPLES) {
      samples.shift();
    }
  }

  static getMetrics(label: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const samples = this.metrics.get(label);
    
    if (!samples || samples.length === 0) {
      return null;
    }

    return {
      average: samples.reduce((a, b) => a + b, 0) / samples.length,
      min: Math.min(...samples),
      max: Math.max(...samples),
      count: samples.length,
    };
  }

  static getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label);
    }
    
    return result;
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// React hooks for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (!throttledRef.current) {
      callback(...args);
      throttledRef.current = true;

      timeoutRef.current = setTimeout(() => {
        throttledRef.current = false;
      }, delay);
    }
  }, [callback, delay]) as T;
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

export function useExpensiveComputation<T>(
  computation: () => T,
  deps: React.DependencyList,
  cacheKey?: string
): T {
  return useMemo(() => {
    const timer = PerformanceMonitor.startTimer(`computation:${cacheKey || 'anonymous'}`);
    const result = computation();
    timer();
    return result;
  }, deps);
}

// Image optimization utilities
export class ImageOptimizer {
  private static cache = new MemoryCache<string>({
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 50,
  });

  static async optimizeImage(
    uri: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<string> {
    const cacheKey = `${uri}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // In a real implementation, use expo-image-manipulator or similar
      // For now, return original URI
      const optimizedUri = uri; // await ImageManipulator.manipulateAsync(uri, [], options);
      
      this.cache.set(cacheKey, optimizedUri);
      return optimizedUri;
    } catch (error) {
      console.warn('Image optimization failed:', error);
      return uri;
    }
  }

  static preloadImages(uris: string[]): void {
    // Preload images in background
    uris.forEach(uri => {
      // Image.prefetch(uri) in React Native
    });
  }
}

// Bundle size optimization - lazy loading utilities
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFn);
}

// Memory management utilities
export class MemoryManager {
  private static subscriptions = new Set<() => void>();

  static addCleanupTask(cleanup: () => void): void {
    this.subscriptions.add(cleanup);
  }

  static removeCleanupTask(cleanup: () => void): void {
    this.subscriptions.delete(cleanup);
  }

  static cleanup(): void {
    this.subscriptions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });
    this.subscriptions.clear();
  }

  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    // In React Native, you'd use a native module for actual memory stats
    // This is a placeholder implementation
    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }
}

// Export singleton instances
export const gameStatsCache = new MemoryCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 200,
});

export const userDataCache = new MemoryCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 50,
});
