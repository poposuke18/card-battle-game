// src/utils/performance/index.ts

export { 
    usePerformanceMonitor,
    useBoardChanges,
    useEffectCalculation,
    createPositionCache,
    useDebouncedCallback,
    useAnimationFrame
  } from './optimizations';
  
  export { 
    memoCache, 
    positionCache, 
    effectCache 
  } from './cache';
  
  export type { CacheOptions } from './cache';