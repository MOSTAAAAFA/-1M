const crypto = require('crypto');

// In-memory cache: text hash → {audio: Buffer, voice: string, timestamp: number}
const cache = new Map();
const MAX_CACHE_SIZE = 500;

// Simple FIFO cache eviction
function addToCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { ...value, timestamp: Date.now() });
}

function getCacheKey(text, voice) {
  return crypto.createHash('sha256').update(`${text}:${voice}`).digest('hex');
}

/**
 * Generate speech using browser Web Speech API (client-side fallback)
 * Returns a fallback JSON response for the frontend to handle
 */
async function generateSpeechFallback(text, voice = 'male') {
  return {
    fallback: true,
    text,
    voice,
    message: 'استخدم المتصفح للنطق - اضغط على زر الصوت'
  };
}

/**
 * Main TTS function with fallback chain
 * @param {string} text - Arabic text (max 1000 chars)
 * @param {string} voice - 'male' or 'female'
 * @returns {Promise<{audio: Buffer, voice: string, service: string, cached: boolean} | {fallback: true, text: string, message: string}>}
 */
async function generateSpeech(text, voice = 'male') {
  if (!text || text.length > 1000) {
    throw new Error('النص مطلوب ولازم يكون أقل من 1000 حرف');
  }

  // Check cache
  const cacheKey = getCacheKey(text, voice);
  const cached = cache.get(cacheKey);
  if (cached && cached.audio) {
    console.log('[TTS] Cache hit');
    return { ...cached, cached: true };
  }

  // For now, return fallback to use browser TTS
  // Frontend will handle with Web Speech API
  console.log('[TTS] Using browser fallback for:', text.substring(0, 50));
  return generateSpeechFallback(text, voice);
}

module.exports = {
  generateSpeech,
  getCacheStats: () => ({
    size: cache.size,
    maxSize: MAX_CACHE_SIZE
  })
};
