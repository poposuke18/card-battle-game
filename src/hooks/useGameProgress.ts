import { useState, useEffect } from 'react';
import type { GameProgress } from '@/types';

const STORAGE_KEY = 'cardBattleGameProgress';

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>({
    clearedStages: [],
    currentStage: 1
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const saveProgress = (updatedProgress: GameProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    setProgress(updatedProgress);
  };

  const clearStage = (stageNumber: number) => {
    const updatedProgress = {
      ...progress,
      clearedStages: [...new Set([...progress.clearedStages, stageNumber])].sort()
    };
    saveProgress(updatedProgress);
  };

  const isStageCleared = (stageNumber: number) => {
    return progress.clearedStages.includes(stageNumber);
  };

  const isStageAvailable = (stageNumber: number) => {
    if (stageNumber === 1) return true;
    return isStageCleared(stageNumber - 1);
  };

  return {
    progress,
    clearStage,
    isStageCleared,
    isStageAvailable
  };
}