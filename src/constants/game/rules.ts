// src/constants/game/rules.ts

import type { TurnData, GameSettings } from '@/types';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  boardSize: 5,
  maxTurns: 8,  // 6から8に変更
  startingHandSize: 3,
  allowUndo: true,
  showPreviews: true,
  animationsEnabled: true
};

export const TURN_DATA: Record<number, TurnData> = {
  1: {
    turn: 1,
    cardsToPlay: 3,
    specialRules: []
  },
  2: {
    turn: 2,
    cardsToPlay: 2,
    specialRules: [{
      type: 'EFFECT_INTRODUCTION',
      description: '効果を持つユニットが登場します'
    }]
  },
  3: {
    turn: 3,
    cardsToPlay: 1,
    specialRules: [{
      type: 'FIELD_CARDS',
      description: 'フィールドカードが使用可能になります'
    }]
  },
  4: {
    turn: 4,
    cardsToPlay: 1,
    specialRules: [{
      type: 'WEAPON_CARDS',
      description: '武器カードが使用可能になります'
    }]
  },
  5: {
    turn: 5,
    cardsToPlay: 2,
    specialRules: [{
      type: 'REINFORCEMENT',
      description: '補強カードが使用可能になります'
    }]
  },
  6: {
    turn: 6,
    cardsToPlay: 2,
    specialRules: [{
      type: 'LEADER_CARDS',
      description: 'リーダーカードが使用可能になります'
    }]
  },
  7: {
    turn: 7,
    cardsToPlay: 1,
    specialRules: [{
      type: 'LEGENDARY_CARDS',
      description: '伝説カードが使用可能になります（各陣営1枚のみ）'
    }]
  },
  8: {
    turn: 8,
    cardsToPlay: 1,
    specialRules: [{
      type: 'BOSS_CARDS',
      description: 'ステージボスが出現します',
      rules: {
        bossOnly: true,  // ボスカードのみ出現
        finalTurn: true  // 最終ターン
      }
    }]
  }
};

export const SCORING_RULES = {
  BASE_POINTS: {
    MIN: 0,
    MAX: 999
  },
  EFFECT_MULTIPLIER: {
    MIN: 0.5,
    MAX: 3.0
  },
  COMBO_BONUS: {
    THRESHOLD: 3,
    MULTIPLIER: 1.5
  }
};

export const DECK_CONSTRUCTION_RULES = {
  MIN_DECK_SIZE: 30,
  MAX_DECK_SIZE: 40,
  MAX_COPIES_PER_CARD: 3,
  REQUIRED_CATEGORIES: {
    unit: 20,
    field: 4,
    weapon: 4,
    support: 6
  }
};