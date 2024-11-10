import { Card as CardType } from '@/types/game';

type CardProps = {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Card({ card, isSelected, onClick }: CardProps) {
  return (
    <div 
      className={`w-24 h-36 rounded-lg p-2 cursor-pointer transition-all
        ${card.type === 'ally' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
      `}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        <div className="font-bold text-sm">{card.name}</div>
        <div className="text-lg font-bold">{card.points}</div>
      </div>
    </div>
  );
}