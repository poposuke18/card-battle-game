// src/components/status/ScoreDisplay.tsx

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ScoreDisplayProps = {
  allyScore: number;
  enemyScore: number;
  showDifference?: boolean;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const ScoreDisplay = memo(({
  allyScore,
  enemyScore,
  showDifference = true,
  animate = true,
  size = 'md',
  className = ''
}: ScoreDisplayProps) => {
  const scoreDifference = allyScore - enemyScore;
  const isWinning = scoreDifference > 0;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const ScoreWrapper = animate ? motion.div : 'div';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 味方スコア */}
      <ScoreWrapper
        key={`ally-${allyScore}`}
        {...(animate ? {
          initial: { scale: 1 },
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: 0.3 }
        } : {})}
        className="text-center"
      >
        <div className="text-sm text-gray-400 mb-1">味方</div>
        <div className={`font-bold text-blue-400 ${sizeClasses[size]}`}>
          {allyScore}
        </div>
      </ScoreWrapper>

      {/* スコア差分 */}
      {showDifference && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={`text-sm ${
              isWinning ? 'text-green-400' : 
              scoreDifference < 0 ? 'text-red-400' : 
              'text-gray-400'
            }`}
          >
            {scoreDifference > 0 && '+'}
            {scoreDifference}
          </motion.div>
        </AnimatePresence>
      )}

      {/* 敵スコア */}
      <ScoreWrapper
        key={`enemy-${enemyScore}`}
        {...(animate ? {
          initial: { scale: 1 },
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: 0.3 }
        } : {})}
        className="text-center"
      >
        <div className="text-sm text-gray-400 mb-1">敵</div>
        <div className={`font-bold text-red-400 ${sizeClasses[size]}`}>
          {enemyScore}
        </div>
      </ScoreWrapper>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';