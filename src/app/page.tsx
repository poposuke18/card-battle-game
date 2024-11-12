// src/app/page.tsx
'use client';

import { useState, useReducer, useEffect } from 'react';
import { Board } from '@/components/board';
import GameStatus from '@/components/GameStatus';
import AnimatedCard from '@/components/AnimatedCard';
import TurnTransition from '@/components/TurnTransition';
import type { GameState, GameAction, PlacedCard, Card } from '@/types';
import { calculateCardScore } from '@/utils/score/calculator';
import { generateRandomHand, generateNextHand, type TurnNumber } from '@/utils/cards';


// 初期状態
const initialState: GameState = {
  board: Array(5).fill(null).map(() => Array(5).fill(null)),
  currentHand: [],
  nextHand: [],
  selectedCard: null,
  status: {
    turn: 1,
    allyScore: 0,
    enemyScore: 0,
    gameOver: false,
    winner: null
  },
  canEndTurn: false
};

// スコア計算用の関数
function calculateScores(board: (PlacedCard | null)[][]): { allyScore: number; enemyScore: number } {
  let allyScore = 0;
  let enemyScore = 0;

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;
      
      const scoreDetails = calculateCardScore(
        { row: rowIndex, col: colIndex },
        board,
        cell
      );

      if (cell.card.type === 'ally') {
        allyScore += scoreDetails.totalPoints;
      } else {
        enemyScore += scoreDetails.totalPoints;
      }
    });
  });

  return { allyScore, enemyScore };
}

// src/app/page.tsx
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      return {
        ...state,
        currentHand: action.payload.currentHand,
        nextHand: action.payload.nextHand,
        board: Array(5).fill(null).map(() => Array(5).fill(null)),
        status: {
          ...state.status,
          turn: 1,
          allyScore: 0,
          enemyScore: 0,
          gameOver: false,
          winner: null
        }
      };
    }
    
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: action.card
      };

    case 'PLACE_CARD': {
      if (!state.selectedCard) return state;
      
      const selectedCard: Card = state.selectedCard;
      
      const newBoard = state.board.map((row, rowIndex) =>
        row.map((cell, colIndex): PlacedCard | null => {
          if (rowIndex === action.position.row && colIndex === action.position.col) {
            return {
              card: selectedCard,
              position: { row: rowIndex, col: colIndex }
            };
          }
          return cell;
        })
      );

      const { allyScore, enemyScore } = calculateScores(newBoard);
      const remainingCards = state.currentHand.filter(card => card.id !== selectedCard.id);
      const canEndTurn = remainingCards.length === 0;

      return {
        ...state,
        board: newBoard,
        currentHand: remainingCards,
        selectedCard: null,
        canEndTurn,
        status: {
          ...state.status,
          allyScore,
          enemyScore
        }
      };
    }

    case 'UNDO_LAST_MOVE': {
      const currentTurn = state.status.turn;
      const cardsToReturn: Card[] = [];
      
      const newBoard = state.board.map(row => 
        row.map(cell => {
          if (cell && cell.card.turn === currentTurn) {
            cardsToReturn.push(cell.card);
            return null;
          }
          return cell;
        })
      );
    
      const { allyScore, enemyScore } = calculateScores(newBoard);
    
      return {
        ...state,
        board: newBoard,
        currentHand: [...state.currentHand, ...cardsToReturn],
        canEndTurn: false,
        status: {
          ...state.status,
          allyScore,
          enemyScore
        }
      };
    }

    case 'END_TURN': {
      if (!state.canEndTurn) return state;
    
      const nextTurn = state.status.turn + 1;
      // ここを4から5に変更
      if (nextTurn > 5) {
        const { allyScore, enemyScore } = calculateScores(state.board);
        return {
          ...state,
          status: {
            ...state.status,
            gameOver: true,
            winner: allyScore > enemyScore ? 'ally' : 'enemy',
            allyScore,
            enemyScore
          }
        };
      }
      
      // 次のターンの手札を生成
      const nextHand = generateNextHand(nextTurn as TurnNumber);
      
      // スコアを再計算
      const { allyScore, enemyScore } = calculateScores(state.board);
      
      return {
        ...state,
        currentHand: state.nextHand,
        nextHand,
        status: {
          ...state.status,
          turn: nextTurn,
          allyScore,
          enemyScore
        },
        canEndTurn: false
      };
    }

    case 'RESET_GAME': {
      const initialHand = generateRandomHand();
      const nextHand = generateNextHand(1);
      
      return {
        ...initialState,
        currentHand: initialHand,
        nextHand: nextHand,
        board: Array(5).fill(null).map(() => Array(5).fill(null)),
        status: {
          ...initialState.status,
          turn: 1,
          allyScore: 0,
          enemyScore: 0,
          gameOver: false,
          winner: null
        }
      };
    }

    default:
      return state;
  }
}

// メインコンポーネント
export default function Home() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTurnTransition, setShowTurnTransition] = useState(false);

  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' });
    
    setTimeout(() => {
      setShowTurnTransition(true);
      setTimeout(() => {
        setShowTurnTransition(false);
      }, 1000);
    }, 0);
  };

  useEffect(() => {
    if (!isInitialized) {
      const initialHand = generateRandomHand();
      const nextHand = generateNextHand(1);
      
      dispatch({ 
        type: 'INITIALIZE_GAME', 
        payload: { currentHand: initialHand, nextHand: nextHand } 
      });
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <TurnTransition 
        turn={gameState.status.turn} 
        isVisible={showTurnTransition} 
      />
      
      <div className="max-w-5xl mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400 mb-2">
            Card Battle Game
          </h1>
          <p className="text-gray-400">戦略的に配置して勝利を目指そう！</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 手札エリア */}
          <div className="lg:col-span-1">
            {!gameState.status.gameOver && (
              <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-300">手札</h2>
                <div className="flex flex-row flex-wrap gap-2 justify-center">
                  {gameState.currentHand.map((card, index) => (
                    <AnimatedCard
                      key={card.id}
                      card={card}
                      isSelected={gameState.selectedCard?.id === card.id}
                      onClick={() => dispatch({ type: 'SELECT_CARD', card })}
                      index={index}
                      isNew={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ゲームボードエリア */}
          <div className="lg:col-span-2">
            <GameStatus status={gameState.status} />
            <Board
              board={gameState.board}
              selectedCard={gameState.selectedCard}
              onPlaceCard={(position) => {
                if (gameState.selectedCard && gameState.board[position.row][position.col] === null) {
                  dispatch({ type: 'PLACE_CARD', position });
                }
              }}
            />
            
            {/* アクションボタン */}
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 bg-gray-700 text-white rounded-lg
                  ${gameState.currentHand.length === 0 ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'}
                  transition-colors`}
                onClick={() => dispatch({ type: 'UNDO_LAST_MOVE' })}
                disabled={gameState.currentHand.length > 0}
              >
                このターンをやり直す
              </button>
              
              {gameState.canEndTurn && !gameState.status.gameOver && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 
                           transition-colors shadow-lg hover:shadow-xl"
                  onClick={handleEndTurn}
                >
                  次のターンへ
                </button>
              )}

              {gameState.status.gameOver && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 
                           transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => dispatch({ type: 'RESET_GAME' })}
                >
                  もう一度プレイ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}