const express = require('express');
const router = express.Router();
const { generateSpeech, getCacheStats } = require('../utils/ttsService');

// Rate limiter: 10 requests per minute per IP
const voiceRateLimits = new Map();

function voiceLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!voiceRateLimits.has(ip)) {
    voiceRateLimits.set(ip, []);
  }

  const requests = voiceRateLimits.get(ip);
  const recentRequests = requests.filter(time => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      fallback: true,
      error: 'rate_limit_exceeded',
      message: 'استنى شوية وحاول تاني، استخدمت الحد الأقصى من الطلبات',
      retryAfter: 60
    });
  }

  recentRequests.push(now);
  voiceRateLimits.set(ip, recentRequests);
  next();
}

/**
 * POST /api/v1/voice/speak
 * Convert text to speech with Egyptian Arabic voices
 */
router.post('/voice/speak', voiceLimiter, async (req, res) => {
  try {
    const { text, voice = 'male', format = 'mp3' } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'invalid_text',
        message: 'النص مطلوب'
      });
    }

    const result = await generateSpeech(text, voice);

    // If fallback (TTS failed), return JSON
    if (result.fallback) {
      return res.status(200).json(result);
    }

    // Success: return audio
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': result.audio.length,
      'Cache-Control': 'public, max-age=86400',
      'X-Voice-Service': result.service,
      'X-Voice-Name': result.voice,
      'X-Cache-Hit': result.cached ? '1' : '0'
    });

    res.send(result.audio);
  } catch (error) {
    console.error('[Voice API] Error:', error.message);
    res.status(500).json({
      fallback: true,
      error: 'service_error',
      message: 'في مشكلة في الخدمة، جرب تاني'
    });
  }
});

/**
 * GET /api/v1/voice/usage
 * Get TTS cache stats (public endpoint)
 */
router.get('/voice/usage', (req, res) => {
  const stats = getCacheStats();
  res.json({
    service: 'edge-tts',
    cache_size: stats.size,
    cache_max: stats.maxSize
  });
});

module.exports = router;
