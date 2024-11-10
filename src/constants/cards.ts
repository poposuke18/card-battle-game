// src/constants/cards.ts

import { Card } from '@/types/game';

// ターン1の基本ユニット
export const TURN1_CARDS: Card[] = [
  { 
    id: '1',
    type: 'ally',
    name: '民兵',
    points: 100,
    description: '基本的な歩兵ユニット'
  },
  { 
    id: '2',
    type: 'ally',
    name: '弓兵',
    points: 110,
    description: '遠距離攻撃が得意な兵士'
  },
  {
    id: '3',
    type: 'enemy',
    name: 'ゴブリン',
    points: 120,
    description: '基本的な敵ユニット'
  },
  {
    id: '4',
    type: 'enemy',
    name: 'オーク',
    points: 130,
    description: '力の強い敵ユニット'
  }
];

// ターン2の効果付きユニット
export const TURN2_CARDS: Card[] = [
    {
        id: '5',
        type: 'ally',
        name: '槍兵',
        points: 90,
        description: '横か縦に敵ユニットが2体並んでいる隣に配置すると攻撃力上昇',
        effect: {
          type: 'POWER_UP_BY_ENEMY_LINE',  // 新しい効果タイプを定義
          condition: 2,  // 必要な敵ユニット数を2に変更
          power: 60
        }
      },
  {
    id: '6',
    type: 'ally',
    name: '剣士',
    points: 80,
    description: '隣接する味方ユニットごとに攻撃力上昇',
    effect: {
      type: 'POWER_UP_BY_ALLY',
      power: 30
    }
  },
  {
    id: '7',
    type: 'enemy',
    name: 'トロル',
    points: 140,
    description: '隣接する全てのユニットの攻撃力を減少',
    effect: {
      type: 'DAMAGE_ADJACENT',
      power: 20
    }
  },
  {
    id: '8',
    type: 'enemy',
    name: 'ダークエルフ',
    points: 120,
    description: '隣接する敵ユニットの攻撃力を上昇',
    effect: {
      type: 'BUFF_ADJACENT',
      power: 30
    }
  }
];