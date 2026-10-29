import { DifficultyConfig, DifficultyLevel } from '../types/game';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
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
