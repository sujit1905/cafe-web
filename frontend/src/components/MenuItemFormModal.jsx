import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORIES } from '../utils/constants.js';
import { createMenuItem, updateMenuItem } from '../services/menuService.js';
import Spinner from './Spinner.jsx';

export default function MenuItemFormModal({
  isOpen,
  onClose,
  item = null,
  onSuccess,
}) {
  const isEditing = Boolean(item && item._id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0],
    price: '',
    image: '',
    prepTimeMinutes: '10',
    isAvailable: true,
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category || CATEGORIES[0],
        price: item.price !== undefined ? String(item.price) : '',
        image: item.image || '',
        prepTimeMinutes: item.prepTimeMinutes || item.prepTime || '10',
        isAvailable: item.isAvailable !== false,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: CATEGORIES[0],
        price: '',
        image: '',
        prepTimeMinutes: '10',
        isAvailable: true,
        tags: '',
      });
    }
    setErrors({});
  }, [item, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Item name is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errs.price = 'Please enter a valid price';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image.trim(),
        prepTimeMinutes: parseInt(formData.prepTimeMinutes, 10) || 10,
        isAvailable: formData.isAvailable,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (isEditing) {
        await updateMenuItem(item._id, payload);
        toast.success(`Updated "${payload.name}" successfully`);
      } else {
        await createMenuItem(payload);
        toast.success(`Added "${payload.name}" to menu`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Menu item save error:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to save menu item';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border z-10 animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-latte hover:text-espresso p-1.5 rounded-full hover:bg-ivory transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-bold text-espresso">
          {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h3>
        <p className="text-xs text-latte mt-1">
          {isEditing
            ? 'Update the details and availability of this item.'
            : 'Fill in the information to add a fresh item to your cafe menu.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Vanilla Bean Flat White"
              className={`w-full px-3.5 py-2.5 bg-ivory/40 border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
                errors.name ? 'border-rose-500' : 'border-border focus:border-terracotta'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
            )}
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="249.00"
                className={`w-full px-3.5 py-2.5 bg-ivory/40 border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
                  errors.price ? 'border-rose-500' : 'border-border focus:border-terracotta'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Smooth espresso with velvety steamed whole milk and fragrant Madagascar vanilla."
              className="w-full px-3.5 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta resize-none"
            />
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
              Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
              />
              <div className="w-11 h-11 rounded-xl bg-ivory border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-latte opacity-50" />
                )}
              </div>
            </div>
          </div>

          {/* Prep Time & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
                Prep Time (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={formData.prepTimeMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, prepTimeMinutes: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Popular, Bestseller, Vegan"
                className="w-full px-3.5 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-espresso">
              Available for Ordering
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-espresso hover:bg-ivory transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white text-sm font-semibold transition-all shadow-md flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
