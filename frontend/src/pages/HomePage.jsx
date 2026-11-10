import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Coffee,
  ArrowRight,
  Sparkles,
  QrCode,
  Clock,
  ShieldCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMenuItems } from '../services/menuService.js';
import MenuCard from '../components/MenuCard.jsx';
import { useCart } from '../hooks/useCart.js';
import Spinner from '../components/Spinner.jsx';

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const data = await getMenuItems();
        if (isMounted) {
          // Pick up to 6 items (prioritizing isFeatured or available Coffee/Desserts)
          const sorted = [...data].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
          });
          setFeaturedItems(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`Added ${item.name} to order`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="overflow-hidden border-b border-border/60 bg-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-20">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 border-l-2 border-terracotta pl-3 text-xs font-semibold uppercase tracking-wider text-terracotta">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Specialty Roast &amp; Fresh Kitchen</span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1.05] text-espresso sm:text-6xl lg:text-7xl">
              Brew &amp; Bite
              <span className="mt-2 block font-normal italic text-terracotta">
                Coffee worth slowing down for.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-latte sm:text-lg">
              Small-batch coffee, fresh-from-the-oven bites, and a little room to breathe.
            </p>

            <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/menu"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.99] sm:w-auto"
              >
                <span>Explore the Menu</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => navigate('/menu?scan=1')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-6 py-3.5 text-base font-medium text-espresso transition-colors hover:bg-white sm:w-auto"
              >
                <QrCode className="h-4 w-4 text-terracotta" />
                <span>Order at your table</span>
              </button>
            </div>

            <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-latte">
              Espresso <span className="px-2 text-terracotta">/</span> Pour overs{' '}
              <span className="px-2 text-terracotta">/</span> Fresh bakes
            </p>
          </div>

          <div className="relative mx-2 sm:mx-4 lg:mx-0">
            <div className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-terracotta/40" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-ivory-dark shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85"
                alt="Freshly prepared cup of coffee"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/70 bg-ivory/95 px-4 py-3 shadow-md sm:bottom-6 sm:left-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                  Made for your moment
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-espresso">
                  Coffee &amp; good company
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mt-1">
              From Our Menu
            </h2>
            <p className="text-sm text-latte mt-2">
              Our baristas' favorite roasts and artisan kitchen specials.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors group"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-border animate-pulse space-y-4"
              >
                <div className="aspect-[4/3] bg-ivory-dark rounded-xl" />
                <div className="h-4 bg-ivory-dark rounded w-3/4" />
                <div className="h-3 bg-ivory-dark rounded w-full" />
                <div className="h-8 bg-ivory-dark rounded" />
              </div>
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-border p-8">
            <Coffee className="w-12 h-12 text-latte mx-auto mb-3 opacity-60" />
            <p className="text-sm text-latte">No featured items available right now.</p>
            <Link
              to="/menu"
              className="mt-4 inline-block px-5 py-2.5 bg-terracotta text-white rounded-xl text-xs font-medium"
            >
              Browse Full Menu
            </Link>
          </div>
        )}
      </section>

      {/* Story & Philosophy Section */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-dark/70 rounded-3xl p-8 sm:p-12 lg:p-16 border border-border grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-xs font-semibold uppercase tracking-wider text-espresso border border-border">
              <Heart className="w-3.5 h-3.5 text-terracotta" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso leading-tight">
              Crafted with Care, Poured with Mindfulness
            </h2>

            <p className="text-sm sm:text-base text-latte leading-relaxed">
              At Brew &amp; Bite, every cup is an ode to patience. We roast in micro-lots,
              grind to order, and pour with precision. Whether you are seeking a quick morning espresso
              or settling in for an unhurried afternoon with friends, our kitchen welcomes you.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/80">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
                  100%
                </span>
                <p className="text-xs text-latte mt-1">Single-Origin Arabica</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
                  Daily
                </span>
                <p className="text-xs text-latte mt-1">Fresh Artisan Baking</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-border bg-espresso">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
              alt="Artisanal pour over coffee in cafe"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent flex items-end p-6">
              <p className="text-white text-xs sm:text-sm font-medium tracking-wide">
                "Slow living in every pour." — Brew &amp; Bite Barista Team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Highlights / Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-terracotta border border-border">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-espresso">
              Contactless Table Ordering
            </h3>
            <p className="text-xs text-latte leading-relaxed">
              Scan the QR code at your table, choose your favorites, and relax while our team delivers freshly prepared orders right to you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-terracotta border border-border">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-espresso">
              Fast &amp; Fresh Prep
            </h3>
            <p className="text-xs text-latte leading-relaxed">
              Our barista stations operate in optimized batches to ensure your artisanal drinks and warm baked goods arrive at peak temperature.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-terracotta border border-border">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-espresso">
              Uncompromising Quality
            </h3>
            <p className="text-xs text-latte leading-relaxed">
              Organic dairy, farm-fresh eggs, unrefined cane sugars, and high-altitude coffees handpicked with fair trade standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
