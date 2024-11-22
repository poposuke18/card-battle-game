// src/utils/performance/cache.ts

type CacheKey = string;
type CacheValue = string | number | boolean | object | null;
export type CacheOptions = {
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

    // 最も古いキーを見つける
    let oldestKey: CacheKey | null = null;
    let oldestTimestamp = Date.now();

    for (const [k, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = k;
      }
    }

    if (this.cache.size >= this.maxSize && oldestKey) {
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  cleanStaleEntries() {
    throw new Error("Method not implemented.");
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