// src/utils/board.ts を新規作成

import { Position, PlacedCard } from '@/types/game';

// 隣接マスの位置を取得する関数
export function getAdjacentPositions(position: Position, boardSize: number = 5): Position[] {
  const { row, col } = position;
  const adjacent: Position[] = [];

  // 上
  if (row > 0) adjacent.push({ row: row - 1, col });
  // 下
  if (row < boardSize - 1) adjacent.push({ row: row + 1, col });
  // 左
  if (col > 0) adjacent.push({ row, col: col - 1 });
  // 右
  if (col < boardSize - 1) adjacent.push({ row, col: col + 1 });

  return adjacent;
}

// 指定位置の周囲のカードを取得する関数
export function getAdjacentCards(
  position: Position,
  board: (PlacedCard | null)[][],
): PlacedCard[] {
  const adjacent = getAdjacentPositions(position);
  return adjacent
    .map(pos => board[pos.row][pos.col])
    .filter((card): card is PlacedCard => card !== null);
}

// 特定の範囲内のマスを取得する関数（範囲効果用）
export function getPositionsInRange(
  center: Position,
  range: number,
  boardSize: number = 5
): Position[] {
  const positions: Position[] = [];
  
  for (let row = Math.max(0, center.row - range); 
       row <= Math.min(boardSize - 1, center.row + range); 
       row++) {
    for (let col = Math.max(0, center.col - range);
         col <= Math.min(boardSize - 1, center.col + range);
         col++) {
      // 中心マスは除外
      if (row !== center.row || col !== center.col) {
        positions.push({ row, col });
      }
    }
  }
  
  return positions;
}

// 特定のタイプのカードが隣接しているか確認する関数
export function hasAdjacentCardOfType(
  position: Position,
  board: (PlacedCard | null)[][],
  type: 'ally' | 'enemy'
): boolean {
  const adjacentCards = getAdjacentCards(position, board);
  return adjacentCards.some(card => card.card.type === type);
}