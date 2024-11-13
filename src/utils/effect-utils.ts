// src/utils/effect-utils.ts
import type { Position, PlacedCard, WeaponEffect, BaseEffect, LeaderEffect } from '@/types';

export type GetEffectPositionsProps = {
  sourcePosition: Position;
  targetPosition: Position;
  effect: WeaponEffect;
  board: (PlacedCard | null)[][];
};

export function getWeaponEffectPositions(
    position: Position,
    card: PlacedCard,
    board: (PlacedCard | null)[][]
  ): Position[] {
    if (!card.card.effect) return [];
    
    // リーダー効果の場合は、getLeaderEffectPositionsを呼び出す
    if ('type' in card.card.effect && card.card.effect.type.startsWith('LEADER_')) {
      return getLeaderEffectPositions(position, card, board);
    }
    
    if (!('targetClass' in card.card.effect)) return [];
    
    const { row, col } = position;
    const positions: Position[] = [];
    const effect = card.card.effect;
  
    switch (effect.type) {
      case 'VERTICAL_BOOST':
        if (row > 0) positions.push({ row: row - 1, col }); // 上
        if (row < board.length - 1) positions.push({ row: row + 1, col }); // 下
        break;
  
      case 'HORIZONTAL_BOOST':
        if (col > 0) positions.push({ row, col: col - 1 }); // 左
        if (col < board[0].length - 1) positions.push({ row, col: col + 1 }); // 右
        break;
  
      case 'DIAGONAL_BOOST':
        if (row > 0 && col > 0) positions.push({ row: row - 1, col: col - 1 }); // 左上
        if (row > 0 && col < board[0].length - 1) positions.push({ row: row - 1, col: col + 1 }); // 右上
        if (row < board.length - 1 && col > 0) positions.push({ row: row + 1, col: col - 1 }); // 左下
        if (row < board.length - 1 && col < board[0].length - 1) positions.push({ row: row + 1, col: col + 1 }); // 右下
        break;
  
      case 'CROSS_FORMATION':
        if (row > 0) positions.push({ row: row - 1, col }); // 上
        if (row < board.length - 1) positions.push({ row: row + 1, col }); // 下
        if (col > 0) positions.push({ row, col: col - 1 }); // 左
        if (col < board[0].length - 1) positions.push({ row, col: col + 1 }); // 右
        break;
    }
  
    return positions;
  }

  export function getLeaderEffectPositions(
    position: Position,
    card: PlacedCard,
    board: (PlacedCard | null)[][]
  ): Position[] {
    if (!card.card.effect || !('type' in card.card.effect)) return [];
    
    const effect = card.card.effect as LeaderEffect;
    const { row, col } = position;
    const positions: Position[] = [];
  
    // 効果範囲の計算
    const range = effect.range || 2;  // デフォルトの範囲を2に設定
  
    // 範囲内のすべての位置を追加
    for (let r = Math.max(0, row - range); r <= Math.min(board.length - 1, row + range); r++) {
      for (let c = Math.max(0, col - range); c <= Math.min(board[0].length - 1, col + range); c++) {
        // 自分自身の位置は除外
        if (r !== row || c !== col) {
          positions.push({ row: r, col: c });
        }
      }
    }
  
    // LEADER_FORMATIONの場合、縦列と横列も効果範囲に含める
    if (effect.type === 'LEADER_FORMATION') {
      // 縦列の追加
      for (let r = 0; r < board.length; r++) {
        if (r !== row) {
          positions.push({ row: r, col });
        }
      }
      // 横列の追加
      for (let c = 0; c < board[0].length; c++) {
        if (c !== col) {
          positions.push({ row, col: c });
        }
      }
    }
  
    // 重複を除去
    return Array.from(new Set(positions.map(p => `${p.row}-${p.col}`)))
      .map(key => {
        const [r, c] = key.split('-').map(Number);
        return { row: r, col: c };
      });
  }
  
  export function getBaseEffectPositions(
    position: Position,
    card: PlacedCard,
    board: (PlacedCard | null)[][]
  ): Position[] {
    if (!card.card.effect) return [];
    
    // リーダー効果の場合は、getLeaderEffectPositionsを呼び出す
    if ('type' in card.card.effect && card.card.effect.type.startsWith('LEADER_')) {
      return getLeaderEffectPositions(position, card, board);
    }
    
    if ('targetClass' in card.card.effect) return [];
    
    const effect = card.card.effect;
    const { row, col } = position;
    const positions: Position[] = [];
  
    switch (effect.type) {
      case 'ADJACENT_UNIT_BUFF':
      case 'ADJACENT_UNIT_DEBUFF': {
        if (row > 0) positions.push({ row: row - 1, col });
        if (row < board.length - 1) positions.push({ row: row + 1, col });
        if (col > 0) positions.push({ row, col: col - 1 });
        if (col < board[0].length - 1) positions.push({ row, col: col + 1 });
        break;
      }
  
      case 'FIELD_UNIT_BUFF':
      case 'FIELD_UNIT_DEBUFF':
      case 'FIELD_CLASS_POWER_UP': {
        const range = effect.range || 1;
        for (let r = Math.max(0, row - range); r <= Math.min(board.length - 1, row + range); r++) {
          for (let c = Math.max(0, col - range); c <= Math.min(board[0].length - 1, col + range); c++) {
            if (r !== row || c !== col) {
              positions.push({ row: r, col: c });
            }
          }
        }
        break;
      }
  
      case 'ROW_COLUMN_BUFF': {
        if (effect.targetDirection === 'vertical') {
          // 縦一列
          for (let r = 0; r < board.length; r++) {
            if (r !== row) {
              positions.push({ row: r, col });
            }
          }
        } else {
          // 横一列
          for (let c = 0; c < board[0].length; c++) {
            if (c !== col) {
              positions.push({ row, col: c });
            }
          }
        }
        break;
      }
  
      case 'WEAPON_ENHANCEMENT': {
        const range = effect.range || 1;
        for (let r = Math.max(0, row - range); r <= Math.min(board.length - 1, row + range); r++) {
          for (let c = Math.max(0, col - range); c <= Math.min(board[0].length - 1, col + range); c++) {
            if (r !== row || c !== col) {
              positions.push({ row: r, col: c });
            }
          }
        }
        break;
      }
  
      // 自己強化系の効果は範囲表示なし
      case 'SELF_POWER_UP_BY_ENEMY_LINE':
      case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
        break;
    }
  
    return positions;
  }

