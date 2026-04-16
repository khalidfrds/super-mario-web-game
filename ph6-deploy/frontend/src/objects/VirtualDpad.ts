// src/objects/VirtualDpad.ts
// Virtual D-pad for mobile controls — multitouch fix

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

  private leftBounds!: Phaser.Geom.Rectangle
  private rightBounds!: Phaser.Geom.Rectangle
  private jumpBounds!: Phaser.Geom.Rectangle

  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    // Enable up to 4 simultaneous touch points
    scene.input.addPointer(3)

    const bottom = scene.scale.height - VIRTUAL_BTN_MARGIN

    // LEFT button
    const leftX = VIRTUAL_BTN_MARGIN + VIRTUAL_BTN_HALF
    const leftY = bottom - VIRTUAL_BTN_HALF
    this.leftBtn = scene.add
      .rectangle(leftX, leftY, VIRTUAL_BTN_SIZE, VIRTUAL_BTN_SIZE, DPAD_ARROW_COLOR, VIRTUAL_BTN_ALPHA)
      .setScrollFactor(0)
      .setDepth(VIRTUAL_BTN_DEPTH)

    this.leftLabel = scene.add
      .text(leftX, leftY, '\u25C0', { fontSize: DPAD_LABEL_FONT_SIZE + 'px', color: '#000000' })
      .setOrigin(CENTER_ORIGIN)
      .setScrollFactor(0)
      .setDepth(DPAD_LABEL_DEPTH)

    this.leftBounds = new Phaser.Geom.Rectangle(
      leftX - VIRTUAL_BTN_HALF, leftY - VIRTUAL_BTN_HALF,
      VIRTUAL_BTN_SIZE, VIRTUAL_BTN_SIZE
    )

    // RIGHT button
    const rightX = VIRTUAL_BTN_MARGIN + VIRTUAL_BTN_SIZE + VIRTUAL_BTN_GAP + VIRTUAL_BTN_HALF
    const rightY = bottom - VIRTUAL_BTN_HALF
    this.rightBtn = scene.add
      .rectangle(rightX, rightY, VIRTUAL_BTN_SIZE, VIRTUAL_BTN_SIZE, DPAD_ARROW_COLOR, VIRTUAL_BTN_ALPHA)
      .setScrollFactor(0)
      .setDepth(VIRTUAL_BTN_DEPTH)

    this.rightLabel = scene.add
      .text(rightX, rightY, '\u25B6', { fontSize: DPAD_LABEL_FONT_SIZE + 'px', color: '#000000' })
      .setOrigin(CENTER_ORIGIN)
      .setScrollFactor(0)
      .setDepth(DPAD_LABEL_DEPTH)

    this.rightBounds = new Phaser.Geom.Rectangle(
      rightX - VIRTUAL_BTN_HALF, rightY - VIRTUAL_BTN_HALF,
      VIRTUAL_BTN_SIZE, VIRTUAL_BTN_SIZE
    )

    // JUMP button
    const jumpX = scene.scale.width - VIRTUAL_BTN_MARGIN - VIRTUAL_BTN_HALF
    const jumpY = bottom - VIRTUAL_BTN_HALF
    this.jumpBtn = scene.add
      .rectangle(jumpX, jumpY, VIRTUAL_BTN_SIZE, VIRTUAL_BTN_SIZE, DPAD_JUMP_COLOR, VIRTUAL_BTN_ALPHA)
      .setScrollFactor(0)
      .setDepth(VIRTUAL_BTN_DEPTH)

    this.jumpLabel = scene.add
      .text(jumpX, jumpY, '\u25B2', { fontSize: DPAD_LABEL_FONT_SIZE + 'px', color: '#000000' })
      .setOrigin(CENTER_ORIGIN)
      .setScrollFactor(0)
      .setDepth(DPAD_LABEL_DEPTH)

    this.jumpBounds = new Phaser.Geom.Rectangle(
      jumpX - VIRTUAL_BTN_HALF, jumpY - VIRTUAL_BTN_HALF,
      VIRTUAL_BTN_SIZE, VIRTUAL_BTN_SIZE
    )

    // Listen at scene level — handles all touches simultaneously
    scene.input.on('pointerdown', this.updateState, this)
    scene.input.on('pointermove', this.updateState, this)
    scene.input.on('pointerup', this.updateState, this)
  }

  private updateState(): void {
    this.leftPressed = false
    this.rightPressed = false
    this.jumpPressed = false

    const manager = this.scene.input
    const pointers = [
      manager.pointer1,
      manager.pointer2,
      manager.pointer3,
      manager.pointer4
    ]

    for (const ptr of pointers) {
      if (!ptr.isDown) continue
      const x = ptr.x
      const y = ptr.y
      if (Phaser.Geom.Rectangle.Contains(this.leftBounds, x, y))  this.leftPressed  = true
      if (Phaser.Geom.Rectangle.Contains(this.rightBounds, x, y)) this.rightPressed = true
      if (Phaser.Geom.Rectangle.Contains(this.jumpBounds, x, y))  this.jumpPressed  = true
    }
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.updateState, this)
    this.scene.input.off('pointermove', this.updateState, this)
    this.scene.input.off('pointerup', this.updateState, this)
    this.leftBtn.destroy()
    this.rightBtn.destroy()
    this.jumpBtn.destroy()
    this.leftLabel.destroy()
    this.rightLabel.destroy()
    this.jumpLabel.destroy()
  }
}