// src/constants/cards/leader-cards.ts

import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card } from '@/types';

export const TURN6_CARDS: Card[] = [
  // 味方リーダー
  createCard({
    id: generateCardId('unit', 'ally', 61),
    name: '神鷹の統帥',
    type: 'ally',
    category: 'unit',
    class: 'archer',
    points: calculateCardPoints(BASE_POINTS.UNIT.archer, 'ally', 6, 1, true),
    effect: {
      type: 'LEADER_ARCHER_DEBUFF',
      basePenalty: -Math.round((EFFECT_VALUES.DIAGONAL * 1.2) / 5) * 5,
      weaponPenalty: -Math.round((EFFECT_VALUES.DIAGONAL * 1.8) / 5) * 5
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'ally', 62),
    name: '黄金盾の司令官',
    type: 'ally',
    category: 'unit',
    class: 'guardian',
    points: calculateCardPoints(BASE_POINTS.UNIT.guardian, 'ally', 6, 1, true),
    effect: {
      type: 'LEADER_GUARDIAN_BOOST',
      selfBoostPerAlly: Math.round((EFFECT_VALUES.ADJACENT * 2) / 5) * 5,
      allyBonus: Math.round((EFFECT_VALUES.ADJACENT * 1.5) / 5) * 5
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'ally', 63),
    name: '聖槍の隊長',
    type: 'ally',
    category: 'unit',
    class: 'lancer',
    points: calculateCardPoints(BASE_POINTS.UNIT.lancer, 'ally', 6, 1, true),
    effect: {
      type: 'LEADER_LANCER_BOOST',
      selfBoostPerEnemy: Math.round((EFFECT_VALUES.HORIZONTAL * 1.5) / 5) * 5,
      targetDirection: 'horizontal'
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'ally', 64),
    name: '賢者の大導師',
    type: 'ally',
    category: 'unit',
    class: 'mage',
    points: calculateCardPoints(BASE_POINTS.UNIT.mage, 'ally', 6, 1, true),
    effect: {
      type: 'LEADER_MAGE_EFFECT',
      range: 2,
      allyBonus: EFFECT_VALUES.FIELD,
      enemyPenalty: -Math.round((EFFECT_VALUES.FIELD * 0.8) / 5) * 5,
      supportBonus: Math.round((EFFECT_VALUES.FIELD * 1.2) / 5) * 5
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'ally', 65),
    name: '剣聖',
    type: 'ally',
    category: 'unit',
    class: 'warrior',
    points: calculateCardPoints(BASE_POINTS.UNIT.warrior * 2.5, 'ally', 6, 1, true),
    turn: 6
  }),

  // 敵リーダー
  createCard({
    id: generateCardId('unit', 'enemy', 61),
    name: '闇影の狙撃王',
    type: 'enemy',
    category: 'unit',
    class: 'archer',
    points: calculateCardPoints(BASE_POINTS.UNIT.archer, 'enemy', 6, 1, true),
    effect: {
      type: 'LEADER_ARCHER_DEBUFF',
      basePenalty: -Math.round((EFFECT_VALUES.DIAGONAL * 2) / 5) * 5,
      weaponPenalty: -Math.round((EFFECT_VALUES.DIAGONAL * 3) / 5) * 5
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 62),
    name: '鋼鉄の守護王',
    type: 'enemy',
    category: 'unit',
    class: 'guardian',
    points: calculateCardPoints(BASE_POINTS.UNIT.guardian, 'enemy', 6, 1, true),
    effect: {
      type: 'LEADER_GUARDIAN_BOOST',
      selfBoostPerAlly: Math.round((EFFECT_VALUES.ADJACENT * 2.5) / 5) * 5,
      allyBonus: Math.round((EFFECT_VALUES.ADJACENT * 2) / 5) * 5
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 63),
    name: '死槍の将軍',
    type: 'enemy',
    category: 'unit',
    class: 'lancer',
    points: calculateCardPoints(BASE_POINTS.UNIT.lancer, 'enemy', 6, 1, true),
    effect: {
      type: 'LEADER_LANCER_BOOST',
      selfBoostPerEnemy: Math.round((EFFECT_VALUES.HORIZONTAL * 2.0) / 5) * 5,
      targetDirection: 'horizontal'
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 64),
    name: '冥府の大魔導師',
    type: 'enemy',
    category: 'unit',
    class: 'mage',
    points: calculateCardPoints(BASE_POINTS.UNIT.mage, 'enemy', 6, 1, true),
    effect: {
      type: 'LEADER_MAGE_EFFECT',
      range: 2,
      allyBonus: Math.round((EFFECT_VALUES.FIELD * 1.2) / 5) * 5,
      enemyPenalty: -EFFECT_VALUES.FIELD,
      supportBonus: Math.round((EFFECT_VALUES.FIELD * 1.5) / 5) * 5
    },
    turn: 6
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 65),
    name: '混沌の剣王',
    type: 'enemy',
    category: 'unit',
    class: 'warrior',
    points: calculateCardPoints(BASE_POINTS.UNIT.warrior *1.6, 'enemy', 6, 1, true),
    turn: 6
  })
];