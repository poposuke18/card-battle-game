// デバッグモード用のカード管理ユーティリティ

import type { Card } from '@/types';
import { TURN1_CARDS } from '@/constants/cards/basic-units';
import { TURN2_CARDS } from '@/constants/cards/effect-units';
import { TURN3_CARDS } from '@/constants/cards/field-cards';
import { TURN4_CARDS } from '@/constants/cards/weapon-cards';
import { TURN5_CARDS } from '@/constants/cards/reinforcement-cards';
import { TURN6_CARDS } from '@/constants/cards/leader-cards';
import { TURN7_CARDS } from '@/constants/cards/legendary-cards';
import { TURN8_CARDS } from '@/constants/cards/boss-cards';

// 全てのカードを集約
export const ALL_CARDS: Card[] = [
  ...TURN1_CARDS,
  ...TURN2_CARDS,
  ...TURN3_CARDS,
  ...TURN4_CARDS,
  ...TURN5_CARDS,
  ...TURN6_CARDS,
  ...TURN7_CARDS,
  ...TURN8_CARDS,
];

// カテゴリ別にカードを分類
export const CARDS_BY_CATEGORY = {
  unit: ALL_CARDS.filter(card => card.category === 'unit'),
  field: ALL_CARDS.filter(card => card.category === 'field'),
  weapon: ALL_CARDS.filter(card => card.category === 'weapon'),
  support: ALL_CARDS.filter(card => card.category === 'support'),
};

// タイプ別にカードを分類
export const CARDS_BY_TYPE = {
  ally: ALL_CARDS.filter(card => card.type === 'ally'),
  enemy: ALL_CARDS.filter(card => card.type === 'enemy'),
};

// ターン別にカードを分類
export const CARDS_BY_TURN = {
  1: TURN1_CARDS,
  2: TURN2_CARDS,
  3: TURN3_CARDS,
  4: TURN4_CARDS,
  5: TURN5_CARDS,
  6: TURN6_CARDS,
  7: TURN7_CARDS,
  8: TURN8_CARDS,
};

// クラス別にカードを分類（ユニットのみ）
export const CARDS_BY_CLASS = {
  warrior: ALL_CARDS.filter(card => card.class === 'warrior'),
  archer: ALL_CARDS.filter(card => card.class === 'archer'),
  mage: ALL_CARDS.filter(card => card.class === 'mage'),
  knight: ALL_CARDS.filter(card => card.class === 'knight'),
  lancer: ALL_CARDS.filter(card => card.class === 'lancer'),
  guardian: ALL_CARDS.filter(card => card.class === 'guardian'),
};

// デバッグモード用にカードをコピー（IDを一意にする）
export function createDebugCard(originalCard: Card): Card {
  return {
    ...originalCard,
    id: `debug-${originalCard.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

// フィルター条件に基づいてカードを検索
export function filterCards(
  cards: Card[],
  filters: {
    category?: string;
    type?: 'ally' | 'enemy';
    turn?: number;
    class?: string;
    search?: string;
  }
): Card[] {
  return cards.filter(card => {
    if (filters.category && card.category !== filters.category) return false;
    if (filters.type && card.type !== filters.type) return false;
    if (filters.turn && card.turn !== filters.turn) return false;
    if (filters.class && card.class !== filters.class) return false;
    if (filters.search && !card.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}