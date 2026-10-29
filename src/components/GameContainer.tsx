import React, { useRef, useEffect } from 'react';
import { DropItem, ScorePopup, RippleEffect, GameStatus, DifficultyConfig } from '../types/game';
import { Droplet, Play, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface GameContainerProps {
  gameStatus: GameStatus;
  drops: DropItem[];
  popups: ScorePopup[];
  ripples: RippleEffect[];
  difficultyConfig: DifficultyConfig;
  onCollectDrop: (dropId: string, clientX: number, clientY: number) => void;
  onDropFinished: (dropId: string) => void;
  onStartGame: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  gameStatus,
  drops,
  popups,
  ripples,
  difficultyConfig,
  onCollectDrop,
  onDropFinished,
  onStartGame,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        containerRef.current.style.setProperty('--container-height', `${height}px`);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  return (
    <div
      ref={containerRef}
      id="game-container"
      className="relative w-full h-[min(600px,68vh)] min-h-[380px] max-sm:min-h-[440px] max-sm:h-[62vh] rounded-lg overflow-hidden border-[3px] border-[#2e9df7] shadow-inner select-none"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #eaf8ff 32%, #8bd1cb 100%)',
      }}
    >
      {/* Background Water Ambient Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -bottom-10 left-0 right-0 h-32 bg-[#2e9df7] rounded-[40%] blur-xl opacity-40 animate-pulse" />
      </div>

      {/* Target indicator banner at top-right */}
      <div className="absolute top-3 right-3 pointer-events-none z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-xs rounded-full border border-gray-200 text-xs font-semibold text-gray-700 shadow-xs">
        <Droplet className="w-3.5 h-3.5 text-[#2e9df7] fill-[#2e9df7]" />
        <span>Goal: {difficultyConfig.targetScore} drops</span>
      </div>

      {/* Idle / Welcome Screen inside container */}
      {gameStatus === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-white/30 backdrop-blur-[1px]">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full good-drop flex items-center justify-center shadow-lg transform hover:scale-105 transition cursor-pointer animate-bounce">
              <Droplet className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="absolute -top-1 -right-2 bg-[#ffc907] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#131313] text-[#131313]">
              {difficultyConfig.label} Mode
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131313] mb-2 font-heading">
            Ready to Catch Clean Water?
          </h2>
          <p className="max-w-md text-xs sm:text-sm text-gray-700 mb-6 leading-relaxed">
            Catch clean blue drops (+1) and bonus yellow jerry cans (+3). Avoid murky contaminated drops (-1)! Collect at least{' '}
            <strong>{difficultyConfig.targetScore} drops</strong> in{' '}
            <strong>{difficultyConfig.duration}s</strong>.
          </p>

          <button
            type="button"
            onClick={onStartGame}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#ffc907] hover:bg-[#ffd43b] text-[#131313] font-bold text-base sm:text-lg border-2 border-[#131313] rounded-md shadow-md cursor-pointer transition transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Game
          </button>
        </div>
      )}

      {/* Falling Elements (Water drops & Jerry Cans) - Removed instantly from DOM on interaction */}
      {drops.map((drop) => {
        const fallDistance = containerRef.current
          ? containerRef.current.clientHeight + drop.size + 40
          : 640;

        if (drop.kind === 'can') {
          return (
            <div
              key={drop.id}
              role="button"
              tabIndex={0}
              aria-label="Collect special yellow charity: water jerry can bonus"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCollectDrop(drop.id, e.clientX, e.clientY);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    onCollectDrop(drop.id, rect.left + drop.xPosition + drop.size / 2, rect.top + 100);
                  }
                }
              }}
              onAnimationEnd={() => {
                onDropFinished(drop.id);
              }}
              className="jerry-can-drop absolute cursor-pointer transition-transform duration-100 hover:scale-115 active:scale-95 can-fall z-10"
              style={
                {
                  left: `${drop.xPosition}px`,
                  width: `${drop.size}px`,
                  height: `${drop.size}px`,
                  '--fall-duration': `${drop.fallDuration}s`,
                  '--fall-distance': `${fallDistance}px`,
                  padding: '12px',
                  margin: '-12px',
                  touchAction: 'manipulation',
                } as React.CSSProperties
              }
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={getAssetUrl('img/water-can-transparent.png')}
                  alt="charity: water Jerry Can Bonus"
                  className="w-full h-full object-contain filter drop-shadow-md hover:brightness-110 pointer-events-none"
                  draggable={false}
                />
                <span className="absolute -top-1 -right-1 bg-[#159a48] text-white text-[10px] font-black px-1 rounded-full border border-white shadow-xs">
                  +3
                </span>
              </div>
            </div>
          );
        }

        const isBad = drop.kind === 'bad';

        return (
          <div
            key={drop.id}
            role="button"
            tabIndex={0}
            aria-label={isBad ? 'Avoid contaminated water drop' : 'Catch clean water drop'}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCollectDrop(drop.id, e.clientX, e.clientY);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  onCollectDrop(drop.id, rect.left + drop.xPosition + drop.size / 2, rect.top + 100);
                }
              }
            }}
            onAnimationEnd={() => {
              onDropFinished(drop.id);
            }}
            className={`water-drop absolute rounded-full cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-90 drop-fall ${
              isBad ? 'bad-drop' : 'good-drop'
            }`}
            style={
              {
                left: `${drop.xPosition}px`,
                width: `${drop.size}px`,
                height: `${drop.size}px`,
                '--fall-duration': `${drop.fallDuration}s`,
                '--fall-distance': `${fallDistance}px`,
                padding: '15px',
                margin: '-15px',
                touchAction: 'manipulation',
              } as React.CSSProperties
            }
          >
            {/* Visual inner droplet contour */}
            <div className="w-full h-full rounded-full relative overflow-hidden pointer-events-none">
              <div className="absolute top-[15%] left-[20%] w-[32%] h-[32%] rounded-full bg-white/70 blur-[1px]" />
            </div>
          </div>
        );
      })}

      {/* Floating score text feedback (+1 / -1 / +3) */}
      {popups.map((popup) => {
        let colorClass = 'text-[#159a48]';
        if (popup.kind === 'bad') colorClass = 'text-[#f5402c]';
        if (popup.kind === 'can') colorClass = 'text-[#e6b100]';

        return (
          <div
            key={popup.id}
            className={`absolute pointer-events-none font-black text-xl sm:text-2xl float-score-anim z-30 drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)] flex items-center gap-1 ${colorClass}`}
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {popup.kind === 'can' && <Sparkles className="w-4 h-4 fill-[#ffc907]" />}
            <span>{popup.text}</span>
          </div>
        );
      })}

      {/* Water ripple circles */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="absolute rounded-full pointer-events-none ripple-anim z-10"
          style={{
            left: `${rip.x}px`,
            top: `${rip.y}px`,
            width: `${rip.size || 60}px`,
            height: `${rip.size || 60}px`,
            marginLeft: `-${(rip.size || 60) / 2}px`,
            marginTop: `-${(rip.size || 60) / 2}px`,
            border: `3px solid ${rip.color}`,
          }}
        />
      ))}
    </div>
  );
};
