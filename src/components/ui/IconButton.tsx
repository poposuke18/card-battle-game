// src/components/ui/IconButton.tsx

import { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { ButtonProps } from './Button';

type IconButtonProps = Omit<ButtonProps, 'children'> & {
  icon: React.ReactNode;
  label?: string;
};

export const IconButton = memo(forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        rounded-full flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      {...props}
    >
      {icon}
    </motion.button>
  );
}));

IconButton.displayName = 'IconButton';