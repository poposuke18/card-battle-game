// src/utils/common.ts

import { UnitClass } from '@/types';

// クラス名の日本語表示用
export function getClassDisplayName(unitClass: UnitClass): string {
  if (!unitClass) return '';
  
  switch (unitClass) {
    case 'warrior': return '戦士';
    case 'archer': return '弓兵';
    case 'mage': return '魔法使い';
    case 'knight': return '騎士';
    case 'lancer': return '槍兵';
    default: return '';
  }
}

// クラスアイコンの取得用
export function getClassIcon(unitClass: UnitClass): string {
  if (!unitClass) return '';
  
  switch (unitClass) {
    case 'warrior': return '⚔️';
    case 'archer': return '🏹';
    case 'mage': return '🔮';
    case 'knight': return '🛡️';
    case 'lancer': return '🔱';
    default: return '';
  }
}

// カードカテゴリーの日本語表示用
export function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'unit': return 'ユニット';
    case 'field': return 'フィールド';
    case 'weapon': return '武器';
    default: return '';
  }
}

// カードタイプの日本語表示用
export function getTypeDisplayName(type: string): string {
  switch (type) {
    case 'ally': return '味方';
    case 'enemy': return '敵';
    default: return '';
  }
}