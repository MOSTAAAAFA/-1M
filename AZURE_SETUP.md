# Azure Speech Service Setup (Egyptian Arabic TTS)

## Free Tier (F0)
- **500,000 characters/month** free
- Egyptian Arabic Neural voices: `ar-EG-ShakirNeural` (male), `ar-EG-SalmaNeural` (female)
- No credit card required during trial

---

## Steps to Get API Key:

### 1. Create Azure Account
- Go to: https://portal.azure.com
- Sign up with Microsoft account (free trial available)
- No credit card needed for free tier

### 2. Create Speech Service Resource
1. In Azure Portal, click **"Create a resource"**
2. Search for **"Speech"** or **"Speech Service"**
3. Click **"Create"**

### 3. Configure Resource
- **Subscription**: Select your subscription
- **Resource Group**: Create new (e.g., "porsche-voice-rg")
- **Region**: Choose **"East US"** (or nearest)
- **Name**: e.g., "porsche-voice-tts"
- **Pricing Tier**: Select **"F0 (Free)"**
- Click **"Review + Create"** → **"Create"**

### 4. Get API Key
1. After deployment, click **"Go to resource"**
2. In left menu, click **"Keys and Endpoint"**
3. Copy **Key 1** (or Key 2)
4. Copy **Location/Region** (e.g., "eastus")

---

## Add to Backend .env

Create/edit `backend/.env`:

```env
# Azure Speech Service (Egyptian Arabic TTS)
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=eastus
```

---

## Test Voice Mode

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm start`
3. Open chat, press mic button
4. Say in Egyptian Arabic: **"عايز أعرف عن بورش 911"**
5. AI replies with **real Egyptian Arabic neural voice** (ar-EG-ShakirNeural/SalmaNeural)

---

## Free Tier Limits

- **500k characters/month** = ~10,000 sentences
- Perfect for demos and testing
- Resets monthly

---

## Alternative: No Azure Key (Browser TTS Fallback)

If you don't want to create Azure account, the app will automatically fallback to **browser Web Speech API** (ar-EG).

Quality: Browser TTS < Azure Neural TTS

---

## Troubleshooting

### "AZURE_SPEECH_KEY not configured"
→ Add key to `backend/.env` and restart backend

### Voice still sounds robotic
→ Make sure Azure key is valid and region matches

### No sound at all
→ Check browser console for errors, ensure HTTPS (or localhost)

---

## Demo Script (Egyptian Arabic)

Test with these phrases:

1. **"عايز أعرف الفرق بين بورش 911 وفيراري F8"**
2. **"كام سعر لامبورجيني أوروس؟"**
3. **"عايز أحجز تجربة قيادة"**
4. **"أسرع عربية عندكم إيه؟"**
5. **"في عربيات كهربا فاخرة؟"**

---

**Azure Portal**: https://portal.azure.com
**Pricing**: https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/
