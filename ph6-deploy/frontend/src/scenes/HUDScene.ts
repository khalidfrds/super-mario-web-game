// src/scenes/HUDScene.ts
// HUD overlay: Score, Lives (hearts), Coins, Timer
// Stays alive alongside GameScene — never restarted on respawn

import Phaser from 'phaser'
import { GameState } from '../data/GameState'
import {
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  HUD_FONT_SIZE,
  HUD_PADDING,
  HUD_DEPTH,
  HUD_HEART_SPACING,
  HUD_COINS_ICON_OFFSET,
  LIVES_START,
  LEVEL_TIMER_START,
  TIMER_INTERVAL_MS,
  TIMER_DIGITS,
  GAME_WIDTH,
  CENTER_ORIGIN,
  RIGHT_ORIGIN
} from '../data/gameConfig'

export class HUDScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text
  private coinsText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private heartImages: Phaser.GameObjects.Image[] = []
  private timerValue: number = LEVEL_TIMER_START
  private timerEvent: Phaser.Time.TimerEvent | null = null

  constructor() {
    super({ key: 'HUDScene' })
  }

  create(): void {
    this.heartImages = []
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)')

    // Score — top left (read from GameState)
    this.scoreText = this.add.text(
      HUD_PADDING,
      HUD_PADDING,
      'SCORE: ' + GameState.score.toString(),
      {
        fontSize: HUD_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setScrollFactor(0).setDepth(HUD_DEPTH)

    // Lives — top center (read from GameState)
    const heartsStartX = GAME_WIDTH * CENTER_ORIGIN - HUD_HEART_SPACING
    for (let i = 0; i < LIVES_START; i++) {
      const texture = i < GameState.lives ? 'hud_heartFull' : 'hud_heartEmpty'
      const heart = this.add.image(
        heartsStartX + i * HUD_HEART_SPACING,
        HUD_PADDING + HUD_FONT_SIZE * CENTER_ORIGIN,
        texture
      ).setScrollFactor(0).setDepth(HUD_DEPTH)
      this.heartImages.push(heart)
    }

    // Coins
    const coinsX = GAME_WIDTH * CENTER_ORIGIN + HUD_HEART_SPACING + HUD_HEART_SPACING
    this.add.image(
      coinsX,
      HUD_PADDING + HUD_FONT_SIZE * CENTER_ORIGIN,
      'hud_coins'
    ).setScrollFactor(0).setDepth(HUD_DEPTH)

    this.coinsText = this.add.text(
      coinsX + HUD_PADDING + HUD_COINS_ICON_OFFSET,
      HUD_PADDING,
      'x' + GameState.coins.toString(),
      {
        fontSize: HUD_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setScrollFactor(0).setDepth(HUD_DEPTH)

    // Timer — top right
    this.timerValue = LEVEL_TIMER_START
    this.timerText = this.add.text(
      GAME_WIDTH - HUD_PADDING,
      HUD_PADDING,
      this.formatTimer(this.timerValue),
      {
        fontSize: HUD_FONT_SIZE + 'px',
        color: UI_ACCENT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(RIGHT_ORIGIN, 0).setScrollFactor(0).setDepth(HUD_DEPTH)

    // Listen for events from GameScene
    const gameScene = this.scene.get('GameScene')

    gameScene.events.on('scoreChanged', (score: number) => {
      this.scoreText.setText('SCORE: ' + score.toString())
    }, this)

    gameScene.events.on('coinsChanged', (coins: number) => {
      this.coinsText.setText('x' + coins.toString())
    }, this)

    gameScene.events.on('livesChanged', (lives: number) => {
      this.updateLivesDisplay(lives)
    }, this)

    gameScene.events.on('timerStop', () => {
      this.stopTimer()
    }, this)

    gameScene.events.on('timerReset', () => {
      this.resetTimer()
    }, this)

    this.startTimer()
  }

  private formatTimer(value: number): string {
    return value.toString().padStart(TIMER_DIGITS, '0')
  }

  private startTimer(): void {
    this.timerEvent = this.time.addEvent({
      delay: TIMER_INTERVAL_MS,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true
    })
  }

  private stopTimer(): void {
    if (this.timerEvent) {
      this.timerEvent.destroy()
      this.timerEvent = null
    }
  }

  private resetTimer(): void {
    this.stopTimer()
    this.timerValue = LEVEL_TIMER_START
    this.timerText.setText(this.formatTimer(this.timerValue))
    this.startTimer()
  }

  private tickTimer(): void {
    if (this.timerValue > 0) {
      this.timerValue--
      this.timerText.setText(this.formatTimer(this.timerValue))
    }
    if (this.timerValue <= 0) {
      this.stopTimer()
      const gameScene = this.scene.get('GameScene')
      gameScene.events.emit('timerExpired')
    }
  }

  private updateLivesDisplay(lives: number): void {
    if (!this.heartImages || this.heartImages.length === 0) {
      return
    }
    for (let i = 0; i < this.heartImages.length; i++) {
      if (!this.heartImages[i] || !this.heartImages[i].active) {
        continue
      }
      if (i < lives) {
        this.heartImages[i].setTexture('hud_heartFull')
      } else {
        this.heartImages[i].setTexture('hud_heartEmpty')
      }
    }
  }

  shutdown(): void {
    this.stopTimer()
    const gameScene = this.scene.get('GameScene')
    if (gameScene) {
      gameScene.events.off('scoreChanged', undefined, this)
      gameScene.events.off('coinsChanged', undefined, this)
      gameScene.events.off('livesChanged', undefined, this)
      gameScene.events.off('timerStop', undefined, this)
      gameScene.events.off('timerReset', undefined, this)
    }
    this.heartImages = []
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
