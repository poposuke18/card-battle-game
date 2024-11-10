'use client';

import { useState, useReducer, useEffect } from 'react';
import Board from '@/components/Board';
import Card from '@/components/Card';
import GameStatus from '@/components/GameStatus';
import { GameState, GameAction, Card as CardType, Position, PlacedCard } from '@/types/game';
import { getAdjacentCards, getPositionsInRange } from '@/utils/board';

const turn1Cards: CardType[] = [
  { id: '1', type: 'ally', name: '民兵', points: 100 },
  { id: '2', type: 'ally', name: '弓兵', points: 120 },
  { id: '3', type: 'enemy', name: 'ゴブリン', points: 100 },
  { id: '4', type: 'enemy', name: 'オーク', points: 120 },
];

const turn2Cards: CardType[] = [
  {
    id: '5',
    type: 'ally',
    name: '指揮官',
    points: 150,
    effect: {
      type: 'BUFF_ADJACENT',
      power: 50
    }
  },
  {
    id: '6',
    type: 'enemy',
    name: 'ドラゴン',
    points: 150,
    effect: {
      type: 'DAMAGE_ADJACENT',
      power: 30
    }
  }
];

const initialState: GameState = {
  board: Array(5).fill(null).map(() => Array(5).fill(null)),
  currentHand: turn1Cards,
  nextHand: turn2Cards,
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

  // 基本点数の計算
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (!cell) continue;

      // 効果による補正を適用
      let points = cell.card.points;
      const position = { row, col };

      // 隣接効果の計算
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

      // 範囲効果の計算（必要な場合）
      if (cell.card.effect?.type === 'RANGE_EFFECT' && cell.card.effect.range) {
        const affectedPositions = getPositionsInRange(position, cell.card.effect.range);
        for (const pos of affectedPositions) {
          const targetCard = board[pos.row][pos.col];
          if (targetCard && targetCard.card.type === cell.card.type) {
            points += cell.card.effect.power;
          }
        }
      }

      // 最終スコアの加算
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

      return {
        ...state,
        currentHand: state.nextHand,
        nextHand: [],
        status: {
          ...state.status,
          turn: state.status.turn + 1
        },
        canEndTurn: false
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
    // 手札が全部あるときは無効化（まだ何も置いていない状態）
    disabled={gameState.currentHand.length === (gameState.status.turn === 1 ? turn1Cards.length : turn2Cards.length)}
  >
    このターンをやり直す
  </button>
  
  {gameState.canEndTurn && (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => dispatch({ type: 'END_TURN' })}
    >
      次のターンへ
    </button>
  )}
</div>

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
      </div>
    </main>
  );
}