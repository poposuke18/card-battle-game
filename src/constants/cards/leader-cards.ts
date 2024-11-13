// src/constants/cards/leader-cards.ts
import { Card } from '@/types';

export const TURN6_CARDS: Card[] = [
  // 味方リーダー
  {
    id: 'L1',
    type: 'ally',
    category: 'unit',
    name: '戦術の大師',
    points: 150,
    class: 'knight',
    effect: {
      type: 'LEADER_TACTICAL',
      classEffects: [
        { class: 'warrior', power: 40 },
        { class: 'archer', power: 40 },
        { class: 'knight', power: 40 }
      ],
      range: 2,
      supportBonus: 20  // サポートカードの効果を強化
    },
    turn: 6
  },
  {
    id: 'L2',
    type: 'ally',
    category: 'unit',
    name: '軍団長',
    points: 140,
    class: 'warrior',
    effect: {
      type: 'LEADER_FORMATION',
      power: 50,
      formationBonus: {
        vertical: 30,
        horizontal: 30
      }
    },
    turn: 6
  },
  {
    id: 'L3',
    type: 'ally',
    category: 'unit',
    name: '神聖なる導き手',
    points: 130,
    class: 'mage',
    effect: {
      type: 'LEADER_ENHANCEMENT',
      weaponBonus: 50,  // 武器の効果を強化
      supportBonus: 30  // サポートの効果を強化
    },
    turn: 6
  },
  {
    id: 'L4',
    type: 'ally',
    category: 'unit',
    name: '守護の統率者',
    points: 160,
    class: 'guardian',
    effect: {
      type: 'LEADER_PROTECTION',
      defenseBonus: 40,  // 防御ボーナス
      counterAttack: 30  // 反撃ダメージ
    },
    turn: 6
  },

  // 敵リーダー（より強力な効果）
  {
    id: 'L5',
    type: 'enemy',
    category: 'unit',
    name: '混沌の軍師',
    points: 180,
    class: 'knight',
    effect: {
      type: 'LEADER_TACTICAL',
      classEffects: [
        { class: 'warrior', power: 50 },
        { class: 'archer', power: 50 },
        { class: 'knight', power: 50 }
      ],
      range: 3,  // より広い範囲
      supportBonus: 30
    },
    turn: 6
  },
  {
    id: 'L6',
    type: 'enemy',
    category: 'unit',
    name: '死の軍団統領',
    points: 170,
    class: 'warrior',
    effect: {
      type: 'LEADER_FORMATION',
      power: 60,
      formationBonus: {
        vertical: 40,
        horizontal: 40
      }
    },
    turn: 6
  },
  {
    id: 'L7',
    type: 'enemy',
    category: 'unit',
    name: '冥府の大魔導師',
    points: 160,
    class: 'mage',
    effect: {
      type: 'LEADER_ENHANCEMENT',
      weaponBonus: 70,
      supportBonus: 40
    },
    turn: 6
  },
  {
    id: 'L8',
    type: 'enemy',
    category: 'unit',
    name: '不滅の守護者',
    points: 190,
    class: 'guardian',
    effect: {
      type: 'LEADER_PROTECTION',
      defenseBonus: 50,
      counterAttack: 40,
      range: 2  // 防御効果の範囲
    },
    turn: 6
  }
];