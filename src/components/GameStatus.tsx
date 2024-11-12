// src/components/GameStatus.tsx

import { GameStatus as GameStatusType } from '@/types/game';

type GameStatusProps = {
  status: GameStatusType;
};

export default function GameStatus({ status }: GameStatusProps) {
  return (
    <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
      <div className="flex gap-8">
        <div className="text-blue-600">
          <span className="font-bold">味方スコア:</span> {status.allyScore}
        </div>
        <div className="text-red-600">
          <span className="font-bold">敵スコア:</span> {status.enemyScore}
        </div>
      </div>
      <div className="flex gap-8">
        <div>
          <span className="font-bold">ターン:</span> {status.turn}
        </div>
        {status.gameOver && (
          <div className={`font-bold ${status.winner === 'ally' ? 'text-blue-600' : 'text-red-600'}`}>
            {status.winner === 'ally' ? 'クリア！' : 'ゲームオーバー'}
          </div>
        )}
      </div>
    </div>
  );
}