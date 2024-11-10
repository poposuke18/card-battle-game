'use client';

import { useState, useReducer, useEffect } from 'react';
import Board from '@/components/Board';
import Card from '@/components/Card';
import GameStatus from '@/components/GameStatus';
import { GameState, GameAction, Card as CardType } from '@/types/game';

// 初期カードデータ（仮のデータ）
const initialCards: CardType[] = [
  // 味方カード
  { id: '1', type: 'ally', name: '戦士', points: 100 },
  { id: '2', type: 'ally', name: '騎士', points: 150 },
  { id: '3', type: 'ally', name: '魔法使い', points: 200 },
  // 敵カード
  { id: '4', type: 'enemy', name: 'ゴブリン', points: 100 },
  { id: '5', type: 'enemy', name: 'オーク', points: 150 },
  { id: '6', type: 'enemy', name: 'ドラゴン', points: 200 },
];

const initialState: GameState = {
  board: Array(5).fill(null).map(() => Array(5).fill(null)),
  hand: initialCards,
  selectedCard: null,
  status: {
    turn: 1,
    allyScore: 0,
    enemyScore: 0,
    gameOver: false,
    winner: null
  }
};

function calculateScores(board: (PlacedCard | null)[][]): { allyScore: number; enemyScore: number } {
  let allyScore = 0;
  let enemyScore = 0;

  for (let row of board) {
    for (let cell of row) {
      if (cell) {
        if (cell.card.type === 'ally') {
          allyScore += cell.card.points;
        } else {
          enemyScore += cell.card.points; // マイナスを削除
        }
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
      const isBoardFull = newBoard.every(row => row.every(cell => cell !== null));
      const gameOver = isBoardFull;
      const winner = gameOver ? (allyScore > enemyScore ? 'ally' : 'enemy') : null;

      return {
        ...state,
        board: newBoard,
        hand: state.hand.filter(card => card.id !== state.selectedCard?.id),
        selectedCard: null,
        status: {
          ...state.status,
          allyScore,
          enemyScore,
          gameOver,
          winner,
          turn: state.status.turn + 1
        }
      };
    }

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

export default function Home() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const handleCardSelect = (card: CardType) => {
    dispatch({ type: 'SELECT_CARD', card });
  };

  const handleCardPlace = (position: Position) => {
    if (!gameState.selectedCard) return;
    
    // 選択されたマスが空いているか確認
    if (gameState.board[position.row][position.col] === null) {
      dispatch({ type: 'PLACE_CARD', position });
    }
  };

  // ゲーム終了時の処理
  useEffect(() => {
    if (gameState.status.gameOver) {
      const message = gameState.status.winner === 'ally' 
        ? 'ゲームクリア！味方の勝利です！'
        : 'ゲームオーバー。敵の勝利です。';
      
      setTimeout(() => {
        alert(message);
      }, 100);
    }
  }, [gameState.status.gameOver]);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Card Battle Game</h1>
        <GameStatus status={gameState.status} />
        <Board
          board={gameState.board}
          selectedCard={gameState.selectedCard}
          onPlaceCard={handleCardPlace}
        />
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">手札</h2>
          <div className="flex gap-4 flex-wrap">
            {gameState.hand.map((card) => (
              <Card 
                key={card.id} 
                card={card}
                isSelected={gameState.selectedCard?.id === card.id}
                onClick={() => handleCardSelect(card)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}