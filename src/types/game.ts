import type { Card, PlacedCard } from './cards';
import type { Position } from './base';

export type GameStatus = {
  turn: number;
  allyScore: number;
  enemyScore: number;
  gameOver: boolean;
  winner: 'ally' | 'enemy' | null;
};

export type GameState = {
  board: (PlacedCard | null)[][];
  currentHand: Card[];
  nextHand: Card[];
  selectedCard: Card | null;
  status: GameStatus;
  canEndTurn: boolean;
};

export type GameAction = 
  | { type: 'SELECT_CARD'; card: Card }
  | { type: 'PLACE_CARD'; position: Position }
  | { type: 'UNDO_LAST_MOVE' }
  | { type: 'END_TURN' }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { 
      type: 'INITIALIZE_GAME'; 
      payload: { 
        currentHand: Card[]; 
        nextHand: Card[] 
      } 
    };