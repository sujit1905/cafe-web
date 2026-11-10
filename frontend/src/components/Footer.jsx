import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ivory-dark border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-espresso flex items-center justify-center text-ivory">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-espresso">
                Brew &amp; Bite
              </span>
            </div>
            <p className="text-sm text-latte max-w-sm leading-relaxed">
              Crafting mindful moments, single-origin brews, and artisan bites.
              Freshly ground, gently poured, and baked daily for your delight.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-latte hover:text-terracotta transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-latte hover:text-terracotta transition-colors">
                  Full Menu
                </Link>
              </li>
              <li>
                <a href="/#story" className="text-latte hover:text-terracotta transition-colors">
                  Our Story
                </a>
              </li>
            </ul>
          </div>

          {/* Portal / Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso mb-4">
              Hours &amp; Access
            </h4>
            <div className="text-sm text-latte space-y-1 mb-4">
              <p>Mon – Fri: 7:30 AM – 9:00 PM</p>
              <p>Sat – Sun: 8:00 AM – 10:00 PM</p>
            </div>
            <div>
              <Link
                to="/admin/login"
                className="inline-flex items-center text-xs font-medium text-terracotta hover:text-terracotta-dark hover:underline"
              >
                Admin &amp; Staff Login →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-latte gap-4">
          <p>© {currentYear} Brew &amp; Bite Cafe. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Brewed with <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" /> and mindfulness.
          </p>
        </div>
      </div>
    </footer>
  );
}
