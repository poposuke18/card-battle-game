"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function TitleScreen() {
  const [showStageSelect, setShowStageSelect] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const { isStageAvailable, isStageCleared } = useGameProgress();

  const handleStartGame = () => {
    setShowStageSelect(true);
  };

  const handleStageSelect = (stage: number) => {
    setSelectedStage(stage);
    setTimeout(() => {
      window.location.href = `/game?stage=${stage}`;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400"
        >
          Card Battle Game
        </motion.h1>

        <AnimatePresence mode="wait">
          {!showStageSelect ? (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={handleStartGame}
                className="px-8 py-4 text-2xl bg-blue-600 text-white rounded-lg hover:bg-blue-500 
                         transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Game Start
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="stages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {selectedStage === null ? (
                <>
                  <h2 className="text-2xl text-gray-300 mb-4">Select Stage</h2>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {[1, 2, 3, 4].map((stage) => {
                      const available = isStageAvailable(stage);
                      const cleared = isStageCleared(stage);
                      
                      return (
                        <motion.button
                          key={stage}
                          onClick={() => available && handleStageSelect(stage)}
                          className={`
                            p-4 text-xl rounded-lg shadow-lg transition-colors
                            ${available 
                              ? cleared
                                ? 'bg-green-600 hover:bg-green-500'
                                : 'bg-blue-600 hover:bg-blue-500'
                              : 'bg-gray-700 opacity-50 cursor-not-allowed'
                            }
                            text-white relative
                          `}
                          whileHover={available ? { scale: 1.05 } : {}}
                          whileTap={available ? { scale: 0.95 } : {}}
                          disabled={!available}
                        >
                          Stage {stage}
                          {cleared && (
                            <span className="absolute top-1 right-1 text-xs bg-yellow-400 text-black px-1 rounded">
                              ★
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl text-blue-400 font-bold"
                >
                  Stage {selectedStage}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}