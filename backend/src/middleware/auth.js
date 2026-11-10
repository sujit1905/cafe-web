import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication middleware to protect private/admin routes
 * Verifies the JWT Bearer token and attaches the user document to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Access denied. No token provided.', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
    const decoded = jwt.verify(token, secret);

    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      return errorResponse(
        res,
        'The user belonging to this token no longer exists.',
        401
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid authentication token.', 401);
    }
    return errorResponse(res, 'Not authorized to access this resource.', 401);
  }
};

/**
 * Optional authorization middleware for role-based checks
 * @param  {...string} roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'You do not have permission to perform this action.',
        403
      );
    }
    next();
  };
};

export default {
  protect,
  restrictTo,
};
