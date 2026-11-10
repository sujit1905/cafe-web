import MenuItem from '../models/MenuItem.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all menu items with search, filter, sort, and pagination
 * @route   GET /api/menu
 * @access  Public
 */
export const getAllMenuItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      isAvailable,
      sort,
      page = 1,
      limit = 100,
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by availability
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    // Search by name, description, or tags (case-insensitive regex)
    if (search && search.trim() !== '') {
      const escapedSearch = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { tags: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'name_asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'name_desc') {
      sortOptions = { name: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 100));
    const skip = (pageNum - 1) * limitNum;

    const [items, totalItems] = await Promise.all([
      MenuItem.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      MenuItem.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limitNum);

    return successResponse(
      res,
      {
        items,
        pagination: {
          total: totalItems,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Menu items retrieved successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return errorResponse(res, 'Menu item not found', 404);
    }

    return successResponse(res, item, 'Menu item retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new menu item
 * @route   POST /api/menu
 * @access  Private/Admin
 */
export const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuItem.create(req.body);

    return successResponse(
      res,
      newItem,
      'Menu item created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a menu item by ID
 * @route   PUT /api/menu/:id
 * @access  Private/Admin
 */
export const updateMenuItem = async (req, res, next) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return errorResponse(res, 'Menu item not found', 404);
    }

    return successResponse(
      res,
      updatedItem,
      'Menu item updated successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a menu item by ID
 * @route   DELETE /api/menu/:id
 * @access  Private/Admin
 */
export const deleteMenuItem = async (req, res, next) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return errorResponse(res, 'Menu item not found', 404);
    }

    return successResponse(
      res,
      { id: deletedItem._id },
      'Menu item deleted successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
