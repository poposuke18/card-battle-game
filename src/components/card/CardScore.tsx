// src/components/card/CardScore.tsx

import { memo } from 'react';
import { motion } from 'framer-motion';

export type CardScoreProps = {
  score: number;
  isAnimated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const CardScore = memo(({ 
  score, 
  isAnimated = false,
  size = 'md',
  className = ''
}: CardScoreProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (isAnimated) {
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        className={`font-bold ${sizeClasses[size]} ${className}`}
      >
        {score}
      </motion.div>
    );
  }

  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`}>
      {score}
    </div>
  );
});

CardScore.displayName = 'CardScore';