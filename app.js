/**
 * SnoozeScape 🦥 — Master Application Controller
 * Handles Celestial Canvas, Guided Breathing Pacer, Audio Engine Wiring,
 * Bedtime Story Narration Sync, Sloth Auto-Fade Timer, and UI Interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Grab Essential DOM Elements
  const celestialCanvas = document.getElementById("celestial-canvas");
  const sleepOverlay = document.getElementById("sleep-dim-overlay");

  // Breathing Elements
  const breathingIndicator = document.getElementById("breathing-indicator");
  const breathingGuideText = document.getElementById("breathing-guide-text");
  const btnToggleBreathing = document.getElementById("btn-toggle-breathing");
  const breathingBtnIcon = document.getElementById("breathing-btn-icon");
  const breathingBtnLabel = document.getElementById("breathing-btn-label");

  // Audio Engine Elements
  const btnMasterPlay = document.getElementById("btn-master-play");
  const masterPlayIcon = document.getElementById("master-play-icon");
  const masterPlayText = document.getElementById("master-play-text");
  const masterVolumeSlider = document.getElementById("master-volume-slider");
  const masterVolDisplay = document.getElementById("master-vol-display");
  const visualizerCanvas = document.getElementById("audio-visualizer-canvas");
  const presetChips = document.querySelectorAll(".preset-chip");
  const layerCards = document.querySelectorAll(".sound-layer-card");
  const modeProcedural = document.getElementById("btn-mode-procedural");
  const modeStudio = document.getElementById("btn-mode-studio");
  const soundscapeHeading = document.getElementById("soundscape-heading");
  const soundscapeSubtitle = document.getElementById("soundscape-subtitle");

  // Story Elements
  const storyThemeSelect = document.getElementById("story-theme-select");
  const customPromptWrap = document.getElementById("custom-prompt-wrap");
  const customPromptInput = document.getElementById("custom-prompt-input");
  const btnApplyCustom = document.getElementById("btn-apply-custom");
  const btnGenerateStory = document.getElementById("btn-generate-story");
  const btnNarrateStory = document.getElementById("btn-narrate-story");
  const narrateIcon = document.getElementById("narrate-icon");
  const narrateLabel = document.getElementById("narrate-label");
  const btnCopyStory = document.getElementById("btn-copy-story");
  const voiceRateSlider = document.getElementById("voice-rate-slider");
  const rateValue = document.getElementById("rate-value");
  const storyDisplayContainer = document.getElementById("story-display-container");
  const storyChapterTag = document.getElementById("story-chapter-tag");
  const storyText = document.getElementById("story-text");
  const storyLoadingIndicator = document.getElementById("story-loading-indicator");

  // Timer Elements
  const btnQuickSleep = document.getElementById("btn-quick-sleep");
  const timerButtons = document.querySelectorAll(".btn-timer");
  const timerDisplay = document.getElementById("timer-display");
  const timerProgressFill = document.getElementById("timer-progress-fill");
  const fadeStatusText = document.getElementById("fade-status-text");

  // Diagnostics Elements
  const btnToggleDiagnostics = document.getElementById("btn-toggle-diagnostics");
  const btnExpandDiagnostics = document.getElementById("btn-expand-diagnostics");
  const diagnosticsBody = document.getElementById("diagnostics-body");
  const expandIcon = document.getElementById("expand-icon");
  const btnResetApp = document.getElementById("btn-reset-app");

  let currentStoryParagraphs = [];
  let breathingActive = true;
  let breathingInterval = null;

  /* =========================================================================
     1. Celestial Starfield Background Canvas
     ========================================================================= */
  let triggerStardustBurst = null;

  function initCelestialCanvas() {
    if (!celestialCanvas) return;
    const ctx = celestialCanvas.getContext("2d");
    let width = (celestialCanvas.width = window.innerWidth);
    let height = (celestialCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = celestialCanvas.width = window.innerWidth;
      height = celestialCanvas.height = window.innerHeight;
      createStars();
    });

    const starCount = Math.floor((width * height) / 5000);
    let stars = [];
    const shootingStars = [];
    const stardustParticles = [];
    let pointerX = -1000;
    let pointerY = -1000;
    let pointerActive = false;

    // Track mouse / touch pointer for interactive constellations
    window.addEventListener("pointermove", (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerActive = true;

      // Spawn subtle stardust trail
      if (Math.random() > 0.4) {
        stardustParticles.push({
          x: pointerX + (Math.random() * 12 - 6),
          y: pointerY + (Math.random() * 12 - 6),
          size: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.8 - 0.2,
          opacity: 0.8,
          color: Math.random() > 0.5 ? "#f5b726" : "#38bdf8"
        });
      }
    });

    window.addEventListener("pointerleave", () => {
      pointerActive = false;
    });

    // Click anywhere in celestial sky to summon shooting star
    window.addEventListener("click", (e) => {
      if (e.target.closest("button, input, select, .preset-chip, .tool-btn")) return;
      spawnShootingStar(e.clientX, e.clientY);
    });

    function spawnShootingStar(originX, originY) {
      shootingStars.push({
        x: originX || Math.random() * width * 0.8,
        y: originY || Math.random() * height * 0.3,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() * 0.3 - 0.15),
        opacity: 1
      });
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.6 + 0.4,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          color: Math.random() > 0.8 ? "#f5b726" : (Math.random() > 0.6 ? "#38bdf8" : "#ffffff")
        });
      }
    }

    createStars();

    // Spontaneous gentle shooting star
    setInterval(() => {
      if (Math.random() > 0.3 && !document.hidden) {
        spawnShootingStar();
      }
    }, 7000);

    triggerStardustBurst = function(originX, originY, count = 70) {
      const colors = ["#f5b726", "#a78bfa", "#38bdf8", "#ffffff"];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.2 + 0.8;
        const col = colors[Math.floor(Math.random() * colors.length)];
        stardustParticles.push({
          x: originX + (Math.random() - 0.5) * 40,
          y: originY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: Math.random() * 3.0 + 1.0,
          opacity: 1.0,
          color: col
        });
      }
    };

    function animateStars() {
      if (document.hidden) {
        requestAnimationFrame(animateStars);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render Interactive Constellation Lines Near Cursor
      if (pointerActive) {
        const nearbyStars = [];
        const maxDistSq = 110 * 110;
        for (let i = 0; i < stars.length; i++) {
          const dx = stars[i].x - pointerX;
          const dy = stars[i].y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            nearbyStars.push(stars[i]);
            const alpha = (1 - dist / 110) * 0.35;
            ctx.strokeStyle = `rgba(245, 183, 38, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(pointerX, pointerY);
            ctx.stroke();
          }
        }

        const maxPairDistSq = 90 * 90;
        for (let i = 0; i < nearbyStars.length; i++) {
          for (let j = i + 1; j < nearbyStars.length; j++) {
            const dx = nearbyStars[i].x - nearbyStars[j].x;
            const dy = nearbyStars[i].y - nearbyStars[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxPairDistSq) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / 90) * 0.25;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(nearbyStars[i].x, nearbyStars[i].y);
              ctx.lineTo(nearbyStars[j].x, nearbyStars[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Render Stars (Single Date.now call)
      const now = Date.now();
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.opacity += Math.sin(now * star.twinkleSpeed) * 0.008;
        star.opacity = Math.max(0.15, Math.min(0.95, star.opacity));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Stardust particles
      for (let i = stardustParticles.length - 1; i >= 0; i--) {
        const p = stardustParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.015;

        if (p.opacity <= 0) {
          stardustParticles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.strokeStyle = "rgba(255, 255, 255, " + s.opacity + ")";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;

        if (s.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animateStars);
    }

    animateStars();
  }

  initCelestialCanvas();

  /* =========================================================================
     2. Guided Sloth Breathing Pacer (Selectable Patterns & Acoustic Chimes)
     ========================================================================= */
  const BREATHING_MODES = {
    "4-7-8": {
      name: "4-7-8 Sleep",
      phases: [
        { phase: "inhale", text: "Inhale slowly and deeply as the halo expands... (4s)", duration: 4000 },
        { phase: "hold", text: "Hold gently in serene stillness... (7s)", duration: 7000 },
        { phase: "exhale", text: "Exhale completely, releasing all physical tension... (8s)", duration: 8000 }
      ]
    },
    "4-4-4": {
      name: "Box Calm",
      phases: [
        { phase: "inhale", text: "Inhale gently (4s)...", duration: 4000 },
        { phase: "hold", text: "Hold calmness (4s)...", duration: 4000 },
        { phase: "exhale", text: "Smooth exhale (4s)...", duration: 4000 },
        { phase: "hold", text: "Peaceful pause (4s)...", duration: 4000 }
      ]
    },
    "4-6": {
      name: "Ocean Flow",
      phases: [
        { phase: "inhale", text: "Inhale rising tide (4s)...", duration: 4000 },
        { phase: "exhale", text: "Slow ocean exhale (6s)...", duration: 6000 }
      ]
    }
  };

  let currentModeKey = "4-7-8";
  let breathingPhaseIdx = 0;

  function startBreathingGuide() {
    clearTimeout(breathingInterval);
    const modeConfig = BREATHING_MODES[currentModeKey] || BREATHING_MODES["4-7-8"];
    breathingPhaseIdx = 0;

    function runCycle() {
      if (!breathingActive) return;
      const current = modeConfig.phases[breathingPhaseIdx];
      if (breathingGuideText) {
        breathingGuideText.textContent = current.text;
      }

      // Play soft acoustic Solfeggio chime if enabled
      if (window.snoozeAudio && window.snoozeAudio.chimeEnabled) {
        window.snoozeAudio.playBreathingChime(current.phase);
      }

      breathingPhaseIdx = (breathingPhaseIdx + 1) % modeConfig.phases.length;
      breathingInterval = setTimeout(runCycle, current.duration);
    }

    runCycle();
  }

  startBreathingGuide();

  // Mode Selection Chips
  const modeChips = document.querySelectorAll(".mode-chip");
  modeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      modeChips.forEach(c => {
        c.classList.remove("active");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-checked", "true");
      currentModeKey = chip.dataset.mode;
      startBreathingGuide();
    });
  });

  // Acoustic Breathing Chime Toggle
  const btnToggleChime = document.getElementById("btn-toggle-chime");
  const chimeBtnIcon = document.getElementById("chime-btn-icon");
  const chimeBtnLabel = document.getElementById("chime-btn-label");
  if (btnToggleChime) {
    btnToggleChime.addEventListener("click", () => {
      window.snoozeAudio.chimeEnabled = !window.snoozeAudio.chimeEnabled;
      if (window.snoozeAudio.chimeEnabled) {
        chimeBtnIcon.innerHTML = '<svg class="iconly-icon iconly-icon-xs" aria-hidden="true"><use href="#iconly-notification"></use></svg>';
        chimeBtnLabel.textContent = "Chime On";
        btnToggleChime.classList.add("active");
        window.snoozeAudio.playBreathingChime("inhale");
      } else {
        chimeBtnIcon.innerHTML = '<svg class="iconly-icon iconly-icon-xs" aria-hidden="true"><use href="#iconly-volume-off"></use></svg>';
        chimeBtnLabel.textContent = "Chime Off";
        btnToggleChime.classList.remove("active");
      }
    });
  }

  // Tap-to-pause / Tap-to-sync on the breathing circle itself
  if (breathingIndicator) {
    breathingIndicator.addEventListener("click", () => {
      if (btnToggleBreathing) btnToggleBreathing.click();
    });
  }

  if (btnToggleBreathing) {
    btnToggleBreathing.addEventListener("click", () => {
      breathingActive = !breathingActive;
      if (breathingActive) {
        breathingBtnIcon.innerHTML = '<svg class="iconly-icon iconly-icon-xs" aria-hidden="true"><use href="#iconly-pause"></use></svg>';
        breathingBtnLabel.textContent = "Pause Guide";
        if (breathingIndicator) breathingIndicator.style.animationPlayState = "running";
        startBreathingGuide();
      } else {
        breathingBtnIcon.innerHTML = '<svg class="iconly-icon iconly-icon-xs" aria-hidden="true"><use href="#iconly-play"></use></svg>';
        breathingBtnLabel.textContent = "Resume Guide";
        if (breathingIndicator) breathingIndicator.style.animationPlayState = "paused";
        clearTimeout(breathingInterval);
        breathingGuideText.textContent = "Breathing guide paused. Breathe at your own comfortable, natural pace.";
      }
    });
  }

  /* =========================================================================
     3. Audio Spectrum Visualizer (Multi-Mode: Bars / Wave / Ripples)
     ========================================================================= */
  let visualizerMode = 0; // 0: Bars, 1: Wave, 2: Ripples
  const VIS_MODES = [
    { icon: "📊", name: "Bars" },
    { icon: "〰️", name: "Wave" },
    { icon: "🫧", name: "Ripples" }
  ];

  const btnVisMode = document.getElementById("btn-vis-mode");
  const visModeIcon = document.getElementById("vis-mode-icon");
  const visModeName = document.getElementById("vis-mode-name");
  const visContainer = document.getElementById("visualizer-container");

  function cycleVisualizerMode() {
    visualizerMode = (visualizerMode + 1) % VIS_MODES.length;
    const mode = VIS_MODES[visualizerMode];
    if (visModeIcon) visModeIcon.textContent = mode.icon;
    if (visModeName) visModeName.textContent = mode.name;
  }

  if (btnVisMode) btnVisMode.addEventListener("click", (e) => { e.stopPropagation(); cycleVisualizerMode(); });
  if (visContainer) visContainer.addEventListener("click", cycleVisualizerMode);

  function initAudioVisualizer() {
    if (!visualizerCanvas) return;
    const ctx = visualizerCanvas.getContext("2d");
    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;

    let rippleRadius = 0;
    let freqDataArray = null;
    let timeDataArray = null;

    // Pre-create gradients once instead of 1,920 times per second
    const barGradient = ctx.createLinearGradient(0, height, 0, 0);
    barGradient.addColorStop(0, "#f5b726");
    barGradient.addColorStop(1, "#38bdf8");

    const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
    waveGradient.addColorStop(0, "#f5b726");
    waveGradient.addColorStop(0.5, "#38bdf8");
    waveGradient.addColorStop(1, "#f5b726");

    function drawSpectrum() {
      requestAnimationFrame(drawSpectrum);
      if (document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      if (!window.snoozeAudio || !window.snoozeAudio.analyser || !window.snoozeAudio.isPlaying) {
        // Idle gentle wave
        ctx.fillStyle = "rgba(245, 183, 38, 0.25)";
        ctx.fillRect(0, height / 2 - 1, width, 2);
        return;
      }

      if (visualizerMode === 0) {
        // Mode 0: Spectrum Frequency Bars
        const bufferLength = window.snoozeAudio.analyser.frequencyBinCount;
        if (!freqDataArray || freqDataArray.length !== bufferLength) {
          freqDataArray = new Uint8Array(bufferLength);
        }
        window.snoozeAudio.analyser.getByteFrequencyData(freqDataArray);

        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;
        ctx.fillStyle = barGradient;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (freqDataArray[i] / 255) * height;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      } else if (visualizerMode === 1) {
        // Mode 1: Liquid Sine Oscilloscope Wave
        const bufferLength = window.snoozeAudio.analyser.fftSize;
        if (!timeDataArray || timeDataArray.length !== bufferLength) {
          timeDataArray = new Uint8Array(bufferLength);
        }
        window.snoozeAudio.analyser.getByteTimeDomainData(timeDataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = waveGradient;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeDataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      } else if (visualizerMode === 2) {
        // Mode 2: Concentric Nebula Pulse Rings
        const bufferLength = window.snoozeAudio.analyser.frequencyBinCount;
        if (!freqDataArray || freqDataArray.length !== bufferLength) {
          freqDataArray = new Uint8Array(bufferLength);
        }
        window.snoozeAudio.analyser.getByteFrequencyData(freqDataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += freqDataArray[i];
        const avg = sum / bufferLength;
        const pulseFactor = avg / 255;

        rippleRadius = (rippleRadius + 0.6) % (width / 2.5);

        ctx.strokeStyle = `rgba(245, 183, 38, ${Math.max(0.1, 0.7 - rippleRadius / (width / 2.5))})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, rippleRadius + pulseFactor * 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.1, pulseFactor * 0.8)})`;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.max(3, pulseFactor * 12), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawSpectrum();
  }

  initAudioVisualizer();

  /* =========================================================================
     4. Audio Engine Master & Layer Wiring
     ========================================================================= */
  function updateMasterPlayButton(isPlaying) {
    const mobileSoundIcon = document.getElementById("mobile-sound-icon");
    const mobileSoundLabel = document.getElementById("mobile-sound-label");
    const btnMobileSound = document.getElementById("btn-mobile-sound");
    if (isPlaying) {
      btnMasterPlay.classList.add("playing");
      masterPlayIcon.innerHTML = '<svg class="iconly-icon iconly-icon-md" id="master-play-iconly" aria-hidden="true"><use href="#iconly-pause"></use></svg>';
      masterPlayText.textContent = "Pause Soundscape";
      if (mobileSoundIcon) mobileSoundIcon.innerHTML = '<svg class="iconly-icon" id="mobile-sound-iconly" aria-hidden="true"><use href="#iconly-pause"></use></svg>';
      if (mobileSoundLabel) mobileSoundLabel.textContent = "Pause";
      if (btnMobileSound) btnMobileSound.classList.add("is-playing");
    } else {
      btnMasterPlay.classList.remove("playing");
      masterPlayIcon.innerHTML = '<svg class="iconly-icon iconly-icon-md" id="master-play-iconly" aria-hidden="true"><use href="#iconly-play"></use></svg>';
      masterPlayText.textContent = "Start Soundscape";
      if (mobileSoundIcon) mobileSoundIcon.innerHTML = '<svg class="iconly-icon" id="mobile-sound-iconly" aria-hidden="true"><use href="#iconly-play"></use></svg>';
      if (mobileSoundLabel) mobileSoundLabel.textContent = "Sound";
      if (btnMobileSound) btnMobileSound.classList.remove("is-playing");
    }
  }

  if (btnMasterPlay) {
    btnMasterPlay.addEventListener("click", () => {
      const isPlaying = window.snoozeAudio.togglePlay();
      updateMasterPlayButton(isPlaying);
    });
  }

  if (masterVolumeSlider) {
    masterVolumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      window.snoozeAudio.setMasterVolume(val);
      masterVolDisplay.textContent = Math.round(val * 100) + "%";
    });
  }

  // Audio Mode Switcher (Procedural Math Synth vs Studio CC0 Recordings)
  const layerDescriptions = {
    procedural: {
      heading: "Procedural Soundscape Synth",
      sub: "Synthesized mathematically via Web Audio — Zero MP3s, Zero Network",
      binaural: { name: "Binaural Delta Beats", sub: "4.5 Hz Deep Sleep Frequency" },
      rain: { name: "Nocturnal Rain", sub: "Filtered Gentle Precipitation" },
      fire: { name: "Cozy Fireplace", sub: "Procedural Wood Sparkle" },
      brown: { name: "Deep Brown Noise", sub: "Sub-Bass Masking Rumble" },
      wind: { name: "Canopy Breeze", sub: "Modulated Forest Wind" },
      ocean: { name: "Ocean Swell", sub: "Slow Tidal Infrasound" }
    },
    studio: {
      heading: "Studio Soundscape Acoustic",
      sub: "High-fidelity CC0 Public Domain field recordings — 100% Offline",
      binaural: { name: "Nocturnal Crickets", sub: "Midnight Meadow Ambience" },
      rain: { name: "Nocturnal Rain", sub: "Studio Acoustic Rain Recording" },
      fire: { name: "Cozy Fireplace", sub: "Real Hearth Campfire Crackle" },
      brown: { name: "Deep Brown Noise", sub: "Acoustic Brownian Sleep Rumble" },
      wind: { name: "Canopy Breeze", sub: "Natural Canopy Wind Recording" },
      ocean: { name: "Ocean Swell", sub: "Pacific Shore Waves Recording" }
    }
  };

  function setAudioMode(mode) {
    if (!window.snoozeAudio) return;
    window.snoozeAudio.setSoundMode(mode);

    if (modeProcedural && modeStudio) {
      modeProcedural.classList.toggle("active", mode === "procedural");
      modeProcedural.setAttribute("aria-checked", mode === "procedural");
      modeStudio.classList.toggle("active", mode === "studio");
      modeStudio.setAttribute("aria-checked", mode === "studio");
    }

    const info = layerDescriptions[mode] || layerDescriptions.procedural;
    if (soundscapeHeading) soundscapeHeading.textContent = info.heading;
    if (soundscapeSubtitle) soundscapeSubtitle.textContent = info.sub;

    Object.keys(info).forEach(k => {
      if (k === "heading" || k === "sub") return;
      const nameEl = document.getElementById(`name-${k}`);
      const subEl = document.getElementById(`sub-${k}`);
      if (nameEl && info[k].name) nameEl.textContent = info[k].name;
      if (subEl && info[k].sub) subEl.textContent = info[k].sub;
    });

    try {
      localStorage.setItem("snoozescape_sound_mode", mode);
    } catch (e) {}
  }

  if (modeProcedural) {
    modeProcedural.addEventListener("click", () => setAudioMode("procedural"));
  }
  if (modeStudio) {
    modeStudio.addEventListener("click", () => setAudioMode("studio"));
  }

  // Restore saved audio mode if present
  try {
    const savedMode = localStorage.getItem("snoozescape_sound_mode");
    if (savedMode === "studio") {
      setAudioMode("studio");
    }
  } catch (e) {}

  // Layer Controls (Sliders & Toggle Buttons)
  layerCards.forEach(card => {
    const layerKey = card.id.replace("layer-", "");
    const toggleBtn = card.querySelector(".layer-toggle-btn");
    const slider = card.querySelector(".layer-slider");
    const valDisplay = card.querySelector(".layer-vol-val");

    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        window.snoozeAudio.setLayerVolume(layerKey, val);
        valDisplay.textContent = Math.round(val * 100) + "%";

        if (val > 0 && toggleBtn && !toggleBtn.classList.contains("active")) {
          toggleBtn.classList.add("active");
          toggleBtn.textContent = "ON";
          window.snoozeAudio.layers[layerKey].active = true;
        }
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isActive = window.snoozeAudio.toggleLayer(layerKey);
        if (isActive) {
          toggleBtn.classList.add("active");
          toggleBtn.textContent = "ON";
        } else {
          toggleBtn.classList.remove("active");
          toggleBtn.textContent = "OFF";
        }
      });
    }
  });

  // Preset Chips
  presetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      presetChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const preset = chip.dataset.preset;
      window.snoozeAudio.applyPreset(preset);

      // Sync UI sliders
      Object.keys(window.snoozeAudio.layers).forEach(k => {
        const card = document.getElementById("layer-" + k);
        if (card) {
          const s = card.querySelector(".layer-slider");
          const btn = card.querySelector(".layer-toggle-btn");
          const v = card.querySelector(".layer-vol-val");
          const layer = window.snoozeAudio.layers[k];

          if (s) s.value = layer.volume;
          if (v) v.textContent = Math.round(layer.volume * 100) + "%";
          if (btn) {
            if (layer.active) {
              btn.classList.add("active");
              btn.textContent = "ON";
            } else {
              btn.classList.remove("active");
              btn.textContent = "OFF";
            }
          }
        }
      });
    });
  });

  // Randomize Cozy Mix
  const btnRandomMix = document.getElementById("btn-random-mix");
  if (btnRandomMix) {
    btnRandomMix.addEventListener("click", () => {
      const newMix = window.snoozeAudio.randomizeMix();
      presetChips.forEach(c => c.classList.remove("active"));

      // Update UI sliders and toggle buttons
      layerCards.forEach(card => {
        const layerKey = card.id.replace("layer-", "");
        const cfg = newMix[layerKey];
        if (cfg) {
          const slider = card.querySelector(".layer-slider");
          const toggleBtn = card.querySelector(".layer-toggle-btn");
          const valDisplay = card.querySelector(".layer-vol-val");

          if (slider) slider.value = cfg.vol;
          if (valDisplay) valDisplay.textContent = Math.round(cfg.vol * 100) + "%";
          if (toggleBtn) {
            toggleBtn.textContent = cfg.active ? "ON" : "OFF";
            toggleBtn.classList.toggle("active", cfg.active);
          }
        }
      });

      // Start audio if not currently playing
      if (!window.snoozeAudio.isPlaying && btnMasterPlay) {
        btnMasterPlay.click();
      }
    });
  }

  // 432Hz Tibetan Bronze Singing Bowl Trigger
  const btnTibetanBowl = document.getElementById("btn-tibetan-bowl");
  const btnMobileBowl = document.getElementById("btn-mobile-bowl");

  function triggerSingingBowl(btn) {
    window.snoozeAudio.playTibetanBowl(432, 4.5);
    if (btn) {
      btn.style.transform = "scale(0.92)";
      setTimeout(() => { btn.style.transform = ""; }, 200);
      const rect = btn.getBoundingClientRect();
      if (typeof triggerStardustBurst === "function") {
        triggerStardustBurst(rect.left + rect.width / 2, rect.top, 45);
      }
    }
  }

  if (btnTibetanBowl) btnTibetanBowl.addEventListener("click", () => triggerSingingBowl(btnTibetanBowl));
  if (btnMobileBowl) btnMobileBowl.addEventListener("click", () => triggerSingingBowl(btnMobileBowl));

  // Sound Download Modal Controls
  const btnOpenDownloadModal = document.getElementById("btn-open-download-modal");
  const btnCloseDownloadModal = document.getElementById("btn-close-download-modal");
  const downloadSoundsModal = document.getElementById("download-sounds-modal");
  const btnDownloadAllBatch = document.getElementById("btn-download-all-batch");

  if (btnOpenDownloadModal && downloadSoundsModal) {
    btnOpenDownloadModal.addEventListener("click", () => {
      downloadSoundsModal.classList.remove("hidden");
    });
  }

  if (btnCloseDownloadModal && downloadSoundsModal) {
    btnCloseDownloadModal.addEventListener("click", () => {
      downloadSoundsModal.classList.add("hidden");
    });
  }

  if (downloadSoundsModal) {
    downloadSoundsModal.addEventListener("click", (e) => {
      if (e.target === downloadSoundsModal) {
        downloadSoundsModal.classList.add("hidden");
      }
    });
  }

  if (btnDownloadAllBatch && downloadSoundsModal) {
    btnDownloadAllBatch.addEventListener("click", () => {
      const items = downloadSoundsModal.querySelectorAll(".download-sound-item");
      btnDownloadAllBatch.disabled = true;
      btnDownloadAllBatch.textContent = "Downloading...";
      items.forEach((item, index) => {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = item.getAttribute("href");
          a.download = item.getAttribute("download");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          if (index === items.length - 1) {
            setTimeout(() => {
              btnDownloadAllBatch.disabled = false;
              btnDownloadAllBatch.innerHTML = '<svg class="iconly-icon iconly-icon-xs" aria-hidden="true"><use href="#iconly-download"></use></svg> <span>Downloaded All Sounds</span>';
            }, 600);
          }
        }, index * 250);
      });
    });
  }

  /* =========================================================================
     5. Story Generation, Surprise Generator & Paragraph Interaction
     ========================================================================= */
  // Paragraph Click-to-Read Wiring
  function wireParagraphClicks() {
    const paragraphs = storyText.querySelectorAll(".story-paragraph");
    paragraphs.forEach((p, idx) => {
      p.onclick = () => {
        window.snoozeAI.stopNarration();
        narrateIcon.textContent = "⏸";
        narrateLabel.textContent = "Pause Voice";
        btnNarrateStory.classList.remove("btn-secondary");
        btnNarrateStory.classList.add("btn-primary");

        const remainingParagraphs = currentStoryParagraphs.slice(idx);
        window.snoozeAI.narrateStory(
          remainingParagraphs,
          (offsetIdx) => {
            const actualIdx = idx + offsetIdx;
            paragraphs.forEach((para, i) => {
              if (i === actualIdx) {
                para.classList.add("speaking-now");
                para.scrollIntoView({ behavior: "smooth", block: "nearest" });
              } else {
                para.classList.remove("speaking-now");
              }
            });
          },
          () => {
            resetNarrateButton();
          }
        );
      };
    });
  }

  // Initial story paragraphs cache & click wiring
  function cacheCurrentParagraphs() {
    currentStoryParagraphs = Array.from(storyText.querySelectorAll(".story-paragraph")).map(p => p.textContent.trim());
    wireParagraphClicks();
  }
  cacheCurrentParagraphs();

  // Surprise Prompt Inspiration Generator
  const surpriseDreamThemes = [
    "A cozy wooden sleeper train softly rattling across the misty highlands of Scotland under a violet moon...",
    "Floating on a giant emerald water lily leaf across a silent bioluminescent mangrove lagoon...",
    "A sleepy sloth tending a nocturnal greenhouse filled with glowing silver moonflowers...",
    "A warm cedarwood cabin library with a crackling hearth while soft snow falls outside the frosted glass...",
    "An ancient stone lighthouse keeper watching gentle ocean swells lap against warm pebble shores in the calm night...",
    "Drifting in a wicker hot-air balloon above silent lavender fields illuminated by celestial constellations...",
    "A mossy forest teahouse where rain drips steadily from bamboo eaves into quiet stone reflecting basins..."
  ];

  const btnSurprisePrompt = document.getElementById("btn-surprise-prompt");
  if (btnSurprisePrompt) {
    btnSurprisePrompt.addEventListener("click", () => {
      const randomPrompt = surpriseDreamThemes[Math.floor(Math.random() * surpriseDreamThemes.length)];
      customPromptInput.value = randomPrompt;
      storyThemeSelect.value = "custom";
      customPromptWrap.classList.remove("hidden");
      generateBedtimeStory();
    });
  }

  // Story Reading Tools (Font Resizing & Candlelight Mode)
  let currentStoryFontSize = 1.05; // rem
  const btnFontSmaller = document.getElementById("btn-font-smaller");
  const btnFontLarger = document.getElementById("btn-font-larger");
  const btnToggleCandlelight = document.getElementById("btn-toggle-candlelight");

  if (btnFontSmaller) {
    btnFontSmaller.addEventListener("click", () => {
      if (currentStoryFontSize > 0.85) {
        currentStoryFontSize = Math.max(0.80, currentStoryFontSize - 0.1);
        storyText.style.fontSize = `${currentStoryFontSize}rem`;
      }
    });
  }

  if (btnFontLarger) {
    btnFontLarger.addEventListener("click", () => {
      if (currentStoryFontSize < 1.45) {
        currentStoryFontSize = Math.min(1.50, currentStoryFontSize + 0.1);
        storyText.style.fontSize = `${currentStoryFontSize}rem`;
      }
    });
  }

  if (btnToggleCandlelight) {
    btnToggleCandlelight.addEventListener("click", () => {
      storyDisplayContainer.classList.toggle("candlelight-mode");
      btnToggleCandlelight.classList.toggle("active");
    });
  }

  if (storyThemeSelect) {
    storyThemeSelect.addEventListener("change", (e) => {
      if (e.target.value === "custom") {
        customPromptWrap.classList.remove("hidden");
        customPromptInput.focus();
      } else {
        customPromptWrap.classList.add("hidden");
      }
    });
  }

  if (btnApplyCustom) {
    btnApplyCustom.addEventListener("click", () => {
      generateBedtimeStory();
    });
  }

  async function generateBedtimeStory() {
    const theme = storyThemeSelect.value;
    const customPrompt = theme === "custom" ? customPromptInput.value : null;

    // Show loading
    storyLoadingIndicator.classList.remove("hidden");
    window.snoozeAI.stopNarration();
    resetNarrateButton();

    try {
      const story = await window.snoozeAI.generateStory(theme, customPrompt);

      storyChapterTag.textContent = story.title;
      storyText.innerHTML = "";

      story.paragraphs.forEach((pText, i) => {
        const p = document.createElement("p");
        p.className = "story-paragraph highlightable";
        p.dataset.p = i + 1;
        p.title = "Click to listen from this paragraph";
        p.textContent = pText;
        storyText.appendChild(p);
      });

      cacheCurrentParagraphs();
    } catch (err) {
      console.error("Story generation error:", err);
    } finally {
      storyLoadingIndicator.classList.add("hidden");
    }
  }

  if (btnGenerateStory) {
    btnGenerateStory.addEventListener("click", () => {
      generateBedtimeStory();
    });
  }

  // Voice Narration
  function resetNarrateButton() {
    narrateIcon.textContent = "🔊";
    narrateLabel.textContent = "Read Aloud (Voice)";
    btnNarrateStory.classList.remove("btn-primary");
    btnNarrateStory.classList.add("btn-secondary");

    // Remove speaking highlights
    document.querySelectorAll(".story-paragraph").forEach(p => p.classList.remove("speaking-now"));
  }

  if (btnNarrateStory) {
    btnNarrateStory.addEventListener("click", () => {
      if (window.snoozeAI.isNarrating) {
        window.snoozeAI.stopNarration();
        resetNarrateButton();
      } else {
        narrateIcon.textContent = "⏸";
        narrateLabel.textContent = "Pause Voice";
        btnNarrateStory.classList.remove("btn-secondary");
        btnNarrateStory.classList.add("btn-primary");

        window.snoozeAI.narrateStory(
          currentStoryParagraphs,
          (index) => {
            // Highlight current paragraph
            const paragraphs = storyText.querySelectorAll(".story-paragraph");
            paragraphs.forEach((p, i) => {
              if (i === index) {
                p.classList.add("speaking-now");
                p.scrollIntoView({ behavior: "smooth", block: "nearest" });
              } else {
                p.classList.remove("speaking-now");
              }
            });
          },
          () => {
            resetNarrateButton();
          }
        );
      }
    });
  }

  if (voiceRateSlider) {
    voiceRateSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      rateValue.textContent = val.toFixed(2) + "x";
      window.snoozeAI.setNarrationRate(val);
    });
  }

  // Copy Story
  if (btnCopyStory) {
    btnCopyStory.addEventListener("click", async () => {
      const fullText = currentStoryParagraphs.join("\n\n");
      try {
        await navigator.clipboard.writeText(fullText);
        btnCopyStory.textContent = "✓";
        setTimeout(() => {
          btnCopyStory.textContent = "📋";
        }, 1800);
      } catch (e) {
        alert("Copied text!");
      }
    });
  }

  /* =========================================================================
     6. Sloth Auto-Fade Timer & Sleep Drift Mode
     ========================================================================= */
  timerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      timerButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const mins = parseInt(btn.dataset.mins, 10);
      timerDisplay.textContent = mins === 0 ? "Infinite" : mins + " min";
      fadeStatusText.textContent = mins === 0 ? "Timer disabled (Continuous Ambient)" : `Timer active: ${mins} minutes remaining`;
      timerProgressFill.style.width = "100%";

      window.snoozeAudio.setFadeDuration(mins);
    });
  });

  // Audio Engine Timer Tick Callbacks
  window.snoozeAudio.onTimerTick = (ratio, msRemaining) => {
    timerProgressFill.style.width = (ratio * 100) + "%";
    const mins = Math.floor(msRemaining / 60000);
    const secs = Math.floor((msRemaining % 60000) / 1000);
    fadeStatusText.textContent = `Drift timer: ${mins}m ${secs < 10 ? '0' : ''}${secs}s remaining`;

    // Gradually engage sleep dim overlay in final 25% of timer
    if (ratio < 0.25 && sleepOverlay) {
      sleepOverlay.classList.add("active");
    }
  };

  window.snoozeAudio.onTimerComplete = () => {
    updateMasterPlayButton(false);
    fadeStatusText.textContent = "Sleep cycle complete. Sweet dreams! 🦥";
  };

  /* =========================================================================
     7. Instant Sloth Bedtime Mode (Ultimate Laziness 1-Click Button)
     ========================================================================= */
  if (btnQuickSleep) {
    btnQuickSleep.addEventListener("click", () => {
      // 1. Start audio soundscape if not playing
      if (!window.snoozeAudio.isPlaying) {
        window.snoozeAudio.startAll();
        updateMasterPlayButton(true);
      }

      // 2. Set 30 minute fade timer
      const thirtyBtn = document.querySelector('.btn-timer[data-mins="30"]');
      if (thirtyBtn) thirtyBtn.click();

      // 3. Trigger bedtime story narration
      if (!window.snoozeAI.isNarrating && btnNarrateStory) {
        btnNarrateStory.click();
      }

      // 4. Smooth visual notification
      btnQuickSleep.innerHTML = `<span>✨</span><span>Sloth Mode Active</span>`;
      btnQuickSleep.style.background = "linear-gradient(135deg, #059669, #047857)";

      // Scroll smoothly to story reading view
      storyDisplayContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* =========================================================================
     8. Diagnostics Drawer & Privacy Manifesto
     ========================================================================= */
  if (btnToggleDiagnostics) {
    btnToggleDiagnostics.addEventListener("click", () => {
      const isCollapsed = diagnosticsBody.classList.toggle("collapsed");
      expandIcon.textContent = isCollapsed ? "▼" : "▲";
      btnExpandDiagnostics.setAttribute("aria-expanded", !isCollapsed);
    });
  }

  if (btnResetApp) {
    btnResetApp.addEventListener("click", () => {
      window.snoozeAudio.stopAll();
      window.snoozeAI.stopNarration();
      updateMasterPlayButton(false);
      resetNarrateButton();
      if (sleepOverlay) sleepOverlay.classList.remove("active");
      const defaultPreset = document.querySelector('.preset-chip[data-preset="sloth-sanctuary"]');
      if (defaultPreset) defaultPreset.click();
    });
  }

  /* =========================================================================
     9. Aceternity & Skiper UI Spotlight & Border-Beam Animation Physics
     ========================================================================= */
  // Aceternity Spotlight cursor tracking on all spotlight cards
  const spotlightCards = document.querySelectorAll(".spotlight-card, .sound-layer-card");
  spotlightCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Border Beam rotating angle animation
  let beamAngle = 0;
  const borderBeams = document.querySelectorAll(".border-beam");
  function animateBorderBeam() {
    if (!document.hidden && borderBeams.length > 0) {
      beamAngle = (beamAngle + 1.2) % 360;
      for (let i = 0; i < borderBeams.length; i++) {
        borderBeams[i].style.setProperty("--beam-angle", `${beamAngle}deg`);
      }
    }
    requestAnimationFrame(animateBorderBeam);
  }
  animateBorderBeam();

  /* =========================================================================
     10. PWA Service Worker & Install Prompt Controller
     ========================================================================= */
  let deferredPrompt = null;
  const btnPwaInstall = document.getElementById("btn-pwa-install");

  // Register Service Worker for 100% Offline Access
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered successfully:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    });
  }

  // Check if already running as standalone PWA
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (!isStandalone && btnPwaInstall) {
    // Show install button so mobile and desktop users know it's a PWA
    btnPwaInstall.classList.remove("hidden");
  }

  // Handle PWA Install Prompt (Chromium / Android)
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnPwaInstall && !isStandalone) {
      btnPwaInstall.classList.remove("hidden");
    }
  });

  if (btnPwaInstall) {
    btnPwaInstall.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          btnPwaInstall.classList.add("hidden");
        }
        deferredPrompt = null;
      } else {
        // Fallback instructions for iOS Safari or other browsers
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          alert("📲 To install SnoozeScape on iPhone/iPad:\n\n1. Tap the Share button (square with arrow) at the bottom.\n2. Scroll down and tap 'Add to Home Screen'.\n3. Enjoy 100% offline bedtime soundscapes!");
        } else {
          alert("📲 To install SnoozeScape as an Offline App:\n\n• In Chrome/Edge: Click the install icon (⊕) on the right side of the address bar.\n• On Android: Tap the menu (⋮) > 'Install app' or 'Add to Home screen'.");
        }
      }
    });
  }

  window.addEventListener("appinstalled", () => {
    if (btnPwaInstall) btnPwaInstall.classList.add("hidden");
    console.log("[PWA] SnoozeScape installed to home screen!");
  });

  // Handle PWA shortcut action query params (e.g. ?action=sloth-mode)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("action") === "sloth-mode") {
      setTimeout(() => {
        if (btnQuickSleep) {
          btnQuickSleep.click();
          console.log("[PWA] Triggered Instant Sloth Mode from shortcut");
        }
      }, 600);
    }
  } catch (err) {
    console.warn("[PWA] Shortcut parsing error:", err);
  }

  /* =========================================================================
     11. Mobile Floating Action Dock Wiring
     ========================================================================= */
  const btnMobileSloth = document.getElementById("btn-mobile-sloth");
  const btnMobileBreathe = document.getElementById("btn-mobile-breathe");
  const btnMobileStory = document.getElementById("btn-mobile-story");

  if (btnMobileSloth && btnQuickSleep) {
    btnMobileSloth.addEventListener("click", () => {
      btnQuickSleep.click();
    });
  }

  if (btnMobileSound && btnMasterPlay) {
    btnMobileSound.addEventListener("click", () => {
      btnMasterPlay.click();
    });
  }

  if (btnMobileBreathe) {
    btnMobileBreathe.addEventListener("click", () => {
      const el = document.getElementById("breathing-heading");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (btnMobileStory) {
    btnMobileStory.addEventListener("click", () => {
      const el = document.getElementById("story-heading");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* =========================================================================
     13. Sleep Neuro-Lab: Binaural Brainwave Tuning Station
     ========================================================================= */
  let currentBeatHz = 2.5;
  let currentCarrierHz = 196.0;

  const bwChips = document.querySelectorAll(".bw-chip");
  const bwSlider = document.getElementById("brainwave-slider");
  const bwSliderDisplay = document.getElementById("bw-slider-display");
  const liveHzReadout = document.getElementById("live-hz-readout");
  const carrierButtons = document.querySelectorAll(".carrier-btn");

  function getBrainwaveBandName(hz) {
    if (hz < 4.0) return "Delta";
    if (hz < 8.0) return "Theta";
    if (hz < 12.0) return "Alpha";
    return "Beta";
  }

  function updateBrainwaveUI(hz, stateName = null) {
    const band = stateName || getBrainwaveBandName(hz);
    if (bwSliderDisplay) {
      bwSliderDisplay.textContent = `${hz.toFixed(2)} Hz`;
    }
    if (liveHzReadout) {
      liveHzReadout.textContent = `${hz.toFixed(2)} Hz ${band}`;
    }
    if (bwSlider && Math.abs(parseFloat(bwSlider.value) - hz) > 0.05) {
      bwSlider.value = hz;
    }
  }

  // Chip selection
  bwChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      bwChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const hz = parseFloat(chip.dataset.hz);
      const name = chip.dataset.name;
      currentBeatHz = hz;

      updateBrainwaveUI(hz, name);

      if (window.snoozeAudio) {
        window.snoozeAudio.setBinauralFrequencies(currentBeatHz, currentCarrierHz);
      }
    });
  });

  // Slider fine-tuning
  if (bwSlider) {
    bwSlider.addEventListener("input", (e) => {
      const hz = parseFloat(e.target.value);
      currentBeatHz = hz;

      // Update chip highlights if matching
      bwChips.forEach((chip) => {
        const chipHz = parseFloat(chip.dataset.hz);
        if (Math.abs(chipHz - hz) < 0.15) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });

      updateBrainwaveUI(hz);

      if (window.snoozeAudio) {
        window.snoozeAudio.setBinauralFrequencies(currentBeatHz, currentCarrierHz);
      }
    });
  }

  // Carrier harmonic frequency buttons
  carrierButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      carrierButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentCarrierHz = parseFloat(btn.dataset.carrier);

      if (window.snoozeAudio) {
        window.snoozeAudio.setBinauralFrequencies(currentBeatHz, currentCarrierHz);
      }
    });
  });

  /* =========================================================================
     14. Bedtime Mind Release (Dissolve Worries into Stardust)
     ========================================================================= */
  const worryInput = document.getElementById("worry-text-input");
  const btnDissolveWorry = document.getElementById("btn-dissolve-worry");
  const btnClearWorry = document.getElementById("btn-clear-worry");
  const affirmationText = document.getElementById("affirmation-text");
  const intentionChips = document.querySelectorAll(".intention-chip");

  const bedtimeAffirmations = [
    "Your day is complete. Everything you did was enough. Tomorrow has its own light.",
    "You do not have to solve tomorrow tonight. Let the quiet darkness hold you safely.",
    "Every breath releases the weight of today. You are safe, warm, and free to rest.",
    "The universe takes over while you sleep. Give yourself full permission to let go.",
    "Peace begins where striving stops. Sink into the effortless stillness of this moment.",
    "Thoughts are just passing clouds across the night sky. Sleep in the vast stillness beneath them.",
    "Breathe out the tension of doing; breathe in the gentle peace of simply being."
  ];

  if (btnDissolveWorry) {
    btnDissolveWorry.addEventListener("click", () => {
      // 1. Calculate origin for stardust particles
      const rect = btnDissolveWorry.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // 2. Trigger rich stardust burst into celestial sky
      triggerStardustBurst(originX, originY, 85);

      // 3. Play resonant 432Hz Tibetan bronze bowl chime
      if (window.snoozeAudio) {
        window.snoozeAudio.playTibetanBowl(432, 5.0);
      }

      // 4. Animate textarea dissolution
      if (worryInput) {
        worryInput.classList.add("dissolving");
      }

      // 5. Select a new comforting bedtime affirmation
      if (affirmationText) {
        affirmationText.style.opacity = "0";
        setTimeout(() => {
          const currentIndex = bedtimeAffirmations.indexOf(affirmationText.textContent);
          let newIndex = Math.floor(Math.random() * bedtimeAffirmations.length);
          if (newIndex === currentIndex) {
            newIndex = (newIndex + 1) % bedtimeAffirmations.length;
          }
          affirmationText.textContent = bedtimeAffirmations[newIndex];
          affirmationText.style.opacity = "1";
        }, 400);
      }

      // 6. Reset textarea after dissolution completes
      setTimeout(() => {
        if (worryInput) {
          worryInput.value = "";
          worryInput.classList.remove("dissolving");
          worryInput.placeholder = "Your thoughts have dissolved into stardust. Sleep peacefully...";
        }
      }, 1600);
    });
  }

  if (btnClearWorry && worryInput) {
    btnClearWorry.addEventListener("click", () => {
      worryInput.value = "";
      worryInput.placeholder = "e.g. Stress about tomorrow's presentation, busy thoughts, unfinished tasks...";
    });
  }

  intentionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const intention = chip.dataset.text;
      if (worryInput) {
        worryInput.value = intention;
        worryInput.focus();
      }
    });
  });

  /* =========================================================================
     15. Circadian 90-Minute REM Sleep Cycle Calculator
     ========================================================================= */
  const cycleTimesGrid = document.getElementById("cycle-times-grid");

  function calculateAndRenderSleepCycles() {
    if (!cycleTimesGrid) return;

    // Bedtime base: right now + 14 minutes latency to drift off
    const now = new Date();
    const sleepLatencyMinutes = 14;

    const cycles = [
      { count: 3, mins: 270, label: "3 Cycles", desc: "4.5 hrs sleep • Power recharge" },
      { count: 4, mins: 360, label: "4 Cycles", desc: "6.0 hrs sleep • Adequate rest" },
      { count: 5, mins: 450, label: "5 Cycles", desc: "7.5 hrs sleep • Optimal REM & Repair", optimal: true },
      { count: 6, mins: 540, label: "6 Cycles", desc: "9.0 hrs sleep • Full recovery" }
    ];

    let html = "";
    cycles.forEach((c) => {
      const wakeTime = new Date(now.getTime() + (sleepLatencyMinutes + c.mins) * 60 * 1000);
      let hours = wakeTime.getHours();
      const minutes = wakeTime.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

      html += `
        <div class="cycle-time-card ${c.optimal ? "optimal" : ""}">
          <span class="cycle-badge">${c.label}${c.optimal ? " ★ Optimal" : ""}</span>
          <span class="cycle-time">${formattedTime}</span>
          <span class="cycle-meta">${c.desc}</span>
        </div>
      `;
    });

    cycleTimesGrid.innerHTML = html;
  }

  calculateAndRenderSleepCycles();
  // Recalculate every minute to keep current
  setInterval(calculateAndRenderSleepCycles, 60000);
});

