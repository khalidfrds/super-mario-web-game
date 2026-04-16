// src/scenes/GameOverScene.ts
// Game Over screen: GAME OVER text + final score + RESTART button

import Phaser from 'phaser'
import { resetGameState } from '../data/GameState'
import {
  UI_BG_COLOR,
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  DANGER_COLOR,
  GAME_WIDTH,
  GAMEOVER_TITLE_FONT_SIZE,
  GAMEOVER_SCORE_FONT_SIZE,
  GAMEOVER_TITLE_Y,
  GAMEOVER_SCORE_Y,
  GAMEOVER_BUTTON_Y,
  MENU_BUTTON_FONT_SIZE,
  MENU_BUTTON_PADDING_X,
  MENU_BUTTON_PADDING_Y,
  MENU_BUTTON_RADIUS,
  MENU_BUTTON_DEPTH,
  CENTER_ORIGIN,
  FULL_ALPHA
} from '../data/gameConfig'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
  }

  create(data: { score: number }): void {
    this.cameras.main.setBackgroundColor(UI_BG_COLOR)

    const finalScore = data.score || 0

    // GAME OVER title
    this.add.text(
      GAME_WIDTH * CENTER_ORIGIN,
      GAMEOVER_TITLE_Y,
      'GAME OVER',
      {
        fontSize: GAMEOVER_TITLE_FONT_SIZE + 'px',
        color: DANGER_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // Final score
    this.add.text(
      GAME_WIDTH * CENTER_ORIGIN,
      GAMEOVER_SCORE_Y,
      'SCORE: ' + finalScore.toString(),
      {
        fontSize: GAMEOVER_SCORE_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // RESTART button
    const buttonText = this.add.text(
      GAME_WIDTH * CENTER_ORIGIN,
      GAMEOVER_BUTTON_Y,
      'RESTART',
      {
        fontSize: MENU_BUTTON_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    const buttonBg = this.add.graphics()
    buttonBg.fillStyle(
      Phaser.Display.Color.HexStringToColor(UI_ACCENT_COLOR).color,
      FULL_ALPHA
    )
    buttonBg.fillRoundedRect(
      buttonText.x - buttonText.width * CENTER_ORIGIN - MENU_BUTTON_PADDING_X,
      buttonText.y - buttonText.height * CENTER_ORIGIN - MENU_BUTTON_PADDING_Y,
      buttonText.width + MENU_BUTTON_PADDING_X + MENU_BUTTON_PADDING_X,
      buttonText.height + MENU_BUTTON_PADDING_Y + MENU_BUTTON_PADDING_Y,
      MENU_BUTTON_RADIUS
    )

    buttonText.setColor(UI_BG_COLOR)
    buttonText.setDepth(MENU_BUTTON_DEPTH)

    const hitArea = this.add.zone(
      buttonText.x,
      buttonText.y,
      buttonText.width + MENU_BUTTON_PADDING_X + MENU_BUTTON_PADDING_X,
      buttonText.height + MENU_BUTTON_PADDING_Y + MENU_BUTTON_PADDING_Y
    ).setInteractive({ useHandCursor: true })

    hitArea.on('pointerdown', () => {
      this.restartGame()
    })

    // Keyboard shortcut
    const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

    if (spaceKey) {
      spaceKey.on('down', () => {
        this.restartGame()
      })
    }

    if (enterKey) {
      enterKey.on('down', () => {
        this.restartGame()
      })
    }
  }

  private restartGame(): void {
    resetGameState()
    this.scene.start('GameScene', { restart: true })
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
