import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'wave'
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-2xl';
      case 'text':
        return 'rounded-md h-4 my-1';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  const getAnimationClass = () => {
    if (animation === 'none') return '';
    if (animation === 'pulse') return 'animate-pulse';
    // Shimmer wave
    return 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 dark:before:via-white/5 before:to-transparent';
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={style}
      className={`bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50 ${getVariantClass()} ${getAnimationClass()} ${className}`}
    />
  );
};
