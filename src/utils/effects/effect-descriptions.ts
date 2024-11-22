// src/utils/effects/effect-descriptions.ts

import { 
  getEffectRange
} from './effect-system';
import { 
  BaseEffect,
  LeaderEffect,
  Card,
  FieldEffect,
  SupportEffect,
  isFieldEffect,
  EffectDetails,
  EffectWithType,
  WeaponEffect,
  UnitClass,
  LegendaryEffect,
  BossEffect
} from '@/types';
import { getClassDisplayName } from '@/utils/common';
  
// src/utils/effects/effect-descriptions.ts

export function getEffectDetails(input: Card): EffectDetails | null {
  // 最初にeffectの存在チェック
  if (!input.effect) return null;
  const effect = input.effect;

  // 位置は固定値を使用
  const position = { row: 2, col: 2 };
  const range = getEffectRange(effect, position);

  if (isFieldEffect(effect)) {
    return {
      type: effect.type,
      effectType: 'field',
      description: getFieldEffectDescription(effect),
      range,
      pattern: 'FIELD'
    };
  }

  if (effect.type === 'SELF_POWER_UP_BY_ADJACENT_ALLY') {
    return {
      type: effect.type,
      effectType: 'base',
      description: getSelfEffectDescription(effect as BaseEffect),
      range
    };
  }

  if (effect.type === 'ROW_COLUMN_BUFF' || effect.type === 'WEAPON_ENHANCEMENT') {
    return {
      type: effect.type,
      effectType: 'support',
      description: getSupportEffectDescription(effect as SupportEffect),
      range
    };
  }

  if ('targetClass' in effect) {
    return {
      type: effect.type,
      effectType: 'weapon',
      description: getWeaponEffectDescription(effect as WeaponEffect),
      range
    };
  }

  if (effect.type.startsWith('LEADER_')) {
    return {
      type: effect.type,
      effectType: 'leader',
      description: getLeaderEffectDescription(effect as LeaderEffect),
      range
    };
  }

  if (effect.type.startsWith('LEGENDARY_')) {
    return {
      type: effect.type,
      effectType: 'legendary',
      description: getLegendaryEffectDescription(effect as LegendaryEffect),
      range
    };
  }

  if (effect.type.startsWith('BOSS_')) {
    return {
      type: effect.type,
      effectType: 'boss',
      description: getBossEffectDescription(effect as BossEffect),
      range,
      pattern: 'FIELD'
    };
  }

  return {
    type: effect.type,
    effectType: 'base',
    description: getBaseEffectDescription(effect as BaseEffect),
    range
  };
}
  
  export function getBaseEffectDescription(effect: BaseEffect): string {
    const power = effect.power || 0;
    switch (effect.type) {
        case 'UNIT_VERTICAL_ENEMY_DEBUFF':
            return `縦方向の敵ユニットを${power}弱体化`;
      case 'DIAGONAL_DEBUFF':
        return `斜め方向の敵ユニットを${power}弱体化`;
      case 'ADJACENT_UNIT_BUFF':{
        return `隣接する味方ユニットを${effect.power}強化`;
      }
        case 'ROW_COLUMN_BUFF': {
          const direction = effect.targetDirection === 'vertical' ? '縦' : '横';
          return `${direction}方向のカードを${effect.power}強化`;
        }
        
        case 'FIELD_DUAL_EFFECT':
      const range = effect.range || 2;
      const allyBonus = effect.allyBonus || 0;
      const enemyPenalty = Math.abs(effect.enemyPenalty || 0);
      return `範囲${range}マス内の味方ユニットを${allyBonus}強化、敵ユニットを${enemyPenalty}弱体化`;
      
      default:
        return '効果なし';
    }
  }
  
  export function getFieldEffectDescription(effect: FieldEffect): string {
    const rangeText = '◇範囲内の';
    const powerText = `${effect.power}`;
    return effect.type === 'FIELD_UNIT_BUFF'
      ? `${rangeText}味方ユニットを${powerText}強化`
      : `${rangeText}敵ユニットを${powerText}弱体化`;
  }
  
  export function getSelfEffectDescription(effect: BaseEffect): string {
    return `隣接する味方ユニット1体につき自信を${effect.power || 0}強化`;
  }

  export function getSupportEffectDescription(effect: SupportEffect): string {
    switch (effect.type) {
      case 'ROW_COLUMN_BUFF': {
        const direction = effect.targetDirection === 'vertical' ? '列' : '行';
        return `同じ${direction}にいる味方ユニットを${effect.power}強化`;
      }
  
      case 'WEAPON_ENHANCEMENT': {
        const range = effect.range || 1;
        const multiplier = effect.effectMultiplier || 2;
        const powerBonus = effect.power || 0;
        return `周囲${range}マスの武器カードの効果を${multiplier}倍に増幅し、${powerBonus}強化z`;
      }
  
      default:
        return '効果なし';
    }
  }
  
  export function getWeaponEffectDescription(effect: WeaponEffect): string {
    const directionText = getDirectionText(effect.type);
    
    if (effect.targetClasses) {
      const classNames = effect.targetClasses.map((c: UnitClass) => 
        getClassDisplayName(c)
      ).join('と');
      return `${directionText}の${classNames}を${effect.power}強化`;
    }
  
    const targetClass = getClassDisplayName(effect.targetClass);
    return `${directionText}の${targetClass}を${effect.power}強化`;
  }
  
  export function getLeaderEffectDescription(effect: LeaderEffect): string {
    switch (effect.type) {
      case 'LEADER_ARCHER_DEBUFF':
        return `斜め方向の敵ユニットに${Math.abs(effect.basePenalty || 0)}の弱体化。自身が武器効果を受けている場合は${Math.abs(effect.weaponPenalty || 0)}の弱体化`;
      case 'LEADER_GUARDIAN_BOOST':
        return `隣接する味方1体につき自身が${effect.selfBoostPerAlly}上昇、隣接する味方を${effect.allyBonus}強化`;
  
        case 'LEADER_LANCER_BOOST':
          return `横方向の敵ユニット1体につき自身を${effect.selfBoostPerEnemy}強化`;
    
      case 'LEADER_MAGE_EFFECT':
        return `範囲${effect.range}マス内の味方ユニット+${effect.allyBonus}、敵ユニット${effect.enemyPenalty}、サポート${effect.supportBonus ? '+' + effect.supportBonus : '無し'}`;
  
      default:
        return '効果なし';
    }
  }

  export function getLegendaryEffectDescription(effect: EffectWithType): string {
    switch (effect.type) {
      case 'LEGENDARY_DRAGON_KNIGHT':
        return `隣接する味方を${effect.primaryEffect.power}強化し、範囲${effect.secondaryEffect.range}マス以内の武器効果を${effect.secondaryEffect.effectMultiplier}倍に増幅`;
      
      case 'LEGENDARY_SAGE':
        return `範囲${effect.fieldEffect.range}マスの味方を${effect.fieldEffect.allyBonus}強化、サポートを${effect.fieldEffect.supportBonus}強化し、隣接する味方のマイナス効果を無効化`;
      
      case 'LEGENDARY_DUAL_SWORDSMAN':
        return `縦横の味方を${effect.primaryEffect.power}強化し、敵を${Math.abs(effect.secondaryEffect.effectMultiplier)}弱体化`;
      
      case 'LEGENDARY_CHAOS_DRAGON':
        return `隣接する味方を${effect.primaryEffect.power}強化し、範囲${effect.fieldEffect.range}マスの敵ユニットを${Math.abs(effect.fieldEffect.enemyPenalty)}弱体化`;
  
      case 'LEGENDARY_ARCHMAGE':
        return `範囲${effect.fieldEffect.range}マスの味方ユニットを${effect.fieldEffect.allyBonus}強化し、敵を${Math.abs(effect.fieldEffect.enemyPenalty)}弱体化。武器効果を${effect.weaponEffect.effectMultiplier}倍`;
  
      case 'LEGENDARY_DEMON_EMPEROR':
        return `十字方向の味方ユニットを${effect.crossEffect.allyBonus}強化、敵を${Math.abs(effect.crossEffect.enemyPenalty)}弱体化。
                周囲${effect.selfEffect.range}マスの敵1体につき自身を${effect.selfEffect.powerPerEnemy}強化`;
  
      default:
        return '効果なし';
    }
  }

  function getBossEffectDescription(effect: EffectWithType): string {
    switch (effect.type) {
      case 'BOSS_IFRIT': {
        const range = effect.primaryEffect?.range || 2;
        const penalty = Math.abs(effect.primaryEffect?.enemyPenalty || 0);
        const powerUp = effect.secondaryEffect?.powerPerWeakened || 0;
        return `◇範囲${range}マス内の敵ユニットを${penalty}弱体化し、
                範囲内の敵1体につき自身を${powerUp}強化する`;
      }
      default:
        return '強大な力を持つ';
    }
  }
  
  function getDirectionText(type: string): string {
    if (type.includes('VERTICAL')) return '縦方向';
    if (type.includes('HORIZONTAL')) return '横方向';
    if (type.includes('DIAGONAL')) return '斜め方向';
    if (type.includes('CROSS')) return '十字方向';
    return '範囲';
  }

