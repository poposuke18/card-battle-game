'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/types';
import { getEffectDescription, getClassDescription } from '@/utils';

interface CardDisplayProps {
  card: Card;
  index?: number;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, index = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCardTypeColor = (type: 'ally' | 'enemy') => {
    return type === 'ally' 
      ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400' 
      : 'bg-gradient-to-br from-red-500 to-red-700 border-red-400';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'unit':
        return '⚔️';
      case 'field':
        return '🏰';
      case 'weapon':
        return '⚡';
      case 'support':
        return '🛡️';
      default:
        return '❓';
    }
  };

  const getClassIcon = (unitClass: string | null) => {
    switch (unitClass) {
      case 'warrior':
        return '🗡️';
      case 'archer':
        return '🏹';
      case 'mage':
        return '🔮';
      case 'knight':
        return '🛡️';
      case 'lancer':
        return '🛡️';
      case 'guardian':
        return '🛡️';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative w-64 h-96 rounded-lg border-2 shadow-lg overflow-hidden cursor-pointer
        ${getCardTypeColor(card.type)}
        hover:scale-105 transition-transform duration-200
      `}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* カードヘッダー */}
      <div className="p-3 bg-black bg-opacity-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(card.category)}</span>
            <span className="text-sm font-medium text-white">
              {card.category.toUpperCase()}
            </span>
          </div>
          <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm font-bold text-white">
            T{card.turn}
          </div>
        </div>
      </div>

      {/* カード名 */}
      <div className="px-3 py-2">
        <h3 className="text-lg font-bold text-white truncate">
          {card.name}
        </h3>
        {card.class && (
          <div className="flex items-center gap-1 mt-1">
            <span>{getClassIcon(card.class)}</span>
            <span className="text-sm text-white opacity-80 capitalize">
              {card.class}
            </span>
          </div>
        )}
      </div>

      {/* 効果説明 */}
      {showDetails && card.effect && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-3 py-2 bg-black bg-opacity-30"
        >
          <h4 className="text-xs font-bold text-yellow-300 mb-1">効果</h4>
          <p className="text-xs text-white leading-relaxed">
            {getEffectDescription(card.effect)}
          </p>
        </motion.div>
      )}

      {/* クラス説明 */}
      {showDetails && card.class && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-3 py-2 bg-black bg-opacity-20"
        >
          <p className="text-xs text-white opacity-90">
            {getClassDescription(card.class)}
          </p>
        </motion.div>
      )}

      {/* ポイント表示 */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white bg-opacity-90 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {card.points}
          </div>
          <div className="text-xs text-gray-600">POINTS</div>
        </div>
      </div>

      {/* エフェクト表示 */}
      {card.effect && (
        <div className="absolute top-14 right-2">
          <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            EFFECT
          </div>
        </div>
      )}

      {/* 詳細表示ヒント */}
      <div className="absolute top-2 right-2">
        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {showDetails ? '閉じる' : 'クリック'}
        </div>
      </div>
    </motion.div>
  );
};