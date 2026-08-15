import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceSearch = ({ onSearch, placeholder = 'Say something...' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onSearch) onSearch(text);
    };

    recognition.onerror = (event) => {
      setError('Could not understand. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
    }}>
      <motion.button
        onClick={startListening}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isListening
            ? ['0 0 0 0 rgba(201,168,76,0.7)', '0 0 0 20px rgba(201,168,76,0)']
            : '0 0 0 0 rgba(201,168,76,0)',
        }}
        transition={{
          duration: 1.5,
          repeat: isListening ? Infinity : 0,
        }}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: isListening ? '2px solid var(--gold)' : '1px solid rgba(201,168,76,0.3)',
          background: isListening
            ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)'
            : 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {isListening ? (
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </motion.svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
      </motion.button>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(17,17,23,0.98) 0%, rgba(25,25,33,0.98) 100%)',
              border: '1px solid rgba(201,168,76,0.3)',
              backdropFilter: 'blur(10px)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              color: 'var(--white)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            "{transcript}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)',
              backdropFilter: 'blur(10px)',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: '#FF4444',
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Indicator */}
      {isListening && (
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-ui)',
          fontSize: '11px',
          color: 'var(--gold)',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '6px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </span>
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
