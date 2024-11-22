// src/utils/effects/effect-system.ts

import { 
  Position, 
  PlacedCard, 
  Card, 
  Effect,
  BaseEffect,
  WeaponEffect,
  LeaderEffect,
  FieldEffect,
  BossEffect,
  isFieldEffect
} from '@/types';
import { LegendaryEffect, SupportEffect } from '@/types/effects';


type EffectResult = {
  effect: Effect;
  value: number;
  source: Card;
};

// 定数定義
export const EFFECT_PATTERNS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  DIAGONAL: 'diagonal',
  CROSS: 'cross',
  FIELD: 'field',
  ALL: 'all'
} as const;

export const EFFECT_PRIORITIES = {
  LEGENDARY: 120,  // 最優先
  LEADER: 100,
  WEAPON: 80,
  FIELD: 60,
  UNIT: 40,
  DEBUFF: 30,
  BASE: 20
} as const;

// 基本型定義
export type EffectStyle = {
  color: string;
  pattern: keyof typeof EFFECT_PATTERNS;
  intensity: number;
};

export type EffectContext = {
  sourcePosition: Position;
  targetPosition: Position;
  sourceCard: Card;
  targetCard: PlacedCard;
  board: (PlacedCard | null)[][];
};

export type EffectDetails = {
  type: string;
  effectType: 'base' | 'weapon' | 'leader' | 'field' | 'legendary' | 'boss';
  description: string;
  range: Position[];
  primaryEffect?: string;
  secondaryEffects?: string[];
  pattern?: keyof typeof EFFECT_PATTERNS;
};



export function calculateCardEffects(
  position: Position,
  board: (PlacedCard | null)[][],
  targetCard: PlacedCard
): EffectResult[] {
  const results: EffectResult[] = [];

  // 自身の効果の計算
  if (targetCard.card.effect) {
    const context = {
      sourcePosition: position,
      targetPosition: position,
      sourceCard: targetCard.card,
      targetCard,
      board
    };

    // 効果タイプに応じた処理
    switch (targetCard.card.effect.type) {
      case 'SELF_POWER_UP_BY_ADJACENT_ALLY': {
        const adjacentAllies = countAdjacentAllies(position, board, targetCard.card.type);
        const powerUp = (targetCard.card.effect.power || 0) * adjacentAllies;
        
        if (powerUp > 0) {
          results.push({
            effect: targetCard.card.effect,
            value: powerUp,
            source: targetCard.card
          });
        }
        break;
      }

      // 伝説カードの自己効果
      case 'LEGENDARY_DRAGON_KNIGHT':
      case 'LEGENDARY_SAGE':
      case 'LEGENDARY_DUAL_SWORDSMAN':
      case 'LEGENDARY_CHAOS_DRAGON':
      case 'LEGENDARY_ARCHMAGE':
      case 'LEGENDARY_DEMON_EMPEROR': {
        if (checkEffectConditions(context, targetCard.card.effect)) {
          const value = calculateEffectValue(context, targetCard.card.effect);
          if (value !== 0) {
            results.push({
              effect: targetCard.card.effect,
              value,
              source: targetCard.card
            });
          }
        }
        break;
      }

      // ボスカードの自己効果
      case 'BOSS_IFRIT':
      case 'BOSS_BAHAMUT':
      case 'BOSS_LEVIATHAN':
      case 'BOSS_ODIN': {
        if (checkEffectConditions(context, targetCard.card.effect)) {
          const value = calculateEffectValue(context, targetCard.card.effect);
          if (value !== 0) {
            results.push({
              effect: targetCard.card.effect,
              value,
              source: targetCard.card
            });
          }
        }
        break;
      }

      // リーダーの自己効果
      case 'LEADER_GUARDIAN_BOOST':
      case 'LEADER_LANCER_BOOST': {
        if (checkEffectConditions(context, targetCard.card.effect) && targetCard.card.category === 'unit') {
          const value = calculateEffectValue(context, targetCard.card.effect);
          if (value !== 0) {
            results.push({
              effect: targetCard.card.effect,
              value,
              source: targetCard.card
            });
          }
        }
        break;
      }

      // その他の効果
      default: {
        if (checkEffectConditions(context, targetCard.card.effect)) {
          const value = calculateEffectValue(context, targetCard.card.effect);
          if (value !== 0) {
            results.push({
              effect: targetCard.card.effect,
              value,
              source: targetCard.card
            });
          }
        }
      }
    }
  }

  // 他のカードからの効果を計算
  board.forEach((row, rowIndex) => {
    row.forEach((sourceCell, colIndex) => {
      if (!sourceCell?.card.effect) return;
      if (rowIndex === position.row && colIndex === position.col) return;

      const context = {
        sourcePosition: { row: rowIndex, col: colIndex },
        targetPosition: position,
        sourceCard: sourceCell.card,
        targetCard,
        board
      };

      // エレミアの保護効果下ではマイナス効果を無効化
      const hasSageProtection = 
        sourceCell.card.effect.type === 'LEGENDARY_SAGE' &&
        calculateManhattanDistance(context.sourcePosition, context.targetPosition) === 1 &&
        targetCard.card.type === sourceCell.card.type &&
        targetCard.card.category === 'unit';

      if (checkEffectConditions(context, sourceCell.card.effect)) {
        let value = calculateEffectValue(context, sourceCell.card.effect);
        
        // エレミアの保護効果があればマイナス効果を0に
        if (hasSageProtection && value < 0) {
          value = 0;
        }

        if (value !== 0) {
          results.push({
            effect: sourceCell.card.effect,
            value,
            source: sourceCell.card
          });
        }
      }
    });
  });

  return results;
}

export function countAdjacentAllies(
  position: Position,
  board: (PlacedCard | null)[][],
  type: 'ally' | 'enemy'
): number {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  return directions.reduce((count, [dx, dy]) => {
    const newRow = position.row + dx;
    const newCol = position.col + dy;

    if (newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length) {
      const cell = board[newRow][newCol];
      if (cell && cell.card.type === type && cell.card.category === 'unit') {
        count++;
      }
    }

    return count;
  }, 0);
}

function calculateManhattanDistance(from: Position, to: Position): number {
  return Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
}

function isAdjacent(pos1: Position, pos2: Position): boolean {
  const distance = calculateManhattanDistance(pos1, pos2);
  return distance === 1;
}

export function countHorizontalEnemies(
  position: Position,
  board: (PlacedCard | null)[][],
  allyType: 'ally' | 'enemy'
): number {
  let count = 0;
  const row = position.row;
  
  // 左方向のチェック
  for (let col = position.col - 1; col >= 0; col--) {
    const cell = board[row][col];
    // ユニットのみをカウント
    if (cell && 
        cell.card.type !== allyType && 
        cell.card.category === 'unit') {
      count++;
    }
  }
  
  // 右方向のチェック
  for (let col = position.col + 1; col < board[0].length; col++) {
    const cell = board[row][col];
    // ユニットのみをカウント
    if (cell && 
        cell.card.type !== allyType && 
        cell.card.category === 'unit') {
      count++;
    }
  }

  return Math.min(count, 4); // 最大2体までカウント
}

function isDiagonallyAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos2.row - pos1.row);
  const colDiff = Math.abs(pos2.col - pos1.col);
  return rowDiff === 1 && colDiff === 1;
}

function isVerticallyAdjacent(pos1: Position, pos2: Position): boolean {
  return pos1.col === pos2.col && Math.abs(pos2.row - pos1.row) === 1;
}

function isSameType(card1: Card, card2: Card): boolean {
  return card1.type === card2.type;
}

export function getEffectRange(effect: Effect, position: Position): Position[] {
  const positions: Position[] = [];
  const offset = (r: number, c: number) => ({
    row: position.row + r,
    col: position.col + c
  });

  if (!effect) return positions;

  if (isFieldEffect(effect)) {
    return [
      offset(-2, 0),
      offset(-1, -1), offset(-1, 0), offset(-1, 1),
      offset(0, -2), offset(0, -1), offset(0, 1), offset(0, 2),
      offset(1, -1), offset(1, 0), offset(1, 1),
      offset(2, 0)
    ];
  }

  if (effect.type.startsWith('BOSS_')) {
    switch (effect.type) {
      case 'BOSS_IFRIT': {
        // 範囲2マスの効果
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (Math.abs(r) + Math.abs(c) <= 2) { // マンハッタン距離で2以内
              positions.push(offset(r, c));
            }
          }
        }
        return positions.filter(pos => isPositionValid(pos));
      }
    }
  }

  switch (effect.type) {
    case 'UNIT_VERTICAL_ENEMY_DEBUFF':
      return [offset(-1, 0), offset(1, 0)];

    case 'DIAGONAL_DEBUFF':
      return [
        offset(-1, -1), offset(-1, 1),
        offset(1, -1), offset(1, 1)
      ];

    case 'ADJACENT_UNIT_BUFF':
      return [
        offset(-1, 0), offset(1, 0),
        offset(0, -1), offset(0, 1)
      ];

    case 'WEAPON_ENHANCEMENT':
      return [
        offset(-1, 0), offset(1, 0),
        offset(0, -1), offset(0, 1)
      ];

    case 'LEADER_ARCHER_DEBUFF':
      return [
        offset(-1, -1), offset(-1, 1),
        offset(1, -1), offset(1, 1)
      ].filter(pos => isPositionValid(pos));   

    case 'LEADER_GUARDIAN_BOOST':
      return [
        offset(-1, 0), offset(1, 0),
        offset(0, -1), offset(0, 1)
      ];

    case 'LEADER_LANCER_BOOST':
      return Array.from({ length: 5 }, (_, i) => 
        offset(0, i - position.col)
      ).filter(pos => 
        pos.col !== position.col && 
        isPositionValid(pos)
      );      

    case 'LEADER_MAGE_EFFECT': {
      const range = effect.range || 2;
      for (let r = -range; r <= range; r++) {
        for (let c = -range; c <= range; c++) {
          if (r === 0 && c === 0) continue;
          positions.push(offset(r, c));
        }
      }
      return positions;
    }

    case 'ROW_COLUMN_BUFF': {
      const { targetDirection } = effect;
      
      if (targetDirection === 'vertical') {
        // 縦方向の範囲
        for (let r = 0; r < 5; r++) {
          if (r !== position.row) {
            positions.push({ row: r, col: position.col });
          }
        }
      } else {
        // 横方向の範囲
        for (let c = 0; c < 5; c++) {
          if (c !== position.col) {
            positions.push({ row: position.row, col: c });
          }
        }
      }
      return positions;
    }

    case 'VERTICAL_BOOST':
      return [offset(-1, 0), offset(1, 0)];

    case 'HORIZONTAL_BOOST':
      return [offset(0, -1), offset(0, 1)];

    case 'DIAGONAL_BOOST':
      return [
        offset(-1, -1), offset(-1, 1),
        offset(1, -1), offset(1, 1)
      ];

    case 'CROSS_FORMATION':
      return [
        offset(-1, 0), offset(1, 0),
        offset(0, -1), offset(0, 1)
      ];

    case 'FIELD_DUAL_EFFECT': {
      const range = effect.range || 2;
      const positions: Position[] = [];
      
      for (let r = -range; r <= range; r++) {
        for (let c = -range; c <= range; c++) {
          if (r === 0 && c === 0) continue;
          
          const newRow = position.row + r;
          const newCol = position.col + c;
          
          if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
            positions.push({ row: newRow, col: newCol });
          }
        }
      }
      return positions;
    }

    default:
      return [];
  }
}

function isPositionValid(position: Position): boolean {
  return position.row >= 0 && position.row < 5 && position.col >= 0 && position.col < 5;
}

export function calculateEffectValue(context: EffectContext, effect: Effect | null): number {
  if (!effect || !checkEffectConditions(context, effect)) return 0;

  // エレミアの隣接効果チェック（マイナス効果を無効化）
  const targetCard = context.targetCard;
  const hasSageProtection = context.board.some((row, rowIndex) => {
    return row.some((cell, colIndex) => {
      if (!cell?.card.effect || cell.card.effect.type !== 'LEGENDARY_SAGE') return false;
      
      // エレミアとの距離を計算
      const distance = calculateManhattanDistance(
        { row: rowIndex, col: colIndex },
        context.targetPosition
      );

      // 隣接していて、かつ味方のユニットである場合
      return distance === 1 && 
             cell.card.type === targetCard.card.type &&
             targetCard.card.category === 'unit';
    });
  });

  let value = 0;

  if (effect.type.startsWith('BOSS_')) {
    value = calculateBossEffectValue(context, effect as BossEffect);
  } else if (effect.type.startsWith('LEGENDARY_')) {
    value = calculateLegendaryEffectValue(context, effect as LegendaryEffect);
  
  }
   else if (isFieldEffect(effect)) {
    value = calculateFieldEffectValue(context, effect);
  } else if ('targetClass' in effect) {
    value = calculateWeaponEffectValue(context, effect as WeaponEffect);
  } else if (effect.type.startsWith('LEADER_')) {
    value = calculateLeaderEffectValue(context, effect as LeaderEffect);
  } else if (effect.type === 'ROW_COLUMN_BUFF' || effect.type === 'WEAPON_ENHANCEMENT') {
    value = calculateSupportEffectValue(context, effect as SupportEffect);
  } else {
    value = calculateBaseEffectValue(context, effect as BaseEffect);
  }

  switch (effect.type) {
    // ボス効果の処理
    case 'BOSS_IFRIT':
    case 'BOSS_BAHAMUT':
    case 'BOSS_LEVIATHAN':
    case 'BOSS_ODIN': {
      const bossEffect = effect as BossEffect;
      value = calculateBossEffectValue(context, bossEffect);
      break;
    }
  }

  // エレミアの保護効果がある場合、マイナス効果を0にする
  if (hasSageProtection && value < 0) {
    value = 0;
  }

  return value * calculateEffectMultiplier(context);
}

export function checkEffectConditions(context: EffectContext, effect: Effect): boolean {
  const { sourceCard, targetCard, sourcePosition, targetPosition } = context;
  
  if (!effect) return false;

  // 基本的なユニット効果の共通チェック
  if (['UNIT_VERTICAL_ENEMY_DEBUFF', 'DIAGONAL_DEBUFF', 'ADJACENT_UNIT_BUFF'].includes(effect.type)) {
    if (targetCard.card.category !== 'unit') return false;
  }

  // フィールド効果のチェック
  if (isFieldEffect(effect)) {
    if (targetCard.card.category !== 'unit') return false;
    const dx = Math.abs(targetPosition.col - sourcePosition.col);
    const dy = Math.abs(targetPosition.row - sourcePosition.row);
    const manhattanDistance = dx + dy;
    return manhattanDistance <= 2 && dx <= 2 && dy <= 2;
  }

  // 自己効果のチェック
  if (effect.type === 'SELF_POWER_UP_BY_ADJACENT_ALLY') {
    return sourcePosition.row === targetPosition.row && 
           sourcePosition.col === targetPosition.col;
  }

  // 位置関係のチェック
  switch (effect.type) {
    case 'UNIT_VERTICAL_ENEMY_DEBUFF':
      return targetCard.card.category === 'unit' &&
           !isSameType(sourceCard, targetCard.card) &&
           isVerticallyAdjacent(sourcePosition, targetPosition);

    case 'DIAGONAL_DEBUFF':
      return !isSameType(sourceCard, targetCard.card) &&
             isDiagonallyAdjacent(sourcePosition, targetPosition);

    case 'ADJACENT_UNIT_BUFF':
      return isSameType(sourceCard, targetCard.card) &&
             isAdjacent(sourcePosition, targetPosition);

             case 'LEGENDARY_DRAGON_KNIGHT': {
              const distance = calculateManhattanDistance(sourcePosition, targetPosition);
              return (isAdjacent(sourcePosition, targetPosition) && 
                      isSameType(sourceCard, targetCard.card)) ||
                     (targetCard.card.category === 'weapon' && distance <= 2);
            }
        
            case 'LEGENDARY_SAGE': {
              const distance = calculateManhattanDistance(sourcePosition, targetPosition);
              return distance <= (effect.fieldEffect?.range || 2);
            }
        
            case 'LEGENDARY_DUAL_SWORDSMAN': {
              return isVerticallyAdjacent(sourcePosition, targetPosition) ||
                     (sourcePosition.row === targetPosition.row && 
                      Math.abs(sourcePosition.col - targetPosition.col) === 1);
            }

    case 'WEAPON_ENHANCEMENT':
      return isSameType(sourceCard, targetCard.card);

      case 'LEADER_ARCHER_DEBUFF': {
        // 1. 斜めの位置関係をチェック
        const isDiagonal = Math.abs(targetPosition.row - sourcePosition.row) === 1 &&
                          Math.abs(targetPosition.col - sourcePosition.col) === 1;
        if (!isDiagonal) return false;
  
        // 2. 対象が敵ユニットかチェック
        if (sourceCard.type === targetCard.card.type) return false;
        if (targetCard.card.category !== 'unit') return false;
  
        return true;
      }

      case 'LEADER_LANCER_BOOST':
        return (
          sourcePosition.row === targetPosition.row && // 同じ行
          sourcePosition.col === targetPosition.col && // 自分自身
          targetCard.card.category === 'unit'
        );
  }

  

  // 武器効果のチェック
  if ('targetClass' in effect) {
    return targetCard.card.category === 'unit' &&
           targetCard.card.class === effect.targetClass &&
           isSameType(sourceCard, targetCard.card);
  }

  return true;
}

function calculateBaseEffectValue(context: EffectContext, effect: BaseEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition } = context;

  
  // ユニット系効果の共通チェック
  if (targetCard.card.category !== 'unit') return 0;
  if (sourcePosition.row === targetPosition.row && 
      sourcePosition.col === targetPosition.col) return 0;

      switch (effect.type) {
        case 'UNIT_VERTICAL_ENEMY_DEBUFF': {  
          // デバッグログ
          console.log('=== Vertical Enemy Debuff Debug ===', {
            source: {
              position: sourcePosition,
              type: sourceCard.type
            },
            target: {
              position: targetPosition,
              type: targetCard.card.type,
              category: targetCard.card.category
            },
            checks: {
              sameColumn: sourcePosition.col === targetPosition.col,
              rowDiff: Math.abs(sourcePosition.row - targetPosition.row),
              isEnemy: sourceCard.type !== targetCard.card.type,
              isUnit: targetCard.card.category === 'unit'
            }
          });
    
          // 同じ列にあるか
          if (sourcePosition.col !== targetPosition.col) {
            console.log('Failed: Not in same column');
            return 0;
          }
    
          // 上下1マスの距離にあるか
          if (Math.abs(sourcePosition.row - targetPosition.row) !== 1) {
            console.log('Failed: Not vertically adjacent');
            return 0;
          }
    
          // 敵ユニットか（敵のみに効果を与える）
          if (sourceCard.type === targetCard.card.type) {
            console.log('Failed: Not an enemy');
            return 0;
          }
    
          // 負の値を返して弱体化
          return -(effect.power || 0);
        }
    
        case 'DIAGONAL_DEBUFF': {
          if (isSameType(sourceCard, targetCard.card)) return 0;
          if (!isDiagonallyAdjacent(sourcePosition, targetPosition)) return 0;
          return -(effect.power || 0);
        }
    
        case 'ADJACENT_UNIT_BUFF': {
          if (!isSameType(sourceCard, targetCard.card)) return 0;
          if (!isAdjacent(sourcePosition, targetPosition)) return 0;
          return effect.power || 0;
        }
    
        case 'SELF_POWER_UP_BY_ADJACENT_ALLY': {
          if (!isSameType(sourceCard, targetCard.card)) return 0;
          if (!isAdjacent(sourcePosition, targetPosition)) return 0;
          return effect.power || 0;
        }

        case 'FIELD_DUAL_EFFECT': {
          const range = effect.range || 2;
          const dx = Math.abs(targetPosition.col - sourcePosition.col);
          const dy = Math.abs(targetPosition.row - sourcePosition.row);
          
          // 範囲内かチェック
          if (dx > range || dy > range) return 0;
    
          // 味方/敵判定で効果値を決定
          return isSameType(sourceCard, targetCard.card) 
            ? (effect.allyBonus || 0)
            : (effect.enemyPenalty || 0);
        }
    
        default:
          return 0;
      }
 }

function calculateFieldEffectValue(context: EffectContext, effect: FieldEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition } = context;

  if (targetCard.card.category !== 'unit') return 0;

  const dx = Math.abs(targetPosition.col - sourcePosition.col);
  const dy = Math.abs(targetPosition.row - sourcePosition.row);
  const manhattanDistance = dx + dy;

  if (manhattanDistance > 2 || dx > 2 || dy > 2) return 0;

  const isSameTeam = isSameType(sourceCard, targetCard.card);
  return effect.type === 'FIELD_UNIT_BUFF'
    ? (isSameTeam ? effect.power : 0)
    : (isSameTeam ? 0 : -effect.power);
}

function calculateWeaponEffectValue(context: EffectContext, effect: WeaponEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition } = context;

  // 1. ユニットカードにのみ効果を適用
  if (targetCard.card.category !== 'unit') return 0;
  
  // 2. 同じチームのカードにのみ効果を適用
  if (!isSameType(sourceCard, targetCard.card)) return 0;

  // 3. ユニットクラスのチェック
  if (!targetCard.card.class || targetCard.card.class !== effect.targetClass) return 0;

  // 4. 位置による効果の計算
  switch (effect.type) {
    case 'VERTICAL_BOOST':
      return isVerticallyAdjacent(sourcePosition, targetPosition) ? effect.power : 0;
    
    case 'HORIZONTAL_BOOST':
      return sourcePosition.row === targetPosition.row && 
             Math.abs(sourcePosition.col - targetPosition.col) === 1
             ? effect.power : 0;
    
    case 'DIAGONAL_BOOST':
      return isDiagonallyAdjacent(sourcePosition, targetPosition) ? effect.power : 0;
    
    case 'CROSS_FORMATION':
      return isAdjacent(sourcePosition, targetPosition) ? effect.power : 0;
    
    default:
      return 0;
  }
}

function calculateSupportEffectValue(context: EffectContext, effect: SupportEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition } = context;

  // 自分自身には効果を適用しない
  if (sourcePosition.row === targetPosition.row && 
      sourcePosition.col === targetPosition.col) return 0;

  if (!isSameType(sourceCard, targetCard.card)) return 0;

  switch (effect.type) {
    case 'ROW_COLUMN_BUFF': {
      const { targetDirection } = effect;
      if (targetCard.card.category !== 'unit') return 0;
      if (targetDirection === 'vertical' && sourcePosition.col === targetPosition.col) {
        return effect.power || 0;
      }
      if (targetDirection === 'horizontal' && sourcePosition.row === targetPosition.row) {
        return effect.power || 0;
      }
      return 0;
    }

    case 'WEAPON_ENHANCEMENT': {
      if (targetCard.card.category !== 'weapon') return 0;

      const distance = calculateManhattanDistance(sourcePosition, targetPosition);
      if (distance <= (effect.range || 1)) {
        // 武器カードのベーススコアに加算するボーナス
        const scoreBonus = effect.power || 0;
        
        // 武器カードの効果は別途calculateEffectMultiplierで処理するため、
        // ここではスコアのボーナスのみを返す
        return scoreBonus;
      }
      return 0;
    }

    default:
      return 0;
  }
}

function calculateLeaderEffectValue(context: EffectContext, effect: LeaderEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition, board } = context;

  switch (effect.type) {
    case 'LEADER_ARCHER_DEBUFF': {
      // デバッグ出力を追加
      console.log('Calculating LEADER_ARCHER_DEBUFF effect');
    
      // 斜めのチェック
      const isDiagonal = Math.abs(targetPosition.row - sourcePosition.row) === 1 &&
                        Math.abs(targetPosition.col - sourcePosition.col) === 1;
      if (!isDiagonal) {
        console.log('Not diagonal position');
        return 0;
      }
    
      // 敵ユニットのみに効果
      if (sourceCard.type === targetCard.card.type) {
        console.log('Same type - no effect');
        return 0;
      }
      if (targetCard.card.category !== 'unit') {
        console.log('Not a unit - no effect');
        return 0;
      }
    
      // リーダー自身が武器効果を受けているかチェック
      let hasWeaponEffect = false;
      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell?.card.effect) return;
          if (cell.card.category !== 'weapon') return;
          
          // 武器の効果範囲を取得
          const weaponRangePositions = cell.card.effect ? 
          getEffectRange(cell.card.effect, { row: rowIndex, col: colIndex }) : [];          
          // リーダー（sourcePosition）が武器の効果範囲に含まれているかチェック
          hasWeaponEffect = weaponRangePositions.some(pos => 
            pos.row === sourcePosition.row && pos.col === sourcePosition.col
          );
    
          if (hasWeaponEffect) {
            console.log('Leader is under weapon effect from:', cell.card.name);
          }
        });
      });
    
      const penalty = hasWeaponEffect ? effect.weaponPenalty : effect.basePenalty;
      console.log('Applied penalty:', penalty, 'hasWeaponEffect:', hasWeaponEffect);
      return penalty || 0;
    } 

    case 'LEADER_GUARDIAN_BOOST': {
      // 自分自身への効果
      if (sourcePosition.row === targetPosition.row && 
          sourcePosition.col === targetPosition.col) {
        // 隣接する味方の数に応じて自身を強化
        const adjacentAllies = countAdjacentAllies(sourcePosition, board, sourceCard.type);
        return (effect.selfBoostPerAlly || 0) * adjacentAllies;
      }

      // 隣接する味方への効果
      const isAdjacent = Math.abs(targetPosition.row - sourcePosition.row) +
                        Math.abs(targetPosition.col - sourcePosition.col) === 1;
      if (isAdjacent && sourceCard.type === targetCard.card.type) {
        return effect.allyBonus || 0;
      }

      return 0;
    }

    case 'LEADER_LANCER_BOOST': {
      // 自身への効果のみ
      if (sourcePosition.row !== targetPosition.row || 
          sourcePosition.col !== targetPosition.col )return 0;     
      // 横方向の敵ユニット数をカウント
      const enemyCount = countHorizontalEnemies(sourcePosition, board, sourceCard.type);
      return (effect.selfBoostPerEnemy || 0) * enemyCount;
     }

     case 'LEADER_MAGE_EFFECT': {
      const distance = Math.max(
        Math.abs(targetPosition.row - sourcePosition.row),
        Math.abs(targetPosition.col - sourcePosition.col)
      );
      
      // 自分自身には効果を与えない
      if (sourcePosition.row === targetPosition.row && 
          sourcePosition.col === targetPosition.col) return 0;
      
      if (distance > (effect.range || 2)) return 0;
    
      if (sourceCard.type === targetCard.card.type) {
        // 味方への効果
        if (targetCard.card.category === 'support') {
          return effect.supportBonus || 0;
        }
        return effect.allyBonus || 0;
      } else {
        // 敵への効果
        return effect.enemyPenalty || 0;
      }
    }

    default:
      return 0;
  }
}

function calculateLegendaryEffectValue(context: EffectContext, effect: LegendaryEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition, board } = context;

  switch (effect.type) {
    case 'LEGENDARY_DRAGON_KNIGHT': {
      // 隣接効果の計算
      
      if (isAdjacent(sourcePosition, targetPosition)) {
        if (isSameType(sourceCard, targetCard.card) && targetCard.card.category === 'unit') {
          return effect.primaryEffect.power;
        }
      }

      // 武器強化効果の計算
      if (targetCard.card.category === 'weapon' &&
          calculateManhattanDistance(sourcePosition, targetPosition) <= effect.secondaryEffect.range) {
        return effect.secondaryEffect.effectMultiplier - 1; // 乗算なので-1
      }

      return 0;
    }

    case 'LEGENDARY_SAGE': {
      const distance = calculateManhattanDistance(sourcePosition, targetPosition);
      
      if (sourcePosition.row === targetPosition.row && 
          sourcePosition.col === targetPosition.col) return 0;

      // 範囲2マス内の通常の強化効果
      if (distance <= (effect.fieldEffect?.range || 2)) {
        if (isSameType(sourceCard, targetCard.card)) {
          if (targetCard.card.category === 'support') {
            return effect.fieldEffect?.supportBonus || 0;
          }
          return effect.fieldEffect?.allyBonus || 0;
        }
      }
    
      return 0;  // マイナス効果の無効化は別途処理
    }

    case 'LEGENDARY_DUAL_SWORDSMAN': {
      if (!effect.verticalEffect) return 0;
      
      // 縦横の効果
      if (isVerticallyAdjacent(sourcePosition, targetPosition) ||
          (sourcePosition.row === targetPosition.row && 
           Math.abs(sourcePosition.col - targetPosition.col) === 1)) {
        
        if (isSameType(sourceCard, targetCard.card)) {
          return effect.verticalEffect.power;
        } else {
          return effect.verticalEffect.debuff;
        }
      }
      return 0;
    }

    case 'LEGENDARY_CHAOS_DRAGON': {
      // 隣接する味方強化
      if (isAdjacent(sourcePosition, targetPosition)) {
        if (isSameType(sourceCard, targetCard.card) && targetCard.card.category === 'unit') {
          return effect.primaryEffect.power;
        }
      }

      // 範囲2マスの敵弱体化
      const distance = calculateManhattanDistance(sourcePosition, targetPosition);
      if (distance <= 2 && !isSameType(sourceCard, targetCard.card)) {
        return effect.fieldEffect.enemyPenalty;
      }

      return 0;
    }

    case 'LEGENDARY_ARCHMAGE': {
      const distance = calculateManhattanDistance(sourcePosition, targetPosition);
      
      // 範囲効果

      if (sourcePosition.row === targetPosition.row && 
        sourcePosition.col === targetPosition.col) return 0;
      if (distance <= effect.fieldEffect.range) {
        if (isSameType(sourceCard, targetCard.card)&& targetCard.card.category === 'unit') {
          return effect.fieldEffect.allyBonus;
        } else if( targetCard.card.category === 'unit') {
          return effect.fieldEffect.enemyPenalty;
        }
      }

      // 武器強化効果
      if (targetCard.card.category === 'weapon' && 
          distance <= effect.weaponEffect.range) {
        return effect.weaponEffect.effectMultiplier - 1;
      }

      return 0;
    }

    case 'LEGENDARY_DEMON_EMPEROR': {
      // 十字方向の効果
      if (isVerticallyAdjacent(sourcePosition, targetPosition) ||
          (sourcePosition.row === targetPosition.row && Math.abs(sourcePosition.col - targetPosition.col) === 1)) {
        
        if (isSameType(sourceCard, targetCard.card)) {
          return effect.crossEffect.allyBonus;
        } else {
          return effect.crossEffect.enemyPenalty;
        }
      }

      // 自己強化効果（敵の数による）
      if (sourcePosition.row === targetPosition.row && 
          sourcePosition.col === targetPosition.col) {
        const enemyCount = countEnemiesInRange(sourcePosition, board, sourceCard.type, effect.selfEffect.range);
        return effect.selfEffect.powerPerEnemy * enemyCount;
      }

      return 0;
    }

    default:
      return 0;
  }
}

function calculateEffectMultiplier(context: EffectContext): number {
  const { sourceCard, sourcePosition, board } = context;
  let multiplier = 1;

  // 武器カードの場合のみ、武器強化効果を適用
  if (sourceCard.category === 'weapon') {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell?.card.effect) return;
        if (cell.card.type !== sourceCard.type) return;  // 同じタイプ（味方/敵）のみ
        
        // WEAPON_ENHANCEMENTの直接の効果
        if (cell.card.effect.type === 'WEAPON_ENHANCEMENT') {
          const distance = calculateManhattanDistance(
            sourcePosition,
            { row: rowIndex, col: colIndex }
          );
          
          if (distance <= (cell.card.effect.range || 1)) {
            multiplier *= cell.card.effect.effectMultiplier || 2;
          }
        }
        
        // 伝説カードの武器強化効果
        if (cell.card.effect.type === 'LEGENDARY_DRAGON_KNIGHT') {
          const distance = calculateManhattanDistance(
            sourcePosition,
            { row: rowIndex, col: colIndex }
          );
          
          if (distance <= (cell.card.effect.secondaryEffect?.range || 2)) {
            multiplier *= cell.card.effect.secondaryEffect?.effectMultiplier || 2;
          }
        }
        
        if (cell.card.effect.type === 'LEGENDARY_ARCHMAGE') {
          const distance = calculateManhattanDistance(
            sourcePosition,
            { row: rowIndex, col: colIndex }
          );
          
          if (distance <= (cell.card.effect.weaponEffect?.range || 2)) {
            multiplier *= cell.card.effect.weaponEffect?.effectMultiplier || 2;
          }
        }
      });
    });
  }

  return multiplier;
}

function countEnemiesInRange(
  position: Position,
  board: (PlacedCard | null)[][],
  allyType: 'ally' | 'enemy',
  range: number
): number {
  let count = 0;
  
  for (let r = -range; r <= range; r++) {
    for (let c = -range; c <= range; c++) {
      const newRow = position.row + r;
      const newCol = position.col + c;
      
      if (newRow === position.row && newCol === position.col) continue;
      
      if (newRow >= 0 && newRow < board.length &&
          newCol >= 0 && newCol < board[0].length) {
        const cell = board[newRow][newCol];
        if (cell && 
            cell.card.type !== allyType && 
            cell.card.category === 'unit') {
          count++;
        }
      }
    }
  }

  return count;
}

export function getEffectStyle(effect: Effect): EffectStyle {
  if ('targetClass' in effect && 
    (effect.type.startsWith('VERTICAL_BOOST') || 
     effect.type.startsWith('HORIZONTAL_BOOST') || 
     effect.type.startsWith('DIAGONAL_BOOST') || 
     effect.type.startsWith('CROSS_FORMATION'))) {
    return {
      color: '#FFC107',
      pattern: getWeaponPattern(effect.type),
      intensity: 0.4
    };
  }

  if (isFieldEffect(effect)) {
    return {
      color: effect.type === 'FIELD_UNIT_BUFF' ? '#4CAF50' : '#F44336',
      pattern: 'FIELD',
      intensity: 0.4
    };
  }

  if (effect.type.startsWith('LEADER_')) {
    return {
      color: '#9C27B0',
      pattern: getLeaderPattern(effect.type),
      intensity: 0.5
    };
  }

  if (effect.type === 'ROW_COLUMN_BUFF') {
    return {
      color: '#4CAF50',  // 緑色
      pattern: effect.targetDirection === 'vertical' ? 'VERTICAL' : 'HORIZONTAL',
      intensity: 0.4
    };
  }

  if (effect.type === 'WEAPON_ENHANCEMENT') {
    return {
      color: '#FF9800',  // オレンジ色
      pattern: 'CROSS',
      intensity: 0.4
    };
  }

  if (effect.type === 'FIELD_DUAL_EFFECT') {
    return {
      color: '#9C27B0', // 紫色で双方向の効果を表現
      pattern: 'FIELD',
      intensity: 0.4
    };
  }

  if (effect.type.startsWith('LEGENDARY_')) {
    return {
      color: '#FFD700',  // ゴールド
      pattern: getLegendaryPattern(effect.type),
      intensity: 0.6  // より強い輝き
    };
  }

  return {
    color: getBaseEffectColor(effect.type),
    pattern: getBasePattern(effect.type),
    intensity: 0.3
  };
}

function getBaseEffectColor(type: string): string {
  if (type.includes('BUFF')) return '#4CAF50';
  if (type.includes('DEBUFF')) return '#F44336';
  return '#2196F3';
}

function getWeaponPattern(type: string): keyof typeof EFFECT_PATTERNS {
  switch (type) {
    case 'VERTICAL_BOOST': return 'VERTICAL';
    case 'HORIZONTAL_BOOST': return 'HORIZONTAL';
    case 'DIAGONAL_BOOST': return 'DIAGONAL';
    case 'CROSS_FORMATION': return 'CROSS';
    default: return 'ALL';
  }
}

function getLeaderPattern(type: string): keyof typeof EFFECT_PATTERNS {
  switch (type) {
    case 'LEADER_ARCHER_DEBUFF': return 'DIAGONAL';
    case 'LEADER_LANCER_BOOST': return 'HORIZONTAL';
    case 'LEADER_GUARDIAN_BOOST': return 'CROSS';
    case 'LEADER_MAGE_EFFECT': return 'FIELD';
    default: return 'ALL';
  }
}

function getBasePattern(type: string): keyof typeof EFFECT_PATTERNS {
  if (type === 'UNIT_VERTICAL_ALLY_BOOST') return 'VERTICAL';
  if (type.includes('ADJACENT')) return 'CROSS';
  if (type.includes('FIELD')) return 'FIELD';
  if (type.includes('DIAGONAL')) return 'DIAGONAL';
  if (type === 'FIELD_DUAL_EFFECT') return 'FIELD';
  return 'ALL';
}

function getLegendaryPattern(type: string): keyof typeof EFFECT_PATTERNS {
  switch (type) {
    case 'LEGENDARY_DRAGON_KNIGHT':
      return 'CROSS';
    case 'LEGENDARY_SAGE':
      return 'FIELD';
    case 'LEGENDARY_DUAL_SWORDSMAN':
      return 'VERTICAL';
    case 'LEGENDARY_CHAOS_DRAGON':
      return 'CROSS';
    case 'LEGENDARY_ARCHMAGE':
      return 'FIELD';
    case 'LEGENDARY_DEMON_EMPEROR':
      return 'CROSS';
    default:
      return 'ALL';
  }
}

function calculateBossEffectValue(context: EffectContext, effect: BossEffect): number {
  const { sourceCard, targetCard, sourcePosition, targetPosition, board } = context;

  const powerPerWeakened = effect.secondaryEffect?.powerPerWeakened ?? 0;


  switch (effect.type) {
    case 'BOSS_IFRIT': {
      // 自分自身への効果（弱体化した敵の数による強化）
      if (sourcePosition.row === targetPosition.row && 
          sourcePosition.col === targetPosition.col) {
        let weakenedCount = 0;
        const range = effect.primaryEffect.range || 2;

        // 範囲内の敵をカウント
        board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (!cell) return;
            const distance = calculateManhattanDistance(sourcePosition, {row: rowIndex, col: colIndex});
            if (distance <= range && cell.card.type !== sourceCard.type) {
              weakenedCount++;
            }
          });
        });

        return weakenedCount * powerPerWeakened;
      }

      // 敵への弱体化効果
      if (targetCard.card.type !== sourceCard.type) {
        const distance = calculateManhattanDistance(sourcePosition, targetPosition);
        if (distance <= (effect.primaryEffect.range || 2)) {
          return effect.primaryEffect?.enemyPenalty ?? 0;

        }
      }

      return 0;
    }
    case 'BOSS_BAHAMUT':
    case 'BOSS_LEVIATHAN':
    case 'BOSS_ODIN': {
      // 他のボスの効果を実装
      return 0;
    }

    default:
      return 0;
  }
}

export function getEffectPriority(effect: Effect | BaseEffect): number {
  if ('targetClass' in effect) return EFFECT_PRIORITIES.WEAPON;
  if (isFieldEffect(effect)) return EFFECT_PRIORITIES.FIELD;
  
  // 文字列から判定
  const type = effect.type;
  if (type.startsWith('LEADER_')) return EFFECT_PRIORITIES.LEADER;
  if (type.startsWith('LEGENDARY_')) return EFFECT_PRIORITIES.LEGENDARY;
  if (type.includes('BUFF')) return EFFECT_PRIORITIES.UNIT;
  if (type.includes('DEBUFF')) return EFFECT_PRIORITIES.DEBUFF;
  
  return EFFECT_PRIORITIES.BASE;
}

export function getDirection(from: Position, to: Position): 'vertical' | 'horizontal' | 'diagonal' | null {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  if (rowDiff === 0 && colDiff === 1) return 'horizontal';
  if (rowDiff === 1 && colDiff === 0) return 'vertical';
  if (rowDiff === 1 && colDiff === 1) return 'diagonal';
  return null;
}

export function calculateDistance(from: Position, to: Position): number {
  return calculateManhattanDistance(from, to);
}

export * from './effect-descriptions';