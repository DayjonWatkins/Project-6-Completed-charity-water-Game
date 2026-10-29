import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { DifficultySelector } from './components/DifficultySelector';
import { ScorePanel } from './components/ScorePanel';
import { GameContainer } from './components/GameContainer';
import { GameResultModal } from './components/GameResultModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { WaterImpactFooter } from './components/WaterImpactFooter';
import { DropItem, ScorePopup, RippleEffect, GameStatus, DifficultyLevel } from './types/game';
import { DIFFICULTY_CONFIGS } from './utils/difficulty';
import {
  playGoodDropSound,
  playBadDropSound,
  playCanCollectSound,
  playVictorySound,
  playLoseSound,
} from './utils/audio';

const WINNING_MESSAGES = [
  'You made a splash! Every drop counts.',
  'Brilliant catch! Clean water for communities.',
  'Water champion! You reached the goal.',
];

const LOSING_MESSAGES_TEMPLATES = [
  'Good effort! Try again and beat {GOAL} drops.',
  'Every drop matters. Give it another splash!',
  'The next round is yours. Try again!',
];

export const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    try {
      const saved = localStorage.getItem('cw_difficulty') as DifficultyLevel;
      if (saved && DIFFICULTY_CONFIGS[saved]) return saved;
    } catch {
      // ignore
    }
    return 'normal';
  });

  const activeConfig = DIFFICULTY_CONFIGS[difficulty];

  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(activeConfig.duration);
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  // Track high score per difficulty
  const [highScores, setHighScores] = useState<Record<DifficultyLevel, number>>(() => {
    const scores: Record<DifficultyLevel, number> = { easy: 0, normal: 0, hard: 0 };
    try {
      (['easy', 'normal', 'hard'] as DifficultyLevel[]).forEach((diff) => {
        const saved = localStorage.getItem(`cw_high_score_${diff}`);
        if (saved) scores[diff] = parseInt(saved, 10) || 0;
      });
      // Fallback for legacy key
      if (!scores.normal) {
        const legacy = localStorage.getItem('cw_high_score');
        if (legacy) scores.normal = parseInt(legacy, 10) || 0;
      }
    } catch {
      // ignore storage errors
    }
    return scores;
  });

  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [isWin, setIsWin] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cw_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Refs for tracking active intervals and state inside callbacks
  const dropIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const gameRunningRef = useRef<boolean>(false);
  const scoreRef = useRef<number>(0);
  const difficultyRef = useRef<DifficultyLevel>(difficulty);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    difficultyRef.current = difficulty;
    if (gameStatus === 'idle') {
      setTimeRemaining(DIFFICULTY_CONFIGS[difficulty].duration);
    }
  }, [difficulty, gameStatus]);

  const handleSelectDifficulty = (newDiff: DifficultyLevel) => {
    if (gameStatus === 'playing') return;
    setDifficulty(newDiff);
    setTimeRemaining(DIFFICULTY_CONFIGS[newDiff].duration);
    setScore(0);
    scoreRef.current = 0;
    try {
      localStorage.setItem('cw_difficulty', newDiff);
    } catch {
      // ignore
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cw_sound_enabled', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const createDrop = useCallback(() => {
    if (!gameRunningRef.current) return;

    const currentDiff = difficultyRef.current;
    const config = DIFFICULTY_CONFIGS[currentDiff];

    const container = document.getElementById('game-container');
    const containerWidth = container ? container.clientWidth : 600;

    // Check if spawning a Jerry Can bonus drop
    const isCan = Math.random() < config.canSpawnRate;
    const isBad = !isCan && Math.random() < config.badDropRate;

    const kind = isCan ? 'can' : isBad ? 'bad' : 'good';

    let size = 60;
    if (isCan) {
      size = 54; // jerry can size
    } else {
      const sizeMultiplier = Math.random() * 0.8 + 0.5; // 0.5 to 1.3
      size = Math.round(60 * sizeMultiplier);
    }

    const maxX = Math.max(0, containerWidth - size);
    const xPosition = Math.random() * maxX;

    const newDrop: DropItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      kind,
      size,
      xPosition,
      fallDuration: config.fallDuration,
      createdAt: Date.now(),
    };

    setDrops((prev) => [...prev, newDrop]);
  }, []);

  const endGame = useCallback(() => {
    if (!gameRunningRef.current) return;
    gameRunningRef.current = false;

    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setDrops([]); // Remove all falling drops

    const currentDiff = difficultyRef.current;
    const config = DIFFICULTY_CONFIGS[currentDiff];
    const finalScore = scoreRef.current;
    const won = finalScore >= config.targetScore;
    setIsWin(won);

    let chosenMessage = '';
    if (won) {
      chosenMessage = WINNING_MESSAGES[Math.floor(Math.random() * WINNING_MESSAGES.length)];
    } else {
      const template =
        LOSING_MESSAGES_TEMPLATES[Math.floor(Math.random() * LOSING_MESSAGES_TEMPLATES.length)];
      chosenMessage = template.replace('{GOAL}', String(config.targetScore));
    }
    setResultMessage(chosenMessage);

    // Check high score for current difficulty
    const currentBest = highScores[currentDiff] || 0;
    let newRecord = false;
    if (finalScore > currentBest) {
      setHighScores((prev) => {
        const updated = { ...prev, [currentDiff]: finalScore };
        try {
          localStorage.setItem(`cw_high_score_${currentDiff}`, String(finalScore));
        } catch {
          // ignore storage errors
        }
        return updated;
      });
      newRecord = true;
    }
    setIsNewHighScore(newRecord);

    if (won) {
      playVictorySound(soundEnabled);
    } else {
      playLoseSound(soundEnabled);
    }

    setTimeRemaining(0);
    setGameStatus('ended');
  }, [highScores, soundEnabled]);

  const startGame = useCallback(() => {
    if (gameRunningRef.current) return;

    const config = DIFFICULTY_CONFIGS[difficultyRef.current];
    gameRunningRef.current = true;
    setGameStatus('playing');
    setScore(0);
    scoreRef.current = 0;
    setTimeRemaining(config.duration);
    setDrops([]);
    setPopups([]);
    setRipples([]);
    setIsNewHighScore(false);

    // Initial drop
    createDrop();

    // Spawning interval
    dropIntervalRef.current = window.setInterval(() => {
      createDrop();
    }, config.spawnInterval);

    // Timer interval
    timerIntervalRef.current = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [createDrop, endGame]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleCollectDrop = useCallback(
    (dropId: string, clientX: number, clientY: number) => {
      if (!gameRunningRef.current) return;

      const targetDrop = drops.find((d) => d.id === dropId);
      if (!targetDrop) return;

      // Remove drop immediately from the DOM
      setDrops((prev) => prev.filter((d) => d.id !== dropId));

      const kind = targetDrop.kind;
      let pointChange = 1;
      let popupText = '+1';
      let rippleColor = '#2e9df7';

      if (kind === 'can') {
        pointChange = 3;
        popupText = '+3 Can!';
        rippleColor = '#ffc907';
        playCanCollectSound(soundEnabled);
      } else if (kind === 'bad') {
        pointChange = -1;
        popupText = '-1';
        rippleColor = '#f5402c';
        playBadDropSound(soundEnabled);
      } else {
        pointChange = 1;
        popupText = '+1';
        rippleColor = '#2e9df7';
        playGoodDropSound(soundEnabled);
      }

      setScore((prev) => {
        const newScore = Math.max(0, prev + pointChange);
        scoreRef.current = newScore;
        return newScore;
      });

      // Add visual feedback popup
      const container = document.getElementById('game-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const popupX = Math.max(20, Math.min(container.clientWidth - 20, clientX - rect.left));
        const popupY = Math.max(20, Math.min(container.clientHeight - 20, clientY - rect.top));

        const popupId = `pop-${Date.now()}-${Math.random()}`;
        setPopups((prev) => [
          ...prev,
          {
            id: popupId,
            x: popupX,
            y: popupY,
            text: popupText,
            kind,
          },
        ]);

        const rippleId = `rip-${Date.now()}-${Math.random()}`;
        setRipples((prev) => [
          ...prev,
          {
            id: rippleId,
            x: popupX,
            y: popupY,
            color: rippleColor,
            size: kind === 'can' ? 80 : 60,
          },
        ]);

        setTimeout(() => {
          setPopups((prev) => prev.filter((p) => p.id !== popupId));
        }, 850);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== rippleId));
        }, 550);
      }
    },
    [drops, soundEnabled]
  );

  const handleDropFinished = useCallback((dropId: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== dropId));
  }, []);

  const currentHighScore = highScores[difficulty] || 0;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-6 px-3 bg-[#f4f4f4] text-[#131313]">
      <div className="game-wrapper flex flex-col items-center gap-4 sm:gap-5 w-[min(800px,95vw)]">
        <Header onOpenRules={() => setIsRulesOpen(true)} />

        {/* Difficulty Selection */}
        <DifficultySelector
          currentDifficulty={difficulty}
          disabled={gameStatus === 'playing'}
          onSelect={handleSelectDifficulty}
        />

        {/* Score & Reservoir Control Panel */}
        <ScorePanel
          score={score}
          targetScore={activeConfig.targetScore}
          timeRemaining={timeRemaining}
          gameStatus={gameStatus}
          highScore={currentHighScore}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onStartGame={startGame}
        />

        {/* Main Interactive Game Field */}
        <div className="relative w-full">
          <GameContainer
            gameStatus={gameStatus}
            drops={drops}
            popups={popups}
            ripples={ripples}
            difficultyConfig={activeConfig}
            onCollectDrop={handleCollectDrop}
            onDropFinished={handleDropFinished}
            onStartGame={startGame}
          />

          {gameStatus === 'ended' && (
            <GameResultModal
              score={score}
              targetScore={activeConfig.targetScore}
              message={resultMessage}
              isWin={isWin}
              highScore={currentHighScore}
              isNewHighScore={isNewHighScore}
              difficultyLabel={activeConfig.label}
              onPlayAgain={startGame}
            />
          )}
        </div>

        {/* charity: water Official Links & Donation Section */}
        <WaterImpactFooter />
      </div>

      <HowToPlayModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};

export default App;
