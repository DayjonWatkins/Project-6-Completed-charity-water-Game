import React from 'react';
import { X, Droplets, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-white border-3 border-[#2e9df7] rounded-xl shadow-2xl p-6 text-[#131313] max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close rules"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="rules-title" className="text-2xl font-bold mb-4 flex items-center gap-2 font-heading">
          <Droplets className="w-6 h-6 text-[#2e9df7]" />
          How to Play & Game Elements
        </h3>

        <div className="space-y-3.5 text-sm text-gray-700">
          {/* Elements */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-10 h-10 rounded-full shrink-0 good-drop flex items-center justify-center font-bold text-white text-xs shadow-xs">
              +1
            </div>
            <div>
              <h4 className="font-bold text-[#131313]">Clean Water Drops</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Catch clean drops to add <strong>+1 point</strong> and fill the Clean Water Reservoir. Drops disappear immediately upon tapping.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="w-10 h-10 rounded-lg shrink-0 bg-white border-2 border-[#ffc907] flex items-center justify-center p-1 shadow-xs">
              <img
                src={getAssetUrl('img/water-can-transparent.png')}
                alt="Jerry Can"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 flex items-center gap-1">
                <span>Jerry Can Bonus</span>
                <Sparkles className="w-3.5 h-3.5 text-[#ffc907] fill-[#ffc907]" />
              </h4>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Catch the floating yellow jerry can for <strong>+3 bonus points</strong>! Disappears in a golden burst.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-10 h-10 rounded-full shrink-0 bad-drop flex items-center justify-center font-bold text-white text-xs shadow-xs">
              -1
            </div>
            <div>
              <h4 className="font-bold text-[#f5402c]">Contaminated Drops</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Avoid murky red/orange drops! Catching one subtracts <strong>-1 point</strong> from your reservoir.
              </p>
            </div>
          </div>

          {/* Difficulty levels */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
              Difficulty Modes
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-md border border-gray-200">
                <span className="font-bold text-[#4fcb53] block">Easy</span>
                <span className="text-[11px] text-gray-600">15 drops · 40s</span>
              </div>
              <div className="p-2 bg-white rounded-md border border-gray-200">
                <span className="font-bold text-[#2e9df7] block">Normal</span>
                <span className="text-[11px] text-gray-600">20 drops · 30s</span>
              </div>
              <div className="p-2 bg-white rounded-md border border-gray-200">
                <span className="font-bold text-[#f5402c] block">Hard</span>
                <span className="text-[11px] text-gray-600">25 drops · 22s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
            <span className="font-semibold text-gray-800">Accessibility:</span>
            <span>Tab to select falling drops, Space or Enter to collect.</span>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#ffc907] hover:bg-[#ffd43b] text-[#131313] font-bold border-2 border-[#131313] rounded-md transition cursor-pointer"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
