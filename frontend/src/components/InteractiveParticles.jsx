import React, { useMemo, useCallback } from 'react';
import { ParticlesProvider, Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { shouldEnableParticles } from '../utils/performanceOptimization';

export default function InteractiveParticles() {
  // Check if particles should be enabled
  const enabled = shouldEnableParticles();

  // Stable init callback - loads the slim engine once across the app lifecycle
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    background: { enable: false },

    particles: {
      number: {
        value: 40,
        density: { enable: true, width: 1920, height: 1080 },
      },
      color: { value: ['#C9A84C', '#E0C06A', '#F4D03F'] },
      shape: {
        type: 'image',
        options: {
          image: [
            { src: '/logos/1m-mark.svg', width: 128, height: 128 },
          ],
        },
      },
      opacity: {
        value: { min: 0.25, max: 0.65 },
        animation: { enable: true, speed: 0.6, sync: false },
      },
      size: {
        value: { min: 14, max: 28 },
        animation: { enable: true, speed: 2, sync: false },
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: 'random',
        animation: { enable: true, speed: 3, sync: false },
      },
      links: {
        enable: true,
        distance: 130,
        color: '#C9A84C',
        opacity: 0.1,
        width: 0.8,
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
    },

    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'grab' },
        onClick: { enable: true, mode: 'push' },
        resize: true,
      },
      modes: {
        grab: {
          distance: 130,
          links: { opacity: 0.4, color: '#C9A84C' },
        },
        push: { quantity: 4 },
      },
    },
  }), []);

  // Don't render particles if disabled
  if (!enabled) {
    return null;
  }

  return (
    <ParticlesProvider init={init}>
      <Particles
        id="interactive-particles"
        options={options}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.9,
        }}
      />
    </ParticlesProvider>
  );
}
