// src/types/game.ts
export type CardType = 'ally' | 'enemy';

export type CardEffect = {
  type: 'BUFF_ADJACENT' | 'DAMAGE_ADJACENT' | 'RANGE_EFFECT';
  power: number;
  range?: number;
};

export type Card = {
  id: string;
  type: CardType;
  name: string;
  points: number;
  effect?: CardEffect;
};

export type Position = {
  row: number;
  col: number;
};

export type PlacedCard = {
  card: Card;
  position: Position;
};

export type GameStatus = {
  turn: number;
  allyScore: number;
  enemyScore: number;
  gameOver: boolean;
  winner: 'ally' | 'enemy' | null;
};

export type GameState = {
  board: (PlacedCard | null)[][];
  currentHand: Card[];  // 現在のターンの手札
  nextHand: Card[];     // 次のターンの手札
  selectedCard: Card | null;
  status: GameStatus;
  canEndTurn: boolean;  // ターン終了可能かどうか
};

export type GameAction = 
  | { type: 'SELECT_CARD'; card: Card }
  | { type: 'PLACE_CARD'; position: Position }
  | { type: 'UNDO_LAST_MOVE' }
  | { type: 'END_TURN' }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' };