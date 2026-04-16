// src/objects/QuestionBlock.ts
// ?-block: active → bumping → empty. StaticBody with bump tween.

import Phaser from 'phaser'
import { QuestionBlockState } from '../types'
import {
  QUESTION_BLOCK_W,
  QUESTION_BLOCK_H,
  BUMP_HEIGHT,
  BUMP_DURATION_MS,
  BUMP_HALF_DIVISOR,
  BLOCK_COIN_RISE_HEIGHT,
  BLOCK_COIN_DISPLAY_MS,
  COIN_SCORE,
  MUSHROOM_W,
  MUSHROOM_H,
  MUSHROOM_EMERGE_HEIGHT,
  MUSHROOM_EMERGE_DURATION_MS,
  MUSHROOM_SPEED
} from '../data/gameConfig'
import { Mushroom } from './Mushroom'

export class QuestionBlock extends Phaser.Physics.Arcade.Sprite {
  private currentState: QuestionBlockState = 'active'
  private isBumping: boolean = false
  private content: 'coin' | 'mushroom'
  private startX: number
  private startY: number
  private mushroomsGroup: Phaser.Physics.Arcade.Group | null = null
  private gameScene: Phaser.Scene

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    content: 'coin' | 'mushroom'
  ) {
    super(scene, x, y, 'boxItem')

    this.gameScene = scene
    this.content = content
    this.startX = x
    this.startY = y

    scene.add.existing(this)
    scene.physics.add.existing(this, true)

    // Hitbox order per tech contract 1.1:
    // 1. setDisplaySize
    // 2. body.setSize(W, H, true)
    // 3. updateFromGameObject()
    this.setDisplaySize(QUESTION_BLOCK_W, QUESTION_BLOCK_H)
    const body = this.body as Phaser.Physics.Arcade.StaticBody
    body.setSize(QUESTION_BLOCK_W, QUESTION_BLOCK_H, true)
    body.updateFromGameObject()
  }

  getState(): QuestionBlockState {
    return this.currentState
  }

  getIsBumping(): boolean {
    return this.isBumping
  }

  getContent(): 'coin' | 'mushroom' {
    return this.content
  }

  setMushroomsGroup(group: Phaser.Physics.Arcade.Group): void {
    this.mushroomsGroup = group
  }

  // Called from GameScene collider callback
  // Tech contract 3.2 guard order:
  // 1. state !== 'active' → return
  // 2. !pBody.blocked.up → return
  // 3. player.y <= block.y → return
  // 4. isBumping → return
  hit(): void {
    // Guard: only active blocks respond
    if (this.currentState !== 'active') {
      return
    }

    // Guard: prevent re-hit during bump
    if (this.isBumping) {
      return
    }

    // Tech contract 4.1: active → bumping
    this.currentState = 'bumping'
    this.isBumping = true

    // Store original Y for tween
    const originalY = this.y

    // Bump tween: move up then back down
    this.scene.tweens.add({
      targets: this,
      y: originalY - BUMP_HEIGHT,
      duration: BUMP_DURATION_MS / BUMP_HALF_DIVISOR,
      ease: 'Quad.easeOut',
      yoyo: true,
      onUpdate: () => {
        // Sync StaticBody during tween (tech contract 4.1 step 7)
        const body = this.body as Phaser.Physics.Arcade.StaticBody
        body.updateFromGameObject()
      },
      onComplete: () => {
        // Tech contract 4.2: bumping → empty
        // 1. sync StaticBody
        const body = this.body as Phaser.Physics.Arcade.StaticBody
        body.updateFromGameObject()

        // 2. spawnContent
        this.spawnContent()

        // 3. switch to empty visual
        this.setTexture('boxEmpty')

        // 4. state = empty
        this.currentState = 'empty'

        // 5. isBumping = false
        this.isBumping = false
      }
    })
  }

  private spawnContent(): void {
    if (this.content === 'coin') {
      this.spawnCoin()
    } else {
      this.spawnMushroom()
    }
  }

  // Tech contract 4.3: spawn temporary coin visual
  private spawnCoin(): void {
    // Create temporary visual coin above block
    const coinVisual = this.scene.add.sprite(this.x, this.y, 'coinGold')
    coinVisual.play('coin_spin')

    // Tween coin upward then destroy
    this.scene.tweens.add({
      targets: coinVisual,
      y: this.y - BLOCK_COIN_RISE_HEIGHT,
      alpha: 0,
      duration: BLOCK_COIN_DISPLAY_MS,
      ease: 'Quad.easeOut',
      onComplete: () => {
        coinVisual.destroy()
      }
    })

    // Emit score and coins update
    this.scene.events.emit('blockCoinCollected')
  }

  // Tech contract 4.4: spawn mushroom
  private spawnMushroom(): void {
    if (!this.mushroomsGroup) {
      return
    }

    // Step 2: create Mushroom in mushrooms group
    const mushroom = new Mushroom(
      this.scene,
      this.x,
      this.y
    )
    this.mushroomsGroup.add(mushroom)

    // Step 3: initial state = idle
    // (set in Mushroom constructor)

    // Step 4: setVisible(false)
    mushroom.setVisible(false)

    // Step 5: disable body for idle state
    const mBody = mushroom.body as Phaser.Physics.Arcade.Body
    mBody.enable = false

    // Step 6-7: hitbox order (done in Mushroom constructor)

    // Step 8: place aligned to block top
    mushroom.setPosition(this.x, this.y)

    // Step 9: zero horizontal velocity
    mushroom.setVelocity(0, 0)

    // Step 10-15: trigger emerge sequence
    // Make visible
    mushroom.setVisible(true)

    // Enable body
    mBody.enable = true
    mBody.setAllowGravity(false)

    // State = emerging
    mushroom.setCurrentState('emerging')

    // Emerge tween: rise up from block
    this.scene.tweens.add({
      targets: mushroom,
      y: this.y - MUSHROOM_EMERGE_HEIGHT,
      duration: MUSHROOM_EMERGE_DURATION_MS,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // Tech contract 4.5: emerging → moving
        mushroom.startMoving()
      }
    })
  }

  // Reset block to initial state for respawn
  resetBlock(): void {
    this.currentState = 'active'
    this.isBumping = false
    this.setTexture('boxItem')
    this.setPosition(this.startX, this.startY)

    // Re-sync StaticBody
    const body = this.body as Phaser.Physics.Arcade.StaticBody
    body.updateFromGameObject()
  }
}
