// src/components/status/GameStatus.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { GameStatus as GameStatusType } from '@/types';

type GameStatusProps = {
  status: GameStatusType;
};

export function GameStatus({ status }: GameStatusProps) {
  const scoreDifference = status.allyScore - status.enemyScore;
  const isWinning = scoreDifference > 0;

  return (
    <div className="mb-8 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm">
      <div className="flex justify-between items-center">
        {/* スコア表示 */}
        <div className="flex gap-8 items-center">
          {/* 味方スコア */}
          <motion.div
            key={`ally-${status.allyScore}`}
            initial={{ scale: 1 }}
            animate={status.gameOver ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-sm text-gray-400 mb-1">味方スコア</div>
            <div className="text-2xl font-bold text-blue-400">
              {status.allyScore}
            </div>
          </motion.div>

          {/* スコア差分 */}
          <AnimatePresence>
            {!status.gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className={`text-sm ${
                  scoreDifference > 0 ? 'text-green-400' : 
                  scoreDifference < 0 ? 'text-red-400' : 
                  'text-gray-400'
                }`}
              >
                {scoreDifference > 0 && '+'}
                {scoreDifference}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 敵スコア */}
          <motion.div
            key={`enemy-${status.enemyScore}`}
            initial={{ scale: 1 }}
            animate={status.gameOver ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-sm text-gray-400 mb-1">敵スコア</div>
            <div className="text-2xl font-bold text-red-400">
              {status.enemyScore}
            </div>
          </motion.div>
        </div>

        {/* ターン情報とゲーム状態 */}
        <div className="flex items-center gap-4">
          {/* ターン表示 */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">ターン</div>
            <motion.div
              key={status.turn}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-purple-400"
            >
              {status.turn}/8
            </motion.div>
          </div>

          {/* ゲーム状態 */}
          <AnimatePresence>
            {status.gameOver && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`px-4 py-2 rounded-lg ${
                  status.winner === 'ally'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {status.winner === 'ally' ? 'クリア！' : 'ゲームオーバー'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 進行バー */}
      <div className="mt-4 bg-gray-700/50 h-1 rounded overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(status.turn / 8) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}