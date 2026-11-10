import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Coffee,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from '../../services/menuService.js';
import { CATEGORIES } from '../../utils/constants.js';
import { formatPrice } from '../../utils/formatters.js';
import MenuItemFormModal from '../../components/MenuItemFormModal.jsx';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.jsx';
import Spinner from '../../components/Spinner.jsx';

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load menu items:', err);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Quick toggle availability directly from table
  const handleToggleAvailability = async (item) => {
    const updatedStatus = !item.isAvailable;
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((it) =>
          it._id === item._id ? { ...it, isAvailable: updatedStatus } : it
        )
      );
      await updateMenuItem(item._id, { isAvailable: updatedStatus });
      toast.success(
        `"${item.name}" marked as ${updatedStatus ? 'available' : 'unavailable'}`
      );
    } catch (err) {
      toast.error('Failed to update availability');
      fetchMenu();
    }
  };

  // Open Create
  const handleAddNew = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  // Open Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormModalOpen(true);
  };

  // Open Delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteMenuItem(itemToDelete._id);
      toast.success(`Deleted "${itemToDelete.name}"`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchMenu();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete item');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            Menu Management
          </h1>
          <p className="text-xs text-latte mt-1">
            Create, update, and manage availability of your cafe offerings.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name or description..."
            className="w-full pl-10 pr-4 py-2 bg-ivory/40 border border-border rounded-xl text-xs text-espresso placeholder-latte focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-espresso text-white'
                  : 'bg-ivory/60 text-latte hover:text-espresso hover:bg-ivory'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Spinner size="md" color="terracotta" />
            <p className="mt-3 text-xs text-latte">Loading catalog items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center text-latte space-y-3">
            <Coffee className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-serif font-bold text-espresso">
              No menu items found
            </p>
            <p className="text-xs text-latte">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={handleAddNew}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-terracotta text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Item</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory/60 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-latte">
                  <th className="py-3.5 px-6">Item</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Prep Time</th>
                  <th className="py-3.5 px-6">Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredItems.map((item) => {
                  const isAvailable = item.isAvailable !== false;
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-ivory/40 transition-colors"
                    >
                      {/* Item Image + Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-ivory-dark overflow-hidden flex-shrink-0 border border-border">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-serif text-latte">
                                ☕
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-espresso">
                              {item.name}
                            </p>
                            <p className="text-xs text-latte line-clamp-1 max-w-xs">
                              {item.description || 'No description provided.'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-ivory text-latte border border-border text-xs font-medium">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-espresso">
                        {formatPrice(item.price)}
                      </td>

                      {/* Prep Time */}
                      <td className="py-4 px-6 text-xs text-latte">
                        <div className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-terracotta" />
                          <span>
                            {item.prepTimeMinutes || item.prepTime || 10} min
                          </span>
                        </div>
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Unavailable</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-lg text-latte hover:text-espresso hover:bg-ivory transition-colors"
                            title="Edit Item"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 rounded-lg text-latte hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <MenuItemFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        item={editingItem}
        onSuccess={fetchMenu}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
        loading={deleteLoading}
      />
    </div>
  );
}
