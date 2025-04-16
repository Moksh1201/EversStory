import React from 'react';
import { cn } from '../../utils/cn'; 

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className,
}) => {
  const baseStyles = 'transition-all duration-300 ease-in-out focus:outline-none focus:ring-2';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-700',
    ghost: 'text-blue-600 hover:bg-blue-100 active:bg-blue-200',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledStyles = 'bg-gray-400 text-gray-700 cursor-not-allowed hover:bg-gray-400';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled ? disabledStyles : '',
        'rounded-md shadow-md hover:scale-105 active:scale-95',
        className
      )}
    >
      {children}
    </button>
  );
};
