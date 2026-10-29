import React from 'react';
import { getAssetUrl } from '../utils/assets';

interface HeaderProps {
  onOpenRules?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRules }) => {
  return (
    <header className="flex w-full flex-col items-center text-center">
      <div className="relative flex items-center justify-center w-full mb-3">
        <img
          src={getAssetUrl('img/cw_logo-horizontal.png')}
          alt="charity: water"
          className="w-[min(280px,70vw)] h-auto select-none"
          loading="eager"
          onError={(e) => {
            // Fallback to text styling if image is missing
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {onOpenRules && (
          <button
            onClick={onOpenRules}
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow-xs transition cursor-pointer"
            title="How to play"
            aria-label="How to play instructions"
          >
            How to Play
          </button>
        )}
      </div>
      <h1 className="text-[clamp(32px,6vw,48px)] font-bold text-[#131313] leading-tight mb-1 tracking-tight">
        Water Drop
      </h1>
      <p className="text-[#666] text-base sm:text-lg mb-2">
        Catch the good drops, avoid the bad ones!
      </p>
    </header>
  );
};
