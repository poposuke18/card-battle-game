// 位置計算のユーティリティ関数
export interface Coordinate {
  row: number;
  col: number;
}

export type Direction = 'adjacent' | 'vertical' | 'horizontal' | 'diagonal' | 'diamond';

export function getAdjacentPositions(position: Coordinate): Coordinate[] {
  const { row, col } = position;
  return [
    { row: row - 1, col: col }, // 上
    { row: row + 1, col: col }, // 下
    { row: row, col: col - 1 }, // 左
    { row: row, col: col + 1 }  // 右
  ];
}

export function getVerticalPositions(position: Coordinate): Coordinate[] {
  const { row, col } = position;
  return [
    { row: row - 1, col: col }, // 上
    { row: row + 1, col: col }  // 下
  ];
}

export function getHorizontalPositions(position: Coordinate): Coordinate[] {
  const { row, col } = position;
  return [
    { row: row, col: col - 1 }, // 左
    { row: row, col: col + 1 }  // 右
  ];
}

export function getDiagonalPositions(position: Coordinate): Coordinate[] {
  const { row, col } = position;
  return [
    { row: row - 1, col: col - 1 }, // 左上
    { row: row - 1, col: col + 1 }, // 右上
    { row: row + 1, col: col - 1 }, // 左下
    { row: row + 1, col: col + 1 }  // 右下
  ];
}

export function getDiamondRange(position: Coordinate, range: number, boardSize: number): Coordinate[] {
  const { row, col } = position;
  const ranges: Coordinate[] = [];
  
  for (let r = -range; r <= range; r++) {
    for (let c = -range; c <= range; c++) {
      // 範囲判定（マンハッタン距離）
      if (Math.abs(r) + Math.abs(c) <= range) {
        const newRow = row + r;
        const newCol = col + c;
        
        // 自分自身は除外
        if (r === 0 && c === 0) continue;
        
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
          ranges.push({ row: newRow, col: newCol });
        }
      }
    }
  }
  return ranges;
}

export function filterValidPositions(positions: Coordinate[], boardSize: number): Coordinate[] {
  return positions.filter(pos => 
    pos.row >= 0 && pos.row < boardSize && pos.col >= 0 && pos.col < boardSize
  );
}

export function getPositionsByDirection(
  position: Coordinate, 
  direction: Direction, 
  boardSize: number,
  range: number = 1
): Coordinate[] {
  let positions: Coordinate[];
  
  switch (direction) {
    case 'adjacent':
      positions = getAdjacentPositions(position);
      break;
    case 'vertical':
      positions = getVerticalPositions(position);
      break;
    case 'horizontal':
      positions = getHorizontalPositions(position);
      break;
    case 'diagonal':
      positions = getDiagonalPositions(position);
      break;
    case 'diamond':
      return getDiamondRange(position, range, boardSize);
    default:
      positions = [];
  }
  
  return filterValidPositions(positions, boardSize);
}

export function isPositionValid(position: Coordinate, boardSize: number): boolean {
  return position.row >= 0 && position.row < boardSize && 
         position.col >= 0 && position.col < boardSize;
}

export function arePositionsEqual(pos1: Coordinate, pos2: Coordinate): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}