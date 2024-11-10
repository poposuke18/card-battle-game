'use client';

import { useState, useReducer, useEffect } from 'react';
import Board from '@/components/Board';
import GameStatus from '@/components/GameStatus';
import AnimatedCard from '@/components/AnimatedCard';
import TurnTransition from '@/components/TurnTransition';
import { GameState, GameAction, Card as CardType, Position, PlacedCard } from '@/types/game';
import { getAdjacentCards, getPositionsInRange, checkEnemyLine } from '@/utils/board';
import { generateRandomHand, generateNextHand } from '@/utils/cards';
import { TURN1_CARDS, TURN2_CARDS, TURN3_CARDS } from '@/constants/cards';

// 初期状態を空の手札で作成
const initialState: GameState = {
  board: Array(5).fill(null).map(() => Array(5).fill(null)),
  currentHand: [], // 空の配列に変更
  nextHand: [],    // 空の配列に変更
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

function calculateScores(board: (PlacedCard | null)[][]): { allyScore: number; enemyScore: number } {
  let allyScore = 0;
  let enemyScore = 0;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (!cell) continue;

      let points = cell.card.points;
      const position = { row, col };
      const adjacentCards = getAdjacentCards(position, board);

      // カードの効果を適用
      if (cell.card.effect) {
        switch (cell.card.effect.type) {
          case 'POWER_UP_BY_ENEMY_LINE': {
            if (checkEnemyLine(position, board)) {
              points += cell.card.effect.power;
            }
            break;
          }
          case 'POWER_UP_BY_ALLY': {
            const adjacentAllies = adjacentCards.filter(
              adj => adj.card.type === cell.card.type
            ).length;
            points += adjacentAllies * cell.card.effect.power;
            break;
          }
          case 'BUFF_ADJACENT': {
            const targets = adjacentCards.filter(
              adj => adj.card.type === cell.card.type
            );
            points += targets.length * cell.card.effect.power;
            break;
          }
          case 'DAMAGE_ADJACENT': {
            points += adjacentCards.length * -cell.card.effect.power;
            break;
          }
          case 'RANGE_BUFF':
          case 'FIELD_BUFF': {
            // 範囲効果は他のカードのスコアに影響するため、ここでは基本点数のみ
            break;
          }
        }
      }

      // 他のカードからの効果を受ける
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          const otherCell = board[i][j];
          if (!otherCell || otherCell === cell) continue;

          if (otherCell.card.effect) {
            const distance = Math.abs(row - i) + Math.abs(col - j);
            
            switch (otherCell.card.effect.type) {
              case 'RANGE_BUFF':
              case 'FIELD_BUFF': {
                if (distance <= (otherCell.card.effect.range || 1) && 
                    otherCell.card.type === cell.card.type) {
                  points += otherCell.card.effect.power;
                }
                break;
              }
            }
          }
        }
      }

      // スコアの加算
      if (cell.card.type === 'ally') {
        allyScore += points;
      } else {
        enemyScore += points;
      }
    }
  }

  return { allyScore, enemyScore };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: action.card
      };

    case 'INITIALIZE_GAME':
      return {
        ...state,
        currentHand: action.payload.currentHand,
        nextHand: action.payload.nextHand
      };

    case 'PLACE_CARD': {
      if (!state.selectedCard) return state;
      
      const newBoard = state.board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === action.position.row && colIndex === action.position.col
            ? { card: state.selectedCard, position: action.position }
            : cell
        )
      );

      const { allyScore, enemyScore } = calculateScores(newBoard);
      const remainingCards = state.currentHand.filter(card => card.id !== state.selectedCard?.id);
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
      
      // 新しいボードを作成
      const newBoard = state.board.map(row => 
        row.map(cell => {
          if (cell && cell.card.turn === currentTurn) {
            // 現在のターンのカードのみを手札に戻す
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
      console.log(`Moving to turn ${nextTurn}`);
      
      // 次の次のターンの手札を生成（現在のターンから次のターンのカードを生成）
      const nextHand = generateNextHand(nextTurn);
      console.log('Next hand:', nextHand);
    
      // 次のターンの状態を作成
      const nextState = {
        ...state,
        currentHand: state.nextHand,
        nextHand,
        status: {
          ...state.status,
          turn: nextTurn
        },
        canEndTurn: false
      };
    
      // 全てのマスが埋まっているか確認
      const isBoardFull = nextState.board.every(row => 
        row.every(cell => cell !== null)
      );
    
      // ゲーム終了条件の確認
      if (isBoardFull || nextTurn > 3) {
        console.log('Game over condition met');
        const { allyScore, enemyScore } = calculateScores(nextState.board);
        
        return {
          ...nextState,
          status: {
            ...nextState.status,
            gameOver: true,
            winner: allyScore > enemyScore ? 'ally' : 'enemy',
            allyScore,
            enemyScore
          }
        };
      }
    
      return nextState;
    }

    case 'RESET_GAME':
      return {
        ...initialState,
        board: Array(5).fill(null).map(() => Array(5).fill(null)),
        currentHand: generateRandomHand(),    // ターン1の基本ユニット
        nextHand: generateNextHand(1),        // 現在のターン1から次のターン2のカード
        status: {
          ...initialState.status,
          turn: 1,
          allyScore: 0,
          enemyScore: 0,
          gameOver: false,
          winner: null
        }
      };


    default:
      return state;
  }
}

export default function Home() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTurnTransition, setShowTurnTransition] = useState(false);

  const handleEndTurn = () => {
    setShowTurnTransition(true);
    setTimeout(() => {
      dispatch({ type: 'END_TURN' });
      setTimeout(() => {
        setShowTurnTransition(false);
      }, 1000);
    }, 500);
  };

  useEffect(() => {
    if (!isInitialized) {
      const initialHand = generateRandomHand();    // ターン1の基本ユニット
      const nextHand = generateNextHand(1);        // 現在のターン1から次のターン2のカード
      
      dispatch({ 
        type: 'INITIALIZE_GAME', 
        payload: { currentHand: initialHand, nextHand: nextHand } 
      });
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // ゲーム終了時の処理
  useEffect(() => {
    if (gameState.status.gameOver) {
      const timer = setTimeout(() => {
        // 必要に応じて追加の処理
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.status.gameOver]);

  // 初期化が完了していない場合はローディング表示
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
        turn={gameState.status.turn + 1} 
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
          {/* 左側: 手札 */}
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
  
          {/* 中央: ゲームボード */}
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