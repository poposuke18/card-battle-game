// src/types/effects.ts

import type { UnitClass, Direction, EffectType, CardCategory } from './base';
import type { Position, PlacedCard, Card } from '@/types';


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
  | 'LEGENDARY_DEMON_EMPEROR';

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
};

export type WeaponEffect = {
  type: WeaponEffectType;
  targetClass: UnitClass;
  power: number;
  targetClasses?: UnitClass[]; // 複数クラスに対応する場合
};

export type LeaderEffect = {
  type: LeaderEffectType;
  // 共通のプロパティ
  range?: number;
  power?: number;
  
  // LEADER_ARCHER_DEBUFF用
  basePenalty?: number;
  weaponPenalty?: number;
  
  // LEADER_GUARDIAN_BOOST用
  selfBoostPerAlly?: number;
  allyBonus?: number;
  
  // LEADER_LANCER_BOOST用
  selfBoostPerEnemy?: number;
  targetDirection?: 'horizontal' | 'vertical';
  
  // LEADER_MAGE_EFFECT用
  enemyPenalty?: number;
  supportBonus?: number;
  
  // その他のオプショナルプロパティ
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

export type EffectDetails = {
  type: string;
  effectType: 'base' | 'weapon' | 'leader' | 'field' | 'legendary' | 'boss' | 'support';
  description: string;
  range: Position[];
  pattern?: string;
};

export type EffectWithType = BaseEffect | WeaponEffect | LeaderEffect | LegendaryEffect | BossEffect | SupportEffect;


export type LegendaryEffect = {
  type: LegendaryEffectType;  // This should match the LegendaryEffectType union
  description: string;
  primaryEffect: {
    type: string;
    power: number;
    range?: number;
  };
  secondaryEffect: {
    type: string;
    power?: number;
    range: number;
    effectMultiplier: number;
  };
  fieldEffect: {
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
  weaponEffect: {  // これを追加
    range: number;
    effectMultiplier: number;
  };
  horizontalEffect: {
    power: number;
    debuff: number;
  };
  crossEffect: {
    allyBonus: number;
    enemyPenalty: number;
  };
  selfEffect: {
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

export type BossEffect = {
  type: BossEffectType;
  primaryEffect: {
    range?: number;
    enemyPenalty?: number;
    pattern?: string;
    allyBonus?: number;
    weaponNullification?: boolean;
    description?: string;
  };
  secondaryEffect: {
    powerPerWeakened?: number;
    allyBoost?: number;
    targetDirection?: string;
    description?: string;
  };
  ultimateEffect?: {
    name?: string;
    damage?: number;
    pattern?: string;
    description?: string;
    power?: number;
    targetDirection?: string;
    effectNullification?: boolean;
  };
  description?: string;
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
  | BossEffect
  | LegendaryEffect;

