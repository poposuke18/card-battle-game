// src/utils/common/helpers.ts

import type { Position } from '@/types';
import { BOARD_SIZE } from './constants';
import type { UnitClass } from '@/types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function isValidPosition(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  );
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let waiting = false;
  
  return function(...args: Parameters<T>) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

export function getClassIcon(unitClass: UnitClass): string {
  switch (unitClass) {
    case 'warrior':
      return '⚔️';
    case 'archer':
      return '🏹';
    case 'mage':
      return '🔮';
    case 'knight':
      return '🎠';
    case 'lancer':
      return '🔱';
    case 'guardian':
      return '🛡️';
    default:
      return '❓';
  }
}

export function getClassDisplayName(unitClass: UnitClass): string {
  switch (unitClass) {
    case 'warrior':
      return '戦士';
    case 'archer':
      return '弓兵';
    case 'mage':
      return '魔法使い';
    case 'knight':
      return '騎士';
    case 'lancer':
      return '槍兵';
    case 'guardian':
      return '守護者';
    default:
      return '不明';
  }
}