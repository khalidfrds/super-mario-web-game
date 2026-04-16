// src/scenes/MainMenuScene.ts
// Main menu with START + LEADERBOARD buttons — PH6 update

import Phaser from 'phaser'
import {
  UI_BG_COLOR,
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  MENU_TITLE_FONT_SIZE,
  MENU_BUTTON_FONT_SIZE,
  MENU_BUTTON_PADDING_X,
  MENU_BUTTON_PADDING_Y,
  MENU_BUTTON_RADIUS,
  MENU_TITLE_X,
  MENU_TITLE_Y,
  MENU_BUTTON_X,
  MENU_BUTTON_Y,
  MENU_BUTTON_DEPTH,
  FULL_ALPHA,
  CENTER_ORIGIN,
  MENU_LEADERBOARD_BUTTON_OFFSET,
  LEADERBOARD_BUTTON_TEXT
} from '../data/gameConfig'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' })
  }

  create(): void {
    // Background
    this.cameras.main.setBackgroundColor(UI_BG_COLOR)

    // Title
    this.add.text(
      MENU_TITLE_X,
      MENU_TITLE_Y,
      'SUPER MARIO',
      {
        fontSize: MENU_TITLE_FONT_SIZE + 'px',
        color: UI_ACCENT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // START button text
    const buttonText = this.add.text(
      MENU_BUTTON_X,
      MENU_BUTTON_Y,
      'START',
      {
        fontSize: MENU_BUTTON_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // Button background
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

    // Set text color to dark for contrast on gold button
    buttonText.setColor(UI_BG_COLOR)
    buttonText.setDepth(MENU_BUTTON_DEPTH)

    // Interactive zone for the button
    const hitArea = this.add.zone(
      buttonText.x,
      buttonText.y,
      buttonText.width + MENU_BUTTON_PADDING_X + MENU_BUTTON_PADDING_X,
      buttonText.height + MENU_BUTTON_PADDING_Y + MENU_BUTTON_PADDING_Y
    ).setInteractive({ useHandCursor: true })

    hitArea.on('pointerdown', () => {
      this.scene.start('GameScene', { restart: true })
    })

    // PH6: Leaderboard button — game contract 2.3
    const lbY = MENU_BUTTON_Y + MENU_LEADERBOARD_BUTTON_OFFSET

    const lbText = this.add.text(
      MENU_BUTTON_X,
      lbY,
      LEADERBOARD_BUTTON_TEXT,
      {
        fontSize: MENU_BUTTON_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN).setInteractive({ useHandCursor: true })

    lbText.on('pointerover', () => { lbText.setColor(UI_ACCENT_COLOR) })
    lbText.on('pointerout', () => { lbText.setColor(UI_TEXT_COLOR) })

    lbText.on('pointerdown', () => {
      this.scene.start('LeaderboardScene')
    })

    // Keyboard shortcut — press SPACE or ENTER to start
    const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

    if (spaceKey) {
      spaceKey.on('down', () => {
        this.scene.start('GameScene', { restart: true })
      })
    }

    if (enterKey) {
      enterKey.on('down', () => {
        this.scene.start('GameScene', { restart: true })
      })
    }
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
