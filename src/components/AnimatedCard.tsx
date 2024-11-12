// src/components/AnimatedCard.tsx

import { motion } from 'framer-motion';
import { Card } from '@/types';
import { getEffectDescription } from '@/utils/score/calculator';
import { getClassDisplayName, getClassIcon } from '@/utils/common';

type CardProps = {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  index: number;
  isNew?: boolean;
};

function EffectIcon({ type }: { type: string }) {
  switch (type) {
    case 'VERTICAL_BOOST':
      return <span className="text-yellow-400">↕</span>;
    case 'HORIZONTAL_BOOST':
      return <span className="text-yellow-400">↔</span>;
    case 'DIAGONAL_BOOST':
      return <span className="text-yellow-400">↗</span>;
    case 'CROSS_FORMATION':
      return <span className="text-yellow-400">+</span>;
    case 'SURROUND_BOOST':
      return <span className="text-yellow-400">○</span>;
    default:
      return null;
  }
}

export default function AnimatedCard({ 
  card, 
  isSelected, 
  onClick, 
  index, 
  isNew 
}: CardProps) {
  return (
    <motion.div
      initial={isNew ? { scale: 0, x: -100, rotateY: 180 } : { scale: 1 }}
      animate={{ scale: 1, x: 0, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-24 h-36 rounded-lg p-2 cursor-pointer transition-all relative
        ${card.type === 'ally' ? 'bg-blue-500/90 text-white' : 'bg-red-500/90 text-white'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
        shadow-lg hover:shadow-xl`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        {/* カード名とカテゴリー */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs">{card.name}</span>
            {card.effect && 'targetClass' in card.effect && (
              <EffectIcon type={card.effect.type} />
            )}
          </div>
          
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center gap-0.5 text-[10px] bg-white/10 px-1 py-0.5 rounded">
              {card.category === 'unit' && card.class && (
                <>
                  <span className="text-[12px]">{getClassIcon(card.class)}</span>
                  <span>{getClassDisplayName(card.class)}</span>
                </>
              )}
              {card.category === 'field' && (
                <>
                  <span className="text-[12px]">🏰</span>
                  <span>フィールド</span>
                </>
              )}
              {card.category === 'weapon' && (
                <>
                  <span className="text-[12px]">⚔️</span>
                  <span>武器</span>
                </>
              )}
            </div>
          </div>
          
          {/* 効果の説明 */}
          {card.effect && (
            <div className="text-[10px] mb-1 p-1.5 bg-white/10 rounded leading-tight">
              {getEffectDescription(card)}
            </div>
          )}
        </div>

        {/* ポイント表示 */}
        <div className="flex items-center justify-between bg-black/20 p-1 rounded">
          <div className="text-[10px] opacity-80">基礎点</div>
          <div className="text-base font-bold">{card.points}</div>
        </div>
      </div>

      {/* ホバー時のポップアップ（詳細情報） */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-gray-900/95 
                   rounded-lg shadow-lg text-white text-xs z-10 pointer-events-none
                   border border-gray-700"
      >
        <div className="space-y-2">
          {/* ヘッダー部分 */}
          <div className="border-b border-gray-700 pb-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{card.name}</span>
              {card.effect && 'targetClass' in card.effect && (
                <EffectIcon type={card.effect.type} />
              )}
            </div>
            
            {/* カテゴリーとクラス情報 */}
            <div className="flex items-center gap-2 mt-1 text-gray-300">
              {card.category === 'unit' && card.class && (
                <div className="flex items-center gap-1">
                  <span className="text-base">{getClassIcon(card.class)}</span>
                  <span>{getClassDisplayName(card.class)}</span>
                </div>
              )}
              {card.category === 'field' && (
                <div className="flex items-center gap-1">
                  <span className="text-base">🏰</span>
                  <span>フィールド</span>
                </div>
              )}
              {card.category === 'weapon' && (
                <div className="flex items-center gap-1">
                  <span className="text-base">⚔️</span>
                  <span>武器</span>
                </div>
              )}
            </div>
          </div>

          {/* 効果の説明 */}
          {card.effect && (
            <div className="space-y-1">
              <div className="font-semibold text-gray-300">効果:</div>
              <div className="bg-gray-800 p-2 rounded text-gray-200 leading-relaxed">
                {getEffectDescription(card)}
                
                {/* 武器効果の場合、追加情報を表示 */}
                {'targetClass' in card.effect && (
                  <div className="mt-1 text-gray-400 border-t border-gray-700 pt-1">
                    <div className="flex items-center gap-1">
                      <span>対象: </span>
                      <span className="text-base">{getClassIcon(card.effect.targetClass)}</span>
                      <span>{getClassDisplayName(card.effect.targetClass)}</span>
                    </div>
                    {/* 効果タイプ別の説明 */}
                    <div className="mt-1">
                      {card.effect.type === 'VERTICAL_BOOST' && '上下の対象クラスに効果'}
                      {card.effect.type === 'HORIZONTAL_BOOST' && '左右の対象クラスに効果'}
                      {card.effect.type === 'DIAGONAL_BOOST' && '斜めの対象クラスに効果'}
                      {card.effect.type === 'CROSS_FORMATION' && '十字の対象クラスに効果'}
                      {card.effect.type === 'SURROUND_BOOST' && '3体以上の対象クラスで効果発動'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* スコア情報 */}
          <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
            <div className="text-gray-300">基礎点:</div>
            <div className="font-bold text-lg">{card.points}</div>
          </div>

          {/* ターン情報 */}
          <div className="text-[10px] text-gray-400 text-right">
            ターン {card.turn}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}