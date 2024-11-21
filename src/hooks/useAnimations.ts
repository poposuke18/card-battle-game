// src/hooks/useAnimations.ts

import { useState, useCallback, useRef } from 'react';
import { AnimationState, Position } from '@/types';

export function useAnimations() {
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());
  const animationQueue = useRef<Animation[]>([]);

  // アニメーション状態の管理
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    type: '',
    duration: 0
  });

  // カードの配置アニメーション
  const animateCardPlacement = useCallback(async (
    cardId: string
  ) => {
    setAnimatingCards(prev => new Set(prev).add(cardId));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAnimatingCards(prev => {
      const next = new Set(prev);
      next.delete(cardId);
      return next;
    });
  }, []);

  // 効果発動アニメーション
  const animateEffect = useCallback(async (
    sourcePosition: Position,
    targetPositions: Position[],
    duration: number = 500
  ) => {
    setAnimationState({
      isAnimating: true,
      type: 'effect',
      duration
    });

    await new Promise(resolve => setTimeout(resolve, duration));

    setAnimationState({
      isAnimating: false,
      type: '',
      duration: 0
    });
  }, []);

  // スコア変動アニメーション
  const animateScoreChange = useCallback(async () => {
    setAnimationState({
      isAnimating: true,
      type: 'score',
      duration: 300
    });
  
    await new Promise(resolve => setTimeout(resolve, 300));
  
    setAnimationState({
      isAnimating: false,
      type: '',
      duration: 0
    });
  }, []);

  // アニメーションのクリーンアップ
  const clearAnimations = useCallback(() => {
    setAnimatingCards(new Set());
    setAnimationState({
      isAnimating: false,
      type: '',
      duration: 0
    });
    animationQueue.current = [];
  }, []);

  return {
    animatingCards,
    animationState,
    animateCardPlacement,
    animateEffect,
    animateScoreChange,
    clearAnimations
  };
}