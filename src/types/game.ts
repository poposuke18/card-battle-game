export type CardType = 'ally' | 'enemy';

export type Card = {
  id: string;
  type: CardType;
  name: string;
  points: number;
  effect?: string;
  image?: string;
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
  hand: Card[];
  selectedCard: Card | null;  // この行を追加
  status: GameStatus;
};

// ゲームアクション用の型
export type GameAction = 
| { type: 'SELECT_CARD'; card: Card }  // この行を追加

  | { type: 'PLACE_CARD'; card: Card; position: Position }
  | { type: 'END_TURN' }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' };