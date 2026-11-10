import React from 'react';
import { STATUS_COLORS } from '../utils/constants.js';

export default function StatusBadge({ status, className = '' }) {
  const colorClass =
    STATUS_COLORS[status] || 'bg-stone-100 text-stone-700 border-stone-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status || 'Unknown'}
    </span>
  );
}
