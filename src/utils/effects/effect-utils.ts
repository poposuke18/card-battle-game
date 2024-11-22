// src/utils/effects/effect-utils.ts

import type { Effect, Position,PlacedCard } from '@/types';

export function isValidPosition(position: Position, boardSize: number): boolean {
  return position.row >= 0 && 
         position.row < boardSize && 
         position.col >= 0 && 
         position.col < boardSize;
}

export function calculateEffectRange(
  position: Position,
  effect: Effect,
  boardSize: number = 5
): Position[] {
  const range = [];
  const center = position;

  switch (effect.type) {
    case 'ADJACENT_VERTICAL_BOOST':
      if (center.row > 0) range.push({ row: center.row - 1, col: center.col });
      if (center.row < boardSize - 1) range.push({ row: center.row + 1, col: center.col });
      break;
      
    case 'DIAGONAL_BOOST':
    case 'DIAGONAL_DEBUFF':
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([rowOffset, colOffset]) => {
        const newRow = center.row + rowOffset;
        const newCol = center.col + colOffset;
        if (isValidPosition({ row: newRow, col: newCol }, boardSize)) {
          range.push({ row: newRow, col: newCol });
        }
      });
      break;
      
    case 'FIELD_DUAL_EFFECT':
    case 'LEADER_MAGE_EFFECT':
      const effectRange = effect.range || 2;
      for (let row = -effectRange; row <= effectRange; row++) {
        for (let col = -effectRange; col <= effectRange; col++) {
          const newPos = {
            row: center.row + row,
            col: center.col + col
          };
          if (isValidPosition(newPos, boardSize) && !(row === 0 && col === 0)) {
            range.push(newPos);
          }
        }
      }
      break;
  }

  return range;
}

export function getEffectMultiplier(
  context: EffectCalculationContext,
  effectType: string
): number {
  const { sourcePosition, board } = context;
  let multiplier = 1;

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {  // colIndexをここで定義
      if (!cell?.card.effect) return;
      const distance = getDistance(sourcePosition, { row: rowIndex, col: colIndex });
      
      if (effectType === 'WEAPON' && cell.card.effect.type === 'WEAPON_ENHANCEMENT') {
        if (distance <= (cell.card.effect.range || 1)) {
          multiplier *= cell.card.effect.effectMultiplier || 2;
        }
      }
    });
  });

  return multiplier;
}

export function getDistance(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

type EffectCalculationContext = {
  sourcePosition: Position;
  board: (PlacedCard | null)[][];
};