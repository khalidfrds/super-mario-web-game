// src/scenes/GameScene.ts
// Main game scene — PH5: loadLevel() pattern for 3 levels
// ARCHITECTURE: GameScene stays alive during respawn AND level transitions

import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { Coin } from '../objects/Coin'
import { Goomba } from '../objects/Goomba'
import { Koopa } from '../objects/Koopa'
import { QuestionBlock } from '../objects/QuestionBlock'
import { Mushroom } from '../objects/Mushroom'
import { VirtualDpad } from '../objects/VirtualDpad'
import { SoundManager } from '../audio/SoundManager'
import { LEVELS } from '../data/levels'
import { GameState, resetGameState } from '../data/GameState'
import {
  GAME_HEIGHT,
  PLAYER_START_X,
  PLAYER_START_Y,
  DEATH_BOUNDARY_OFFSET,
  CAMERA_DEADZONE_WIDTH,
  CAMERA_DEADZONE_HEIGHT,
  DEATH_RESTART_DELAY_MS,
  COIN_SCORE,
  GOOMBA_STOMP_SCORE,
  KOOPA_STOMP_SCORE,
  KOOPA_SHELL_KILL_SCORE,
  STOMP_THRESHOLD,
  HUD_INIT_DELAY_MS,
  LEVEL_COMPLETE_SCORE,
  ALL_COINS_BONUS,
  LIFE_BONUS_SCORE,
  LAST_LEVEL_INDEX,
  LEVEL_TRANSITION_DELAY_MS,
  CHECKPOINT_LINE_WIDTH,
  CHECKPOINT_LINE_HEIGHT,
  CHECKPOINT_COLOR_INACTIVE,
  CHECKPOINT_COLOR_ACTIVE,
  FLAGPOLE_HITBOX_W,
  FLAGPOLE_HITBOX_H,
  FULL_ALPHA,
  BLINK_PHASE_MODULO,
  CHECKPOINT_ZONE_WIDTH_MULTIPLIER,
  NEXT_LEVEL_OFFSET,
  SOUND_MANAGER_KEY
} from '../data/gameConfig'

export class GameScene extends Phaser.Scene {
  // Player — created once in create(), persists across levels
  private player!: Player
  private dpad!: VirtualDpad
  private isMobile: boolean = false

  // Level runtime groups — destroyed and recreated per loadLevel()
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private coins!: Phaser.Physics.Arcade.StaticGroup
  private coinObjects: Coin[] = []
  private enemies!: Phaser.Physics.Arcade.Group
  private enemyObjects: (Goomba | Koopa)[] = []
  private questionBlocks!: Phaser.Physics.Arcade.StaticGroup
  private questionBlockObjects: QuestionBlock[] = []
  private mushrooms!: Phaser.Physics.Arcade.Group

  // PH5: Checkpoint
  private checkpointActivated: boolean = false
  private checkpointX: number = 0
  private checkpointZone: Phaser.GameObjects.Zone | null = null
  private checkpointVisual: Phaser.GameObjects.Rectangle | null = null

  // PH5: Flagpole
  private flagpoleZone: Phaser.GameObjects.Zone | null = null
  private flagpoleSprite: Phaser.GameObjects.Image | null = null
  private flagpoleTriggered: boolean = false

  // PH5: Level transition state
  private isLevelCompleting: boolean = false
  private pendingLevelTransition: boolean = false
  private levelTotalCoins: number = 0

  // Death / respawn state
  private respawnTimer: Phaser.Time.TimerEvent | null = null
  private isGameOver: boolean = false
  private isDying: boolean = false

  // Pause key
  private pauseKey: Phaser.Input.Keyboard.Key | null = null

  // PH6: SoundManager — resolved from registry
  private soundManager: SoundManager | null = null

  constructor() {
    super({ key: 'GameScene' })
  }

  create(data?: { restart?: boolean }): void {
    if (data?.restart) {
      resetGameState()
    }

    this.isMobile = this.registry.get('isMobile') as boolean

    // Player — created once, persists across loadLevel calls
    this.player = new Player(this, PLAYER_START_X, PLAYER_START_Y)

    // D-pad — created once
    this.dpad = new VirtualDpad(this)

    // Pause key — ESC
    if (this.input.keyboard) {
      this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    }

    // PH6: Resolve SoundManager from registry — tech contract 6.2 step 1
    this.soundManager = this.registry.get(SOUND_MANAGER_KEY) as SoundManager || null

    // Launch HUD
    if (!this.scene.isActive('HUDScene')) {
      this.scene.launch('HUDScene')
    }

    // Load first level (or current level on restart)
    this.loadLevel(GameState.currentLevelIndex)
  }

  // ══════════════════════════════════════════════════════════════════════
  // LOAD LEVEL — tech contract 4.7 + scene checklist section 6
  // ══════════════════════════════════════════════════════════════════════
  loadLevel(levelIndex: number): void {
    // Step 1: validate target level
    if (levelIndex < 0 || levelIndex >= LEVELS.length) {
      return
    }

    // Step 2-4: reset transition flags and checkpoint state
    GameState.currentLevelIndex = levelIndex
    this.isLevelCompleting = false
    this.pendingLevelTransition = false
    this.flagpoleTriggered = false
    this.checkpointActivated = false
    this.checkpointX = 0
    this.isGameOver = false
    this.isDying = false
    this.respawnTimer = null

    // Step 5: reset per-level coin counter
    GameState.levelCoinsCollected = 0

    // Step 6: clear level-specific timers/events
    this.time.removeAllEvents()

    // Step 7: destroy old runtime groups and objects
    this.destroyLevelObjects()

    // Step 8: remove old collider/overlap listeners
    this.physics.world.colliders.destroy()

    const level = LEVELS[levelIndex]
    this.levelTotalCoins = level.coins.length

    // Step 9-10: setup background and world bounds
    this.cameras.main.setBackgroundColor(level.bgColor)
    this.physics.world.setBounds(0, 0, level.width, GAME_HEIGHT + DEATH_BOUNDARY_OFFSET)

    // Step 11: recreate platforms
    this.platforms = this.physics.add.staticGroup()
    level.platforms.forEach((p) => {
      const tile = this.platforms.create(p.x, p.y, p.tileType) as Phaser.Physics.Arcade.Sprite
      tile.refreshBody()
    })

    // Step 12: recreate coins
    this.coins = this.physics.add.staticGroup()
    this.coinObjects = []
    level.coins.forEach((c) => {
      const coin = new Coin(this, c.x, c.y)
      this.coins.add(coin)
      this.coinObjects.push(coin)
    })

    // Step 13: recreate enemies
    this.enemies = this.physics.add.group()
    this.enemyObjects = []
    level.enemies.forEach((e) => {
      if (e.type === 'goomba') {
        const goomba = new Goomba(this, e.x, e.y)
        this.enemies.add(goomba)
        this.enemyObjects.push(goomba)
      } else if (e.type === 'koopa') {
        const koopa = new Koopa(this, e.x, e.y)
        this.enemies.add(koopa)
        this.enemyObjects.push(koopa)
      }
    })
    // Re-apply patrol velocities (Architecture Decision 9)
    this.enemyObjects.forEach((enemy) => { enemy.resetEnemy() })

    // Step 14: recreate questionBlocks
    this.questionBlocks = this.physics.add.staticGroup()
    this.questionBlockObjects = []
    this.mushrooms = this.physics.add.group()

    level.questionBlocks.forEach((qb) => {
      const block = new QuestionBlock(this, qb.x, qb.y, qb.content)
      this.questionBlocks.add(block)
      this.questionBlockObjects.push(block)
      block.setMushroomsGroup(this.mushrooms)
    })

    // Step 15: recreate checkpoint
    this.createCheckpoint(level.checkpointX)

    // Step 16: recreate flagpole
    this.createFlagpole(level.flagX)

    // Step 17-18: register colliders and overlaps in correct order
    this.registerPhysics()

    // Step 19: reset player to level start
    this.player.resetPlayer(PLAYER_START_X, PLAYER_START_Y)
    this.player.activateSpawnProtection()

    // Step 20: update camera bounds
    this.cameras.main.startFollow(this.player, true)
    this.cameras.main.setBounds(0, 0, level.width, GAME_HEIGHT)
    this.cameras.main.setDeadzone(CAMERA_DEADZONE_WIDTH, CAMERA_DEADZONE_HEIGHT)

    // Step 21-22: Score and Lives unchanged (carried over via GameState)

    // Step 24: rebind events via off/on pattern
    this.bindEvents()

    // Emit state to HUD for new level
    this.time.delayedCall(HUD_INIT_DELAY_MS, () => {
      this.events.emit('scoreChanged', GameState.score)
      this.events.emit('coinsChanged', GameState.coins)
      this.events.emit('livesChanged', GameState.lives)
      this.events.emit('timerReset')
    })

    // PH6: Start music after level setup — tech contract 4.12
    // Guard: if music already playing → return (handled inside SoundManager)
    if (this.soundManager) {
      this.soundManager.playMusic()
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // HELPERS: create checkpoint & flagpole
  // ══════════════════════════════════════════════════════════════════════

  private createCheckpoint(cpX: number): void {
    if (cpX <= 0) {
      this.checkpointZone = null
      this.checkpointVisual = null
      return
    }

    // Visual: colored rectangle (line)
    this.checkpointVisual = this.add.rectangle(
      cpX,
      GAME_HEIGHT - CHECKPOINT_LINE_HEIGHT,
      CHECKPOINT_LINE_WIDTH,
      CHECKPOINT_LINE_HEIGHT,
      CHECKPOINT_COLOR_INACTIVE,
      FULL_ALPHA
    )

    // Overlap zone for detection
    this.checkpointZone = this.add.zone(cpX, GAME_HEIGHT - CHECKPOINT_LINE_HEIGHT / BLINK_PHASE_MODULO, CHECKPOINT_LINE_WIDTH * CHECKPOINT_ZONE_WIDTH_MULTIPLIER, CHECKPOINT_LINE_HEIGHT)
    this.physics.add.existing(this.checkpointZone, true)
    const cpBody = this.checkpointZone.body as Phaser.Physics.Arcade.StaticBody
    cpBody.setSize(CHECKPOINT_LINE_WIDTH * CHECKPOINT_ZONE_WIDTH_MULTIPLIER, CHECKPOINT_LINE_HEIGHT, true)
    cpBody.updateFromGameObject()
  }

  private createFlagpole(fpX: number): void {
    if (fpX <= 0) {
      this.flagpoleZone = null
      this.flagpoleSprite = null
      return
    }

    // Visual: flagpole sprite
    this.flagpoleSprite = this.add.image(fpX, GAME_HEIGHT - FLAGPOLE_HITBOX_H, 'flagGreen_up')

    // Overlap zone
    this.flagpoleZone = this.add.zone(fpX, GAME_HEIGHT - FLAGPOLE_HITBOX_H / BLINK_PHASE_MODULO, FLAGPOLE_HITBOX_W, FLAGPOLE_HITBOX_H)
    this.physics.add.existing(this.flagpoleZone, true)
    const fpBody = this.flagpoleZone.body as Phaser.Physics.Arcade.StaticBody
    fpBody.setSize(FLAGPOLE_HITBOX_W, FLAGPOLE_HITBOX_H, true)
    fpBody.updateFromGameObject()
  }

  // ══════════════════════════════════════════════════════════════════════
  // PHYSICS REGISTRATION — tech contract section 2
  // ══════════════════════════════════════════════════════════════════════

  private registerPhysics(): void {
    // Colliders first — same order as PH4 tech contract
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.player, this.questionBlocks, this.handleQuestionBlockHit, undefined, this)
    this.physics.add.collider(this.mushrooms, this.platforms)
    this.physics.add.collider(this.mushrooms, this.questionBlocks)

    // Overlaps — mushroom BEFORE enemy so collection + spawn protection fires first
    this.physics.add.overlap(this.player, this.mushrooms, this.handleMushroomCollect, undefined, this)
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyOverlap, undefined, this)

    // PH3: Shell-enemy
    this.physics.add.overlap(this.enemies, this.enemies, this.handleEnemyEnemyOverlap, undefined, this)

    // PH5 new overlaps — checkpoint and flagpole
    if (this.checkpointZone) {
      this.physics.add.overlap(this.player, this.checkpointZone, this.handleCheckpointActivate, undefined, this)
    }
    if (this.flagpoleZone) {
      this.physics.add.overlap(this.player, this.flagpoleZone, this.handleFlagpoleTrigger, undefined, this)
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // EVENTS — off/on pattern (Architecture Decision 10)
  // ══════════════════════════════════════════════════════════════════════

  private bindEvents(): void {
    this.events.off('playerDied')
    this.events.off('playerDamaged')
    this.events.off('timerExpired')
    this.events.off('blockCoinCollected')
    this.events.off('playerJumped')

    this.events.on('playerDied', this.handlePlayerDeath, this)
    this.events.on('playerDamaged', this.handlePlayerDamaged, this)
    this.events.on('timerExpired', this.handleTimerExpired, this)
    this.events.on('blockCoinCollected', this.handleBlockCoinCollected, this)
    this.events.on('playerJumped', this.handlePlayerJumped, this)
  }

  // ══════════════════════════════════════════════════════════════════════
  // DESTROY OLD LEVEL OBJECTS — tech contract 4.7 step 7
  // ══════════════════════════════════════════════════════════════════════

  private destroyLevelObjects(): void {
    this.platforms?.destroy(true)
    this.coins?.destroy(true)
    this.enemies?.destroy(true)
    this.questionBlocks?.destroy(true)
    this.mushrooms?.destroy(true)

    this.coinObjects = []
    this.enemyObjects = []
    this.questionBlockObjects = []

    // Destroy checkpoint
    if (this.checkpointVisual) { this.checkpointVisual.destroy(); this.checkpointVisual = null }
    if (this.checkpointZone) { this.checkpointZone.destroy(); this.checkpointZone = null }

    // Destroy flagpole
    if (this.flagpoleSprite) { this.flagpoleSprite.destroy(); this.flagpoleSprite = null }
    if (this.flagpoleZone) { this.flagpoleZone.destroy(); this.flagpoleZone = null }
  }

  // ══════════════════════════════════════════════════════════════════════
  // UPDATE LOOP
  // ══════════════════════════════════════════════════════════════════════

  update(time: number, delta: number): void {
    if (this.isGameOver || this.isDying || this.isLevelCompleting) {
      return
    }

    // PH5: Pause key check
    if (this.pauseKey && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.doPause()
      return
    }

    this.player.setDpadState(
      this.dpad.leftPressed,
      this.dpad.rightPressed,
      this.dpad.jumpPressed
    )
    this.player.update(time, delta)

    // Update enemies
    this.enemyObjects.forEach((enemy) => {
      if (enemy.active) { enemy.update(time, delta) }
    })

    // Update mushrooms
    this.mushrooms.getChildren().forEach((child) => {
      const mushroom = child as Mushroom
      if (mushroom.active) { mushroom.update(time, delta) }
    })
  }

  // ══════════════════════════════════════════════════════════════════════
  // PH5: PAUSE — tech contract 4.3 / 4.4
  // ══════════════════════════════════════════════════════════════════════

  private doPause(): void {
    if (this.isLevelCompleting) { return }
    if (this.scene.isActive('PauseScene')) { return }

    // PH6: Pause music before launching PauseScene — tech contract 4.13
    if (this.soundManager) {
      this.soundManager.pauseMusic()
    }

    this.scene.launch('PauseScene')
    this.scene.pause()
  }

  // ══════════════════════════════════════════════════════════════════════
  // PH5: FLAGPOLE — tech contract 4.1
  // ══════════════════════════════════════════════════════════════════════

  private handleFlagpoleTrigger(): void {
    // Guards per tech contract 4.1
    if (this.flagpoleTriggered) { return }
    if (this.isLevelCompleting) { return }
    if (this.pendingLevelTransition) { return }

    this.isLevelCompleting = true
    this.pendingLevelTransition = true
    this.flagpoleTriggered = true

    // Stop player movement
    this.player.setVelocityX(0)

    // Apply level complete score
    GameState.score += LEVEL_COMPLETE_SCORE

    // Check all-coins bonus
    if (GameState.levelCoinsCollected >= this.levelTotalCoins) {
      GameState.score += ALL_COINS_BONUS
    }

    const isFinalLevel = GameState.currentLevelIndex >= LAST_LEVEL_INDEX

    // If final level, apply life bonus
    if (isFinalLevel) {
      GameState.score += LIFE_BONUS_SCORE * GameState.lives
    }

    this.events.emit('scoreChanged', GameState.score)
    this.events.emit('timerStop')

    // Delay before transition. scene.pause() goes INSIDE the callback —
    // a paused scene's timers don't tick, so the callback would never fire.
    // isLevelCompleting=true already blocks gameplay in update().
    this.time.delayedCall(LEVEL_TRANSITION_DELAY_MS, () => {
      this.scene.pause()

      if (isFinalLevel) {
        // PH6: Stop music before WinScene — tech contract 4.16
        if (this.soundManager) {
          this.soundManager.stopMusic()
        }

        // Launch WinScene
        this.scene.launch('WinScene', {
          score: GameState.score,
          lives: GameState.lives
        })
      } else {
        // Launch LevelCompleteScene
        const nextIdx = GameState.currentLevelIndex + NEXT_LEVEL_OFFSET
        this.scene.launch('LevelCompleteScene', {
          score: GameState.score,
          lives: GameState.lives,
          nextLevelIndex: nextIdx,
          nextLevelName: LEVELS[nextIdx].name
        })
      }
    })
  }

  // ══════════════════════════════════════════════════════════════════════
  // PH5: CHECKPOINT — tech contract 4.2
  // ══════════════════════════════════════════════════════════════════════

  private handleCheckpointActivate(): void {
    if (this.checkpointActivated) { return }
    if (this.isLevelCompleting) { return }

    this.checkpointActivated = true
    this.checkpointX = LEVELS[GameState.currentLevelIndex].checkpointX

    // Visual change: inactive (green) → active (white)
    if (this.checkpointVisual) {
      this.checkpointVisual.setFillStyle(CHECKPOINT_COLOR_ACTIVE, FULL_ALPHA)
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // COIN COLLECTION
  // ══════════════════════════════════════════════════════════════════════

  private collectCoin(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    coinObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const coin = coinObj as Coin
    coin.collect()

    GameState.score += COIN_SCORE
    GameState.coins++
    GameState.levelCoinsCollected++

    this.events.emit('scoreChanged', GameState.score)
    this.events.emit('coinsChanged', GameState.coins)

    // PH6: Sound — tech contract 4.8
    if (this.soundManager) {
      this.soundManager.playCoin()
    }
  }

  private handleBlockCoinCollected(): void {
    GameState.score += COIN_SCORE
    GameState.coins++
    GameState.levelCoinsCollected++

    this.events.emit('scoreChanged', GameState.score)
    this.events.emit('coinsChanged', GameState.coins)

    // PH6: Sound — tech contract 4.8 (same for block coin)
    if (this.soundManager) {
      this.soundManager.playCoin()
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // PH4: QUESTION BLOCK HIT — body.blocked.up detection
  // ══════════════════════════════════════════════════════════════════════

  private handleQuestionBlockHit(
    playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    blockObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const player = playerObj as Player
    const block = blockObj as QuestionBlock

    if (block.getState() !== 'active') { return }
    const pBody = player.body as Phaser.Physics.Arcade.Body
    if (!pBody.blocked.up) { return }
    if (player.y <= block.y) { return }
    if (block.getIsBumping()) { return }

    block.hit()
  }

  // ══════════════════════════════════════════════════════════════════════
  // PH4: MUSHROOM COLLECT
  // ══════════════════════════════════════════════════════════════════════

  private handleMushroomCollect(
    playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    mushroomObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const mushroom = mushroomObj as Mushroom
    if (mushroom.getState() !== 'moving') { return }
    if (!mushroom.active) { return }

    mushroom.collect()
    const player = playerObj as Player
    player.growBig()
  }

  // ══════════════════════════════════════════════════════════════════════
  // PH3: ENEMY COMBAT (unchanged)
  // ══════════════════════════════════════════════════════════════════════

  private handlePlayerEnemyOverlap(
    playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const p = playerObj as Player
    const enemy = enemyObj as Goomba | Koopa

    if (!enemy.active || this.isDying || this.isLevelCompleting) { return }

    const pBody = p.body as Phaser.Physics.Arcade.Body
    const eBody = enemy.body as Phaser.Physics.Arcade.Body

    if (enemy instanceof Goomba && enemy.getState() === 'dead') { return }
    if (enemy instanceof Koopa && enemy.getState() === 'in_shell') { enemy.kick(p.x); return }
    if (enemy instanceof Koopa && enemy.getState() === 'shell_sliding') { p.takeDamage(); return }

    const isStomp = eBody.blocked.down &&
                    pBody.bottom <= eBody.top + STOMP_THRESHOLD

    if (isStomp) {
      p.applyStompBounce()
      if (enemy instanceof Goomba) {
        enemy.stomp()
        GameState.score += GOOMBA_STOMP_SCORE
      } else if (enemy instanceof Koopa) {
        enemy.stomp()
        GameState.score += KOOPA_STOMP_SCORE
      }
      this.events.emit('scoreChanged', GameState.score)

      // PH6: Sound — tech contract 4.10
      if (this.soundManager) {
        this.soundManager.playStomp()
      }
    } else {
      p.takeDamage()
    }
  }

  private handleEnemyEnemyOverlap(
    enemyA: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyB: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const a = enemyA as Goomba | Koopa
    const b = enemyB as Goomba | Koopa
    if (!a.active || !b.active) { return }

    let shell: Koopa | null = null
    let target: Goomba | Koopa | null = null

    if (a instanceof Koopa && a.getState() === 'shell_sliding') { shell = a; target = b }
    else if (b instanceof Koopa && b.getState() === 'shell_sliding') { shell = b; target = a }

    if (!shell || !target || shell === target) { return }

    if (target instanceof Goomba && target.getState() === 'patrolling') {
      target.stomp()
      GameState.score += KOOPA_SHELL_KILL_SCORE
      this.events.emit('scoreChanged', GameState.score)
    } else if (target instanceof Koopa && target.getState() === 'patrolling') {
      target.forceIntoShell()
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // DAMAGE / DEATH / RESPAWN
  // ══════════════════════════════════════════════════════════════════════

  private handlePlayerDamaged(): void {
    if (this.isDying || this.isGameOver || this.isLevelCompleting) { return }
    if (this.respawnTimer) { return }

    this.events.emit('timerStop')
    GameState.lives--
    this.events.emit('livesChanged', GameState.lives)

    // PH6: Die sound — tech contract 4.11
    if (this.soundManager) {
      this.soundManager.playDie()
    }

    if (GameState.lives <= 0) {
      this.isGameOver = true
      this.player.die()

      // PH6: Stop music on GameOver — tech contract 4.15
      if (this.soundManager) {
        this.soundManager.stopMusic()
      }

      this.respawnTimer = this.time.delayedCall(DEATH_RESTART_DELAY_MS, () => {
        this.respawnTimer = null
        this.scene.stop('HUDScene')
        this.scene.start('GameOverScene', { score: GameState.score })
      })
    } else {
      this.doRespawn()
    }
  }

  private handleTimerExpired(): void {
    if (this.isGameOver || this.isDying || this.isLevelCompleting) { return }
    this.player.die()
  }

  // PH6: Jump sound — tech contract 4.9
  private handlePlayerJumped(): void {
    if (this.soundManager) {
      this.soundManager.playJump()
    }
  }

  private handlePlayerDeath(): void {
    if (this.respawnTimer || this.isDying) { return }

    this.isDying = true
    this.events.emit('timerStop')
    GameState.lives--
    this.events.emit('livesChanged', GameState.lives)

    // PH6: Die sound — tech contract 4.11
    if (this.soundManager) {
      this.soundManager.playDie()
    }

    if (GameState.lives <= 0) {
      this.isGameOver = true

      // PH6: Stop music on GameOver — tech contract 4.15
      if (this.soundManager) {
        this.soundManager.stopMusic()
      }

      this.respawnTimer = this.time.delayedCall(DEATH_RESTART_DELAY_MS, () => {
        this.respawnTimer = null
        this.scene.stop('HUDScene')
        this.scene.start('GameOverScene', { score: GameState.score })
      })
    } else {
      this.respawnTimer = this.time.delayedCall(DEATH_RESTART_DELAY_MS, () => {
        this.respawnTimer = null
        this.isDying = false
        this.doRespawn()
      })
    }
  }

  // PH5: respawn uses checkpoint position if activated (tech contract 4.8/4.9)
  private doRespawn(): void {
    const respawnX = this.checkpointActivated ? this.checkpointX : PLAYER_START_X

    this.player.resetPlayer(respawnX, PLAYER_START_Y)
    this.player.activateSpawnProtection()

    // Reset coins
    this.coinObjects.forEach((coin) => { coin.resetCoin() })

    // Reset per-level coin counter
    GameState.levelCoinsCollected = 0

    // Reset enemies
    this.enemyObjects.forEach((enemy) => { enemy.resetEnemy() })

    // Destroy mushrooms
    this.mushrooms.clear(true, true)

    // Reset question blocks
    this.questionBlockObjects.forEach((block) => { block.resetBlock() })

    // Camera follow
    this.cameras.main.startFollow(this.player, true)

    // Reset timer
    this.events.emit('timerReset')
  }

  // ══════════════════════════════════════════════════════════════════════
  // SHUTDOWN — tech contract section 6 shutdown checklist
  // ══════════════════════════════════════════════════════════════════════

  shutdown(): void {
    this.events.off('playerDied', this.handlePlayerDeath, this)
    this.events.off('playerDamaged', this.handlePlayerDamaged, this)
    this.events.off('timerExpired', this.handleTimerExpired, this)
    this.events.off('blockCoinCollected', this.handleBlockCoinCollected, this)
    this.events.off('playerJumped', this.handlePlayerJumped, this)

    // PH6: Stop music on scene shutdown — tech contract 6.2 step 8
    if (this.soundManager) {
      this.soundManager.stopMusic()
    }

    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
    this.destroyLevelObjects()
    this.physics.world.removeAllListeners()
    if (this.dpad) { this.dpad.destroy() }
  }
}
