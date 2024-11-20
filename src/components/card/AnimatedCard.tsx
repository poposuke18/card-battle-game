import { motion } from 'framer-motion';
import { Card } from '@/types';
import { getClassDisplayName, getClassIcon } from '@/utils/common';
import { 
  EffectIcon, 
  EffectDescription 
} from '../effects/EffectDisplay';

type CardProps = {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  index: number;
  isNew?: boolean;
  board?: (PlacedCard | null)[][];
};

export function AnimatedCard({
  card,
  isSelected,
  onClick,
  index,
  isNew,
  board,
  position  // これを追加
}: CardProps & { position?: Position }) {  // 型定義も追加
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
      className={`
        w-32 h-48 rounded-lg p-2 cursor-pointer transition-all relative
        ${card.type === 'ally' ? 'bg-blue-500/90 text-white' : 'bg-red-500/90 text-white'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
        shadow-lg hover:shadow-xl
      `}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        {/* カード名とアイコン */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[11px]">{card.name}</span>
            {card.effect && <EffectIcon effect={card.effect} className="text-[14px]" />}
          </div>
          
          {/* カテゴリーとクラス */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center gap-1 text-[9px] bg-white/10 px-1 py-1 rounded">
              {card.category === 'unit' && card.class && (
                <>
                  <span className="text-base">{getClassIcon(card.class)}</span>
                  <span>{getClassDisplayName(card.class)}</span>
                </>
              )}
              {card.category === 'field' && (
                <>
                  <span className="text-base">🏰</span>
                  <span>フィールド</span>
                </>
              )}
              {card.category === 'support' && (
                <>
                  <span className="text-base">📜</span>
                  <span>サポート</span>
                </>
              )}
              {card.category === 'weapon' && (
                <>
                  <span className="text-base">🗡️</span>
                  <span>武器</span>
                </>
              )}
            </div>
          </div>

          {(card.effect?.type.startsWith('LEGENDARY_')) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                boxShadow: ['0 0 10px rgba(255, 215, 0, 0.3)', '0 0 20px rgba(255, 215, 0, 0.5)', '0 0 10px rgba(255, 215, 0, 0.3)']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          {(card.effect?.type.startsWith('BOSS_')) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                boxShadow: ['0 0 12px rgba(255, 10, 10, 0.3)', '0 0 20px rgba(255, 10, 10, 0.5)', '0 0 12px rgba(255, 10, 10, 0.3)']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* 効果の説明 */}
          {card.effect && (
  <EffectDescription 
    effect={card.effect}
    className="text-[9px] mb-1 p-1 bg-white/10 rounded leading-tight"
    board={board}  // これらを追加
    position={position}  // これらを追加
  />
)}
        </div>

        {/* ポイント表示 */}
        <div className="flex items-center justify-between bg-black/20 p-1 rounded">
          <div className="text-[10px] opacity-80">基礎点</div>
          <div className="text-[12px] font-bold">{card.points}</div>
        </div>
      </div>
    </motion.div>
  );
}