'use client';

import React, { useState } from 'react';
import { CardList, CardScoreList } from '@/components';
import Link from 'next/link';
import { 
  TURN1_CARDS, 
  TURN2_CARDS, 
  TURN3_CARDS, 
  TURN4_CARDS, 
  TURN5_CARDS, 
  TURN6_CARDS, 
  TURN7_CARDS, 
  TURN8_CARDS 
} from '@/constants';

export default function CardsPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'scores'>('cards');
  
  const allCards = [
    ...TURN1_CARDS,
    ...TURN2_CARDS,
    ...TURN3_CARDS,
    ...TURN4_CARDS,
    ...TURN5_CARDS,
    ...TURN6_CARDS,
    ...TURN7_CARDS,
    ...TURN8_CARDS
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* ナビゲーション */}
      <div className="flex justify-between items-center pt-8 pb-4 px-8">
        <Link 
          href="/" 
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← ステージ選択に戻る
        </Link>
        
        {/* 表示切り替えボタン */}
        <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            カード一覧
          </button>
          <button
            onClick={() => setViewMode('scores')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              viewMode === 'scores'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            スコア一覧
          </button>
        </div>
      </div>

      {/* 表示コンテンツ */}
      {viewMode === 'cards' ? (
        <CardList 
          cards={allCards}
          title="カードバトルリメイク - 全カード一覧"
        />
      ) : (
        <CardScoreList cards={allCards} />
      )}
    </main>
  );
}