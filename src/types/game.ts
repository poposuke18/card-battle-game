// src/types/game.ts

import type { Card, PlacedCard } from './cards';
import type { Position } from './base';

export type GameState = {
  board: (PlacedCard | null)[][];
  currentHand: Card[];
  nextHand: Card[];
  selectedCard: Card | null;
  status: GameStatus;
  canEndTurn: boolean;
  history: GameHistory[];
  lastAction: GameAction | null;
  currentStage: number;
};

export type GameStatus = {
  turn: number;
  allyScore: number;
  enemyScore: number;
  gameOver: boolean;
  winner: 'ally' | 'enemy' | null;
};

export type GamePhase = 
  | 'setup'
  | 'placement'
  | 'resolution'
  | 'effect'
  | 'scoring'
  | 'end';

  export type GameAction = 
  | { type: 'INITIALIZE_GAME'; payload: { currentHand: Card[]; nextHand: Card[]; currentStage: number } }
  | { type: 'SELECT_CARD'; card: Card }
  | { type: 'PLACE_CARD'; position: Position }
  | { type: 'UNDO_LAST_MOVE' }
  | { type: 'END_TURN'; payload: { nextHand: Card[]; nextTurn: number } }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SCORES'; payload: { allyScore: number; enemyScore: number } };


export type GameHistory = {
  action: 'PLACE_CARD';
  card: Card;
  position: Position;
  previousState: {
    board: (PlacedCard | null)[][];
    scores: {
      allyScore: number;
      enemyScore: number;
    };
  };
};

export type SpecialRule = {
  type: string;
  description: string;
  rules?: {
    bossOnly?: boolean;
    finalTurn?: boolean;
  };
};

export type TurnData = {
  turn: number;
  cardsToPlay: number;
  specialRules: SpecialRule[];
};

export type GameSettings = {
  boardSize: number;
  maxTurns: number;
  startingHandSize: number;
  allowUndo: boolean;
  showPreviews: boolean;
  animationsEnabled: boolean;
};

export type GameStats = {
  totalMoves: number;
  highestScore: number;
  totalGamesPlayed: number;
  winRate: number;
  averageScore: number;
  bestCombo: number;
};

export type GameProgress = {
  clearedStages: number[];
  currentStage: number;
};

