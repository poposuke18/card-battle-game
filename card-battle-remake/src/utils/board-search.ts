// ボード検索のユーティリティ関数
import type { Card } from '@/types';
import { Coordinate } from './position-utils';

export type Board = (Card | null)[][];

export interface CardMatch {
  card: Card;
  position: Coordinate;
}

export function findCardsMatching(
  board: Board,
  predicate: (card: Card, position: Coordinate) => boolean
): CardMatch[] {
  const matches: CardMatch[] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const card = board[row][col];
      const position = { row, col };
      
      if (card && predicate(card, position)) {
        matches.push({ card, position });
      }
    }
  }
  
  return matches;
}

export function findCardsByName(board: Board, name: string): CardMatch[] {
  return findCardsMatching(board, (card) => card.name === name);
}

export function findCardsByType(board: Board, cardType: 'ally' | 'enemy'): CardMatch[] {
  return findCardsMatching(board, (card) => card.type === cardType);
}

export function findCardsByCategory(board: Board, category: string): CardMatch[] {
  return findCardsMatching(board, (card) => card.category === category);
}

export function findCardsByEffect(board: Board, effectType: string): CardMatch[] {
  return findCardsMatching(board, (card) => card.effect?.type === effectType);
}

export function findCardsInRange(
  board: Board,
  positions: Coordinate[]
): CardMatch[] {
  const matches: CardMatch[] = [];
  
  positions.forEach(position => {
    if (position.row >= 0 && position.row < board.length && 
        position.col >= 0 && position.col < board[position.row].length) {
      const card = board[position.row][position.col];
      if (card) {
        matches.push({ card, position });
      }
    }
  });
  
  return matches;
}

export function getCardAt(board: Board, position: Coordinate): Card | null {
  if (position.row >= 0 && position.row < board.length && 
      position.col >= 0 && position.col < board[position.row].length) {
    return board[position.row][position.col];
  }
  return null;
}

export function isPositionOccupied(board: Board, position: Coordinate): boolean {
  return getCardAt(board, position) !== null;
}

export function getAdjacentCards(board: Board, position: Coordinate): CardMatch[] {
  const adjacentPositions = [
    { row: position.row - 1, col: position.col },
    { row: position.row + 1, col: position.col },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 }
  ];
  
  return findCardsInRange(board, adjacentPositions);
}

export function getAdjacentAllies(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): number {
  const adjacentCards = getAdjacentCards(board, position);
  return adjacentCards.filter(match => 
    match.card.type === cardType && match.card.category === 'unit'
  ).length;
}

export function getHorizontalEnemies(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): number {
  const enemyType = cardType === 'ally' ? 'enemy' : 'ally';
  const horizontalPositions = [
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 }
  ];
  
  const horizontalCards = findCardsInRange(board, horizontalPositions);
  return horizontalCards.filter(match => 
    match.card.type === enemyType && match.card.category === 'unit'
  ).length;
}

export function checkAdjacentWeapon(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): boolean {
  const adjacentCards = getAdjacentCards(board, position);
  return adjacentCards.some(match => 
    match.card.category === 'weapon' && match.card.type === cardType
  );
}

export function checkDiagonalWeapon(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): boolean {
  const diagonalPositions = [
    { row: position.row - 1, col: position.col - 1 }, // 左上
    { row: position.row - 1, col: position.col + 1 }, // 右上
    { row: position.row + 1, col: position.col - 1 }, // 左下
    { row: position.row + 1, col: position.col + 1 }  // 右下
  ];
  
  const diagonalCards = findCardsInRange(board, diagonalPositions);
  return diagonalCards.some(match => 
    match.card.category === 'weapon' && match.card.type === cardType
  );
}