// components/Card.tsx

import { Card as CardType } from '@/types/game';

type CardProps = {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Card({ card, isSelected, onClick }: CardProps) {
  // 効果の説明文を生成する関数
  const getEffectDescription = (card: CardType) => {
    if (!card.effect) return null;

    switch (card.effect.type) {
        case 'POWER_UP_BY_ENEMY_LINE':
            return `縦か横に敵ユニットが2体並んでいる隣に配置すると攻撃力+${card.effect.power}`;    
      case 'POWER_UP_BY_ALLY':
        return `隣接する味方ユニット1体につき攻撃力+${card.effect.power}`;
      case 'BUFF_ADJACENT':
        return `隣接する${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
      case 'DAMAGE_ADJACENT':
        return `隣接するユニットの攻撃力-${card.effect.power}`;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-32 h-48 rounded-lg p-3 cursor-pointer transition-all relative
        ${card.type === 'ally' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
      `}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="font-bold text-sm mb-1">{card.name}</div>
          <div className="text-xs text-gray-600 mb-2">{card.description}</div>
        </div>
        
        {card.effect && (
          <div className="text-xs mb-2 p-2 bg-white/50 rounded">
            {getEffectDescription(card)}
          </div>
        )}
        
        <div className="text-lg font-bold">
          基礎: {card.points}
        </div>
      </div>
    </div>
  );
}