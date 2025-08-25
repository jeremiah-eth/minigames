// Sound effects using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    // Initialize audio context on user interaction
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Enable/disable sound
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('scrabble_sound_enabled', enabled.toString());
  }

  isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  // Set volume (0-1)
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('scrabble_sound_volume', this.volume.toString());
  }

  getVolume(): number {
    return this.volume;
  }

  // Load saved preferences
  loadPreferences() {
    if (typeof window !== 'undefined') {
      const enabled = localStorage.getItem('scrabble_sound_enabled');
      const volume = localStorage.getItem('scrabble_sound_volume');
      
      if (enabled !== null) {
        this.isEnabled = enabled === 'true';
      }
      if (volume !== null) {
        this.volume = parseFloat(volume);
      }
    }
  }

  // Generate a simple tone
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) return null as any;

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      output[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    }

    return buffer;
  }

  // Play a sound
  private playSound(buffer: AudioBuffer, volume: number = 1) {
    if (!this.audioContext || !this.isEnabled) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.value = volume * this.volume;
    source.start();
  }

  // Tile placement sound
  playTilePlace() {
    const buffer = this.generateTone(800, 0.1, 'sine');
    this.playSound(buffer, 0.6);
  }

  // Tile removal sound
  playTileRemove() {
    const buffer = this.generateTone(400, 0.1, 'sine');
    this.playSound(buffer, 0.4);
  }

  // Valid word sound
  playValidWord() {
    const buffer = this.generateTone(1200, 0.2, 'sine');
    this.playSound(buffer, 0.8);
  }

  // Invalid word sound
  playInvalidWord() {
    const buffer = this.generateTone(200, 0.3, 'sawtooth');
    this.playSound(buffer, 0.5);
  }

  // Game win sound
  playGameWin() {
    // Play a victory chord
    setTimeout(() => this.playSound(this.generateTone(523, 0.2), 0.7), 0); // C
    setTimeout(() => this.playSound(this.generateTone(659, 0.2), 0.7), 100); // E
    setTimeout(() => this.playSound(this.generateTone(784, 0.2), 0.7), 200); // G
  }

  // Game lose sound
  playGameLose() {
    const buffer = this.generateTone(150, 0.5, 'sawtooth');
    this.playSound(buffer, 0.6);
  }

  // Button click sound
  playButtonClick() {
    const buffer = this.generateTone(600, 0.05, 'sine');
    this.playSound(buffer, 0.3);
  }

  // AI thinking sound
  playAIThinking() {
    const buffer = this.generateTone(300, 0.1, 'triangle');
    this.playSound(buffer, 0.2);
  }

  // Score update sound
  playScoreUpdate() {
    const buffer = this.generateTone(1000, 0.15, 'sine');
    this.playSound(buffer, 0.5);
  }

  // Tile selection sound
  playTileSelect() {
    const buffer = this.generateTone(700, 0.08, 'sine');
    this.playSound(buffer, 0.4);
  }

  // Initialize audio context on first user interaction
  initialize() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Load preferences on initialization
if (typeof window !== 'undefined') {
  soundManager.loadPreferences();
}
