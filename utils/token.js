const jwt = require('jsonwebtoken');

/**
 * Retrieves the configured JWT secret, enforcing presence in all environments.
 * Throws a fatal security error if JWT_SECRET is missing or blank.
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error(
      '[SECURITY FATAL] JWT_SECRET environment variable is missing or empty. A secure secret must be configured in environment variables.'
    );
  }
  if (process.env.NODE_ENV === 'production' && secret.trim().length < 32) {
    throw new Error(
      '[SECURITY FATAL] JWT_SECRET in production must be at least 32 characters long.'
    );
  }
  return secret.trim();
}

/**
 * Signs a payload with the configured secret and expiration.
 */
const signToken = (payload, options = {}) => {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
    ...options,
  });
};

/**
 * Verifies a token using the configured secret.
 */
const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

// Export functions with backward-compatible aliases
module.exports = {
  signToken,
  generateToken: signToken,
  verifyToken,
  getJwtSecret,
};