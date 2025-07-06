'use client';

import React, { useState } from 'react';
import type { Card } from '@/types';
import { useGame } from '@/contexts/GameContext';
import { 
  ALL_CARDS, 
  CARDS_BY_CATEGORY, 
  CARDS_BY_TYPE, 
  CARDS_BY_TURN,
  createDebugCard,
  filterCards 
} from '@/utils/debug-cards';

export function DebugCardSelector() {
  const { state, toggleCardSelector, addDebugCard } = useGame();
  const [filters, setFilters] = useState({
    category: '',
    type: '' as 'ally' | 'enemy' | '',
    turn: 0,
    search: ''
  });

  if (!state.debugMode.showCardSelector) return null;

  const filteredCards = filterCards(ALL_CARDS, {
    category: filters.category || undefined,
    type: filters.type || undefined,
    turn: filters.turn || undefined,
    search: filters.search || undefined
  });

  const handleAddCard = (card: Card) => {
    const debugCard = createDebugCard(card);
    addDebugCard(debugCard);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">デバッグモード - カード選択</h2>
          <button
            onClick={toggleCardSelector}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* フィルター */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="">全カテゴリ</option>
            <option value="unit">ユニット</option>
            <option value="field">フィールド</option>
            <option value="weapon">武器</option>
            <option value="support">サポート</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as 'ally' | 'enemy' | '' }))}
            className="border rounded px-2 py-1"
          >
            <option value="">全タイプ</option>
            <option value="ally">プレイヤー</option>
            <option value="enemy">エネミー</option>
          </select>

          <select
            value={filters.turn}
            onChange={(e) => setFilters(prev => ({ ...prev, turn: parseInt(e.target.value) || 0 }))}
            className="border rounded px-2 py-1"
          >
            <option value="0">全ターン</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(turn => (
              <option key={turn} value={turn}>ターン{turn}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="カード名で検索"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="border rounded px-2 py-1"
          />
        </div>

        {/* カード一覧 */}
        <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className={`border rounded p-3 cursor-pointer hover:bg-gray-50 ${
                card.type === 'ally' ? 'border-blue-300' : 'border-red-300'
              }`}
              onClick={() => handleAddCard(card)}
            >
              <div className="font-bold text-sm mb-1">{card.name}</div>
              <div className="text-xs text-gray-600 mb-2">
                {card.category} | {card.type === 'ally' ? 'プレイヤー' : 'エネミー'} | ターン{card.turn}
              </div>
              <div className="text-sm">
                <div className="font-semibold">ポイント: {card.points}</div>
                {card.class && (
                  <div className="text-xs text-gray-500">クラス: {card.class}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            条件に一致するカードがありません
          </div>
        )}
      </div>
    </div>
  );
}