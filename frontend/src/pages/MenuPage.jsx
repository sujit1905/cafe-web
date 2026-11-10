import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, AlertCircle, RefreshCw, Coffee, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { getMenuItems } from '../services/menuService.js';
import CategoryTabs from '../components/CategoryTabs.jsx';
import SearchSortBar from '../components/SearchSortBar.jsx';
import MenuCard from '../components/MenuCard.jsx';
import { useCart } from '../hooks/useCart.js';
import { useTable } from '../hooks/useTable.js';
import TableWelcomeModal from '../components/TableWelcomeModal.jsx';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, openCart, itemCount, total } = useCart();
  const { tableNumber, setTableNumber, hasSeenModal } = useTable();

  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting initialized from URL params if present
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') || 'All'
  );
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('search') || ''
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [sort, setSort] = useState('default');

  // Welcome modal state if URL has ?table= and !hasSeenModal
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // Check URL params for table
  useEffect(() => {
    const tableParam = searchParams.get('table');
    const scanParam = searchParams.get('scan');
    if (tableParam) {
      setTableNumber(tableParam);
      if (!hasSeenModal) {
        setWelcomeModalOpen(true);
      }
    } else if (scanParam === '1') {
      setWelcomeModalOpen(true);
    }
  }, [searchParams, hasSeenModal, setTableNumber]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch items from backend API
  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      console.error('Menu fetch error:', err);
      setError('Unable to load our menu right now. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Filter and sort items client-side for ultra-fast, responsive UI
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          (Array.isArray(item.tags) &&
            item.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [items, selectedCategory, debouncedSearch, sort]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // sync with URL query
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`Added "${item.name}" to order`, {
      action: {
        label: 'View Order',
        onClick: () => openCart(),
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
            Freshly Prepared
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso mt-1">
            Cafe Menu
          </h1>
          <p className="text-sm text-latte mt-1">
            Carefully crafted coffees, signature teas, and artisan delicacies.
          </p>
        </div>

        {tableNumber ? (
          <button
            onClick={() => setWelcomeModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory-dark hover:bg-white text-espresso text-xs font-medium border border-border hover:border-terracotta self-start sm:self-auto transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Click to change your dining table"
          >
            <span>Ordering for</span>
            <span className="font-bold text-terracotta">Table {tableNumber}</span>
            <span className="text-[10px] text-latte underline ml-1">Change</span>
          </button>
        ) : (
          <button
            onClick={() => setWelcomeModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory-dark hover:bg-white text-espresso text-xs font-medium border border-border hover:border-terracotta self-start sm:self-auto transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <span className="text-terracotta font-semibold">🪑 Dine-In? Select Table</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <SearchSortBar
          search={searchInput}
          onSearchChange={setSearchInput}
          sort={sort}
          onSortChange={setSort}
        />

        <CategoryTabs
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-xs text-latte">
        <span>
          Showing <strong className="text-espresso">{filteredAndSortedItems.length}</strong> items
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </span>

        {(selectedCategory !== 'All' || debouncedSearch) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchInput('');
              setSearchParams({});
            }}
            className="text-terracotta hover:underline font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Content State: Loading / Error / Empty / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-border animate-pulse space-y-4"
            >
              <div className="aspect-[4/3] bg-ivory-dark rounded-xl" />
              <div className="h-4 bg-ivory-dark rounded w-2/3" />
              <div className="h-3 bg-ivory-dark rounded w-full" />
              <div className="h-3 bg-ivory-dark rounded w-4/5" />
              <div className="h-9 bg-ivory-dark rounded-xl pt-2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-border p-8 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-espresso">
            Failed to Load Menu
          </h3>
          <p className="text-xs text-latte">{error}</p>
          <button
            onClick={fetchMenu}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-xl text-xs font-semibold hover:bg-terracotta-dark transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-border p-8 max-w-lg mx-auto">
          <Coffee className="w-12 h-12 text-latte mx-auto mb-3 opacity-40" />
          <h3 className="font-serif text-lg font-bold text-espresso">
            No items found
          </h3>
          <p className="text-xs text-latte mt-1 max-w-xs mx-auto">
            We couldn't find any items matching your selected category or search keywords.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchInput('');
              setSearchParams({});
            }}
            className="mt-5 px-5 py-2.5 bg-espresso text-white rounded-xl text-xs font-medium hover:bg-espresso-light transition-colors"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAndSortedItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Floating Mobile Cart Trigger Button */}
      {itemCount > 0 && (
        <div className="md:hidden fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 bg-terracotta text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-terracotta-dark active:scale-95 transition-all"
            aria-label={`View order with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-espresso text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <span className="font-semibold text-sm">View Order</span>
          </button>
        </div>
      )}

      {/* Table Welcome Modal */}
      <TableWelcomeModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        tableNumber={tableNumber}
      />
    </div>
  );
}
