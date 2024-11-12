// src/constants/cards/reinforcement-cards.ts

import { Card } from '@/types';

export const TURN5_CARDS: Card[] = [
  // 味方カード
  {
    id: '25',
    type: 'ally',
    category: 'unit',
    name: '竜騎士隊長',
    points: 120,
    class: 'knight',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'warrior', power: 30 },
        { class: 'archer', power: 20 },
        { class: 'knight', power: 25 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '26',
    type: 'ally',
    category: 'unit',
    name: '魔導師長',
    points: 110,
    class: 'mage',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'mage', power: 35 },
        { class: 'archer', power: 25 },
        { class: 'lancer', power: 20 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '27',
    type: 'ally',
    category: 'field',
    name: '勝利の旗印',
    points: 70,
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: 30,
      targetDirection: 'vertical'
    },
    turn: 5
  },
  {
    id: '28',
    type: 'ally',
    category: 'field',
    name: '英雄の詩',
    points: 60,
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: 35,
      targetDirection: 'horizontal'
    },
    turn: 5
  },
  {
    id: '29',
    type: 'ally',
    category: 'unit',
    name: '武器職人',
    points: 80,
    class: 'warrior',
    effect: {
      type: 'WEAPON_ENHANCEMENT',
      pointsBonus: 30,
      powerBonus: 20,
      range: 1
    },
    turn: 5
  },
  
  // 敵カード
  {
    id: '30',
    type: 'enemy',
    category: 'unit',
    name: '混沌の将軍',
    points: 140,
    class: 'knight',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'warrior', power: 35 },
        { class: 'archer', power: 25 },
        { class: 'knight', power: 30 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '31',
    type: 'enemy',
    category: 'field',
    name: '破滅の戦旗',
    points: 90,
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: 35,
      targetDirection: 'vertical'
    },
    turn: 5
  },
  {
    id: '32',
    type: 'enemy',
    category: 'unit',
    name: '死霊魔導師',
    points: 130,
    class: 'mage',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'mage', power: 40 },
        { class: 'lancer', power: 25 },
        { class: 'archer', power: 20 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '33',
    type: 'enemy',
    category: 'unit',
    name: '闇の武器匠',
    points: 100,
    class: 'warrior',
    effect: {
      type: 'WEAPON_ENHANCEMENT',
      pointsBonus: 35,
      powerBonus: 25,
      range: 1
    },
    turn: 5
  }
];