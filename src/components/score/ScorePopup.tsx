// src/components/score/ScorePopup.tsx

import { ScoreDetails } from '@/utils/score/types';

type ScorePopupProps = {
  scoreDetails: ScoreDetails;
  className?: string;
};

export function ScorePopup({ scoreDetails, className = '' }: ScorePopupProps) {
  return (
    <div className={`${className} space-y-1 text-gray-200`}>
      <div className="flex justify-between">
        <span>基礎:</span>
        <span>{scoreDetails.basePoints}</span>
      </div>
      <div className="flex justify-between">
        <span>効果:</span>
        <span className={scoreDetails.effectPoints >= 0 ? 'text-green-400' : 'text-red-400'}>
          {scoreDetails.effectPoints >= 0 ? '+' : ''}{scoreDetails.effectPoints}
        </span>
      </div>
      <div className="flex justify-between font-bold border-t border-gray-700 pt-1 mt-1">
        <span>合計:</span>
        <span>{scoreDetails.totalPoints}</span>
      </div>
    </div>
  );
}