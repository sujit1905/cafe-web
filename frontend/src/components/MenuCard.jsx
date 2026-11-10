import React, { useState } from 'react';
import { Plus, Clock, Coffee, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatters.js';

export default function MenuCard({ item, onAddToCart }) {
  const [imgError, setImgError] = useState(false);
  const isAvailable = item.isAvailable !== false;
  const prepTime = item.prepTimeMinutes || item.prepTime;

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-border/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Container with 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-dark">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ivory-dark to-border text-latte p-4">
            <Coffee className="w-10 h-10 stroke-1 mb-2 opacity-50" />
            <span className="text-xs font-serif tracking-wider uppercase opacity-75">
              {item.category || 'Brew & Bite'}
            </span>
          </div>
        )}

        {/* Category Pill */}
        {item.category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-terracotta text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-border/50 uppercase tracking-wider">
            {item.category}
          </span>
        )}

        {/* Unavailable Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-espresso/75 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="text-white text-xs font-semibold tracking-wider uppercase bg-espresso/90 px-3 py-1.5 rounded-full border border-white/20">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-espresso group-hover:text-terracotta transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="font-sans font-bold text-base text-espresso flex-shrink-0">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="mt-2 text-xs text-latte line-clamp-2 leading-relaxed min-h-[32px]">
            {item.description || 'Prepared fresh with specialty ingredients and seasonal cafe craft.'}
          </p>

          {/* Tags & Prep Time */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
            {prepTime && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-ivory text-latte border border-border">
                <Clock className="w-3 h-3 text-terracotta" />
                {prepTime}m
              </span>
            )}
            {item.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Special
              </span>
            )}
            {Array.isArray(item.tags) &&
              item.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-ivory text-latte border border-border"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-5 pt-3 border-t border-border/50">
          <button
            onClick={() => onAddToCart && onAddToCart(item)}
            disabled={!isAvailable}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
              isAvailable
                ? 'bg-terracotta hover:bg-terracotta-dark text-white active:scale-[0.98]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isAvailable ? 'Add to Cart' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
