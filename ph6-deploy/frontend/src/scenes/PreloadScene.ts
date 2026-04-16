// src/scenes/PreloadScene.ts
// Loads ALL assets from Asset Manifest and creates animations

import Phaser from 'phaser'
import { SoundManager } from '../audio/SoundManager'
import {
  ANIM_IDLE_FRAMERATE,
  ANIM_WALK_FRAMERATE,
  ANIM_WALK_REPEAT,
  ANIM_JUMP_FRAMERATE,
  ANIM_DIE_FRAMERATE,
  ANIM_COIN_FRAMERATE,
  ANIM_COIN_REPEAT,
  ANIM_GOOMBA_WALK_FRAMERATE,
  ANIM_GOOMBA_DEAD_FRAMERATE,
  ANIM_KOOPA_WALK_FRAMERATE,
  ANIM_KOOPA_SHELL_FRAMERATE,
  AUDIO_KEY_COIN,
  AUDIO_KEY_JUMP,
  AUDIO_KEY_STOMP,
  AUDIO_KEY_DIE,
  AUDIO_KEY_MUSIC,
  AUDIO_PATH_COIN,
  AUDIO_PATH_JUMP,
  AUDIO_PATH_STOMP,
  AUDIO_PATH_DIE,
  AUDIO_PATH_MUSIC,
  SOUND_MANAGER_KEY
} from '../data/gameConfig'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload(): void {
    // Player sprites (alienGreen)
    this.load.image('alienGreen_stand', 'assets/sprites/alienGreen_stand.png')
    this.load.image('alienGreen_walk1', 'assets/sprites/alienGreen_walk1.png')
    this.load.image('alienGreen_walk2', 'assets/sprites/alienGreen_walk2.png')
    this.load.image('alienGreen_jump', 'assets/sprites/alienGreen_jump.png')
    this.load.image('alienGreen_hit', 'assets/sprites/alienGreen_hit.png')

    // Enemy sprites (for future phases)
    this.load.image('slimeWalk1', 'assets/sprites/slimeWalk1.png')
    this.load.image('slimeWalk2', 'assets/sprites/slimeWalk2.png')
    this.load.image('slimeDead', 'assets/sprites/slimeDead.png')
    this.load.image('barnacle_move1', 'assets/sprites/barnacle_move1.png')
    this.load.image('barnacle_move2', 'assets/sprites/barnacle_move2.png')
    this.load.image('barnacleShell', 'assets/sprites/barnacleShell.png')

    // Grassland tiles
    this.load.image('grassMid', 'assets/sprites/grassMid.png')
    this.load.image('grassLeft', 'assets/sprites/grassLeft.png')
    this.load.image('grassRight', 'assets/sprites/grassRight.png')
    this.load.image('grassHalf', 'assets/sprites/grassHalf.png')
    this.load.image('grassCenter', 'assets/sprites/grassCenter.png')

    // Underground tiles (for future phases)
    this.load.image('stoneMid', 'assets/sprites/stoneMid.png')
    this.load.image('stoneLeft', 'assets/sprites/stoneLeft.png')
    this.load.image('stoneRight', 'assets/sprites/stoneRight.png')
    this.load.image('stoneCenter', 'assets/sprites/stoneCenter.png')

    // Castle tiles (for future phases)
    this.load.image('castleMid', 'assets/sprites/castleMid.png')
    this.load.image('castleLeft', 'assets/sprites/castleLeft.png')
    this.load.image('castleRight', 'assets/sprites/castleRight.png')
    this.load.image('castleCenter', 'assets/sprites/castleCenter.png')

    // Objects
    this.load.image('coinGold', 'assets/sprites/coinGold.png')
    this.load.image('coinGold_ul', 'assets/sprites/coinGold_ul.png')
    this.load.image('coinGold_ur', 'assets/sprites/coinGold_ur.png')
    this.load.image('coinGold_ll', 'assets/sprites/coinGold_ll.png')
    this.load.image('boxItem', 'assets/sprites/boxItem.png')
    this.load.image('boxEmpty', 'assets/sprites/boxEmpty.png')
    this.load.image('mushroomRed', 'assets/sprites/mushroomRed.png')
    this.load.image('flagGreen_up', 'assets/sprites/flagGreen_up.png')
    this.load.image('flagGreen', 'assets/sprites/flagGreen.png')

    // HUD / UI sprites
    this.load.image('hud_heartFull', 'assets/sprites/hud_heartFull.png')
    this.load.image('hud_heartEmpty', 'assets/sprites/hud_heartEmpty.png')
    this.load.image('hud_coins', 'assets/sprites/hud_coins.png')

    // Backgrounds
    this.load.image('backgroundForest', 'assets/sprites/backgroundForest.png')
    this.load.image('backgroundCastle', 'assets/sprites/backgroundCastle.png')

    // PH6: Audio assets — tech contract 3.4
    this.load.audio(AUDIO_KEY_COIN, AUDIO_PATH_COIN)
    this.load.audio(AUDIO_KEY_JUMP, AUDIO_PATH_JUMP)
    this.load.audio(AUDIO_KEY_STOMP, AUDIO_PATH_STOMP)
    this.load.audio(AUDIO_KEY_DIE, AUDIO_PATH_DIE)
    this.load.audio(AUDIO_KEY_MUSIC, AUDIO_PATH_MUSIC)
  }

  create(): void {
    // Create animations for Mario
    this.anims.create({
      key: 'mario_idle',
      frames: [{ key: 'alienGreen_stand' }],
      frameRate: ANIM_IDLE_FRAMERATE
    })

    this.anims.create({
      key: 'mario_walk',
      frames: [
        { key: 'alienGreen_walk1' },
        { key: 'alienGreen_walk2' }
      ],
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: ANIM_WALK_REPEAT
    })

    this.anims.create({
      key: 'mario_jump',
      frames: [{ key: 'alienGreen_jump' }],
      frameRate: ANIM_JUMP_FRAMERATE
    })

    this.anims.create({
      key: 'mario_die',
      frames: [{ key: 'alienGreen_hit' }],
      frameRate: ANIM_DIE_FRAMERATE
    })

    // PH2: Coin spinning animation (4 frames)
    this.anims.create({
      key: 'coin_spin',
      frames: [
        { key: 'coinGold' },
        { key: 'coinGold_ul' },
        { key: 'coinGold_ur' },
        { key: 'coinGold_ll' }
      ],
      frameRate: ANIM_COIN_FRAMERATE,
      repeat: ANIM_COIN_REPEAT
    })

    // PH3: Goomba animations
    this.anims.create({
      key: 'goomba_walk',
      frames: [
        { key: 'slimeWalk1' },
        { key: 'slimeWalk2' }
      ],
      frameRate: ANIM_GOOMBA_WALK_FRAMERATE,
      repeat: ANIM_WALK_REPEAT
    })

    this.anims.create({
      key: 'goomba_dead',
      frames: [{ key: 'slimeDead' }],
      frameRate: ANIM_GOOMBA_DEAD_FRAMERATE
    })

    // PH3: Koopa animations
    this.anims.create({
      key: 'koopa_walk',
      frames: [
        { key: 'barnacle_move1' },
        { key: 'barnacle_move2' }
      ],
      frameRate: ANIM_KOOPA_WALK_FRAMERATE,
      repeat: ANIM_WALK_REPEAT
    })

    this.anims.create({
      key: 'koopa_shell',
      frames: [{ key: 'barnacleShell' }],
      frameRate: ANIM_KOOPA_SHELL_FRAMERATE
    })

    // PH6: Create SoundManager after preload completion — tech contract 3.4 step 6
    const soundManager = new SoundManager(this)
    this.registry.set(SOUND_MANAGER_KEY, soundManager)

    // Proceed to main menu
    this.scene.start('MainMenuScene')
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
