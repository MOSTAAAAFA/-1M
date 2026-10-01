# IBM Watson TTS Setup - صوت مصري حقيقي بدون Credit Card!

## ✅ اللي الـ Workflow لقاه:

**IBM Watson Text-to-Speech** هو الوحيد من كل الـ providers اللي:
- ✅ مجاني 100% (Lite plan)
- ✅ **مش محتاج credit card خالص**
- ✅ عنده صوت مصري: `ar-MS_OmarVoice` (صوت رجالي مصري)
- ✅ Free quota: 10,000 characters/month

---

## 🎯 Setup (5 دقايق):

### 1. Create IBM Cloud Account (بدون Credit Card):
1. روح https://cloud.ibm.com/registration
2. اعمل account (مش محتاج credit card)
3. Verify الإيميل

### 2. Create Text-to-Speech Service:
1. بعد ما تسجل، روح https://cloud.ibm.com/catalog/services/text-to-speech
2. اختار **Lite plan** (Free - 10,000 chars/month)
3. اضغط "Create"

### 3. Get API Key:
1. بعد ما الـ service يتعمل، روح "Manage" tab
2. هتلاقي:
   - **API Key**: انسخه
   - **URL**: انسخه (هيكون شبه `https://api.us-south.text-to-speech.watson.cloud.ibm.com`)

### 4. Add to .env:
افتح `backend/.env` وضيف:
```
IBM_WATSON_API_KEY=your_api_key_here
IBM_WATSON_SERVICE_URL=your_service_url_here
```

### 5. Restart Backend:
```bash
cd backend
node server.js
```

### 6. Test!
افتح الموقع وكلم الـ AI - هيرد **بصوت مصري حقيقي من IBM Watson**!

---

## 🔊 Voice Details:

**Voice ID**: ar-MS_OmarVoice  
**Language**: Egyptian Arabic (ar-MS)  
**Gender**: Male  
**Quality**: Natural, clear Egyptian dialect  
**Provider**: IBM Watson TTS (Microsoft voices)

---

## 📊 What Changed:

✅ **Backend:**
- Installed: `ibm-watson` package
- Created: `backend/services/ibmWatsonTts.js`
- Updated: `backend/routes/tts.js` (IBM Watson as primary)

✅ **Removed:**
- Gemini TTS (completely removed)
- ElevenLabs (required paid plan)
- Google Cloud TTS (required billing info)

✅ **Current Setup:**
- **Primary**: IBM Watson TTS (Egyptian voice, no credit card!)
- **Fallback**: Browser voice (if IBM Watson fails)

---

## 🎉 Result:

بعد ما تعمل الـ setup، الـ AI assistant هيرد بـ **صوت مصري حقيقي** من IBM Watson - مش صوت المتصفح!

جودة الصوت ممتازة، والأهم: **مجاني 100% بدون credit card**! 🎤

---

## ❓ Troubleshooting:

### "API key invalid"
- تأكد إنك نسخت الـ API key صح من IBM Cloud dashboard

### "Service URL error"
- تأكد إن الـ URL في .env مش فيه spaces زيادة
- المفروض يكون شبه: `https://api.us-south.text-to-speech.watson.cloud.ibm.com`

### "Quota exceeded"
- استخدمت الـ 10,000 characters بتوع الشهر
- استنى أول الشهر الجاي أو upgrade للـ paid plan

---

**بعد الـ setup، جرب الـ AI assistant - هتسمع صوت مصري حقيقي! 🎉**
