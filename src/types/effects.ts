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

  export type LeaderEffectType = 
  | 'LEADER_TACTICAL'     // 特定クラスの強化とサポート効果倍率
  | 'LEADER_BASIC'        // 効果なし（純粋な点数のみ）
  | 'LEADER_ENHANCEMENT'  // カテゴリーカードの点数加算
  | 'LEADER_PROTECTION'   // 隣接ユニットによる効果
  | 'LEADER_DEBUFF';      // 隣接ユニットへのデバフ

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

export type Effect = BaseEffect | WeaponEffect | LeaderEffect;

export type CategoryBonus = {
  weapon?: number;
  field?: number;
  support?: number;
};

export type LeaderEffect = {
  type: LeaderEffectType;
  classEffects?: {
    class: UnitClass;
    power: number;
  }[];
  range?: number;
  supportMultiplier?: number;     // サポートカードの効果倍率
  categoryBonus?: {              // カテゴリー別の点数加算
    weapon?: number;
    field?: number;
    support?: number;
  };
  adjacentAllyBonus?: number;    // 隣接する味方1体あたりの加算値
  adjacentEnemyPenalty?: number; // 隣接する敵への減算値
  adjacentEnemyBonus?: number;   // 隣接する敵1体あたりの加算値
  adjacentDebuff?: number;       // 隣接ユニット全体への減算値
};