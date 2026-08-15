import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoReviewsSystem = ({ productId }) => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Amazing Porsche 911 Experience!',
      author: 'John Smith',
      thumbnail: 'https://via.placeholder.com/400x225/C9A84C/000000?text=Video+1',
      duration: '3:45',
      views: 1234,
      likes: 89,
      date: '2 days ago',
      verified: true
    },
    {
      id: 2,
      title: 'Test Drive Review - Performance',
      author: 'Sarah Johnson',
      thumbnail: 'https://via.placeholder.com/400x225/E0C06A/000000?text=Video+2',
      duration: '5:20',
      views: 2156,
      likes: 145,
      date: '1 week ago',
      verified: true
    }
  ]);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('File size must be less than 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          alert('Video uploaded successfully! (Demo mode)');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '8px'
          }}>
            Video Reviews
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
            {videos.length} video reviews
          </p>
        </div>

        <motion.button
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
            border: 'none',
            color: '#000',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="6" width="13" height="12" rx="2" />
            <polyline points="15 10 22 6 22 18 15 14" />
          </svg>
          Upload Video Review
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            marginBottom: '24px'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '14px', color: '#fff' }}>Uploading video...</span>
            <span style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: 600 }}>
              {uploadProgress}%
            </span>
          </div>
          <div style={{
            height: '8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #C9A84C 0%, #E0C06A 100%)',
                borderRadius: '4px'
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Video Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedVideo(video)}
            style={{
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.2)',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            {/* Thumbnail */}
            <div style={{ position: 'relative' }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(201,168,76,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(0,0,0,0.8)',
                fontSize: '12px',
                color: '#fff',
                fontWeight: 600
              }}>
                {video.duration}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '16px' }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
                lineHeight: '1.4'
              }}>
                {video.title}
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: 'rgba(240,237,232,0.8)' }}>
                  {video.author}
                </span>
                {video.verified && (
                  <span style={{ display: 'flex', color: '#25D366' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                )}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: 'rgba(240,237,232,0.6)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {video.views.toLocaleString()} views
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {video.likes} likes
                </span>
                <span>{video.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '900px',
                width: '100%',
                borderRadius: '20px',
                background: '#1A1A1A',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="6" width="13" height="12" rx="2" />
                      <polyline points="15 10 22 6 22 18 15 14" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '16px' }}>Video player (Demo mode)</div>
                  <div style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)', marginTop: '8px' }}>
                    Requires video streaming integration
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  {selectedVideo.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(240,237,232,0.8)' }}>
                    {selectedVideo.author}
                  </span>
                  {selectedVideo.verified && (
                    <span style={{ display: 'flex', color: '#25D366' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </span>
                  )}
                  <span style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)' }}>
                    • {selectedVideo.date}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      background: 'rgba(201,168,76,0.2)',
                      border: '1px solid var(--gold)',
                      color: 'var(--gold)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    Like ({selectedVideo.likes})
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoReviewsSystem;
