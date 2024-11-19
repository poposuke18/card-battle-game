// src/components/score/AnimatedScore.tsx

import { memo } from 'react';
import { motion } from 'framer-motion';

type AnimatedScoreProps = {
  score: number;
  isAffected: boolean;
  previousScore: number;
  className?: string;
};

export const AnimatedScore = memo(({ 
  score, 
  isAffected, 
  previousScore, 
  className = '' 
}: AnimatedScoreProps) => {
  const difference = score - previousScore;
  const isPositive = difference > 0;
  
  return (
    <div className="relative">
      <motion.span
        key={score}
        className={`font-bold relative ${className}
          ${isAffected ? 'text-lg' : 'text-sm'}
          ${isAffected && isPositive ? 'text-green-300' : ''}
          ${isAffected && !isPositive ? 'text-red-300' : ''}`}
        initial={isAffected ? { scale: 1 } : {}}
        animate={isAffected ? { 
          scale: [1, 1.5, 1],
          transition: { duration: 0.5 }
        } : {}}
      >
        {score}
      </motion.span>
      
      {isAffected && difference !== 0 && (
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className={`absolute -right-6 -top-1 text-xs
            ${isPositive ? 'text-green-400' : 'text-red-400'}`}
        >
          <span className="mr-1">{isPositive ? '↑' : '↓'}</span>
          {Math.abs(difference)}
        </motion.span>
      )}
    </div>
  );
});

AnimatedScore.displayName = 'AnimatedScore';