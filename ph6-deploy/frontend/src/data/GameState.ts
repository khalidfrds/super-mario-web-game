// src/data/GameState.ts
// Static game state — persists across scene restarts and level transitions

import { LIVES_START } from './gameConfig'

export const GameState = {
  score: 0,
  coins: 0,
  lives: LIVES_START,
  // PH5: track current level and per-level coin collection
  currentLevelIndex: 0,
  levelCoinsCollected: 0
}

export function resetGameState(): void {
  GameState.score = 0
  GameState.coins = 0
  GameState.lives = LIVES_START
  GameState.currentLevelIndex = 0
  GameState.levelCoinsCollected = 0
}
