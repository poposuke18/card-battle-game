// src/constants/cards/boss-cards.ts

import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, STAGE_ENEMY_RATE } from './card-base';
import type { Card} from '@/types';

// ボス用の特別な計算（ステージ依存）
function calculateBossPoints(basePoint: number, stage: number): number {
  const bossMultiplier = 3.5;
  const stageMultiplier = STAGE_ENEMY_RATE[stage as keyof typeof STAGE_ENEMY_RATE] || 1;
  return Math.floor(basePoint * bossMultiplier * stageMultiplier);
}

// ステージ1のボス：イフリート（炎の精霊王）
const STAGE1_BOSS: Card = createCard({
  id: generateCardId('unit', 'enemy', 81),
  name: '炎神イフリート',
  type: 'enemy',
  category: 'unit',
  class: 'mage',
  points: calculateBossPoints(BASE_POINTS.UNIT.mage, 1),
  effect: {
    type: 'BOSS_IFRIT',
    primaryEffect: {
      range: 2,
      enemyPenalty: -EFFECT_VALUES.FIELD * 1.5,
      description: '範囲2マスの敵ユニットを弱体化'
    },
    secondaryEffect: {
      powerPerWeakened: EFFECT_VALUES.FIELD,
      description: '弱体化した敵1体につき自身が強化'
    },
    description: '灼熱の炎で範囲内の敵を弱体化し、その数に応じて自身を強化する'
  },
  turn: 8
});

// ステージ2のボス：バハムート（竜王）
const STAGE2_BOSS: Card = createCard({
  id: generateCardId('unit', 'enemy', 82),
  name: '竜王バハムート',
  type: 'enemy',
  category: 'unit',
  class: 'knight',
  points: calculateBossPoints(BASE_POINTS.UNIT.knight, 2),
  effect: {
    type: 'BOSS_BAHAMUT',
    primaryEffect: {
      range: 3,
      pattern: 'cross',
      enemyPenalty: -EFFECT_VALUES.FIELD * 2,
      weaponNullification: true,
      description: '十字方向3マスの敵を弱体化し、武器効果を無効化'
    },
    secondaryEffect: {
      allyBoost: EFFECT_VALUES.FIELD * 1.5,
      targetDirection: 'horizontal',
      description: '同じ列の味方を強化'
    },
    ultimateEffect: {
      name: 'メガフレア',
      damage: EFFECT_VALUES.FIELD * 2,
      pattern: 'all',
      description: '盤面全体の敵ユニットにダメージ'
    },
    description: '竜王の咆哮が戦場を揺るがし、メガフレアは敵を焼き尽くす'
  },
  turn: 8
});

// ステージ3のボス：リヴァイアサン（海竜神）
const STAGE3_BOSS: Card = createCard({
  id: generateCardId('unit', 'enemy', 83),
  name: '海竜神リヴァイアサン',
  type: 'enemy',
  category: 'unit',
  class: 'guardian',
  points: calculateBossPoints(BASE_POINTS.UNIT.guardian, 3),
  effect: {
    type: 'BOSS_LEVIATHAN',
    primaryEffect: {
      name: 'タイダルウェーブ',
      pattern: 'wave',
      range: 2,  // 'full' を数値に変更
      enemyPenalty: -EFFECT_VALUES.FIELD * 2,
      movement: true,
      description: '波状に広がる効果で敵を押し流し弱体化'
    },
    secondaryEffect: {
      powerPerWeakened: EFFECT_VALUES.FIELD,  // type を削除
      description: '2ターンの間、フィールド全体が水没し敵ユニットが弱体化'
    },
    ultimateEffect: {
      name: 'TSUNAMI',  // type を name に変更
      power: EFFECT_VALUES.FIELD * 3,
      targetDirection: 'all',
      effectNullification: true,
      description: '全ての効果を無効化し、敵全体に致命的なダメージ'
    },
    description: '深海より現れし古の神は、大海の力で全てを飲み込む'
  },
  turn: 8
});

// ステージ4のボス：オーディン（神父王）
const STAGE4_BOSS: Card = createCard({
  id: generateCardId('unit', 'enemy', 84),
  name: '神父王オーディン',
  type: 'enemy',
  category: 'unit',
  class: 'warrior',
  points: calculateBossPoints(BASE_POINTS.UNIT.warrior, 4),
  effect: {
    type: 'BOSS_ODIN',
    primaryEffect: {
      name: 'ギュンギニル',
      pattern: 'pierce',
      range: 2,
      penetration: true,
      description: '直線上の敵を貫通する必殺の一撃'
    },
    secondaryEffect: {
      name: 'スレイプニル',
      moveRange: 2,
      afterEffect: true,
      description: '移動後に効果発動が可能'
    },
    ultimateEffect: {
      name: 'ラグナロク',
      globalEffect: true,
      duration: 1,
      description: '1ターンの間、味方の全効果が倍増する'
    },
    description: '神々の王は、運命すら書き換える力を持つ'
  },
  turn: 8
});


export const TURN8_CARDS = [STAGE1_BOSS];  // 最初は1ステージ目のボスだけを使用

export const BOSS_CARDS: Record<number, Card> = {
  1: STAGE1_BOSS,
  2: STAGE2_BOSS,
  3: STAGE3_BOSS,
  4: STAGE4_BOSS,
};

// ステージに応じたボスカードを取得する関数
export function getBossCardForStage(stage: number): Card {
    // ボスカードのIDを一意にするために現在のタイムスタンプを使用
    const boss = BOSS_CARDS[stage] || STAGE1_BOSS;
    return {
      ...boss,
      id: `${boss.id}-${Date.now()}`  // 一意のIDを生成
    };
  }