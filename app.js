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

    // Spawn occasional gentle shooting star
    setInterval(() => {
      if (Math.random() > 0.3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.3,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 6 + 4,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 1
        });
      }
    }, 7000);

    function animateStars() {
      ctx.clearRect(0, 0, width, height);

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

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.strokeStyle = "rgba(255, 255, 255, " + s.opacity + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.015;

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
     2. Guided Sloth Breathing Pacer (4-7-8 Relaxation Cycle)
     ========================================================================= */
  function startBreathingGuide() {
    let phase = 0; // 0: Inhale, 1: Hold, 2: Exhale
    const phases = [
      { text: "Inhale slowly and deeply as the halo expands... (4s)", duration: 4000 },
      { text: "Hold gently in serene stillness... (7s)", duration: 7000 },
      { text: "Exhale completely, releasing all effort... (8s)", duration: 8000 }
    ];

    function runCycle() {
      if (!breathingActive) return;
      const current = phases[phase];
      if (breathingGuideText) {
        breathingGuideText.textContent = current.text;
      }
      phase = (phase + 1) % phases.length;
      breathingInterval = setTimeout(runCycle, current.duration);
    }

    runCycle();
  }

  startBreathingGuide();

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
     3. Audio Spectrum Visualizer
     ========================================================================= */
  function initAudioVisualizer() {
    if (!visualizerCanvas) return;
    const ctx = visualizerCanvas.getContext("2d");
    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;

    function drawSpectrum() {
      requestAnimationFrame(drawSpectrum);
      ctx.clearRect(0, 0, width, height);

      if (!window.snoozeAudio || !window.snoozeAudio.analyser || !window.snoozeAudio.isPlaying) {
        // Idle gentle wave
        ctx.fillStyle = "rgba(245, 183, 38, 0.25)";
        ctx.fillRect(0, height / 2 - 1, width, 2);
        return;
      }

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
    }

    drawSpectrum();
  }

  initAudioVisualizer();

  /* =========================================================================
     4. Audio Engine Master & Layer Wiring
     ========================================================================= */
  function updateMasterPlayButton(isPlaying) {
    if (isPlaying) {
      btnMasterPlay.classList.add("playing");
      masterPlayIcon.textContent = "⏸";
      masterPlayText.textContent = "Pause Soundscape";
    } else {
      btnMasterPlay.classList.remove("playing");
      masterPlayIcon.textContent = "▶";
      masterPlayText.textContent = "Start Soundscape";
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

  /* =========================================================================
     5. Story Generation & Narration
     ========================================================================= */
  // Initial story paragraphs cache
  function cacheCurrentParagraphs() {
    currentStoryParagraphs = Array.from(storyText.querySelectorAll(".story-paragraph")).map(p => p.textContent.trim());
  }
  cacheCurrentParagraphs();

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
});
