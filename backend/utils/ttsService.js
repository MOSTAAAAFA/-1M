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
 * Generate speech using Google Cloud Text-to-Speech REST API with API Key
 * This works with API keys directly (no service account needed)
 */
async function generateSpeechGoogle(text, voice = 'male') {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_CLOUD_API_KEY not configured in .env');
  }

  // Google has ar-XA-Wavenet voices (Modern Standard Arabic with good neural quality)
  const voiceName = voice === 'female' ? 'ar-XA-Wavenet-A' : 'ar-XA-Wavenet-B';

  const requestBody = {
    input: { text },
    voice: {
      languageCode: 'ar-XA',
      name: voiceName,
      ssmlGender: voice === 'female' ? 'FEMALE' : 'MALE'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.9,
      pitch: 0
    }
  };

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('[TTS] Google Cloud TTS API error:', error);
      throw new Error(`Google TTS failed: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.audioContent) {
      throw new Error('No audioContent in Google TTS response');
    }

    // audioContent is base64-encoded
    const audioBuffer = Buffer.from(data.audioContent, 'base64');
    console.log('[TTS] Google Cloud TTS synthesis completed:', audioBuffer.length, 'bytes');

    return {
      audio: audioBuffer,
      voice: voiceName,
      service: 'google-tts'
    };
  } catch (error) {
    console.error('[TTS] Google Cloud TTS error:', error.message);
    throw new Error('google_tts_failed');
  }
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

  try {
    // Primary: Google Cloud Text-to-Speech (Arabic Wavenet Neural)
    console.log('[TTS] Calling Google Cloud TTS...');
    const result = await generateSpeechGoogle(text, voice);
    addToCache(cacheKey, { audio: result.audio, voice: result.voice, service: result.service });
    return { ...result, cached: false };
  } catch (googleError) {
    console.error('[TTS] Google Cloud TTS failed:', googleError.message);

    // Fallback: return JSON for client-side handling (browser TTS)
    return {
      fallback: true,
      text,
      voice,
      message: 'معذرة، الصوت مش متاح دلوقتي. هيستخدم صوت المتصفح'
    };
  }
}

module.exports = {
  generateSpeech,
  getCacheStats: () => ({
    size: cache.size,
    maxSize: MAX_CACHE_SIZE
  })
};
