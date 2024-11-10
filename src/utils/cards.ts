// src/utils/cards.ts

import { Card, CardType } from '@/types/game';
import { TURN1_CARDS, TURN2_CARDS, TURN3_CARDS } from '@/constants/cards';

let cardIdCounter = 1000;

// カードタイプでフィルタリングする共通関数を追加
function filterCardsByType(cards: Card[], type: CardType): Card[] {
  return cards.filter(card => card.type === type);
}

// ランダムにカードを選択する関数
function pickRandomCards(cardPool: Card[], count: number): Card[] {
  const cards: Card[] = [];
  const poolCopy = [...cardPool];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * poolCopy.length);
    const randomCard = poolCopy.splice(randomIndex, 1)[0];
    cards.push({
      ...randomCard,
      id: String(cardIdCounter++)
    });
  }
  return cards;
}

// ターンに応じたカードプールと枚数を取得する関数
function getCardPoolAndCount(turn: number): {
  cardPool: Card[],
  allyCount: number,
  enemyCount: number
} {
  switch(turn) {
    case 1:
      return {
        cardPool: TURN1_CARDS,
        allyCount: 2,
        enemyCount: 2
      };
    case 2:
      return {
        cardPool: TURN2_CARDS,
        allyCount: 2,
        enemyCount: 2
      };
    case 3:
      return {
        cardPool: TURN3_CARDS,
        allyCount: 1,
        enemyCount: 1
      };
    default:
      return {
        cardPool: [],
        allyCount: 0,
        enemyCount: 0
      };
  }
}

// ターン1の手札生成（基本ユニット）
export function generateRandomHand(): Card[] {
  const { cardPool, allyCount, enemyCount } = getCardPoolAndCount(1);
  const allyCards = filterCardsByType(cardPool, 'ally');
  const enemyCards = filterCardsByType(cardPool, 'enemy');
  
  return [
    ...pickRandomCards(allyCards, allyCount),
    ...pickRandomCards(enemyCards, enemyCount)
  ].sort(() => Math.random() - 0.5);
}

// 次のターンの手札生成
export function generateNextHand(currentTurn: number): Card[] {
  const nextTurn = currentTurn + 1;
  const { cardPool, allyCount, enemyCount } = getCardPoolAndCount(nextTurn);
  
  if (cardPool.length === 0) return [];
  
  const allyCards = filterCardsByType(cardPool, 'ally');
  const enemyCards = filterCardsByType(cardPool, 'enemy');
  
  return [
    ...pickRandomCards(allyCards, allyCount),
    ...pickRandomCards(enemyCards, enemyCount)
  ].sort(() => Math.random() - 0.5);
}