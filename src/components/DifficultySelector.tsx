import React from 'react';
import { DifficultyLevel } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../utils/difficulty';
import { Flame, ShieldCheck, Zap } from 'lucide-react';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  disabled: boolean;
  onSelect: (difficulty: DifficultyLevel) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  disabled,
  onSelect,
}) => {
  const levels: DifficultyLevel[] = ['easy', 'normal', 'hard'];

  const getIcon = (level: DifficultyLevel) => {
    switch (level) {
      case 'easy':
        return <ShieldCheck className="w-4 h-4 text-[#4fcb53]" />;
      case 'normal':
        return <Zap className="w-4 h-4 text-[#2e9df7]" />;
      case 'hard':
        return <Flame className="w-4 h-4 text-[#f5402c]" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 p-2.5 bg-white rounded-lg border border-gray-200/80 shadow-xs">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
        Mode
      </span>

      <div
        role="group"
        aria-label="Difficulty Mode"
        className="grid grid-cols-3 gap-1.5 w-full sm:w-auto bg-gray-100/80 p-1 rounded-lg"
      >
        {levels.map((level) => {
          const config = DIFFICULTY_CONFIGS[level];
          const isSelected = currentDifficulty === level;

          return (
            <button
              key={level}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(level)}
              aria-pressed={isSelected}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-white text-[#131313] shadow-xs border border-gray-200/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {getIcon(level)}
              <span>{config.label}</span>
              <span className="hidden md:inline text-[11px] font-normal text-gray-500">
                ({config.targetScore}pts/{config.duration}s)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
