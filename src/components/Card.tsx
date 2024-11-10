import { Card as CardType } from '@/types/game';

type CardProps = {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Card({ card, isSelected, onClick }: CardProps) {
  return (
    <div 
      className={`w-24 h-36 rounded-lg p-2 cursor-pointer transition-all relative
        ${card.type === 'ally' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
      `}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        <div className="font-bold text-sm mb-1">{card.name}</div>
        <div className="text-xs">
          {card.effect && (
            <div className="mb-1 p-1 bg-white/50 rounded text-xs">
              {card.effect.type === 'BUFF_ADJACENT' && 
                `周囲の${card.type === 'ally' ? '味方' : '敵'}ユニット +${card.effect.power}`}
              {card.effect.type === 'DAMAGE_ADJACENT' && 
                `周囲のユニット -${card.effect.power}`}
              {card.effect.type === 'RANGE_EFFECT' && 
                `範囲${card.effect.range}マス +${card.effect.power}`}
            </div>
          )}
        </div>
        <div className="text-lg font-bold">
          基礎: {card.points}
        </div>
      </div>
    </div>
  );
}