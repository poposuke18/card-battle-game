// src/components/card/CardDetails.tsx

import { memo, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlacedCard, Position } from '@/types';
import { getClassDisplayName, getClassIcon } from '@/utils/common';
import { 
  getEffectDetails, 
  getEffectStyle,
  calculateEffectValue,
  countHorizontalEnemies,  // 追加
  countAdjacentAllies      // 追加
} from '@/utils/effects/index';
import { EffectIcon, EffectDescription } from '../effects/EffectDisplay';

type CardDetailsProps = {
  card: PlacedCard;
  board: (PlacedCard | null)[][];
  position: Position;
  mousePosition?: { x: number; y: number; };
};

export function CardDetails({ 
  card, 
  board, 
  position,
  mousePosition 
}: CardDetailsProps) {
  // 状態の初期化をコンポーネントの先頭で行う
  const [detailsPosition, setDetailsPosition] = useState({ top: 0, left: 0 });
  
  const effectDetails = card.card.effect ? getEffectDetails(card.card) : null;
  const effectStyle = card.card.effect ? getEffectStyle(card.card.effect) : null;

  // 入力効果の収集
  const incomingEffects = useMemo(() => {
    const effects: Array<{
      sourceCard: PlacedCard;
      sourcePosition: Position;
      effectValue: number;
      effectType: string;
    }> = [];

    if (card.card.effect?.type === 'LEADER_GUARDIAN_BOOST') {
      const adjacentAllies = countAdjacentAllies(position, board, card.card.type);
      const selfBoost = (card.card.effect.selfBoostPerAlly || 0) * adjacentAllies;
      
      if (selfBoost > 0) {
        effects.push({
          sourceCard: card,
          sourcePosition: position,
          effectValue: selfBoost,
          effectType: 'SELF_BOOST',
          description: `隣接する味方${adjacentAllies}体による強化`
        });
      }
    }

    if (card.card.effect?.type === 'LEADER_LANCER_BOOST') {
      const horizontalEnemies = countHorizontalEnemies(position, board, card.card.type);
      const selfBoost = (card.card.effect.selfBoostPerEnemy || 0) * horizontalEnemies;
      
      if (selfBoost > 0) {
        effects.push({
          sourceCard: card,
          sourcePosition: position,
          effectValue: selfBoost,
          effectType: 'SELF_BOOST'
        });
      }
    }

    if (card.card.effect?.type === 'SELF_POWER_UP_BY_ADJACENT_ALLY') {
      let adjacentAllies = 0;
      const adjacentPositions = [
        { row: position.row - 1, col: position.col }, // 上
        { row: position.row + 1, col: position.col }, // 下
        { row: position.row, col: position.col - 1 }, // 左
        { row: position.row, col: position.col + 1 }, // 右
      ];

      adjacentPositions.forEach(pos => {
        if (pos.row >= 0 && pos.row < board.length &&
            pos.col >= 0 && pos.col < board[0].length) {
          const adjacentCard = board[pos.row][pos.col];
          if (adjacentCard && adjacentCard.card.type === card.card.type && adjacentCard.card.category === 'unit') {
            adjacentAllies++;
          }
        }
      });

      if (adjacentAllies > 0) {
        effects.push({
          sourceCard: card,
          sourcePosition: position,
          effectValue: adjacentAllies * (card.card.effect.power || 0)
        });
      }
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell || !cell.card.effect) return;
        if (rowIndex === position.row && colIndex === position.col) return;

        const value = calculateEffectValue({
          sourcePosition: { row: rowIndex, col: colIndex },
          targetPosition: position,
          sourceCard: cell.card,
          targetCard: card,
          board
        }, cell.card.effect);

        if (value !== 0) {
          effects.push({
            sourceCard: cell,
            sourcePosition: { row: rowIndex, col: colIndex },
            effectValue: value,
            effectType: cell.card.effect.type
          });
        }
      });
    });

    return effects;
  }, [board, position, card]);

  // 表示位置の計算と更新
  useEffect(() => {
    if (!mousePosition) return;

    const calculatePosition = () => {
      const padding = 20;
      const detailsWidth = 300; // 詳細ウィンドウの推定幅
      const detailsHeight = 400; // 詳細ウィンドウの推定高さ
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      let left = mousePosition.x + padding;
      let top = mousePosition.y + scrollY + padding;

      // 右端チェック
      if (left + detailsWidth > viewportWidth - padding) {
        left = mousePosition.x - detailsWidth - padding;
      }

      // 下端チェック
      if (top + detailsHeight > viewportHeight + scrollY - padding) {
        top = mousePosition.y + scrollY - detailsHeight - padding;
      }

      // 左端チェック
      if (left < padding) {
        left = padding;
      }

      // 上端チェック
      if (top < scrollY + padding) {
        top = scrollY + padding;
      }

      setDetailsPosition({ top, left });
    };

    calculatePosition();

    // ウィンドウリサイズ時にも位置を再計算
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [mousePosition]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed',
        top: detailsPosition.top,
        left: detailsPosition.left,
        zIndex: 50
      }}
      className="bg-gray-900/95 p-4 rounded-xl shadow-xl border border-gray-700 
                 text-gray-100 backdrop-blur-sm w-[300px] max-h-[90vh] overflow-y-auto"
    >
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
        <div>
          <div className="font-bold text-lg text-gray-200">
            {card.card.name}
          </div>
          {card.card.class && (
            <div className="text-sm text-gray-400 flex items-center gap-1">
              <span>{getClassIcon(card.card.class)}</span>
              <span>{getClassDisplayName(card.card.class)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl opacity-90">
            {card.card.category === 'unit' && card.card.class && getClassIcon(card.card.class)}
            {card.card.category === 'weapon' && '🗡️'}
            {card.card.category === 'field' && '🏰'}
            {card.card.category === 'support' && '📜'}
          </div>
          {card.card.effect && (
            <EffectIcon effect={card.card.effect} className="text-xl" />
          )}
        </div>
      </div>

      {/* カードタイプと効果 */}
      <div className="space-y-3">
        {/* カードタイプ */}
        <div className="flex items-center gap-2 text-sm">
          <span className={`px-2 py-1 rounded-full ${
            card.card.type === 'ally' 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {card.card.type === 'ally' ? '味方' : '敵'}
          </span>
          <span className="bg-gray-700/50 px-2 py-1 rounded-full text-gray-300">
            {card.card.category === 'unit' ? 'ユニット' :
             card.card.category === 'field' ? 'フィールド' :
             card.card.category === 'support' ? 'サポート' : '武器'}
          </span>
          {effectDetails && (
            <span className={`px-2 py-1 rounded-full`} style={{
              backgroundColor: `${effectStyle?.color}20`,
              color: effectStyle?.color
            }}>
              {effectDetails.effectType === 'weapon' ? '武器効果' :
               effectDetails.effectType === 'leader' ? 'リーダー効果' :
               effectDetails.effectType === 'field' ? 'フィールド効果' : '基本効果'}
            </span>
          )}
        </div>

        {/* 効果の説明 */}
        {card.card.effect && (
          <div className="bg-gray-800/50 rounded-lg p-3">
            <EffectDescription 
              effect={card.card.effect}
              className="text-sm"
            />
          </div>
        )}

          {/* 武器効果倍率（武器カードの場合のみ表示） */}
  {card.card.category === 'weapon' && (
    <div className="bg-yellow-500/10 rounded-lg p-3">
      <div className="text-sm font-semibold text-yellow-300 mb-2">武器効果倍率</div>
      {incomingEffects.some(effect => effect.sourceCard.card.effect?.type === 'WEAPON_ENHANCEMENT') ? (
        <div className="space-y-2">
          {incomingEffects
            .filter(effect => effect.sourceCard.card.effect?.type === 'WEAPON_ENHANCEMENT')
            .map((effect, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{effect.sourceCard.card.name}</span>
                  <span className="text-gray-500">
                    ({effect.sourcePosition.row + 1}, {effect.sourcePosition.col + 1})
                  </span>
                </div>
                <span className="text-yellow-300">
                  x{effect.sourceCard.card.effect?.effectMultiplier || 2}
                </span>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm">効果増幅なし</div>
      )}
    </div>
  )}

        {/* 受けている効果 */}
        {incomingEffects.length > 0 && (
  <div className="bg-gray-800/50 rounded-lg p-3">
    <div className="text-sm font-semibold mb-2">受けている効果:</div>
    <div className="space-y-2">
      {incomingEffects.map((effect, index) => {
        const style = effect.sourceCard.card.effect 
          ? getEffectStyle(effect.sourceCard.card.effect)
          : null;
          if (effect.effectType === 'SELF_BOOST') {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-70" />
                  <span>自己強化（横方向の敵による）</span>
                </div>
                <span className="text-green-400">+{effect.effectValue}</span>
              </motion.div>
            );
          }
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{
                        backgroundColor: style?.color,
                        opacity: style?.intensity
                      }} />
                      <span>{effect.sourceCard.card.name}</span>
                      <span className="text-gray-500">
                        ({effect.sourcePosition.row + 1}, {effect.sourcePosition.col + 1})
                      </span>
                    </div>
                    <span className={effect.effectValue > 0 ? 'text-green-400' : 'text-red-400'}>
                      {effect.effectValue > 0 ? '+' : ''}{effect.effectValue}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 基礎点と位置情報 */}
        <div className="flex justify-between items-center text-sm text-gray-400 pt-2 border-t border-gray-700">
          <div>基礎点: {card.card.points}</div>
          <div>位置: ({position.row + 1}, {position.col + 1})</div>
        </div>
      </div>
    </motion.div>
  );
}