import { motion } from 'framer-motion';
import { Card } from '@/types/game';
import { getEffectDescription } from '@/utils/score-calculator';

type CardProps = {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  index: number;
  isNew?: boolean;
};

export default function AnimatedCard({ card, isSelected, onClick, index, isNew }: CardProps) {
  return (
    <motion.div
      initial={isNew ? { scale: 0, x: -100, rotateY: 180 } : { scale: 1 }}
      animate={{ scale: 1, x: 0, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-24 h-36 rounded-lg p-2 cursor-pointer transition-all relative
        ${card.type === 'ally' ? 'bg-blue-500/90 text-white' : 'bg-red-500/90 text-white'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
        shadow-lg hover:shadow-xl`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        {/* カード名と種類 */}
        <div>
          <div className="font-bold text-xs mb-1">{card.name}</div>
          <div className="text-[8px] mb-1 opacity-80">
            {card.category === 'unit' ? 'ユニット' : 'フィールド'}
          </div>
          {/* 効果の説明 */}
          {card.effect && (
            <div className="text-[10px] mb-1 p-1 bg-white/10 rounded">
              {getEffectDescription(card)}
            </div>
          )}
        </div>
        {/* ポイント表示 */}
        <div className="flex items-center justify-between">
          <div className="text-[10px] opacity-80">基礎点</div>
          <div className="text-base font-bold">{card.points}</div>
        </div>
      </div>

      {/* ホバー時のポップアップ（詳細情報） */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900/95 
                   rounded shadow-lg text-white text-xs z-10 pointer-events-none"
      >
        <div className="font-bold mb-1 border-b border-gray-700 pb-1">
          {card.name}
          <span className="ml-1 opacity-70 text-[10px]">
            ({card.category === 'unit' ? 'ユニット' : 'フィールド'})
          </span>
        </div>
        {card.effect && (
          <div className="space-y-1">
            <div className="font-semibold text-gray-300">効果:</div>
            <div className="text-gray-200">{getEffectDescription(card)}</div>
          </div>
        )}
        <div className="mt-2 flex justify-between text-gray-300">
          <span>基礎点:</span>
          <span className="font-bold">{card.points}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}