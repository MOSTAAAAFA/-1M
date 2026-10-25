import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SYSTEM_PROMPT = `You are the AI concierge for 1M— an elite, high-performance car dealership specializing in luxury and sports vehicles (Porsche, Ferrari, Lamborghini, Bentley, Tesla, McLaren, and more).

Your role:
- Help customers find their perfect car based on preferences (speed, luxury, electric, family, etc.)
- Provide specific model recommendations with brief, compelling reasons
- Answer questions about specs, pricing ranges, financing, test drives, and trade-ins
- Keep a tone that is refined, confident, and knowledgeable — like a seasoned luxury car consultant
- Be concise: 1–3 sentences max per response unless asked for detail
- Never apologize or say you "can't" — always guide the customer forward

VOICE MODE: When replying via voice, respond in natural Egyptian colloquial Arabic (عامية مصرية). Keep it conversational and short (2-4 sentences max). No markdown, no emojis, no bullet lists. Write numbers and car names clearly for easy pronunciation. Maintain the refined luxury consultant tone.`;

// ✅ Backend API endpoint — local backend in dev, deployed URL in production
const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_CHAT_URL || 'https://1m-motors-production.up.railway.app/api/chat')
  : 'http://localhost:5000/api/chat';

// Voice API endpoints
const VOICE_URL = process.env.NODE_ENV === 'production'
  ? 'https://1m-motors-production.up.railway.app/api/v1/voice/speak'
  : 'http://localhost:5000/api/v1/voice/speak';

// Web Speech API recognition singleton (defined once per app load).
let voiceRecognition = null;
try {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) voiceRecognition = new SR();
} catch { /* Web Speech API not available */ }

export default function AIAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState('');
  const [voiceGender, setVoiceGender] = useState(
    localStorage.getItem('voiceGender') || 'male'
  );
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'اهلا اساعد حضرتك ازاي ؟'
    }
  ]);

  const endRef = useRef(null);
  const inputRef = useRef(null);
  const recRef = useRef(voiceRecognition);
  const audioRef = useRef(null);
  const speakingRef = useRef(false);

  // Save voice gender preference
  useEffect(() => {
    localStorage.setItem('voiceGender', voiceGender);
  }, [voiceGender]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, interim, listening]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // ── Mic wiring (Web Speech → the SAME chat flow) ──────────────────────────
  const submitRef = useRef(null);

  useEffect(() => {
    if (!recRef.current) return;
    const rec = recRef.current;
    rec.lang = 'ar-EG';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interimText = '';
      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interimText += t;
      }
      setInterim(interimText);
      if (finalText.trim() && submitRef.current) submitRef.current(finalText.trim());
    };

    rec.onerror = () => {
      setListening(false);
      setInterim('');
    };
    rec.onend = () => {
      setListening(false);
      setInterim('');
    };
  }, []);

  // ── Chat (unchanged flow/endpoint) ────────────────────────────────────────
  const callChatAPI = async (userMessage, history) => {
    const apiMessages = history
      .filter((_, i) => i > 0)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

    apiMessages.push({ role: 'user', content: userMessage });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: apiMessages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || 'API error');
    }

    const data = await response.json();
    return data; // { content:[{text}], actions:[{type:'navigate',path}] }
  };

  const releaseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      const src = audioRef.current.src;
      audioRef.current = null;
      if (src && src.startsWith('blob:')) URL.revokeObjectURL(src);
    }
  };

  const playAudio = useCallback((url, onEnded) => {
    releaseAudio();
    const el = new Audio();
    audioRef.current = el;
    speakingRef.current = true;
    setSpeaking(true);
    el.src = url;
    el.onended = () => {
      console.log('[TTS] IBM Watson audio finished playing');
      speakingRef.current = false;
      setSpeaking(false);
      audioRef.current = null;
      onEnded && onEnded();
    };
    el.onerror = (e) => {
      console.warn('[TTS] IBM Watson audio element ERROR:', e.message || e);
      speakingRef.current = false;
      setSpeaking(false);
      audioRef.current = null;
      onEnded && onEnded();
    };
    el.play().catch((e) => {
      console.warn('[TTS] IBM Watson audio play() rejected:', e.message || e);
      speakingRef.current = false;
      setSpeaking(false);
      audioRef.current = null;
      onEnded && onEnded();
    });
  }, []);

  // Google Cloud TTS (Arabic Wavenet Neural) - NO browser fallback
  const speak = useCallback(async (text, onEnded) => {
    if (!text) {
      if (onEnded) onEnded();
      return;
    }

    try {
      console.log('[Voice] Calling Google Cloud TTS...');
      const res = await fetch(VOICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: voiceGender })
      });

      const contentType = res.headers.get('content-type') || '';

      // Check if fallback JSON (Google TTS not configured or failed)
      if (contentType.includes('application/json')) {
        const data = await res.json();
        console.warn('[Voice] Google TTS not available:', data.message);

        // NO browser TTS fallback — just show text message
        setMessages(prev => [...prev, {
          role: 'system',
          text: data.message || 'معذرة، الصوت مش متاح دلوقتي. لازم تضبط Google Cloud TTS الأول.'
        }]);
        if (onEnded) onEnded();
        return;
      }

      // Success: Google TTS returned audio
      if (contentType.includes('audio')) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        releaseAudio();
        const audio = new Audio(url);
        audioRef.current = audio;

        speakingRef.current = true;
        setSpeaking(true);

        audio.onended = () => {
          console.log('[Voice] Google TTS audio playback ended');
          URL.revokeObjectURL(url);
          speakingRef.current = false;
          setSpeaking(false);
          audioRef.current = null;
          if (onEnded) onEnded();
        };

        audio.onerror = (e) => {
          console.error('[Voice] Google TTS audio playback error:', e);
          URL.revokeObjectURL(url);
          speakingRef.current = false;
          setSpeaking(false);
          audioRef.current = null;
          if (onEnded) onEnded();
        };

        await audio.play().catch(err => {
          console.warn('[Voice] Autoplay blocked:', err.message);
          setMessages(prev => [...prev, {
            role: 'ai',
            text: 'اضغط على زرار التشغيل لسماع الرد'
          }]);
          speakingRef.current = false;
          setSpeaking(false);
          if (onEnded) onEnded();
        });
      }
    } catch (err) {
      console.error('[Voice] Error:', err.message);
      speakingRef.current = false;
      setSpeaking(false);
      if (onEnded) onEnded();
    }
  }, [voiceGender]);

  // Execute assistant actions (navigation to real app routes).
  const runActions = useCallback((actions, confirmText) => {
    if (!Array.isArray(actions)) return;
    for (const action of actions) {
      if (action?.type === 'navigate' && action.path) {
        // Say the confirmation aloud, then navigate shortly after — never let
        // speech lifecycle block the navigation.
        speak(confirmText || action.path);
        setTimeout(() => navigate(action.path), 1500);
      }
    }
  }, [speak, navigate]);

  const submit = useCallback(async (userText) => {
    const text = (userText || '').trim();
    if (!text || loading) return;

    setInput('');
    setInterim('');

    const updatedMessages = [...messages, { role: 'user', text }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const data = await callChatAPI(text, messages);
      const aiText = data.content?.map(b => b.text || '').join('').trim() || 'Unable to respond. Please try again.';
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      speak(aiText);
      runActions(data.actions, aiText);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
      setSpeaking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, loading, speak, runActions]);

  submitRef.current = submit;

  const send = () => submit(input);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit(input);
  };

  const toggleListen = () => {
    const rec = recRef.current;
    if (!rec) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "Voice input isn't supported in this browser."
      }]);
      return;
    }
    if (listening) {
      rec.stop();
      setListening(false);
      return;
    }
    try {
      rec.start();
      setListening(true);
    } catch { /* already started */ }
  };

  return (
    <>
      {/* Floating AI Core Button */}
      <button
        onClick={() => setOpen(!open)}
        className="ai-floating-button"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(10,10,14,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '2px solid #E8C04E',
          color: '#E8C04E',
          fontWeight: 700,
          cursor: 'pointer',
          zIndex: 9998,
          fontSize: 16,
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(232, 192, 78, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(232, 192, 78, 0.15)';
          e.currentTarget.style.borderColor = '#FFE566';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6), 0 0 30px rgba(255, 229, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(10,10,14,0.7)';
          e.currentTarget.style.borderColor = '#E8C04E';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(232, 192, 78, 0.3)';
        }}
      >
        {open ? '✕' : 'AI'}
      </button>

      {/* Chat Window - Ultra Premium Design */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 110,
          right: 25,
          width: 420,
          height: 600,
          background: 'linear-gradient(145deg, rgba(8,8,11,0.98), rgba(12,12,16,0.98))',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          zIndex: 9999,
          boxShadow: `
            0 50px 100px -20px rgba(0,0,0,0.9),
            0 30px 60px -30px rgba(0,0,0,0.8),
            0 0 0 1px rgba(201,168,76,0.2),
            inset 0 1px 0 0 rgba(255,255,255,0.03),
            0 0 80px rgba(201,168,76,0.08)
          `
        }}>
          {/* Premium header accent */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}/>

          {/* Premium Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(224,192,106,0.08))',
                border: '1px solid rgba(201,168,76,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: '#E0C06A',
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: '0.05em'
                }}>
                  1M
                </span>
              </div>
              <div>
                <div style={{
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: '0.01em',
                  marginBottom: 4
                }}>
                  AI Concierge
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: listening ? '#ef4444' : (speaking ? '#f59e0b' : (loading ? '#f59e0b' : '#4ade80')),
                    boxShadow: listening ? '0 0 8px #ef4444' : (speaking ? '0 0 8px #f59e0b' : '0 0 8px #4ade80')
                  }} />
                  <span style={{
                    color: listening ? '#ef4444' : (speaking ? '#f59e0b' : (loading ? '#f59e0b' : '#4ade80')),
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase'
                  }}>
                    {listening ? 'Listening' : (speaking ? 'Speaking' : (loading ? 'Thinking' : 'Online'))}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: 16,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages - Ultra Premium */}
          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'rgba(0,0,0,0.1)'
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: m.role === 'user' ? '12px 16px' : '14px 18px',
                  borderRadius: m.role === 'user' ? 16 : 18,
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #c9a84c 0%, #e0c06a 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: m.role === 'user' ? '#000000' : '#ffffff',
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: m.role === 'user' ? 500 : 400,
                  letterSpacing: '0.01em',
                  borderBottomRightRadius: m.role === 'user' ? 4 : 18,
                  borderBottomLeftRadius: m.role === 'ai' ? 4 : 18,
                  boxShadow: m.role === 'user'
                    ? '0 4px 12px rgba(201,168,76,0.25), 0 0 0 1px rgba(201,168,76,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {m.text}
              </div>
            ))}

            {interim && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '12px 16px',
                borderRadius: 16,
                borderBottomLeftRadius: 4,
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))',
                border: '1px solid rgba(239,68,68,0.2)',
                color: 'rgba(255,255,255,0.85)',
                fontStyle: 'italic',
                fontSize: 13,
                letterSpacing: '0.01em'
              }}>
                {interim}
              </div>
            )}

            {/* Premium Typing indicator */}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '14px 18px',
                borderRadius: 18,
                borderBottomLeftRadius: 4,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: 6,
                alignItems: 'center'
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                    display: 'inline-block',
                    opacity: 0.4,
                    animation: 'premiumPulse 1.4s infinite ease-in-out',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            )}

            {/* Waveform visualization when speaking */}
            {speaking && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '14px 18px',
                borderRadius: 18,
                borderBottomLeftRadius: 4,
                background: 'linear-gradient(145deg, rgba(201,168,76,0.15), rgba(224,192,106,0.08))',
                border: '1px solid rgba(201,168,76,0.2)',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
                height: 48
              }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      width: 3,
                      background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                      borderRadius: 2,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Premium Input Bar - No motion, no golden border */}
          <div style={{
            padding: '20px 20px 24px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)'
          }}>
            {/* Voice Gender Selector */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 12,
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setVoiceGender('male')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  background: voiceGender === 'male'
                    ? 'linear-gradient(135deg, #c9a84c, #e0c06a)'
                    : 'rgba(255,255,255,0.04)',
                  border: voiceGender === 'male'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: voiceGender === 'male' ? '#000' : 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.03em'
                }}
              >
                🎙️ ذكر
              </button>
              <button
                onClick={() => setVoiceGender('female')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  background: voiceGender === 'female'
                    ? 'linear-gradient(135deg, #c9a84c, #e0c06a)'
                    : 'rgba(255,255,255,0.04)',
                  border: voiceGender === 'female'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: voiceGender === 'female' ? '#000' : 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.03em'
                }}
              >
                🎙️ أنثى
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '4px',
              alignItems: 'center'
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={listening ? 'بتسمعك... اتكلم' : 'اسأل عن عربية...'}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  opacity: loading ? 0.5 : 1,
                  letterSpacing: '0.01em',
                  boxShadow: 'none',
                  WebkitAppearance: 'none',
                  transition: 'none'
                }}
                onFocus={(e) => {
                  // Keep parent border unchanged
                  e.target.parentElement.style.border = '1px solid rgba(255,255,255,0.08)';
                  e.target.parentElement.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  // Keep parent border unchanged
                  e.target.parentElement.style.border = '1px solid rgba(255,255,255,0.08)';
                  e.target.parentElement.style.boxShadow = 'none';
                }}
              />
              {/* Premium Mic button */}
              <button
                onClick={toggleListen}
                disabled={loading}
                title={listening ? 'Stop listening' : 'Speak'}
                style={{
                  background: listening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.04)',
                  border: listening ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: loading ? 'default' : 'pointer',
                  color: listening ? '#fff' : '#c9a84c',
                  transition: 'all 0.2s',
                  boxShadow: listening ? '0 4px 12px rgba(239,68,68,0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!loading && !listening) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!listening) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </button>

              {/* Premium Send button */}
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim()
                    ? 'rgba(201,168,76,0.2)'
                    : 'linear-gradient(135deg, #c9a84c 0%, #e0c06a 100%)',
                  border: 'none',
                  borderRadius: 12,
                  padding: '0 20px',
                  height: 44,
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  fontWeight: 700,
                  color: loading || !input.trim() ? 'rgba(0,0,0,0.4)' : '#000',
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s',
                  boxShadow: loading || !input.trim()
                    ? 'none'
                    : '0 4px 12px rgba(201,168,76,0.3), 0 0 0 1px rgba(201,168,76,0.4)',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(201,168,76,0.4), 0 0 0 1px rgba(201,168,76,0.6)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,168,76,0.3), 0 0 0 1px rgba(201,168,76,0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes premiumPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }

        .waveform-bar {
          animation: waveform 0.6s ease-in-out infinite;
        }

        /* Remove golden border from input focus */
        input:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        input:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .waveform-bar, .premiumPulse {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}