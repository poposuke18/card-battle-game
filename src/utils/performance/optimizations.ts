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
    return {
      value: 0,
      targets: [] as Position[]
    };
  }, [effect]);
}


// キャッシュされた位置計算
type PositionCache = {
  adjacent: { [key: string]: Position[] };
  diagonal: { [key: string]: Position[] };
  range: { [key: string]: Position[] };
};

export function createPositionCache() {
  const cache: PositionCache = {
    adjacent: {},
    diagonal: {},
    range: {}
  };

  return {
    getAdjacentPositions(position: Position): Position[] {
      const key = JSON.stringify(position);
      if (!cache.adjacent[key]) {
        cache.adjacent[key] = calculateAdjacentPositions(position);
      }
      return cache.adjacent[key];
    },

    getDiagonalPositions(position: Position): Position[] {
      const key = JSON.stringify(position);
      if (!cache.diagonal[key]) {
        cache.diagonal[key] = calculateDiagonalPositions(position);
      }
      return cache.diagonal[key];
    },

    getRangePositions(position: Position, range: number): Position[] {
      const key = `${JSON.stringify(position)}-${range}`;
      if (!cache.range[key]) {
        cache.range[key] = calculateRangePositions(position, range);
      }
      return cache.range[key];
    },

    clearCache(): void {
      cache.adjacent = {};
      cache.diagonal = {};
      cache.range = {};
    }
  };
}

// DOM更新の最適化
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
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