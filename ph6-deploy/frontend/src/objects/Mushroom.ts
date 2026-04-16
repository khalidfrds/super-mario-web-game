// src/objects/Mushroom.ts
// Mushroom power-up: idle → emerging → moving → collected
// Reverses on wall (blocked.left/right), falls off edges.

import Phaser from 'phaser'
import { MushroomState } from '../types'
import {
  MUSHROOM_W,
  MUSHROOM_H,
  MUSHROOM_DISPLAY_W,
  MUSHROOM_DISPLAY_H,
  MUSHROOM_SPEED,
  DIRECTION_LEFT,
  DIRECTION_RIGHT
} from '../data/gameConfig'

export class Mushroom extends Phaser.Physics.Arcade.Sprite {
  private currentState: MushroomState = 'idle'
  // Tech contract 1.2: direction stored as separate flag, not derived from scaleX
  private directionX: number = DIRECTION_RIGHT

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mushroomRed')

    scene.add.existing(this)

    // Display size — larger visual proportional to 70px tiles
    this.setDisplaySize(MUSHROOM_DISPLAY_W, MUSHROOM_DISPLAY_H)
  }

  getState(): MushroomState {
    return this.currentState
  }

  setCurrentState(state: MushroomState): void {
    this.currentState = state
  }

  // Tech contract 4.5: emerging → moving
  startMoving(): void {
    if (this.currentState !== 'emerging') {
      return
    }

    this.currentState = 'moving'

    // Initial direction: right
    this.directionX = DIRECTION_RIGHT

    // Apply velocity
    this.setVelocityX(this.directionX * MUSHROOM_SPEED)

    // Enable gravity for moving state
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(true)

    // Hitbox: display + body via frame dims
    this.setDisplaySize(MUSHROOM_DISPLAY_W, MUSHROOM_DISPLAY_H)
    body.setSize(this.frame.realWidth, this.frame.realHeight, true)
  }

  update(_time: number, _delta: number): void {
    if (this.currentState !== 'moving') {
      return
    }

    if (!this.active) {
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body

    // Tech contract 3.4 & 4.6: wall turn via blocked flags only
    // Tech contract 3.5: NO edge turn — mushroom falls off edges
    if (body.blocked.left) {
      this.directionX = DIRECTION_RIGHT
      this.setVelocityX(this.directionX * MUSHROOM_SPEED)
    } else if (body.blocked.right) {
      this.directionX = DIRECTION_LEFT
      this.setVelocityX(this.directionX * MUSHROOM_SPEED)
    }
  }

  // Tech contract 4.7: moving → collected
  collect(): void {
    if (this.currentState !== 'moving') {
      return
    }

    this.currentState = 'collected'
    this.disableBody(true, true)
  }
}
