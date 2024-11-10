// src/types/game.ts
export type CardType = 'ally' | 'enemy';
export type CardCategory = 'unit' | 'field';

export type CardEffectType = 
  | 'SELF_POWER_UP_BY_ENEMY_LINE'  // 自身への効果：敵ユニットライン
  | 'SELF_POWER_UP_BY_ADJACENT_ALLY'  // 自身への効果：隣接味方
  | 'ADJACENT_UNIT_BUFF'  // 周囲ユニットへの効果：バフ
  | 'ADJACENT_UNIT_DEBUFF'  // 周囲ユニットへの効果：デバフ
  | 'FIELD_UNIT_BUFF'  // フィールド効果：ユニットバフ
  | 'FIELD_UNIT_DEBUFF';  // フィールド効果：ユニットデバフ

export type CardEffect = {
    type: CardEffectType;
    power: number;
    range?: number;  // フィールド効果の場合の範囲
  };

export type Card = {
    id: string;
    type: CardType;
    category: CardCategory;
    name: string;
    points: number;
    effect?: CardEffect;
    turn: number;  // どのターンのカードかを示す
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
  | { type: 'RESET_GAME' }
  | { type: 'INITIALIZE_GAME'; payload: { currentHand: Card[]; nextHand: Card[] } };  // 新しいアクションを追加