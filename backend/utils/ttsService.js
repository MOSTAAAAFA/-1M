const crypto = require('crypto');
const { EdgeTTS } = require('edge-tts');

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
 * Generate speech using Microsoft Edge TTS (Free)
 * Egyptian Arabic Neural Voices
 */
async function generateSpeechEdgeTTS(text, voice = 'female') {
  try {
    // Egyptian Arabic voices - very natural
    const voiceId = voice === 'female'
      ? 'ar-EG-SalmaNeural'  // بنت مصرية - صوت طبيعي جدًا
      : 'ar-EG-ShakirNeural'; // راجل مصري

    const tts = new EdgeTTS(text, voiceId, {
      rate: '+0%',
      pitch: '+0Hz',
      volume: '+0%'
    });

    const audioBuffer = await tts.synthesize();

    console.log('[TTS] Edge TTS synthesis completed:', audioBuffer.length, 'bytes');

    return {
      audio: Buffer.from(audioBuffer),
      voice: voice === 'female' ? 'Salma (Egyptian)' : 'Shakir (Egyptian)',
      service: 'edge-tts'
    };
  } catch (error) {
    console.error('[TTS] Edge TTS error:', error.message);
    throw new Error('edge_tts_failed');
  }
}

/**
 * Main TTS function with Egyptian Arabic voices
 */
async function generateSpeech(text, voice = 'female') {
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
    console.log('[TTS] Calling Edge TTS (Egyptian Arabic)...');
    const result = await generateSpeechEdgeTTS(text, voice);
    addToCache(cacheKey, { audio: result.audio, voice: result.voice, service: result.service });
    return { ...result, cached: false };
  } catch (edgeError) {
    console.error('[TTS] Edge TTS failed:', edgeError.message);

    return {
      fallback: true,
      text,
      voice,
      message: 'معذرة، الصوت مش متاح دلوقتي'
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
