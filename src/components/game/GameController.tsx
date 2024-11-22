// src/components/game/GameController.tsx

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Board } from '@/components/board';
import { CardDetails } from '@/components/card/CardDetails';
import { GameStatus } from '@/components/status/GameStatus';
import { AnimatedCard } from '@/components/card/AnimatedCard';
import { TurnTransition } from '@/components/game/TurnTransition';
import { useGameState } from '@/hooks/useGameState';
import { useGameProgress } from '@/hooks/useGameProgress';  // 追加：ステージクリア用
import { useEffects } from '@/hooks/useEffects';  // 追加：効果範囲表示用
import type { PlacedCard, Position } from '@/types';
import DebugCardList from '@/components/debug/DebugCardList';
import { useSearchParams } from 'next/navigation';


export function GameController() {
  const searchParams = useSearchParams();
  const currentStage = Number(searchParams.get('stage')) || 1;
  const { gameState, actions } = useGameState(currentStage);
  const { clearStage } = useGameProgress();
  const { hoveredPosition, setHoveredPosition, effectRange } = useEffects(gameState.board);
  const [showTurnTransition, setShowTurnTransition] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<{
    card: PlacedCard;
    position: Position;
  } | null>(null);

  const handlePlaceCard = async (position: Position) => {
    if (!gameState.selectedCard) return;
    if (gameState.board[position.row][position.col]) return;

    actions.placeCard(position);
  };

  // ターン終了時の処理
  const handleEndTurn = () => {
    if (!gameState.canEndTurn) return;
    
    setShowTurnTransition(true);
    setTimeout(() => {
      actions.endTurn();
      setTimeout(() => {
        setShowTurnTransition(false);
      }, 1000);
    }, 500);
  };

  const handleGameEnd = () => {
    if (gameState.status.winner === 'ally') {
      clearStage(gameState.currentStage);
      window.location.href = '/';
    } else {
      actions.resetGame();
    }
  };

  if (!gameState.currentHand.length && !gameState.status.gameOver && !gameState.canEndTurn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <AnimatePresence>
        {showTurnTransition && (
          <TurnTransition 
            turn={gameState.status.turn} 
            isVisible={showTurnTransition} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredCard && (
          <CardDetails
            card={hoveredCard.card}
            position={hoveredCard.position}
            board={gameState.board}
          />
        )}
      </AnimatePresence>
      
      <div className="max-w-5xl mx-auto p-4">
        {/* ゲームヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400 mb-1">
            Card Battle Game
          </h1>
          {process.env.NODE_ENV === 'development' && (
  <DebugCardList
    onSelectCard={(card) => actions.selectCard(card)}
    className="mt-2"
  />
)}
          <p className="text-gray-400">戦略的に配置して勝利を目指そう！</p>
        </motion.div>
        
        {/* メインゲームエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 手札エリア */}
          <div className="lg:col-span-1">
            {!gameState.status.gameOver && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-300">手札</h2>
                <div className="flex flex-row flex-wrap gap-2 justify-center">
                  {gameState.currentHand.map((card, index) => (
                    <AnimatedCard
                      key={card.id}
                      card={card}
                      isSelected={gameState.selectedCard?.id === card.id}
                      onClick={() => actions.selectCard(card)}
                      index={index}
                      isNew={true}
                      board={gameState.board}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ゲームボードエリア */}
          <div className="lg:col-span-2">
        <GameStatus status={gameState.status} />
        <Board
          board={gameState.board}
          selectedCard={gameState.selectedCard}
          onPlaceCard={handlePlaceCard}
          onHoverCard={setHoveredCard}
          effectRange={effectRange}
          hoveredPosition={hoveredPosition}
          setHoveredPosition={setHoveredPosition}
        />
            
            {/* アクションボタン */}
            <div className="flex justify-between items-center mt-4">
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 bg-gray-700 text-white rounded-lg
              ${gameState.history.length > 0 ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'}
              transition-colors`}
            onClick={actions.undoLastMove}
            disabled={gameState.history.length === 0}
          >
            元に戻す
          </motion.button>
              
          {gameState.canEndTurn && !gameState.status.gameOver && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={handleEndTurn}
            >
              {gameState.status.turn === 8 ? "決着をつける" : "次のターンへ"}
            </motion.button>
          )}

{gameState.status.gameOver && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg ${
                gameState.status.winner === 'ally' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}
              onClick={handleGameEnd}
            >
              {gameState.status.winner === 'ally' ? 'クリア！' : 'もう一度プレイ'}
            </motion.button>
          )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}