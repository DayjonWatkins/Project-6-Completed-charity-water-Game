/**
 * charity: water Drop Game — Pure Vanilla JavaScript
 * Zero external dependencies. Designed for direct GitHub Pages deployment.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const DIFFICULTY_CONFIGS = {
    easy: {
      id: 'easy',
      label: 'Easy',
      subtitle: 'Gentle Rain',
      targetScore: 15,
      duration: 40,
      fallDuration: 4.6,
      spawnInterval: 1100,
      badDropRate: 0.15,
      canSpawnRate: 0.08,
    },
    normal: {
      id: 'normal',
      label: 'Normal',
      subtitle: 'Community Well',
      targetScore: 20,
      duration: 30,
      fallDuration: 3.4,
      spawnInterval: 900,
      badDropRate: 0.25,
      canSpawnRate: 0.12,
    },
    hard: {
      id: 'hard',
      label: 'Hard',
      subtitle: 'Monsoon Rush',
      targetScore: 25,
      duration: 22,
      fallDuration: 2.3,
      spawnInterval: 680,
      badDropRate: 0.35,
      canSpawnRate: 0.16,
    },
  };

  const WINNING_MESSAGES = [
    'You made a splash! Every drop counts.',
    'Brilliant catch! Clean water for communities.',
    'Water champion! You reached the goal.',
    'Incredible! You filled the clean water reservoir.',
  ];

  const LOSING_MESSAGES = [
    'Good effort! Try again and beat {GOAL} drops.',
    'Every drop matters. Give it another splash!',
    'The next round is yours. Try again!',
    'So close! Jump back in and fill the reservoir.',
  ];

  // --- Safe Local Storage Wrapper ---
  const storage = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // Ignore storage quotas / disabled states
      }
    },
  };

  // --- Web Audio API Sound Synthesizer ---
  let audioCtx = null;

  function getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playGoodDropSound(enabled) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      const baseFreq = 620 + Math.random() * 150;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  function playCanCollectSound(enabled) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C E G C arpeggio
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.18, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    } catch (e) {}
  }

  function playBadDropSound(enabled) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  function playVictorySound(enabled) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A major
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.16, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch (e) {}
  }

  function playLoseSound(enabled) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [440, 392, 349.23];
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    } catch (e) {}
  }

  // --- SVG Icons ---
  const SVGS = {
    volumeOn: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`,
    volumeOff: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
    sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ffc907" stroke="currentColor" stroke-width="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    droplet: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2e9df7" stroke="#2e9df7" stroke-width="1.5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
    trophy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc907" stroke="#b45309" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  };

  // --- Game State ---
  let difficulty = 'normal';
  let gameStatus = 'idle'; // 'idle' | 'playing' | 'ended'
  let score = 0;
  let timeRemaining = DIFFICULTY_CONFIGS.normal.duration;
  let soundEnabled = true;

  const highScores = {
    easy: 0,
    normal: 0,
    hard: 0,
  };

  let dropIntervalId = null;
  let timerIntervalId = null;

  // --- DOM Elements ---
  const el = {
    scoreValue: document.getElementById('score-value'),
    scoreBadge: document.getElementById('high-score-badge'),
    timerDisplay: document.getElementById('timer-display'),
    startBtn: document.getElementById('start-btn'),
    soundBtn: document.getElementById('sound-btn'),
    goalIndicator: document.getElementById('goal-indicator'),
    idleOverlay: document.getElementById('idle-overlay'),
    idleStartBtn: document.getElementById('idle-start-btn'),
    idleModeTag: document.getElementById('idle-mode-tag'),
    idleDesc: document.getElementById('idle-desc'),
    gameContainer: document.getElementById('game-container'),
    reservoirWidget: document.getElementById('reservoir-widget'),
    reservoirFill: document.getElementById('reservoir-fill'),
    reservoirBar: document.getElementById('reservoir-bar'),
    reservoirPercent: document.getElementById('reservoir-percent'),
    reservoirCount: document.getElementById('reservoir-count'),
    reservoirGoalBadge: document.getElementById('reservoir-goal-badge'),
    reservoirTank: document.getElementById('reservoir-tank'),
    resultModal: document.getElementById('result-modal'),
    resultTitle: document.getElementById('result-title'),
    resultScore: document.getElementById('result-score'),
    resultMeta: document.getElementById('result-meta'),
    resultBanner: document.getElementById('result-banner'),
    resultSummary: document.getElementById('result-summary'),
    playAgainBtn: document.getElementById('play-again-btn'),
    confettiContainer: document.getElementById('confetti-container'),
    rulesModal: document.getElementById('rules-modal'),
    openRulesBtn: document.getElementById('open-rules-btn'),
    closeRulesBtn: document.getElementById('close-rules-btn'),
    rulesDoneBtn: document.getElementById('rules-done-btn'),
    diffButtons: document.querySelectorAll('.diff-btn'),
  };

  // --- Initialize Storage ---
  function initStorage() {
    const savedDiff = storage.getItem('cw_difficulty');
    if (savedDiff && DIFFICULTY_CONFIGS[savedDiff]) {
      difficulty = savedDiff;
    }

    ['easy', 'normal', 'hard'].forEach((diffKey) => {
      const saved = storage.getItem(`cw_high_score_${diffKey}`);
      if (saved) highScores[diffKey] = parseInt(saved, 10) || 0;
    });

    const legacy = storage.getItem('cw_high_score');
    if (legacy && !highScores.normal) {
      highScores.normal = parseInt(legacy, 10) || 0;
    }

    const savedSound = storage.getItem('cw_sound_enabled');
    if (savedSound !== null) {
      soundEnabled = savedSound === 'true';
    }
  }

  // --- Render / Update UI ---
  function updateUI() {
    const config = DIFFICULTY_CONFIGS[difficulty];

    // Difficulty buttons
    el.diffButtons.forEach((btn) => {
      const isSelected = btn.dataset.diff === difficulty;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      btn.disabled = gameStatus === 'playing';
    });

    // Score display
    el.scoreValue.textContent = score;

    // High score badge
    const curHighScore = highScores[difficulty] || 0;
    if (curHighScore > 0) {
      el.scoreBadge.style.display = 'inline-flex';
      el.scoreBadge.innerHTML = `${SVGS.trophy} Best: ${curHighScore}`;
    } else {
      el.scoreBadge.style.display = 'none';
    }

    // Reservoir widget
    const percentage = Math.min(100, Math.round((score / config.targetScore) * 100));
    const isGoalReached = score >= config.targetScore;

    el.reservoirFill.style.height = `${percentage}%`;
    el.reservoirBar.style.width = `${percentage}%`;
    el.reservoirPercent.textContent = `${percentage}%`;
    el.reservoirCount.textContent = `${score} / ${config.targetScore} drops`;

    if (isGoalReached) {
      el.reservoirWidget.classList.add('goal-reached');
      el.reservoirBar.style.backgroundColor = 'var(--cw-yellow)';
      el.reservoirGoalBadge.style.display = 'inline-flex';
    } else {
      el.reservoirWidget.classList.remove('goal-reached');
      el.reservoirBar.style.backgroundColor = 'var(--cw-blue)';
      el.reservoirGoalBadge.style.display = 'none';
    }

    // Timer display
    el.timerDisplay.textContent = `Time: ${timeRemaining}s`;
    if (gameStatus === 'playing' && timeRemaining <= 5) {
      el.timerDisplay.classList.add('timer-warning');
    } else {
      el.timerDisplay.classList.remove('timer-warning');
    }

    // Start / Action button
    if (gameStatus === 'playing') {
      el.startBtn.textContent = 'Game in Progress';
      el.startBtn.disabled = true;
    } else if (gameStatus === 'ended') {
      el.startBtn.textContent = 'Play Again';
      el.startBtn.disabled = false;
    } else {
      el.startBtn.textContent = 'Start Game';
      el.startBtn.disabled = false;
    }

    // Sound toggle
    el.soundBtn.innerHTML = soundEnabled ? SVGS.volumeOn : SVGS.volumeOff;
    el.soundBtn.classList.toggle('sound-on', soundEnabled);
    el.soundBtn.setAttribute('title', soundEnabled ? 'Mute sound' : 'Enable sound');
    el.soundBtn.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Enable sound');

    // Goal indicator on game field
    el.goalIndicator.innerHTML = `${SVGS.droplet} Goal: ${config.targetScore} drops`;

    // Idle overlay
    if (gameStatus === 'idle') {
      el.idleOverlay.style.display = 'flex';
      el.idleModeTag.textContent = `${config.label} Mode`;
      el.idleDesc.innerHTML = `Catch clean blue drops (+1) and bonus yellow jerry cans (+3). Avoid murky contaminated drops (-1)! Collect at least <strong>${config.targetScore} drops</strong> in <strong>${config.duration}s</strong>.`;
    } else {
      el.idleOverlay.style.display = 'none';
    }
  }

  // --- Difficulty Selection ---
  function setDifficulty(newDiff) {
    if (gameStatus === 'playing') return;
    if (!DIFFICULTY_CONFIGS[newDiff]) return;
    difficulty = newDiff;
    storage.setItem('cw_difficulty', newDiff);
    timeRemaining = DIFFICULTY_CONFIGS[newDiff].duration;
    score = 0;
    updateUI();
  }

  // --- Drop Spawning ---
  function spawnDrop() {
    if (gameStatus !== 'playing') return;

    const config = DIFFICULTY_CONFIGS[difficulty];
    const containerWidth = el.gameContainer.clientWidth || 600;
    const containerHeight = el.gameContainer.clientHeight || 500;

    const isCan = Math.random() < config.canSpawnRate;
    const isBad = !isCan && Math.random() < config.badDropRate;
    const kind = isCan ? 'can' : isBad ? 'bad' : 'good';

    let size = 60;
    if (isCan) {
      size = 54;
    } else {
      const sizeMultiplier = Math.random() * 0.7 + 0.6; // 0.6 to 1.3
      size = Math.round(60 * sizeMultiplier);
    }

    const maxX = Math.max(10, containerWidth - size - 10);
    const xPos = Math.random() * maxX;
    const fallDistance = containerHeight + size + 40;

    const dropEl = document.createElement('div');
    dropEl.setAttribute('role', 'button');
    dropEl.setAttribute('tabindex', '0');
    dropEl.style.left = `${xPos}px`;
    dropEl.style.width = `${size}px`;
    dropEl.style.height = `${size}px`;
    dropEl.style.setProperty('--fall-duration', `${config.fallDuration}s`);
    dropEl.style.setProperty('--fall-distance', `${fallDistance}px`);

    if (kind === 'can') {
      dropEl.className = 'jerry-can-drop';
      dropEl.setAttribute('aria-label', 'Collect yellow jerry can bonus +3');
      dropEl.innerHTML = `
        <div class="can-inner">
          <img src="img/water-can-transparent.png" alt="Jerry Can" class="can-img" draggable="false" />
          <span class="can-bonus-tag">+3</span>
        </div>
      `;
    } else {
      dropEl.className = `water-drop ${isBad ? 'bad-drop' : 'good-drop'}`;
      dropEl.setAttribute('aria-label', isBad ? 'Avoid contaminated water drop' : 'Catch clean water drop');
      dropEl.innerHTML = `<div class="drop-shine"></div>`;
    }

    // Interaction handlers
    let collected = false;
    const collectHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (collected || gameStatus !== 'playing') return;
      collected = true;

      const rect = el.gameContainer.getBoundingClientRect();
      const clickX = e.clientX ? e.clientX - rect.left : xPos + size / 2;
      const clickY = e.clientY ? e.clientY - rect.top : dropEl.offsetTop + size / 2;

      handleCollect(kind, clickX, clickY);
      dropEl.remove();
    };

    dropEl.addEventListener('pointerdown', collectHandler);
    dropEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        collectHandler(e);
      }
    });

    dropEl.addEventListener('animationend', () => {
      if (!collected) {
        dropEl.remove();
      }
    });

    el.gameContainer.appendChild(dropEl);
  }

  // --- Collect Action ---
  function handleCollect(kind, x, y) {
    let pointChange = 1;
    let popupText = '+1';
    let popupKind = 'good';
    let rippleColor = '#2e9df7';

    if (kind === 'can') {
      pointChange = 3;
      popupText = '+3 Can!';
      popupKind = 'can';
      rippleColor = '#ffc907';
      playCanCollectSound(soundEnabled);
    } else if (kind === 'bad') {
      pointChange = -1;
      popupText = '-1';
      popupKind = 'bad';
      rippleColor = '#f5402c';
      playBadDropSound(soundEnabled);
    } else {
      pointChange = 1;
      popupText = '+1';
      popupKind = 'good';
      rippleColor = '#2e9df7';
      playGoodDropSound(soundEnabled);
    }

    score = Math.max(0, score + pointChange);
    updateUI();

    createPopup(popupText, popupKind, x, y);
    createRipple(rippleColor, x, y, kind === 'can' ? 80 : 60);
  }

  // --- Visual Feedback Popups & Ripples ---
  function createPopup(text, kind, x, y) {
    const pop = document.createElement('div');
    pop.className = `score-popup ${kind}`;
    pop.style.left = `${Math.max(20, Math.min(el.gameContainer.clientWidth - 20, x))}px`;
    pop.style.top = `${Math.max(20, Math.min(el.gameContainer.clientHeight - 20, y))}px`;

    if (kind === 'can') {
      pop.innerHTML = `${SVGS.sparkles} <span>${text}</span>`;
    } else {
      pop.textContent = text;
    }

    el.gameContainer.appendChild(pop);
    setTimeout(() => pop.remove(), 850);
  }

  function createRipple(color, x, y, size) {
    const rip = document.createElement('div');
    rip.className = 'ripple-circle';
    rip.style.left = `${x}px`;
    rip.style.top = `${y}px`;
    rip.style.width = `${size}px`;
    rip.style.height = `${size}px`;
    rip.style.border = `3px solid ${color}`;

    el.gameContainer.appendChild(rip);
    setTimeout(() => rip.remove(), 550);
  }

  // --- Confetti Generation ---
  function showConfetti() {
    el.confettiContainer.innerHTML = '';
    const colors = ['#ffc907', '#2e9df7', '#8bd1cb', '#4fcb53', '#ff902a'];
    for (let i = 0; i < 35; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const size = 6 + (i % 6) * 1.5;
      piece.style.left = `${(i * 3) % 100}%`;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 1.2}px`;
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDuration = `${1.6 + ((i * 5) % 10) * 0.1}s`;
      piece.style.animationDelay = `${((i * 3) % 7) * 0.1}s`;
      piece.style.transform = `rotate(${i * 24}deg)`;
      el.confettiContainer.appendChild(piece);
    }
  }

  function clearConfetti() {
    el.confettiContainer.innerHTML = '';
  }

  // --- Game Lifecycle ---
  function startGame() {
    if (gameStatus === 'playing') return;

    // Clear falling elements
    const existingDrops = el.gameContainer.querySelectorAll('.water-drop, .jerry-can-drop');
    existingDrops.forEach((d) => d.remove());

    const config = DIFFICULTY_CONFIGS[difficulty];
    gameStatus = 'playing';
    score = 0;
    timeRemaining = config.duration;

    hideResultModal();
    updateUI();

    // Initial drops
    spawnDrop();

    // Spawner loop
    dropIntervalId = setInterval(spawnDrop, config.spawnInterval);

    // Timer loop
    timerIntervalId = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        endGame();
      } else {
        updateUI();
      }
    }, 1000);
  }

  function endGame() {
    if (gameStatus !== 'playing') return;
    gameStatus = 'ended';

    if (dropIntervalId) {
      clearInterval(dropIntervalId);
      dropIntervalId = null;
    }
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }

    // Clean up active falling drops
    const drops = el.gameContainer.querySelectorAll('.water-drop, .jerry-can-drop');
    drops.forEach((d) => d.remove());

    const config = DIFFICULTY_CONFIGS[difficulty];
    const isWin = score >= config.targetScore;

    // Check high score
    const currentBest = highScores[difficulty] || 0;
    let isNewHighScore = false;
    if (score > currentBest) {
      highScores[difficulty] = score;
      storage.setItem(`cw_high_score_${difficulty}`, String(score));
      isNewHighScore = true;
    }

    updateUI();

    // Sound
    if (isWin) {
      playVictorySound(soundEnabled);
      showConfetti();
    } else {
      playLoseSound(soundEnabled);
      clearConfetti();
    }

    // Modal texts
    let msg = '';
    if (isWin) {
      msg = WINNING_MESSAGES[Math.floor(Math.random() * WINNING_MESSAGES.length)];
    } else {
      const template = LOSING_MESSAGES[Math.floor(Math.random() * LOSING_MESSAGES.length)];
      msg = template.replace('{GOAL}', String(config.targetScore));
    }

    el.resultTitle.textContent = msg;
    el.resultScore.textContent = `Final score: ${score}`;
    el.resultMeta.textContent = `Mode: ${config.label} (Goal: ${config.targetScore} drops)`;

    if (isNewHighScore && score > 0) {
      el.resultBanner.innerHTML = `${SVGS.trophy} New Personal Best in ${config.label}!`;
      el.resultBanner.style.display = 'inline-flex';
    } else if (currentBest > 0) {
      el.resultBanner.innerHTML = `${SVGS.trophy} Best in ${config.label}: ${currentBest}`;
      el.resultBanner.style.display = 'inline-flex';
    } else {
      el.resultBanner.style.display = 'none';
    }

    if (isWin) {
      el.resultSummary.innerHTML = `<span style="color: var(--cw-dark-green); font-weight: 700;">Awesome work! You surpassed the ${config.targetScore}-drop goal!</span>`;
    } else {
      el.resultSummary.innerHTML = `Goal was ${config.targetScore} drops. You reached <strong>${score}</strong> drops.`;
    }

    showResultModal();
  }

  function showResultModal() {
    el.resultModal.classList.add('active');
  }

  function hideResultModal() {
    el.resultModal.classList.remove('active');
    clearConfetti();
  }

  function showRulesModal() {
    el.rulesModal.classList.add('active');
  }

  function hideRulesModal() {
    el.rulesModal.classList.remove('active');
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    storage.setItem('cw_sound_enabled', String(soundEnabled));
    updateUI();
  }

  // --- Attach Event Listeners ---
  function setupListeners() {
    // Difficulty mode buttons
    el.diffButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setDifficulty(btn.dataset.diff);
      });
    });

    // Start buttons
    el.startBtn.addEventListener('click', startGame);
    el.idleStartBtn.addEventListener('click', startGame);
    el.playAgainBtn.addEventListener('click', () => {
      hideResultModal();
      startGame();
    });

    // Sound toggle
    el.soundBtn.addEventListener('click', toggleSound);

    // Reservoir click swirl
    el.reservoirWidget.addEventListener('click', () => {
      el.reservoirTank.classList.add('swirl');
      setTimeout(() => el.reservoirTank.classList.remove('swirl'), 500);
    });

    // Rules modal
    el.openRulesBtn.addEventListener('click', showRulesModal);
    el.closeRulesBtn.addEventListener('click', hideRulesModal);
    el.rulesDoneBtn.addEventListener('click', hideRulesModal);
    el.rulesModal.addEventListener('click', (e) => {
      if (e.target === el.rulesModal) hideRulesModal();
    });

    // Keydown escape to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideRulesModal();
      }
    });
  }

  // --- Initialization ---
  function init() {
    initStorage();
    setupListeners();
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
