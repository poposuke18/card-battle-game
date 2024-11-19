// src/types/cards.ts

import type { 
    CardType, 
    CardCategory, 
    UnitClass, 
    Position 
  } from './base';
  import type { BaseEffect, WeaponEffect, LeaderEffect } from './effects';
  
  export type Card = {
    id: string;
    type: CardType;
    category: CardCategory;
    name: string;
    points: number;
    effect?: BaseEffect | WeaponEffect | LeaderEffect;
    turn: number;
    class?: UnitClass;
  };
  
  export type PlacedCard = {
    card: Card;
    position: Position;
    score?: number;
    animations?: {
      entrance?: boolean;
      effect?: boolean;
      score?: boolean;
    };
  };
  
  export type CardState = {
    isSelected: boolean;
    isHovered: boolean;
    isAnimating: boolean;
    isPreviewing: boolean;
  };
  
  export type CardAction = {
    type: 'place' | 'remove' | 'update';
    card: Card;
    position?: Position;
    previousPosition?: Position;
  };
  
  export type HandCard = Card & {
    isPlayable: boolean;
    isHighlighted: boolean;
  };
  
  export type DeckConfig = {
    category: CardCategory;
    count: number;
    restrictions?: {
      class?: UnitClass[];
      points?: {
        min: number;
        max: number;
      };
    };
  };