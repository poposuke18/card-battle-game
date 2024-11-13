import { Card } from '@/types';

export const TURN6_CARDS: Card[] = [
  // 味方リーダー
  {
    id: 'L1',
    type: 'ally',
    category: 'unit',
    name: '戦術の大師',
    points: 140,
    class: 'knight',
    effect: {
      type: 'LEADER_TACTICAL',
      classEffects: [
        { class: 'knight', power: 50 },
        { class: 'guardian', power: 50 }
      ],
      range: 2,
      supportMultiplier: 1.5  // サポートカードの効果を1.5倍
    },
    turn: 6
  },
  {
    id: 'L2',
    type: 'ally',
    category: 'unit',
    name: '軍団長',
    points: 180,  // 効果なしで180点
    class: 'warrior',
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
      categoryBonus: {
        weapon: 60,
        field: 60,
        support: 60
      }
    },
    turn: 6
  },
  {
    id: 'L4',
    type: 'ally',
    category: 'unit',
    name: '守護の統率者',
    points: 120,
    class: 'guardian',
    effect: {
      type: 'LEADER_PROTECTION',
      allyMultiplier: 50,   // 隣接する味方ユニット1体につき+50
      enemyDebuff: -70      // 隣接する敵ユニットのスコアを-70
    },
    turn: 6
  },

  // 敵リーダー
  {
    id: 'L5',
    type: 'enemy',
    category: 'unit',
    name: '混沌の軍師',
    points: 210,
    class: 'knight',
    effect: {
      type: 'LEADER_TACTICAL',
      classEffects: [
        { class: 'warrior', power: 80 }
      ],
      range: 2
    },
    turn: 6
  },
  {
    id: 'L6',
    type: 'enemy',
    category: 'unit',
    name: '狂戦士団長',  // 名前変更
    points: 280,
    class: 'warrior',
    effect: {
      type: 'LEADER_DEBUFF',
      adjacentDebuff: -50  // 隣接するユニットのスコアを-50
    },
    turn: 6
  },
  {
    id: 'L7',
    type: 'enemy',
    category: 'unit',
    name: '冥府の大魔導師',
    points: 190,
    class: 'mage',
    effect: {
      type: 'LEADER_ENHANCEMENT',
      categoryBonus: {
        weapon: 60,
        field: 60,
        support: 60
      }
    },
    turn: 6
  },
  {
    id: 'L8',
    type: 'enemy',
    category: 'unit',
    name: '不滅の守護者',
    points: 160,
    class: 'guardian',
    effect: {
      type: 'LEADER_PROTECTION',
      enemyMultiplier: 90   // 隣接する敵ユニット1体につき+90
    },
    turn: 6
  }
];