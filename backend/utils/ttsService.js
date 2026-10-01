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
 * Generate speech using ElevenLabs TTS API (Arabic support)
 * Free tier: 10,000 characters/month, no credit card required
 */
async function generateSpeechElevenLabs(text, voice = 'male') {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured in .env');
  }

  // ElevenLabs premade voices with Arabic support
  // Using general voices - ElevenLabs doesn't have Egyptian-specific, but quality is excellent
  const voiceId = voice === 'female'
    ? 'EXAVITQu4vr4xnSDxMaL'  // Sarah - female voice
    : 'pNInz6obpgDQGcFmaJgB';  // Adam - male voice

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('[TTS] ElevenLabs API error:', error);
      throw new Error(`ElevenLabs TTS failed: ${error.detail?.message || response.statusText}`);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    console.log('[TTS] ElevenLabs TTS synthesis completed:', audioBuffer.length, 'bytes');

    return {
      audio: audioBuffer,
      voice: voice === 'female' ? 'Sarah' : 'Adam',
      service: 'elevenlabs'
    };
  } catch (error) {
    console.error('[TTS] ElevenLabs TTS error:', error.message);
    throw new Error('elevenlabs_tts_failed');
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
    // Primary: ElevenLabs TTS (Arabic support, no credit card required)
    console.log('[TTS] Calling ElevenLabs TTS...');
    const result = await generateSpeechElevenLabs(text, voice);
    addToCache(cacheKey, { audio: result.audio, voice: result.voice, service: result.service });
    return { ...result, cached: false };
  } catch (elevenLabsError) {
    console.error('[TTS] ElevenLabs TTS failed:', elevenLabsError.message);

    // No fallback - return error message
    return {
      fallback: true,
      text,
      voice,
      message: 'معذرة، الصوت مش متاح دلوقتي. لازم تضبط ElevenLabs API key الأول.'
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
