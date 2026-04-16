// src/objects/Goomba.ts
// Goomba enemy: patrol, wall/edge turn, stomp to defeat

import Phaser from 'phaser'
import { GoombaState } from '../types'
import {
  GOOMBA_SPEED,
  GOOMBA_W,
  GOOMBA_H,
  GOOMBA_DEATH_DELAY_MS,
  TILE_SIZE,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  FULL_ALPHA
} from '../data/gameConfig'

export class Goomba extends Phaser.Physics.Arcade.Sprite {
  private currentState: GoombaState = 'patrolling'
  private startX: number
  private startY: number
  private edgeCheckOffset: number = TILE_SIZE

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'slimeWalk1')

    this.startX = x
    this.startY = y

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(GOOMBA_W, GOOMBA_H, true)
    body.setCollideWorldBounds(false)
    body.setBounceX(0)

    // Start patrolling left
    this.setVelocityX(-GOOMBA_SPEED)
    this.play('goomba_walk')
  }

  getState(): GoombaState {
    return this.currentState
  }

  update(_time: number, _delta: number): void {
    if (this.currentState !== 'patrolling') {
      return
    }

    if (!this.active) {
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body

    // Wall turn: reverse direction on horizontal block
    if (body.blocked.left) {
      this.setVelocityX(GOOMBA_SPEED)
    } else if (body.blocked.right) {
      this.setVelocityX(-GOOMBA_SPEED)
    }

    // Edge detection: check if there is ground ahead
    if (body.blocked.down) {
      const direction = body.velocity.x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT
      const aheadX = this.x + direction * this.edgeCheckOffset
      const belowY = this.y + TILE_SIZE

      // Check if any platform exists at the position ahead and below
      const platforms = this.scene.physics.world.staticBodies
      let hasGroundAhead = false

      platforms.entries.forEach((staticBody) => {
        const bx = staticBody.x; const by = staticBody.y; const bw = staticBody.width; const bh = staticBody.height
        if (
          aheadX >= bx &&
          aheadX <= bx + bw &&
          belowY >= by &&
          belowY <= by + bh
        ) {
          hasGroundAhead = true
        }
      })

      if (!hasGroundAhead) {
        this.setVelocityX(-body.velocity.x)
      }
    }

    // Flip sprite based on direction
    this.setFlipX(body.velocity.x > 0)
  }

  stomp(): void {
    if (this.currentState === 'dead') {
      return
    }

    this.currentState = 'dead'
    this.play('goomba_dead')
    this.setVelocityX(0)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.enable = false

    // Disappear after delay
    this.scene.time.delayedCall(GOOMBA_DEATH_DELAY_MS, () => {
      this.setActive(false).setVisible(false)
    })
  }

  resetEnemy(): void {
    this.currentState = 'patrolling'
    this.setPosition(this.startX, this.startY)
    this.setVelocityX(-GOOMBA_SPEED)
    this.setActive(true).setVisible(true)
    this.setAlpha(FULL_ALPHA)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.enable = true

    this.play('goomba_walk')
  }
}
