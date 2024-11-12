// src/utils/board.ts
import { Position, PlacedCard } from '@/types';

export function getAdjacentPositions(position: Position, boardSize: number = 5): Position[] {
  const { row, col } = position;
  const adjacent: Position[] = [];

  if (row > 0) adjacent.push({ row: row - 1, col });
  if (row < boardSize - 1) adjacent.push({ row: row + 1, col });
  if (col > 0) adjacent.push({ row, col: col - 1 });
  if (col < boardSize - 1) adjacent.push({ row, col: col + 1 });

  return adjacent;
}

export function getAdjacentCards(
  position: Position,
  board: (PlacedCard | null)[][]
): PlacedCard[] {
  const adjacent = getAdjacentPositions(position);
  return adjacent
    .map(pos => board[pos.row]?.[pos.col])
    .filter((card): card is PlacedCard => card !== null);
}

export function checkEnemyLine(
  position: Position, 
  board: (PlacedCard | null)[][], 
  direction: 'horizontal' | 'vertical' | 'both' = 'both'
): boolean {
  const { row, col } = position;
  
  const isEnemyUnit = (cell: PlacedCard | null): boolean => {
    if (!cell) return false;
    const isEnemy = cell.card.type === 'enemy' && cell.card.category === 'unit';
    
    // デバッグ出力
    console.log('Enemy check:', {
      cell: cell.card.name,
      type: cell.card.type,
      category: cell.card.category,
      isEnemy
    });
    
    return isEnemy;
  };

  // 横方向のチェック
  if (direction === 'horizontal' || direction === 'both') {
    console.log('Checking horizontal:', {
      position,
      left: col > 0 ? board[row][col - 1]?.card.name : 'none',
      right: col < board[0].length - 1 ? board[row][col + 1]?.card.name : 'none'
    });

    // 左右に敵ユニットがいるかチェック
    if (col > 0 && col < board[0].length - 1) {
      const hasEnemyLine = isEnemyUnit(board[row][col - 1]) && isEnemyUnit(board[row][col + 1]);
      if (hasEnemyLine) return true;
    }

    // 左側に2体
    if (col >= 2) {
      const hasLeftLine = isEnemyUnit(board[row][col - 1]) && isEnemyUnit(board[row][col - 2]);
      if (hasLeftLine) return true;
    }

    // 右側に2体
    if (col <= board[0].length - 3) {
      const hasRightLine = isEnemyUnit(board[row][col + 1]) && isEnemyUnit(board[row][col + 2]);
      if (hasRightLine) return true;
    }
  }

  return false;
}