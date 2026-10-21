# SnoozeScape 🦥
### *100% Offline Ambient Bedtime AI & Procedural Soundscape Companion*

> *Drift into deep, restorative sleep with mathematical soundscapes and private local AI bedtime tales.*

<p align="center">
  <img src="icon-192.png" alt="SnoozeScape Logo" width="120" height="120">
</p>

---

## 🌟 What is SnoozeScape?

Sloths have sleep figured out: they move at 0.15 mph, conserve their energy, and never stress over unread notifications. **SnoozeScape** is an open-source, privacy-first sleep companion built to channel that exact philosophy.

When you climb into bed, the last thing you want is a screen blasting blue light, an app demanding account login, or cloud APIs draining your battery while tracking your intimate evening habits.

With SnoozeScape:
1. Put your laptop, phone, or tablet on your nightstand.
2. Turn on **Airplane Mode** (no Wi-Fi needed).
3. Click **"Instant Sloth Mode"** (or do literally nothing else).

SnoozeScape generates an original, calming bedtime story using local open-weight AI, reads it aloud with a soothing whisper-paced narrator, and synthesizes a multi-layered procedural soundscape (rain, fireplace, ocean swell, canopy wind, brown noise, and 4.5Hz binaural delta sleep waves) **directly in your browser with pure mathematics**. As you drift off, the auto-fade timer gently quiets the audio and dims your screen to pitch black.

---

## ✨ Rich Interactive Experiences

- 🧠 **Sleep Neuro-Lab & Mind Release Sanctuary:**
  - **Binaural Brainwave Tuning Station:** Fine-tune target brainwave frequencies in real time across **Deep Delta (2.5 Hz)**, **Theta REM (5.5 Hz)**, **Schumann Resonance (7.83 Hz)**, and **Twilight Alpha (10.0 Hz)** with harmonic carrier frequency selection (196 Hz G3, 432 Hz Verdi, 528 Hz Solfeggio).
  - **Dissolve Worries to Stardust:** Type any lingering daily anxieties and tap "Dissolve to Stardust" to watch thoughts disintegrate into glowing particles drifting into the night sky, accompanied by a resonant 432 Hz Tibetan bronze singing bowl and soothing bedtime affirmations.
  - **Circadian 90-Minute REM Cycle Guide:** Real-time sleep cycle math calculating optimal wake times based on natural REM rhythm (90 min cycles + 14 min sleep latency) so you wake up refreshed and free of sleep inertia.
- 🌌 **Interactive Celestial Sky Canvas:** Ambient drifting and softly pulsing starfield with real-time stardust particle physics.
- 🫧 **Interactive Breathing Pacer:** Choose between **4-7-8 Deep Sleep**, **4-4-4 Box Breathing**, or **4-6 Ocean Flow** with optional harmonic acoustic cues and tap-to-sync feedback.
- 📊 **Multi-Mode Live Audio Visualizer:** Cycle in real-time between **Spectrum Equalizer Bars**, **Fluid Sine Oscilloscope Wave**, and **Concentric Nebula Pulse Rings**.
- 🎛️ **Procedural Mixer with "Randomize Mix 🎲":** Blend your 6 ambient generators or let the engine roll a balanced, calming mix with animated slider transitions.
- 🔔 **Tibetan Singing Bowl (432 Hz):** Synthesized physical acoustics using harmonic sine wave decay to center the mind before sleep.
- 📖 **Interactive Bedtime Tale Companion:** Click any paragraph to read aloud from that exact line with golden glowing tracking, generate randomized dream inspiration, and toggle candlelight eye-comfort reading mode.


---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Your Local Machine (100% Offline / Airplane Mode)"]
        UI["Midnight Glassmorphic Interface<br/>(Vanilla HTML5 & CSS3)"]
        Canvas["Celestial Starfield Canvas<br/>(Dynamic Constellations)"]
        Breathing["4-7-8 Sloth Breathing Pacer<br/>(Harmonic Relaxation)"]
        
        subgraph AI_Engine["Open-Source AI Engine"]
            Model["Local Open-Weight Storyteller<br/>(SmolLM2 / Transformers.js / Heuristic)"]
            TTS["Soft Bedtime Voice Narrator<br/>(Web Speech API Synthesizer)"]
            Sync["Line-by-Line Visual Sync<br/>(Paragraph Glow Tracker)"]
        end

        subgraph Audio_Engine["Procedural Web Audio Synth (0 Audio Files)"]
            Binaural["Dual Sine Oscillators<br/>(4.5 Hz Delta Brainwave Entrainment)"]
            Rain["Filtered BiQuad White Noise<br/>(Raindrop Bandpass Modulation)"]
            Fire["Stochastic Poisson Bursts<br/>(Wood Snaps & Hearth Low Rumble)"]
            Brown["Integrated Dual Low-Pass<br/>(Deep Brownian Sleep Masking)"]
            Wind["Resonant Bandpass + 0.12Hz LFO<br/>(Modulated Tree Canopy Breeze)"]
            Ocean["Lowpass + 0.08Hz Sinusoidal LFO<br/>(Tidal Infrasound Swells)"]
            Master["Master Gain & Visualizer FFT<br/>+ Sloth Auto-Fade Timer"]
        end
    end

    UI --> AI_Engine
    UI --> Audio_Engine
    Canvas --> UI
    Breathing --> UI
    Model --> TTS --> Sync
    Binaural & Rain & Fire & Brown & Wind & Ocean --> Master --> Speakers["Laptop / Nightstand Speakers"]
```

---

## 🦥 Effortless Sleep Automation

| Effort Spent by You | What SnoozeScape Does Automatically |
| :--- | :--- |
| **1 Single Click** on "Instant Sloth Mode" | Starts soundscape, sets 30-min fade timer, generates a fresh bedtime story, and starts slow narration. |
| **0 Seconds Writing Prompts** | Choose from curated themes (*Sloth Sanctuary*, *Midnight Highland Train*, *Starlit Library*, *Pine Hearth*) or tap generate. |
| **0 App Logins or Signups** | No passwords, no accounts, no credit cards, no verification emails. |
| **0 Battery-Wasting Streaming** | All 6 soundscapes are synthesized mathematically in real time—zero megabytes of audio streamed over Wi-Fi. |
| **0 Waking Up to Loud Noise** | In the final minutes of your sleep timer, the master audio gently tapers to zero decibels and the screen dims to black. |

---

## 🛡️ Why Open Innovation Matters

Closed-source AI products (commercial meditation apps, proprietary LLM APIs, and cloud text-to-speech services) suffer from four fundamental flaws when used in the bedroom:

1. **Intimate Privacy Violations:** Sleep schedules, bedtime conversations, emotional states, and meditation logs are prime targets for user profiling and advertising data brokers. SnoozeScape sends **0 network requests**; everything stays strictly in local browser memory.
2. **The "Airplane Mode" Paradox:** Cloud AI requires a 24/7 active internet connection on your bedside table—emitting radio frequencies and risking midnight notification chimes. Open-source local AI works in a remote cabin, during a power outage, or with your laptop in full Airplane Mode.
3. **Zero Token Fees & Subscription Traps:** Closed voice APIs charge per character, causing apps to slap users with monthly subscriptions or cut off audio mid-meditation when quota limits are hit. Open-weight models are free forever.
4. **Customizable & Transparent:** Want to modify the binaural frequency from 4.5Hz to 7.83Hz (Schumann resonance)? Want to customize the story tropes or train a custom Sloth persona? With open source, you own the code and the model pipeline.

---

## 🎵 Real-Time Procedural Sound Synthesizers

SnoozeScape contains **zero MP3 or WAV audio assets**. All sounds are generated via the browser's native **Web Audio API**:

- **Binaural Delta Beats:** Dual stereo-panned sine wave oscillators (Left: 196.0 Hz, Right: 200.5 Hz) generating a 4.5 Hz frequency differential to trigger deep restorative slow-wave sleep.
- **Nocturnal Rain:** Dual-filtered noise generator (Highpass at 280Hz, Lowpass at 1200Hz) simulating steady rain falling onto tropical canopy foliage.
- **Cozy Fireplace:** Low-frequency 140Hz rumble coupled with stochastic bandpass Poisson impulses (2400Hz, Q=4.0) to emulate snapping embers.
- **Deep Brown Noise:** Cascading 12dB/octave lowpass-filtered Brownian noise providing acoustic masking against sudden ambient room noises.
- **Canopy Wind:** Resonant bandpass filter modulated by a 0.12Hz sinusoidal LFO, producing gentle forest wind gusts.
- **Ocean Swell:** 0.08Hz infrasonic LFO modulating gain and frequency, mimicking the natural 12-second rhythm of breaking ocean tides.

---

## 🚀 Getting Started Locally

### Quick Start (No Install Required)
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave, Safari):
```bash
# Clone the repository
git clone https://github.com/sachinn-alt/snoozescape.git
cd snoozescape

# Open directly in browser
# On Windows:
start index.html
# On macOS:
open index.html
# On Linux:
xdg-open index.html
```

### Local Dev Server
```bash
npx serve -l 3000 .
# Open http://localhost:3000
```

## 📱 Offline PWA & Mobile-Ready

SnoozeScape is a full-featured **Progressive Web App (PWA)**:
- **100% Offline Service Worker (`sw.js`):** Pre-caches the entire application bundle (styles, logic, mathematical audio synthesizer, AI engine, and vector icons). Runs in full Airplane Mode with zero network connectivity.
- **Installable on iOS & Android:** Add directly to your smartphone home screen with standalone display, custom splash screen (`#07080f`), and sleep shortcuts.
- **Mobile Floating Action Dock:** Inspired by Skiper UI, featuring thumb-friendly controls for instant sleep mode, soundscape toggles, 4-7-8 breathing meditation, and bedtime tales.
- **Aceternity UI Design System:** Dynamic dot-matrix grid with radial moonlight masks, ceiling lamp ambient glow, spotlight cursor tracking, and continuous border-beam physics.

---

## ☁️ Deploy to Render (1-Click)

This project includes a `render.yaml` blueprint for 1-click deployment on Render:

1. Push this repository to GitHub.
2. Log into [Render.com](https://render.com).
3. Click **New +** > **Blueprint** and connect your repository.
4. Render will automatically detect `render.yaml` and deploy your static web application worldwide with automated SSL and CDN caching!

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
