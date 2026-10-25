import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../context/ReducedMotionContext';

/**
 * VideoBackground - Premium cinematic video with minimal overlay
 * Shows TWO videos sequentially: Porsche GT3RS (0:00-1:43) then Rolls-Royce (3s-59s)
 */
export default function VideoBackground() {
  const videoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0); // 0 = Porsche, 1 = Rolls-Royce

  const videos = [
    {
      src: '/videos/Porsche GT3RS 991.2 Mountain Road Cinematic 4K_2160p.mp4',
      startTime: 0,
      endTime: 103, // 1:43
      name: 'Porsche GT3RS'
    },
    {
      src: '/videos/Rolls-Royce Introduces Spectre_ The World\'s First Ultra-Luxury Electric Super Coupé_1440p.mp4',
      startTime: 3,
      endTime: 59,
      name: 'Rolls-Royce Spectre'
    }
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    const currentVideoData = videos[currentVideo];

    // Set start time for current video
    video.currentTime = currentVideoData.startTime;

    const handleTimeUpdate = () => {
      if (video.currentTime >= currentVideoData.endTime) {
        // Switch to next video
        setCurrentVideo(prev => (prev + 1) % videos.length);
      }
    };

    const handleLoadedMetadata = () => {
      video.currentTime = currentVideoData.startTime;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video autoplay blocked:', err);
          setIsPaused(true);
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // If video already loaded, set time and play
    if (video.readyState >= 2) {
      video.currentTime = currentVideoData.startTime;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video autoplay blocked:', err);
          setIsPaused(true);
        });
      }
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentVideo, prefersReducedMotion]);

  const handlePlayPause = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const handleMuteUnmute = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Show poster for reduced motion users
  if (prefersReducedMotion) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundImage: 'url(/videos/poster.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Single Video Element - switches between sources */}
      <video
        ref={videoRef}
        key={currentVideo} // Force re-mount when switching videos
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/videos/poster.jpg"
        onPlay={() => {
          console.log(`Video ${videos[currentVideo].name} started playing`);
          setIsPaused(false);
        }}
        onPause={() => {
          console.log(`Video ${videos[currentVideo].name} paused`);
          setIsPaused(true);
        }}
        onVolumeChange={(e) => {
          setIsMuted(e.target.muted);
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          filter: 'brightness(1.02) contrast(1.05)',
        }}
      >
        <source
          src={videos[currentVideo].src}
          type="video/mp4"
        />
      </video>

      {/* Minimal top gradient - only for nav readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, rgba(5,5,7,0.65) 0%, rgba(5,5,7,0.4) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Minimal bottom gradient - only for bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to top, rgba(5,5,7,0.7) 0%, rgba(5,5,7,0.35) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
