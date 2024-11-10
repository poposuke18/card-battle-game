// src/components/AnimatedCard.tsx
import { motion } from 'framer-motion';
import { Card as CardType } from '@/types/game';

type CardProps = {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  index: number; // アニメーションの遅延用
  isNew?: boolean; // 新しく配られたカードかどうか
};

export default function AnimatedCard({ card, isSelected, onClick, index, isNew }: CardProps) {
  const getEffectDescription = (card: CardType): string => {
    if (!card.effect) return '';
    switch (card.effect.type) {
        case 'POWER_UP_BY_ENEMY_LINE':
          return `縦か横に敵ユニットが2体並んでいる隣に配置すると攻撃力+${card.effect.power}`;
        case 'POWER_UP_BY_ALLY':
          return `隣接する味方ユニット1体につき攻撃力+${card.effect.power}`;
        case 'BUFF_ADJACENT':
          return `隣接する${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
        case 'DAMAGE_ADJACENT':
          return `隣接するユニットの攻撃力-${card.effect.power}`;
        case 'RANGE_BUFF':
          return `周囲${card.effect.range}マス以内の${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
        case 'FIELD_BUFF':
          return `周囲${card.effect.range}マス以内の${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
        default:
            return '';
      }
      };

  return (
    <motion.div
      initial={isNew ? { scale: 0, x: -100, rotateY: 180 } : { scale: 1 }}
      animate={{ scale: 1, x: 0, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1, // カードごとに表示タイミングをずらす
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
        <div>
          <div className="font-bold text-xs mb-1">{card.name}</div>
          {card.effect && (
            <div className="text-[10px] mb-1 p-1 bg-white/10 rounded">
              {getEffectDescription(card)}
            </div>
          )}
        </div>
        <div className="text-base font-bold">
          {card.points}
        </div>
      </div>
    </motion.div>
  );
}