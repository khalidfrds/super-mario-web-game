// src/data/levels.ts
// Level configurations — PH5: three full levels

import { LevelConfig, PlatformData, EnemyData, CoinData, QuestionBlockData } from '../types'
import {
  SKY_COLOR,
  CAVE_COLOR,
  CASTLE_COLOR,
  TILE_SIZE,
  GAME_HEIGHT,
  CENTER_ORIGIN,
  SINGLE_TILE,
  TILE_LAST_OFFSET,
  LEVEL_1_ID,
  LEVEL_1_WIDTH,
  ROW_ABOVE_GROUND,
  ROW_QBLOCK_HEIGHT,
  L2_ID,
  L2_WIDTH,
  L3_ID,
  L3_WIDTH,
  L1_GROUND_SECTIONS,
  L1_FLOAT_SECTIONS,
  L1_ENEMY_COLS,
  L1_COIN_COLS,
  L1_QBLOCK_DATA,
  L1_CHECKPOINT_COL,
  L1_FLAG_COL,
  L2_GROUND_SECTIONS,
  L2_FLOAT_SECTIONS,
  L2_ENEMY_COLS,
  L2_COIN_COLS,
  L2_QBLOCK_DATA,
  L2_CHECKPOINT_COL,
  L2_FLAG_COL,
  L3_GROUND_SECTIONS,
  L3_FLOAT_SECTIONS,
  L3_ENEMY_COLS,
  L3_COIN_COLS,
  L3_QBLOCK_DATA,
  L3_CHECKPOINT_COL,
  L3_FLAG_COL
} from './gameConfig'

// Ground Y position: near the bottom of the game world
const GROUND_Y = GAME_HEIGHT - TILE_SIZE

// Tile half-size for centering within a tile cell
const TILE_HALF = TILE_SIZE * CENTER_ORIGIN

// Helper: create a row of ground tiles with given tile prefix
function createGroundPlatform(
  startCol: number,
  y: number,
  tileCount: number,
  prefix: string
): PlatformData[] {
  const tiles: PlatformData[] = []
  for (let i = 0; i < tileCount; i++) {
    let tileType = prefix + 'Mid'
    if (tileCount === SINGLE_TILE) {
      tileType = prefix + 'Center'
    } else if (i === 0) {
      tileType = prefix + 'Left'
    } else if (i === tileCount - TILE_LAST_OFFSET) {
      tileType = prefix + 'Right'
    }
    tiles.push({
      x: (startCol + i) * TILE_SIZE + TILE_HALF,
      y: y + TILE_HALF,
      width: TILE_SIZE,
      tileType: tileType
    })
  }
  return tiles
}

// Helper: build platforms from blueprint ground + float sections
function buildPlatforms(
  groundSections: readonly { startCol: number; count: number }[],
  floatSections: readonly { startCol: number; heightAbove: number; count: number }[],
  prefix: string
): PlatformData[] {
  const platforms: PlatformData[] = []
  // Ground sections: named fields startCol, count
  groundSections.forEach((section) => {
    platforms.push(...createGroundPlatform(section.startCol, GROUND_Y, section.count, prefix))
  })
  // Floating sections: named fields startCol, heightAbove, count
  floatSections.forEach((section) => {
    platforms.push(...createGroundPlatform(
      section.startCol,
      GROUND_Y - TILE_SIZE * section.heightAbove,
      section.count,
      prefix
    ))
  })
  return platforms
}

// Helper: build enemies from blueprint
function buildEnemies(
  enemyCols: readonly { type: string; col: number }[]
): EnemyData[] {
  return enemyCols.map((e) => ({
    type: e.type as 'goomba' | 'koopa',
    x: e.col * TILE_SIZE + TILE_HALF,
    y: GROUND_Y - TILE_SIZE * ROW_ABOVE_GROUND
  }))
}

// Helper: build coins from blueprint
function buildCoins(coinCols: readonly number[]): CoinData[] {
  return coinCols.map((col) => ({
    x: col * TILE_SIZE + TILE_HALF,
    y: GROUND_Y - TILE_SIZE * ROW_ABOVE_GROUND
  }))
}

// Helper: build question blocks from blueprint
function buildQuestionBlocks(
  qblockData: readonly { col: number; content: string }[]
): QuestionBlockData[] {
  return qblockData.map((qb) => ({
    x: qb.col * TILE_SIZE + TILE_HALF,
    y: GROUND_Y - TILE_SIZE * ROW_QBLOCK_HEIGHT + TILE_HALF,
    content: qb.content as 'coin' | 'mushroom'
  }))
}

export const LEVELS: LevelConfig[] = [
  // L1 — Grassland
  {
    id: LEVEL_1_ID,
    name: 'Grassland',
    bgColor: SKY_COLOR,
    bgAsset: 'backgroundForest',
    width: LEVEL_1_WIDTH,
    platforms: buildPlatforms(L1_GROUND_SECTIONS, L1_FLOAT_SECTIONS, 'grass'),
    enemies: buildEnemies(L1_ENEMY_COLS),
    coins: buildCoins(L1_COIN_COLS),
    questionBlocks: buildQuestionBlocks(L1_QBLOCK_DATA),
    checkpointX: L1_CHECKPOINT_COL * TILE_SIZE + TILE_HALF,
    flagX: L1_FLAG_COL * TILE_SIZE + TILE_HALF
  },
  // L2 — Underground
  {
    id: L2_ID,
    name: 'Underground',
    bgColor: CAVE_COLOR,
    bgAsset: null,
    width: L2_WIDTH,
    platforms: buildPlatforms(L2_GROUND_SECTIONS, L2_FLOAT_SECTIONS, 'stone'),
    enemies: buildEnemies(L2_ENEMY_COLS),
    coins: buildCoins(L2_COIN_COLS),
    questionBlocks: buildQuestionBlocks(L2_QBLOCK_DATA),
    checkpointX: L2_CHECKPOINT_COL * TILE_SIZE + TILE_HALF,
    flagX: L2_FLAG_COL * TILE_SIZE + TILE_HALF
  },
  // L3 — Castle
  {
    id: L3_ID,
    name: 'Castle',
    bgColor: CASTLE_COLOR,
    bgAsset: null,
    width: L3_WIDTH,
    platforms: buildPlatforms(L3_GROUND_SECTIONS, L3_FLOAT_SECTIONS, 'castle'),
    enemies: buildEnemies(L3_ENEMY_COLS),
    coins: buildCoins(L3_COIN_COLS),
    questionBlocks: buildQuestionBlocks(L3_QBLOCK_DATA),
    checkpointX: L3_CHECKPOINT_COL * TILE_SIZE + TILE_HALF,
    flagX: L3_FLAG_COL * TILE_SIZE + TILE_HALF
  }
]
