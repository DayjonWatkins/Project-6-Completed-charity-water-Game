import React from 'react';
import { Trophy, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface GameResultModalProps {
  score: number;
  targetScore: number;
  message: string;
  isWin: boolean;
  highScore: number;
  isNewHighScore: boolean;
  difficultyLabel: string;
  onPlayAgain: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  targetScore,
  message,
  isWin,
  highScore,
  isNewHighScore,
  difficultyLabel,
  onPlayAgain,
}) => {
  return (
    <div
      id="game-result"
      role="status"
      aria-live="polite"
      className="absolute inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] z-30 transition-all"
    >
      {/* Decorative Celebration Confetti Particles */}
      {isWin && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {Array.from({ length: 30 }).map((_, i) => {
            const colors = ['#ffc907', '#2e9df7', '#8bd1cb', '#4fcb53', '#ff902a'];
            const left = (i * 3.3) % 100;
            const duration = 1.8 + ((i * 7) % 12) * 0.1;
            const delay = ((i * 3) % 8) * 0.1;
            const size = 6 + (i % 6) * 1.5;

            return (
              <span
                key={i}
                className="absolute top-0 rounded-xs animate-pulse"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size * 1.2}px`,
                  backgroundColor: colors[i % colors.length],
                  animation: `dropFall ${duration}s ease-in ${delay}s infinite`,
                  transform: `rotate(${i * 24}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="relative w-[min(500px,calc(100%-32px))] p-6 sm:p-8 bg-white border-4 border-[#ffc907] rounded-xl shadow-2xl text-center transform transition-all z-20">
        {/* Jerry can icon / Celebration badge */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={getAssetUrl('img/water-can-transparent.png')}
              alt="charity: water jerry can"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md mx-auto"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {isWin && (
              <div className="absolute -top-1 -right-1 bg-[#ffc907] p-1.5 rounded-full border-2 border-[#131313] text-[#131313]">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <h2
          id="result-message"
          className="mb-2 text-[clamp(20px,5vw,28px)] font-black text-[#131313] leading-snug font-heading"
        >
          {message}
        </h2>

        {/* Score & Mode */}
        <div className="mb-3">
          <p
            id="result-score"
            className="text-2xl sm:text-3xl font-black text-[#159a48]"
          >
            Final score: {score}
          </p>
          <span className="text-xs font-semibold text-gray-500">
            Mode: {difficultyLabel} (Goal: {targetScore} drops)
          </span>
        </div>

        {/* New high score banner or personal best */}
        {isNewHighScore && score > 0 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold mb-4">
            <Trophy className="w-3.5 h-3.5 text-[#ffc907] fill-[#ffc907]" />
            New Personal Best in {difficultyLabel}!
          </div>
        ) : (
          highScore > 0 && (
            <p className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Best in {difficultyLabel}: <span className="font-semibold">{highScore}</span>
            </p>
          )
        )}

        {/* Goal status helper */}
        <div className="text-xs sm:text-sm text-gray-600 mb-5 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
          {isWin ? (
            <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-[#ffc907]" />
              Awesome work! You surpassed the {targetScore}-drop goal!
            </span>
          ) : (
            <span>
              Goal was {targetScore} drops. You reached <strong>{score}</strong> drops.
            </span>
          )}
        </div>

        {/* Action Button & Donation link */}
        <div className="flex flex-col gap-2.5 items-center">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-8 py-3 bg-[#ffc907] hover:bg-[#ffd43b] text-[#131313] font-black border-2 border-[#131313] rounded-md shadow-md cursor-pointer text-base transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Play Again
          </button>

          <a
            href="https://www.charitywater.org/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#2e9df7] hover:underline font-bold mt-1"
          >
            <Heart className="w-3.5 h-3.5 text-[#f16061] fill-[#f16061]" />
            Turn your score into real impact at charitywater.org
          </a>
        </div>
      </div>
    </div>
  );
};
