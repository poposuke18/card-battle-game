'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Card } from '@/types';
import { 
  TURN1_CARDS, TURN2_CARDS, TURN3_CARDS, TURN4_CARDS,
  TURN5_CARDS, TURN6_CARDS, TURN7_CARDS, TURN8_CARDS,
  getBossCardForStage
} from '@/constants';
import { calculateCardEffects } from '@/utils/card-effects';

// ゲーム状態の型定義
export interface GameState {
  stage: number;
  turn: number;
  maxTurns: number;
  board: (Card | null)[][];
  hand: Card[];
  placedCards: number;
  totalCards: number;
  scores: {
    ally: number;
    enemy: number;
    total: number;
  };
  selectedCard: number | null;
  hoveredCell: { row: number; col: number } | null;
  gamePhase: 'placement' | 'turnEnd' | 'gameEnd';
  turnStartState: {
    board: (Card | null)[][];
    hand: Card[];
    placedCards: number;
  } | null;
  debugMode: {
    enabled: boolean;
    showCardSelector: boolean;
  };
}

// アクションの型定義
type GameAction = 
  | { type: 'SELECT_CARD'; payload: number | null }
  | { type: 'HOVER_CELL'; payload: { row: number; col: number } | null }
  | { type: 'PLACE_CARD'; payload: { row: number; col: number } }
  | { type: 'END_TURN' }
  | { type: 'RESET_GAME' }
  | { type: 'RESET_TURN' }
  | { type: 'START_GAME'; payload: { stage: number } }
  | { type: 'TOGGLE_DEBUG_MODE' }
  | { type: 'TOGGLE_CARD_SELECTOR' }
  | { type: 'ADD_DEBUG_CARD'; payload: Card };

// ターン別手札サイズ（味方+敵カード数）
const TURN_HAND_SIZES = [6, 4, 2, 2, 4, 4, 2, 1];

// ターン別カードデータ
const TURN_CARDS = [
  TURN1_CARDS, TURN2_CARDS, TURN3_CARDS, TURN4_CARDS,
  TURN5_CARDS, TURN6_CARDS, TURN7_CARDS, TURN8_CARDS
];

// 初期状態
const initialState: GameState = {
  stage: 1,
  turn: 1,
  maxTurns: 8,
  board: Array.from({ length: 5 }, () => Array(5).fill(null)),
  hand: [],
  placedCards: 0,
  totalCards: 25,
  scores: { ally: 0, enemy: 0, total: 0 },
  selectedCard: null,
  hoveredCell: null,
  gamePhase: 'placement',
  turnStartState: null,
  debugMode: {
    enabled: false,
    showCardSelector: false,
  }
};

// ゲームロジック関数
function drawCards(turn: number, stage: number): Card[] {
  const turnIndex = turn - 1;
  if (turnIndex >= TURN_CARDS.length) return [];
  
  const availableCards = [...TURN_CARDS[turnIndex]];
  
  // ターン8は敵のボスカードのみ
  if (turn === 8) {
    const bossCard = getBossCardForStage(stage);
    return bossCard ? [bossCard] : [];
  }
  
  // ターン8以外は味方と敵を均等に配分
  const handSize = TURN_HAND_SIZES[turnIndex];
  const allyCards = availableCards.filter(card => card.type === 'ally');
  const enemyCards = availableCards.filter(card => card.type === 'enemy');
  
  const allyCount = Math.ceil(handSize / 2);
  const enemyCount = handSize - allyCount;
  
  const selectedCards: Card[] = [];
  
  // 味方カードをランダム選択
  for (let i = 0; i < allyCount && allyCards.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * allyCards.length);
    selectedCards.push(allyCards.splice(randomIndex, 1)[0]);
  }
  
  // 敵カードをランダム選択
  for (let i = 0; i < enemyCount && enemyCards.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * enemyCards.length);
    selectedCards.push(enemyCards.splice(randomIndex, 1)[0]);
  }
  
  return selectedCards;
}

function calculateScore(board: (Card | null)[][]): { ally: number; enemy: number; total: number } {
  let ally = 0;
  let enemy = 0;
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const card = board[row][col];
      if (card) {
        // 基本ポイント + 効果によるボーナス/ペナルティ
        const effectBonus = calculateCardEffects(board, { row, col }, card);
        const finalPoints = Math.max(0, card.points + effectBonus);
        
        if (card.type === 'ally') {
          ally += finalPoints;
        } else {
          enemy += finalPoints;
        }
      }
    }
  }
  
  return {
    ally,
    enemy,
    total: ally - enemy
  };
}

// リデューサー
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      const startGameHand = drawCards(1, action.payload.stage);
      const newState = {
        ...initialState,
        stage: action.payload.stage,
        hand: startGameHand,
      };
      return {
        ...newState,
        turnStartState: {
          board: newState.board.map(row => [...row]),
          hand: [...newState.hand],
          placedCards: newState.placedCards
        }
      };
    
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: action.payload
      };
    
    case 'HOVER_CELL':
      return {
        ...state,
        hoveredCell: action.payload
      };
    
    case 'PLACE_CARD':
      if (state.selectedCard === null || state.gamePhase !== 'placement') return state;
      
      const { row, col } = action.payload;
      if (state.board[row][col] !== null) return state; // 既に配置済み
      
      const cardToPlace = state.hand[state.selectedCard];
      if (!cardToPlace) return state;
      
      const newBoard = state.board.map((boardRow, rowIndex) =>
        boardRow.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? cardToPlace : cell
        )
      );
      
      const newHand = state.hand.filter((_, index) => index !== state.selectedCard);
      const newPlacedCards = state.placedCards + 1;
      const newScores = calculateScore(newBoard);
      
      // 手札が空になったらターン終了フェーズへ
      const newGamePhase = newHand.length === 0 ? 'turnEnd' : 'placement';
      
      return {
        ...state,
        board: newBoard,
        hand: newHand,
        placedCards: newPlacedCards,
        scores: newScores,
        selectedCard: null,
        hoveredCell: null,
        gamePhase: newGamePhase
      };
    
    case 'END_TURN':
      if (state.turn >= state.maxTurns) {
        return {
          ...state,
          gamePhase: 'gameEnd'
        };
      }
      
      const nextTurn = state.turn + 1;
      const nextTurnHand = drawCards(nextTurn, state.stage);
      
      const nextTurnState = {
        ...state,
        turn: nextTurn,
        hand: nextTurnHand,
        selectedCard: null,
        hoveredCell: null,
        gamePhase: 'placement' as const
      };
      
      return {
        ...nextTurnState,
        turnStartState: {
          board: nextTurnState.board.map(row => [...row]),
          hand: [...nextTurnState.hand],
          placedCards: nextTurnState.placedCards
        }
      };
    
    case 'RESET_TURN':
      if (!state.turnStartState) return state;
      
      return {
        ...state,
        board: state.turnStartState.board.map(row => [...row]),
        hand: [...state.turnStartState.hand],
        placedCards: state.turnStartState.placedCards,
        scores: calculateScore(state.turnStartState.board),
        selectedCard: null,
        hoveredCell: null,
        gamePhase: 'placement'
      };
    
    case 'RESET_GAME':
      const resetGameHand = drawCards(1, state.stage);
      const resetState = {
        ...initialState,
        stage: state.stage,
        hand: resetGameHand
      };
      return {
        ...resetState,
        turnStartState: {
          board: resetState.board.map(row => [...row]),
          hand: [...resetState.hand],
          placedCards: resetState.placedCards
        }
      };
    
    case 'TOGGLE_DEBUG_MODE':
      return {
        ...state,
        debugMode: {
          ...state.debugMode,
          enabled: !state.debugMode.enabled,
          showCardSelector: false,
        }
      };
    
    case 'TOGGLE_CARD_SELECTOR':
      return {
        ...state,
        debugMode: {
          ...state.debugMode,
          showCardSelector: !state.debugMode.showCardSelector,
        }
      };
    
    case 'ADD_DEBUG_CARD':
      return {
        ...state,
        hand: [...state.hand, action.payload],
      };
    
    default:
      return state;
  }
}

// コンテキスト作成
interface GameContextType {
  state: GameState;
  selectCard: (index: number | null) => void;
  hoverCell: (row: number, col: number) => void;
  unhoverCell: () => void;
  placeCard: (row: number, col: number) => void;
  endTurn: () => void;
  resetGame: () => void;
  resetTurn: () => void;
  startGame: (stage: number) => void;
  toggleDebugMode: () => void;
  toggleCardSelector: () => void;
  addDebugCard: (card: Card) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const selectCard = useCallback((index: number | null) => {
    dispatch({ type: 'SELECT_CARD', payload: index });
  }, []);
  
  const hoverCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'HOVER_CELL', payload: { row, col } });
  }, []);
  
  const unhoverCell = useCallback(() => {
    dispatch({ type: 'HOVER_CELL', payload: null });
  }, []);
  
  const placeCard = useCallback((row: number, col: number) => {
    dispatch({ type: 'PLACE_CARD', payload: { row, col } });
  }, []);
  
  const endTurn = useCallback(() => {
    dispatch({ type: 'END_TURN' });
  }, []);
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);
  
  const resetTurn = useCallback(() => {
    dispatch({ type: 'RESET_TURN' });
  }, []);
  
  const startGame = useCallback((stage: number) => {
    dispatch({ type: 'START_GAME', payload: { stage } });
  }, []);
  
  const toggleDebugMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DEBUG_MODE' });
  }, []);
  
  const toggleCardSelector = useCallback(() => {
    dispatch({ type: 'TOGGLE_CARD_SELECTOR' });
  }, []);
  
  const addDebugCard = useCallback((card: Card) => {
    dispatch({ type: 'ADD_DEBUG_CARD', payload: card });
  }, []);
  
  const value: GameContextType = {
    state,
    selectCard,
    hoverCell,
    unhoverCell,
    placeCard,
    endTurn,
    resetGame,
    resetTurn,
    startGame,
    toggleDebugMode,
    toggleCardSelector,
    addDebugCard
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}