'use client';

import React from 'react';
import type { Card } from '@/types';

interface CardScoreListProps {
  cards: Card[];
}

export const CardScoreList: React.FC<CardScoreListProps> = ({ cards }) => {
  // ターン別にカードをグループ化
  const cardsByTurn = cards.reduce((acc, card) => {
    if (!acc[card.turn]) {
      acc[card.turn] = [];
    }
    acc[card.turn].push(card);
    return acc;
  }, {} as Record<number, Card[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        カードスコア一覧
      </h1>

      {Object.keys(cardsByTurn)
        .sort((a, b) => Number(a) - Number(b))
        .map((turn) => (
          <div key={turn} className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">
              ターン {turn}
            </h2>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-white">カード名</th>
                    <th className="px-4 py-3 text-center text-white">タイプ</th>
                    <th className="px-4 py-3 text-center text-white">カテゴリ</th>
                    <th className="px-4 py-3 text-center text-white">クラス</th>
                    <th className="px-4 py-3 text-center text-white">スコア</th>
                    <th className="px-4 py-3 text-center text-white">効果</th>
                  </tr>
                </thead>
                <tbody>
                  {cardsByTurn[Number(turn)]
                    .sort((a, b) => {
                      // 味方を先に、敵を後に
                      if (a.type !== b.type) {
                        return a.type === 'ally' ? -1 : 1;
                      }
                      // 同じタイプ内ではスコア順
                      return a.points - b.points;
                    })
                    .map((card, index) => (
                      <tr 
                        key={card.id} 
                        className={`
                          ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                          ${card.type === 'ally' ? 'border-l-4 border-blue-400' : 'border-l-4 border-red-400'}
                          hover:bg-gray-600 transition-colors
                        `}
                      >
                        <td className="px-4 py-3 text-white font-medium">
                          {card.name}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`
                            px-2 py-1 rounded text-xs font-bold
                            ${card.type === 'ally' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}
                          `}>
                            {card.type === 'ally' ? '味方' : '敵'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-300">
                          {card.category}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-300">
                          {card.class || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-lg font-bold text-yellow-400">
                            {card.points}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {card.effect ? (
                            <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                              有
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              無
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* ターン別統計 */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-900 bg-opacity-50 p-3 rounded">
                <div className="text-blue-300 font-medium">味方平均</div>
                <div className="text-xl font-bold text-white">
                  {Math.round(
                    cardsByTurn[Number(turn)]
                      .filter(c => c.type === 'ally')
                      .reduce((sum, c) => sum + c.points, 0) / 
                    cardsByTurn[Number(turn)].filter(c => c.type === 'ally').length
                  ) || 0}
                </div>
              </div>
              
              <div className="bg-red-900 bg-opacity-50 p-3 rounded">
                <div className="text-red-300 font-medium">敵平均</div>
                <div className="text-xl font-bold text-white">
                  {Math.round(
                    cardsByTurn[Number(turn)]
                      .filter(c => c.type === 'enemy')
                      .reduce((sum, c) => sum + c.points, 0) / 
                    cardsByTurn[Number(turn)].filter(c => c.type === 'enemy').length
                  ) || 0}
                </div>
              </div>
              
              <div className="bg-green-900 bg-opacity-50 p-3 rounded">
                <div className="text-green-300 font-medium">最高スコア</div>
                <div className="text-xl font-bold text-white">
                  {Math.max(...cardsByTurn[Number(turn)].map(c => c.points))}
                </div>
              </div>
              
              <div className="bg-purple-900 bg-opacity-50 p-3 rounded">
                <div className="text-purple-300 font-medium">最低スコア</div>
                <div className="text-xl font-bold text-white">
                  {Math.min(...cardsByTurn[Number(turn)].map(c => c.points))}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};