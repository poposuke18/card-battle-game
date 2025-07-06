// カード効果計算のユーティリティ関数

import type { Card, Effect, Position } from '@/types';
import { 
  Coordinate, 
  getAdjacentPositions, 
  getVerticalPositions, 
  getHorizontalPositions, 
  getDiagonalPositions,
  getDiamondRange,
  filterValidPositions,
  getPositionsByDirection
} from './position-utils';
import { 
  Board, 
  findCardsMatching, 
  getAdjacentCards, 
  getCardAt,
  checkDiagonalWeapon
} from './board-search';
import { 
  detectWeaponEnhancements, 
  detectSupportEnhancements, 
  detectProtectionEffects,
  formatEnhancementSources,
  Enhancement,
  EnhancementDetails
} from './enhancement-detector';
import { 
  isLeaderMageEffect,
  isLegendaryArthurEffect,
  isLegendaryEmiliaEffect,
  isWeaponEffect,
  isRowColumnBuffEffect,
  isBossIfritEffect
} from './effect-type-guards';

// 既存のCoordinate型を再エクスポート
export type { Coordinate };

// 後方互換性のため、新しいユーティリティ関数をラップ
function isProtectedFromDebuff(board: Board, targetPosition: Coordinate, targetCard: Card): boolean {
  return detectProtectionEffects(board, targetPosition, targetCard);
}

function getAdjacentAllies(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): number {
  const adjacentCards = getAdjacentCards(board, position);
  return adjacentCards.filter(match => 
    match.card.type === cardType && match.card.category === 'unit'
  ).length;
}

function getHorizontalEnemies(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): number {
  let enemyCount = 0;
  const enemyType = cardType === 'ally' ? 'enemy' : 'ally';
  const horizontalPositions = filterValidPositions(getHorizontalPositions(position), board.length);

  horizontalPositions.forEach((pos) => {
    const card = getCardAt(board, pos);
    if (card && card.category === 'unit' && card.type === enemyType) {
      enemyCount++;
    }
  });

  return enemyCount;
}

function checkAdjacentWeapon(board: Board, position: Coordinate, cardType: 'ally' | 'enemy'): boolean {
  const adjacentCards = getAdjacentCards(board, position);
  return adjacentCards.some(match => 
    match.card.category === 'weapon' && match.card.type === cardType
  );
}

// 効果の範囲を計算する関数
export function getEffectRange(card: Card, position: Coordinate, boardSize: number = 5): Coordinate[] {
  if (!card.effect) return [];

  const { row, col: column } = position;
  const ranges: Coordinate[] = [];

  switch (card.effect.type) {
    case 'UNIT_VERTICAL_ENEMY_DEBUFF':
    case 'VERTICAL_BOOST':
      return filterValidPositions(getVerticalPositions(position), boardSize);

    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
    case 'ADJACENT_UNIT_BUFF':
    case 'LEADER_GUARDIAN_BOOST':
    case 'WEAPON_ENHANCEMENT':
    case 'CROSS_FORMATION':
      return filterValidPositions(getAdjacentPositions(position), boardSize);

    case 'DIAGONAL_DEBUFF':
    case 'DIAGONAL_BOOST':
    case 'LEADER_ARCHER_DEBUFF':
      return filterValidPositions(getDiagonalPositions(position), boardSize);

    case 'HORIZONTAL_BOOST':
      return filterValidPositions(getHorizontalPositions(position), boardSize);

    case 'FIELD_UNIT_BUFF':
    case 'FIELD_UNIT_DEBUFF':
    case 'FIELD_DUAL_EFFECT':
    case 'LEADER_MAGE_EFFECT':
      return getDiamondRange(position, (card.effect as any).range || 2, boardSize);

    case 'ROW_COLUMN_BUFF':
      const rowColEffect = card.effect as any;
      const ranges: Coordinate[] = [];
      if (rowColEffect.targetDirection === 'vertical') {
        // 縦方向（上下全て）
        for (let r = 0; r < boardSize; r++) {
          if (r !== position.row) {
            ranges.push({ row: r, col: position.col });
          }
        }
      } else if (rowColEffect.targetDirection === 'horizontal') {
        // 横方向（左右全て）
        for (let c = 0; c < boardSize; c++) {
          if (c !== position.col) {
            ranges.push({ row: position.row, col: c });
          }
        }
      }
      return ranges;

    case 'LEADER_LANCER_BOOST':
      // 自己強化なので効果範囲は自分のみ
      return [];

    case 'LEGENDARY_ARTHUR':
    case 'LEGENDARY_EMILIA':
    case 'LEGENDARY_VARGA':
      // 隣接範囲効果
      return filterValidPositions(getAdjacentPositions(position), boardSize);

    case 'LEGENDARY_NECRO':
      // 範囲効果
      const necroEffect = card.effect as any;
      return getDiamondRange(position, necroEffect.range || 2, boardSize);

    case 'LEGENDARY_ZARON':
      // 縦列全体効果
      const zaronRanges: Coordinate[] = [];
      for (let r = 0; r < boardSize; r++) {
        if (r !== position.row) {
          zaronRanges.push({ row: r, col: position.col });
        }
      }
      return zaronRanges;

    case 'LEGENDARY_DUAL_SWORDSMAN':
      // 縦方向のみ
      return filterValidPositions(getVerticalPositions(position), boardSize);

    case 'BOSS_IFRIT':
      // イフリートの範囲2ダイアモンド効果
      const ifritEffect = card.effect as any;
      return getDiamondRange(position, ifritEffect.primaryEffect?.range || 2, boardSize);

    default:
      return [];
  }
}

// カード効果を適用して実際のポイントを計算
export function calculateCardEffects(
  board: (Card | null)[][],
  targetPosition: Coordinate,
  targetCard: Card | null
): number {
  if (!targetCard) return 0;

  // フィールドカードは他のカードの効果を受けない
  if (targetCard.category === 'field') return 0;

  let effectBonus = 0;
  const boardSize = board.length;
  
  // 武器カードは基本的に効果を受けないが、武器強化効果は受ける
  const isWeapon = targetCard.category === 'weapon';
  // サポートカードは特定の効果のみ受ける
  const isSupport = targetCard.category === 'support';
  

  // ボード上の全カードの効果を確認
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const sourceCard = board[row][col];
      if (!sourceCard || !sourceCard.effect) continue;

      // 自己強化効果は特別処理
      if (sourceCard.effect.type === 'SELF_POWER_UP_BY_ADJACENT_ALLY') {
        // 自分自身の場合のみ適用
        if (row === targetPosition.row && col === targetPosition.col) {
          const adjacentAllies = getAdjacentAllies(board, { row, col }, sourceCard.type);
          const bonus = (sourceCard.effect.power || 0) * adjacentAllies;
          effectBonus += bonus;
        }
        continue; // 他の処理をスキップ
      }

      // リーダー自己強化効果も特別処理
      if (sourceCard.effect.type === 'LEADER_GUARDIAN_BOOST') {
        // 自分自身の場合のみ適用（隣接同チームによる自己強化）
        if (row === targetPosition.row && col === targetPosition.col) {
          const leaderEffect = sourceCard.effect as any;
          const adjacentAllies = getAdjacentAllies(board, { row, col }, sourceCard.type);
          const selfBonus = (leaderEffect.selfBoostPerAlly || 0) * adjacentAllies;
          effectBonus += selfBonus;
        }
        // 範囲効果は別途処理されるので、ここではcontinueしない
      }

      if (sourceCard.effect.type === 'LEADER_LANCER_BOOST') {
        // 自分自身の場合のみ適用（横方向の相手による自己強化）
        if (row === targetPosition.row && col === targetPosition.col) {
          const leaderEffect = sourceCard.effect as any;
          const horizontalEnemies = getHorizontalEnemies(board, { row, col }, sourceCard.type);
          const selfBonus = (leaderEffect.selfBoostPerEnemy || 0) * horizontalEnemies;
          effectBonus += selfBonus;
        }
        continue; // ランサーは自己強化のみ
      }


      // ボスカードの自己強化効果
      if (sourceCard.effect.type === 'BOSS_IFRIT') {
        // イフリートの自己強化（範囲内の実際に弱体化した敵数による）
        if (row === targetPosition.row && col === targetPosition.col) {
          const ifritEffect = sourceCard.effect as any;
          const range = ifritEffect.primaryEffect?.range || 2;
          const rangePositions = getDiamondRange({ row, col }, range, board.length);
          
          let actuallyWeakenedEnemies = 0;
          rangePositions.forEach(pos => {
            const rangeCard = board[pos.row][pos.col];
            if (rangeCard && rangeCard.category === 'unit' && rangeCard.type !== sourceCard.type) {
              // エレミアの保護を受けていない敵ユニットのみカウント
              if (!isProtectedFromDebuff(board, pos, rangeCard)) {
                actuallyWeakenedEnemies++;
              }
            }
          });
          
          const selfBonus = (ifritEffect.secondaryEffect?.powerPerWeakened || 0) * actuallyWeakenedEnemies;
          effectBonus += selfBonus;
        }
        // 範囲効果は別途処理されるので、ここではcontinueしない
      }

      // その他の効果は範囲チェック
      const effectRange = getEffectRange(sourceCard, { row, col }, boardSize);
      
      // ターゲット位置が効果範囲内かチェック
      const isInRange = effectRange.some(
        pos => pos.row === targetPosition.row && pos.col === targetPosition.col
      );

      if (!isInRange) continue;

      // サポートカードは特定の効果のみ受ける
      if (isSupport) {
        const allowedSupportEffects = [
          'LEADER_MAGE_EFFECT',
          'LEGENDARY_EMILIA', // エレミアの保護効果
          'LEGENDARY_NECRO'   // ネクロの強化効果
        ];
        if (!allowedSupportEffects.includes(sourceCard.effect.type)) {
          continue;
        }
      }

      // 武器カードは武器強化効果のみ受ける
      if (isWeapon) {
        const allowedWeaponEffects = [
          'WEAPON_ENHANCEMENT',
          'LEGENDARY_ARTHUR',
          'LEGENDARY_NECRO'
        ];
        if (!allowedWeaponEffects.includes(sourceCard.effect.type)) {
          continue;
        }
      }

      // 効果を適用
      switch (sourceCard.effect.type) {
        case 'UNIT_VERTICAL_ENEMY_DEBUFF':
          // 縦方向の敵ユニットを弱体化（ユニットカードのみ影響を受ける）
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              effectBonus -= sourceCard.effect.power || 0;
            }
          }
          break;

        case 'ADJACENT_UNIT_BUFF':
          // 隣接する味方ユニットを強化（ユニットカードのみ影響を受ける）
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            effectBonus += sourceCard.effect.power || 0;
          }
          break;

        case 'DIAGONAL_DEBUFF':
          // 斜め方向の敵ユニットを弱体化（ユニットカードのみ影響を受ける）
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              effectBonus -= sourceCard.effect.power || 0;
            }
          }
          break;

        case 'FIELD_UNIT_BUFF':
          // フィールドカードで味方ユニットを強化（ユニットカードのみ影響を受ける）
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            const fieldEffect = sourceCard.effect as any;
            effectBonus += fieldEffect.power || 0;
          }
          break;

        case 'FIELD_UNIT_DEBUFF':
          // フィールドカードで敵ユニットを弱体化（ユニットカードのみ影響を受ける）
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              const fieldEffect = sourceCard.effect as any;
              effectBonus -= fieldEffect.power || 0;
            }
          }
          break;

        case 'VERTICAL_BOOST':
        case 'HORIZONTAL_BOOST':
        case 'DIAGONAL_BOOST':
        case 'CROSS_FORMATION':
          // 武器効果：指定クラスのユニットを強化（ユニットカードのみ影響を受ける）
          const weaponEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && targetCard.class === weaponEffect.targetClass && sourceCard.type === targetCard.type) {
            let weaponPower = weaponEffect.power || 0;
            
            // 武器強化効果による倍率を確認
            const weaponMultiplier = getWeaponEnhancementMultiplier(board, { row, col });
            weaponPower = Math.floor(weaponPower * weaponMultiplier);
            
            effectBonus += weaponPower;
          }
          break;

        case 'WEAPON_ENHANCEMENT':
          // 武器強化効果は武器の効果を倍率で増幅するため、ここでは処理しない
          // 武器効果の計算時に getWeaponEnhancementMultiplier で処理される
          // ただし、サポートカード自身の効果強化は適用される
          break;

        case 'FIELD_DUAL_EFFECT':
          // 双方向フィールド効果：ユニットのみ影響を受ける
          if (targetCard.category === 'unit') {
            const dualEffect = sourceCard.effect as any;
            if (sourceCard.type === targetCard.type) {
              // 同チームなら強化
              effectBonus += dualEffect.allyBonus || 0;
            } else {
              // 相手なら弱体化
              effectBonus += dualEffect.enemyPenalty || 0;  // enemyPenaltyは負の値
            }
          }
          break;

        case 'ROW_COLUMN_BUFF':
          // 縦横強化効果：ユニットのみ影響を受ける
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            const rowColEffect = sourceCard.effect as any;
            // サポートカード強化の倍率を適用
            const supportMultiplier = getSupportEnhancementMultiplier(board, { row, col });
            const enhancedPower = Math.floor((rowColEffect.power || 0) * supportMultiplier);
            effectBonus += enhancedPower;
          }
          break;

        case 'LEADER_ARCHER_DEBUFF':
          // リーダーアーチャーの斜め弱体化効果
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              const leaderEffect = sourceCard.effect as any;
              // 武器が斜め方向にあるかチェック（アーチャーなので斜めをチェック）
              const hasDiagonalWeapon = checkDiagonalWeapon(board, { row, col }, sourceCard.type);
              const penalty = hasDiagonalWeapon 
                ? (leaderEffect.weaponPenalty || 0)
                : (leaderEffect.basePenalty || 0);
              effectBonus += penalty; // penaltyは負の値
            }
          }
          break;

        case 'LEADER_GUARDIAN_BOOST':
          // リーダーガーディアンの隣接強化効果
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            const leaderEffect = sourceCard.effect as any;
            effectBonus += leaderEffect.allyBonus || 0;
          }
          break;

        case 'LEADER_MAGE_EFFECT':
          // リーダーメイジの範囲効果
          const mageEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit') {
            if (sourceCard.type === targetCard.type) {
              effectBonus += mageEffect.allyBonus || 0;
            } else {
              // エレミアの保護効果をチェック（弱体化のみ）
              if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
                effectBonus += mageEffect.enemyPenalty || 0; // enemyPenaltyは負の値
              }
            }
          } else if (targetCard.category === 'support' && sourceCard.type === targetCard.type) {
            // サポートカード強化の倍率を適用
            const supportMultiplier = getSupportEnhancementMultiplier(board, { row, col });
            const enhancedBonus = Math.floor((mageEffect.supportBonus || 0) * supportMultiplier);
            effectBonus += enhancedBonus;
          }
          break;

        case 'LEGENDARY_ARTHUR':
          // 聖騎士アーサ：隣接する味方ユニットを60強化、隣接する武器効果を2倍
          const arthurEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            effectBonus += arthurEffect.power || 0;
          }
          break;

        case 'LEGENDARY_EMILIA':
          // 大賢者エレミア：隣接する味方ユニットの弱体効果を無効、隣接するサポートカードの効果を3倍
          // 弱体化無効は isProtectedFromDebuff 関数で処理済み
          // サポートカード効果の3倍処理は別途実装が必要
          break;

        case 'LEGENDARY_DUAL_SWORDSMAN':
          // 双剣士ウルファの縦方向強攻撃
          const dualSwordsmanCardEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              effectBonus -= dualSwordsmanCardEffect.power || 0;
            }
          }
          break;

        case 'LEGENDARY_VARGA':
          // 冥皇帝ヴァルガ：隣接する敵ユニットを160強化
          const vargaEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック（弱体化のみ）
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              effectBonus -= vargaEffect.power || 0; // 敵なので弱体化として処理
            }
          }
          break;

        case 'LEGENDARY_NECRO':
          // 深淵術師ネクロ：範囲内の武器カードの効果3倍、サポートカード効果3倍
          // 武器・サポートカード効果の倍率処理は別途実装が必要
          break;

        case 'LEGENDARY_ZARON':
          // 暗黒戦士ザロン：縦列全部の味方カードを70弱体化
          const zaronEffect = sourceCard.effect as any;
          // 縦列判定（同じ列）
          if (col === targetPosition.col && targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック（弱体化のみ）
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              effectBonus -= zaronEffect.power || 0;
            }
          }
          break;

        case 'BOSS_IFRIT':
          const ifritBossEffect = sourceCard.effect as any;
          // イフリートの範囲弱体化効果
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              effectBonus += ifritBossEffect.primaryEffect?.enemyPenalty || 0;
            }
          }
          // イフリートの自己強化効果
          if (targetCard === sourceCard) {
            const rangePositions = getDiamondRange({ row, col }, ifritBossEffect.primaryEffect?.range || 2, board.length);
            let weakenedEnemies = 0;
            rangePositions.forEach(pos => {
              const rangeCard = board[pos.row][pos.col];
              if (rangeCard && rangeCard.category === 'unit' && rangeCard.type !== sourceCard.type) {
                // エレミアの保護効果をチェック
                if (!isProtectedFromDebuff(board, pos, rangeCard)) {
                  weakenedEnemies++;
                }
              }
            });
            effectBonus += weakenedEnemies * (ifritBossEffect.secondaryEffect?.powerPerWeakened || 0);
          }
          break;

        default:
          break;
      }
    }
  }


  return effectBonus;
}


// 後方互換性のため、新しい関数を古い名前でラップ
function getWeaponEnhancementMultiplier(board: Board, weaponPosition: Coordinate): number {
  return detectWeaponEnhancements(board, weaponPosition).multiplier;
}

function getWeaponEnhancementDetails(board: Board, weaponPosition: Coordinate): Array<{source: string, multiplier: number}> {
  return detectWeaponEnhancements(board, weaponPosition).sources.map(enhancement => ({
    source: enhancement.source,
    multiplier: enhancement.multiplier
  }));
}

function getSupportEnhancementMultiplier(board: Board, supportPosition: Coordinate): number {
  return detectSupportEnhancements(board, supportPosition).multiplier;
}


// 効果の説明を生成
export function getEffectPreview(card: Card, position: Coordinate, board: (Card | null)[][]): string {
  if (!card.effect) return '';

  switch (card.effect.type) {
    case 'UNIT_VERTICAL_ENEMY_DEBUFF':
      return `縦方向の相手ユニットを${card.effect.power}弱体化`;
    
    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
      const adjacentAllies = getAdjacentAllies(board, position, card.type);
      const bonus = (card.effect.power || 0) * adjacentAllies;
      return `隣接同チームユニット${adjacentAllies}体により自身が${bonus}強化`;
    
    case 'ADJACENT_UNIT_BUFF':
      return `隣接する同チームユニットを${card.effect.power}強化`;
    
    case 'DIAGONAL_DEBUFF':
      return `斜め方向の相手ユニットを${card.effect.power}弱体化`;
    
    case 'FIELD_UNIT_BUFF':
      const fieldBuffEffect = card.effect as any;
      return `範囲${fieldBuffEffect.range}で同チームユニットを${fieldBuffEffect.power}強化`;
    
    case 'FIELD_UNIT_DEBUFF':
      const fieldDebuffEffect = card.effect as any;
      return `範囲${fieldDebuffEffect.range}で相手ユニットを${fieldDebuffEffect.power}弱体化`;
    
    case 'VERTICAL_BOOST':
      const verticalEffect = card.effect as any;
      const verticalMultiplier = getWeaponEnhancementMultiplier(board, position);
      const verticalPower = Math.floor((verticalEffect.power || 0) * verticalMultiplier);
      const verticalEnhancements = getWeaponEnhancementDetails(board, position);
      
      if (verticalEnhancements.length > 0) {
        const enhancementText = verticalEnhancements.map(e => `${e.source}:${e.multiplier}倍`).join('、');
        return `上下にいる${verticalEffect.targetClass}ユニットを${verticalPower}強化（${enhancementText}、合計${verticalMultiplier}倍）`;
      }
      return `上下にいる${verticalEffect.targetClass}ユニットを${verticalPower}強化`;
    
    case 'HORIZONTAL_BOOST':
      const horizontalEffect = card.effect as any;
      const horizontalMultiplier = getWeaponEnhancementMultiplier(board, position);
      const horizontalPower = Math.floor((horizontalEffect.power || 0) * horizontalMultiplier);
      const horizontalEnhancements = getWeaponEnhancementDetails(board, position);
      
      if (horizontalEnhancements.length > 0) {
        const enhancementText = horizontalEnhancements.map(e => `${e.source}:${e.multiplier}倍`).join('、');
        return `左右にいる${horizontalEffect.targetClass}ユニットを${horizontalPower}強化（${enhancementText}、合計${horizontalMultiplier}倍）`;
      }
      return `左右にいる${horizontalEffect.targetClass}ユニットを${horizontalPower}強化`;
    
    case 'DIAGONAL_BOOST':
      const diagonalEffect = card.effect as any;
      const diagonalMultiplier = getWeaponEnhancementMultiplier(board, position);
      const diagonalPower = Math.floor((diagonalEffect.power || 0) * diagonalMultiplier);
      const diagonalEnhancements = getWeaponEnhancementDetails(board, position);
      
      if (diagonalEnhancements.length > 0) {
        const enhancementText = diagonalEnhancements.map(e => `${e.source}:${e.multiplier}倍`).join('、');
        return `斜めにいる${diagonalEffect.targetClass}ユニットを${diagonalPower}強化（${enhancementText}、合計${diagonalMultiplier}倍）`;
      }
      return `斜めにいる${diagonalEffect.targetClass}ユニットを${diagonalPower}強化`;
    
    case 'CROSS_FORMATION':
      const crossEffect = card.effect as any;
      const crossMultiplier = getWeaponEnhancementMultiplier(board, position);
      const crossPower = Math.floor((crossEffect.power || 0) * crossMultiplier);
      const crossEnhancements = getWeaponEnhancementDetails(board, position);
      
      if (crossEnhancements.length > 0) {
        const enhancementText = crossEnhancements.map(e => `${e.source}:${e.multiplier}倍`).join('、');
        return `隣接する${crossEffect.targetClass}ユニットを${crossPower}強化（${enhancementText}、合計${crossMultiplier}倍）`;
      }
      return `隣接する${crossEffect.targetClass}ユニットを${crossPower}強化`;
    
    case 'FIELD_DUAL_EFFECT':
      const dualEffect = card.effect as any;
      return `範囲${dualEffect.range}で同チームユニットを${dualEffect.allyBonus}強化、相手ユニットを${Math.abs(dualEffect.enemyPenalty)}弱体化`;
    
    case 'WEAPON_ENHANCEMENT':
      const weaponEnhanceEffect = card.effect as any;
      const supportMultiplier = getSupportEnhancementMultiplier(board, position);
      const actualMultiplier = (weaponEnhanceEffect.effectMultiplier || 1) * supportMultiplier;
      if (supportMultiplier > 1) {
        // 各強化源の詳細を取得
        const enhancementSources = [];
        const adjacentPositions = filterValidPositions(getAdjacentPositions(position), board.length);
        adjacentPositions.forEach((pos) => {
          const adjacentCard = board[pos.row][pos.col];
          if (adjacentCard && 
              adjacentCard.effect && 
              adjacentCard.effect.type === 'LEGENDARY_EMILIA' &&
              adjacentCard.category === 'unit') {
            const emiliaEffect = adjacentCard.effect as any;
            enhancementSources.push(`${adjacentCard.name}:${emiliaEffect.supportMultiplier}倍`);
          }
        });
        // ネクロの効果もチェック
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            const checkCard = board[row][col];
            if (checkCard && 
                checkCard.effect && 
                checkCard.effect.type === 'LEGENDARY_NECRO' &&
                checkCard.category === 'unit') {
              const necroEffect = checkCard.effect as any;
              const range = necroEffect.range || 2;
              const rangePositions = getDiamondRange({ row, col }, range, board.length);
              const isInRange = rangePositions.some(rangePos => 
                rangePos.row === position.row && rangePos.col === position.col
              );
              if (isInRange) {
                enhancementSources.push(`${checkCard.name}:${necroEffect.supportMultiplier}倍`);
              }
            }
          }
        }
        const enhancementText = enhancementSources.join('、');
        return `隣接する武器カードの効果を${actualMultiplier}倍に増幅（${enhancementText}、合計${supportMultiplier}倍）`;
      }
      return `隣接する武器カードの効果を${actualMultiplier}倍に増幅`;
    
    case 'ROW_COLUMN_BUFF':
      const rowColEffect = card.effect as any;
      const direction = rowColEffect.targetDirection === 'vertical' ? '縦方向' : '横方向';
      const rowColSupportMultiplier = getSupportEnhancementMultiplier(board, position);
      const enhancedPower = Math.floor((rowColEffect.power || 0) * rowColSupportMultiplier);
      
      if (rowColSupportMultiplier > 1) {
        // 各強化源の詳細を取得
        const enhancementSources = [];
        const adjacentPositions = filterValidPositions(getAdjacentPositions(position), board.length);
        adjacentPositions.forEach((pos) => {
          const adjacentCard = board[pos.row][pos.col];
          if (adjacentCard && 
              adjacentCard.effect && 
              adjacentCard.effect.type === 'LEGENDARY_EMILIA' &&
              adjacentCard.category === 'unit') {
            const emiliaEffect = adjacentCard.effect as any;
            enhancementSources.push(`${adjacentCard.name}:${emiliaEffect.supportMultiplier}倍`);
          }
        });
        // ネクロの効果もチェック
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            const checkCard = board[row][col];
            if (checkCard && 
                checkCard.effect && 
                checkCard.effect.type === 'LEGENDARY_NECRO' &&
                checkCard.category === 'unit') {
              const necroEffect = checkCard.effect as any;
              const range = necroEffect.range || 2;
              const rangePositions = getDiamondRange({ row, col }, range, board.length);
              const isInRange = rangePositions.some(rangePos => 
                rangePos.row === position.row && rangePos.col === position.col
              );
              if (isInRange) {
                enhancementSources.push(`${checkCard.name}:${necroEffect.supportMultiplier}倍`);
              }
            }
          }
        }
        const enhancementText = enhancementSources.join('、');
        return `${direction}の同チームユニットを${enhancedPower}強化（${enhancementText}、合計${rowColSupportMultiplier}倍）`;
      }
      return `${direction}の同チームユニットを${enhancedPower}強化`;
    
    case 'LEADER_ARCHER_DEBUFF':
      const archerEffect = card.effect as any;
      const hasWeapon = checkDiagonalWeapon(board, position, card.type);
      const archerPenalty = hasWeapon 
        ? Math.abs(archerEffect.weaponPenalty || 0)
        : Math.abs(archerEffect.basePenalty || 0);
      return hasWeapon 
        ? `斜め方向の相手ユニットを${archerPenalty}弱体化（武器装備時）`
        : `斜め方向の相手ユニットを${archerPenalty}弱体化`;
    
    case 'LEADER_GUARDIAN_BOOST':
      const guardianEffect = card.effect as any;
      const guardianAllies = getAdjacentAllies(board, position, card.type);
      const guardianSelfBonus = (guardianEffect.selfBoostPerAlly || 0) * guardianAllies;
      return `隣接する同チームユニットを${guardianEffect.allyBonus}強化、隣接同チーム${guardianAllies}体により自身が${guardianSelfBonus}強化`;
    
    case 'LEADER_LANCER_BOOST':
      const lancerEffect = card.effect as any;
      const horizontalEnemies = getHorizontalEnemies(board, position, card.type);
      const lancerSelfBonus = (lancerEffect.selfBoostPerEnemy || 0) * horizontalEnemies;
      return `横方向の相手${horizontalEnemies}体により自身が${lancerSelfBonus}強化`;
    
    case 'LEADER_MAGE_EFFECT':
      const mageLeaderEffect = card.effect as any;
      const mageSupportMultiplier = getSupportEnhancementMultiplier(board, position);
      const enhancedSupportBonus = Math.floor((mageLeaderEffect.supportBonus || 0) * mageSupportMultiplier);
      
      if (mageSupportMultiplier > 1) {
        // 各強化源の詳細を取得
        const enhancementSources = [];
        const adjacentPositions = filterValidPositions(getAdjacentPositions(position), board.length);
        adjacentPositions.forEach((pos) => {
          const adjacentCard = board[pos.row][pos.col];
          if (adjacentCard && 
              adjacentCard.effect && 
              adjacentCard.effect.type === 'LEGENDARY_EMILIA' &&
              adjacentCard.category === 'unit') {
            const emiliaEffect = adjacentCard.effect as any;
            enhancementSources.push(`${adjacentCard.name}:${emiliaEffect.supportMultiplier}倍`);
          }
        });
        // ネクロの効果もチェック
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            const checkCard = board[row][col];
            if (checkCard && 
                checkCard.effect && 
                checkCard.effect.type === 'LEGENDARY_NECRO' &&
                checkCard.category === 'unit') {
              const necroEffect = checkCard.effect as any;
              const range = necroEffect.range || 2;
              const rangePositions = getDiamondRange({ row, col }, range, board.length);
              const isInRange = rangePositions.some(rangePos => 
                rangePos.row === position.row && rangePos.col === position.col
              );
              if (isInRange) {
                enhancementSources.push(`${checkCard.name}:${necroEffect.supportMultiplier}倍`);
              }
            }
          }
        }
        const enhancementText = enhancementSources.join('、');
        return `範囲${mageLeaderEffect.range}で同チームユニットを${mageLeaderEffect.allyBonus}強化、相手ユニットを${Math.abs(mageLeaderEffect.enemyPenalty)}弱体化、サポートを${enhancedSupportBonus}強化（${enhancementText}、合計${mageSupportMultiplier}倍）`;
      }
      return `範囲${mageLeaderEffect.range}で同チームユニットを${mageLeaderEffect.allyBonus}強化、相手ユニットを${Math.abs(mageLeaderEffect.enemyPenalty)}弱体化、サポートを${enhancedSupportBonus}強化`;
    
    case 'LEGENDARY_DRAGON_KNIGHT':
      const dragonEffect = card.effect as any;
      return `隣接する同チームを${dragonEffect.crossEffect?.allyBonus || 0}強化、範囲${dragonEffect.range}内の同チームを${dragonEffect.fieldEffect?.allyBonus || 0}強化・相手を${Math.abs(dragonEffect.fieldEffect?.enemyPenalty || 0)}弱体化、武器効果を${dragonEffect.weaponEffect?.effectMultiplier || 1}倍に増幅`;
    
    case 'LEGENDARY_SAGE':
      const sageEffect = card.effect as any;
      return `範囲${sageEffect.range}内の同チームユニットを${sageEffect.fieldEffect?.allyBonus || 0}強化、隣接する同チームのマイナス効果を無効化、相手を${Math.abs(sageEffect.fieldEffect?.enemyPenalty || 0)}弱体化`;
    
    case 'LEGENDARY_DUAL_SWORDSMAN':
      const dualSwordsmanEffect = card.effect as any;
      return `縦方向の相手ユニットを${dualSwordsmanEffect.primaryEffect?.power || 0}弱体化`;
    
    case 'LEGENDARY_CHAOS_DRAGON':
      const chaosEffect = card.effect as any;
      return `隣接する同チームを${chaosEffect.crossEffect?.allyBonus || 0}強化、範囲${chaosEffect.range}内の同チームを${chaosEffect.fieldEffect?.allyBonus || 0}強化・相手を${Math.abs(chaosEffect.fieldEffect?.enemyPenalty || 0)}弱体化、武器効果を${chaosEffect.weaponEffect?.effectMultiplier || 1}倍に増幅`;
    
    case 'LEGENDARY_ARCHMAGE':
      const archmageEffect = card.effect as any;
      return `範囲${archmageEffect.range}内の同チームを${archmageEffect.fieldEffect?.allyBonus || 0}強化・相手を${Math.abs(archmageEffect.fieldEffect?.enemyPenalty || 0)}弱体化、武器効果を${archmageEffect.weaponEffect?.effectMultiplier || 1}倍に増幅`;
    
    case 'LEGENDARY_DEMON_EMPEROR':
      const demonEffect = card.effect as any;
      const rangePositions = getDiamondRange(position, demonEffect.range || 2, board.length);
      let debuffedEnemies = 0;
      rangePositions.forEach(pos => {
        const rangeCard = board[pos.row][pos.col];
        if (rangeCard && rangeCard.category === 'unit' && rangeCard.type !== card.type) {
          debuffedEnemies++;
        }
      });
      const selfBonus = (demonEffect.selfEffect?.powerPerEnemy || 0) * debuffedEnemies;
      return `隣接する同チームを${demonEffect.crossEffect?.allyBonus || 0}強化、範囲${demonEffect.range}内の相手を${Math.abs(demonEffect.fieldEffect?.enemyPenalty || 0)}弱体化、弱体化した相手${debuffedEnemies}体により自身が${selfBonus}強化`;
    
    // 新しい伝説効果
    case 'LEGENDARY_ARTHUR':
      const arthurEffect = card.effect as any;
      return `隣接する同チームユニットを${arthurEffect.power}強化、隣接する武器効果を${arthurEffect.weaponMultiplier}倍に増幅`;
    
    case 'LEGENDARY_EMILIA':
      const emiliaEffect = card.effect as any;
      return `隣接する同チームユニットの弱体化効果を無効化、隣接するサポートカードの効果を${emiliaEffect.supportMultiplier}倍に増幅`;
    
    case 'LEGENDARY_DUAL_SWORDSMAN':
      const dualSwordsmanNewEffect = card.effect as any;
      return `縦方向に隣接する相手ユニットを${dualSwordsmanNewEffect.power}弱体化`;
    
    case 'LEGENDARY_VARGA':
      const vargaEffect = card.effect as any;
      return `隣接する相手ユニットを${vargaEffect.power}弱体化`;
    
    case 'LEGENDARY_NECRO':
      const necroEffect = card.effect as any;
      return `範囲${necroEffect.range}マス内の武器カード効果を${necroEffect.weaponMultiplier}倍、サポートカード効果を${necroEffect.supportMultiplier}倍に増幅`;
    
    case 'LEGENDARY_ZARON':
      const zaronEffect = card.effect as any;
      return `縦列全体の相手ユニットを${zaronEffect.power}弱体化`;
    
    case 'BOSS_IFRIT':
      const ifritEffect = card.effect as any;
      const ifritRangePositions = getDiamondRange(position, ifritEffect.primaryEffect?.range || 2, board.length);
      let weakenedEnemies = 0;
      ifritRangePositions.forEach(pos => {
        const rangeCard = board[pos.row][pos.col];
        if (rangeCard && rangeCard.category === 'unit' && rangeCard.type !== card.type) {
          // エレミアの保護効果をチェック
          if (!isProtectedFromDebuff(board, pos, rangeCard)) {
            weakenedEnemies++;
          }
        }
      });
      const ifritSelfBonus = (ifritEffect.secondaryEffect?.powerPerWeakened || 0) * weakenedEnemies;
      return `【炎神の怒り】範囲${ifritEffect.primaryEffect?.range}内の相手を${Math.abs(ifritEffect.primaryEffect?.enemyPenalty || 0)}弱体化、弱体化した相手${weakenedEnemies}体により自身が${ifritSelfBonus}強化`;
    
    default:
      return '';
  }
}

// 効果タイプを色分けする
export function getEffectColor(effectType: string): string {
  switch (effectType) {
    case 'UNIT_VERTICAL_ENEMY_DEBUFF':
    case 'DIAGONAL_DEBUFF':
    case 'FIELD_UNIT_DEBUFF':
      return 'border-red-400 bg-red-500/20'; // 相手への攻撃効果
    
    case 'ADJACENT_UNIT_BUFF':
    case 'FIELD_UNIT_BUFF':
    case 'VERTICAL_BOOST':
    case 'HORIZONTAL_BOOST':
    case 'DIAGONAL_BOOST':
    case 'CROSS_FORMATION':
    case 'WEAPON_ENHANCEMENT':
    case 'ROW_COLUMN_BUFF':
      return 'border-blue-400 bg-blue-500/20'; // 同チームへの強化効果
    
    case 'FIELD_DUAL_EFFECT':
      return 'border-yellow-400 bg-yellow-500/20'; // 双方向効果
    
    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
    case 'LEADER_GUARDIAN_BOOST':
    case 'LEADER_LANCER_BOOST':
      return 'border-green-400 bg-green-500/20'; // 自己強化効果
    
    case 'LEADER_ARCHER_DEBUFF':
      return 'border-red-400 bg-red-500/20'; // 相手への攻撃効果
    
    case 'LEADER_MAGE_EFFECT':
      return 'border-yellow-400 bg-yellow-500/20'; // 双方向効果
    
    case 'LEGENDARY_DRAGON_KNIGHT':
    case 'LEGENDARY_SAGE':
    case 'LEGENDARY_CHAOS_DRAGON':
    case 'LEGENDARY_ARCHMAGE':
    case 'LEGENDARY_DEMON_EMPEROR':
    case 'LEGENDARY_ARTHUR':
    case 'LEGENDARY_EMILIA':
    case 'LEGENDARY_NECRO':
      return 'border-amber-400 bg-amber-500/20'; // 伝説効果
    
    case 'LEGENDARY_DUAL_SWORDSMAN':
    case 'LEGENDARY_VARGA':
    case 'LEGENDARY_ZARON':
      return 'border-red-400 bg-red-500/20'; // 相手への攻撃効果
    
    case 'BOSS_IFRIT':
      return 'border-orange-400 bg-orange-500/20'; // ボス効果（炎）
    
    default:
      return 'border-purple-400 bg-purple-500/20'; // その他の効果
  }
}

// カードが受けている全ての効果を分析
export function getAppliedEffects(
  board: (Card | null)[][],
  targetPosition: Coordinate,
  targetCard: Card | null
): Array<{ sourceCard: Card; sourcePosition: Coordinate; effectType: string; value: number; description: string }> {
  if (!targetCard) return [];

  // フィールドカードは他のカードの効果を受けない
  if (targetCard.category === 'field') return [];

  const appliedEffects: Array<{ sourceCard: Card; sourcePosition: Coordinate; effectType: string; value: number; description: string }> = [];
  const boardSize = board.length;
  
  // 武器カードは基本的に効果を受けないが、武器強化効果は受ける
  const isWeapon = targetCard.category === 'weapon';
  
  // 武器カードの場合、武器強化効果のみを表示
  if (isWeapon) {
    const weaponEnhancements = getWeaponEnhancementDetails(board, targetPosition);
    weaponEnhancements.forEach(enhancement => {
      // 強化源を探す
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          const sourceCard = board[row][col];
          if (sourceCard && sourceCard.name === enhancement.source) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'enhancement',
              value: enhancement.multiplier,
              description: `${sourceCard.name}により武器効果が${enhancement.multiplier}倍に増幅`
            });
            break;
          }
        }
      }
    });
    return appliedEffects;
  }

  // サポートカードの場合、サポート強化効果を表示
  const isSupport = targetCard.category === 'support';
  if (isSupport) {
    const supportMultiplier = getSupportEnhancementMultiplier(board, targetPosition);
    if (supportMultiplier > 1) {
      // エレミアの隣接効果をチェック（同チームのみ）
      const adjacentPositions = filterValidPositions(getAdjacentPositions(targetPosition), board.length);
      adjacentPositions.forEach((pos) => {
        const adjacentCard = board[pos.row][pos.col];
        if (adjacentCard && 
            adjacentCard.effect && 
            adjacentCard.effect.type === 'LEGENDARY_EMILIA' &&
            adjacentCard.category === 'unit' &&
            adjacentCard.type === targetCard.type) { // 同チームチェック追加
          const emiliaEffect = adjacentCard.effect as any;
          appliedEffects.push({
            sourceCard: adjacentCard,
            sourcePosition: pos,
            effectType: 'enhancement',
            value: emiliaEffect.supportMultiplier || 1,
            description: `${adjacentCard.name}によりサポート効果が${emiliaEffect.supportMultiplier}倍に増幅`
          });
        }
      });

      // ネクロの範囲効果もチェック（同チームのみ）
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          const card = board[row][col];
          if (card && 
              card.effect && 
              card.effect.type === 'LEGENDARY_NECRO' &&
              card.category === 'unit' &&
              card.type === targetCard.type) { // 同チームチェック追加
            const necroEffect = card.effect as any;
            const range = necroEffect.range || 2;
            const rangePositions = getDiamondRange({ row, col }, range, board.length);
            const isInRange = rangePositions.some(rangePos => 
              rangePos.row === targetPosition.row && rangePos.col === targetPosition.col
            );
            if (isInRange) {
              appliedEffects.push({
                sourceCard: card,
                sourcePosition: { row, col },
                effectType: 'enhancement',
                value: necroEffect.supportMultiplier || 1,
                description: `${card.name}によりサポート効果が${necroEffect.supportMultiplier}倍に増幅`
              });
            }
          }
        }
      }
    }
    // サポートカードもLEADER_MAGE_EFFECTなどの一般的な効果をチェックするため、early returnを削除
    // return appliedEffects;
  }

  // エレミアの弱体化防止効果をチェック（ユニットカードのみ）
  if (targetCard.category === 'unit' && targetCard.type === 'ally') {
    if (isProtectedFromDebuff(board, targetPosition, targetCard)) {
      // エレミアを探して表示
      const adjacentPositions = filterValidPositions(getAdjacentPositions(targetPosition), board.length);
      adjacentPositions.forEach((pos) => {
        const adjacentCard = board[pos.row][pos.col];
        if (adjacentCard && 
            adjacentCard.effect && 
            (adjacentCard.effect.type === 'LEGENDARY_EMILIA' || adjacentCard.effect.type === 'LEGENDARY_SAGE') &&
            adjacentCard.category === 'unit' &&
            adjacentCard.type === 'ally') {
          appliedEffects.push({
            sourceCard: adjacentCard,
            sourcePosition: pos,
            effectType: 'protection',
            value: 0,
            description: `${adjacentCard.name}により弱体化効果無効`
          });
        }
      });
    }
  }

  // ボード上の全カードの効果を確認
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const sourceCard = board[row][col];
      if (!sourceCard || !sourceCard.effect) continue;

      // 自己強化効果は特別処理
      if (sourceCard.effect.type === 'SELF_POWER_UP_BY_ADJACENT_ALLY') {
        // 自分自身の場合のみ適用
        if (row === targetPosition.row && col === targetPosition.col) {
          const adjacentAllies = getAdjacentAllies(board, { row, col }, sourceCard.type);
          if (adjacentAllies > 0) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: (sourceCard.effect.power || 0) * adjacentAllies,
              description: `隣接同チーム${adjacentAllies}体により${(sourceCard.effect.power || 0) * adjacentAllies}強化`
            });
          }
        }
        continue; // 他の処理をスキップ
      }

      // リーダーの自己強化効果も特別処理
      if (sourceCard.effect.type === 'LEADER_GUARDIAN_BOOST') {
        // 自分自身の場合のみ適用（隣接同チームによる自己強化）
        if (row === targetPosition.row && col === targetPosition.col) {
          const leaderEffect = sourceCard.effect as any;
          const adjacentAllies = getAdjacentAllies(board, { row, col }, sourceCard.type);
          if (adjacentAllies > 0) {
            const selfBonus = (leaderEffect.selfBoostPerAlly || 0) * adjacentAllies;
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: selfBonus,
              description: `隣接同チーム${adjacentAllies}体により自身が${selfBonus}強化`
            });
          }
        }
        // 範囲効果は別途処理されるので、ここではcontinueしない
      }

      if (sourceCard.effect.type === 'LEADER_LANCER_BOOST') {
        // 自分自身の場合のみ適用（横方向の相手による自己強化）
        if (row === targetPosition.row && col === targetPosition.col) {
          const leaderEffect = sourceCard.effect as any;
          const horizontalEnemies = getHorizontalEnemies(board, { row, col }, sourceCard.type);
          if (horizontalEnemies > 0) {
            const selfBonus = (leaderEffect.selfBoostPerEnemy || 0) * horizontalEnemies;
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: selfBonus,
              description: `横方向の相手${horizontalEnemies}体により自身が${selfBonus}強化`
            });
          }
        }
        continue; // ランサーは自己強化のみ
      }

      // 伝説カードの自己強化効果
      if (sourceCard.effect.type === 'LEGENDARY_DEMON_EMPEROR') {
        if (row === targetPosition.row && col === targetPosition.col) {
          const demonEffect = sourceCard.effect as any;
          const range = demonEffect.range || 2;
          const rangePositions = getDiamondRange({ row, col }, range, board.length);
          
          let debuffedEnemies = 0;
          rangePositions.forEach(pos => {
            const rangeCard = board[pos.row][pos.col];
            if (rangeCard && rangeCard.category === 'unit' && rangeCard.type !== sourceCard.type) {
              debuffedEnemies++;
            }
          });
          
          if (debuffedEnemies > 0) {
            const selfBonus = (demonEffect.selfEffect?.powerPerEnemy || 0) * debuffedEnemies;
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: selfBonus,
              description: `弱体化した相手${debuffedEnemies}体により自身が${selfBonus}強化`
            });
          }
        }
        // 範囲効果は別途処理されるので、ここではcontinueしない
      }

      // イフリートの自己強化効果
      if (sourceCard.effect.type === 'BOSS_IFRIT') {
        if (row === targetPosition.row && col === targetPosition.col) {
          const ifritEffect = sourceCard.effect as any;
          const range = ifritEffect.primaryEffect?.range || 2;
          const rangePositions = getDiamondRange({ row, col }, range, board.length);
          
          let weakenedEnemies = 0;
          rangePositions.forEach(pos => {
            const rangeCard = board[pos.row][pos.col];
            if (rangeCard && rangeCard.category === 'unit' && rangeCard.type !== sourceCard.type) {
              // エレミアの保護効果をチェック
              if (!isProtectedFromDebuff(board, pos, rangeCard)) {
                weakenedEnemies++;
              }
            }
          });
          
          if (weakenedEnemies > 0) {
            const selfBonus = (ifritEffect.secondaryEffect?.powerPerWeakened || 0) * weakenedEnemies;
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: selfBonus,
              description: `弱体化した相手${weakenedEnemies}体により自身が${selfBonus}強化`
            });
          }
        }
        // 範囲効果は別途処理されるので、ここではcontinueしない
      }

      // その他の効果は範囲チェック
      const effectRange = getEffectRange(sourceCard, { row, col }, boardSize);
      
      // ターゲット位置が効果範囲内かチェック
      const isInRange = effectRange.some(
        pos => pos.row === targetPosition.row && pos.col === targetPosition.col
      );

      if (!isInRange) continue;

      // カテゴリ別の効果フィルタリング
      if (isSupport) {
        const allowedSupportEffects = ['LEADER_MAGE_EFFECT'];
        if (!allowedSupportEffects.includes(sourceCard.effect.type)) {
          continue;
        }
      }

      if (isWeapon) {
        // 武器カードは武器強化効果のみ受ける（範囲チェック前に処理済み）
        continue;
      }

      // 効果を分析
      switch (sourceCard.effect.type) {
        case 'UNIT_VERTICAL_ENEMY_DEBUFF':
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'debuff',
                value: sourceCard.effect.power || 0,
                description: `${sourceCard.name}の縦方向攻撃により${Math.abs(sourceCard.effect.power || 0)}弱体化`
              });
            }
          }
          break;

        case 'ADJACENT_UNIT_BUFF':
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: sourceCard.effect.power || 0,
              description: `${sourceCard.name}の隣接強化により${sourceCard.effect.power || 0}強化`
            });
          }
          break;

        case 'DIAGONAL_DEBUFF':
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'debuff',
                value: sourceCard.effect.power || 0,
                description: `${sourceCard.name}の斜め攻撃により${Math.abs(sourceCard.effect.power || 0)}弱体化`
              });
            }
          }
          break;

        case 'FIELD_UNIT_BUFF':
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            const fieldEffect = sourceCard.effect as any;
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: fieldEffect.power || 0,
              description: `${sourceCard.name}のフィールド効果により${fieldEffect.power || 0}強化`
            });
          }
          break;

        case 'FIELD_UNIT_DEBUFF':
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            // エレミアの保護効果をチェック
            if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
              const fieldEffect = sourceCard.effect as any;
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'debuff',
                value: fieldEffect.power || 0,
                description: `${sourceCard.name}のフィールド効果により${fieldEffect.power || 0}弱体化`
              });
            }
          }
          break;

        case 'VERTICAL_BOOST':
        case 'HORIZONTAL_BOOST':
        case 'DIAGONAL_BOOST':
        case 'CROSS_FORMATION':
          const weaponEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && targetCard.class === weaponEffect.targetClass && sourceCard.type === targetCard.type) {
            let weaponPower = weaponEffect.power || 0;
            const weaponMultiplier = getWeaponEnhancementMultiplier(board, { row, col });
            
            if (weaponMultiplier > 1) {
              const enhancedPower = Math.floor(weaponPower * weaponMultiplier);
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'buff',
                value: enhancedPower,
                description: `${sourceCard.name}の武器効果により${enhancedPower}強化（武器強化${weaponMultiplier}倍）`
              });
            } else {
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'buff',
                value: weaponPower,
                description: `${sourceCard.name}の武器効果により${weaponPower}強化`
              });
            }
          }
          break;

        case 'WEAPON_ENHANCEMENT':
          // 武器強化効果は武器の効果を倍率で増幅するため、直接の効果適用はしない
          // 武器効果の計算時に倍率として適用される
          break;

        case 'FIELD_DUAL_EFFECT':
          if (targetCard.category === 'unit') {
            const dualEffect = sourceCard.effect as any;
            if (sourceCard.type === targetCard.type) {
              // 同チームなら強化
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'buff',
                value: dualEffect.allyBonus || 0,
                description: `${sourceCard.name}のフィールド効果により${dualEffect.allyBonus || 0}強化`
              });
            } else {
              // 相手なら弱体化
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'debuff',
                value: Math.abs(dualEffect.enemyPenalty || 0),
                description: `${sourceCard.name}のフィールド効果により${Math.abs(dualEffect.enemyPenalty || 0)}弱体化`
              });
            }
          }
          break;

        case 'ROW_COLUMN_BUFF':
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            const rowColEffect = sourceCard.effect as any;
            const direction = rowColEffect.targetDirection === 'vertical' ? '縦方向' : '横方向';
            // サポートカード強化の倍率を適用
            const supportMultiplier = getSupportEnhancementMultiplier(board, { row, col });
            const enhancedPower = Math.floor((rowColEffect.power || 0) * supportMultiplier);
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: enhancedPower,
              description: `${sourceCard.name}の${direction}強化により${enhancedPower}強化${supportMultiplier > 1 ? `（サポート強化${supportMultiplier}倍）` : ''}`
            });
          }
          break;

        case 'LEADER_ARCHER_DEBUFF':
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            const leaderEffect = sourceCard.effect as any;
            const hasAdjacentWeapon = checkAdjacentWeapon(board, { row, col }, sourceCard.type);
            const penalty = hasAdjacentWeapon 
              ? (leaderEffect.weaponPenalty || 0)
              : (leaderEffect.basePenalty || 0);
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'debuff',
              value: Math.abs(penalty),
              description: `${sourceCard.name}の斜め攻撃により${Math.abs(penalty)}弱体化${hasAdjacentWeapon ? '（武器装備時）' : ''}`
            });
          }
          break;

        case 'LEADER_GUARDIAN_BOOST':
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            const leaderEffect = sourceCard.effect as any;
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: leaderEffect.allyBonus || 0,
              description: `${sourceCard.name}の隣接強化により${leaderEffect.allyBonus || 0}強化`
            });
          }
          break;

        case 'LEADER_MAGE_EFFECT':
          const mageEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit') {
            if (sourceCard.type === targetCard.type) {
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'buff',
                value: mageEffect.allyBonus || 0,
                description: `${sourceCard.name}の範囲効果により${mageEffect.allyBonus || 0}強化`
              });
            } else {
              // エレミアの保護効果をチェック
              if (!isProtectedFromDebuff(board, targetPosition, targetCard)) {
                appliedEffects.push({
                  sourceCard,
                  sourcePosition: { row, col },
                  effectType: 'debuff',
                  value: Math.abs(mageEffect.enemyPenalty || 0),
                  description: `${sourceCard.name}の範囲効果により${Math.abs(mageEffect.enemyPenalty || 0)}弱体化`
                });
              }
            }
          } else if (targetCard.category === 'support' && sourceCard.type === targetCard.type) {
            // サポートカード強化の倍率を適用
            const supportMultiplier = getSupportEnhancementMultiplier(board, targetPosition);
            const enhancedBonus = Math.floor((mageEffect.supportBonus || 0) * supportMultiplier);
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: enhancedBonus,
              description: `${sourceCard.name}の範囲効果により${enhancedBonus}強化`
            });
          }
          break;

        case 'LEGENDARY_DRAGON_KNIGHT':
        case 'LEGENDARY_CHAOS_DRAGON':
        case 'LEGENDARY_DEMON_EMPEROR':
          // 複合効果の伝説カード
          const legendaryEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit') {
            if (sourceCard.type === targetCard.type) {
              // 隣接効果
              const isAdjacent = getAdjacentPositions({ row, col }).some(pos => 
                pos.row === targetPosition.row && pos.col === targetPosition.col
              );
              if (isAdjacent && legendaryEffect.crossEffect?.allyBonus) {
                appliedEffects.push({
                  sourceCard,
                  sourcePosition: { row, col },
                  effectType: 'buff',
                  value: legendaryEffect.crossEffect.allyBonus,
                  description: `${sourceCard.name}の隣接効果により${legendaryEffect.crossEffect.allyBonus}強化`
                });
              }
              // 範囲効果
              if (legendaryEffect.fieldEffect?.allyBonus) {
                appliedEffects.push({
                  sourceCard,
                  sourcePosition: { row, col },
                  effectType: 'buff',
                  value: legendaryEffect.fieldEffect.allyBonus,
                  description: `${sourceCard.name}の範囲効果により${legendaryEffect.fieldEffect.allyBonus}強化`
                });
              }
            } else {
              // 相手への効果
              if (legendaryEffect.fieldEffect?.enemyPenalty) {
                appliedEffects.push({
                  sourceCard,
                  sourcePosition: { row, col },
                  effectType: 'debuff',
                  value: Math.abs(legendaryEffect.fieldEffect.enemyPenalty),
                  description: `${sourceCard.name}の範囲効果により${Math.abs(legendaryEffect.fieldEffect.enemyPenalty)}弱体化`
                });
              }
            }
          }
          break;

        case 'LEGENDARY_SAGE':
        case 'LEGENDARY_ARCHMAGE':
          // 範囲効果の伝説カード
          const rangeEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit') {
            if (sourceCard.type === targetCard.type) {
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'buff',
                value: rangeEffect.fieldEffect?.allyBonus || 0,
                description: `${sourceCard.name}の範囲効果により${rangeEffect.fieldEffect?.allyBonus || 0}強化`
              });
            } else {
              appliedEffects.push({
                sourceCard,
                sourcePosition: { row, col },
                effectType: 'debuff',
                value: Math.abs(rangeEffect.fieldEffect?.enemyPenalty || 0),
                description: `${sourceCard.name}の範囲効果により${Math.abs(rangeEffect.fieldEffect?.enemyPenalty || 0)}弱体化`
              });
            }
          }
          break;

        case 'LEGENDARY_DUAL_SWORDSMAN':
          // 攻撃特化の伝説カード
          const dualSwordsmanAppliedEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'debuff',
              value: dualSwordsmanAppliedEffect.power || 0,
              description: `${sourceCard.name}の双剣攻撃により${dualSwordsmanAppliedEffect.power || 0}弱体化`
            });
          }
          break;

        case 'LEGENDARY_ARTHUR':
          // 聖騎士アーサ：隣接する同チームユニットを60強化、隣接する武器効果を2倍
          const arthurAppliedEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type === targetCard.type) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'buff',
              value: arthurAppliedEffect.power || 0,
              description: `${sourceCard.name}の隣接強化により${arthurAppliedEffect.power || 0}強化`
            });
          }
          // 武器カードへの強化効果は getWeaponEnhancementMultiplier で処理
          break;

        case 'LEGENDARY_EMILIA':
          // 大賢者エレミア：隣接する同チームユニットの弱体効果を無効、隣接するサポートカードの効果を3倍
          // 弱体化無効は isProtectedFromDebuff 関数で処理済み
          break;

        case 'LEGENDARY_VARGA':
          // 冥皇帝ヴァルガ：隣接する相手ユニットを160弱体化
          const vargaAppliedEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'debuff',
              value: vargaAppliedEffect.power || 0,
              description: `${sourceCard.name}の隣接攻撃により${vargaAppliedEffect.power || 0}弱体化`
            });
          }
          break;

        case 'LEGENDARY_NECRO':
          // 深淵術師ネクロ：範囲内の武器カードの効果3倍、サポートカード効果3倍
          // 武器・サポートカード効果の倍率処理は別途実装が必要
          break;

        case 'LEGENDARY_ZARON':
          // 暗黒戦士ザロン：縦列全体の相手ユニットを70弱体化
          const zaronAppliedEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'debuff',
              value: zaronAppliedEffect.power || 0,
              description: `${sourceCard.name}の縦列攻撃により${zaronAppliedEffect.power || 0}弱体化`
            });
          }
          break;

        case 'BOSS_IFRIT':
          // 炎神イフリートの効果
          const ifritAppliedEffect = sourceCard.effect as any;
          if (targetCard.category === 'unit' && sourceCard.type !== targetCard.type) {
            appliedEffects.push({
              sourceCard,
              sourcePosition: { row, col },
              effectType: 'debuff',
              value: Math.abs(ifritAppliedEffect.primaryEffect?.enemyPenalty || 0),
              description: `${sourceCard.name}の炎神の怒りにより${Math.abs(ifritAppliedEffect.primaryEffect?.enemyPenalty || 0)}弱体化`
            });
          }
          break;

        default:
          break;
      }
    }
  }

  return appliedEffects;
}