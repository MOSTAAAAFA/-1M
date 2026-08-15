// Sound Effects Manager for Premium Interactions
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = false; // Disabled by default
    this.volume = 0.3;

    // Sound effects are disabled
    this.enabled = false;
  }

  // Create audio context for better performance
  createSound(name, frequency, type = 'sine', duration = 0.1) {
    return () => {
      if (!this.enabled) return;

      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (e) {
        console.warn('Audio not supported');
      }
    };
  }

  // Predefined sounds
  init() {
    this.sounds = {
      hover: this.createSound('hover', 800, 'sine', 0.05),
      click: this.createSound('click', 1200, 'sine', 0.08),
      success: this.createSound('success', 600, 'sine', 0.15),
      error: this.createSound('error', 400, 'sawtooth', 0.15),
      whoosh: this.createSound('whoosh', 200, 'sine', 0.2),
      pop: this.createSound('pop', 1000, 'sine', 0.1),
    };
  }

  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    return this.enabled;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
}

// Create global instance
const soundManager = new SoundManager();
soundManager.init();

// Auto-attach to interactive elements
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Hover sounds
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('button, a, [data-hover], .car-card');
      if (target && !target.dataset.soundAttached) {
        soundManager.play('hover');
      }
    }, true);

    // Click sounds
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, [data-hover]');
      if (target) {
        soundManager.play('click');
      }
    }, true);
  });
}

export default soundManager;
