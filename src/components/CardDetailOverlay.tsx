import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlacedCard, Position } from '@/types';
import { CardDetails } from './board/CardDetails';

type CardDetailOverlayProps = {
  hoveredCard: {
    card: PlacedCard;
    position: Position;
  } | null;
  board: (PlacedCard | null)[][];
};

export function CardDetailOverlay({ hoveredCard, board }: CardDetailOverlayProps) {
  return (
    <div className="fixed top-32 right-8 z-50 pointer-events-none">
      <AnimatePresence>
        {hoveredCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <CardDetails
              card={hoveredCard.card}
              board={board}
              position={hoveredCard.position}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}