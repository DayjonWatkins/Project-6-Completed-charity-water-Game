import React from 'react';
import { Volume2, VolumeX, Trophy } from 'lucide-react';
import { GameStatus } from '../types/game';
import { WaterReservoir } from './WaterReservoir';

interface ScorePanelProps {
  score: number;
  targetScore: number;
  timeRemaining: number;
  gameStatus: GameStatus;
  highScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStartGame: () => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  targetScore,
  timeRemaining,
  gameStatus,
  highScore,
  soundEnabled,
  onToggleSound,
  onStartGame,
}) => {
  const isPlaying = gameStatus === 'playing';

  const getButtonText = () => {
    if (gameStatus === 'playing') return 'Game in Progress';
    if (gameStatus === 'ended') return 'Play Again';
    return 'Start Game';
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex flex-wrap justify-between items-center w-full gap-2.5 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200/80">
        {/* Score & Reservoir */}
        <div className="flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-black text-[#131313] min-w-[90px] font-heading">
            Score: <span className="text-[#2e9df7]">{score}</span>
          </div>
          {highScore > 0 && (
            <div className="hidden lg:flex items-center gap-1 text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              <Trophy className="w-3.5 h-3.5 text-[#ffc907] fill-[#ffc907]" />
              <span>Best: {highScore}</span>
            </div>
          )}
        </div>

        {/* Live Water Reservoir Progress Gauge */}
        <div className="order-last sm:order-none w-full sm:w-auto">
          <WaterReservoir score={score} targetScore={targetScore} />
        </div>

        {/* Timer, Audio Toggle & Start Action */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
          <div
            className={`text-xl sm:text-2xl font-black tabular-nums ${
              isPlaying && timeRemaining <= 5
                ? 'text-[#f5402c] animate-pulse'
                : 'text-[#131313]'
            }`}
          >
            Time: {timeRemaining}s
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#2e9df7]" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <button
            id="start-btn"
            type="button"
            disabled={isPlaying}
            onClick={onStartGame}
            className="min-h-[44px] px-4 sm:px-5 py-2 bg-[#ffc907] hover:bg-[#ffd43b] text-[#131313] font-black border-2 border-[#131313] rounded-md cursor-pointer text-sm sm:text-base transition active:scale-95 disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};
