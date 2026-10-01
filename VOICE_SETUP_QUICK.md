# Google Cloud TTS Setup - الدليل السريع (5 دقائق)

## ✅ الخطوات السريعة

### 1️⃣ Create Google Cloud Account
- **Link**: https://console.cloud.google.com
- Sign in with Gmail (مش محتاج فيزا)
- مجاني تماماً للـfree tier

---

### 2️⃣ Create Project
1. في الـtop bar، اضغط على **"Select a project"**
2. اختار **"NEW PROJECT"**
3. **Project name**: `porsche-voice-tts`
4. اضغط **"CREATE"**

---

### 3️⃣ Enable Text-to-Speech API
1. **Direct link**: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
2. تأكد إن المشروع اللي عملته مختار (في الـtop bar)
3. اضغط الزرار الأزرق **"ENABLE"**
4. استنى 10-15 ثانية للـAPI تتفعّل

---

### 4️⃣ Create Service Account
1. **Direct link**: https://console.cloud.google.com/iam-admin/serviceaccounts
2. اضغط **"+ CREATE SERVICE ACCOUNT"** (فوق)
3. **Service account name**: `porsche-tts`
4. **Service account ID**: هيتملى تلقائياً
5. اضغط **"CREATE AND CONTINUE"**

---

### 5️⃣ Grant Permissions
1. في "Grant this service account access to project":
   - اضغط على الـdropdown **"Select a role"**
   - ابحث عن: **"Text-to-Speech"**
   - اختار: **"Cloud Text-to-Speech User"**
2. اضغط **"CONTINUE"**
3. اضغط **"DONE"** (skip step 3)

---

### 6️⃣ Download JSON Key
1. في قائمة الـservice accounts، هتلاقي `porsche-tts@...` اللي عملته
2. اضغط على الـ**3 dots** (⋮) في آخر الصف
3. اختار **"Manage keys"**
4. اضغط **"ADD KEY"** → **"Create new key"**
5. اختار **"JSON"**
6. اضغط **"CREATE"**
7. هينزّل ملف JSON (مثلاً: `porsche-voice-tts-abc123-xyz456.json`)

---

### 7️⃣ Add Key to Backend

#### أ) Create config folder:
```bash
mkdir backend/config
```

#### ب) Move JSON key:
- خد الملف اللي اتنزّل (مثلاً: `porsche-voice-tts-abc123-xyz456.json`)
- احفظه في: `backend/config/google-tts-key.json`

#### ج) Update .env:
اعمل/عدّل ملف `backend/.env`:
```env
# Google Cloud Text-to-Speech
GOOGLE_APPLICATION_CREDENTIALS=./config/google-tts-key.json
GOOGLE_CLOUD_PROJECT=porsche-voice-tts
```

#### د) Update .gitignore:
أضف السطر ده لـ`backend/.gitignore` (أو `.gitignore` في الـroot):
```
# Google Cloud credentials
backend/config/google-tts-key.json
config/google-tts-key.json
```

---

### 8️⃣ Test Voice Mode

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend** (في terminal تاني):
   ```bash
   cd frontend
   npm start
   ```

3. **Open browser**: http://localhost:3000

4. **Test voice**:
   - اضغط على الـAI chat button (أسفل يمين)
   - اضغط على المايك 🎙️
   - قول بالمصري: **"عايز أعرف عن بورش 911"**
   - الـAI هيرد بصوت **عربي neural عالي الجودة** ✅

---

## 🎤 Demo Script (للبروفيسور)

جرب الجمل دي:

1. **"عايز أعرف الفرق بين بورش 911 وفيراري F8"**
2. **"كام سعر لامبورجيني أوروس؟"**
3. **"عايز أحجز تجربة قيادة لماكلارين 720S"**
4. **"أسرع عربية عندكم إيه؟"**
5. **"في عربيات كهربا فاخرة متاحة؟"**
6. **"عايز عربية عائلية بس رياضية كمان"**

---

## ⚠️ Troubleshooting

### "معذرة، الصوت مش متاح دلوقتي"
→ تأكد إن:
1. ✅ الـJSON key file موجود في `backend/config/google-tts-key.json`
2. ✅ الـ`.env` file فيه الـpath الصح
3. ✅ عملت restart للـbackend بعد ما ضفت الـkey
4. ✅ عملت Enable للـText-to-Speech API في Google Console

### Backend error: "Could not load the default credentials"
→ الـ`GOOGLE_APPLICATION_CREDENTIALS` path غلط أو الملف مش موجود
- تأكد إن الـpath نسبي من مكان الـ`server.js`: `./config/google-tts-key.json`

### "API has not been used in project before or it is disabled"
→ مفعلتش الـText-to-Speech API
- روح على: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- اضغط **ENABLE**

### No sound in browser
→ تأكد إن:
1. ✅ المتصفح مسموح له يشغّل صوت (autoplay)
2. ✅ Volume مش muted
3. ✅ شوف الـbrowser console للـerrors (F12)

---

## 📊 Free Tier Limits

- **Google Cloud TTS Wavenet**: 1 million characters/month
- **≈ 20,000 sentences** مجاناً كل شهر
- Perfect for demos and testing
- Resets automatically every month

---

## ✅ You're Done!

Voice mode شغال دلوقتي بصوت **عربي neural عالي الجودة** (ar-XA-Wavenet).

**Note**: الصوت Modern Standard Arabic (فصحى)، مش Egyptian dialect. لكن Claude بيرد بالمصري والجودة عالية جداً.

---

## 🔗 Useful Links

- **Google Cloud Console**: https://console.cloud.google.com
- **Text-to-Speech API**: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- **Service Accounts**: https://console.cloud.google.com/iam-admin/serviceaccounts
- **Voice Gallery**: https://cloud.google.com/text-to-speech/docs/voices (preview voices)
- **Pricing**: https://cloud.google.com/text-to-speech/pricing (confirm free tier)

---

**Setup time**: ~5-10 minutes
**Free tier**: 1M chars/month (no credit card)
**Voice quality**: ⭐⭐⭐⭐⭐ Neural (Wavenet)
