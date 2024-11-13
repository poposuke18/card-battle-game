import { ScoreDetails } from '@/utils/score/types';
import { motion } from 'framer-motion';

type ScorePopupProps = {
  scoreDetails: ScoreDetails;
  className?: string;
};

export function ScorePopup({ scoreDetails, className = '' }: ScorePopupProps) {
  return (
    <div className={`${className} space-y-2`}>
      {/* 基礎点 */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400">基礎点:</span>
        <span className="font-semibold">{scoreDetails.basePoints}</span>
      </div>

      {/* 基本効果ボーナス */}
      {scoreDetails.effectPoints !== 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">基本効果:</span>
          <span className={`font-semibold ${
            scoreDetails.effectPoints > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {scoreDetails.effectPoints > 0 ? '+' : ''}{scoreDetails.effectPoints}
          </span>
        </div>
      )}

      {/* リーダー効果ボーナス */}
      {scoreDetails.leaderEffectPoints !== 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">リーダー効果:</span>
          <span className={`font-semibold ${
            scoreDetails.leaderEffectPoints > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {scoreDetails.leaderEffectPoints > 0 ? '+' : ''}{scoreDetails.leaderEffectPoints}
          </span>
        </div>
      )}

      {/* 合計 */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-700">
        <span className="font-bold text-gray-200">合計:</span>
        <span className="font-bold text-xl">
          {scoreDetails.totalPoints}
        </span>
      </div>
    </div>
  );
}