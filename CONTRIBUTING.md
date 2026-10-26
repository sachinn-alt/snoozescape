# Contributing to SnoozeScape 🦥

Thank you for your interest in contributing to **SnoozeScape**! 

SnoozeScape is an open-source, privacy-first bedtime companion designed to help people around the world disconnect, slow down, and drift into peaceful, restorative sleep. We welcome contributions from developers, designers, writers, accessibility advocates, sound designers, and sleep enthusiasts of all experience levels!

---

## 🌟 Our Guiding Principles

Every line of code and feature in SnoozeScape adheres to three core tenets:

1. **100% Offline & Private:** No trackers, no cookies, no analytics, no external cloud API dependencies. Everything runs locally in the user's browser.
2. **Zero Complex Toolchains:** Pure modern HTML5, CSS3, and JavaScript (ES Modules). No bloated `node_modules` required to contribute; edit, save, and refresh your browser!
3. **Calm, Screen-Friendly Aesthetics:** High-contrast midnight glassmorphism, warm candlelight modes, and zero aggressive animations or blue-light blasts.

---

## 🚀 Quick Start for Contributors

You can have SnoozeScape running locally in under **30 seconds**:

### 1. Fork and Clone
```bash
# Fork the repo on GitHub, then clone your fork:
git clone https://github.com/<your-username>/snoozescape.git
cd snoozescape
```

### 2. Run Locally (Choose Any Option)

- **Option A (Instant — No Server Required):**
  Simply double-click `index.html` or open it in your browser:
  ```bash
  # Windows:
  start index.html
  # macOS:
  open index.html
  # Linux:
  xdg-open index.html
  ```

- **Option B (Recommended for Service Worker testing):**
  Use Python or Node's lightweight static server:
  ```bash
  # Python 3
  python -m http.server 3000

  # Or using Node
  npx serve -l 3000 .
  ```
  Then visit `http://localhost:3000` in Chrome, Firefox, Safari, Edge, or Brave.

---

## 🗺️ Codebase Map

Here is how SnoozeScape is structured:

```
snoozescape/
├── index.html              # Main UI markup, Bento grid layout, modals, SVG icon sprite
├── styles.css              # Dark-mode glassmorphic theme, responsive styles, animations
├── app.js                  # Application orchestrator, canvas starfield, UI interactions
├── audio-engine.js         # Web Audio API synthesizers & CC0 audio players
├── ai-engine.js            # 100% local storytelling heuristics & WebGPU/Transformers.js
├── sw.js                   # Service Worker for offline PWA caching
├── manifest.json           # Progressive Web App configuration
├── render.yaml             # 1-Click Render.com deployment Blueprint
├── assets/
│   ├── audio/              # Pre-cached CC0 Public Domain audio recordings
│   │   └── AUDIO_LICENSES.md # Provenance & public domain attribution
│   ├── icons/              # Free Iconly Pro vector icon sprites
│   └── vector-art/         # Handcrafted sleep-themed SVG illustrations
└── README.md               # Main project documentation & live demo links
```

---

## 💡 Great Ways to Contribute

Not sure where to begin? Here are popular areas where contributions are warmly welcomed:

### 1. 🌿 Health & Mental Wellness Sanctuary
- Add new scientifically grounded **Bedtime Somatic Rituals** or **Wind-Down Checklists**.
- Add new concept themes to the **Cognitive Shuffle** engine (e.g., cozy kitchen memories, oceanic wonders, ancient trees).
- Add gentle sleep reflection prompts or self-compassion affirmations.

### 2. 🎵 Procedural Audio & Synthesis (`audio-engine.js`)
- Design new procedural sound layers using the Web Audio API (e.g., distant summer thunder, babbling mountain brook, night crickets, cat purrs).
- Improve the acoustic decay or harmonic overtones of the 432 Hz Tibetan singing bowl.
- Add new brainwave entrainment frequencies (e.g., Gamma focus, Alpha relaxation).

### 3. 📖 Bedtime Story Generator (`ai-engine.js`)
- Craft new calming story templates and sleepy tropes (e.g., Nordic winter cabins, starlit botanical gardens, ancient clockmaker workshops).
- Expand procedural sensory descriptions and gentle narrator pacing.

### 4. 🎨 Design & UI Aesthetics (`styles.css` / `index.html`)
- Propose new calming ambient color themes (e.g., *Aurora Borealis*, *Warm Amber Hearth*, *Deep Oceanic Blue*).
- Optimize responsive mobile layouts or enhance keyboard navigation.
- Add handcrafted SVG illustrations for sleep milestones.

### 5. 🌐 Internationalization (i18n)
- Translate bedtime story prompts, wellness prescriptions, and UI controls into Spanish, French, German, Japanese, Hindi, Mandarin, and more.

### 6. ♿ Accessibility & Performance
- Improve screen-reader announcements (ARIA attributes).
- Optimize canvas rendering loop and battery consumption on low-power mobile devices.

---

## 📋 Contribution Workflow

Please follow this streamlined process when submitting changes:

### 1. Create a Topic Branch
```bash
git checkout -b feat/add-gentle-brook-sound
# Or: fix/audio-fade-timer
# Or: docs/clarify-render-setup
```

### 2. Make Your Edits
- Keep dependencies at **0** (pure standard web APIs).
- Maintain high-contrast, eye-friendly bedtime aesthetics.
- Preserve offline functionality (test with Airplane Mode or DevTools offline switch).

### 3. Verify Code Quality
Make sure there are no syntax errors:
```bash
node --check app.js
node --check audio-engine.js
node --check ai-engine.js
node --check sw.js
```
Open DevTools Console in your browser (`F12`) to verify there are zero runtime errors or warnings.

### 4. Commit with Conventional Commits
Write clear, concise commit messages:
- `feat(wellness): add mindful gratitude check-in to evening ritual`
- `fix(audio): smooth gain ramp during quick pause/play toggle`
- `docs(readme): update Render deployment guide and live link`
- `style(theme): refine candle-light amber contrast on OLED screens`

### 5. Push and Open a Pull Request
```bash
git push origin feat/add-gentle-brook-sound
```
Navigate to your fork on GitHub and click **Compare & pull request**. Describe your changes, what problem they solve, and include a screenshot or GIF if you modified the UI!

---

## ☁️ Testing Deployment on Render

If you want to test how your branch deploys on [Render](https://render.com):
1. Push your branch to GitHub.
2. In Render, select **New Static Site** and select your repository.
3. Render will use `render.yaml` automatically (`Publish directory: ./`, `Build command: none`).
4. Instant global deployment with automated SSL!

---

## 🤝 Code of Conduct & Community Respect

We are dedicated to providing a friendly, respectful, and harassment-free experience for everyone, regardless of background, gender, identity, sexual orientation, disability, physical appearance, race, or experience level. 

Be kind, assume positive intent, and help fellow contributors grow!

---

## 💬 Questions & Support

Have an idea or need guidance?
- Open an **[Issue](https://github.com/sachinn-alt/snoozescape/issues)** to pitch your idea or ask questions.
- Check out the live deployment on Render at **[https://snoozescape.onrender.com](https://snoozescape.onrender.com)**.

Happy coding, and sweet dreams! 🦥🌙
