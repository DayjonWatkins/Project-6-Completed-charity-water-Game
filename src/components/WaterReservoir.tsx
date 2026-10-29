import React, { useState } from 'react';
import { Droplet, Award } from 'lucide-react';

interface WaterReservoirProps {
  score: number;
  targetScore: number;
  onTapReservoir?: () => void;
}

export const WaterReservoir: React.FC<WaterReservoirProps> = ({
  score,
  targetScore,
  onTapReservoir,
}) => {
  const [isSwirling, setIsSwirling] = useState(false);
  const percentage = Math.min(100, Math.round((score / targetScore) * 100));
  const isGoalReached = score >= targetScore;

  const handleClick = () => {
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 600);
    if (onTapReservoir) onTapReservoir();
  };

  return (
    <div
      onClick={handleClick}
      title="Clean Water Reservoir - Fills as you collect drops!"
      className={`group relative flex items-center gap-3 px-3 py-2 bg-white rounded-lg border-2 transition-all cursor-pointer select-none shadow-xs ${
        isGoalReached
          ? 'border-[#ffc907] ring-2 ring-[#ffc907]/40 bg-amber-50/40'
          : 'border-gray-200 hover:border-[#2e9df7]/60'
      }`}
    >
      {/* Tank Icon & Gauge */}
      <div className="relative w-7 h-10 bg-gray-100 border-2 border-gray-400 rounded-md overflow-hidden flex flex-col justify-end shadow-inner">
        {/* Water Level Fill in DOM */}
        <div
          className={`w-full transition-all duration-300 relative ${
            isGoalReached
              ? 'bg-gradient-to-t from-[#2e9df7] to-[#8bd1cb]'
              : 'bg-gradient-to-t from-[#2e9df7] to-[#8bd1cb]'
          } ${isSwirling ? 'animate-pulse' : ''}`}
          style={{ height: `${percentage}%` }}
        >
          {/* Surface ripple line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/70" />
        </div>
      </div>

      <div className="flex flex-col min-w-[110px]">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#131313] flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-[#2e9df7] fill-[#2e9df7]" />
            Clean Reservoir
          </span>
          <span className="font-extrabold text-[#2e9df7] tabular-nums">
            {percentage}%
          </span>
        </div>

        {/* Linear progress fill bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isGoalReached ? 'bg-[#ffc907]' : 'bg-[#2e9df7]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
          <span>
            {score} / {targetScore} drops
          </span>
          {isGoalReached && (
            <span className="text-amber-800 font-bold flex items-center gap-0.5">
              <Award className="w-3 h-3 text-[#ffc907]" /> Goal!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
