// src/utils/score/types.ts

import type { Effect, Position } from '@/types';

export type ScoreBreakdown = {
  basePoints: number;
  effectPoints: number;
  bonusPoints: number;
  totalPoints: number;
};

export type ScoreModifier = {
  type: 'buff' | 'debuff';
  value: number;
  source: string;
  effect: Effect;
  position: Position;
};

export type ScoreCalculationOptions = {
  includeEffects?: boolean;
  includeBonus?: boolean;
  calculateBreakdown?: boolean;
};

export type ScoreResult = {
  total: number;
  breakdown?: ScoreBreakdown;
  modifiers?: ScoreModifier[];
};

export const defaultScoreOptions: ScoreCalculationOptions = {
  includeEffects: true,
  includeBonus: true,
  calculateBreakdown: false
};