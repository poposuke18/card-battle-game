import { PlacedCard, Position } from '@/types/game';
import { useState } from 'react';
import { getAdjacentCards, checkEnemyLine } from '@/utils/board';

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
    const adjacentCards = getAdjacentCards(position, board);
    
    // カードの効果を計算
    if (card.card.effect) {
      switch (card.card.effect.type) {
        case 'POWER_UP_BY_ENEMY_LINE': {
            if (checkEnemyLine(position, board)) {
              effectPoints += card.card.effect.power;
            }
            break;
          }
        case 'POWER_UP_BY_ALLY': {
          const adjacentAllies = adjacentCards.filter(
            adj => adj.card.type === card.card.type
          ).length;
          effectPoints += adjacentAllies * card.card.effect.power;
          break;
        }
      }
    }
    
    // 周囲のカードからの効果を計算
    adjacentCards.forEach(adjCard => {
      if (adjCard.card.effect) {
        switch (adjCard.card.effect.type) {
          case 'BUFF_ADJACENT':
            if (adjCard.card.type === card.card.type) {
              effectPoints += adjCard.card.effect.power;
            }
            break;
          case 'DAMAGE_ADJACENT':
            effectPoints -= adjCard.card.effect.power;
            break;
        }
      }
    });
    
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
              {card.card.effect.type === 'POWER_UP_BY_ENEMY_LINE' && 
              `縦か横に敵ユニットが2体並んでいる隣に配置すると攻撃力+${card.card.effect.power}`}
              {card.card.effect.type === 'POWER_UP_BY_ALLY' && 
                `隣接する味方ユニット1体につき攻撃力+${card.card.effect.power}`}
              {card.card.effect.type === 'BUFF_ADJACENT' && 
                `隣接する${card.card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.card.effect.power}`}
              {card.card.effect.type === 'DAMAGE_ADJACENT' && 
                `隣接するユニットの攻撃力-${card.card.effect.power}`}
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
  
      // カード自身の効果を計算
      if (cell.card.effect) {
        switch (cell.card.effect.type) {
            case 'POWER_UP_BY_ENEMY_LINE': {
              // 槍兵の効果: 横か縦に敵が2体並んでいる場合
              if (checkEnemyLine(position, board)) {
                points += cell.card.effect.power;
              }
              break;
            }
          case 'POWER_UP_BY_ALLY': {
            // 剣士の効果: 隣接する味方ユニット1体につき攻撃力上昇
            const adjacentAllies = adjacentCards.filter(
              adj => adj.card.type === cell.card.type
            ).length;
            points += adjacentAllies * cell.card.effect.power;
            break;
          }
        }
      }
  
      // 周囲のカードからの効果を計算
      adjacentCards.forEach(adjCard => {
        if (adjCard.card.effect) {
          switch (adjCard.card.effect.type) {
            case 'BUFF_ADJACENT':
              if (adjCard.card.type === cell.card.type) {
                points += adjCard.card.effect.power;
              }
              break;
            case 'DAMAGE_ADJACENT':
              points -= adjCard.card.effect.power;
              break;
          }
        }
      });
  
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