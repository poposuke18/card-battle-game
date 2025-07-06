import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card, FieldEffect } from '@/types';

export const TURN3_CARDS: Card[] = [
  // 味方フィールドカード
  createCard({
    id: generateCardId('field', 'ally', 31),
    name: '要塞',
    type: 'ally',
    category: 'field',
    points: calculateCardPoints(BASE_POINTS.FIELD, 'ally', 3, 1, true),
    effect: {
      type: 'FIELD_UNIT_BUFF',
      power: EFFECT_VALUES.FIELD,
      range: 2,
      pattern: 'diamond'
    } as FieldEffect,
    turn: 3
  }),
  createCard({
    id: generateCardId('field', 'ally', 32),
    name: '光の聖域',
    type: 'ally',
    category: 'field',
    points: calculateCardPoints(BASE_POINTS.FIELD, 'ally', 3, 1, true),
    effect: {
      type: 'FIELD_UNIT_DEBUFF',
      power: EFFECT_VALUES.FIELD,
      range: 2,
      pattern: 'diamond'
    } as FieldEffect,
    turn: 3
  }),

  // 敵フィールドカード
  createCard({
    id: generateCardId('field', 'enemy', 31),
    name: '魔界門',
    type: 'enemy',
    category: 'field',
    points: calculateCardPoints(BASE_POINTS.FIELD, 'enemy', 3, 1, true),
    effect: {
      type: 'FIELD_UNIT_BUFF',
      power: Math.round((EFFECT_VALUES.FIELD * 1.5) / 5) * 5,
      range: 2,
      pattern: 'diamond'
    } as FieldEffect,
    turn: 3
  }),
  createCard({
    id: generateCardId('field', 'enemy', 32),
    name: '闇の結界',
    type: 'enemy',
    category: 'field',
    points: calculateCardPoints(BASE_POINTS.FIELD, 'enemy', 3, 1, true),
    effect: {
      type: 'FIELD_UNIT_DEBUFF',
      power: Math.round((EFFECT_VALUES.FIELD * 1.5) / 5) * 5,
      range: 2,
      pattern: 'diamond'
    } as FieldEffect,
    turn: 3
  })
];