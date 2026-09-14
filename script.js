/**
 * GEN Z PROPOSAL — The Question Is Waiting ❤️
 * Interactive Romantic Story Engine
 * 
 * Features:
 * - 14-Step Interactive Journey (Curiosity -> Personality Check -> Couple Quiz ->
 *   Heart Catching -> Memory Cards -> Detective Mode -> Fake System Scan ->
 *   Don't Click Button -> Romantic Question -> Secret 3-Lock Message ->
 *   Emotional Build-up -> Suspense Countdown -> The Final Proposal -> Yes Celebration)
 * - Natural Sri Lankan Gen-Z Sinhala conversational voice throughout
 * - Audio Engine: Background music at 50% volume with seamless looping,
 *   autoplay user-gesture recovery, and custom audio file upload support
 * - Dynamic Canvas Particle & Confetti celebration engine
 * - Random Micro-Messages whisper engine
 * - Secret Easter Eggs (3-tap secret + 2-second hold reward)
 * - LocalStorage persistence with Replay Journey support
 */

// 1. GLOBAL CONFIGURATION & STATE
const urlParams = new URLSearchParams(window.location.search);

export const proposalData = {
  receiverName: urlParams.get('to') || 'My Favorite Person',
  senderName: urlParams.get('from') || 'Someone Who Loves You',
  date: urlParams.get('date') || 'Today & Everyday',
  message: urlParams.get('msg') || 'ඔයා මගේ ජීවිතේට ආපු දවසේ ඉඳන් හැමදේම හරිම ලස්සනයි. මේ මුළු journey එකම ඔයා වෙනුවෙන් විතරයි.',
  music: urlParams.get('music') || 'assets/music.mp3',
  photo: urlParams.get('photo') || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
};

export const state = {
  currentChapter: 0,
  heartsCaught: 0,
  easterEggTaps: 0,
  secretLocksUnlocked: [false, false, false],
  soundEnabled: true,
  musicPlaying: false
};

// 2. AUDIO ENGINE & SOUND EFFECTS
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.audio = null;
    this._hasArmedInteraction = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.initAudio();
  }

  initAudio() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.src = proposalData.music;
      this.audio.loop = true;
      this.audio.volume = 0.5; // Strictly 50% volume level
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        state.musicPlaying = true;
        this.updateNavButton();
      });

      this.audio.addEventListener('pause', () => {
        state.musicPlaying = false;
        this.updateNavButton();
      });
    }
  }

  playMusic() {
    if (!state.soundEnabled) return;
    this.initAudio();
    this.audio.volume = 0.5; // Always ensure 50% volume level
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        state.musicPlaying = true;
        this.updateNavButton();
      }).catch((err) => {
        console.log('Autoplay deferred pending user interaction:', err);
        state.musicPlaying = false;
        this.armInteractionAutoplay();
      });
    }
  }

  armInteractionAutoplay() {
    if (this._hasArmedInteraction) return;
    this._hasArmedInteraction = true;
    const trigger = () => {
      if (state.soundEnabled && (!this.audio || this.audio.paused)) {
        this.playMusic();
      }
      window.removeEventListener('click', trigger, true);
      window.removeEventListener('touchstart', trigger, true);
      window.removeEventListener('keydown', trigger, true);
      window.removeEventListener('pointerdown', trigger, true);
    };
    window.addEventListener('click', trigger, true);
    window.addEventListener('touchstart', trigger, true);
    window.addEventListener('keydown', trigger, true);
    window.addEventListener('pointerdown', trigger, true);
  }

  pauseMusic() {
    if (this.audio) {
      this.audio.pause();
    }
    state.musicPlaying = false;
    this.updateNavButton();
  }

  toggleMusic() {
    this.init();
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      this.playMusic();
      showToast('Music Playing (50% Volume) 🎶');
    } else {
      this.pauseMusic();
      showToast('Music Muted 🔇');
    }
    this.updateNavButton();
  }

  updateNavButton() {
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.textContent = (state.soundEnabled && state.musicPlaying) ? '🔊' : '🔇';
    }
  }

  setAudioSource(src) {
    proposalData.music = src;
    if (!this.audio) {
      this.initAudio();
    }
    if (this.audio) {
      this.audio.src = src;
      this.audio.volume = 0.5;
      if (state.soundEnabled) {
        this.playMusic();
      }
    }
  }

  loadCustomAudioFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.setAudioSource(url);
    showToast('ඔබේ Music එක Load වුණා! (50% Volume) 🎵❤️');
  }

  playPop() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playHeartCatch() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  playChime() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playCelebration() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Harmonious victory chords
    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.8);
    });
  }
}

const sounds = new SoundEngine();

// 3. CANVAS PARTICLE ENGINE
class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initBackgroundParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initBackgroundParticles() {
    this.particles = [];
    const count = Math.min(Math.floor(this.width / 24), 28);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.6 + 0.25,
        speedX: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        type: Math.random() > 0.4 ? 'heart' : 'sparkle'
      });
    }
  }

  triggerConfettiExplosion() {
    const colors = ['#ff3377', '#ff6b9d', '#e11d48', '#c084fc', '#fcd34d', '#ffffff'];
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.confetti.push({
        x: this.width / 2,
        y: this.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        gravity: 0.22,
        drag: 0.98,
        isHeart: Math.random() > 0.6
      });
    }
  }

  drawHeart(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(size / 24, size / 24);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = opacity;
    this.ctx.beginPath();
    this.ctx.moveTo(12, 21.5);
    this.ctx.bezierCurveTo(4, 16.5, 0, 12, 0, 7.5);
    this.ctx.bezierCurveTo(0, 3.36, 3.36, 0, 7.5, 0);
    this.ctx.bezierCurveTo(10.15, 0, 11.45, 1.35, 12, 2.5);
    this.ctx.bezierCurveTo(12.55, 1.35, 13.85, 0, 16.5, 0);
    this.ctx.bezierCurveTo(20.64, 0, 24, 3.36, 24, 7.5);
    this.ctx.bezierCurveTo(24, 12, 20, 16.5, 12, 21.5);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Background floating hearts & sparkles
    this.particles.forEach((p) => {
      p.y -= p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * 0.6 + p.speedX;

      if (p.y < -30) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }

      if (p.type === 'heart') {
        this.drawHeart(p.x, p.y, p.size, '#ff3377', p.opacity * 0.6);
      } else {
        this.ctx.fillStyle = '#ff9bc0';
        this.ctx.globalAlpha = p.opacity * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Confetti
    if (this.confetti.length > 0) {
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i];
        c.vx *= c.drag;
        c.vy *= c.drag;
        c.vy += c.gravity;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        c.opacity -= 0.005;

        if (c.opacity <= 0 || c.y > this.height + 50) {
          this.confetti.splice(i, 1);
          continue;
        }

        if (c.isHeart) {
          this.drawHeart(c.x, c.y, c.size, c.color, c.opacity);
        } else {
          this.ctx.save();
          this.ctx.translate(c.x, c.y);
          this.ctx.rotate((c.rotation * Math.PI) / 180);
          this.ctx.fillStyle = c.color;
          this.ctx.globalAlpha = c.opacity;
          this.ctx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.6);
          this.ctx.restore();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

let particleSystem;

// 4. CHAPTER DEFINITIONS & STORY ENGINE
export const chapters = [
  // CHAPTER 0: OPENING — CURIOSITY TRIGGER
  {
    id: 'opening',
    indicator: 'Chapter 01 / 14',
    render: () => `
      <div class="badge-tag">Confidential • For Your Eyes Only 👀</div>
      <h1 class="story-title" style="font-size:1.85rem;">හේයි… 👀</h1>
      
      <div id="opening-phase-1">
        <p class="story-subtitle" style="font-size:1.05rem; line-height:1.75;">
          ඔයා මෙතනට ආවේ නිකන් නෙවෙයි.
          <br/><br/>
          හැබැයි…
          <br/>
          මොකක්ද තියෙන්නේ කියලා දැනගන්න නම්…
          <br/><br/>
          ටිකක් ඉස්සරහට එන්න වෙයි. 😌❤️
        </p>
        <button class="cta-btn" id="btn-opening-see">
          හරි බලමු 👀
        </button>
      </div>

      <div id="opening-phase-2" style="display:none;">
        <p class="story-subtitle" style="font-size:1.05rem; line-height:1.75;">
          හැබැයි පොඩි rule එකක් තියෙනවා… 😏
          <br/><br/>
          හැමදේම එකපාර කියන්නේ නෑ.
          <br/><br/>
          <strong>Deal?</strong>
        </p>
        <div class="dual-buttons">
          <button class="cta-btn" id="btn-opening-deal">
            Deal ❤️
          </button>
          <button class="secondary-btn" id="btn-opening-suspicious">
            මට සැකයි 👀
          </button>
        </div>
        <div id="opening-deal-toast" class="reaction-reveal" style="display:none; margin-top:16px;"></div>
      </div>
    `,
    init: () => {
      const phase1 = document.getElementById('opening-phase-1');
      const phase2 = document.getElementById('opening-phase-2');
      const seeBtn = document.getElementById('btn-opening-see');
      const dealBtn = document.getElementById('btn-opening-deal');
      const suspiciousBtn = document.getElementById('btn-opening-suspicious');
      const toast = document.getElementById('opening-deal-toast');

      seeBtn?.addEventListener('click', () => {
        sounds.playPop();
        sounds.playMusic(); // Start 50% volume music immediately
        if (phase1) phase1.style.display = 'none';
        if (phase2) phase2.style.display = 'block';
      });

      const handleProceed = (isDeal) => {
        sounds.playChime();
        if (toast) {
          toast.style.display = 'block';
          toast.innerHTML = `<p class="reaction-text">${
            isDeal 
              ? "Deal එක deal! 🤝 එකඟ වුණාට thank you. යමු ඉස්සරහට! ✨" 
              : "සැක හිතෙන තරමටම adventure එක ලස්සනයි 👀😂 Let's go!"
          }</p>`;
        }
        setTimeout(() => {
          goToChapter(1);
        }, 1100);
      };

      dealBtn?.addEventListener('click', () => handleProceed(true));
      suspiciousBtn?.addEventListener('click', () => handleProceed(false));
    }
  },

  // CHAPTER 1: FUNNY PERSONALITY CHECK
  {
    id: 'personality-check',
    indicator: 'Chapter 02 / 14',
    render: () => `
      <div class="badge-tag">පළවෙනි ප්‍රශ්නය 😂</div>
      <h2 class="story-title" style="font-size:1.65rem;">
        මගේ message එකක් දැක්කම… 👀
      </h2>
      <p class="story-subtitle">
        ඔයා සාමාන්‍යයෙන් කරන්නේ මොකක්ද? 😌
      </p>

      <div class="options-grid">
        <button class="option-btn" data-key="fast">
          <span class="option-indicator">❤️</span>
          <span>ඉක්මනට reply කරනවා</span>
        </button>
        <button class="option-btn" data-key="seen">
          <span class="option-indicator">😂</span>
          <span>Seen දාලා පස්සේ reply කරනවා</span>
        </button>
        <button class="option-btn" data-key="thrice">
          <span class="option-indicator">👀</span>
          <span>Message එක 3 පාරක් කියවනවා</span>
        </button>
        <button class="option-btn" data-key="attitude">
          <span class="option-indicator">😌</span>
          <span>Reply කරන්න කලින් attitude එකක් දානවා</span>
        </button>
      </div>

      <div id="personality-reveal" style="display:none;"></div>
      <button class="cta-btn" id="btn-personality-next" style="display:none; margin-top:16px;">
        ඉස්සරහට යමු 👀 →
      </button>
    `,
    init: () => {
      const btns = document.querySelectorAll('.option-btn');
      const reveal = document.getElementById('personality-reveal');
      const nextBtn = document.getElementById('btn-personality-next');

      const customPunches = {
        fast: "අනේ cute 🥹 හැබැයි notification එක තත්පර 0.1න් click කරපු බව මම දන්නවා! 😂",
        seen: "Seen දාලා පැය 2ක් හිතනවා නේද මොකක්ද reply එක කියලා? 💀 අහු උනා!",
        thrice: "කියවලා screenshot ගහලා bestie ට යවන්නෙත් නෑ නේද? 🕵️‍♀️ suspicious!",
        attitude: "Attitude දාලා දාලා අන්තිමට 'හා' කියලා reply එක එන්නේ 😂❤️"
      };

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          sounds.playPop();
          btns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          const key = btn.getAttribute('data-key');
          if (reveal && nextBtn) {
            reveal.style.display = 'block';
            reveal.innerHTML = `
              <div class="reaction-reveal">
                <p class="reaction-text">
                  හ්ම්ම්… 🤨<br/>
                  ඔයාගේ answer එක මට බලාපොරොත්තු වුණ එකට ටිකක් වැඩියෙන් honest. 😂❤️
                  <br/><br/>
                  ${customPunches[key] || ''}
                </p>
              </div>
            `;
            nextBtn.style.display = 'inline-flex';
          }
        });
      });

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(2);
      });
    }
  },

  // CHAPTER 2: “HOW WELL DO YOU KNOW ME?” GAME
  {
    id: 'how-well-know-me',
    indicator: 'Chapter 03 / 14',
    render: () => `
      <div class="badge-tag">Couple Quiz 🎮</div>
      <h2 class="story-title" style="font-size:1.6rem;">අපි බලමු…</h2>
      <p class="story-subtitle">
        ඔයා මාව කොච්චර දන්නවද? 👀
      </p>

      <div class="quiz-steps-tracker">
        <span class="quiz-pill-tag" id="quiz-question-tag">Question 1 of 3</span>
        <div class="quiz-dots">
          <div class="quiz-dot active" id="q-dot-1"></div>
          <div class="quiz-dot" id="q-dot-2"></div>
          <div class="quiz-dot" id="q-dot-3"></div>
        </div>
      </div>

      <div id="quiz-card-container">
        <!-- Dynamic Quiz Question Cards rendered here -->
      </div>

      <div id="quiz-feedback-box" style="display:none;"></div>
      <button class="cta-btn" id="btn-quiz-proceed" style="display:none; margin-top:14px;">
        Next Question →
      </button>
    `,
    init: () => {
      const container = document.getElementById('quiz-card-container');
      const feedback = document.getElementById('quiz-feedback-box');
      const proceedBtn = document.getElementById('btn-quiz-proceed');
      const tag = document.getElementById('quiz-question-tag');

      const questions = [
        {
          q: "රෑ 12ට මට එකපාරටම මතක් වෙන්නේ මොකක්ද? 👀",
          options: [
            { text: "නිදාගන්න එක 😴", isHighlight: false },
            { text: "'බඩගිනියි' කියලා මොනවා හරි හොයන එක 🍕", isHighlight: true },
            { text: "ගැඹුරු දාර්ශනික ප්‍රශ්න 😂", isHighlight: false }
          ],
          reply: "ඔව් ඔව්! 😌❤️ ඔයා මාව දන්නවානේ. (කෑම තමයි හැමදේම!)"
        },
        {
          q: "මගේ මූණට එක තත්පරෙන් හිනාවක් ගේන්න පුළුවන් මොකෙන්ද?",
          options: [
            { text: "Cute cat reel එකකින් 🐱", isHighlight: false },
            { text: "ඔයාගේ කටහඬින් හෝ හිනාවෙන් 🥹❤️", isHighlight: true },
            { text: "සල්ලි මිටියකින් 💸", isHighlight: false }
          ],
          reply: "අනිවාර්යයෙන්ම! 🥹❤️ ඔයාගේ හිනාව තරම් මට සතුටක් තවත් නෑ."
        },
        {
          q: "අපේ chats වල වැඩිපුරම දකින්න ලැබෙන්නේ…",
          options: [
            { text: "'කෑවද?' / 'බඩගිනියි' 🍲", isHighlight: false },
            { text: "'අඩෝ සිරාවටම?' 😂", isHighlight: false },
            { text: "'තව ටිකක් කතා කරමු' 🥹❤️", isHighlight: true }
          ],
          reply: "හරියටම හරි! 😂❤️ මේ හැමදේම අපි දෙන්නගේ ලස්සන මතක."
        }
      ];

      let qIdx = 0;

      function renderCurrentQuestion() {
        if (!container) return;
        const cur = questions[qIdx];
        if (tag) tag.textContent = `Question ${qIdx + 1} of 3`;

        // Update dots
        for (let i = 1; i <= 3; i++) {
          const dot = document.getElementById(`q-dot-${i}`);
          if (dot) {
            dot.className = 'quiz-dot';
            if (i < qIdx + 1) dot.classList.add('done');
            if (i === qIdx + 1) dot.classList.add('active');
          }
        }

        if (feedback) feedback.style.display = 'none';
        if (proceedBtn) proceedBtn.style.display = 'none';

        container.innerHTML = `
          <div style="font-weight:700; font-size:1.12rem; margin-bottom:14px; color:#ffffff;">
            ${cur.q}
          </div>
          <div class="options-grid">
            ${cur.options.map((opt, i) => `
              <button class="option-btn quiz-opt-btn" data-idx="${i}">
                <span class="option-indicator">${['A', 'B', 'C'][i]}</span>
                <span>${opt.text}</span>
              </button>
            `).join('')}
          </div>
        `;

        const optBtns = container.querySelectorAll('.quiz-opt-btn');
        optBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            sounds.playPop();
            optBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            if (feedback && proceedBtn) {
              feedback.style.display = 'block';
              feedback.innerHTML = `
                <div class="reaction-reveal">
                  <p class="reaction-text">${cur.reply}</p>
                </div>
              `;
              proceedBtn.style.display = 'inline-flex';
              proceedBtn.textContent = (qIdx < questions.length - 1) ? "Next Question →" : "Score එක බලමු 👀 →";
            }
          });
        });
      }

      proceedBtn?.addEventListener('click', () => {
        sounds.playChime();
        if (qIdx < questions.length - 1) {
          qIdx++;
          renderCurrentQuestion();
        } else {
          // Show quiz conclusion
          if (container && tag) {
            tag.textContent = "QUIZ COMPLETED ✨";
            container.innerHTML = `
              <div class="reaction-reveal" style="text-align:center; padding:22px 14px;">
                <span style="font-size:2.8rem; display:block; margin-bottom:8px;">🏆</span>
                <h3 style="font-size:1.35rem; color:#ff9bc0; margin-bottom:8px;">
                  Score එක perfect නැති උනාට…
                </h3>
                <p style="font-size:1.05rem; line-height:1.7; color:#fff;">
                  ඔයාට bonus points තියෙනවා. ❤️
                  <br/>
                  (මොකද ඔයා තමයි මගේ favorite person 😌)
                </p>
              </div>
            `;
            if (feedback) feedback.style.display = 'none';
            proceedBtn.textContent = "ඊළඟ Challenge එක 🎮 →";
            proceedBtn.onclick = () => {
              sounds.playChime();
              goToChapter(3);
            };
          }
        }
      });

      renderCurrentQuestion();
    }
  },

  // CHAPTER 3: HEART CATCHING GAME
  {
    id: 'catch-hearts',
    indicator: 'Chapter 04 / 14',
    render: () => `
      <div class="badge-tag">Mini Game 🎮</div>
      <h2 class="story-title">දැන් පොඩි වැඩක් තියෙනවා… ❤️</h2>
      <p class="story-subtitle">
        Screen එකේ තියෙන ❤️ 5ක් අල්ලන්න.
        <br/>
        පැනලා යන්න කලින් click කරගන්න බලන්න 😌
      </p>

      <div class="hearts-counter-bar">
        <span>අල්ලපු Hearts:</span>
        <div class="score-pills">
          <div class="score-dot" id="catch-dot-1">1</div>
          <div class="score-dot" id="catch-dot-2">2</div>
          <div class="score-dot" id="catch-dot-3">3</div>
          <div class="score-dot" id="catch-dot-4">4</div>
          <div class="score-dot" id="catch-dot-5">5</div>
        </div>
      </div>

      <div class="game-arena" id="heart-game-arena">
        <!-- Floating moving hearts spawn here -->
      </div>

      <div class="game-live-toast" id="game-toast-msg">
        කොටුව ඇතුළේ heart එක click කරන්න!
      </div>

      <button class="cta-btn" id="btn-chapter-hearts-next" style="display:none; margin-top:12px;">
        මොකක්ද ඒ කිව්වේ? 👀 →
      </button>
    `,
    init: () => {
      state.heartsCaught = 0;
      const arena = document.getElementById('heart-game-arena');
      const toast = document.getElementById('game-toast-msg');
      const nextBtn = document.getElementById('btn-chapter-hearts-next');

      const catchToasts = [
        "Got one! ❤️",
        "තව එකයි 👀",
        "ඔයා මේකට serious වගේ 😂",
        "Almost there… ✨",
        "හරි හරි… ඔයාට heart එකක් අල්ලගන්න පුළුවන්. ඒත්… මගේ heart එක? 👀❤️"
      ];

      function spawnHeart() {
        if (state.heartsCaught >= 5 || !arena) return;
        arena.innerHTML = '';

        const heartEl = document.createElement('div');
        heartEl.className = 'game-target-heart';
        heartEl.textContent = '❤️';

        const maxX = Math.max(arena.clientWidth - 55, 30);
        const maxY = Math.max(arena.clientHeight - 55, 30);
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        heartEl.style.left = `${randomX}px`;
        heartEl.style.top = `${randomY}px`;

        const onHeartTap = (e) => {
          e.preventDefault();
          e.stopPropagation();
          sounds.playHeartCatch();
          state.heartsCaught++;

          const dot = document.getElementById(`catch-dot-${state.heartsCaught}`);
          if (dot) dot.classList.add('filled');

          if (toast) {
            toast.textContent = catchToasts[state.heartsCaught - 1];
          }

          if (state.heartsCaught >= 5) {
            arena.innerHTML = `
              <div style="display:flex;height:100%;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
                <span style="font-size:2.5rem;">🎉</span>
                <span style="font-weight:700;color:#ff9bc0;font-size:1.1rem;">5 Hearts Captured!</span>
              </div>
            `;
            if (nextBtn) nextBtn.style.display = 'inline-flex';
          } else {
            setTimeout(spawnHeart, 220);
          }
        };

        heartEl.addEventListener('click', onHeartTap);
        heartEl.addEventListener('touchstart', onHeartTap, { passive: false });

        arena.appendChild(heartEl);
      }

      spawnHeart();

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(4);
      });
    }
  },

  // CHAPTER 4: MEMORY GAME
  {
    id: 'memory-game',
    indicator: 'Chapter 05 / 14',
    render: () => `
      <div class="badge-tag">Memory Cards 🃏</div>
      <h2 class="story-title" style="font-size:1.65rem;">
        මේ cards වලින් එකක් select කරන්න. 👀
      </h2>
      <p class="story-subtitle">
        හැම card එකක් පිටිපස්සෙම අපේ රහස් මතකයක් හැංගිලා තියෙනවා.
      </p>

      <div class="memory-cards-container">
        <div class="memory-single-card" data-key="first">
          <span class="memory-card-icon">💌</span>
          <span class="memory-card-label">අපේ first conversation ❤️</span>
        </div>
        <div class="memory-single-card" data-key="funny">
          <span class="memory-card-icon">😂</span>
          <span class="memory-card-label">ඒ funny moment එක 😂</span>
        </div>
        <div class="memory-single-card" data-key="special">
          <span class="memory-card-icon">🥹</span>
          <span class="memory-card-label">අමතක කරන්න බැරි දවසක් 🥹</span>
        </div>
        <div class="memory-single-card" data-key="secret">
          <span class="memory-card-icon">🤫</span>
          <span class="memory-card-label">ඔයාට නොකියා හිටපු දෙයක් 👀</span>
        </div>
      </div>

      <div id="memory-story-box" style="display:none;"></div>
      <button class="cta-btn" id="btn-memory-next" style="display:none; margin-top:16px;">
        ඉස්සරහට යමු ✨ →
      </button>
    `,
    init: () => {
      const cards = document.querySelectorAll('.memory-single-card');
      const box = document.getElementById('memory-story-box');
      const nextBtn = document.getElementById('btn-memory-next');

      const memoryStories = {
        first: "මුලින්ම කතා කරපු දවසේ මම හිතුවේ නෑ ඔයා මගේ දවසේ ලස්සනම සහ වැදගත්ම කොටස වෙයි කියලා… ❤️",
        funny: "දවසක් දෙන්නා එකතු වෙලා බඩ රිදෙනකල් හිනාවෙච්ච ඒ වෙලාව… මට තාම මතක් වෙද්දිත් තනියම හිනා යනවා 😂",
        special: "ඔයාව මුලින්ම දැකපු ඒ දවස, ඒ වෙලාවේ මගේ හිත ගැහුණු විදිය තාමත් මට ඊයේ වගේ මතකයි 🥹",
        secret: "ඔයා දන්නේ නැති වුණාට… ඔයා හිනාවෙන හැම වෙලාවෙම මම හොරෙන් ඔයා දිහා බලාගෙන ඉන්නවා 👀❤️"
      };

      cards.forEach(card => {
        card.addEventListener('click', () => {
          sounds.playPop();
          cards.forEach(c => c.classList.remove('revealed'));
          card.classList.add('revealed');

          const key = card.getAttribute('data-key');
          if (box && nextBtn) {
            box.style.display = 'block';
            box.innerHTML = `
              <div class="reaction-reveal">
                <p class="reaction-text" style="font-size:1.02rem; line-height:1.75;">
                  “${memoryStories[key]}”
                </p>
              </div>
            `;
            nextBtn.style.display = 'inline-flex';
          }
        });
      });

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(5);
      });
    }
  },

  // CHAPTER 5: FUNNY “DETECTIVE MODE”
  {
    id: 'detective-mode',
    indicator: 'Chapter 06 / 14',
    render: () => `
      <div class="badge-tag">Detective Mode 🕵️</div>
      <h2 class="story-title" style="font-size:1.6rem;">
        හරි… දැන් ඔයා detective කෙනෙක්. 🕵️😂
      </h2>
      <p class="story-subtitle">
        මේ link එක හදන්න මගේ හේතුව guess කරන්න බලන්න!
      </p>

      <div class="options-grid">
        <button class="option-btn" data-key="prank">
          <span class="option-indicator">😂</span>
          <span>ඔයාට prank එකක් කරන්න</span>
        </button>
        <button class="option-btn" data-key="tell">
          <span class="option-indicator">👀</span>
          <span>මට දෙයක් කියන්න</span>
        </button>
        <button class="option-btn" data-key="special">
          <span class="option-indicator">❤️</span>
          <span>මොකක්හරි special දෙයක්</span>
        </button>
      </div>

      <div id="detective-clue-box" style="display:none;"></div>
      <button class="cta-btn" id="btn-detective-next" style="display:none; margin-top:16px;">
        Clue එක බලමු 👀 →
      </button>
    `,
    init: () => {
      const btns = document.querySelectorAll('.option-btn');
      const box = document.getElementById('detective-clue-box');
      const nextBtn = document.getElementById('btn-detective-next');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          sounds.playPop();
          btns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          if (box && nextBtn) {
            box.style.display = 'block';
            box.innerHTML = `
              <div class="reaction-reveal">
                <p class="reaction-text" style="font-size:1.05rem; line-height:1.7;">
                  Interesting… 👀
                  <br/><br/>
                  ඔයාට clue එකක් දෙන්නම්.
                  <br/>
                  <strong>ඔයා හිතනවට වඩා ඔයා මේකට close.</strong>
                </p>
              </div>
            `;
            nextBtn.style.display = 'inline-flex';
          }
        });
      });

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(6);
      });
    }
  },

  // CHAPTER 6: FAKE SYSTEM SCAN
  {
    id: 'system-scan',
    indicator: 'Chapter 07 / 14',
    render: () => `
      <div class="badge-tag">Curiosity Engine 🤖</div>
      <h2 class="story-title">System Diagnostic</h2>
      <p class="story-subtitle">
        Checking feelings algorithm… මොහොතක් රැඳී සිටින්න.
      </p>

      <div class="system-check-box">
        <div class="diagnostic-text">
          <span id="scan-status-text">INITIALIZING...</span>
          <span id="scan-pct-text">0%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar-fill" id="scan-bar-fill"></div>
        </div>
        <div class="terminal-log" id="scan-terminal-log">
          &gt; Loading memory cache...<br/>
          &gt; Scanning emotional radar...
        </div>
        <div id="scan-error-output" style="display:none;"></div>
      </div>

      <button class="cta-btn" id="btn-scan-continue" style="display:none; margin-top:14px;">
        Continue Manually 😭❤️ →
      </button>
    `,
    init: () => {
      const bar = document.getElementById('scan-bar-fill');
      const pct = document.getElementById('scan-pct-text');
      const status = document.getElementById('scan-status-text');
      const log = document.getElementById('scan-terminal-log');
      const errBox = document.getElementById('scan-error-output');
      const nextBtn = document.getElementById('btn-scan-continue');

      const scanSteps = [
        { p: 10, s: "Checking memories…", l: "> Memories indexed: 100% pure joy." },
        { p: 28, s: "Analyzing answers…", l: "> Sweetness factor: Extremely high." },
        { p: 47, s: "Checking heart status…", l: "> Heartbeat sync: Rapid acceleration." },
        { p: 69, s: "Calculating feelings…", l: "> Affection parameters: Infinite." },
        { p: 84, s: "Measuring mutual attraction…", l: "> Connection strength: OFF THE CHARTS." },
        { p: 99, s: "Almost complete…", l: "> OVERLOAD WARNING: Threshold exceeded..." }
      ];

      let step = 0;
      function runStep() {
        if (step < scanSteps.length) {
          const current = scanSteps[step];
          if (bar) bar.style.width = `${current.p}%`;
          if (pct) pct.textContent = `${current.p}%`;
          if (status) status.textContent = current.s;
          if (log) log.innerHTML += `<br/>${current.l}`;
          sounds.playPop();
          step++;
          setTimeout(runStep, 680);
        } else {
          // Abrupt Halt & Error
          setTimeout(() => {
            sounds.playHeartCatch();
            if (status) status.textContent = "ERROR ⚠️";
            if (errBox) {
              errBox.style.display = 'block';
              errBox.innerHTML = `
                <div class="glitch-alert" style="margin-top:14px;">
                  <strong style="color:#ef4444; font-size:1.1rem; display:block; margin-bottom:6px;">
                    ERROR ⚠️
                  </strong>
                  Too much love detected. ❤️😂
                  <br/><br/>
                  <span style="font-size:0.95rem; color:#ffe6f0;">
                    System එකට මේක handle කරන්න බෑ.
                    <br/>
                    අපි manually continue කරමු. 😭❤️
                  </span>
                </div>
              `;
            }
            if (nextBtn) nextBtn.style.display = 'inline-flex';
          }, 700);
        }
      }

      setTimeout(runStep, 350);

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(7);
      });
    }
  },

  // CHAPTER 7: “DON'T CLICK” BUTTON
  {
    id: 'dont-click',
    indicator: 'Chapter 08 / 14',
    render: () => `
      <div class="badge-tag" style="border-color:#ef4444; color:#fca5a5;">Forbidden Button 🚫</div>
      <h2 class="story-title" style="font-size:1.75rem;">පොඩි Warning එකක්! ⚠️</h2>
      <p class="story-subtitle">
        මේ button එක press කරන්න එපා. 👀
        <br/>
        (ඇත්තමයි කිව්වේ!)
      </p>

      <button class="dont-click-btn" id="btn-forbidden">
        <span>🚫</span>
        <span>DON’T CLICK</span>
      </button>

      <div id="forbidden-reaction" style="display:none;"></div>
      <button class="cta-btn" id="btn-dont-click-next" style="display:none; margin-top:14px;">
        හරි හරි දැන් කියන්නකෝ 😌 →
      </button>
    `,
    init: () => {
      const forbidBtn = document.getElementById('btn-forbidden');
      const reaction = document.getElementById('forbidden-reaction');
      const nextBtn = document.getElementById('btn-dont-click-next');

      forbidBtn?.addEventListener('click', () => {
        sounds.playHeartCatch();
        forbidBtn.style.animation = 'none';
        forbidBtn.style.opacity = '0.7';

        if (reaction && nextBtn) {
          reaction.style.display = 'block';
          reaction.innerHTML = `
            <div class="reaction-reveal">
              <p class="reaction-text" style="font-size:1.05rem; line-height:1.75;">
                මම කිව්වනේ press කරන්න එපා කියලා. 😭😂
                <br/><br/>
                හරි…
                <br/>
                ඔයා curious කෙනෙක් කියලා දැන් officially confirm. 👀❤️
              </p>
            </div>
          `;
          nextBtn.style.display = 'inline-flex';
        }
      });

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(8);
      });
    }
  },

  // CHAPTER 8: ROMANTIC QUESTION (Emotional shift)
  {
    id: 'romantic-question',
    indicator: 'Chapter 09 / 14',
    render: () => `
      <div class="badge-tag">Heart To Heart 🌙</div>
      <h2 class="story-title" style="font-size:1.65rem; font-family:var(--font-serif);">
        දැන් serious question එකක්… 🥹
      </h2>
      <p class="story-subtitle" style="font-size:1.05rem; line-height:1.75;">
        කෙනෙක් අපේ ජීවිතේට ඇවිත්
        පොඩි පොඩි දේවල් පවා
        special කරලා දෙනවා නම්…
        <br/><br/>
        <strong>ඒ කෙනා කොච්චර වැදගත්ද? ❤️</strong>
      </p>

      <div class="options-grid">
        <button class="option-btn" data-key="world">
          <span class="option-indicator">❤️</span>
          <span>මුළු ලෝකෙටම වඩා වැදගත්</span>
        </button>
        <button class="option-btn" data-key="gift">
          <span class="option-indicator">✨</span>
          <span>ජීවිතේට ලැබුණු ලස්සනම තෑග්ගක්</span>
        </button>
        <button class="option-btn" data-key="words">
          <span class="option-indicator">🥹</span>
          <span>වචන වලින් විස්තර කරන්න බැරි තරම්</span>
        </button>
      </div>

      <div id="romantic-answer-reveal" style="display:none;"></div>
      <button class="cta-btn" id="btn-romantic-next" style="display:none; margin-top:16px;">
        මොකක්ද ඒ? 🥹 →
      </button>
    `,
    init: () => {
      // Soften ambient glow for deeper romantic atmosphere
      const ambient = document.querySelector('.ambient-background');
      if (ambient) ambient.style.opacity = '0.35';

      const btns = document.querySelectorAll('.option-btn');
      const reveal = document.getElementById('romantic-answer-reveal');
      const nextBtn = document.getElementById('btn-romantic-next');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          sounds.playPop();
          btns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          if (reveal && nextBtn) {
            reveal.style.display = 'block';
            reveal.innerHTML = `
              <div class="reaction-reveal">
                <p class="reaction-text" style="font-size:1.08rem; line-height:1.8;">
                  හ්ම්ම්… 🥹
                  <br/><br/>
                  මටත් ඒ ගැන ටිකක් දෙයක් කියන්න තියෙනවා.
                </p>
              </div>
            `;
            nextBtn.style.display = 'inline-flex';
          }
        });
      });

      nextBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(9);
      });
    }
  },

  // CHAPTER 9: SECRET MESSAGE (3 Locks)
  {
    id: 'secret-message',
    indicator: 'Chapter 10 / 14',
    render: () => `
      <div class="badge-tag">Secret Vault 🔒</div>
      <h2 class="story-title" style="font-size:1.75rem;">🔒 SECRET MESSAGE</h2>
      <p class="story-subtitle">
        මේක unlock කරන්න hearts 3ක් tap කරන්න.
      </p>

      <div class="secret-locks-row">
        <div class="lock-box" id="lock-0" data-idx="0">🔒</div>
        <div class="lock-box" id="lock-1" data-idx="1">🔒</div>
        <div class="lock-box" id="lock-2" data-idx="2">🔒</div>
      </div>

      <div id="locks-toast" class="game-live-toast">
        Locks 3ම tap කරන්න!
      </div>

      <div id="secret-unlocked-reveal" style="display:none; margin-top:16px;">
        <div class="reaction-reveal">
          <p class="reaction-text" style="font-size:1.05rem; line-height:1.75;">
            ඔයා මේක unlock කළා…
            <br/><br/>
            ඒත් ඇතුළේ තියෙන දේ දැන්ම බලන්න බෑ. 😌
          </p>
        </div>
        <button class="cta-btn" id="btn-why-secret" style="margin-top:14px;">
          WHY? 👀
        </button>
      </div>

      <div id="secret-step-reveal" style="display:none; margin-top:16px;">
        <div class="reaction-reveal">
          <p class="reaction-text" style="font-size:1.05rem; line-height:1.75;">
            මොකද…
            <br/><br/>
            <strong>තව එක step තියෙනවා.</strong>
          </p>
        </div>
        <button class="cta-btn" id="btn-secret-proceed" style="margin-top:14px;">
          හරි, මොකක්ද ඒ step එක? 👀 →
        </button>
      </div>
    `,
    init: () => {
      state.secretLocksUnlocked = [false, false, false];
      const locks = document.querySelectorAll('.lock-box');
      const toast = document.getElementById('locks-toast');
      const unlockReveal = document.getElementById('secret-unlocked-reveal');
      const whyBtn = document.getElementById('btn-why-secret');
      const stepReveal = document.getElementById('secret-step-reveal');
      const proceedBtn = document.getElementById('btn-secret-proceed');

      locks.forEach(lock => {
        lock.addEventListener('click', () => {
          const idx = parseInt(lock.getAttribute('data-idx') || '0', 10);
          if (!state.secretLocksUnlocked[idx]) {
            sounds.playHeartCatch();
            state.secretLocksUnlocked[idx] = true;
            lock.textContent = '❤️';
            lock.classList.add('unlocked');

            const unlockedCount = state.secretLocksUnlocked.filter(Boolean).length;
            if (toast) {
              toast.textContent = `${unlockedCount} / 3 Locks Unlocked! ✨`;
            }

            if (unlockedCount === 3) {
              if (toast) toast.style.display = 'none';
              if (unlockReveal) unlockReveal.style.display = 'block';
            }
          }
        });
      });

      whyBtn?.addEventListener('click', () => {
        sounds.playPop();
        if (unlockReveal) unlockReveal.style.display = 'none';
        if (stepReveal) stepReveal.style.display = 'block';
      });

      proceedBtn?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(10);
      });
    }
  },

  // CHAPTER 10: EMOTIONAL BUILD-UP
  {
    id: 'emotional-buildup',
    indicator: 'Chapter 11 / 14',
    render: () => `
      <div class="badge-tag">One Last Thing 💌</div>
      <h2 class="story-title" style="font-family:var(--font-serif); font-size:1.8rem;">
        මේ හැමදේටම හේතුවක් තිබුණා… 🥹
      </h2>

      <div class="reaction-reveal" style="text-align:left; padding:22px 18px; margin:20px 0;">
        <p style="font-size:1.05rem; line-height:1.85; color:#ffffff;">
          මේකේ මුල ඉඳන් ඔයාට හිතෙන්න ඇති…
          <br/>
          <em>‘මේක මොකටද?’</em> කියලා.
          <br/><br/>
          ඒ හැම question එකක්ම…
          <br/>
          හැම game එකක්ම…
          <br/>
          හැම silly moment එකක්ම…
          <br/><br/>
          <strong>හේතුවක් තිබුණා. ❤️</strong>
          <br/><br/>
          දැන්…
          <br/>
          අන්තිම chapter එක.
        </p>
      </div>

      <button class="cta-btn pulse-yes-btn" id="btn-buildup-next">
        Next… 🥹❤️ →
      </button>
    `,
    init: () => {
      document.getElementById('btn-buildup-next')?.addEventListener('click', () => {
        sounds.playChime();
        goToChapter(11);
      });
    }
  },

  // CHAPTER 11: FINAL SUSPENSE & COUNTDOWN
  {
    id: 'final-suspense',
    indicator: 'Chapter 12 / 14',
    render: () => `
      <div class="badge-tag">Are You Ready? ⏳</div>
      <h2 class="story-title" style="font-size:1.75rem;">Before I ask…</h2>
      
      <div class="countdown-box" id="countdown-wrapper">
        <div class="countdown-num" id="countdown-number">3</div>
      </div>

      <div id="ready-question-box" style="display:none; text-align:center;">
        <p style="font-size:1.35rem; font-weight:700; color:#fff; margin-bottom:18px;">
          ඔයා ready ද? 🥹
        </p>
        <button class="cta-btn pulse-yes-btn" id="btn-ready-yes">
          YES ❤️
        </button>
      </div>
    `,
    init: () => {
      const numEl = document.getElementById('countdown-number');
      const box = document.getElementById('ready-question-box');
      const yesBtn = document.getElementById('btn-ready-yes');

      let count = 3;
      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          sounds.playPop();
          if (numEl) numEl.textContent = count.toString();
        } else {
          clearInterval(timer);
          sounds.playHeartCatch();
          if (numEl) numEl.textContent = '❤️';
          setTimeout(() => {
            if (box) box.style.display = 'block';
          }, 500);
        }
      }, 1100);

      yesBtn?.addEventListener('click', () => {
        sounds.playChime();
        // Screen brief fade
        const container = document.getElementById('story-container');
        if (container) {
          container.style.opacity = '0';
          setTimeout(() => {
            goToChapter(12);
          }, 350);
        } else {
          goToChapter(12);
        }
      });
    }
  },

  // CHAPTER 12: THE FINAL PROPOSAL
  {
    id: 'the-proposal',
    indicator: 'The Climax ❤️',
    render: () => `
      <div class="badge-tag" style="background:rgba(255,51,119,0.2); border-color:var(--primary-pink);">
        THE QUESTION ❤️
      </div>

      <div class="proposal-text-block">
        <h2 class="story-title reveal-line line-delay-1" style="font-size:1.95rem; margin-bottom:18px;">
          <span class="highlight-name">${escapeHtml(proposalData.receiverName)}</span> ❤️
        </h2>

        <p class="story-subtitle reveal-line line-delay-2" style="font-size:1.06rem; line-height:1.8; color:#ffffff;">
          මට ඔයාට කියන්න ගොඩක් කාලයක් තිස්සේ හිතේ තිබුණු දෙයක් තියෙනවා…
          <br/><br/>
          මේ link එකේ තියෙන හැම දෙයක්ම…
          <br/>
          <strong>එකම කෙනෙක් වෙනුවෙන්.</strong>
        </p>

        <p class="story-subtitle reveal-line line-delay-3" style="font-size:1.06rem; line-height:1.8; color:#ffffff;">
          ඔයා එක්ක හිනා වෙන්න,
          පොඩි පොඩි දේවල් වලට සතුටු වෙන්න,
          මතක හදාගන්න…
          <br/>
          මට තව ගොඩක් දේවල් ඔයා එක්ක කරන්න ඕන.
          <br/><br/>
          ඉතින්… මට එක ප්‍රශ්නයක් තියෙනවා. ❤️
        </p>

        <div class="proposal-question-highlight reveal-line line-delay-4" style="margin-top:20px;">
          <div style="font-size:1.25rem; font-weight:700; line-height:1.6; font-family:var(--font-serif); color:#ffe6f0;">
            ඔයා…
            <br/>
            මගේ ආදර කතාවේ ඊළඟ chapter එකත්
            <br/>
            මාත් එක්ක ලියන්න කැමතිද? 🥹❤️
          </div>
          <div style="font-size:1.15rem; font-weight:600; margin-top:8px; opacity:0.9; font-family:var(--font-sans); color:#ff9bc0;">
            Will you be mine?
          </div>
        </div>
      </div>

      <div class="dual-buttons" style="margin-top:20px;">
        <button class="cta-btn pulse-yes-btn" id="btn-final-yes">
          YES ❤️
        </button>
        <button class="secondary-btn" id="btn-final-think">
          LET ME THINK 🥹
        </button>
      </div>
    `,
    init: () => {
      // Restore container opacity
      const container = document.getElementById('story-container');
      if (container) container.style.opacity = '1';

      document.getElementById('btn-final-yes')?.addEventListener('click', () => {
        triggerYesCelebration();
      });

      document.getElementById('btn-final-think')?.addEventListener('click', () => {
        sounds.playPop();
        openModal('modal-let-me-think');
      });
    }
  },

  // CHAPTER 13: YES CELEBRATION & FOREVER KEEPSAKE
  {
    id: 'celebration',
    indicator: 'Forever & Always ✨',
    render: () => `
      <div class="badge-tag">Forever & Always ✨</div>
      <h1 class="story-title" style="font-size:2rem; color:#ff9bc0; margin-bottom:10px;">
        WAIT… 😭❤️ ඒක YES ද?!
      </h1>
      <p class="story-subtitle" style="margin-bottom:18px; font-size:1.1rem; color:#ffffff;">
        Chapter unlocked: <strong>US ❤️</strong>
      </p>

      <!-- Digital Keepsake Card -->
      <div class="keepsake-card" id="keepsake-export-card">
        <div class="keepsake-photo-frame" style="background-image: url('${escapeHtml(proposalData.photo)}');">
        </div>
        <div class="keepsake-content">
          <div class="keepsake-names">
            ${escapeHtml(proposalData.senderName)} ❤️ ${escapeHtml(proposalData.receiverName)}
          </div>
          <div class="keepsake-date">
            📅 ${escapeHtml(proposalData.date)}
          </div>
          <div class="keepsake-msg">
            “මේක අපේ next chapter එකේ පළවෙනි page එක විතරයි. ✨”
            <br/><br/>
            ${escapeHtml(proposalData.message)}
          </div>
          <div class="card-branding">
            <span>Made with ❤️</span>
            <span>Gen Z Proposal</span>
          </div>
        </div>
      </div>

      <div class="dual-buttons" style="margin-top:14px;">
        <button class="cta-btn" id="btn-copy-proposal-link">
          🔗 Link එක Copy කරන්න
        </button>
        <button class="whatsapp-share-btn" id="btn-whatsapp-share">
          💬 WhatsApp Share කරන්න
        </button>
        <button class="secondary-btn" id="btn-replay-journey">
          🔄 Replay Journey (මුල සිට)
        </button>
      </div>
    `,
    init: () => {
      document.getElementById('btn-copy-proposal-link')?.addEventListener('click', copyShareableLink);
      document.getElementById('btn-whatsapp-share')?.addEventListener('click', shareOnWhatsApp);
      document.getElementById('btn-replay-journey')?.addEventListener('click', replayJourney);
    }
  }
];

// 5. NAVIGATION & RENDER FUNCTIONS
export function renderChapter(index) {
  const container = document.getElementById('story-container');
  const indicator = document.getElementById('progress-indicator-text');
  if (!container) return;

  // Clamp
  if (index < 0) index = 0;
  if (index >= chapters.length) index = chapters.length - 1;
  state.currentChapter = index;

  // Save progress to LocalStorage
  try {
    localStorage.setItem('genz_proposal_chapter', index.toString());
  } catch {
    // LocalStorage fallback
  }

  const chapter = chapters[index];
  if (indicator) {
    indicator.textContent = chapter.indicator;
  }

  // Cinematic Exit and Enter
  container.classList.remove('view-enter');
  container.classList.add('view-exit');

  setTimeout(() => {
    container.innerHTML = chapter.render();
    container.classList.remove('view-exit');
    container.classList.add('view-enter');

    // Run chapter script initialization
    if (typeof chapter.init === 'function') {
      chapter.init();
    }
  }, 220);
}

export function goToChapter(index) {
  renderChapter(index);
}

export function replayJourney() {
  sounds.playPop();
  try {
    localStorage.removeItem('genz_proposal_chapter');
  } catch {}
  state.heartsCaught = 0;
  state.secretLocksUnlocked = [false, false, false];
  goToChapter(0);
  showToast('ආයෙත් මුල ඉඳන් පටන් ගමු! ✨');
}

// 6. CELEBRATION TRIGGER
export function triggerYesCelebration() {
  sounds.playCelebration();
  if (particleSystem) {
    particleSystem.triggerConfettiExplosion();
    setTimeout(() => particleSystem.triggerConfettiExplosion(), 800);
    setTimeout(() => particleSystem.triggerConfettiExplosion(), 1600);
  }

  // Restore ambient background brilliance
  const ambient = document.querySelector('.ambient-background');
  if (ambient) ambient.style.opacity = '0.6';

  goToChapter(13); // Final celebration chapter
  showToast('🎉 CONGRATULATIONS! ❤️');
}

// 7. MODALS, EASTER EGGS & MICRO-MESSAGES
export function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function setupEasterEgg() {
  const heart = document.getElementById('easter-egg-btn');
  if (!heart) return;

  let pressTimer = null;

  // 1. Triple-tap easter egg
  heart.addEventListener('click', () => {
    sounds.playPop();
    state.easterEggTaps++;

    if (state.easterEggTaps === 3) {
      sounds.playHeartCatch();
      const text = document.getElementById('easter-egg-text');
      if (text) {
        text.textContent = "“අද ඔයාට කවුරුත් කිව්වෙ නැත්නම් මම කියන්නම්: ඔයා ඔය phone screen එක දිහා බලාගෙන ඉද්දි හරිම cute අනේ. 🥹❤️”";
      }
      openModal('modal-easter-egg');
      state.easterEggTaps = 0;
    }
  });

  // 2. Hold heart for 2 seconds easter egg
  const startPress = () => {
    pressTimer = setTimeout(() => {
      sounds.playHeartCatch();
      const text = document.getElementById('easter-egg-text');
      if (text) {
        text.textContent = "“ඔයා patience තියෙන කෙනෙක්. 😂❤️ ඔයාට ආදරෙයි!”";
      }
      openModal('modal-easter-egg');
    }, 2000);
  };

  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  heart.addEventListener('mousedown', startPress);
  heart.addEventListener('touchstart', startPress, { passive: true });
  heart.addEventListener('mouseup', cancelPress);
  heart.addEventListener('mouseleave', cancelPress);
  heart.addEventListener('touchend', cancelPress);
}

// Random Micro-Messages Whisper Engine
function setupMicroMessagesEngine() {
  const whisperPill = document.getElementById('micro-whisper');
  if (!whisperPill) return;

  const whispers = [
    "Psst… 👀",
    "ඔයා තාමත් මෙතනද? 😂",
    "ඔයාට දැන් සැකයි නේද?",
    "Don't worry… we're getting there. ❤️",
    "Almost… 👀",
    "මේක screenshot කරගන්න හිතෙනවා නේද? 😂",
    "Okay… enough teasing. 😌"
  ];

  let whisperIdx = 0;

  function triggerNextWhisper() {
    // Only show if not on celebration screen
    if (state.currentChapter < 13) {
      const msg = whispers[whisperIdx % whispers.length];
      whisperIdx++;
      whisperPill.textContent = msg;
      whisperPill.classList.add('show');

      setTimeout(() => {
        whisperPill.classList.remove('show');
      }, 3500);
    }

    // Schedule next organically between 22 to 34 seconds
    const nextInterval = Math.floor(Math.random() * 12000) + 22000;
    setTimeout(triggerNextWhisper, nextInterval);
  }

  setTimeout(triggerNextWhisper, 18000);
}

export function showToast(message) {
  const toast = document.getElementById('floating-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

export function copyShareableLink() {
  sounds.playPop();
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    to: proposalData.receiverName,
    from: proposalData.senderName,
    date: proposalData.date,
    msg: proposalData.message
  });
  const fullUrl = `${base}?${params.toString()}`;

  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('Link එක copy කරගත්තා! 📋❤️');
  }).catch(() => {
    showToast('Proposal URL ready! 💌');
  });
}

export function shareOnWhatsApp() {
  sounds.playPop();
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    to: proposalData.receiverName,
    from: proposalData.senderName,
    date: proposalData.date,
    msg: proposalData.message
  });
  const fullUrl = `${base}?${params.toString()}`;
  const text = encodeURIComponent(`හේයි… 👀 ඔයා වෙනුවෙන්ම හදපු ලස්සන mystery journey එකක් තියෙනවා. මෙතනින් බලන්න: ${fullUrl}`);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// 8. PERSONALIZATION MODAL HANDLING
function setupSettingsModal() {
  const openBtn = document.getElementById('settings-btn');
  const closeBtn = document.getElementById('close-settings-btn');
  const saveBtn = document.getElementById('save-settings-btn');
  const restartBtn = document.getElementById('restart-settings-btn');

  const inputTo = document.getElementById('input-to');
  const inputFrom = document.getElementById('input-from');
  const inputDate = document.getElementById('input-date');
  const inputMsg = document.getElementById('input-msg');
  const inputMusic = document.getElementById('input-music-file');

  inputMusic?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.loadCustomAudioFile(file);
    }
  });

  openBtn?.addEventListener('click', () => {
    sounds.playPop();
    if (inputTo) inputTo.value = proposalData.receiverName;
    if (inputFrom) inputFrom.value = proposalData.senderName;
    if (inputDate) inputDate.value = proposalData.date;
    if (inputMsg) inputMsg.value = proposalData.message;
    openModal('modal-settings');
  });

  closeBtn?.addEventListener('click', () => {
    sounds.playPop();
    closeModal('modal-settings');
  });

  restartBtn?.addEventListener('click', () => {
    closeModal('modal-settings');
    replayJourney();
  });

  saveBtn?.addEventListener('click', () => {
    sounds.playChime();
    if (inputTo && inputTo.value.trim()) proposalData.receiverName = inputTo.value.trim();
    if (inputFrom && inputFrom.value.trim()) proposalData.senderName = inputFrom.value.trim();
    if (inputDate && inputDate.value.trim()) proposalData.date = inputDate.value.trim();
    if (inputMsg && inputMsg.value.trim()) proposalData.message = inputMsg.value.trim();

    closeModal('modal-settings');
    renderChapter(state.currentChapter);
    showToast('නම් සහ විස්තර save වුණා! ❤️');
  });
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 9. APP BOOTSTRAP
window.addEventListener('DOMContentLoaded', () => {
  particleSystem = new ParticleCanvas('particle-canvas');
  setupEasterEgg();
  setupSettingsModal();
  setupMicroMessagesEngine();

  // Top nav sound toggle
  document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
    sounds.toggleMusic();
  });

  // Modal close handlers
  document.getElementById('close-easter-egg')?.addEventListener('click', () => {
    sounds.playPop();
    closeModal('modal-easter-egg');
  });

  document.getElementById('btn-think-return')?.addEventListener('click', () => {
    sounds.playChime();
    closeModal('modal-let-me-think');
  });

  // Resume saved chapter if available
  let initialChapter = 0;
  try {
    const saved = localStorage.getItem('genz_proposal_chapter');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < chapters.length) {
        initialChapter = parsed;
      }
    }
  } catch {}

  renderChapter(initialChapter);

  // Auto-play background music at 50% volume (with graceful user-gesture fallback)
  sounds.playMusic();
});
