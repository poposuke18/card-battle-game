// src/utils/performance/cache.ts

type CacheKey = string;
type CacheValue = any;
type CacheOptions = {
  maxSize?: number;
  ttl?: number;  // Time to live in milliseconds
};

class Cache {
  private cache: Map<CacheKey, {
    value: CacheValue;
    timestamp: number;
  }>;
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 5 * 60 * 1000; // Default 5 minutes
  }

  set(key: CacheKey, value: CacheValue): void {
    this.cleanStaleEntries();

    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: CacheKey): CacheValue | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isStale(entry.timestamp)) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  private isStale(timestamp: number): boolean {
    return Date.now() - timestamp > this.ttl;
  }

  private cleanStaleEntries(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isStale(entry.timestamp)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// メモ化されたキャッシュインスタンス
export const memoCache = new Cache({ maxSize: 500 });

// 位置計算用のキャッシュインスタンス
export const positionCache = new Cache({ 
  maxSize: 200, 
  ttl: 30 * 1000 // 30 seconds
});

// エフェクト計算用のキャッシュインスタンス
export const effectCache = new Cache({ 
  maxSize: 300, 
  ttl: 60 * 1000 // 1 minute
});