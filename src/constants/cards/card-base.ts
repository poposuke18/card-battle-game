// src/constants/cards/card-base.ts

import type { Card, CardType, CardCategory} from '@/types';

// カードの基本ポイント
export const BASE_POINTS = {
  UNIT: {
    warrior: 100,    // 攻撃型
    archer: 80,      // 射程型
    mage: 70,        // 効果重視
    knight: 120,     // 高コスト
    lancer: 90,      // バランス型
    guardian: 110    // 防御型
  },
  FIELD: 80,         // フィールド効果
  WEAPON: 50,        // 武器強化
  SUPPORT: 40        // サポート効果
} as const;

// ターンごとの成長率
export const TURN_GROWTH_RATE = {
  1: { ally: 0.8, enemy: 1.0 },   // 基本ターン
  2: { ally: 1.0, enemy: 1.2 },   // 発展ターン
  3: { ally: 1.2, enemy: 1.5 },   // フィールドカード
  4: { ally: 1.4, enemy: 1.7 },   // 武器カード
  5: { ally: 1.6, enemy: 2.2 },   // 補強カード
  6: { ally: 1.8, enemy: 2.2 },   // リーダーカード
  7: { ally: 3, enemy: 2.2 },   // 伝説カード
  8: { ally: 2.0, enemy: 2.5 }    // ボスカード
} as const;

type StageRate = {
  [key: number]: number;
  1: 1;
  2: 1.2;
  3: 1.5;
  4: 1.8;
  5: 2.2;
};

export const STAGE_ENEMY_RATE: StageRate = {
  1: 1.0,
  2: 1.2,
  3: 1.5,
  4: 1.8,
  5: 2.2
} as const;



// 効果の基本値
export const EFFECT_VALUES = {
  ADJACENT: 20,      // 隣接効果
  VERTICAL: 30,      // 縦方向効果
  HORIZONTAL: 30,    // 横方向効果
  DIAGONAL: 40,      // 斜め方向効果
  FIELD: 40,        // フィールド効果
  LEADER: 50        // リーダー効果
} as const;

// カードのベース関数を作成
export function createCard(
  props: Partial<Card> & {
    id: string;
    name: string;
    type: CardType;
    category: CardCategory;
    points: number;
    turn: number;
  }
): Card {
  return {
    ...props,
    class: props.class || null,
    effect: props.effect || undefined
  };
}

// カードIDジェネレーター
export function generateCardId(
  category: CardCategory, 
  type: CardType, 
  index: number
): string {
  return `${category}-${type}-${index}`;
}

// カードポイント計算関数
export function calculateCardPoints(
  basePoint: number,
  type: CardType,
  turn: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,  // 7と8を追加
  stage: number = 1,
  hasEffect: boolean = false
): number {
  const turnRate = TURN_GROWTH_RATE[turn][type];
  const stageRate = type === 'enemy' 
  ? STAGE_ENEMY_RATE[stage as keyof typeof STAGE_ENEMY_RATE] || 1 
  : 1;
    const effectRate = hasEffect ? 1 : 1;

  return Math.floor(basePoint * turnRate * stageRate * effectRate);
}