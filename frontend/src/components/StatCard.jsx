import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
  helperText,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-200 border ${
        accent
          ? 'bg-terracotta text-white border-terracotta shadow-md'
          : 'bg-white text-espresso border-border shadow-sm hover:shadow-md'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold tracking-wider uppercase ${
            accent ? 'text-white/80' : 'text-latte'
          }`}
        >
          {label}
        </span>
        {Icon && (
          <div
            className={`p-2.5 rounded-xl ${
              accent ? 'bg-white/15 text-white' : 'bg-ivory-dark text-terracotta'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div
          className={`text-3xl font-serif font-bold tracking-tight ${
            accent ? 'text-white' : 'text-espresso'
          }`}
        >
          {value}
        </div>
        {helperText && (
          <p
            className={`mt-1 text-xs ${
              accent ? 'text-white/70' : 'text-latte'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
