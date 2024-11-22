"use client";

import { useReducer, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameProgress } from './useGameProgress';
import { generateHandWithStageBonus, type TurnNumber } from '@/utils/cards';
import { calculateCardScore } from '@/utils/score/calculator';
import type { GameState, GameAction, Card, Position, PlacedCard } from '@/types';

function calculateBoardScores(board: (PlacedCard | null)[][]): {
  allyScore: number;
  enemyScore: number;
} {
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
  canEndTurn: false,
  history: [],
  lastAction: null,
  currentStage: 1
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...initialState,
        currentHand: action.payload.currentHand,
        nextHand: action.payload.nextHand,
        currentStage: action.payload.currentStage
      };

    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: state.selectedCard?.id === action.card.id ? null : action.card
      };

      case 'PLACE_CARD': {
        if (!state.selectedCard) return state;
  
        const newBoard = state.board.map(row =>
          row.map(cell => cell ? cell : null)
        ).map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (rowIndex === action.position.row && colIndex === action.position.col) {
              return {
                card: state.selectedCard,
                position: { row: rowIndex, col: colIndex }
              } as PlacedCard;
            }
            return cell;
          })
        );
  
        const remainingCards = state.currentHand.filter(card => 
          card.id !== state.selectedCard?.id
        );
  
        const scores = calculateBoardScores(newBoard);
  
      return {
        ...state,
        board: newBoard,
        currentHand: remainingCards,
        selectedCard: null,
        canEndTurn: remainingCards.length === 0,
        status: {
          ...state.status,
          allyScore: scores.allyScore,
          enemyScore: scores.enemyScore
        },
        history: [
          ...state.history,
          {
            action: 'PLACE_CARD',
            card: state.selectedCard,
            position: action.position,
            previousState: {
              board: state.board,
              scores: {
                allyScore: state.status.allyScore,
                enemyScore: state.status.enemyScore
              }
            }
          }
        ]
      };
    }

    case 'END_TURN': {
      if (state.status.turn >= 8) {
        const scores = calculateBoardScores(state.board);
        return {
          ...state,
          status: {
            ...state.status,
            gameOver: true,
            winner: scores.allyScore > scores.enemyScore ? 'ally' : 'enemy',
            allyScore: scores.allyScore,
            enemyScore: scores.enemyScore
          }
        };
      }

      return {
        ...state,
        currentHand: state.nextHand,
        nextHand: action.payload.nextHand,
        status: {
          ...state.status,
          turn: action.payload.nextTurn
        },
        canEndTurn: false,
        history: []
      };
    }

    case 'UNDO_LAST_MOVE': {
      if (state.history.length === 0) return state;
      
      const lastMove = state.history[state.history.length - 1];
      return {
        ...state,
        board: lastMove.previousState.board,
        currentHand: [...state.currentHand, lastMove.card],
        status: {
          ...state.status,
          allyScore: lastMove.previousState.scores.allyScore,
          enemyScore: lastMove.previousState.scores.enemyScore
        },
        canEndTurn: false,
        history: state.history.slice(0, -1)
      };
    }

    case 'RESET_GAME':
      return initialState;

    case 'UPDATE_SCORES':
      return {
        ...state,
        status: {
          ...state.status,
          allyScore: action.payload.allyScore,
          enemyScore: action.payload.enemyScore
        }
      };

    default:
      return state;
  }
}

export function useGameState(stage: number) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const searchParams = useSearchParams();
  const currentStage = Number(searchParams.get('stage')) || 1;
  const { clearStage } = useGameProgress();

  const initializeGame = useCallback(() => {
    // 1ターン目のカード
    const initialHand = generateHandWithStageBonus(1, stage);
    // 2ターン目のカード
    const nextHand = generateHandWithStageBonus(2, stage);
    
    dispatch({ 
      type: 'INITIALIZE_GAME', 
      payload: { 
        currentHand: initialHand, 
        nextHand: nextHand,
        currentStage: stage 
      } 
    });
    setIsInitialized(true);
  }, [stage]);

  useEffect(() => {
    if (!isInitialized) {
      initializeGame();
    }
  }, [isInitialized, initializeGame]);

  useEffect(() => {
    if (state.status.gameOver && state.status.winner === 'ally') {
      clearStage(currentStage);
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, [state.status.gameOver, state.status.winner, currentStage, clearStage]);

  const selectCard = useCallback((card: Card) => {
    dispatch({ type: 'SELECT_CARD', card });
  }, []);

  const placeCard = useCallback((position: Position) => {
    dispatch({ type: 'PLACE_CARD', position });
  }, []);

  const endTurn = useCallback(() => {
    if (state.canEndTurn) {
      const nextTurn = (state.status.turn + 1) as TurnNumber;
      // 次のターンの次のターンのカードを生成
      const nextNextTurn = (nextTurn + 1) as TurnNumber;
      const nextHand = generateHandWithStageBonus(nextNextTurn, state.currentStage);
      
      console.log(`Generating cards for turn ${nextNextTurn}`); // デバッグ用
      
      dispatch({ 
        type: 'END_TURN', 
        payload: { 
          nextHand,
          nextTurn
        } 
      });
    }
  }, [state.canEndTurn, state.status.turn, state.currentStage]);

  const undoLastMove = useCallback(() => {
    if (state.history.length > 0) {
      dispatch({ type: 'UNDO_LAST_MOVE' });
    }
  }, [state.history.length]);

  const resetGame = useCallback(() => {
    setIsInitialized(false);
    dispatch({ type: 'RESET_GAME' });
  }, []);

  useEffect(() => {
    const scores = calculateBoardScores(state.board);
    if (scores.allyScore !== state.status.allyScore || 
        scores.enemyScore !== state.status.enemyScore) {
      dispatch({ 
        type: 'UPDATE_SCORES', 
        payload: scores 
      });
    }
  }, [state.board, state.status.allyScore, state.status.enemyScore]);

  return {
    gameState: { ...state, currentStage: stage },  // stageを明示的に返す
    actions: {
      initializeGame,
      selectCard,
      placeCard,
      endTurn,
      undoLastMove,
      resetGame
    }
  };
}