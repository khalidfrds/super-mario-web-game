// src/main.ts
// Entry point — Phaser Game initialization

import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { PreloadScene } from './scenes/PreloadScene'
import { MainMenuScene } from './scenes/MainMenuScene'
import { GameScene } from './scenes/GameScene'
import { HUDScene } from './scenes/HUDScene'
import { PauseScene } from './scenes/PauseScene'
import { GameOverScene } from './scenes/GameOverScene'
import { LevelCompleteScene } from './scenes/LevelCompleteScene'
import { WinScene } from './scenes/WinScene'
import { LeaderboardScene } from './scenes/LeaderboardScene'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_BG_COLOR,
  PHYSICS_GRAVITY_Y
} from './data/gameConfig'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: GAME_BG_COLOR,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: PHYSICS_GRAVITY_Y },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    GameScene,
    HUDScene,
    PauseScene,
    GameOverScene,
    LevelCompleteScene,
    WinScene,
    LeaderboardScene
  ]
}

new Phaser.Game(config)
