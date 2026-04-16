// src/objects/Koopa.ts
// Koopa enemy: patrol, stomp→shell, kick→shell_sliding

import Phaser from 'phaser'
import { KoopaState } from '../types'
import {
  KOOPA_SPEED_PATROL,
  KOOPA_SPEED_SHELL,
  KOOPA_W,
  KOOPA_H,
  KOOPA_SHELL_W,
  KOOPA_SHELL_H,
  TILE_SIZE,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  FULL_ALPHA
} from '../data/gameConfig'

export class Koopa extends Phaser.Physics.Arcade.Sprite {
  private currentState: KoopaState = 'patrolling'
  private startX: number
  private startY: number
  private edgeCheckOffset: number = TILE_SIZE

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'barnacle_move1')

    this.startX = x
    this.startY = y

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(KOOPA_W, KOOPA_H, true)

    // Start patrolling left
    this.setVelocityX(-KOOPA_SPEED_PATROL)
    this.play('koopa_walk')
  }

  getState(): KoopaState {
    return this.currentState
  }

  update(_time: number, _delta: number): void {
    if (!this.active) {
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.currentState === 'patrolling') {
      // Wall turn
      if (body.blocked.left) {
        this.setVelocityX(KOOPA_SPEED_PATROL)
      } else if (body.blocked.right) {
        this.setVelocityX(-KOOPA_SPEED_PATROL)
      }

      // Edge detection
      if (body.blocked.down) {
        const direction = body.velocity.x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT
        const aheadX = this.x + direction * this.edgeCheckOffset
        const belowY = this.y + TILE_SIZE

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

      // Flip sprite
      this.setFlipX(body.velocity.x > 0)
    } else if (this.currentState === 'shell_sliding') {
      // Wall bounce
      if (body.blocked.left) {
        this.setVelocityX(KOOPA_SPEED_SHELL)
      } else if (body.blocked.right) {
        this.setVelocityX(-KOOPA_SPEED_SHELL)
      }
    }
  }

  // Stomp from above → enter shell
  stomp(): void {
    if (this.currentState === 'patrolling') {
      this.currentState = 'in_shell'
      this.play('koopa_shell')
      this.setVelocityX(0)

      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(KOOPA_SHELL_W, KOOPA_SHELL_H, true)
    }
  }

  // Kick the shell → start sliding
  kick(playerX: number): void {
    if (this.currentState === 'in_shell') {
      this.currentState = 'shell_sliding'
      // Kick in direction away from player
      const direction = playerX < this.x ? DIRECTION_RIGHT : DIRECTION_LEFT
      this.setVelocityX(direction * KOOPA_SPEED_SHELL)
    }
  }

  // Shell hit from sliding shell → forced into shell
  forceIntoShell(): void {
    if (this.currentState === 'patrolling') {
      this.currentState = 'in_shell'
      this.play('koopa_shell')
      this.setVelocityX(0)

      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(KOOPA_SHELL_W, KOOPA_SHELL_H, true)
    }
  }

  resetEnemy(): void {
    this.currentState = 'patrolling'
    this.setPosition(this.startX, this.startY)
    this.setVelocityX(-KOOPA_SPEED_PATROL)
    this.setActive(true).setVisible(true)
    this.setAlpha(FULL_ALPHA)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.enable = true
    body.setSize(KOOPA_W, KOOPA_H, true)

    this.play('koopa_walk')
  }
}
