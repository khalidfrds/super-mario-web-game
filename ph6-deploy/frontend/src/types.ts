// src/types.ts
// All TypeScript interfaces for the project

export interface PlatformData {
  x: number
  y: number
  width: number
  tileType: string
}

export interface EnemyData {
  type: 'goomba' | 'koopa'
  x: number
  y: number
}

export interface CoinData {
  x: number
  y: number
}

export interface QuestionBlockData {
  x: number
  y: number
  content: 'coin' | 'mushroom'
}

export interface LevelConfig {
  id: number
  name: string
  bgColor: string
  bgAsset: string | null
  width: number
  platforms: PlatformData[]
  enemies: EnemyData[]
  coins: CoinData[]
  questionBlocks: QuestionBlockData[]
  checkpointX: number
  flagX: number
}

export type PlayerState =
  | 'idle'
  | 'walking'
  | 'jumping'
  | 'falling'
  | 'dying'
  | 'powered_up'
  | 'invincible'

export type GoombaState = 'patrolling' | 'dead'

export type KoopaState = 'patrolling' | 'in_shell' | 'shell_sliding'

export type QuestionBlockState = 'active' | 'bumping' | 'empty'

export type MushroomState = 'idle' | 'emerging' | 'moving' | 'collected'

export interface ScoreEntry {
  rank: number
  name: string
  score: number
}

export interface ScoreSubmitResponse {
  id: number
  name: string
  score: number
}
