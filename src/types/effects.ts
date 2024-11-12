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
  pointsBonus?: number;
  powerBonus?: number;
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