// src/types/effects.ts

import type { UnitClass, Direction, EffectType, CardCategory } from './base';

export type BaseEffectType = 
  | 'SELF_POWER_UP_BY_ENEMY_LINE'
  | 'SELF_POWER_UP_BY_ADJACENT_ALLY'
  | 'ADJACENT_UNIT_BUFF'
  | 'ADJACENT_VERTICAL_BOOST'
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
  |'LEADER_ARCHER_DEBUFF'
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
  | 'LEGENDARY_DEMON_EMPEROR'
  // 新しいシンプル伝説効果
  | 'LEGENDARY_ARTHUR'
  | 'LEGENDARY_EMILIA'
  | 'LEGENDARY_VARGA'
  | 'LEGENDARY_NECRO'
  | 'LEGENDARY_ZARON';

export type BossEffectType = 
  | 'BOSS_IFRIT'
  | 'BOSS_BAHAMUT'
  | 'BOSS_LEVIATHAN'
  | 'BOSS_ODIN';

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
  power?: number;
  targetDirection?: 'vertical' | 'horizontal';
  range?: number;
  effectMultiplier?: number;
  targetClass?: UnitClass;
};

export type WeaponEffect = {
  type: WeaponEffectType;
  targetClass: UnitClass;
  power: number;
  targetClasses?: UnitClass[];
};

export type LeaderEffect = {
  type: LeaderEffectType;
  range?: number;
  power?: number;
  basePenalty?: number;
  weaponPenalty?: number;
  selfBoostPerAlly?: number;
  allyBonus?: number;
  selfBoostPerEnemy?: number;
  targetDirection?: 'horizontal' | 'vertical';
  enemyPenalty?: number;
  supportBonus?: number;
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
  adjacentAllyBonus?: number;
  adjacentEnemyPenalty?: number;
};

export type LegendaryEffect = {
  type: LegendaryEffectType;
  range?: number;
  description?: string;
  power?: number;
  weaponMultiplier?: number;
  supportMultiplier?: number;
  // 複雑な旧効果用のプロパティ（互換性のため残す）
  primaryEffect?: {
    type: string;
    power: number;
    range?: number;
  };
  secondaryEffect?: {
    type: string;
    power?: number;
    range: number;
    effectMultiplier: number;
  };
  fieldEffect?: {
    range: number;
    allyBonus: number;
    enemyPenalty: number;
    supportBonus: number;
  };
  healingEffect?: {
    power: number;
    range: number;
  };
  verticalEffect?: {
    power: number;
    debuff: number;
  };
  weaponEffect?: {
    range: number;
    effectMultiplier: number;
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

export type BossEffect = {
  type: BossEffectType;
  primaryEffect: {
    name?: string;
    range?: number;
    poisonEffect?: number;
    penetration?: boolean;
    enemyPenalty?: number;
    movement?: boolean;
    pattern?: string;
    allyBonus?: number;
    weaponNullification?: boolean;
    description?: string;
  };
  secondaryEffect: {
    name?: string;
    powerPerWeakened?: number;
    moveRange?: number;
    allyBoost?: number;
    afterEffect?: boolean;
    targetDirection?: string;
    description?: string;
  };
  ultimateEffect?: {
    name?: string;
    damage?: number;
    duration?: number;
    globalEffect?: boolean;
    pattern?: string;
    description?: string;
    power?: number;
    targetDirection?: string;
    effectNullification?: boolean;
  };
  description?: string;
};

export type Effect = 
  | BaseEffect 
  | WeaponEffect 
  | LeaderEffect 
  | FieldEffect 
  | SupportEffect 
  | BossEffect
  | LegendaryEffect;