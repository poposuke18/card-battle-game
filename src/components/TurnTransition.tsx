// src/components/TurnTransition.tsx

import { motion, AnimatePresence } from 'framer-motion';

type TurnTransitionProps = {
  turn: number;
  isVisible: boolean;
};

export default function TurnTransition({ turn, isVisible }: TurnTransitionProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="bg-gradient-to-r from-blue-500 to-red-500 text-white px-12 py-6 rounded-lg
                     shadow-lg backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold text-center">
              Turn {turn}
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}