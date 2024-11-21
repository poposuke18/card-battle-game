// src/utils/cards/index.ts

import { 
  TURN1_CARDS, 
  TURN2_CARDS, 
  TURN3_CARDS, 
  TURN4_CARDS,
  TURN5_CARDS,
  TURN6_CARDS,
  TURN7_CARDS
} from '@/constants/cards';
import { getBossCardForStage } from '@/constants/cards/boss-cards';
import { STAGE_ENEMY_RATE } from '@/constants/cards/card-base';
import type { Card, CardType } from '@/types';
  
  // ターンごとのカード枚数設定
  const CARDS_PER_TURN = {
    1: { ally: 3, enemy: 3 },
    2: { ally: 2, enemy: 2 },
    3: { ally: 1, enemy: 1 },
    4: { ally: 1, enemy: 1 },
    5: { ally: 2, enemy: 2 },
    6: { ally: 2, enemy: 2 },
    7: { ally: 1, enemy: 1 },
    8: { ally: 0, enemy: 1 }  // ally を明示的に 0 に設定
  } as const;
  
  export type TurnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;  // 7と8を追加
  
  // ターンに応じたカードプールを取得する関数を追加
  function getTurnCards(turn: TurnNumber): Card[] {
    switch (turn) {
      case 1: return TURN1_CARDS;
      case 2: return TURN2_CARDS;
      case 3: return TURN3_CARDS;
      case 4: return TURN4_CARDS;
      case 5: return TURN5_CARDS;
      case 6: return TURN6_CARDS;
      case 7: return TURN7_CARDS;
      case 8: return [];
      default: return [];
    }
  }
  
  // カードタイプでフィルタリングする関数
  function filterCardsByType(cards: Card[], type: CardType): Card[] {
    return cards.filter(card => card.type === type);
  }
  
  // ランダムにカードを選択する関数
  function pickRandomCards(cardPool: Card[], count: number): Card[] {
    const cards: Card[] = [];
    
    // プールをコピーせず、直接元のプールから選択できるように変更
    for (let i = 0; i < count; i++) {
      if (cardPool.length === 0) break;
      const randomIndex = Math.floor(Math.random() * cardPool.length);
      const randomCard = cardPool[randomIndex];
      // 新しいIDを生成してカードをコピー
      cards.push({
        ...randomCard,
        id: `${randomCard.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    return cards;
  }
  
  // 指定したターン用の手札を生成
// src/utils/cards/index.ts

export function generateHandWithStageBonus(turn: TurnNumber, stage: number): Card[] {
  try {
    // ターン8（ボスターン）の特別処理
    if (turn === 8) {
      return [getBossCardForStage(stage)];
    }

    // 通常のカード生成処理
    const baseCards = getTurnCards(turn);
    const alliedCards = filterCardsByType(baseCards, 'ally');
    const enemyCards = filterCardsByType(baseCards, 'enemy');
    
    const turnConfig = CARDS_PER_TURN[turn];
    if (!turnConfig) return [];

    // カードを生成
    const allyHand = pickRandomCards(alliedCards, turnConfig.ally);
    const enemyHand = pickRandomCards(enemyCards, turnConfig.enemy).map(card => {
      // 敵カードにステージ補正を適用
      const stageMultiplier = STAGE_ENEMY_RATE[stage] || 1;
      return {
        ...card,
        points: Math.floor(card.points * stageMultiplier),
        id: `${card.id}-${Date.now()}-${Math.random()}`
      };
    });

    return [...allyHand, ...enemyHand];
  } catch (error) {
    console.error('Error generating hand:', error);
    return [];
  }
}
  
  // 特定のターン用の手札を直接生成（初期化用）
  export function generateHandForSpecificTurn(turn: TurnNumber, stage: number): Card[] {
    return generateHandWithStageBonus(turn, stage);
  }