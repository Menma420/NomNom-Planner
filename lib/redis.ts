import Redis from 'ioredis';
import type { Redis as RedisType } from 'ioredis';

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true, // If true, call redis.connect() before use or let first command trigger connection
  connectTimeout: 10000,
  retryDelayOnClusterDown: 300,
  enableOfflineQueue: false,
});

// Attach event listeners properly
redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});
redis.on('connect', () => {
  console.log('Redis connected successfully');
});

// Cache configuration
const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  DAY: 86400,    // 24 hours
};

// Cache utility functions
export class CacheService {
  private redis: RedisType;

  constructor() {
    this.redis = redis;
  }

  // Set cache with TTL
  async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  // Delete cache key
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ keys: number; memory: string }> {
    try {
      const info = await this.redis.info('memory');
      const keys = await this.redis.dbsize();
      
      const memoryMatch = info.match(/used_memory_human:(\S+)/);
      const memory = memoryMatch ? memoryMatch[1] : '0B';
      
      return { keys, memory };
    } catch (error) {
      console.error('Redis stats error:', error);
      return { keys: 0, memory: '0B' };
    }
  }
}

// Cache decorator for functions
export function cache(ttl: number = CACHE_TTL.MEDIUM) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cacheService = new CacheService();

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cached = await cacheService.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute original method
      const result = await method.apply(this, args);
      
      // Cache the result
      await cacheService.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// Cache middleware for API routes
export function withCache(ttl: number = CACHE_TTL.MEDIUM) {
  return function (handler: Function) {
    return async function (req: any, res: any) {
      const cacheService = new CacheService();
      const cacheKey = `api:${req.url}:${JSON.stringify(req.query)}`;
      
      // Try to get from cache
      const cached = await cacheService.get(cacheKey);
      if (cached !== null) {
        return res.json(cached);
      }

      // Execute original handler
      const originalSend = res.json;
      res.json = function(data: any) {
        // Cache the response
        cacheService.set(cacheKey, data, ttl);
        return originalSend.call(this, data);
      };

      return handler(req, res);
    };
  };
}

// Performance monitoring
export class PerformanceMonitor {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  async measureCachePerformance<T>(
    key: string,
    operation: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<{ data: T; cacheHit: boolean; responseTime: number }> {
    const startTime = Date.now();
    
    // Try cache first
    const cached = await this.cacheService.get<T>(key);
    if (cached !== null) {
      return {
        data: cached,
        cacheHit: true,
        responseTime: Date.now() - startTime
      };
    }

    // Execute operation
    const data = await operation();
    
    // Cache result
    await this.cacheService.set(key, data, ttl);
    
    return {
      data,
      cacheHit: false,
      responseTime: Date.now() - startTime
    };
  }
}

export { redis, CACHE_TTL };
export default new CacheService(); 