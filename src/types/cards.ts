import type { CardType, CardCategory, UnitClass, Position } from './base';
import type { BaseEffect, WeaponEffect } from './effects';

export type Card = {
  id: string;
  type: CardType;
  category: CardCategory;
  name: string;
  points: number;
  effect?: BaseEffect | WeaponEffect;
  turn: number;
  class?: UnitClass;
};

export type PlacedCard = {
  card: Card;
  position: Position;
};