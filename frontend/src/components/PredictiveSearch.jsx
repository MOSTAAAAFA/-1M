import React, { useState, useEffect } from 'react';
import { SearchIcon } from './icons';

const PredictiveSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setPredictions([]);
      return;
    }

    // Simulate ML-based predictive search
    const predict = setTimeout(() => {
      const suggestions = [
        'Porsche 911 Turbo S',
        'Porsche Cayenne',
        'Porsche Taycan',
        'BMW M5',
        'Mercedes S-Class'
      ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

      setPredictions(suggestions);
    }, 300);

    return () => clearTimeout(predict);
  }, [query]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing to search..."
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(201,168,76,0.2)',
          color: '#fff',
          fontSize: '16px',
          outline: 'none'
        }}
      />

      {predictions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          borderRadius: '12px',
          background: 'rgba(20,20,20,0.98)',
          border: '1px solid rgba(201,168,76,0.2)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {predictions.map((pred, idx) => (
            <div
              key={idx}
              onClick={() => {
                setQuery(pred);
                onSearch?.(pred);
                setPredictions([]);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: idx < predictions.length - 1 ? '1px solid rgba(201,168,76,0.1)' : 'none',
                color: '#fff',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(201,168,76,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <SearchIcon size={14} color="#C9A84C" style={{ flexShrink: 0, marginTop: 2 }} /> {pred}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictiveSearch;
