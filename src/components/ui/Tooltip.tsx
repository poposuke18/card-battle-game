// src/components/ui/Tooltip.tsx

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
};

export const Tooltip = memo(({
  content,
  children,
  position = 'top',
  delay = 200,
  className = ''
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`
              absolute z-50 px-2 py-1 text-sm text-white
              bg-gray-900 rounded shadow-lg whitespace-nowrap
              pointer-events-none
              ${positionStyles[position]}
              ${className}
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Tooltip.displayName = 'Tooltip';