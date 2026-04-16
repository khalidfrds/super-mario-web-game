// src/scenes/WinScene.ts
// Final victory screen — PH6: name input + Submit + Leaderboard
// Tech contract section 4.1–4.5, 6.3

import Phaser from 'phaser'
import { resetGameState } from '../data/GameState'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  UI_BG_COLOR,
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  SUCCESS_COLOR,
  DANGER_COLOR,
  SCENE_TITLE_FONT_SIZE,
  SCENE_INFO_FONT_SIZE,
  SCENE_BUTTON_FONT_SIZE,
  SCENE_INFO_LINE_HEIGHT,
  CENTER_ORIGIN,
  WIN_TITLE_Y_DIVISOR,
  SCENE_LINE_OFFSET_2,
  SCENE_LINE_OFFSET_3,
  WIN_INPUT_WIDTH,
  WIN_INPUT_HEIGHT,
  WIN_INPUT_FONT_SIZE,
  WIN_INPUT_MAX_LENGTH,
  WIN_SUBMIT_BUTTON_Y_OFFSET,
  WIN_LEADERBOARD_BUTTON_Y_OFFSET,
  WIN_INPUT_BG_COLOR,
  WIN_INPUT_BORDER_WIDTH,
  WIN_INPUT_BORDER_RADIUS,
  API_FALLBACK_TEXT,
  SUBMIT_SUCCESS_TEXT,
  SUBMIT_BUTTON_TEXT,
  SUBMITTING_TEXT,
  LEADERBOARD_BUTTON_TEXT,
  PLAY_AGAIN_TEXT
} from '../data/gameConfig'

interface WinData {
  score: number
  lives: number
}

export class WinScene extends Phaser.Scene {
  // Tech contract 4.2: isSubmitting guard
  private isSubmitting: boolean = false
  private inputElement: HTMLInputElement | null = null

  constructor() {
    super({ key: 'WinScene' })
  }

  create(data: WinData): void {
    this.cameras.main.setBackgroundColor(UI_BG_COLOR)
    this.isSubmitting = false

    const centerX = GAME_WIDTH * CENTER_ORIGIN
    const titleY = GAME_HEIGHT / WIN_TITLE_Y_DIVISOR

    // Tech contract 4.1 step 2: render victory message
    this.add.text(
      centerX,
      titleY,
      'YOU WIN!',
      {
        fontSize: SCENE_TITLE_FONT_SIZE + 'px',
        color: SUCCESS_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // Tech contract 4.1 step 3: render final score
    this.add.text(
      centerX,
      titleY + SCENE_INFO_LINE_HEIGHT * SCENE_LINE_OFFSET_2,
      'Final Score: ' + data.score.toString(),
      {
        fontSize: SCENE_INFO_FONT_SIZE + 'px',
        color: UI_ACCENT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // Tech contract 4.1 step 4: render remaining lives
    this.add.text(
      centerX,
      titleY + SCENE_INFO_LINE_HEIGHT * SCENE_LINE_OFFSET_3,
      'Lives Remaining: ' + data.lives.toString(),
      {
        fontSize: SCENE_INFO_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // Tech contract 4.1 step 5: render player name input via DOM element
    const inputY = titleY + SCENE_INFO_LINE_HEIGHT * WIN_SUBMIT_BUTTON_Y_OFFSET - SCENE_INFO_LINE_HEIGHT

    // Label
    this.add.text(
      centerX,
      inputY - WIN_INPUT_HEIGHT,
      'Enter your name:',
      {
        fontSize: WIN_INPUT_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // DOM input element
    this.inputElement = document.createElement('input')
    this.inputElement.type = 'text'
    this.inputElement.maxLength = WIN_INPUT_MAX_LENGTH
    this.inputElement.placeholder = 'Player'
    this.inputElement.style.cssText =
      'position:absolute;' +
      'width:' + WIN_INPUT_WIDTH + 'px;' +
      'height:' + WIN_INPUT_HEIGHT + 'px;' +
      'font-size:' + WIN_INPUT_FONT_SIZE + 'px;' +
      'text-align:center;' +
      'border:' + WIN_INPUT_BORDER_WIDTH + 'px solid ' + UI_ACCENT_COLOR + ';' +
      'border-radius:' + WIN_INPUT_BORDER_RADIUS + 'px;' +
      'background:' + WIN_INPUT_BG_COLOR + ';' +
      'color:' + UI_TEXT_COLOR + ';' +
      'outline:none;'

    // Position the input relative to the canvas
    const canvas = this.game.canvas
    const rect = canvas.getBoundingClientRect()
    const scaleX = rect.width / GAME_WIDTH
    const scaleY = rect.height / GAME_HEIGHT
    this.inputElement.style.left = (rect.left + centerX * scaleX - WIN_INPUT_WIDTH * scaleX * CENTER_ORIGIN) + 'px'
    this.inputElement.style.top = (rect.top + inputY * scaleY - WIN_INPUT_HEIGHT * scaleY * CENTER_ORIGIN) + 'px'
    this.inputElement.style.transform = 'scale(' + scaleX + ',' + scaleY + ')'
    this.inputElement.style.transformOrigin = 'top left'

    document.body.appendChild(this.inputElement)

    // Tech contract 4.1 step 6: render Submit action
    const submitBtnY = titleY + SCENE_INFO_LINE_HEIGHT * WIN_SUBMIT_BUTTON_Y_OFFSET

    const submitText = this.add.text(
      centerX,
      submitBtnY,
      SUBMIT_BUTTON_TEXT,
      {
        fontSize: SCENE_BUTTON_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN).setInteractive({ useHandCursor: true })

    // Status text (below submit button)
    const statusText = this.add.text(
      centerX,
      submitBtnY + SCENE_INFO_LINE_HEIGHT,
      '',
      {
        fontSize: WIN_INPUT_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    submitText.on('pointerover', () => {
      if (!this.isSubmitting) { submitText.setColor(UI_ACCENT_COLOR) }
    })
    submitText.on('pointerout', () => {
      if (!this.isSubmitting) { submitText.setColor(UI_TEXT_COLOR) }
    })

    submitText.on('pointerdown', () => {
      this.handleSubmit(data.score, submitText, statusText)
    })

    // Play Again button (always available)
    const playAgainY = titleY + SCENE_INFO_LINE_HEIGHT * WIN_LEADERBOARD_BUTTON_Y_OFFSET

    const playAgainText = this.add.text(
      centerX,
      playAgainY + SCENE_INFO_LINE_HEIGHT,
      PLAY_AGAIN_TEXT,
      {
        fontSize: WIN_INPUT_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN).setInteractive({ useHandCursor: true })

    playAgainText.on('pointerover', () => { playAgainText.setColor(UI_ACCENT_COLOR) })
    playAgainText.on('pointerout', () => { playAgainText.setColor(UI_TEXT_COLOR) })

    playAgainText.on('pointerdown', () => {
      this.cleanupInput()
      resetGameState()
      this.scene.stop('WinScene')
      this.scene.stop('HUDScene')
      this.scene.stop('GameScene')
      this.scene.start('GameScene', { restart: true })
    })
  }

  // Tech contract 4.2–4.4: Submit flow
  private handleSubmit(
    finalScore: number,
    submitText: Phaser.GameObjects.Text,
    statusText: Phaser.GameObjects.Text
  ): void {
    // Tech contract 4.2 step 1: guard isSubmitting
    if (this.isSubmitting) { return }

    // Tech contract 4.2 step 2-3: read and trim name
    const rawName = this.inputElement?.value || ''
    const trimmedName = rawName.trim()

    // Tech contract 4.2 step 4: guard empty name — edge case 5.2
    if (trimmedName.length === 0) {
      statusText.setText('Please enter a name')
      statusText.setColor(DANGER_COLOR)
      return
    }

    // Tech contract 4.2 step 6-7: isSubmitting = true, disable UI
    this.isSubmitting = true
    submitText.setText(SUBMITTING_TEXT)
    submitText.disableInteractive()
    statusText.setText('')

    // Tech contract 4.2 step 8: POST request
    const apiUrl = import.meta.env.VITE_API_URL || ''

    if (!apiUrl) {
      // Edge case 5.8: no API URL configured
      statusText.setText(API_FALLBACK_TEXT)
      statusText.setColor(DANGER_COLOR)
      submitText.setText(SUBMIT_BUTTON_TEXT)
      submitText.setInteractive({ useHandCursor: true })
      this.isSubmitting = false
      return
    }

    fetch(apiUrl + '/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName, score: finalScore })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed')
        }
        return response.json()
      })
      .then(() => {
        // Tech contract 4.3: submit success
        statusText.setText(SUBMIT_SUCCESS_TEXT)
        statusText.setColor(SUCCESS_COLOR)

        // Replace submit button with Leaderboard button — tech contract 4.3 step 5
        submitText.setText(LEADERBOARD_BUTTON_TEXT)
        submitText.setColor(UI_ACCENT_COLOR)
        submitText.setInteractive({ useHandCursor: true })
        submitText.removeAllListeners()

        submitText.on('pointerdown', () => {
          // Tech contract 4.5: WinScene → LeaderboardScene
          this.cleanupInput()
          this.scene.stop('WinScene')
          this.scene.stop('GameScene')
          this.scene.start('LeaderboardScene')
        })

        this.isSubmitting = false
      })
      .catch(() => {
        // Tech contract 4.4: submit failure — edge case 5.1
        statusText.setText(API_FALLBACK_TEXT)
        statusText.setColor(DANGER_COLOR)
        submitText.setText(SUBMIT_BUTTON_TEXT)
        submitText.setInteractive({ useHandCursor: true })
        this.isSubmitting = false
      })
  }

  // Cleanup DOM input element
  private cleanupInput(): void {
    if (this.inputElement && this.inputElement.parentNode) {
      this.inputElement.parentNode.removeChild(this.inputElement)
      this.inputElement = null
    }
  }

  shutdown(): void {
    this.cleanupInput()
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
