import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate Access Token
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

/**
 * Generate Refresh Token
 * @param {string} id - User ID
 * @returns {string} JWT Refresh Token
 */
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Verify Refresh Token
 * @param {string} token - Refresh Token
 * @returns {object} Decoded token data
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Generate Password Reset Token
 * @returns {object} resetToken, hashedToken, expiresAt
 */
export const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashResetToken(resetToken);
  // 10 minutes expiry
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { resetToken, hashedToken, expiresAt };
};

/**
 * Hash Reset Token
 * @param {string} token - Raw reset token
 * @returns {string} Hashed token
 */
export const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Set Refresh Token in Cookie
 * @param {object} res - Express response object
 * @param {string} token - Refresh Token
 */
export const setRefreshTokenCookie = (res, token) => {
  // 7 days in milliseconds
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
  });
};

/**
 * Clear Refresh Token from Cookie
 * @param {object} res - Express response object
 */
export const clearRefreshTokenCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });
};
