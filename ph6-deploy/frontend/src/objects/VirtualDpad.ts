// src/objects/VirtualDpad.ts
// Virtual D-pad for mobile controls

import Phaser from 'phaser'
import {
  VIRTUAL_BTN_SIZE,
  VIRTUAL_BTN_MARGIN,
  VIRTUAL_BTN_ALPHA,
  VIRTUAL_BTN_DEPTH,
  VIRTUAL_BTN_GAP,
  VIRTUAL_BTN_HALF,
  DPAD_ARROW_COLOR,
  DPAD_JUMP_COLOR,
  DPAD_LABEL_FONT_SIZE,
  CENTER_ORIGIN,
  DPAD_LABEL_DEPTH
} from '../data/gameConfig'

export class VirtualDpad {
  public leftPressed: boolean = false
  public rightPressed: boolean = false
  public jumpPressed: boolean = false

  private leftBtn!: Phaser.GameObjects.Rectangle
  private rightBtn!: Phaser.GameObjects.Rectangle
  private jumpBtn!: Phaser.GameObjects.Rectangle
  private leftLabel!: Phaser.GameObjects.Text
  private rightLabel!: Phaser.GameObjects.Text
  private jumpLabel!: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    const bottom = scene.scale.height - VIRTUAL_BTN_MARGIN

    // LEFT button — bottom left corner
    this.leftBtn = scene.add
      .rectangle(
        VIRTUAL_BTN_MARGIN + VIRTUAL_BTN_HALF,
        bottom - VIRTUAL_BTN_HALF,
        VIRTUAL_BTN_SIZE,
        VIRTUAL_BTN_SIZE,
        DPAD_ARROW_COLOR,
        VIRTUAL_BTN_ALPHA
      )
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(VIRTUAL_BTN_DEPTH)

    this.leftLabel = scene.add
      .text(
        VIRTUAL_BTN_MARGIN + VIRTUAL_BTN_HALF,
        bottom - VIRTUAL_BTN_HALF,
        '\u25C0',
        {
          fontSize: DPAD_LABEL_FONT_SIZE + 'px',
          color: '#000000'
        }
      )
      .setOrigin(CENTER_ORIGIN)
      .setScrollFactor(0)
      .setDepth(DPAD_LABEL_DEPTH)

    this.leftBtn.on('pointerdown', () => { this.leftPressed = true })
    this.leftBtn.on('pointerup', () => { this.leftPressed = false })
    this.leftBtn.on('pointerout', () => { this.leftPressed = false })

    // RIGHT button — next to LEFT
    const rightX = VIRTUAL_BTN_MARGIN + VIRTUAL_BTN_SIZE + VIRTUAL_BTN_GAP + VIRTUAL_BTN_HALF
    this.rightBtn = scene.add
      .rectangle(
        rightX,
        bottom - VIRTUAL_BTN_HALF,
        VIRTUAL_BTN_SIZE,
        VIRTUAL_BTN_SIZE,
        DPAD_ARROW_COLOR,
        VIRTUAL_BTN_ALPHA
      )
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(VIRTUAL_BTN_DEPTH)

    this.rightLabel = scene.add
      .text(
        rightX,
        bottom - VIRTUAL_BTN_HALF,
        '\u25B6',
        {
          fontSize: DPAD_LABEL_FONT_SIZE + 'px',
          color: '#000000'
        }
      )
      .setOrigin(CENTER_ORIGIN)
      .setScrollFactor(0)
      .setDepth(DPAD_LABEL_DEPTH)

    this.rightBtn.on('pointerdown', () => { this.rightPressed = true })
    this.rightBtn.on('pointerup', () => { this.rightPressed = false })
    this.rightBtn.on('pointerout', () => { this.rightPressed = false })

    // JUMP button — bottom right corner
    const jumpX = scene.scale.width - VIRTUAL_BTN_MARGIN - VIRTUAL_BTN_HALF
    this.jumpBtn = scene.add
      .rectangle(
        jumpX,
        bottom - VIRTUAL_BTN_HALF,
        VIRTUAL_BTN_SIZE,
        VIRTUAL_BTN_SIZE,
        DPAD_JUMP_COLOR,
        VIRTUAL_BTN_ALPHA
      )
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(VIRTUAL_BTN_DEPTH)

    this.jumpLabel = scene.add
      .text(
        jumpX,
        bottom - VIRTUAL_BTN_HALF,
        '\u25B2',
        {
          fontSize: DPAD_LABEL_FONT_SIZE + 'px',
          color: '#000000'
        }
      )
      .setOrigin(CENTER_ORIGIN)
      .setScrollFactor(0)
      .setDepth(DPAD_LABEL_DEPTH)

    this.jumpBtn.on('pointerdown', () => { this.jumpPressed = true })
    this.jumpBtn.on('pointerup', () => { this.jumpPressed = false })
    this.jumpBtn.on('pointerout', () => { this.jumpPressed = false })
  }

  destroy(): void {
    this.leftBtn.destroy()
    this.rightBtn.destroy()
    this.jumpBtn.destroy()
    this.leftLabel.destroy()
    this.rightLabel.destroy()
    this.jumpLabel.destroy()
  }
}
