import { PlacedCard, Position, Card } from '@/types/game';
import { useState, useEffect } from 'react';
import { getAdjacentCards, checkEnemyLine, getAffectedPositions } from '@/utils/board';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateCardScore, getEffectDescription } from '@/utils/score-calculator';
import { AnimatedScore, ScorePopup } from '@/components/score';

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
    const scoreDetails = calculateCardScore(position, board, card);
  
    return (
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                     bg-gray-900 p-3 rounded-lg shadow-xl z-10 w-56
                     border border-gray-700 text-gray-100">
        <div className="text-sm">
          <div className="font-bold mb-2 text-base border-b border-gray-700 pb-1 text-gray-200">
            {card.card.name}
          </div>
          
          {card.card.effect && (
            <div className="mb-2 p-2 bg-gray-800 rounded">
              <div className="font-semibold mb-1 text-gray-300">効果:</div>
              <div className="text-gray-300">{getEffectDescription(card.card)}</div>
            </div>
          )}
          
          <ScorePopup scoreDetails={scoreDetails} />
        </div>
      </div>
    );
  }

function EffectHighlight({ position, board }: { position: Position; board: (PlacedCard | null)[][] }) {
        const cell = board[position.row][position.col];
        if (!cell?.card.effect) return null;
      
        const affectedCells = getAffectedPositions(position, cell.card, board);
      
        return (
          <>
            {affectedCells.map((pos) => (
              <motion.div
                key={`highlight-${pos.row}-${pos.col}`}
                initial={{ opacity: 0 }}
                animate={[
                  { opacity: 0.6, scale: 1.1 },
                  { opacity: 0 }
                ]}
                transition={{ duration: 0.5 }}
                className={`absolute top-0 left-0 w-full h-full rounded-lg
                  ${cell.card.type === 'ally' ? 'bg-blue-400/30' : 'bg-red-400/30'}`}
              />
            ))}
          </>
        );
      }

export default function Board({ board, selectedCard, onPlaceCard }: BoardProps) {
        const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);
        const [affectedPositions, setAffectedPositions] = useState<Position[]>([]);
        const [previousScores, setPreviousScores] = useState<Map<string, number>>(new Map());
      
        useEffect(() => {
          const newScores = new Map<string, number>();
          board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
              if (cell) {
                const position = `${rowIndex}-${colIndex}`;
                const scoreDetails = calculateCardScore(
                  { row: rowIndex, col: colIndex },
                  board,
                  cell
                );
                newScores.set(position, scoreDetails.totalPoints);
              }
            });
          });
      
          // 前回のスコアと比較して変更があったマスを特定
          const affected: Position[] = [];
          newScores.forEach((score, position) => {
            const [row, col] = position.split('-').map(Number);
            const previousScore = previousScores.get(position);
            if (previousScore !== undefined && previousScore !== score) {
              affected.push({ row, col });
            }
          });
      
          setAffectedPositions(affected);
          setPreviousScores(newScores);
      
          // エフェクトのリセットタイマー
          const timer = setTimeout(() => {
            setAffectedPositions([]);
          }, 500);
      
          return () => clearTimeout(timer);
        }, [board]);
      
        return (
          <div className="max-w-[400px] mx-auto grid grid-cols-5 gap-1 p-3 
                          bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-inner">
            {board.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                const position = { row: rowIndex, col: colIndex };
                const scoreDetails = cell ? calculateCardScore(position, board, cell) : null;
                const score = scoreDetails?.totalPoints ?? 0;
                const positionKey = `${rowIndex}-${colIndex}`;
                const previousScore = previousScores.get(positionKey) ?? score;
                const isAffected = affectedPositions.some(
                  pos => pos.row === rowIndex && pos.col === colIndex
                );
        
                return (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (rowIndex * 5 + colIndex) * 0.05 }}
                    className={`aspect-square bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 
                              rounded-lg p-1 flex items-center justify-center cursor-pointer 
                              hover:bg-gray-600/50 relative transition-all duration-200
                              ${selectedCard && !cell ? 'hover:border-yellow-400/50 hover:bg-gray-600/70' : ''}
                              ${cell ? 'shadow-md' : 'hover:shadow-lg'}`}
                    whileHover={!cell ? { scale: 1.05 } : {}}
                    onClick={() => onPlaceCard({ row: rowIndex, col: colIndex })}
                    onMouseEnter={() => setHoveredPosition({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredPosition(null)}
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className={`w-full h-full rounded flex items-center justify-center flex-col
                            ${cell.card.type === 'ally' 
                              ? 'bg-blue-500/90 text-white ring-1 ring-blue-400/50' 
                              : 'bg-red-500/90 text-white ring-1 ring-red-400/50'}`}
                        >
                          <span className="font-medium text-[10px] mb-0.5 opacity-90">
                            {cell.card.name}
                          </span>
                          <AnimatedScore
                            score={score}
                            isAffected={isAffected}
                            previousScore={previousScore}
                          />
                          {hoveredPosition?.row === rowIndex && 
                           hoveredPosition?.col === colIndex && (
                            <CardDetails
                              card={cell}
                              board={board}
                              position={{ row: rowIndex, col: colIndex }}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {selectedCard && !cell && (
                      <motion.div
                        className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <EffectHighlight position={{ row: rowIndex, col: colIndex }} board={board} />
                  </motion.div>
                );
              })
            )}
          </div>
        );
      }