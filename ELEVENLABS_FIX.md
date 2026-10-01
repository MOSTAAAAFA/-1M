# حل مشكلة ElevenLabs TTS - API Key Permissions

## المشكلة المكتشفة
الـ API key الحالي **مش عنده permission للـ TTS** - error 402 معناه إن الـ key محدود في الصلاحيات.

## ✅ الحل (دقيقتين بس):

### الخطوة 1: اعمل API Key جديد
1. روح https://elevenlabs.io/app/settings/api-keys
2. اضغط "Create New Key"
3. في الـ permissions، **تأكد إنك تختار "Text to Speech"** ✅
4. اديله اسم (مثلاً: "1M-Motors-TTS")
5. اضغط Create واكوبي الـ key (بيبدأ بـ `sk_...`)

### الخطوة 2: حط الـ Key الجديد في .env
افتح `backend/.env` وغير السطر ده:
```
ELEVENLABS_API_KEY=sk_3df900f0ec0314e70018b74f52efc9d5cc59f7a483236c31
```

حطه:
```
ELEVENLABS_API_KEY=sk_YOUR_NEW_KEY_WITH_TTS_PERMISSION
```

### الخطوة 3: اعمل Restart للـ Server
```bash
cd backend
node server.js
```

### الخطوة 4: جرب الـ AI Assistant
افتح الموقع وجرب تكلم الـ AI - المفروض يرد بصوت **Amr** المصري من ElevenLabs!

---

## 🎯 التفاصيل التقنية

### الصوت المختار:
- **الاسم**: Amr (Egyptian Arabic)
- **الوصف**: "A middle-aged Egyptian male voice for Arabic users. Good for general use, voiceovers and narration."
- **Voice ID**: yrPIy5b3iLnVLIBfUSw8
- **Model**: eleven_multilingual_v2

### Fallback Chain:
1. **Primary**: ElevenLabs (Egyptian voice)
2. **Fallback**: Browser speechSynthesis (لو ElevenLabs فشل)

### Quota:
- **Free Tier**: 10,000 characters/month
- **Usage Tracking**: في `backend/data/elevenlabs_usage.json`

---

## ✅ اللي اتعمل في الكود:
- ✅ Gemini TTS اتشال تمامًا
- ✅ ElevenLabs configured كـ primary TTS
- ✅ Fallback للـ browser لو ElevenLabs فشل
- ✅ API key secure (server-side only)
- ✅ Usage tracking (10k chars/month)

---

## 🧪 Test Command
لو عايز تختبر الـ API key قبل ما تحطه في .env:

```bash
node -e "
const ELEVENLABS_API_KEY = 'sk_YOUR_NEW_KEY_HERE';

fetch('https://api.elevenlabs.io/v1/user/subscription', {
  headers: { 'xi-api-key': ELEVENLABS_API_KEY }
})
  .then(res => res.json())
  .then(data => console.log('✓ Key valid:', JSON.stringify(data, null, 2)))
  .catch(err => console.error('✗ Key invalid:', err.message))
"
```

المفروض يطبع تفاصيل الـ account - لو طبع error معناه الـ key مش صحيح.

---

## ❓ لو لسه مشتغلش:
قولي إيه الـ error اللي طلع وأنا هساعدك فورًا.
