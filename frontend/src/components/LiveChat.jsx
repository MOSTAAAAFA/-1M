import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! How can I help you today?', time: '10:30 AM' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botReply = {
        id: messages.length + 2,
        type: 'bot',
        text: 'Thank you for your message! Our team will respond shortly.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    }, 2000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '100px',
          left: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
          boxShadow: '0 8px 32px rgba(201,168,76,0.4)',
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Online Indicator */}
        {isOnline && !isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#25D366',
              border: '2px solid #000',
            }}
          />
        )}

        {/* Unread Badge */}
        {!isOpen && messages.filter(m => m.type === 'bot').length > 1 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '20px',
            height: '20px',
            borderRadius: '10px',
            background: '#FF4444',
            color: '#FFF',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
          }}>
            {messages.filter(m => m.type === 'bot').length - 1}
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '170px',
              left: '24px',
              width: '380px',
              height: '600px',
              zIndex: 9998,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(17,17,23,0.98) 0%, rgba(25,25,33,0.98) 100%)',
              border: '1px solid rgba(201,168,76,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(201,168,76,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#000',
              }}>
                1M
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--white)',
                }}>
                  1M Motors Support
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  color: isOnline ? '#25D366' : 'rgba(240,237,232,0.5)',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isOnline ? '#25D366' : 'rgba(240,237,232,0.3)',
                  }} />
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.type === 'user'
                      ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)'
                      : 'rgba(255,255,255,0.05)',
                    color: msg.type === 'user' ? '#000' : 'var(--white)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    color: 'rgba(240,237,232,0.4)',
                    marginTop: '4px',
                    textAlign: msg.type === 'user' ? 'right' : 'left',
                  }}>
                    {msg.time}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '12px 16px',
                    borderRadius: '16px 16px 16px 4px',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -8, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--gold)',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(201,168,76,0.2)',
              display: 'flex',
              gap: '12px',
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(201,168,76,0.2)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <motion.button
                onClick={sendMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
                  cursor: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;
