import mongoose from 'mongoose';

export const ORDER_TYPES = ['Dine-in', 'Takeaway'];
export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Completed',
  'Cancelled',
];

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Item name snapshot is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Item price snapshot is required'],
      min: [0, 'Item price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Item subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'An order must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    orderType: {
      type: String,
      required: [true, 'Order type is required'],
      enum: {
        values: ORDER_TYPES,
        message: '{VALUE} is not a valid order type',
      },
    },
    tableNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (this.orderType === 'Dine-in') {
            return typeof value === 'string' && value.trim().length > 0;
          }
          return true;
        },
        message: 'Table number is required for Dine-in orders',
      },
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUSES,
        message: '{VALUE} is not a valid order status',
      },
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on status and createdAt
orderSchema.index({ status: 1, createdAt: -1 });

// Generate unique order number: format BB-YYYYMMDD-XXXX
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Generate random 4-digit number zero-padded
    const randomSuffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    this.orderNumber = `BB-${dateStr}-${randomSuffix}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
