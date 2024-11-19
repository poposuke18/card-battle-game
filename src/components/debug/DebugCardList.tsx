import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TURN1_CARDS, 
  TURN2_CARDS, 
  TURN3_CARDS, 
  TURN4_CARDS,
  TURN5_CARDS,
  TURN6_CARDS,
  TURN7_CARDS,
  TURN8_CARDS  // ボスカードを追加
} from '@/constants/cards';
import { AnimatedCard } from '@/components/card/AnimatedCard';
import type { Card } from '@/types';

const allCards = [
  ...TURN1_CARDS,
  ...TURN2_CARDS,
  ...TURN3_CARDS,
  ...TURN4_CARDS,
  ...TURN5_CARDS,
  ...TURN6_CARDS,
  ...TURN7_CARDS,
  ...TURN8_CARDS  // ボスカードを追加
];

export default function DebugCardList({ 
  onSelectCard,
  className = ''
}: { 
  onSelectCard: (card: Card) => void;
  className?: string;
}) {
  const [selectedTurn, setSelectedTurn] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<'ally' | 'enemy' | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ターンごとのカードを取得
  const getTurnCards = (turn: number) => {
    switch (turn) {
      case 1: return TURN1_CARDS;
      case 2: return TURN2_CARDS;
      case 3: return TURN3_CARDS;
      case 4: return TURN4_CARDS;
      case 5: return TURN5_CARDS;
      case 6: return TURN6_CARDS;
      case 7: return TURN7_CARDS;
      case 8: return TURN8_CARDS;  // ボスカードを追加
      default: return [];
    }
  };

  // フィルタリングされたカード一覧
  const filteredCards = allCards.filter(card => {
    if (selectedTurn && Math.ceil(card.turn) !== selectedTurn) return false;
    if (selectedType && card.type !== selectedType) return false;
    return true;
  });

  return (
    <div className={`relative ${className}`}>
      {/* デバッグパネル開閉ボタン */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 
                  transition-colors shadow-lg hover:shadow-xl text-[9px]"
      >
        {isOpen ? 'デバッグパネルを閉じる' : 'デバッグパネルを開く'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-4xl
                     bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50"
          >
            {/* フィルターコントロール */}
            <div className="flex gap-4 mb-4">
              <div className="space-x-2">
                <span className="text-gray-400">ターン:</span>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(turn => (  // 8ターンを追加
                  <button
                    key={turn}
                    onClick={() => setSelectedTurn(selectedTurn === turn ? null : turn)}
                    className={`px-3 py-1 rounded ${
                      selectedTurn === turn
                        ? turn === 8 
                          ? 'bg-red-600 text-white' // ボスターンは赤色
                          : 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {turn === 8 ? 'BOSS' : turn}
                  </button>
                ))}
              </div>
              <div className="space-x-2">
                <span className="text-gray-400">タイプ:</span>
                <button
                  onClick={() => setSelectedType(selectedType === 'ally' ? null : 'ally')}
                  className={`px-3 py-1 rounded ${
                    selectedType === 'ally'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  味方
                </button>
                <button
                  onClick={() => setSelectedType(selectedType === 'enemy' ? null : 'enemy')}
                  className={`px-3 py-1 rounded ${
                    selectedType === 'enemy'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  敵
                </button>
              </div>
            </div>

            {/* カード一覧 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
              {filteredCards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => {
                    // カードのコピーを作成して一意のIDを付与
                    const newCard = {
                      ...card,
                      id: `${card.id}-${Date.now()}-${Math.random()}`
                    };
                    onSelectCard(newCard);
                  }}
                  className="cursor-pointer"
                >
                  <AnimatedCard
                    card={card}
                    index={index}
                    isNew={false}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}