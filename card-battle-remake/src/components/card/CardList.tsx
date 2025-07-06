'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardDisplay } from './CardDisplay';
import type { Card } from '@/types';

interface CardListProps {
  cards: Card[];
  title?: string;
}

export const CardList: React.FC<CardListProps> = ({ cards, title = "カード一覧" }) => {
  const [filter, setFilter] = useState<'all' | 'ally' | 'enemy'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'unit' | 'field' | 'weapon' | 'support'>('all');

  const filteredCards = cards.filter(card => {
    const typeMatch = filter === 'all' || card.type === filter;
    const categoryMatch = categoryFilter === 'all' || card.category === categoryFilter;
    return typeMatch && categoryMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-4xl font-bold text-center mb-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>

      {/* フィルター */}
      <motion.div 
        className="mb-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* タイプフィルター */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            全て ({cards.length})
          </button>
          <button
            onClick={() => setFilter('ally')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ally' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            味方 ({cards.filter(c => c.type === 'ally').length})
          </button>
          <button
            onClick={() => setFilter('enemy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'enemy' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            敵 ({cards.filter(c => c.type === 'enemy').length})
          </button>
        </div>

        {/* カテゴリフィルター */}
        <div className="flex justify-center gap-2 flex-wrap">
          {['all', 'unit', 'field', 'weapon', 'support'].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === category 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? '全カテゴリ' : category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ターンフィルター */}
        <div className="flex justify-center gap-1 flex-wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((turn) => (
            <button
              key={turn}
              onClick={() => {
                if (turn === 0) {
                  // 全ターン表示
                  // フィルターをリセット
                } else {
                  // 特定ターンのみ表示するロジックを後で追加
                }
              }}
              className="px-2 py-1 rounded text-xs font-medium bg-gray-600 text-gray-300 hover:bg-gray-500"
            >
              {turn === 0 ? '全ターン' : `T${turn}`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* カード表示 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {filteredCards.map((card, index) => (
          <CardDisplay 
            key={card.id} 
            card={card} 
            index={index}
          />
        ))}
      </motion.div>

      {filteredCards.length === 0 && (
        <motion.div 
          className="text-center text-gray-400 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl">該当するカードがありません</p>
        </motion.div>
      )}
    </div>
  );
};