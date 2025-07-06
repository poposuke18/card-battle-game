// 効果説明のユーティリティ関数

import type { Effect } from '@/types';

export function getEffectDescription(effect: Effect): string {
  switch (effect.type) {
    // 基本効果
    case 'UNIT_VERTICAL_ENEMY_DEBUFF':
      return `縦方向の相手ユニットを${effect.power}弱体化`;
    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
      return `隣接する同チームユニット1体につき自身が${effect.power}強化`;
    case 'ADJACENT_UNIT_BUFF':
      return `隣接する同チームユニットを${effect.power}強化`;
    case 'DIAGONAL_DEBUFF':
      return `斜め方向の相手ユニットを${effect.power}弱体化`;
    case 'FIELD_DUAL_EFFECT':
      return `範囲${effect.range}マス内の同チームユニットを${effect.allyBonus}強化、相手ユニットを${Math.abs(effect.enemyPenalty || 0)}弱体化`;
    case 'WEAPON_ENHANCEMENT':
      return `隣接する同チーム武器カードの効果を${effect.effectMultiplier}倍に増幅`;
    case 'ROW_COLUMN_BUFF':
      return `${effect.targetDirection === 'vertical' ? '縦' : '横'}方向の同チームユニットを${effect.power}強化`;

    // フィールド効果
    case 'FIELD_UNIT_BUFF':
      return `範囲${effect.range}マス内の同チームユニットを${effect.power}強化`;
    case 'FIELD_UNIT_DEBUFF':
      return `範囲${effect.range}マス内の相手ユニットを${effect.power}弱体化`;

    // 武器効果
    case 'VERTICAL_BOOST':
      return `上下にいる同チーム${getClassDisplayName(effect.targetClass)}ユニットを${effect.power}強化`;
    case 'HORIZONTAL_BOOST':
      return `左右にいる同チーム${getClassDisplayName(effect.targetClass)}ユニットを${effect.power}強化`;
    case 'DIAGONAL_BOOST':
      return `斜めにいる同チーム${getClassDisplayName(effect.targetClass)}ユニットを${effect.power}強化`;
    case 'CROSS_FORMATION':
      return `隣接する同チーム${getClassDisplayName(effect.targetClass)}ユニットを${effect.power}強化`;

    // リーダー効果
    case 'LEADER_ARCHER_DEBUFF':
      return `斜め方向の相手ユニットを${Math.abs(effect.basePenalty || 0)}弱体化（武器装備時は${Math.abs(effect.weaponPenalty || 0)}）`;
    case 'LEADER_GUARDIAN_BOOST':
      return `隣接する同チームユニットを${effect.allyBonus}強化、隣接同チームユニット1体につき自身が${effect.selfBoostPerAlly}強化`;
    case 'LEADER_LANCER_BOOST':
      return `横方向の相手ユニット1体につき自身が${effect.selfBoostPerEnemy}強化`;
    case 'LEADER_MAGE_EFFECT':
      return `範囲${effect.range}マス内の同チームユニットを${effect.allyBonus}強化、相手ユニットを${Math.abs(effect.enemyPenalty || 0)}弱体化、同チームサポートを${effect.supportBonus}強化`;

    // 伝説効果（新仕様）
    case 'LEGENDARY_ARTHUR':
      return '隣接する同チームユニットを60強化、隣接する同チーム武器カードの効果を2倍に増幅';
    case 'LEGENDARY_EMILIA':
      return '隣接する同チームユニットの弱体化効果を無効化、隣接する同チームサポートカードの効果を3倍に増幅';
    case 'LEGENDARY_DUAL_SWORDSMAN':
      return '縦方向に隣接する相手ユニットを120弱体化';
    case 'LEGENDARY_VARGA':
      return '隣接する相手ユニットを160弱体化';
    case 'LEGENDARY_NECRO':
      return '範囲2マス内の同チーム武器カード効果を3倍、同チームサポートカード効果を3倍に増幅';
    case 'LEGENDARY_ZARON':
      return '縦列全体の相手ユニットを70弱体化';
      
    // 旧伝説効果（互換性のため残す）
    case 'LEGENDARY_DRAGON_KNIGHT':
      return '隣接する同チームを40強化、範囲2マス内の武器効果を2倍に増幅、範囲内の同チームを40強化・相手を40弱体化';
    case 'LEGENDARY_SAGE':
      return '範囲2マス内の同チームを80強化、隣接する同チームのマイナス効果を完全無効化、相手を40弱体化';
    case 'LEGENDARY_CHAOS_DRAGON':
      return '隣接する同チームを40強化、範囲2マス内の同チームを40強化・相手を80弱体化、武器効果を2倍に増幅';
    case 'LEGENDARY_ARCHMAGE':
      return '範囲2マス内の同チームを80強化・相手を80弱体化、武器効果を2倍に増幅、深淵の魔法で戦場を支配';
    case 'LEGENDARY_DEMON_EMPEROR':
      return '隣接する同チームを30強化、範囲2マス内の相手を40弱体化、弱体化した相手1体につき自身が10強化';

    // ボス効果
    case 'BOSS_IFRIT':
      return '【炎神の怒り】範囲2マス内の相手カードを60弱体化、弱体化した相手カード1体につき自身が40強化';
    case 'BOSS_BAHAMUT':
      return '【竜王の威光】十字方向3マスの相手カードを80弱体化し武器効果無効化、同列同チームカードを60強化、メガフレアで全体に80ダメージ';
    case 'BOSS_LEVIATHAN':
      return '【深海の覇者】タイダルウェーブで範囲2マス相手カードを80弱体化、水没効果で継続弱体化、TSUNAMIで全効果無効化＋120ダメージ';
    case 'BOSS_ODIN':
      return '【神々の王】ギュンギニルで直線貫通攻撃、スレイプニルで移動後効果発動、ラグナロクで1ターン間同チームカード全効果2倍';

    default:
      return '特殊効果';
  }
}

export function getClassDescription(unitClass: string | null): string {
  switch (unitClass) {
    case 'warrior':
      return '戦士：攻撃力重視、縦方向に強い';
    case 'archer':
      return '弓兵：射程重視、斜め方向の妨害が得意';
    case 'mage':
      return '魔法使い：効果重視、広範囲への影響';
    case 'knight':
      return '騎士：高コスト、周囲への強化効果';
    case 'lancer':
      return '槍兵：バランス型、横方向に強い';
    case 'guardian':
      return '守護者：防御型、隣接効果に特化';
    default:
      return '';
  }
}

// カテゴリーとクラスの表示名を取得
export function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'unit':
      return 'ユニット';
    case 'field':
      return 'フィールド';
    case 'weapon':
      return '武器';
    case 'support':
      return 'サポート';
    case 'leader':
      return 'リーダー';
    case 'legendary':
      return '伝説';
    case 'boss':
      return 'ボス';
    default:
      return category;
  }
}

export function getCardTypeDisplayName(cardType: 'ally' | 'enemy'): string {
  switch (cardType) {
    case 'ally':
      return '同チームカード';
    case 'enemy':
      return '相手カード';
    default:
      return cardType;
  }
}

export function getClassDisplayName(unitClass: string | null): string {
  switch (unitClass) {
    case 'warrior':
      return 'ウォリアー';
    case 'archer':
      return 'アーチャー';
    case 'mage':
      return 'メイジ';
    case 'knight':
      return 'ナイト';
    case 'lancer':
      return 'ランサー';
    case 'guardian':
      return 'ガーディアン';
    default:
      return unitClass || '';
  }
}

// カードの完全な表示タイプを取得（カテゴリー + クラス）
export function getCardTypeDisplay(category: string, unitClass: string | null): string {
  const categoryName = getCategoryDisplayName(category);
  
  if (category === 'unit' && unitClass) {
    const className = getClassDisplayName(unitClass);
    return `${categoryName}・${className}`;
  }
  
  return categoryName;
}