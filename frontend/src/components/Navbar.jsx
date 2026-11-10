import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { useTable } from '../hooks/useTable.js';

export default function Navbar({ onOpenTableModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { tableNumber } = useTable();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Story', path: '/#story' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-espresso flex items-center justify-center text-ivory shadow-sm group-hover:bg-terracotta transition-colors">
              <Coffee className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-espresso">
                Brew &amp; Bite
              </span>
              <span className="text-[10px] tracking-widest uppercase text-latte font-medium -mt-1">
                Artisanal Cafe
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith('/#');
              if (isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-sm font-medium text-espresso/80 hover:text-terracotta transition-colors"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-terracotta font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-terracotta after:rounded-full'
                        : 'text-espresso/80 hover:text-terracotta'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Table Badge / Selector Button */}
            <button
              onClick={onOpenTableModal}
              title={tableNumber ? `Seated at Table ${tableNumber}. Click to change.` : 'Click to select a dining table'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory-dark hover:bg-white text-espresso border border-border hover:border-terracotta text-xs font-medium shadow-sm transition-all active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              {tableNumber ? (
                <span>Table <strong className="font-semibold text-terracotta">{tableNumber}</strong></span>
              ) : (
                <span className="text-latte hover:text-espresso">Select Table</span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-espresso hover:bg-ivory-dark transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta"
              aria-label={`View cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-6 h-6 text-espresso" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white font-sans text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-200">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-espresso hover:bg-ivory-dark transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-ivory px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenTableModal) onOpenTableModal();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-ivory-dark border border-border text-xs font-medium text-espresso mb-2 hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span>Ordering for: <strong className="font-semibold text-terracotta">{tableNumber || 'No Table Selected'}</strong></span>
            </div>
            <span className="text-[11px] text-terracotta font-semibold underline">Change</span>
          </button>

          {navLinks.map((link) => {
            const isHash = link.path.startsWith('/#');
            if (isHash) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-espresso hover:bg-ivory-dark hover:text-terracotta"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-ivory-dark text-terracotta font-semibold'
                      : 'text-espresso hover:bg-ivory-dark hover:text-terracotta'
                  }`
                }
              >
                {link.name}
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-border">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs text-latte hover:text-espresso"
            >
              Staff &amp; Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
