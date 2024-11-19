// src/utils/effects/index.ts

export {
calculateEffectValue,
  getEffectStyle,
  getEffectPriority,
  getDirection,
  calculateDistance,
  checkEffectConditions,
  countHorizontalEnemies,  // 追加
  countAdjacentAllies,
  calculateCardEffects,
  getEffectRange,  // 追加
  EFFECT_PATTERNS,
  EFFECT_PRIORITIES
  } from './effect-system';
  
  export {
    calculateEffectRange,
    isValidPosition,
    getEffectMultiplier,
    getDistance
  } from './effect-utils';
  
  export {
    getEffectDetails,
    getBaseEffectDescription,
    getWeaponEffectDescription,
    getLeaderEffectDescription
  } from './effect-descriptions';
  
  // 型定義のエクスポート
  export type {
    EffectStyle,
    EffectContext,
    EffectDetails
  } from './effect-system';
  
  export type { EffectPattern } from './types';
  
  // 追加の型定義
  export type EffectCalculationResult = {
    value: number;
    description: string;
    source: string;
    type: 'buff' | 'debuff' | 'neutral';
  };