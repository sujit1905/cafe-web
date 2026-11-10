export const formatPrice = (price) => {
  const num = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(num)) return '₹0.00';
  return `₹${num.toFixed(2)}`;
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return 'N/A';
  }
};

export const formatOrderNumber = (num) => num || 'N/A';
