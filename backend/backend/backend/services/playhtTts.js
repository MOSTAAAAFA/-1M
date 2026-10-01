const PlayHT = require('playht');
const fs = require('fs');
const path = require('path');

// PlayHT TTS - Egyptian Arabic voice (no credit card needed!)
// API credentials from PLAYHT_USER_ID and PLAYHT_API_KEY env vars
const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID;
const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY;

// Best Egyptian Arabic voice from PlayHT: "Hoda" - clear female Egyptian voice
// or "Mohammed" - professional male Egyptian voice
const VOICE_ID = 'ar-EG-SalmaNeural'; // Microsoft Azure voice via PlayHT - Egyptian Arabic
const VOICE_ENGINE = 'PlayHT2.0-turbo'; // Fast, high-quality

// Free tier: 3,000 words/month (roughly 15,000 chars)
const MONTHLY_WORD_LIMIT = 3000;

// Usage tracking file
const USAGE_FILE = path.join(__dirname, '..', 'data', 'playht_usage.json');

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
    console.error('[PlayHT] could not read usage file:', err.message);
  }
  return {};
}

function writeUsage(usage) {
  try {
    fs.mkdirSync(path.dirname(USAGE_FILE), { recursive: true });
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (err) {
    console.error('[PlayHT] could not write usage file:', err.message);
  }
}

function getUsage() {
  const usage = readUsage();
  const month = currentMonth();
  const words = usage[month] || 0;
  return { month, words, limit: MONTHLY_WORD_LIMIT, remaining: Math.max(0, MONTHLY_WORD_LIMIT - words) };
}

function recordUsage(words) {
  const usage = readUsage();
  const month = currentMonth();
  usage[month] = (usage[month] || 0) + words;
  writeUsage(usage);
}

/**
 * Synthesize Arabic speech with PlayHT (no credit card needed!).
 * Returns a Buffer of MP3 audio.
 * Throws { status, message } on failure for fallback chain.
 */
async function synthesizePlayHT(text) {
  if (!PLAYHT_USER_ID || !PLAYHT_API_KEY) {
    throw { status: 401, message: 'playht_no_api_key' };
  }

  const wordCount = text.split(/\s+/).length;
  const used = getUsage();
  if (wordCount > used.remaining) {
    throw { status: 429, message: `playht_quota_exceeded (${used.words}/${used.limit} words)` };
  }

  try {
    // Initialize PlayHT client
    PlayHT.init({
      userId: PLAYHT_USER_ID,
      apiKey: PLAYHT_API_KEY,
    });

    // Generate speech
    const stream = await PlayHT.generate(text, {
      voiceId: VOICE_ID,
      voiceEngine: VOICE_ENGINE,
      outputFormat: 'mp3',
      speed: 1.0,
    });

    // Collect stream into buffer
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const audio = Buffer.concat(chunks);

    if (!audio || audio.length < 100) {
      throw { status: 500, message: 'playht_empty_audio' };
    }

    recordUsage(wordCount);
    return audio;

  } catch (err) {
    // Normalize errors for fallback chain
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || 'playht_error';
    throw { status, message: `playht_error_${status}`, detail: message.slice(0, 200) };
  }
}

module.exports = {
  synthesizePlayHT,
  getUsage,
  VOICE_ID,
  VOICE_ENGINE,
  MONTHLY_WORD_LIMIT
};
