// src/components/board/PreviewContent.tsx

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/types';

export type PreviewContentProps = {
  card: Card;
  previewScore: number | null; 
};

export const PreviewContent = memo(({ 
  card, 
  previewScore 
}: PreviewContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 rounded-lg overflow-hidden"
    >
      {/* 背景のオーバーレイ */}
      <div className="absolute inset-0 bg-gray-900/50" />

      {/* スコアのプレビュー */}
      {previewScore !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`
            text-lg font-bold
            ${previewScore > 0 ? 'text-green-400' : 'text-red-400'}
          `}>
            {previewScore > 0 ? '+' : ''}{previewScore}
          </span>
        </div>
      )}

      {/* カード情報のプレビュー */}
      <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center text-[8px] text-white/80">
        <span className="truncate">{card.name}</span>
        <span className="ml-1">{card.points}</span>
      </div>
    </motion.div>
  );
});

PreviewContent.displayName = 'PreviewContent';