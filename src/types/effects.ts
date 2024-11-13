import type { UnitClass, CardCategory } from './base';

export type BaseEffectType = 
  | 'SELF_POWER_UP_BY_ENEMY_LINE'
  | 'SELF_POWER_UP_BY_ADJACENT_ALLY'
  | 'ADJACENT_UNIT_BUFF'
  | 'ADJACENT_UNIT_DEBUFF'
  | 'FIELD_UNIT_BUFF'
  | 'FIELD_UNIT_DEBUFF'
  | 'ROW_COLUMN_BUFF'
  | 'FIELD_CLASS_POWER_UP'
  | 'WEAPON_ENHANCEMENT';

type ClassEffect = {
  class: UnitClass;
  power: number;
};

export type BaseEffect = {
  type: BaseEffectType;
  power?: number;
  range?: number;
  targetDirection?: 'vertical' | 'horizontal';
  classEffects?: ClassEffect[];
  targetCategory?: CardCategory;
  // 新しいプロパティを追加
  effectMultiplier?: number;  // 武器効果の倍率
};

export type WeaponEffectType =
  | 'VERTICAL_BOOST'
  | 'HORIZONTAL_BOOST'
  | 'DIAGONAL_BOOST'
  | 'CROSS_FORMATION'
  | 'SURROUND_BOOST';

export type WeaponEffect = {
  type: WeaponEffectType;
  targetClass: UnitClass;
  power: number;
};

export type LeaderEffectType = 
  | 'LEADER_TACTICAL'    // クラス別強化
  | 'LEADER_FORMATION'   // 陣形ボーナス
  | 'LEADER_ENHANCEMENT' // 武器・サポート強化
  | 'LEADER_PROTECTION'; // 防御・反撃

  export type LeaderEffect = {
    type: LeaderEffectType;
    classEffects?: ClassEffect[];
    power?: number;
    range?: number;
    supportBonus?: number;
    weaponBonus?: number;
    defenseBonus?: number;
    counterAttack?: number;
    formationBonus?: {
      vertical: number;
      horizontal: number;
    };
  };