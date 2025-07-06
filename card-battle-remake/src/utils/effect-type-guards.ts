// エフェクト型の型ガード関数
import type { Effect } from '@/types';

// 基本効果の型ガード
export function isUnitVerticalEnemyDebuffEffect(effect: Effect): effect is Effect & { power: number } {
  return effect.type === 'UNIT_VERTICAL_ENEMY_DEBUFF' && typeof (effect as any).power === 'number';
}

export function isAdjacentUnitBuffEffect(effect: Effect): effect is Effect & { power: number } {
  return effect.type === 'ADJACENT_UNIT_BUFF' && typeof (effect as any).power === 'number';
}

export function isDiagonalDebuffEffect(effect: Effect): effect is Effect & { power: number } {
  return effect.type === 'DIAGONAL_DEBUFF' && typeof (effect as any).power === 'number';
}

export function isSelfPowerUpEffect(effect: Effect): effect is Effect & { power: number } {
  return effect.type === 'SELF_POWER_UP_BY_ADJACENT_ALLY' && typeof (effect as any).power === 'number';
}

// フィールド効果の型ガード
export function isFieldDualEffect(effect: Effect): effect is Effect & { 
  range: number; 
  allyBonus: number; 
  enemyPenalty: number; 
} {
  return effect.type === 'FIELD_DUAL_EFFECT';
}

export function isFieldUnitBuffEffect(effect: Effect): effect is Effect & { 
  range: number; 
  power: number; 
} {
  return effect.type === 'FIELD_UNIT_BUFF';
}

export function isFieldUnitDebuffEffect(effect: Effect): effect is Effect & { 
  range: number; 
  power: number; 
} {
  return effect.type === 'FIELD_UNIT_DEBUFF';
}

// 武器効果の型ガード
export function isWeaponEffect(effect: Effect): effect is Effect & { 
  targetClass: string; 
  power: number; 
} {
  return ['VERTICAL_BOOST', 'HORIZONTAL_BOOST', 'DIAGONAL_BOOST', 'CROSS_FORMATION'].includes(effect.type);
}

export function isVerticalBoostEffect(effect: Effect): effect is Effect & { 
  targetClass: string; 
  power: number; 
} {
  return effect.type === 'VERTICAL_BOOST';
}

export function isHorizontalBoostEffect(effect: Effect): effect is Effect & { 
  targetClass: string; 
  power: number; 
} {
  return effect.type === 'HORIZONTAL_BOOST';
}

export function isDiagonalBoostEffect(effect: Effect): effect is Effect & { 
  targetClass: string; 
  power: number; 
} {
  return effect.type === 'DIAGONAL_BOOST';
}

export function isCrossFormationEffect(effect: Effect): effect is Effect & { 
  targetClass: string; 
  power: number; 
} {
  return effect.type === 'CROSS_FORMATION';
}

// サポート効果の型ガード
export function isWeaponEnhancementEffect(effect: Effect): effect is Effect & { 
  effectMultiplier: number; 
} {
  return effect.type === 'WEAPON_ENHANCEMENT';
}

export function isRowColumnBuffEffect(effect: Effect): effect is Effect & { 
  targetDirection: 'vertical' | 'horizontal'; 
  power: number; 
} {
  return effect.type === 'ROW_COLUMN_BUFF';
}

// リーダー効果の型ガード
export function isLeaderArcherDebuffEffect(effect: Effect): effect is Effect & { 
  basePenalty: number; 
  weaponPenalty: number; 
} {
  return effect.type === 'LEADER_ARCHER_DEBUFF';
}

export function isLeaderGuardianBoostEffect(effect: Effect): effect is Effect & { 
  selfBoostPerAlly: number; 
  allyBonus: number; 
} {
  return effect.type === 'LEADER_GUARDIAN_BOOST';
}

export function isLeaderLancerBoostEffect(effect: Effect): effect is Effect & { 
  selfBoostPerEnemy: number; 
  targetDirection: string; 
} {
  return effect.type === 'LEADER_LANCER_BOOST';
}

export function isLeaderMageEffect(effect: Effect): effect is Effect & { 
  range: number; 
  allyBonus: number; 
  enemyPenalty: number; 
  supportBonus: number; 
} {
  return effect.type === 'LEADER_MAGE_EFFECT';
}

// 伝説効果の型ガード
export function isLegendaryArthurEffect(effect: Effect): effect is Effect & { 
  power: number; 
  weaponMultiplier: number; 
} {
  return effect.type === 'LEGENDARY_ARTHUR';
}

export function isLegendaryEmiliaEffect(effect: Effect): effect is Effect & { 
  supportMultiplier: number; 
} {
  return effect.type === 'LEGENDARY_EMILIA';
}

export function isLegendaryDualSwordsmanEffect(effect: Effect): effect is Effect & { 
  power: number; 
} {
  return effect.type === 'LEGENDARY_DUAL_SWORDSMAN';
}

export function isLegendaryVargaEffect(effect: Effect): effect is Effect & { 
  power: number; 
} {
  return effect.type === 'LEGENDARY_VARGA';
}

export function isLegendaryNecroEffect(effect: Effect): effect is Effect & { 
  range: number; 
  weaponMultiplier: number; 
  supportMultiplier: number; 
} {
  return effect.type === 'LEGENDARY_NECRO';
}

export function isLegendaryZaronEffect(effect: Effect): effect is Effect & { 
  power: number; 
} {
  return effect.type === 'LEGENDARY_ZARON';
}

// ボス効果の型ガード
export function isBossIfritEffect(effect: Effect): effect is Effect & { 
  primaryEffect: { range: number; enemyPenalty: number };
  secondaryEffect: { powerPerWeakened: number };
} {
  return effect.type === 'BOSS_IFRIT';
}

// 汎用的な型ガード
export function hasNumericProperty(effect: Effect, property: string): boolean {
  return typeof (effect as any)[property] === 'number';
}

export function hasStringProperty(effect: Effect, property: string): boolean {
  return typeof (effect as any)[property] === 'string';
}

export function hasObjectProperty(effect: Effect, property: string): boolean {
  return typeof (effect as any)[property] === 'object' && (effect as any)[property] !== null;
}