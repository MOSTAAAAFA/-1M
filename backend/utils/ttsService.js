const crypto = require('crypto');
const textToSpeech = require('@google-cloud/text-to-speech');

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
 * Generate speech using Google Cloud Text-to-Speech (Arabic Wavenet Neural)
 * Supports both API Key and Service Account authentication
 */
async function generateSpeechGoogle(text, voice = 'male') {
  // Initialize client with API key or service account
  let client;

  if (process.env.GOOGLE_CLOUD_API_KEY) {
    // Option 1: API Key (simpler)
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth({
      credentials: {
        client_email: 'api-key@google.com',
        private_key: 'unused'
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    client = new textToSpeech.TextToSpeechClient({
      auth,
      apiKey: process.env.GOOGLE_CLOUD_API_KEY
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Option 2: Service Account JSON
    client = new textToSpeech.TextToSpeechClient();
  } else {
    throw new Error('Google Cloud credentials not configured. Set GOOGLE_CLOUD_API_KEY or GOOGLE_APPLICATION_CREDENTIALS');
  }

  // Google has ar-XA-Wavenet voices (Modern Standard Arabic with good neural quality)
  const voiceName = voice === 'female' ? 'ar-XA-Wavenet-A' : 'ar-XA-Wavenet-B';

  const request = {
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
    const [response] = await client.synthesizeSpeech(request);
    console.log('[TTS] Google Cloud TTS synthesis completed:', response.audioContent.length, 'bytes');

    return {
      audio: Buffer.from(response.audioContent),
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
