// src/scenes/PauseScene.ts
// Pause overlay — launched over GameScene via scene.launch
// Resume: stop PauseScene + resume GameScene (tech contract 4.4/4.14)

import Phaser from 'phaser'
import { SoundManager } from '../audio/SoundManager'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  UI_BG_COLOR,
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  SCENE_TITLE_FONT_SIZE,
  SCENE_BUTTON_FONT_SIZE,
  CENTER_ORIGIN,
  PAUSE_OVERLAY_ALPHA,
  SCENE_TITLE_Y_DIVISOR,
  SOUND_MANAGER_KEY
} from '../data/gameConfig'

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' })
  }

  create(): void {
    // Semi-transparent background overlay
    const overlay = this.add.rectangle(
      GAME_WIDTH * CENTER_ORIGIN,
      GAME_HEIGHT * CENTER_ORIGIN,
      GAME_WIDTH,
      GAME_HEIGHT,
      Phaser.Display.Color.HexStringToColor(UI_BG_COLOR).color,
      PAUSE_OVERLAY_ALPHA
    )
    overlay.setOrigin(CENTER_ORIGIN)

    // Pause title
    this.add.text(
      GAME_WIDTH * CENTER_ORIGIN,
      GAME_HEIGHT / SCENE_TITLE_Y_DIVISOR,
      'PAUSED',
      {
        fontSize: SCENE_TITLE_FONT_SIZE + 'px',
        color: UI_ACCENT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // Resume button
    const resumeText = this.add.text(
      GAME_WIDTH * CENTER_ORIGIN,
      GAME_HEIGHT * CENTER_ORIGIN + SCENE_BUTTON_FONT_SIZE,
      'RESUME',
      {
        fontSize: SCENE_BUTTON_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN).setInteractive({ useHandCursor: true })

    resumeText.on('pointerover', () => {
      resumeText.setColor(UI_ACCENT_COLOR)
    })

    resumeText.on('pointerout', () => {
      resumeText.setColor(UI_TEXT_COLOR)
    })

    // Tech contract 4.14: Resume → stop PauseScene + resume GameScene + resumeMusic
    resumeText.on('pointerdown', () => {
      this.doResume()
    })

    // ESC key also resumes
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-ESC', () => {
        this.doResume()
      })
    }
  }

  // Tech contract 4.14: stop PauseScene → resume GameScene → resumeMusic
  private doResume(): void {
    this.scene.stop('PauseScene')
    this.scene.resume('GameScene')

    // PH6: Resume music after unpause — tech contract 4.14
    const soundManager = this.registry.get(SOUND_MANAGER_KEY) as SoundManager | null
    if (soundManager) {
      soundManager.resumeMusic()
    }
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
