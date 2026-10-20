/**
 * SnoozeScape Procedural Web Audio Sound Engine
 * Synthesizes 6 distinct ambient sleep layers completely mathematically in real time.
 * Zero external audio files (no MP3/WAV downloads), zero network calls.
 * 100% offline, privacy-first, zero battery waste from buffering.
 */

class SnoozeAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isPlaying = false;
    
    // Sound Layers State
    this.layers = {
      binaural: { active: true, volume: 0.45, nodes: {} },
      rain: { active: true, volume: 0.60, nodes: {} },
      fire: { active: true, volume: 0.35, nodes: {} },
      brown: { active: true, volume: 0.50, nodes: {} },
      wind: { active: true, volume: 0.40, nodes: {} },
      ocean: { active: false, volume: 0.00, nodes: {} }
    };

    // Shared Noise Buffer Cache (5 seconds of looping white noise)
    this.noiseBuffer = null;

    // Fade Timer state
    this.fadeDurationMs = 30 * 60 * 1000; // 30 minutes default
    this.fadeStartTime = null;
    this.fadeTimerInterval = null;
  }

  /**
   * Initializes the AudioContext upon user gesture.
   */
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      // Spectrum Analyser Node for Visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Create white noise buffer
      this.buildWhiteNoiseBuffer();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Generates a 5-second seamless looping white noise buffer.
   */
  buildWhiteNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 5;
    this.noiseBuffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const nowBuffering = this.noiseBuffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        nowBuffering[i] = Math.random() * 2 - 1;
      }
    }
  }

  /* =========================================================================
     1. Binaural Delta/Theta Sleep Beats
     ========================================================================= */
  startBinauralLayer() {
    const l = this.layers.binaural;
    const baseFreq = 196.0; // G3 soothing fundamental carrier
    const beatFreq = 4.5;   // 4.5 Hz Delta/Theta wave sleep induction

    // Gain node for layer
    l.gainNode = this.ctx.createGain();
    l.gainNode.gain.setValueAtTime(l.active ? l.volume * 0.4 : 0, this.ctx.currentTime);
    l.gainNode.connect(this.masterGain);

    // Left Ear Oscillator
    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const panLeft = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panLeft) {
      panLeft.pan.setValueAtTime(-1.0, this.ctx.currentTime);
      oscLeft.connect(panLeft);
      panLeft.connect(l.gainNode);
    } else {
      oscLeft.connect(l.gainNode);
    }

    // Right Ear Oscillator
    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

    const panRight = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panRight) {
      panRight.pan.setValueAtTime(1.0, this.ctx.currentTime);
      oscRight.connect(panRight);
      panRight.connect(l.gainNode);
    } else {
      oscRight.connect(l.gainNode);
    }

    // Soft sub-harmonic drone for organic warmth (98 Hz)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(baseFreq / 2, this.ctx.currentTime);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(l.gainNode);

    oscLeft.start();
    oscRight.start();
    subOsc.start();

    l.nodes = { oscLeft, oscRight, subOsc, gainNode: l.gainNode };
  }

  /* =========================================================================
     2. Nocturnal Gentle Rain
     ========================================================================= */
  startRainLayer() {
    const l = this.layers.rain;
    l.gainNode = this.ctx.createGain();
    l.gainNode.gain.setValueAtTime(l.active ? l.volume * 0.35 : 0, this.ctx.currentTime);
    l.gainNode.connect(this.masterGain);

    // Noise Source
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    noiseSource.loop = true;

    // Bandpass and Lowpass filters to shape noise into soft rain drops
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(280, this.ctx.currentTime);

    noiseSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(l.gainNode);

    noiseSource.start();
    l.nodes = { noiseSource, gainNode: l.gainNode };
  }

  /* =========================================================================
     3. Cozy Fireplace Crackle & Hearth
     ========================================================================= */
  startFireLayer() {
    const l = this.layers.fire;
    l.gainNode = this.ctx.createGain();
    l.gainNode.gain.setValueAtTime(l.active ? l.volume * 0.28 : 0, this.ctx.currentTime);
    l.gainNode.connect(this.masterGain);

    // Base flame rumble (low brown noise)
    const rumbleSource = this.ctx.createBufferSource();
    rumbleSource.buffer = this.noiseBuffer;
    rumbleSource.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(140, this.ctx.currentTime);

    rumbleSource.connect(lowpass);
    lowpass.connect(l.gainNode);
    rumbleSource.start();

    // Procedural stochastic crackle generator using intermittent noise clicks
    const crackleSource = this.ctx.createBufferSource();
    crackleSource.buffer = this.noiseBuffer;
    crackleSource.loop = true;

    const crackleBand = this.ctx.createBiquadFilter();
    crackleBand.type = 'bandpass';
    crackleBand.frequency.setValueAtTime(2400, this.ctx.currentTime);
    crackleBand.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    crackleSource.connect(crackleBand);
    crackleBand.connect(crackleGain);
    crackleGain.connect(l.gainNode);
    crackleSource.start();

    l.nodes = { rumbleSource, crackleSource, gainNode: l.gainNode };
  }

  /* =========================================================================
     4. Deep Brown Noise (Sub-bass Sleep Masking)
     ========================================================================= */
  startBrownNoiseLayer() {
    const l = this.layers.brown;
    l.gainNode = this.ctx.createGain();
    l.gainNode.gain.setValueAtTime(l.active ? l.volume * 0.45 : 0, this.ctx.currentTime);
    l.gainNode.connect(this.masterGain);

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    // 6dB/octave slope down
    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(260, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(180, this.ctx.currentTime);

    source.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(l.gainNode);
    source.start();

    l.nodes = { source, gainNode: l.gainNode };
  }

  /* =========================================================================
     5. Canopy Breeze / Modulated Forest Wind
     ========================================================================= */
  startWindLayer() {
    const l = this.layers.wind;
    l.gainNode = this.ctx.createGain();
    l.gainNode.gain.setValueAtTime(l.active ? l.volume * 0.35 : 0, this.ctx.currentTime);
    l.gainNode.connect(this.masterGain);

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    // Resonant bandpass filter modulated by a slow LFO (wind gusts)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // LFO (0.12 Hz for slow, gentle tree breezes)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(240, this.ctx.currentTime); // mod range ±240Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(l.gainNode);

    source.start();
    lfo.start();

    l.nodes = { source, lfo, gainNode: l.gainNode };
  }

  /* =========================================================================
     6. Ocean Swell (Tidal Infrasound Waves)
     ========================================================================= */
  startOceanLayer() {
    const l = this.layers.ocean;
    l.gainNode = this.ctx.createGain();
    l.gainNode.gain.setValueAtTime(l.active ? l.volume * 0.40 : 0, this.ctx.currentTime);
    l.gainNode.connect(this.masterGain);

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    // Wave swell LFO (0.08 Hz = ~12.5s per wave cycle)
    const swellLfo = this.ctx.createOscillator();
    swellLfo.type = 'sine';
    swellLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);

    const swellGain = this.ctx.createGain();
    swellGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    const waveVolume = this.ctx.createGain();
    waveVolume.gain.setValueAtTime(0.4, this.ctx.currentTime);

    swellLfo.connect(swellGain);
    swellGain.connect(waveVolume.gain);

    source.connect(filter);
    filter.connect(waveVolume);
    waveVolume.connect(l.gainNode);

    source.start();
    swellLfo.start();

    l.nodes = { source, swellLfo, gainNode: l.gainNode };
  }

  /* =========================================================================
     Master Controls & Lifecycle
     ========================================================================= */
  startAll() {
    this.initContext();
    if (this.isPlaying) return;

    this.startBinauralLayer();
    this.startRainLayer();
    this.startFireLayer();
    this.startBrownNoiseLayer();
    this.startWindLayer();
    this.startOceanLayer();

    this.isPlaying = true;
    this.startFadeTimer();
  }

  stopAll() {
    if (!this.isPlaying || !this.ctx) return;

    Object.values(this.layers).forEach(layer => {
      if (layer.nodes) {
        Object.values(layer.nodes).forEach(node => {
          try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
          } catch (e) {
            // Already disconnected
          }
        });
        layer.nodes = {};
      }
    });

    this.isPlaying = false;
    clearInterval(this.fadeTimerInterval);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stopAll();
      return false;
    } else {
      this.startAll();
      return true;
    }
  }

  setMasterVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
    }
  }

  setLayerVolume(layerKey, volume) {
    const layer = this.layers[layerKey];
    if (layer) {
      layer.volume = volume;
      if (layer.nodes && layer.nodes.gainNode && this.ctx) {
        const targetGain = layer.active ? volume * 0.4 : 0;
        layer.nodes.gainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
      }
    }
  }

  toggleLayer(layerKey) {
    const layer = this.layers[layerKey];
    if (layer) {
      layer.active = !layer.active;
      this.setLayerVolume(layerKey, layer.volume);
      return layer.active;
    }
    return false;
  }

  applyPreset(presetKey) {
    const presets = {
      'sloth-sanctuary': {
        binaural: { active: true, vol: 0.45 },
        rain: { active: true, vol: 0.60 },
        fire: { active: true, vol: 0.35 },
        brown: { active: true, vol: 0.50 },
        wind: { active: true, vol: 0.40 },
        ocean: { active: false, vol: 0.00 }
      },
      'rainy-cabin': {
        binaural: { active: true, vol: 0.20 },
        rain: { active: true, vol: 0.80 },
        fire: { active: true, vol: 0.70 },
        brown: { active: true, vol: 0.30 },
        wind: { active: true, vol: 0.25 },
        ocean: { active: false, vol: 0.00 }
      },
      'midnight-ocean': {
        binaural: { active: true, vol: 0.40 },
        rain: { active: true, vol: 0.20 },
        fire: { active: false, vol: 0.00 },
        brown: { active: true, vol: 0.40 },
        wind: { active: true, vol: 0.50 },
        ocean: { active: true, vol: 0.80 }
      },
      'deep-binaural': {
        binaural: { active: true, vol: 0.85 },
        rain: { active: true, vol: 0.30 },
        fire: { active: false, vol: 0.00 },
        brown: { active: true, vol: 0.60 },
        wind: { active: true, vol: 0.30 },
        ocean: { active: false, vol: 0.00 }
      }
    };

    const config = presets[presetKey];
    if (!config) return;

    Object.keys(config).forEach(k => {
      this.layers[k].active = config[k].active;
      this.setLayerVolume(k, config[k].vol);
    });
  }

  /* =========================================================================
     Sloth Sleep Drift Timer & Auto-Fade
     ========================================================================= */
  setFadeDuration(minutes) {
    this.fadeDurationMs = minutes * 60 * 1000;
    if (this.isPlaying) {
      this.startFadeTimer();
    }
  }

  startFadeTimer() {
    clearInterval(this.fadeTimerInterval);
    if (this.fadeDurationMs <= 0) return; // Infinite

    this.fadeStartTime = Date.now();
    this.fadeTimerInterval = setInterval(() => {
      const elapsed = Date.now() - this.fadeStartTime;
      const remainingRatio = Math.max(0, 1 - (elapsed / this.fadeDurationMs));

      // Trigger UI callback if registered
      if (this.onTimerTick) {
        this.onTimerTick(remainingRatio, Math.max(0, this.fadeDurationMs - elapsed));
      }

      // In the final 10% of duration, gently taper master gain
      if (remainingRatio < 0.15 && this.masterGain && this.ctx) {
        const softGain = remainingRatio / 0.15;
        this.masterGain.gain.setTargetAtTime(softGain * 0.75, this.ctx.currentTime, 0.5);
      }

      if (remainingRatio <= 0) {
        clearInterval(this.fadeTimerInterval);
        this.stopAll();
        if (this.onTimerComplete) this.onTimerComplete();
      }
    }, 1000);
  }
}

// Global Audio Engine Instance
window.snoozeAudio = new SnoozeAudioEngine();
