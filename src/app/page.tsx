'use client';


import { useState, useReducer, useEffect } from 'react';
import Board from '@/components/Board';
import Card from '@/components/Card';
import GameStatus from '@/components/GameStatus';
import { GameState, GameAction, Card as CardType, Position, PlacedCard } from '@/types/game';
import { getAdjacentCards, getPositionsInRange } from '@/utils/board';
import { generateRandomHand, generateNextHand } from '@/utils/cards';
import { TURN1_CARDS, TURN2_CARDS } from '@/constants/cards';

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

      // 特殊効果の処理
      if (cell.card.effect) {
        switch (cell.card.effect.type) {
          case 'POWER_UP_BY_ENEMY': {
            // 槍兵の効果: 隣接する敵ユニットが3体以上で攻撃力2倍
            const adjacentEnemies = adjacentCards.filter(
              adj => adj.card.type !== cell.card.type
            ).length;
            if (adjacentEnemies >= cell.card.effect.condition) {
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
          case 'BUFF_ADJACENT': {
            // 既存の隣接バフ効果
            const targets = adjacentCards.filter(
              adj => adj.card.type === cell.card.type
            );
            points += targets.length * cell.card.effect.power;
            break;
          }
          case 'DAMAGE_ADJACENT': {
            // 既存の隣接デバフ効果
            const targets = adjacentCards.filter(
              adj => adj.card.type !== cell.card.type
            );
            points += targets.length * cell.card.effect.power;
            break;
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
      // 現在のターンに置かれたカードを全て手札に戻す
      const cardsToReturn: Card[] = [];
      const newBoard = state.board.map(row => 
        row.map(cell => {
          if (cell) {
            cardsToReturn.push(cell.card);
            return null;
          }
          return cell;
        })
      );

      return {
        ...state,
        board: newBoard,
        currentHand: [...state.currentHand, ...cardsToReturn],
        canEndTurn: false,
        status: {
          ...state.status,
          allyScore: 0,
          enemyScore: 0
        }
      };
    }

    case 'END_TURN': {
      if (!state.canEndTurn) return state;

      // 次のターンの状態を作成
      const nextState = {
        ...state,
        currentHand: state.nextHand,
        nextHand: [],
        status: {
          ...state.status,
          turn: state.status.turn + 1
        },
        canEndTurn: false
      };

      // 全てのマスが埋まっているか確認
      const isBoardFull = nextState.board.every(row => 
        row.every(cell => cell !== null)
      );

      // ゲーム終了条件の確認
      if (isBoardFull || nextState.status.turn > 2) {
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
        currentHand: generateRandomHand(),  // turn1Cardsの代わりにgenerateRandomHand()を使用
        nextHand: generateNextHand(),       // turn2Cardsの代わりにgenerateNextHand()を使用
        status: {
          ...initialState.status
        }
      };

    default:
      return state;
  }
}

export default function Home() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
    if (!isInitialized) {
      const initialHand = generateRandomHand();
      const nextHand = generateNextHand();
      
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
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Card Battle Game</h1>
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
        
        <div className="flex justify-between items-center mt-4 mb-8">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            onClick={() => dispatch({ type: 'UNDO_LAST_MOVE' })}
            disabled={gameState.currentHand.length === (gameState.status.turn === 1 ? TURN1_CARDS.length : TURN2_CARDS.length)}
          >
            このターンをやり直す
          </button>
          
          {gameState.canEndTurn && !gameState.status.gameOver && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => dispatch({ type: 'END_TURN' })}
            >
              次のターンへ
            </button>
          )}

          {gameState.status.gameOver && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => dispatch({ type: 'RESET_GAME' })}
            >
              もう一度プレイ
            </button>
          )}
        </div>

        {!gameState.status.gameOver && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">手札</h2>
            <div className="flex gap-4 flex-wrap">
              {gameState.currentHand.map((card) => (
                <Card 
                  key={card.id} 
                  card={card}
                  isSelected={gameState.selectedCard?.id === card.id}
                  onClick={() => dispatch({ type: 'SELECT_CARD', card })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}