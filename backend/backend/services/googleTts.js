const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

// Google Cloud TTS - Egyptian Arabic voice (Wavenet quality)
// API key loaded from GOOGLE_CLOUD_TTS_KEY env var
const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_TTS_KEY;

// Best Egyptian Arabic voice from Google Cloud:
// ar-XA-Wavenet-B is a male Arabic voice with natural, clear pronunciation
// Similar quality to ElevenLabs but with broader Arabic dialect support
const VOICE_NAME = 'ar-XA-Wavenet-B';
const LANGUAGE_CODE = 'ar-XA';

// Free tier: 1 million characters/month (100x more than ElevenLabs!)
const MONTHLY_CHAR_LIMIT = 1000000;

// Usage tracking file
const USAGE_FILE = path.join(__dirname, '..', 'data', 'google_tts_usage.json');

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function readUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('[Google TTS] could not read usage file:', err.message);
  }
  return {};
}

function writeUsage(usage) {
  try {
    fs.mkdirSync(path.dirname(USAGE_FILE), { recursive: true });
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (err) {
    console.error('[Google TTS] could not write usage file:', err.message);
  }
}

function getUsage() {
  const usage = readUsage();
  const month = currentMonth();
  const chars = usage[month] || 0;
  return { month, chars, limit: MONTHLY_CHAR_LIMIT, remaining: Math.max(0, MONTHLY_CHAR_LIMIT - chars) };
}

function recordUsage(chars) {
  const usage = readUsage();
  const month = currentMonth();
  usage[month] = (usage[month] || 0) + chars;
  writeUsage(usage);
}

/**
 * Synthesize Arabic speech with Google Cloud TTS.
 * Returns a Buffer of MP3 audio.
 * Throws { status, message } on failure for fallback chain.
 */
async function synthesizeGoogle(text) {
  if (!GOOGLE_API_KEY) {
    throw { status: 401, message: 'google_tts_no_api_key' };
  }

  const used = getUsage();
  const charCount = text.length;
  if (charCount > used.remaining) {
    throw { status: 429, message: `google_tts_quota_exceeded (${used.chars}/${used.limit})` };
  }

  try {
    // Initialize client with API key
    const client = new textToSpeech.TextToSpeechClient({
      apiKey: GOOGLE_API_KEY
    });

    const request = {
      input: { text },
      voice: {
        languageCode: LANGUAGE_CODE,
        name: VOICE_NAME,
        ssmlGender: 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0
      }
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent || response.audioContent.length < 100) {
      throw { status: 500, message: 'google_tts_empty_audio' };
    }

    recordUsage(charCount);
    return Buffer.from(response.audioContent);

  } catch (err) {
    // Normalize errors for fallback chain
    const status = err?.status || err?.code || 500;
    const message = err?.message || 'google_tts_error';
    throw { status, message: `google_tts_error_${status}`, detail: message.slice(0, 200) };
  }
}

module.exports = {
  synthesizeGoogle,
  getUsage,
  VOICE_NAME,
  LANGUAGE_CODE,
  MONTHLY_CHAR_LIMIT
};
