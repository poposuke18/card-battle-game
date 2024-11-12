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
    return cell?.card.type === 'enemy' && cell.card.category === 'unit';
  };

  // 横方向のチェック
  if (direction === 'horizontal' || direction === 'both') {
    // 左右に2体の敵ユニットがいるかチェック
    if (col > 0 && col < board[0].length - 1) {
      if (isEnemyUnit(board[row][col - 1]) && isEnemyUnit(board[row][col + 1])) {
        return true;
      }
    }
    // 左側に2体
    if (col >= 2) {
      if (isEnemyUnit(board[row][col - 1]) && isEnemyUnit(board[row][col - 2])) {
        return true;
      }
    }
    // 右側に2体
    if (col <= board[0].length - 3) {
      if (isEnemyUnit(board[row][col + 1]) && isEnemyUnit(board[row][col + 2])) {
        return true;
      }
    }
  }

  // 縦方向のチェック
  if (direction === 'vertical' || direction === 'both') {
    // 上下に2体の敵ユニットがいるかチェック
    if (row > 0 && row < board.length - 1) {
      if (isEnemyUnit(board[row - 1][col]) && isEnemyUnit(board[row + 1][col])) {
        return true;
      }
    }
    // 上側に2体
    if (row >= 2) {
      if (isEnemyUnit(board[row - 1][col]) && isEnemyUnit(board[row - 2][col])) {
        return true;
      }
    }
    // 下側に2体
    if (row <= board.length - 3) {
      if (isEnemyUnit(board[row + 1][col]) && isEnemyUnit(board[row + 2][col])) {
        return true;
      }
    }
  }

  return false;
}