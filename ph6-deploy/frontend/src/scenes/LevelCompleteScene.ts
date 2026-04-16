// src/scenes/LevelCompleteScene.ts
// Intermediate screen between levels — tech contract 4.5
// GameScene is paused when this scene launches as overlay

import Phaser from 'phaser'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  UI_BG_COLOR,
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  SUCCESS_COLOR,
  SCENE_TITLE_FONT_SIZE,
  SCENE_INFO_FONT_SIZE,
  SCENE_BUTTON_FONT_SIZE,
  SCENE_INFO_LINE_HEIGHT,
  SCENE_BUTTON_DELAY_MS,
  CENTER_ORIGIN,
  SCENE_TITLE_Y_DIVISOR,
  SCENE_LINE_OFFSET_2,
  SCENE_LINE_OFFSET_3,
  SCENE_LINE_OFFSET_5
} from '../data/gameConfig'

interface LevelCompleteData {
  score: number
  lives: number
  nextLevelIndex: number
  nextLevelName: string
}

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' })
  }

  create(data: LevelCompleteData): void {
    this.cameras.main.setBackgroundColor(UI_BG_COLOR)

    const centerX = GAME_WIDTH * CENTER_ORIGIN
    const titleY = GAME_HEIGHT / SCENE_TITLE_Y_DIVISOR

    // Title
    this.add.text(
      centerX,
      titleY,
      'LEVEL COMPLETE!',
      {
        fontSize: SCENE_TITLE_FONT_SIZE + 'px',
        color: SUCCESS_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // Next level name
    this.add.text(
      centerX,
      titleY + SCENE_INFO_LINE_HEIGHT,
      'Next Level: ' + data.nextLevelName,
      {
        fontSize: SCENE_INFO_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // Score
    this.add.text(
      centerX,
      titleY + SCENE_INFO_LINE_HEIGHT * SCENE_LINE_OFFSET_2,
      'Score: ' + data.score.toString(),
      {
        fontSize: SCENE_INFO_FONT_SIZE + 'px',
        color: UI_ACCENT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // Lives
    this.add.text(
      centerX,
      titleY + SCENE_INFO_LINE_HEIGHT * SCENE_LINE_OFFSET_3,
      'Lives: ' + data.lives.toString(),
      {
        fontSize: SCENE_INFO_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // Continue button — delayed to prevent accidental skip
    this.time.delayedCall(SCENE_BUTTON_DELAY_MS, () => {
      const btnText = this.add.text(
        centerX,
        titleY + SCENE_INFO_LINE_HEIGHT * SCENE_LINE_OFFSET_5,
        'CONTINUE',
        {
          fontSize: SCENE_BUTTON_FONT_SIZE + 'px',
          color: UI_TEXT_COLOR,
          fontStyle: 'bold'
        }
      ).setOrigin(CENTER_ORIGIN).setInteractive({ useHandCursor: true })

      btnText.on('pointerover', () => { btnText.setColor(UI_ACCENT_COLOR) })
      btnText.on('pointerout', () => { btnText.setColor(UI_TEXT_COLOR) })

      // Tech contract 4.5: stop LevelComplete → resume GameScene → loadLevel
      btnText.on('pointerdown', () => {
        const nextIdx = data.nextLevelIndex
        this.scene.stop('LevelCompleteScene')
        this.scene.resume('GameScene')
        const gameScene = this.scene.get('GameScene') as Phaser.Scene & { loadLevel: (idx: number) => void }
        gameScene.loadLevel(nextIdx)
      })
    })
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
