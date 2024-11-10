// src/utils/cards.ts

import { Card } from '@/types/game';
import { TURN1_CARDS, TURN2_CARDS } from '@/constants/cards';

let cardIdCounter = 1000; // 既存のカードIDと重複しないように大きな値から開始

// 指定されたカードプールから指定された枚数のカードをランダムに選択
function pickRandomCards(cardPool: Card[], count: number): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < count; i++) {
    const randomCard = cardPool[Math.floor(Math.random() * cardPool.length)];
    // 新しいIDを付与してカードをコピー
    cards.push({
      ...randomCard,
      id: String(cardIdCounter++)
    });
  }
  return cards;
}

// ターン1の手札を生成
export function generateRandomHand(): Card[] {
  const allyCards = TURN1_CARDS.filter(card => card.type === 'ally');
  const enemyCards = TURN1_CARDS.filter(card => card.type === 'enemy');
  
  // 各タイプから2枚ずつ選ぶ
  const hand = [
    ...pickRandomCards(allyCards, 2),
    ...pickRandomCards(enemyCards, 2)
  ];
  
  // 配列をシャッフル
  return hand.sort(() => Math.random() - 0.5);
}

// ターン2の手札を生成
export function generateNextHand(): Card[] {
  const allyCards = TURN2_CARDS.filter(card => card.type === 'ally');
  const enemyCards = TURN2_CARDS.filter(card => card.type === 'enemy');
  
  // 各タイプから2枚ずつ選ぶ
  const hand = [
    ...pickRandomCards(allyCards, 2),
    ...pickRandomCards(enemyCards, 2)
  ];
  
  // 配列をシャッフル
  return hand.sort(() => Math.random() - 0.5);
}