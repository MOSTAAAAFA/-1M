# Google Cloud TTS Setup - الإعداد السريع

## ✅ اللي اتعمل:
1. ✅ Google Cloud TTS SDK installed
2. ✅ Service file created: `backend/services/googleTts.js`
3. ✅ TTS route updated to use Google Cloud TTS
4. ✅ Frontend updated with Google TTS references

## 🎯 الخطوة الأخيرة (3 دقايق):

### جيب API Key من Google Cloud:

1. **روح Google Cloud Console:**
   https://console.cloud.google.com/

2. **اعمل Project جديد** (لو مش عامل قبل كده):
   - اضغط على "Select a project" → "New Project"
   - اديله اسم (مثلاً: "1M-Motors")
   - اضغط "Create"

3. **Enable الـ Text-to-Speech API:**
   - روح https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   - اضغط "Enable"

4. **اعمل API Key:**
   - روح https://console.cloud.google.com/apis/credentials
   - اضغط "Create Credentials" → "API Key"
   - انسخ الـ key (بيبدأ بـ `AIza...`)

5. **حط الـ Key في .env:**
   افتح `backend/.env` وضيف السطر ده:
   ```
   GOOGLE_CLOUD_TTS_KEY=AIzaYourKeyHere
   ```

6. **اعمل Restart للـ Backend Server:**
   ```bash
   cd backend
   node server.js
   ```

7. **جرب الـ AI Assistant:**
   افتح الموقع وكلم الـ AI - المفروض يرد بصوت عربي كويس!

---

## 🔊 الصوت المختار:

**Voice Name**: ar-XA-Wavenet-B  
**Description**: Male Arabic voice with natural, clear pronunciation  
**Quality**: Wavenet (أعلى جودة في Google)  
**Language**: Arabic (ar-XA) - عربي فصيح بنطق واضح

---

## 📊 المميزات:

- **مجاني 100%**: 1 مليون حرف/شهر (100x أكتر من ElevenLabs!)
- **مش محتاج credit card**
- **جودة Wavenet ممتازة**
- **Usage tracking**: في `backend/data/google_tts_usage.json`

---

## 🧪 اختبار سريع:

لو عايز تختبر الـ API key قبل ما تحطه في .env:

```bash
node -e "
const {TextToSpeechClient} = require('@google-cloud/text-to-speech');
const client = new TextToSpeechClient({apiKey: 'AIzaYourKeyHere'});

client.synthesizeSpeech({
  input: {text: 'مرحبا'},
  voice: {languageCode: 'ar-XA', name: 'ar-XA-Wavenet-B'},
  audioConfig: {audioEncoding: 'MP3'}
})
  .then(([res]) => console.log('✓ SUCCESS! Audio bytes:', res.audioContent.length))
  .catch(err => console.error('✗ FAILED:', err.message))
"
```

المفروض يطبع: `✓ SUCCESS! Audio bytes: [number]`

---

## ✅ ملخص التغييرات:

### Backend:
- ✅ Gemini TTS removed completely
- ✅ ElevenLabs replaced with Google Cloud TTS
- ✅ New service: `backend/services/googleTts.js`
- ✅ Route updated: `backend/routes/tts.js`

### Frontend:
- ✅ All references updated from ElevenLabs to Google TTS
- ✅ Comments and logs updated

### Fallback Chain:
- **Primary**: Google Cloud TTS (ar-XA-Wavenet-B)
- **Fallback**: Browser speechSynthesis

---

## ❓ لو حصل Error:

### Error: "Request had invalid authentication credentials"
- الـ API key غلط أو مش valid
- تأكد إنك enable الـ Text-to-Speech API

### Error: "API key not valid"
- تأكد إنك enable الـ "Cloud Text-to-Speech API" في الـ project

### Error: "Quota exceeded"
- انت استخدمت الـ 1 million characters بتوع الشهر
- استنى أول الشهر الجاي أو upgrade للـ paid plan

---

**بعد ما تحط الـ API key وتعمل restart للـ server، جرب الـ AI Assistant - المفروض يشتغل فورًا! 🎉**
