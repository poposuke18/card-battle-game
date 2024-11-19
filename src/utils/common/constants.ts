// src/utils/common/constants.ts

export const BOARD_SIZE = 5;

export const TURN_LIMITS = {
  MIN_TURN: 1,
  MAX_TURN: 6
} as const;

export const SCORE_CONSTANTS = {
  MIN_SCORE: 0,
  MAX_EFFECT_MULTIPLIER: 3,
  BASE_EFFECT_RANGE: 1
} as const;

export const ANIMATION_CONSTANTS = {
  CARD_ANIMATION_DURATION: 0.3,
  EFFECT_ANIMATION_DURATION: 0.5,
  TURN_TRANSITION_DURATION: 1
} as const;

export const CARD_LIMITS = {
  MAX_HAND_SIZE: 6,
  MIN_CARD_POINTS: 0,
  MAX_CARD_POINTS: 999
} as const;

export const EFFECT_CONSTANTS = {
  DEFAULT_EFFECT_INTENSITY: 0.3,
  MAX_EFFECT_RANGE: 2,
  MIN_EFFECT_VALUE: -100,
  MAX_EFFECT_VALUE: 100
} as const;