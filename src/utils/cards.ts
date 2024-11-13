// src/utils/cards.ts
import { 
  TURN1_CARDS, 
  TURN2_CARDS, 
  TURN3_CARDS, 
  TURN4_CARDS,
  TURN5_CARDS,
  TURN6_CARDS
} from '@/constants/cards';
import type { Card, CardType } from '@/types';

// ターンごとのカード枚数設定
const CARDS_PER_TURN = {
  1: { ally: 3, enemy: 3 },
  2: { ally: 2, enemy: 2 },
  3: { ally: 1, enemy: 1 },
  4: { ally: 1, enemy: 1 },
  5: { ally: 2, enemy: 2 },
  6: { ally: 2, enemy: 2 }  // 6ターン目: 味方2枚、敵2枚
} as const;

export type TurnNumber = 1 | 2 | 3 | 4 | 5 | 6;  // 6を追加

// カードタイプでフィルタリングする関数
function filterCardsByType(cards: Card[], type: CardType): Card[] {
  return cards.filter(card => card.type === type);
}

// ランダムにカードを選択する関数
function pickRandomCards(cardPool: Card[], count: number): Card[] {
  const cards: Card[] = [];
  const poolCopy = [...cardPool];
  
  for (let i = 0; i < count; i++) {
    if (poolCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * poolCopy.length);
    const randomCard = poolCopy.splice(randomIndex, 1)[0];
    cards.push({ ...randomCard, id: `${randomCard.id}-${Date.now()}-${i}` });
  }
  return cards;
}

// ターンに応じたカードプールを取得
function getTurnCards(turn: TurnNumber): Card[] {
  switch (turn) {
    case 1: return TURN1_CARDS;
    case 2: return TURN2_CARDS;
    case 3: return TURN3_CARDS;
    case 4: return TURN4_CARDS;
    case 5: return TURN5_CARDS;
    case 6: return TURN6_CARDS;  // 追加
  }
}

// 指定したターン用の手札を生成
function generateHandForTurn(turn: TurnNumber): Card[] {
  const turnCards = getTurnCards(turn);
  const { ally: allyCount, enemy: enemyCount } = CARDS_PER_TURN[turn];
  
  const allyCards = filterCardsByType(turnCards, 'ally');
  const enemyCards = filterCardsByType(turnCards, 'enemy');
  
  const generatedCards = [
    ...pickRandomCards(allyCards, allyCount),
    ...pickRandomCards(enemyCards, enemyCount)
  ].map(card => ({
    ...card,
    turn
  }));

  return generatedCards.sort(() => Math.random() - 0.5);
}

// 初期手札の生成（ターン1のカード）
export function generateRandomHand(): Card[] {
  return generateHandForTurn(1);
}

// 次のターンの手札生成
export function generateNextHand(currentTurn: TurnNumber): Card[] {
  // 次のターンのカードを生成（5ターン目まで対応）
  const nextTurn = (currentTurn + 1) as TurnNumber;
  if (nextTurn > 6) return [];
  return generateHandForTurn(nextTurn);
}

// 特定のターン用の手札を直接生成（初期化用）
export function generateHandForSpecificTurn(turn: TurnNumber): Card[] {
  return generateHandForTurn(turn);
}