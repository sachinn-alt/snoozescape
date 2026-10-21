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

    const starCount = Math.floor((width * height) / 4500);
    let stars = [];
    let shootingStars = [];
    let stardustParticles = [];
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
      // Ignore interactive clicks on buttons/inputs
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
      if (Math.random() > 0.3) {
        spawnShootingStar();
      }
    }, 7000);

    function animateStars() {
      ctx.clearRect(0, 0, width, height);

      // Render Interactive Constellation Lines Near Cursor
      if (pointerActive) {
        const nearbyStars = [];
        for (let i = 0; i < stars.length; i++) {
          const dx = stars[i].x - pointerX;
          const dy = stars[i].y - pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            nearbyStars.push(stars[i]);
            // Line from star to pointer
            const alpha = (1 - dist / 110) * 0.35;
            ctx.strokeStyle = `rgba(245, 183, 38, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(pointerX, pointerY);
            ctx.stroke();
          }
        }

        // Connect nearby stars with each other to form celestial asterisms
        for (let i = 0; i < nearbyStars.length; i++) {
          for (let j = i + 1; j < nearbyStars.length; j++) {
            const dx = nearbyStars[i].x - nearbyStars[j].x;
            const dy = nearbyStars[i].y - nearbyStars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
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

      // Render Stars
      stars.forEach(star => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.008;
        star.opacity = Math.max(0.15, Math.min(0.95, star.opacity));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

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
        chimeBtnIcon.textContent = "🔔";
        chimeBtnLabel.textContent = "Chime On";
        btnToggleChime.classList.add("active");
        window.snoozeAudio.playBreathingChime("inhale");
      } else {
        chimeBtnIcon.textContent = "🔇";
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
        breathingBtnIcon.textContent = "⏸";
        breathingBtnLabel.textContent = "Pause Breathing Guide";
        if (breathingIndicator) breathingIndicator.style.animationPlayState = "running";
        startBreathingGuide();
      } else {
        breathingBtnIcon.textContent = "▶";
        breathingBtnLabel.textContent = "Resume Breathing Guide";
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

    function drawSpectrum() {
      requestAnimationFrame(drawSpectrum);
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
        const dataArray = new Uint8Array(bufferLength);
        window.snoozeAudio.analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;
          const grad = ctx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, "#f5b726");
          grad.addColorStop(1, "#38bdf8");

          ctx.fillStyle = grad;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      } else if (visualizerMode === 1) {
        // Mode 1: Liquid Sine Oscilloscope Wave
        const bufferLength = window.snoozeAudio.analyser.fftSize;
        const timeArray = new Uint8Array(bufferLength);
        window.snoozeAudio.analyser.getByteTimeDomainData(timeArray);

        ctx.lineWidth = 2;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, "#f5b726");
        grad.addColorStop(0.5, "#38bdf8");
        grad.addColorStop(1, "#f5b726");
        ctx.strokeStyle = grad;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      } else if (visualizerMode === 2) {
        // Mode 2: Concentric Nebula Pulse Rings
        const bufferLength = window.snoozeAudio.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        window.snoozeAudio.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
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
      masterPlayIcon.textContent = "⏸";
      masterPlayText.textContent = "Pause Soundscape";
      if (mobileSoundIcon) mobileSoundIcon.textContent = "⏸";
      if (mobileSoundLabel) mobileSoundLabel.textContent = "Pause";
      if (btnMobileSound) btnMobileSound.classList.add("is-playing");
    } else {
      btnMasterPlay.classList.remove("playing");
      masterPlayIcon.textContent = "▶";
      masterPlayText.textContent = "Start Soundscape";
      if (mobileSoundIcon) mobileSoundIcon.textContent = "▶";
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
    }
  }

  if (btnTibetanBowl) btnTibetanBowl.addEventListener("click", () => triggerSingingBowl(btnTibetanBowl));
  if (btnMobileBowl) btnMobileBowl.addEventListener("click", () => triggerSingingBowl(btnMobileBowl));

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
  function animateBorderBeam() {
    beamAngle = (beamAngle + 1.2) % 360;
    const borderBeams = document.querySelectorAll(".border-beam");
    borderBeams.forEach(b => {
      b.style.setProperty("--beam-angle", `${beamAngle}deg`);
    });
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
  const btnMobileSound = document.getElementById("btn-mobile-sound");
  const mobileSoundIcon = document.getElementById("mobile-sound-icon");
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
      if (mobileSoundIcon) {
        mobileSoundIcon.textContent = window.snoozeAudio.isPlaying ? "⏸" : "▶";
      }
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
});
