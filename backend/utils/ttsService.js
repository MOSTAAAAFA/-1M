const crypto = require('crypto');
const sdk = require('microsoft-cognitiveservices-speech-sdk');

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
 * Generate speech using Azure Cognitive Services Speech SDK (Egyptian Arabic Neural)
 * Free tier: 500k characters/month
 */
async function generateSpeechAzure(text, voice = 'male') {
  const subscriptionKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastus';

  if (!subscriptionKey) {
    throw new Error('AZURE_SPEECH_KEY not configured');
  }

  const voiceName = voice === 'female' ? 'ar-EG-SalmaNeural' : 'ar-EG-ShakirNeural';

  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
    speechConfig.speechSynthesisVoiceName = voiceName;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
      text,
      result => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log('[TTS] Azure Speech synthesis completed:', result.audioData.byteLength, 'bytes');
          resolve({
            audio: Buffer.from(result.audioData),
            voice: voiceName,
            service: 'azure-speech'
          });
        } else {
          reject(new Error(`Azure Speech synthesis failed: ${result.errorDetails}`));
        }
      },
      error => {
        synthesizer.close();
        console.error('[TTS] Azure Speech error:', error);
        reject(new Error('azure_speech_failed'));
      }
    );
  });
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
    // Primary: Azure Speech Service (Egyptian Arabic Neural)
    console.log('[TTS] Calling Azure Speech Service...');
    const result = await generateSpeechAzure(text, voice);
    addToCache(cacheKey, { audio: result.audio, voice: result.voice, service: result.service });
    return { ...result, cached: false };
  } catch (azureError) {
    console.error('[TTS] Azure Speech failed:', azureError.message);

    // Fallback: return JSON for client-side handling
    return {
      fallback: true,
      text,
      voice,
      message: 'معذرة، الصوت مش متاح دلوقتي. جرب تاني بعد شوية'
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
