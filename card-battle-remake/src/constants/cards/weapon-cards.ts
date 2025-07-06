// src/constants/cards/weapon-cards.ts

import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card } from '@/types';

// 武器効果の特性を定義
const WEAPON_TRAITS = {
  VERTICAL_BOOST: {
    difficulty: 'MEDIUM',
    baseMultiplier: 1.6,
    effectValue: EFFECT_VALUES.VERTICAL,
    description: '前方への攻撃に適した形状'
  },
  DIAGONAL_BOOST: {
    difficulty: 'HIGH',
    baseMultiplier: 2,
    effectValue: EFFECT_VALUES.DIAGONAL,
    description: '死角からの攻撃が可能'
  },
  CROSS_FORMATION: {
    difficulty: 'LOW',
    baseMultiplier: 1.4,
    effectValue: EFFECT_VALUES.ADJACENT,
    description: '周囲への影響力が高い'
  },
  HORIZONTAL_BOOST: {
    difficulty: 'HIGH',
    baseMultiplier: 1.8,
    effectValue: EFFECT_VALUES.HORIZONTAL,
    description: '横一列への攻撃に特化'
  }
} as const;

// クラスごとの武器相性を定義
const CLASS_WEAPON_SYNERGY = {
  warrior: {
    multiplier: 1.8,
    preferredStyle: 'VERTICAL_BOOST',
    description: '攻撃力重視の武器運用'
  },
  archer: {
    multiplier: 1.4,
    preferredStyle: 'DIAGONAL_BOOST',
    description: '精密な狙撃が得意'
  },
  guardian: {
    multiplier: 1.2,
    preferredStyle: 'CROSS_FORMATION',
    description: '防御的な武器活用'
  },
  mage: {
    multiplier: 1.6,
    preferredStyle: 'CROSS_FORMATION',
    description: '魔力による武器強化'
  },
  lancer: {
    multiplier: 2,
    preferredStyle: 'HORIZONTAL_BOOST',
    description: '突撃特化の武器運用'
  }
} as const;

// 武器カード生成関数
function createWeaponCard(
  type: 'ally' | 'enemy',
  index: number,
  weaponConfig: {
    name: string;
    effectType: keyof typeof WEAPON_TRAITS;
    targetClass: keyof typeof CLASS_WEAPON_SYNERGY;
  }
): Card {
  const { name, effectType, targetClass } = weaponConfig;
  const weaponTrait = WEAPON_TRAITS[effectType];
  const classSynergy = CLASS_WEAPON_SYNERGY[targetClass];

  // 基本ポイントの計算
  const baseWeaponPoints = BASE_POINTS.WEAPON;
  const rawAdjustedPoints = baseWeaponPoints * 
    weaponTrait.baseMultiplier * 
    classSynergy.multiplier;
  const adjustedPoints = Math.round(rawAdjustedPoints / 10) * 10;

  // 効果値の調整（5ポイント刻み）
  const rawEffectValue = weaponTrait.effectValue * 
    weaponTrait.baseMultiplier * 
    classSynergy.multiplier;
  const adjustedEffectValue = Math.round(rawEffectValue / 5) * 5;

  return createCard({
    id: generateCardId('weapon', type, index),
    name,
    type,
    category: 'weapon',
    points: calculateCardPoints(adjustedPoints, type, 4, 1, true),
    effect: {
      type: effectType,
      targetClass,
      power: adjustedEffectValue
    },
    turn: 4
  });
}

const WEAPON_DEFINITIONS = {
  warrior: {
    ally: { name: '聖なる剣', effectType: 'VERTICAL_BOOST' as const },
    enemy: { name: '混沌の剣', effectType: 'VERTICAL_BOOST' as const }
  },
  archer: {
    ally: { name: '精霊の弓', effectType: 'DIAGONAL_BOOST' as const },
    enemy: { name: '死霊の弓', effectType: 'DIAGONAL_BOOST' as const }
  },
  guardian: {
    ally: { name: '聖騎士の大盾', effectType: 'CROSS_FORMATION' as const },
    enemy: { name: '魔族の鋼鉄盾', effectType: 'CROSS_FORMATION' as const }
  },
  lancer: {
    ally: { name: '精霊の槍', effectType: 'HORIZONTAL_BOOST' as const },
    enemy: { name: '死霊騎士の槍', effectType: 'HORIZONTAL_BOOST' as const }
  },
  mage: {
    ally: { name: '賢者の杖', effectType: 'CROSS_FORMATION' as const },
    enemy: { name: '闇魔術師の杖', effectType: 'CROSS_FORMATION' as const }
  }
} as const;

// カードの生成
export const TURN4_CARDS: Card[] = [
  // 味方武器カード
  ...Object.entries(WEAPON_DEFINITIONS).map(([className, weapons], index) => 
    createWeaponCard('ally', 41 + index, {
      ...weapons.ally,
      targetClass: className as keyof typeof CLASS_WEAPON_SYNERGY
    })
  ),
  // 敵武器カード
  ...Object.entries(WEAPON_DEFINITIONS).map(([className, weapons], index) =>
    createWeaponCard('enemy', 41 + index, {
      ...weapons.enemy,
      targetClass: className as keyof typeof CLASS_WEAPON_SYNERGY
    })
  )
];