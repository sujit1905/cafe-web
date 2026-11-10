import React from 'react';

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export default function Spinner({ size = 'md', className = '', color = 'espresso' }) {
  const colorClass =
    color === 'terracotta'
      ? 'border-terracotta border-t-transparent'
      : color === 'white'
      ? 'border-white border-t-transparent'
      : 'border-espresso border-t-transparent';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeMap[size] || sizeMap.md} ${colorClass}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
