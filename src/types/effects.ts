// src/types/effects.ts

import type { UnitClass, Direction, EffectType, CardCategory } from './base';

export type BaseEffectType = 
  | 'SELF_POWER_UP_BY_ENEMY_LINE'
  | 'SELF_POWER_UP_BY_ADJACENT_ALLY'
  | 'ADJACENT_UNIT_BUFF'
  | 'ADJACENT_UNIT_DEBUFF'
  | 'ROW_COLUMN_BUFF'
  | 'FIELD_CLASS_POWER_UP'
  | 'WEAPON_ENHANCEMENT'
  | 'UNIT_VERTICAL_ALLY_BOOST'
  | 'UNIT_VERTICAL_ENEMY_DEBUFF'
  | 'DIAGONAL_DEBUFF'
  | 'FIELD_DUAL_EFFECT';

export type WeaponEffectType =
  | 'VERTICAL_BOOST'
  | 'HORIZONTAL_BOOST'
  | 'DIAGONAL_BOOST'
  | 'CROSS_FORMATION'
  | 'SURROUND_BOOST';

export type LeaderEffectType = 
  | 'LEADER_TACTICAL'
  | 'LEADER_ENHANCEMENT'
  | 'LEADER_PROTECTION'
  | 'LEADER_DEBUFF'
  | 'LEADER_DIAGONAL_EFFECT'
  | 'LEADER_GUARDIAN_BOOST'
  | 'LEADER_LANCER_BOOST'
  | 'LEADER_MAGE_EFFECT';

  export type FieldEffectType =
  | 'FIELD_UNIT_BUFF'
  | 'FIELD_UNIT_DEBUFF';

  export type SupportEffectType =
  | 'ROW_COLUMN_BUFF'        // 縦横の列を強化
  | 'WEAPON_ENHANCEMENT';    // 武器の効果を強化

  export type LegendaryEffectType = 
  | 'LEGENDARY_DRAGON_KNIGHT'
  | 'LEGENDARY_SAGE'
  | 'LEGENDARY_DUAL_SWORDSMAN'
  | 'LEGENDARY_CHAOS_DRAGON'
  | 'LEGENDARY_ARCHMAGE'
  | 'LEGENDARY_DEMON_EMPEROR';


export type BaseEffect = {
  type: BaseEffectType;
  power?: number;
  range?: number;
  targetDirection?: Direction;
  classEffects?: Array<{
    class: UnitClass;
    power: number;
  }>;
  targetCategory?: CardCategory;
  effectMultiplier?: number;
  allyBonus?: number;
  enemyPenalty?: number;
  targetClass?: UnitClass;
};

export type FieldEffect = {
  type: FieldEffectType;
  power: number;
  range: number;
  pattern: 'diamond';
};

export type SupportEffect = {
  type: SupportEffectType;
  power?: number;            // 基本効果値
  targetDirection?: 'vertical' | 'horizontal'; // 効果方向
  range?: number;            // 効果範囲
  effectMultiplier?: number; // 効果倍率
};

export type WeaponEffect = {
  type: WeaponEffectType;
  targetClass: UnitClass;  // 単一クラスのみに
  power: number;
};

export type LeaderEffect = {
  type: LeaderEffectType;
  power?: number;
  range?: number;
  supportMultiplier?: number;
  categoryBonus?: {
    weapon?: number;
    field?: number;
    support?: number;
  };
  classEffects?: Array<{
    class: UnitClass;
    power: number;
  }>;
  targetClass?: UnitClass;
  allyBonus?: number;
  enemyPenalty?: number;
  powerPerEnemy?: number;
  selfBoostPerAlly?: number;
  supportBonus?: number;
  adjacentAllyBonus?: number;
  adjacentEnemyPenalty?: number;
};

export type LegendaryEffect = {
  type: LegendaryEffectType;
  description: string;
  primaryEffect?: {
    type: string;
    power: number;
    range?: number;
  };
  secondaryEffect?: {
    type: string;
    power?: number;
    range?: number;
    effectMultiplier?: number;
  };
  fieldEffect?: {
    range: number;
    allyBonus?: number;
    enemyPenalty?: number;
    supportBonus?: number;
  };
  healingEffect?: {
    power: number;
    range: number;
  };
  verticalEffect?: {
    power: number;
    debuff: number;
  };
  horizontalEffect?: {
    power: number;
    debuff: number;
  };
  crossEffect?: {
    allyBonus: number;
    enemyPenalty: number;
  };
  selfEffect?: {
    powerPerEnemy: number;
    range: number;
  };
};

export type EffectContext = {
  sourceCard: Card;
  targetCard: PlacedCard;
  board: (PlacedCard | null)[][];
};

export type EffectResult = {
  value: number;
  type: EffectType;
  description: string;
  affected: Position[];
};

export function isFieldEffect(effect: Effect): effect is FieldEffect {
  return (effect as FieldEffect).pattern === 'diamond';
}

export type Effect = 
  | BaseEffect 
  | WeaponEffect 
  | LeaderEffect 
  | FieldEffect 
  | SupportEffect
  | LegendaryEffect;