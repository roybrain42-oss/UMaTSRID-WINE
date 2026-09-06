/**
 * Synthetic Push Notification Chime Generator
 * Uses Web Audio API to produce a crisp, authentic dual-tone mobile push notification sound.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play mobile push notification chime (pleasant ascending marimba/bell tone)
   */
  public playPushChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: High crisp chime (e.g., E6 - 1318.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.08); // E6

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: Harmonic sparkle chime (e.g., G6 - 1567.98 Hz) with slight delay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1567.98, now + 0.09); // G6
      osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.18); // C7

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.01, now + 0.09);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.11);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.09);
      osc2.stop(now + 0.55);

      // Trigger light haptic vibration if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 50, 40]);
        } catch {
          // Ignore vibration failure
        }
      }
    } catch (err) {
      console.warn('AudioContext playback error (muted or user interaction required):', err);
    }
  }

  /**
   * Play celebration trumpet/fanfare tone for competition milestone
   */
  public playMilestoneFanfare(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + index * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 40, 80, 40, 100]);
        } catch {
          // Ignore
        }
      }
    } catch (err) {
      console.warn('Fanfare sound error:', err);
    }
  }

  /**
   * Play offline queued chime (pleasant soft confirmation chime)
   */
  public playOfflineQueuedChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.12); // D5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (err) {
      console.warn('Queued sound error:', err);
    }
  }

  /**
   * Play reward chime (crisp double sparkle tone)
   */
  public playRewardChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [659.25, 880.0, 1318.5]; // E5, A5, E6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + index * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (err) {
      console.warn('Reward chime error:', err);
    }
  }

  /**
   * Universal play helper method
   */
  public play(type: 'push' | 'scan' | 'pop' | 'success' | 'cashout' | 'celebrate' | 'milestone' | string): void {
    switch (type) {
      case 'push':
        this.playPushChime();
        break;
      case 'celebrate':
      case 'milestone':
      case 'levelUp':
        this.playMilestoneFanfare();
        break;
      case 'cashout':
      case 'reward':
        this.playRewardChime();
        break;
      case 'sync':
      case 'success':
        this.playSyncCompleteChime();
        break;
      case 'offline':
      case 'scan':
      case 'pop':
      default:
        this.playOfflineQueuedChime();
        break;
    }
  }

  /**
   * Play level up fanfare
   */
  public playLevelUp(): void {
    this.playMilestoneFanfare();
  }

  /**
   * Play sync complete chime (smooth upward chime)
   */
  public playSyncCompleteChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + index * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (err) {
      console.warn('Sync complete sound error:', err);
    }
  }

  /**
   * Play instant points chime
   */
  public playPointChime(): void {
    this.playRewardChime();
  }

  /**
   * Play celebration fanfare
   */
  public playCelebration(): void {
    this.playMilestoneFanfare();
  }

  /**
   * Play success jingle
   */
  public playSuccessJingle(): void {
    this.playSyncCompleteChime();
  }

  /**
   * Play error / warning tone
   */
  public playErrorTone(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }
}

export const soundEffects = new SoundEffects();
