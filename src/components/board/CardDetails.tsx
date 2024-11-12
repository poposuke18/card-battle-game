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
    <div className="bg-gray-900/95 p-4 rounded-xl shadow-xl border border-gray-700 
                    text-gray-100 backdrop-blur-sm min-w-[300px]
                    transform transition-all duration-200 ease-in-out">
      {/* カード名とクラス */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
        <div>
          <div className="font-bold text-lg text-gray-200">
            {card.card.name}
          </div>
          {card.card.class && (
            <div className="text-sm text-gray-400 flex items-center gap-1">
              <span>{getClassIcon(card.card.class)}</span>
              <span>{getClassDisplayName(card.card.class)}</span>
            </div>
          )}
        </div>
        <div className="text-2xl opacity-90">
          {card.card.category === 'unit' && card.card.class && getClassIcon(card.card.class)}
          {card.card.category === 'weapon' && '⚔️'}
          {card.card.category === 'field' && '🏰'}
        </div>
      </div>
      
      {/* カードタイプと種類 */}
      <div className="mb-3 text-sm">
        <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
          {card.card.category === 'unit' ? 'ユニット' : 
           card.card.category === 'field' ? 'フィールド' : '武器'}
        </span>
        <span className="mx-2 text-gray-500">•</span>
        <span className={`px-2 py-1 rounded ${
          card.card.type === 'ally' ? 'bg-blue-900/50 text-blue-200' : 'bg-red-900/50 text-red-200'
        }`}>
          {card.card.type === 'ally' ? '味方' : '敵'}
        </span>
      </div>

      {/* 効果の説明 */}
      {card.card.effect && (
        <div className="mb-4">
          <div className="font-semibold text-yellow-400 mb-1">効果</div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-gray-300 leading-relaxed">
            {getEffectDescription(card.card)}
          </div>
        </div>
      )}
      
      {/* スコア詳細 */}
      <div className="bg-gray-800/50 rounded-lg p-3">
        <ScorePopup scoreDetails={scoreDetails} />
      </div>

      {/* ターン情報 */}
      <div className="mt-2 pt-2 text-xs text-gray-400 flex justify-end items-center gap-2">
        <span>ターン {card.card.turn}</span>
        <span className="text-gray-600">•</span>
        <span>位置: ({position.row + 1}, {position.col + 1})</span>
      </div>
    </div>
  );
}