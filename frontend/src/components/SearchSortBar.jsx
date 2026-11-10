import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';

export default function SearchSortBar({
  search = '',
  onSearchChange,
  sort = 'default',
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by item name or description..."
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-border rounded-xl text-sm text-espresso placeholder-latte focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition-all shadow-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-latte hover:text-espresso p-0.5"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort Select */}
      <div className="relative w-full sm:w-auto min-w-[200px]">
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3.5 w-4 h-4 text-latte pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full appearance-none pl-10 pr-8 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta cursor-pointer transition-all shadow-sm"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
          <span className="absolute right-3.5 pointer-events-none text-xs text-latte">
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
