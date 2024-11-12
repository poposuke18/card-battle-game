import { Position, PlacedCard, Card, WeaponEffect } from '@/types';
import { getAdjacentCards } from '@/utils/board';

export function calculateWeaponEffect(
  sourcePosition: Position,
  targetPosition: Position,
  sourceCard: Card,
  targetCard: PlacedCard,
  effect: WeaponEffect,
  board: (PlacedCard | null)[][]
): number {
  if (
    sourceCard.type !== targetCard.card.type || 
    targetCard.card.class !== effect.targetClass || 
    targetCard.card.category !== 'unit'
  ) {
    return 0;
  }

  const rowDiff = Math.abs(sourcePosition.row - targetPosition.row);
  const colDiff = Math.abs(sourcePosition.col - targetPosition.col);

  switch (effect.type) {
    case 'VERTICAL_BOOST': {
      return (rowDiff === 1 && colDiff === 0) ? effect.power : 0;
    }

    case 'HORIZONTAL_BOOST': {
      return (rowDiff === 0 && colDiff === 1) ? effect.power : 0;
    }

    case 'DIAGONAL_BOOST': {
      return (rowDiff === 1 && colDiff === 1) ? effect.power : 0;
    }

    case 'CROSS_FORMATION': {
      const isCross = (rowDiff === 1 && colDiff === 0) || 
                     (rowDiff === 0 && colDiff === 1);
      return isCross ? effect.power : 0;
    }

    case 'SURROUND_BOOST': {
      if (rowDiff + colDiff !== 1) return 0;

      const surroundingUnits = getAdjacentCards(sourcePosition, board)
        .filter(adj => 
          adj.card.type === sourceCard.type && 
          adj.card.class === effect.targetClass &&
          adj.card.category === 'unit'
        );

      return surroundingUnits.length >= 3 ? effect.power : 0;
    }
  }

  return 0;
}