import { PlacedCard, Position } from '@/types/game';
import { useState } from 'react';
import { getAdjacentCards } from '@/utils/board';

type BoardProps = {
  board: (PlacedCard | null)[][];
  selectedCard: Card | null;
  onPlaceCard: (position: Position) => void;
};

type CardDetailsProps = {
  card: PlacedCard;
  board: (PlacedCard | null)[][];
  position: Position;
};

// カード詳細を表示するポップアップコンポーネント
function CardDetails({ card, board, position }: CardDetailsProps) {
    const basePoints = card.card.points;
    let effectPoints = 0;
  
    // 隣接効果の計算
    const adjacentCards = getAdjacentCards(position, board);
    for (const adjCard of adjacentCards) {
      if (adjCard.card.effect?.type === 'BUFF_ADJACENT' && 
          adjCard.card.type === card.card.type) {
        effectPoints += adjCard.card.effect.power;
      }
      if (adjCard.card.effect?.type === 'DAMAGE_ADJACENT') {
        effectPoints -= adjCard.card.effect.power;
      }
    }
  
    const totalPoints = basePoints + effectPoints;
  
    return (
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                      bg-white p-4 rounded-lg shadow-lg z-10 w-64">
        <div className="text-sm">
          <div className="font-bold mb-2 text-base border-b pb-1">{card.card.name}</div>
          
          {/* 効果の説明 */}
          {card.card.effect && (
            <div className="mb-2 p-2 bg-gray-50 rounded">
              <div className="font-semibold mb-1">効果:</div>
              {card.card.effect.type === 'BUFF_ADJACENT' && 
                `隣接する${card.card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力を${card.card.effect.power}上昇させる`}
              {card.card.effect.type === 'DAMAGE_ADJACENT' && 
                `隣接する全てのユニットに${card.card.effect.power}のダメージを与える`}
              {card.card.effect.type === 'RANGE_EFFECT' && 
                `${card.card.effect.range}マス以内の${card.card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力を${card.card.effect.power}上昇させる`}
            </div>
          )}
  
          {/* スコア詳細 */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>基礎スコア:</span>
              <span>{basePoints}</span>
            </div>
            <div className="flex justify-between">
              <span>効果ボーナス:</span>
              <span className={effectPoints >= 0 ? 'text-green-600' : 'text-red-600'}>
                {effectPoints >= 0 ? '+' : ''}{effectPoints}
              </span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1 mt-2">
              <span>最終スコア:</span>
              <span>{totalPoints}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default function Board({ board, selectedCard, onPlaceCard }: BoardProps) {
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  // カードの最終スコアを計算する関数
  const calculateCardScore = (position: Position): number => {
    const cell = board[position.row][position.col];
    if (!cell) return 0;

    let points = cell.card.points;
    const adjacentCards = getAdjacentCards(position, board);
    
    for (const adjCard of adjacentCards) {
      if (adjCard.card.effect?.type === 'BUFF_ADJACENT' && 
          adjCard.card.type === cell.card.type) {
        points += adjCard.card.effect.power;
      }
      if (adjCard.card.effect?.type === 'DAMAGE_ADJACENT') {
        points -= adjCard.card.effect.power;
      }
    }

    return points;
  };

  return (
    <div className="grid grid-cols-5 gap-2 mb-8">
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => {
          const position = { row: rowIndex, col: colIndex };
          const score = cell ? calculateCardScore(position) : 0;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square bg-white border-2 border-gray-300 rounded-lg p-2 
                       flex items-center justify-center cursor-pointer hover:bg-gray-50 relative"
              onClick={() => onPlaceCard(position)}
              onMouseEnter={() => setHoveredPosition(position)}
              onMouseLeave={() => setHoveredPosition(null)}
            >
              {cell && (
                <div className={`w-full h-full rounded flex items-center justify-center flex-col
                  ${cell.card.type === 'ally' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
                >
                  <span className="font-bold text-xs mb-1">{cell.card.name}</span>
                  <span className="font-bold text-lg">{score}</span>
                  {hoveredPosition?.row === rowIndex && 
                   hoveredPosition?.col === colIndex && (
                    <CardDetails
                      card={cell}
                      board={board}
                      position={position}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
}