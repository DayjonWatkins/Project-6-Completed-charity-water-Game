export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export interface DifficultyConfig {
  id: DifficultyLevel;
  label: string;
  subtitle: string;
  targetScore: number;
  duration: number; // in seconds
  fallDuration: number; // in seconds
  spawnInterval: number; // in milliseconds
  badDropRate: number; // 0 to 1
  canSpawnRate: number; // 0 to 1 (chance to spawn yellow jerry can)
}

export type DropKind = 'good' | 'bad' | 'can';

export interface DropItem {
  id: string;
  kind: DropKind;
  size: number;
  xPosition: number;
  fallDuration: number;
  createdAt: number;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  kind: DropKind;
}

export interface RippleEffect {
  id: string;
  x: number;
  y: number;
  color: string;
  size?: number;
}

export type GameStatus = 'idle' | 'playing' | 'ended';

export interface GameStats {
  score: number;
  goodCaught: number;
  badCaught: number;
  cansCaught: number;
  targetScore: number;
}
