# ElevenLabs TTS - Quota Issue Fix

## المشكلة الحالية
الـ API key بتاع ElevenLabs بيرجع error **402 (Payment Required)** - معناه:
- الـ free tier (10,000 characters/month) خلص 
- أو الـ API key محتاج billing info يتضاف

## الحل السريع - 3 خيارات:

### Option 1: Get New ElevenLabs API Key (أسرع حل)
1. روح https://elevenlabs.io/app/subscription
2. شوف لو الـ quota خلص - لو خلص، استنى أول الشهر الجاي أو upgrade للـ paid plan
3. أو اعمل account جديد واجيب API key جديد
4. حط الـ key الجديد في `.env`:
   ```
   ELEVENLABS_API_KEY=sk_your_new_key_here
   ```
5. اعمل restart للـ backend server

### Option 2: Use Browser Voice Temporarily (مؤقت)
الكود حاليًا بيعمل fallback automatic للـ browser voice لو ElevenLabs فشل، بس علشان تتأكد الـ fallback شغال:
- الـ frontend حاليًا configured صح لاستخدام browser voice لو الـ server رجع 429
- الصوت هيكون أقل جودة بس هيشتغل

### Option 3: Alternative TTS Provider
لو عايز بديل تاني غير ElevenLabs (مثلاً Google Cloud TTS أو AWS Polly)، قولي وأنا أساعدك.

## التأكد من الـ Setup الحالي

### ✅ اللي اتعمل صح:
- ElevenLabs service configured with Egyptian voice "Amr" (yrPIy5b3iLnVLIBfUSw8)
- Fallback chain working: ElevenLabs → Browser
- All Gemini code removed completely
- API key secure (server-side only)

### ⚠️ المشكلة الوحيدة:
- ElevenLabs API quota exhausted (error 402)

## Test Commands

Test if server is running and fallback works:
```bash
cd backend
node server.js
# In another terminal:
curl -X POST http://localhost:5000/api/v1/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحبا"}' \
  --output test.mp3
# Should return 429 with {fallback: true} if ElevenLabs fails
```

## Next Steps
1. Check your ElevenLabs dashboard: https://elevenlabs.io/app/subscription
2. Either wait for monthly reset or get a new key
3. Update `.env` with new key
4. Restart backend server

---
**Current Voice**: Amr (Egyptian Arabic male, professional tone)  
**Current Model**: eleven_multilingual_v2  
**Monthly Limit**: 10,000 characters (free tier)
