const fs = require("fs");
const path = require("path");
const { ElevenLabsClient } = require("elevenlabs");

// ── ElevenLabs TTS (primary voice) ──────────────────────────────────────────
// Voices are read from the API key in .env — never hardcoded. We synthesize
// Arabic with a voice tagged "egyptian" accent in ElevenLabs' library so the
// output sounds like natural Egyptian dialect, not generic Arabic.
//
// Model: eleven_multilingual_v2 (best Arabic quality on the current key's tier).

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_MODEL = "eleven_turbo_v2_5"; // Latest model with most natural output

// Voice chosen from the shared voice library: "Bella — A young American
// female voice. Warm, clear, and natural — excellent for conversational AI."
// Natural and professional, warm tone, gender female.
const ELEVEN_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
const ELEVEN_VOICE_NAME = "Bella (Female - Natural & Clear)";

// Monetized/everyday Character limit on the free tier is 10,000 chars/month.
const MONTHLY_CHAR_LIMIT = 10000;

// Tiny JSON record so monthly usage survives restarts.
const USAGE_FILE = path.join(__dirname, "..", "data", "elevenlabs_usage.json");

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function readUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, "utf8"));
    }
  } catch (err) {
    console.error("[ElevenLabs] could not read usage file:", err.message);
  }
  return {};
}

function writeUsage(usage) {
  try {
    fs.mkdirSync(path.dirname(USAGE_FILE), { recursive: true });
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (err) {
    console.error("[ElevenLabs] could not write usage file:", err.message);
  }
}

/** Current month's character usage + remaining budget. */
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

// Lazy client so an unset/invalid key doesn't crash require().
let client = null;
function getClient() {
  if (!ELEVENLABS_API_KEY) return null;
  if (!client) client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
  return client;
}

/**
 * Synthesize Arabic speech with ElevenLabs (Egyptian-accented voice).
 * Returns a Buffer of MP3 audio. Throws { status, message } on failure so the
 * route can fall through to Gemini — never retries, never hangs.
 */
async function synthesizeEleven(text) {
  const c = getClient();
  if (!c) {
    throw { status: 401, message: "elevenlabs_no_api_key" };
  }

  const used = getUsage();
  const charCount = text.length;
  if (charCount > used.remaining) {
    throw { status: 429, message: `elevenlabs_monthly_quota_exceeded (${used.chars}/${used.limit})` };
  }

  let audio;
  try {
    const stream = await c.textToSpeech.convert(ELEVEN_VOICE_ID, {
      text,
      model_id: ELEVENLABS_MODEL,
      output_format: "mp3_44100_128",
      voice_settings: {
        stability: 0.5,           // Natural variability (0.3-0.6 is best for conversational)
        similarity_boost: 0.75,   // High similarity to original voice (0.75-0.85 recommended)
        style: 0.35,              // Expressive style (0.2-0.5 for natural conversation)
        use_speaker_boost: true   // Enhance clarity and naturalness
      }
    });
    audio = await collectStream(stream);
  } catch (err) {
    // Normalize SDK errors → { status, message }. 401 (bad key) and 429
    // (rate limit / quota) must bubble up cleanly for the fallback chain.
    const status = err?.status || err?.statusCode || (err?.code === "UnauthorizedError" ? 401 : 500);
    throw { status, message: `elevenlabs_error_${status}`, detail: (err?.message || "").slice(0, 200) };
  }

  if (!audio || audio.length < 100) {
    throw { status: 500, message: "elevenlabs_empty_audio" };
  }

  recordUsage(charCount);
  return audio;
}

function collectStream(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

module.exports = {
  synthesizeEleven,
  getUsage,
  ELEVEN_VOICE_ID,
  ELEVEN_VOICE_NAME,
  ELEVENLABS_MODEL,
  MONTHLY_CHAR_LIMIT,
};