import React, { useState, useEffect } from 'react';
import { Coffee, Phone, X, ArrowRight, MapPin } from 'lucide-react';
import { useTable } from '../hooks/useTable.js';

export default function TableWelcomeModal({ isOpen, onClose, tableNumber }) {
  const { tableNumber: currentTable, setTableNumber, customerPhone, setCustomerPhone, setHasSeenModal } = useTable();
  const [phoneInput, setPhoneInput] = useState(customerPhone || '');
  const [selectedTable, setSelectedTable] = useState(tableNumber || currentTable || 'T01');
  const [customTable, setCustomTable] = useState('');
  const [error, setError] = useState('');

  const quickTables = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08'];

  useEffect(() => {
    if (tableNumber) {
      setSelectedTable(tableNumber);
    } else if (currentTable) {
      setSelectedTable(currentTable);
    }
  }, [tableNumber, currentTable]);

  useEffect(() => {
    if (customerPhone) {
      setPhoneInput(customerPhone);
    }
  }, [customerPhone]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = phoneInput.trim();
    if (!cleanPhone) {
      setError('Please enter your phone number to receive order updates');
      return;
    }
    const digits = cleanPhone.replace(/\D/g, '');
    if (digits.length < 7) {
      setError('Please enter a valid phone number (at least 7 digits)');
      return;
    }

    const finalTable = customTable.trim() || selectedTable || 'T01';
    setTableNumber(finalTable);
    setCustomerPhone(cleanPhone);
    setHasSeenModal(true);
    onClose();
  };

  const handleSkip = () => {
    const finalTable = customTable.trim() || selectedTable || 'T01';
    if (!currentTable) {
      setTableNumber(finalTable);
    }
    setHasSeenModal(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity"
        onClick={handleSkip}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border z-10 text-center animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-latte hover:text-espresso p-1.5 rounded-full hover:bg-ivory transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Welcome */}
        <div className="w-16 h-16 rounded-2xl bg-ivory flex items-center justify-center text-espresso mx-auto mb-4 border border-border shadow-inner">
          <Coffee className="w-8 h-8 text-terracotta" />
        </div>

        <h3 className="text-2xl font-serif font-bold text-espresso">
          Welcome to Brew &amp; Bite
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-latte leading-relaxed">
          Order contactless specialty coffee and artisanal meals delivered hot right to your table.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          {/* Table Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                Select Seated Table
              </span>
              <span className="text-terracotta font-bold text-sm">
                {customTable.trim() || selectedTable}
              </span>
            </label>

            {/* Quick table pills */}
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {quickTables.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTable(t);
                    setCustomTable('');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTable === t && !customTable
                      ? 'bg-espresso text-white border-espresso shadow-sm'
                      : 'bg-ivory/60 hover:bg-ivory text-espresso border-border'
                  }`}
                >
                  Table {t}
                </button>
              ))}
            </div>

            {/* Custom table input */}
            <input
              type="text"
              value={customTable}
              onChange={(e) => setCustomTable(e.target.value)}
              placeholder="Or custom station (e.g. Patio-02, Bar-01)"
              className="w-full px-3.5 py-2 bg-ivory/40 border border-border rounded-xl text-xs text-espresso placeholder-latte focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
              Mobile Number (For Order Updates)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-latte" />
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. +91 98765 43210"
                className={`w-full pl-10 pr-4 py-2.5 bg-ivory/50 border rounded-xl text-sm text-espresso placeholder-latte focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
                  error ? 'border-rose-500' : 'border-border focus:border-terracotta'
                }`}
              />
            </div>
            {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Confirm &amp; Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 text-xs font-medium text-latte hover:text-espresso transition-colors"
            >
              Skip and browse menu directly
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
