// src/utils/performance/optimizations.ts

import { useMemo, useCallback, useRef, useEffect } from 'react';
import type { PlacedCard, Position, Card, Effect } from '@/types';

// パフォーマンス計測用のカスタムフック
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        timeSinceLastRender: `${timeSinceLastRender.toFixed(2)}ms`
      });
    }
    
    lastRenderTime.current = currentTime;
  });
}

// ボードの変更を効率的に検出
export function useBoardChanges(board: (PlacedCard | null)[][]): {
  changedPositions: Position[];
  hasChanges: boolean;
} {
  const previousBoard = useRef<(PlacedCard | null)[][]>();
  
  return useMemo(() => {
    const changes: Position[] = [];
    let hasChanges = false;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const previousCell = previousBoard.current?.[rowIndex]?.[colIndex];
        const cellChanged = 
          (!previousCell && cell) ||
          (previousCell && !cell) ||
          (previousCell && cell && previousCell.card.id !== cell.card.id);

        if (cellChanged) {
          changes.push({ row: rowIndex, col: colIndex });
          hasChanges = true;
        }
      });
    });

    previousBoard.current = board;
    return { changedPositions: changes, hasChanges };
  }, [board]);
}

// 効果の計算をメモ化
export function useEffectCalculation(
  sourceCard: Card,
  targetPosition: Position,
  board: (PlacedCard | null)[][],
  effect: Effect | null
) {
  return useMemo(() => {
    if (!effect) return null;

    // 効果の計算処理...
    // 実際の効果計算ロジックをここに移動
    
    return {
      value: 0, // 計算された効果値
      targets: [] as Position[] // 影響を受ける位置
    };
  }, [sourceCard.id, targetPosition.row, targetPosition.col, board, effect]);
}

// スコアの計算をメモ化
export function useScoreCalculation(board: (PlacedCard | null)[][]) {
  return useMemo(() => {
    let allyScore = 0;
    let enemyScore = 0;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) return;
        
        // スコア計算ロジック...
        // 実際のスコア計算処理をここに移動
      });
    });

    return { allyScore, enemyScore };
  }, [board]);
}

// キャッシュされた位置計算
type PositionCache = {
  [key: string]: Position[];
};

export function createPositionCache(): PositionCache {
  const cache: PositionCache = {};

  function cacheKey(type: string, params: any): string {
    return `${type}-${JSON.stringify(params)}`;
  }

  return {
    getAdjacentPositions(position: Position): Position[] {
      const key = cacheKey('adjacent', position);
      if (!cache[key]) {
        cache[key] = calculateAdjacentPositions(position);
      }
      return cache[key];
    },

    getDiagonalPositions(position: Position): Position[] {
      const key = cacheKey('diagonal', position);
      if (!cache[key]) {
        cache[key] = calculateDiagonalPositions(position);
      }
      return cache[key];
    },

    getRangePositions(position: Position, range: number): Position[] {
      const key = cacheKey('range', { position, range });
      if (!cache[key]) {
        cache[key] = calculateRangePositions(position, range);
      }
      return cache[key];
    },

    clearCache() {
      Object.keys(cache).forEach(key => delete cache[key]);
    }
  };
}

// DOM更新の最適化
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

// アニメーションフレーム最適化
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
}

// 位置計算のヘルパー関数
function calculateAdjacentPositions(position: Position): Position[] {
  return [
    { row: position.row - 1, col: position.col },
    { row: position.row + 1, col: position.col },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 }
  ].filter(pos => 
    pos.row >= 0 && pos.row < 5 && pos.col >= 0 && pos.col < 5
  );
}

function calculateDiagonalPositions(position: Position): Position[] {
  return [
    { row: position.row - 1, col: position.col - 1 },
    { row: position.row - 1, col: position.col + 1 },
    { row: position.row + 1, col: position.col - 1 },
    { row: position.row + 1, col: position.col + 1 }
  ].filter(pos => 
    pos.row >= 0 && pos.row < 5 && pos.col >= 0 && pos.col < 5
  );
}

function calculateRangePositions(position: Position, range: number): Position[] {
  const positions: Position[] = [];
  
  for (let row = -range; row <= range; row++) {
    for (let col = -range; col <= range; col++) {
      if (row === 0 && col === 0) continue;
      
      const newPos = {
        row: position.row + row,
        col: position.col + col
      };
      
      if (
        newPos.row >= 0 && newPos.row < 5 &&
        newPos.col >= 0 && newPos.col < 5
      ) {
        positions.push(newPos);
      }
    }
  }
  
  return positions;
}