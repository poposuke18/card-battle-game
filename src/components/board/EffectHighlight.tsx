import type { Position, PlacedCard } from '@/types';
import { motion } from 'framer-motion';
import { 
  DiagonalPattern, 
  CrossPattern, 
  VerticalPattern, 
  HorizontalPattern 
} from './EffectPatterns';
import { getWeaponEffectPositions, getBaseEffectPositions } from '@/utils/effect-utils';

type EffectHighlightProps = {
  position: Position;
  board: (PlacedCard | null)[][];
};

export function EffectHighlight({ position, board }: EffectHighlightProps) {
  const cell = board[position.row]?.[position.col];
  if (!cell?.card.effect) return null;

  const getWeaponEffectStyle = () => {
    return `absolute inset-0 rounded-lg pointer-events-none ${
      cell.card.type === 'ally' ? 'border-2 border-blue-400/50' : 'border-2 border-red-400/50'
    }`;
  };

  const getBaseEffectStyle = () => {
    const baseStyle = "absolute inset-0 rounded-lg pointer-events-none";
    if (cell.card.type === 'ally') {
      return `${baseStyle} ${
        'type' in cell.card.effect! && cell.card.effect.type.includes('DEBUFF') 
          ? 'bg-red-400/30' 
          : 'bg-blue-400/30'
      }`;
    }
    return `${baseStyle} ${
      'type' in cell.card.effect! && cell.card.effect.type.includes('DEBUFF')
        ? 'bg-red-400/30' 
        : 'bg-purple-400/30'
    }`;
  };

  return (
    <>
      {'targetClass' in cell.card.effect && (
        <>
          <div className={getWeaponEffectStyle()}>
            {cell.card.effect.type === 'DIAGONAL_BOOST' && <DiagonalPattern />}
            {cell.card.effect.type === 'CROSS_FORMATION' && <CrossPattern />}
            {cell.card.effect.type === 'VERTICAL_BOOST' && <VerticalPattern />}
            {cell.card.effect.type === 'HORIZONTAL_BOOST' && <HorizontalPattern />}
          </div>
          
          {getWeaponEffectPositions(position, cell, board).map((pos: Position) => (
            <motion.div
              key={`weapon-effect-${pos.row}-${pos.col}`}
              className={`absolute w-full h-full ${
                cell.card.type === 'ally' ? 'bg-blue-400/20' : 'bg-red-400/20'
              }`}
              style={{
                top: `${(pos.row - position.row) * 100}%`,
                left: `${(pos.col - position.col) * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </>
      )}

      {!('targetClass' in cell.card.effect) && (
        <>
          <div className={getBaseEffectStyle()} />
          {getBaseEffectPositions(position, cell, board).map((pos: Position) => (
            <motion.div
              key={`base-effect-${pos.row}-${pos.col}`}
              className={`absolute w-full h-full ${
                cell.card.type === 'ally' ? 'bg-blue-400/20' : 'bg-red-400/20'
              }`}
              style={{
                top: `${(pos.row - position.row) * 100}%`,
                left: `${(pos.col - position.col) * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </>
      )}
    </>
  );
}