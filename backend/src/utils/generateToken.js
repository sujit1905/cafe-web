import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for a given user ID
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });
};

export default generateToken;
