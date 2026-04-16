// src/objects/Player.ts
// Mario player with state machine and feel parameters

import Phaser from 'phaser'
import { PlayerState } from '../types'
import {
  PLAYER_MOVE_SPEED,
  PLAYER_JUMP_VELOCITY,
  PLAYER_MIN_JUMP_VELOCITY,
  PLAYER_MAX_FALL_SPEED,
  COYOTE_TIME_MS,
  JUMP_BUFFER_MS,
  STOMP_BOUNCE_VELOCITY,
  MARIO_SMALL_W,
  MARIO_SMALL_H,
  MARIO_BIG_W,
  MARIO_BIG_H,
  MARIO_DISPLAY_SMALL_W,
  MARIO_DISPLAY_SMALL_H,
  MARIO_DISPLAY_BIG_W,
  MARIO_DISPLAY_BIG_H,
  GAME_HEIGHT,
  DEATH_BOUNDARY_OFFSET,
  INVINCIBILITY_MS,
  INVINCIBILITY_BLINK_CYCLE,
  INVINCIBILITY_ALPHA_DIM,
  FULL_ALPHA,
  BLINK_PHASE_MODULO
} from '../data/gameConfig'

export class Player extends Phaser.Physics.Arcade.Sprite {
  // State machine
  private currentState: PlayerState = 'idle'

  // Feel parameters — timers as numbers (not boolean flags)
  private coyoteTimer: number = 0
  private jumpBuffered: boolean = false
  private jumpBufferTimer: number = 0
  private isJumping: boolean = false
  private jumpKeyHeld: boolean = false
  private wasOnGround: boolean = false

  // Input references
  private keyLeft!: Phaser.Input.Keyboard.Key
  private keyRight!: Phaser.Input.Keyboard.Key
  private keyUp!: Phaser.Input.Keyboard.Key
  private keyA!: Phaser.Input.Keyboard.Key
  private keyD!: Phaser.Input.Keyboard.Key
  private keyW!: Phaser.Input.Keyboard.Key
  private keySpace!: Phaser.Input.Keyboard.Key

  // Virtual d-pad reference
  private dpadLeftPressed: boolean = false
  private dpadRightPressed: boolean = false
  private dpadJumpPressed: boolean = false
  private dpadJumpJustPressed: boolean = false
  private dpadJumpPrevPressed: boolean = false

  // Dying flag to prevent multiple death triggers
  private isDying: boolean = false

  // PH3: Invincibility after taking damage
  private isInvincible: boolean = false
  private invincibilityTimer: number = 0

  // PH4: Power-up state — isBig affects only display size, not hitbox
  private isBig: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'alienGreen_stand')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Hitbox: setDisplaySize with DISPLAY constants → body matches via frame dims
    this.setDisplaySize(MARIO_DISPLAY_SMALL_W, MARIO_DISPLAY_SMALL_H)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.frame.realWidth, this.frame.realHeight, true)
    body.setCollideWorldBounds(false)
    body.setMaxVelocity(PLAYER_MOVE_SPEED, PLAYER_MAX_FALL_SPEED)

    // Setup keyboard input
    if (scene.input.keyboard) {
      this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
      this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
      this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
      this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    // Start in idle state
    this.play('mario_idle')
  }

  // Called by VirtualDpad to update touch state
  setDpadState(left: boolean, right: boolean, jump: boolean): void {
    this.dpadLeftPressed = left
    this.dpadRightPressed = right
    this.dpadJumpJustPressed = jump && !this.dpadJumpPrevPressed
    this.dpadJumpPressed = jump
    this.dpadJumpPrevPressed = jump
  }

  getState(): PlayerState {
    return this.currentState
  }

  update(_time: number, delta: number): void {
    // Don't update if dying
    if (this.isDying) {
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body
    const onGround = body.blocked.down

    // Check if fell below the world boundary
    if (this.y > this.scene.physics.world.bounds.height + DEATH_BOUNDARY_OFFSET) {
      this.die()
      return
    }

    // Read input
    const leftHeld = this.keyLeft?.isDown || this.keyA?.isDown || this.dpadLeftPressed
    const rightHeld = this.keyRight?.isDown || this.keyD?.isDown || this.dpadRightPressed
    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.keyUp) ||
      Phaser.Input.Keyboard.JustDown(this.keyW) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace) ||
      this.dpadJumpJustPressed
    const jumpHeld = this.keyUp?.isDown || this.keyW?.isDown ||
      this.keySpace?.isDown || this.dpadJumpPressed

    // COYOTE TIME: start timer when leaving ground
    if (this.wasOnGround && !onGround && !this.isJumping) {
      this.coyoteTimer = COYOTE_TIME_MS
    }
    if (this.coyoteTimer > 0) {
      this.coyoteTimer -= delta
    }

    // JUMP BUFFER: start on jump press
    if (jumpJustPressed) {
      this.jumpBuffered = true
      this.jumpBufferTimer = JUMP_BUFFER_MS
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= delta
    } else {
      this.jumpBuffered = false
    }

    // Horizontal movement
    if (leftHeld && !rightHeld) {
      this.setVelocityX(-PLAYER_MOVE_SPEED)
      this.setFlipX(true)
    } else if (rightHeld && !leftHeld) {
      this.setVelocityX(PLAYER_MOVE_SPEED)
      this.setFlipX(false)
    } else {
      this.setVelocityX(0)
    }

    // JUMP EXECUTION: jump if on ground OR coyote active, AND buffer active or just pressed
    const canJump = onGround || this.coyoteTimer > 0
    const wantsJump = jumpJustPressed || this.jumpBuffered

    if (wantsJump && canJump) {
      this.setVelocityY(PLAYER_JUMP_VELOCITY)
      this.isJumping = true
      this.coyoteTimer = 0
      this.jumpBuffered = false
      this.jumpBufferTimer = 0

      // PH6: Emit jump event for SoundManager — tech contract 4.9
      this.scene.events.emit('playerJumped')
    }

    // VARIABLE JUMP: cut jump height on early release
    this.jumpKeyHeld = jumpHeld
    if (this.isJumping && !this.jumpKeyHeld) {
      const vy = body.velocity.y
      if (vy < PLAYER_MIN_JUMP_VELOCITY) {
        this.setVelocityY(PLAYER_MIN_JUMP_VELOCITY)
      }
    }

    // Reset jumping flag on landing
    if (onGround) {
      this.isJumping = false
    }

    // Update state machine
    this.updateState(onGround, leftHeld || rightHeld)

    // Update animation
    this.updateAnimation()

    // PH3: Invincibility blink countdown
    if (this.isInvincible) {
      this.invincibilityTimer -= delta
      const blinkPhase = Math.floor(this.invincibilityTimer / INVINCIBILITY_BLINK_CYCLE) % BLINK_PHASE_MODULO
      this.setAlpha(blinkPhase === 0 ? FULL_ALPHA : INVINCIBILITY_ALPHA_DIM)
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false
        this.invincibilityTimer = 0
        this.setAlpha(FULL_ALPHA)
      }
    }

    // Store ground state for next frame
    this.wasOnGround = onGround
  }

  private updateState(onGround: boolean, isMoving: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.currentState === 'dying') {
      return
    }

    if (onGround) {
      if (isMoving) {
        this.currentState = 'walking'
      } else {
        this.currentState = 'idle'
      }
    } else {
      if (body.velocity.y < 0) {
        this.currentState = 'jumping'
      } else {
        this.currentState = 'falling'
      }
    }
  }

  private updateAnimation(): void {
    switch (this.currentState) {
      case 'idle':
        this.play('mario_idle', true)
        break
      case 'walking':
        this.play('mario_walk', true)
        break
      case 'jumping':
      case 'falling':
        this.play('mario_jump', true)
        break
      case 'dying':
        this.play('mario_die', true)
        break
    }
  }

  die(): void {
    if (this.isDying) {
      return
    }
    this.isDying = true
    this.currentState = 'dying'
    this.play('mario_die', true)
    this.setVelocityX(0)
    this.setVelocityY(PLAYER_JUMP_VELOCITY)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(false)
    body.checkCollision.none = true

    // Emit death event for GameScene to handle
    this.scene.events.emit('playerDied')
  }

  // STOMP BOUNCE: called from GameScene on enemy stomp
  applyStompBounce(): void {
    this.setVelocityY(STOMP_BOUNCE_VELOCITY)
    this.isJumping = true
  }

  // PH3/PH4: Take damage from enemy — returns true if life should be lost
  takeDamage(): boolean {
    // Tech contract 4.9 guard order:
    // 1. if invincible → return false
    if (this.isInvincible) {
      return false
    }

    // 2. if dying → return false
    if (this.isDying) {
      return false
    }

    // 3. if big → shrink, no life loss
    if (this.isBig) {
      this.shrinkSmall()
      return false
    }

    // 4. else → existing PH3 death flow
    this.scene.events.emit('playerDamaged')
    return true
  }

  getIsInvincible(): boolean {
    return this.isInvincible
  }

  getIsBig(): boolean {
    return this.isBig
  }

  // Tech contract 4.8: growBig()
  growBig(): void {
    // 1. guard: already big
    if (this.isBig) {
      return
    }

    // 2. isBig = true
    this.isBig = true

    // 4. setDisplaySize to big visual
    this.setDisplaySize(MARIO_DISPLAY_BIG_W, MARIO_DISPLAY_BIG_H)

    // Body stays at small-display size to prevent collision displacement.
    // Phaser: body = sourceSize * scale. Compute sourceH so body = small display H.
    const body = this.body as Phaser.Physics.Arcade.Body
    const frameW = this.frame.realWidth
    const frameH = this.frame.realHeight
    const sourceH = Math.round(MARIO_DISPLAY_SMALL_H * frameH / MARIO_DISPLAY_BIG_H)
    body.setSize(frameW, sourceH, true)

    // 7. activateSpawnProtection — prevent instant damage after power-up
    this.activateSpawnProtection()
  }

  // Tech contract 4.10: shrinkSmall()
  shrinkSmall(): void {
    // 1. guard: not big
    if (!this.isBig) {
      return
    }

    // 2. isBig = false
    this.isBig = false

    // 3. setDisplaySize to small visual
    this.setDisplaySize(MARIO_DISPLAY_SMALL_W, MARIO_DISPLAY_SMALL_H)

    // Body matches display
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.frame.realWidth, this.frame.realHeight, true)

    // 5. activateSpawnProtection
    this.activateSpawnProtection()
  }

  // Architecture Decision 11 / tech contract 5.3:
  // Activate invincibility frames after spawn or power change
  activateSpawnProtection(): void {
    this.isInvincible = true
    this.invincibilityTimer = INVINCIBILITY_MS
  }

  // Reset player for level restart — tech contract 4.12
  resetPlayer(x: number, y: number): void {
    this.setPosition(x, y)
    this.setVelocity(0, 0)
    this.isDying = false
    this.currentState = 'idle'
    this.isJumping = false
    this.coyoteTimer = 0
    this.jumpBuffered = false
    this.jumpBufferTimer = 0
    this.wasOnGround = false
    this.jumpKeyHeld = false
    this.setFlipX(false)
    // Tech contract 4.12: explicit invincibility state reset
    this.isInvincible = false
    this.invincibilityTimer = 0
    this.setAlpha(FULL_ALPHA)
    this.play('mario_idle', true)

    // PH4: force small state on respawn
    this.isBig = false
    this.setDisplaySize(MARIO_DISPLAY_SMALL_W, MARIO_DISPLAY_SMALL_H)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.frame.realWidth, this.frame.realHeight, true)
    body.checkCollision.none = false
    body.setCollideWorldBounds(false)
  }
}
