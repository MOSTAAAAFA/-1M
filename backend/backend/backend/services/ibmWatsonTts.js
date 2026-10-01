const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');
const path = require('path');

// IBM Watson TTS - Egyptian Arabic voice (NO credit card needed!)
// API credentials from IBM_WATSON_API_KEY and IBM_WATSON_SERVICE_URL env vars
const IBM_API_KEY = process.env.IBM_WATSON_API_KEY;
const IBM_SERVICE_URL = process.env.IBM_WATSON_SERVICE_URL || 'https://api.us-south.text-to-speech.watson.cloud.ibm.com';

// Egyptian Arabic voice: ar-MS_OmarVoice (male, Egyptian dialect)
const VOICE_ID = 'ar-MS_OmarVoice';

// Free Lite plan: 10,000 characters/month (no credit card required!)
const MONTHLY_CHAR_LIMIT = 10000;

// Usage tracking file
const USAGE_FILE = path.join(__dirname, '..', 'data', 'ibm_watson_usage.json');

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
    console.error('[IBM Watson] could not read usage file:', err.message);
  }
  return {};
}

function writeUsage(usage) {
  try {
    fs.mkdirSync(path.dirname(USAGE_FILE), { recursive: true });
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (err) {
    console.error('[IBM Watson] could not write usage file:', err.message);
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
 * Synthesize Egyptian Arabic speech with IBM Watson TTS.
 * Returns a Buffer of MP3 audio.
 * Throws { status, message } on failure for fallback chain.
 */
async function synthesizeIBM(text) {
  if (!IBM_API_KEY) {
    throw { status: 401, message: 'ibm_watson_no_api_key' };
  }

  const charCount = text.length;
  const used = getUsage();
  if (charCount > used.remaining) {
    throw { status: 429, message: `ibm_watson_quota_exceeded (${used.chars}/${used.limit})` };
  }

  try {
    // Initialize Watson TTS client
    const textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: IBM_API_KEY,
      }),
      serviceUrl: IBM_SERVICE_URL,
    });

    // Synthesize speech
    const response = await textToSpeech.synthesize({
      text,
      voice: VOICE_ID,
      accept: 'audio/mp3',
    });

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.result) {
      chunks.push(chunk);
    }
    const audio = Buffer.concat(chunks);

    if (!audio || audio.length < 100) {
      throw { status: 500, message: 'ibm_watson_empty_audio' };
    }

    recordUsage(charCount);
    return audio;

  } catch (err) {
    // Normalize errors for fallback chain
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || 'ibm_watson_error';
    throw { status, message: `ibm_watson_error_${status}`, detail: message.slice(0, 200) };
  }
}

module.exports = {
  synthesizeIBM,
  getUsage,
  VOICE_ID,
  MONTHLY_CHAR_LIMIT
};
