import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for authentication endpoints
 * 10 requests per 15 minutes window
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * General rate limiter for API endpoints
 * 100 requests per 1 minute window
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please slow down and try again later.',
  },
});

export default {
  authLimiter,
  apiLimiter,
};
