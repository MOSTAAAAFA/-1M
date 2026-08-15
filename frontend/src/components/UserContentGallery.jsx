import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserContentGallery = () => {
  const [images, setImages] = useState([
    { id: 1, url: 'https://via.placeholder.com/400x300/C9A84C/000000?text=Car+1', user: 'John D.', likes: 234 },
    { id: 2, url: 'https://via.placeholder.com/400x300/E0C06A/000000?text=Car+2', user: 'Sarah M.', likes: 189 },
    { id: 3, url: 'https://via.placeholder.com/400x300/C9A84C/000000?text=Car+3', user: 'Mike R.', likes: 312 },
    { id: 4, url: 'https://via.placeholder.com/400x300/E0C06A/000000?text=Car+4', user: 'Emma L.', likes: 156 }
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert('Image uploaded successfully!');
    }, 1500);
  };

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            User Gallery
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
            Share your car photos with the community
          </p>
        </div>
        <label>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
              color: '#000',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isUploading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
                Uploading...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Photo
              </span>
            )}
          </motion.div>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {images.map((img) => (
          <motion.div
            key={img.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedImage(img)}
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <img src={img.url} alt="" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                {img.user}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {img.likes} likes
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.95)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={selectedImage.url}
              alt=""
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '16px' }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserContentGallery;
