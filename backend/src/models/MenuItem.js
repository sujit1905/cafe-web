import mongoose from 'mongoose';

export const MENU_CATEGORIES = [
  'Coffee',
  'Tea',
  'Cold Beverages',
  'Desserts',
  'Snacks',
  'Breakfast',
];

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Menu item description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: MENU_CATEGORIES,
        message: '{VALUE} is not a valid menu category',
      },
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    prepTimeMinutes: {
      type: Number,
      default: 5,
      min: [0, 'Prep time cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on category and isAvailable
menuItemSchema.index({ category: 1, isAvailable: 1 });

// Text index for search functionality on name and description
menuItemSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 5, description: 1 } }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
