import React, { useState, useEffect, useRef } from 'react';

const SYSTEM_PROMPT = `You are the AI concierge for 1M— an elite, high-performance car dealership specializing in luxury and sports vehicles (Porsche, Ferrari, Lamborghini, Bentley, Tesla, McLaren, and more).

Your role:
- Help customers find their perfect car based on preferences (speed, luxury, electric, family, etc.)
- Provide specific model recommendations with brief, compelling reasons
- Answer questions about specs, pricing ranges, financing, test drives, and trade-ins
- Keep a tone that is refined, confident, and knowledgeable — like a seasoned luxury car consultant
- Be concise: 1–3 sentences max per response unless asked for detail
- Never apologize or say you "can't" — always guide the customer forward`;

// ✅ Backend API endpoint — local backend in dev, deployed URL in production
const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_CHAT_URL || 'https://1m-motors-production.up.railway.app/api/chat')
  : 'http://localhost:5000/api/chat';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'اهلا اساعد حضرتك ازاي ؟'
    }
  ]);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const callAnthropicAPI = async (userMessage, history) => {
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
    return data.content?.map(b => b.text || '').join('') || 'Unable to respond. Please try again.';
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const updatedMessages = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const aiText = await callAnthropicAPI(userText, messages);
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') send();
  };

  return (
    <>
      {/* Floating AI Core Button */}
      <button
        onClick={() => setOpen(!open)}
        className="ai-floating-button"
        style={{
          position: 'fixed',
          bottom: 25,
          right: 25,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(10,10,14,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(201,168,76,0.5)',
          color: '#E0C06A',
          fontWeight: 700,
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.18)',
          fontSize: 13,
          letterSpacing: '0.05em',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.4)';
          e.currentTarget.style.borderColor = 'rgba(224,192,106,0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.18)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
        }}
      >
        {open ? '✕' : 'AI'}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 110,
          right: 25,
          width: 380,
          height: 540,
          background: 'rgba(10,10,14,0.96)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 18,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.08)'
        }}>
          {/* Gold top accent line */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 25%, #E0C06A 50%, rgba(201,168,76,0.5) 75%, transparent)',
            boxShadow: '0 0 18px rgba(201,168,76,0.6)',
            pointerEvents: 'none',
            zIndex: 1,
          }}/>

          {/* Header */}
          <div style={{
            padding: 14,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                color: '#c9a84c',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'baseline',
                gap: '2px'
              }}>
                <span style={{ fontSize: '14px' }}>1</span>
                <span style={{ fontSize: '14px' }}>M</span>
              </span>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: loading ? '#f59e0b' : '#4ade80',
                boxShadow: loading ? '0 0 6px #f59e0b' : '0 0 6px #4ade80',
                transition: 'all 0.3s'
              }} />
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: 14,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg,#c9a84c,#e0c06a)'
                    : 'rgba(255,255,255,0.06)',
                  color: m.role === 'user' ? '#000' : '#fff',
                  fontSize: 13,
                  lineHeight: 1.5,
                  borderBottomRightRadius: m.role === 'user' ? 3 : 12,
                  borderBottomLeftRadius: m.role === 'ai' ? 3 : 12,
                }}
              >
                {m.text}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 14px',
                borderRadius: 12,
                borderBottomLeftRadius: 3,
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                gap: 5,
                alignItems: 'center'
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#c9a84c',
                    display: 'inline-block',
                    animation: 'velBounce 1.2s infinite ease-in-out',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about speed, luxury, specs..."
              disabled={loading}
              style={{
                flex: 1,
                padding: 12,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: 13,
                fontFamily: 'inherit',
                opacity: loading ? 0.5 : 1
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? 'rgba(201,168,76,0.3)' : '#c9a84c',
                border: 'none',
                padding: '0 16px',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                fontWeight: 700,
                color: '#000',
                fontSize: 11,
                letterSpacing: '0.08em',
                transition: 'background 0.2s'
              }}
            >
              SEND
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes velBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
} 
