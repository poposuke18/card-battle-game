// カード強化効果検出のユーティリティ関数
import type { Card } from '@/types';
import { Coordinate, getAdjacentPositions, getDiamondRange, filterValidPositions } from './position-utils';
import { Board, findCardsMatching } from './board-search';

export interface Enhancement {
  source: string;
  multiplier: number;
  type: 'weapon' | 'support';
}

export interface EnhancementDetails {
  multiplier: number;
  sources: Enhancement[];
}

export function detectWeaponEnhancements(board: Board, position: Coordinate): EnhancementDetails {
  let totalMultiplier = 1;
  const sources: Enhancement[] = [];
  
  const targetCard = board[position.row][position.col];
  if (!targetCard) return { multiplier: totalMultiplier, sources };

  // アーサの隣接武器強化効果をチェック（同チームのみ）
  const adjacentPositions = filterValidPositions(getAdjacentPositions(position), board.length);
  adjacentPositions.forEach((pos) => {
    const adjacentCard = board[pos.row][pos.col];
    if (adjacentCard && 
        adjacentCard.effect && 
        adjacentCard.effect.type === 'LEGENDARY_ARTHUR' &&
        adjacentCard.category === 'unit' &&
        adjacentCard.type === targetCard.type) { // 同チームチェック追加
      const arthurEffect = adjacentCard.effect as any;
      const multiplier = arthurEffect.weaponMultiplier || 1;
      totalMultiplier *= multiplier;
      sources.push({
        source: adjacentCard.name,
        multiplier,
        type: 'weapon'
      });
    }
  });

  // 武器職人の武器強化効果をチェック
  adjacentPositions.forEach((pos) => {
    const adjacentCard = board[pos.row][pos.col];
    if (adjacentCard && 
        adjacentCard.effect && 
        adjacentCard.effect.type === 'WEAPON_ENHANCEMENT' &&
        adjacentCard.category === 'support' &&
        adjacentCard.type === board[position.row][position.col]?.type) {
      
      // サポートカード自体の強化倍率を取得
      const supportMultiplier = detectSupportEnhancements(board, pos).multiplier;
      const weaponEnhanceEffect = adjacentCard.effect as any;
      const baseMultiplier = weaponEnhanceEffect.effectMultiplier || 1;
      const actualMultiplier = baseMultiplier * supportMultiplier;
      
      totalMultiplier *= actualMultiplier;
      sources.push({
        source: adjacentCard.name,
        multiplier: actualMultiplier,
        type: 'weapon'
      });
    }
  });

  return {
    multiplier: totalMultiplier,
    sources
  };
}

export function detectSupportEnhancements(board: Board, position: Coordinate): EnhancementDetails {
  let totalMultiplier = 1;
  const sources: Enhancement[] = [];
  
  const targetCard = board[position.row][position.col];
  if (!targetCard) return { multiplier: totalMultiplier, sources };

  // エレミアの隣接サポート強化効果をチェック（同チームのみ）
  const adjacentPositions = filterValidPositions(getAdjacentPositions(position), board.length);
  adjacentPositions.forEach((pos) => {
    const adjacentCard = board[pos.row][pos.col];
    if (adjacentCard && 
        adjacentCard.effect && 
        adjacentCard.effect.type === 'LEGENDARY_EMILIA' &&
        adjacentCard.category === 'unit' &&
        adjacentCard.type === targetCard.type) { // 同チームチェック追加
      const emiliaEffect = adjacentCard.effect as any;
      const multiplier = emiliaEffect.supportMultiplier || 1;
      totalMultiplier *= multiplier;
      sources.push({
        source: adjacentCard.name,
        multiplier,
        type: 'support'
      });
    }
  });

  // ネクロの範囲サポート強化効果をチェック（同チームのみ）
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const card = board[row][col];
      if (card && 
          card.effect && 
          card.effect.type === 'LEGENDARY_NECRO' &&
          card.category === 'unit' &&
          card.type === targetCard.type) { // 同チームチェック追加
        const necroEffect = card.effect as any;
        const range = necroEffect.range || 2;
        const rangePositions = getDiamondRange({ row, col }, range, board.length);
        const isInRange = rangePositions.some(rangePos => 
          rangePos.row === position.row && rangePos.col === position.col
        );
        if (isInRange) {
          const multiplier = necroEffect.supportMultiplier || 1;
          totalMultiplier *= multiplier;
          sources.push({
            source: card.name,
            multiplier,
            type: 'support'
          });
        }
      }
    }
  }

  return {
    multiplier: totalMultiplier,
    sources
  };
}

export function detectProtectionEffects(board: Board, targetPosition: Coordinate, targetCard: Card): boolean {
  if (!targetCard || targetCard.type !== 'ally' || targetCard.category !== 'unit') {
    return false; // 同チームユニット以外は保護対象外
  }

  // エレミアの保護効果をチェック
  const protectionSources = findCardsMatching(board, (card, position) => {
    if (!card.effect || card.type !== 'ally' || card.category !== 'unit') {
      return false;
    }
    
    if (card.effect.type === 'LEGENDARY_EMILIA' || card.effect.type === 'LEGENDARY_SAGE') {
      // エレミアの隣接位置を確認
      const adjacentPositions = filterValidPositions(getAdjacentPositions(position), board.length);
      return adjacentPositions.some(pos => 
        pos.row === targetPosition.row && pos.col === targetPosition.col
      );
    }
    
    return false;
  });

  return protectionSources.length > 0;
}

export function getEnhancementDescription(enhancement: Enhancement): string {
  return `${enhancement.source}:${enhancement.multiplier}倍`;
}

export function formatEnhancementSources(sources: Enhancement[]): string {
  return sources.map(getEnhancementDescription).join('、');
}