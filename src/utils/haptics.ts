/**
 * Mobile Haptic Vibration Feedback Engine
 * Utilizes the Web Vibration API (navigator.vibrate) with rhythmic patterns
 * tuned for authentic native mobile feel (iOS/Android Taptic feedback simulation).
 */

class HapticsEngine {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Subtle tick feedback for button taps, filter switches, and toggles
   */
  public light(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(15);
    } catch {
      // Ignore vibration errors
    }
  }

  /**
   * Medium impact feedback for camera shutter, photo capture, location pin
   */
  public medium(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(35);
    } catch {
      // Ignore
    }
  }

  /**
   * Impact alias for quick tactile triggers
   */
  public impact(): void {
    this.medium();
  }

  /**
   * Solid double-pulse feedback for waste photo analysis and submission
   */
  public submitWaste(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      // Distinct double tap: 35ms pulse -> 40ms pause -> 60ms confirming vibration
      navigator.vibrate([35, 40, 60]);
    } catch {
      // Ignore
    }
  }

  /**
   * Cash payout / MoMo payout celebratory rhythm for cashing out EcoPoints
   */
  public cashOut(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      // Rhythmic payout pulse: [40ms pulse, 30ms rest, 50ms pulse, 30ms rest, 90ms final confirmation]
      navigator.vibrate([40, 30, 50, 30, 90]);
    } catch {
      // Ignore
    }
  }

  /**
   * Collection request & job confirmation vibration pattern for agents and users
   */
  public collectionConfirmed(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      // Collection verified pattern: [50ms pulse, 40ms pause, 75ms pulse, 30ms pause, 110ms heavy pulse]
      navigator.vibrate([50, 40, 75, 30, 110]);
    } catch {
      // Ignore
    }
  }

  /**
   * Success reward redemption vibration
   */
  public success(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([30, 30, 50]);
    } catch {
      // Ignore
    }
  }

  /**
   * Error or rejection vibration
   */
  public error(): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([70, 50, 70]);
    } catch {
      // Ignore
    }
  }
}

export const haptics = new HapticsEngine();
