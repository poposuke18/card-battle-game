// src/components/score/AnimatedScore.tsx

import { motion } from 'framer-motion';

type AnimatedScoreProps = {
  score: number;
  isAffected: boolean;
  previousScore: number;
  className?: string;
};

export function AnimatedScore({ 
  score, 
  isAffected, 
  previousScore, 
  className = '' 
}: AnimatedScoreProps) {
  const difference = score - previousScore;
  const isPositive = difference > 0;

  return (
    <motion.span
      key={score}
      className={`font-bold relative ${className}
        ${isAffected ? 'text-lg' : 'text-sm'}
        ${isAffected && isPositive ? 'text-green-300' : ''}
        ${isAffected && !isPositive ? 'text-yellow-300' : ''}`}
      initial={isAffected ? { scale: 1 } : {}}
      animate={isAffected ? { 
        scale: [1, 1.5, 1],
        transition: { duration: 0.5 }
      } : {}}
    >
      {score}
      {isAffected && (
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={`absolute -right-4 text-xs ${
            isPositive ? 'text-green-400' : 'text-yellow-400'
          }`}
        >
          {isPositive ? `+${difference}` : difference}
        </motion.span>
      )}
    </motion.span>
  );
}