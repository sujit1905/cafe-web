import React from 'react';
import { CATEGORIES } from '../utils/constants.js';

export default function CategoryTabs({ selected = 'All', onChange }) {
  const tabs = ['All', ...CATEGORIES];

  return (
    <div className="w-full border-b border-border overflow-x-auto scrollbar-none">
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-max pb-2">
        {tabs.map((tab) => {
          const isActive = selected === tab;
          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                isActive
                  ? 'bg-espresso text-white shadow-sm'
                  : 'bg-white/60 text-latte hover:text-espresso hover:bg-white border border-border/60'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
