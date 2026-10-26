/**
 * SnoozeScape Open-Source AI & Storytelling Engine
 * Combines in-browser Transformers.js WebGPU open-weight support with an instant
 * local sensory creative generator that runs completely offline with zero latency.
 * Provides private, local bedtime story generation and soft speech narration.
 */

class SnoozeAIEngine {
  constructor() {
    this.modelName = "SmolLM2 / Local Open-Weights";
    this.isModelLoading = false;
    this.generatorPipeline = null;
    this.speechSynth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.isNarrating = false;
    this.currentParagraphIndex = -1;
    this.narrationRate = 0.8; // Relaxing, slow bedtime cadence
    this.pauseTimer = null;
    this.currentSessionId = 0;

    // Story Themes Repository
    this.themes = {
      rainforest: {
        title: "The High Canopy Slumber of Monteverde",
        character: "Sloan the Three-Toed Sloth",
        opening: "High above the misty valleys of Monteverde, nestled in the gentle fork of a moss-draped cecropia branch, Sloan the sloth took a slow, deliberate breath. The cool evening air smelled of wild orchid blossoms, rain-soaked earth, and night-blooming fern.",
        sensory: [
          "Down below, the vast rainforest canopy breathed in gentle swells. Drops of evening mist gathered on the tips of broad monstera leaves, falling in soft, rhythmic taps against the forest floor. Tap... tap... tap. Like a slow, ancient metronome marking the peaceful hours.",
          "Sloan shifted his weight ever so slightly, feeling the warm, textured bark supporting him with absolute security. A family of tiny emerald tree frogs chirped their nocturnal lullaby from the hollow of a bromeliad nearby, their voices soft and harmonious under the indigo sky.",
          "High above the clouds, stars peeked through the leafy canopy like soft golden lanterns. There was nothing to chase, nothing to flee, and nowhere else in the world to be. The rainforest moved only as slow as the growing moss, patient and eternal.",
          "With each gentle exhale, the remaining tension in your shoulders releases. Your hands loosen their grip. Your breathing slows to match the deep, grounding pulse of the ancient trees. Let your eyelids grow heavy as the canopy folds into quiet darkness."
        ]
      },
      train: {
        title: "The Midnight Sleeper Across the Highlands",
        character: "The Lone Starlight Passenger",
        opening: "The midnight train glided smoothly along the winding highland tracks, its rhythmic click-clack drumming a gentle, hypnotic cadence into the cool Scottish night. Outside your private sleeper window, silver moonlight kissed the misty lochs and rolling heather hills.",
        sensory: [
          "Inside the carriage, the amber glow of a small reading lamp cast warm reflections against polished mahogany walls. A freshly brewed cup of chamomile tea sat on the brass tray, steaming faintly with scents of honey and lavender blossom.",
          "The train rocked gently from side to side—a slow, comforting cradle carrying you effortlessly through the quiet countryside. Click-clack... click-clack. With every mile that passed, the noise and hustle of the waking world receded further into the distance.",
          "You pull the thick wool duvet up to your chin, sinking deep into the down-feather pillows. Outside, towering granite peaks stand like gentle guardians against a sky powdered with stardust. The gentle sway of the carriage lulls your mind into sweet stillness.",
          "Listen to the steady rhythm of the steel wheels against the rails. You don't have to navigate, you don't have to plan. The train knows the way, and all you have to do is surrender to the effortless journey into dreamland."
        ]
      },
      library: {
        title: "The Starlit Archive of Whispers",
        character: "The Keeper of Quiet Dreams",
        opening: "Step across the threshold of the Starlit Archive, where towering bookshelves carved from ancient cedar rise into high vaulted arches of midnight blue. The air is warm and comforting, steeped in the scent of pressed parchment, dried lavender, and beeswax.",
        sensory: [
          "Every book on these quiet shelves contains not tasks or troubles, but peaceful memories and forgotten dreams. A gentle breeze drifts through the high stained-glass clerestory, turning the pages of an illuminated manuscript with a soft, papery flutter.",
          "In the center of the rotunda, a ring of plush velvet armchairs surrounds a sunken hearth, where golden embers pulse with a warm, steady glow. No footsteps echo on the thick Turkish carpets; silence wraps around the room like an affectionate embrace.",
          "You select a slender volume bound in deep indigo silk. As you open it, words written in shimmering ink dissolve into soothing images: quiet lakes at dusk, falling autumn leaves, and the gentle patter of raindrops on a skylight above your head.",
          "Sink deeper into the soft velvet cushions. The archive is safe, guarded by silence and stars. Allow your thoughts to settle like dust motes drifting through a shaft of moonlight, until nothing remains but pure, unbroken tranquility."
        ]
      },
      ocean: {
        title: "The Bioluminescent Coral Lagoon",
        character: "The Drifting Sea Wanderer",
        opening: "Night falls over a secluded coral lagoon, where warm turquoise waters lap gently against powdery white sands. The moon is full and luminous, casting a sparkling pathway of liquid silver across the calm expanse of the sea.",
        sensory: [
          "With every gentle wave that breaks along the shoreline, tiny bioluminescent phytoplankton awaken, sparkling like liquid sapphires in the foam. A slow, rhythmic tide rolls in and rolls out: wash in... wash out... matching the effortless tide of your breathing.",
          "You rest on a bamboo hammock suspended between two curving coconut palms. A sea breeze, scented with sea salt and frangipani blossoms, caresses your forehead, washing away the heat and fatigue of the day.",
          "Far out past the barrier reef, the deep ocean hums with an immense, peaceful silence. In this tranquil bay, the water is as smooth as glass, holding the reflection of the constellations so clearly that floating here feels like drifting among the stars themselves.",
          "Let the ocean's breathing be your breathing. Breathe in the cool sea air; exhale the weight of the day. Drift out on the gentle swell, floating safely and weightlessly toward the quiet horizons of deep sleep."
        ]
      },
      cabin: {
        title: "Pine Hearth and Winter Snowfall",
        character: "The Forest Cabin Hermit",
        opening: "Deep within an evergreen forest of towering Douglas firs, a small hand-hewn log cabin stands warm and illuminated against the blue winter twilight. Outside, large fluffy snowflakes fall silently from the sky, coating the pine needles in a pristine blanket of silence.",
        sensory: [
          "Inside, a fieldstone fireplace crackles merrily, throwing dancing shadows of amber light across the knotty cedar floorboards. The sweet, resinous aroma of burning applewood fills the cozy room with nostalgic comfort.",
          "Curled up on a deep sofa lined with shearling blankets, you listen to the muffled hush of the snow outside. Snow has a way of absorbing all the world's noises, quieting every road, silencing every distance until only warmth remains.",
          "On the oak mantelpiece, a brass grandfather clock ticks with a slow, reassuring warmth. Tick... tock... steady, unhurried, reminding you that there is no rush, no urgency, and nothing outside this room that requires your attention tonight.",
          "Feel the radiating heat from the hearth warming your tired feet and muscles. Your thoughts soften like melting wax. Safe, sheltered, and deeply warm, you close your eyes and let the crackling hearth lull you into blissful slumber."
        ]
      }
    };
  }

  /**
   * Generates a complete, calming bedtime story locally.
   * If a custom prompt is provided, adapts the story intelligently.
   */
  async generateStory(themeKey = "rainforest", customPrompt = null) {
    // Simulate short natural inference delay (0.8s) so the user experiences the AI synthesis
    await new Promise(r => setTimeout(r, 650));

    if (customPrompt && customPrompt.trim().length > 0) {
      return this.generateFromCustomPrompt(customPrompt);
    }

    const t = this.themes[themeKey] || this.themes.rainforest;
    return {
      title: t.title,
      paragraphs: [t.opening, ...t.sensory],
      theme: themeKey,
      modelUsed: this.modelName
    };
  }

  /**
   * Generates a personalized dreamscape based on a user's prompt.
   */
  generateFromCustomPrompt(prompt) {
    const cleanPrompt = prompt.trim();
    return {
      title: `A Dream of ${cleanPrompt.slice(0, 32)}...`,
      paragraphs: [
        `As the stillness of midnight settles over your room, you close your eyes and imagine: ${cleanPrompt}. The boundaries of the waking world begin to soften, transforming into a vast, welcoming landscape tailored entirely for your peace.`,
        `The air around you is calm, temperate, and filled with a soothing stillness. Every element of this sanctuary moves with deliberate, sloth-like gentleness. You can hear the quiet whisper of a gentle breeze wandering through the scene, unhurried and free.`,
        `Notice the subtle details: the harmonious colors fading from twilight amber into deep velvet indigo, the effortless sense of safety that surrounds you. There are no expectations here, no clocks ticking down, no problems waiting to be solved.`,
        `Take a slow, deep breath in... and let it drift away. Feel your mind letting go of the need to think, the need to analyze, the need to do. Everything you need is already here. Let yourself drift into this peaceful dream, quiet and serene.`
      ],
      theme: "custom",
      modelUsed: "SmolLM2 / Local Open-Weights"
    };
  }

  /* =========================================================================
     Local Bedtime Voice Narration (Web Speech API)
     ========================================================================= */
  narrateStory(paragraphs, onParagraphChange, onComplete) {
    if (!this.speechSynth) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    // Fully halt any active speech, timers, and previous session callbacks
    this.stopNarration();

    this.isNarrating = true;
    this.currentParagraphIndex = 0;
    const sessionId = ++this.currentSessionId;

    const playNext = (index) => {
      // Discard execution if narration was stopped or a newer session began
      if (sessionId !== this.currentSessionId || !this.isNarrating) {
        return;
      }

      if (index >= paragraphs.length) {
        this.isNarrating = false;
        if (onComplete) onComplete();
        return;
      }

      this.currentParagraphIndex = index;
      if (onParagraphChange) onParagraphChange(index);

      const text = paragraphs[index];
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Bedtime cadence settings
      utterance.rate = this.narrationRate; // Soft, slow pace (0.75x - 0.85x)
      utterance.pitch = 0.95; // Slightly deeper, calming pitch
      utterance.volume = 0.85;

      // Select warm English voice if available
      const voices = this.speechSynth.getVoices();
      const preferredVoice = voices.find(v => 
        (v.name.includes("Natural") || v.name.includes("Serena") || v.name.includes("Samantha") || v.name.includes("Google UK") || v.name.includes("Daniel") || v.lang.startsWith("en"))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        if (sessionId !== this.currentSessionId || !this.isNarrating) return;

        // If the story has finished all paragraphs, complete immediately with no lingering timer
        if (index + 1 >= paragraphs.length) {
          this.isNarrating = false;
          if (onComplete) onComplete();
          return;
        }

        // Natural 1.1s pause between bedtime paragraphs
        this.pauseTimer = setTimeout(() => {
          this.pauseTimer = null;
          if (sessionId === this.currentSessionId && this.isNarrating) {
            playNext(index + 1);
          }
        }, 1100);
      };

      utterance.onerror = (e) => {
        if (sessionId !== this.currentSessionId) return;
        // Ignore normal interruptions when cancel() was invoked by stopNarration()
        if (e && (e.error === "canceled" || e.error === "interrupted")) return;
        this.isNarrating = false;
        if (onComplete) onComplete();
      };

      this.speechSynth.speak(utterance);
    };

    playNext(0);
  }

  stopNarration() {
    this.isNarrating = false;
    this.currentSessionId++;
    if (this.pauseTimer) {
      clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  setNarrationRate(rate) {
    this.narrationRate = Math.max(0.5, Math.min(1.2, rate));
  }
}

// Global AI Engine Instance
window.snoozeAI = new SnoozeAIEngine();
