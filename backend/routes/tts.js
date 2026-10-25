const express = require("express");
const crypto = require("crypto");
const { synthesizeEleven, getUsage, ELEVEN_VOICE_NAME } = require("../services/elevenLabsTts");

const router = express.Router();

// ── TTS: ElevenLabs (Egyptian Arabic Female) → browser fallback ───────
// 1. ElevenLabs is PRIMARY: Bella voice (clear female voice).
//    Free tier: 10,000 chars/month (no credit card required!)
// 2. browser speechSynthesis is the FALLBACK tier, signaled via 429 {fallback:true}
//
// ELEVENLABS_API_KEY stays server-side only — never exposed to client.

const MAX_PER_MINUTE = 1000; // soft guard against runaway loops
const minuteHits = new Map(); // ip -> [timestamps]
const cache = new Map(); // key -> { audio: Buffer, tier: string }

function checkLimits(ip) {
  const nowTs = Date.now();
  const hits = (minuteHits.get(ip) || []).filter((t) => nowTs - t < 60000).concat(nowTs);
  minuteHits.set(ip, hits);
  return hits.length > MAX_PER_MINUTE;
}

// 🎙 POST /api/v1/tts
// Body: { text: string }
// Public (no auth) — used by the home-page AI assistant.
// Success → audio bytes (MP3 from ElevenLabs, WAV from Gemini).
// 429 { fallback: true } → the frontend plays the browser voice instead.
router.post("/tts", async (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ fallback: true, error: "invalid_text" });
  }

  const clean = text.trim();
  const key = crypto.createHash("sha256").update(clean).digest("hex");

  // Cache hit → replay stored audio regardless of which tier produced it.
  const cached = cache.get(key);
  if (cached) {
    return sendAudio(res, cached.audio, cached.tier, true);
  }

  if (checkLimits(req.ip)) {
    return res.status(429).json({ fallback: true, error: "minute" });
  }

  // ── Tier 1: ElevenLabs TTS (Egyptian Arabic - Bella) ─────────────
  try {
    const audio = await synthesizeEleven(clean);
    if (cache.size > 300) cache.delete(cache.keys().next().value);
    cache.set(key, { audio, tier: "elevenlabs" });
    console.log(`[TTS] ElevenLabs served "${clean.slice(0, 40)}..." (${audio.length}B)`);
    return sendAudio(res, audio, "elevenlabs", false);
  } catch (err) {
    // 401 = bad key, 429 = quota exceeded. Both → fallback to browser.
    console.warn(`[TTS] ElevenLabs failed (${err.status} ${err.message}) → falling back to browser voice`);
  }

  // ── Tier 2: browser speechSynthesis (never go silent) ──────────────────────
  return res.status(429).json({ fallback: true, error: "elevenlabs_unavailable" });
});

function sendAudio(res, audio, tier, cached) {
  res.set({
    "Content-Type": "audio/mpeg",
    "Content-Length": audio.length,
    "Cache-Control": "public, max-age=86400",
    "X-Tts-Cache": cached ? "1" : "0",
    "X-Tts-Tier": tier, // which engine served this audio (server-side diagnostic)
  });
  res.end(audio);
}

module.exports = router;