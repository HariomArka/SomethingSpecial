// Web Audio API Paper Turning Sound Synthesizer
// Zero external assets required, instant loading, tactile experience!

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize a soft, organic paper rustle / page flip whoosh
  playPageFlip(isFast = false) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = isFast ? 0.22 : 0.32;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Create pink/brownish noise with natural micro-bursts for paper grain friction
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low pass filter for soft paper sound
        lastOut = (lastOut + 0.04 * white) / 1.04;
        // Modulate with slight envelope flutter
        const progress = i / bufferSize;
        const flutter = 1 + 0.2 * Math.sin(progress * 50);
        data[i] = lastOut * 3.5 * flutter;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // Bandpass filter to isolate rustle frequency (approx 800Hz - 2400Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isFast ? 1400 : 1000, now);
      filter.frequency.exponentialRampToValueAtTime(isFast ? 500 : 400, now + duration);
      filter.Q.value = 1.2;

      // Amplitude envelope
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + duration);
    } catch {
      // Audio autoplay policy fallback or browser restriction
    }
  }

  // Gentle stamp / tactile tap sound when opening bookmark or modal
  playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundManager();
