import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon } from './icons';

const ImageRecognitionSearch = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
      performImageSearch();
    };
    reader.readAsDataURL(file);
  };

  const performImageSearch = () => {
    setSearching(true);
    // Simulate AI image recognition
    setTimeout(() => {
      setResults([
        { name: 'Porsche 911 Turbo S', similarity: 95, price: '$207,000' },
        { name: 'Porsche 911 GT3', similarity: 88, price: '$162,000' }
      ]);
      setSearching(false);
    }, 2000);
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'rgba(20,20,20,0.95)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Image Recognition Search
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
          Upload a car image and find similar models
        </p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '60px',
          borderRadius: '16px',
          border: '2px dashed rgba(201,168,76,0.3)',
          background: uploadedImage ? 'transparent' : 'rgba(255,255,255,0.03)',
          cursor: 'pointer',
          marginBottom: '24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px' }} />
        ) : (
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ fontSize: '16px', color: '#fff', fontWeight: 600 }}>
              Click to upload image
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {searching && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}
          >
            <SearchIcon size={48} color="#C9A84C" />
          </motion.div>
          <div style={{ fontSize: '16px', color: '#fff' }}>Analyzing image...</div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
            Similar Cars Found:
          </h4>
          {results.map((car, idx) => (
            <div key={idx} style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                  {car.name}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--gold)' }}>
                  {car.similarity}% match
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gold)' }}>
                {car.price}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageRecognitionSearch;
