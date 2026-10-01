/**
 * JWT Secret Validation Utility
 * Ensures JWT_SECRET meets security requirements before server starts
 */

const crypto = require('crypto');

/**
 * Validates JWT secret strength
 * @param {string} secret - The JWT secret to validate
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
function validateJwtSecret(secret) {
  const errors = [];

  // Check if secret exists
  if (!secret) {
    errors.push('JWT_SECRET environment variable is not set');
    return { valid: false, errors };
  }

  // Check minimum length (256 bits = 32 bytes minimum recommended)
  if (secret.length < 32) {
    errors.push(`JWT_SECRET must be at least 32 characters long (current: ${secret.length})`);
  }

  // Check for common weak secrets
  const weakSecrets = [
    'secret',
    'secret123',
    'password',
    'password123',
    'mysecret',
    'jwtsecret',
    'changeMe',
    'changeme',
    'default',
    '12345678',
    'test',
    'testing',
    'development',
    'dev'
  ];

  const lowerSecret = secret.toLowerCase();
  for (const weak of weakSecrets) {
    if (lowerSecret.includes(weak)) {
      errors.push(`JWT_SECRET contains common weak pattern: "${weak}"`);
      break;
    }
  }

  // Check for sufficient entropy (basic check)
  const uniqueChars = new Set(secret).size;
  if (uniqueChars < 16) {
    errors.push(`JWT_SECRET has low character diversity (${uniqueChars} unique characters, recommend at least 16)`);
  }

  // In production, enforce stricter requirements
  if (process.env.NODE_ENV === 'production') {
    if (secret.length < 64) {
      errors.push('JWT_SECRET must be at least 64 characters long in production');
    }

    // Check if it looks like a properly generated secret (base64, hex, or high entropy)
    const isBase64Like = /^[A-Za-z0-9+/=]{32,}$/.test(secret);
    const isHexLike = /^[a-fA-F0-9]{32,}$/.test(secret);
    const hasHighEntropy = uniqueChars >= 20;

    if (!isBase64Like && !isHexLike && !hasHighEntropy) {
      errors.push('JWT_SECRET should be a cryptographically random string (e.g., generated with crypto.randomBytes)');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates a secure random JWT secret
 * @param {number} bytes - Number of random bytes (default 64)
 * @returns {string} A secure random secret in base64 format
 */
function generateSecureSecret(bytes = 64) {
  return crypto.randomBytes(bytes).toString('base64');
}

/**
 * Validates JWT_SECRET at server startup and exits if invalid
 * @throws {Error} If JWT_SECRET is invalid in production or critically weak in development
 */
function validateOrExit() {
  const jwtSecret = process.env.JWT_SECRET;
  const { valid, errors } = validateJwtSecret(jwtSecret);

  if (!valid) {
    console.error('\n❌ JWT_SECRET SECURITY ERROR:\n');
    errors.forEach(error => console.error(`  • ${error}`));
    console.error('\n💡 To generate a secure JWT_SECRET, run:');
    console.error('  node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'base64\'))"');
    console.error('\nThen add it to your .env file:');
    console.error('  JWT_SECRET=<generated_secret>\n');

    // In production, always exit on weak secrets
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Server startup aborted due to weak JWT_SECRET in production\n');
      process.exit(1);
    }

    // In development, exit on critical issues (missing or extremely weak)
    if (!jwtSecret || jwtSecret.length < 16) {
      console.error('🚨 Server startup aborted due to critically weak or missing JWT_SECRET\n');
      process.exit(1);
    }

    // Warn but allow startup for moderately weak secrets in development
    console.warn('⚠️  WARNING: Server starting with weak JWT_SECRET in development mode');
    console.warn('⚠️  This is insecure and should be fixed before production deployment\n');
  } else {
    console.log('✅ JWT_SECRET validation passed');
  }
}

module.exports = {
  validateJwtSecret,
  generateSecureSecret,
  validateOrExit
};
