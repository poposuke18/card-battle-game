import { PlacedCard, Position } from '@/types';
import { ScorePopup } from '../score';
import { getClassDisplayName, getClassIcon } from '@/utils/common';
import { calculateCardScore } from '@/utils/score/calculator';
import { getEffectDescription } from '@/utils/score/calculator';

type CardDetailsProps = {
  card: PlacedCard;
  board: (PlacedCard | null)[][];
  position: Position;
};

export function CardDetails({ card, board, position }: CardDetailsProps) {
  const scoreDetails = calculateCardScore(position, board, card);

  return (
    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                   bg-gray-900 p-3 rounded-lg shadow-xl z-10 w-56
                   border border-gray-700 text-gray-100">
      {/* カード名とクラス */}
      <div className="font-bold mb-2 text-base border-b border-gray-700 pb-1 text-gray-200">
        {card.card.name}
        {card.card.class && (
          <span className="ml-2 text-sm opacity-70">
            ({getClassDisplayName(card.card.class)})
          </span>
        )}
      </div>
      
      {/* カードタイプと種類 */}
      <div className="mb-2 text-xs text-gray-400">
        {card.card.category === 'unit' ? 'ユニット' : 
         card.card.category === 'field' ? 'フィールド' : '武器'}
        {card.card.type === 'ally' ? ' / 味方' : ' / 敵'}
      </div>

      {/* 効果の説明 */}
      {card.card.effect && (
        <div className="mb-3 text-sm">
          <div className="font-semibold text-yellow-400 mb-1">効果</div>
          <div className="bg-gray-800 rounded p-2 text-gray-300">
            {getEffectDescription(card.card)}
          </div>
        </div>
      )}
      
      {/* スコア詳細 */}
      <div className="bg-gray-800/50 rounded p-2">
        <ScorePopup scoreDetails={scoreDetails} />
      </div>

      {/* カードの詳細情報 */}
      <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span className="text-base">{getClassIcon(card.card.class)}</span>
          <span>ターン {card.card.turn}</span>
        </div>
      </div>
    </div>
  );
}