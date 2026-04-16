// src/audio/SoundManager.ts
// PH6: Centralized sound manager — tech contract section 3
// Shared via scene.registry. Silent fail if sounds unavailable.

import Phaser from 'phaser'
import {
  AUDIO_KEY_COIN,
  AUDIO_KEY_JUMP,
  AUDIO_KEY_STOMP,
  AUDIO_KEY_DIE,
  AUDIO_KEY_MUSIC,
  MUSIC_VOLUME
} from '../data/gameConfig'

export class SoundManager {
  private scene: Phaser.Scene
  private musicInstance: Phaser.Sound.BaseSound | null = null
  private isMusicPlaying: boolean = false
  private isMusicPaused: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  // Event sound: one-shot coin
  playCoin(): void {
    this.playOneShot(AUDIO_KEY_COIN)
  }

  // Event sound: one-shot jump
  playJump(): void {
    this.playOneShot(AUDIO_KEY_JUMP)
  }

  // Event sound: one-shot stomp
  playStomp(): void {
    this.playOneShot(AUDIO_KEY_STOMP)
  }

  // Event sound: one-shot die
  playDie(): void {
    this.playOneShot(AUDIO_KEY_DIE)
  }

  // Music: start looped background track
  // Tech contract 4.12: guard against duplicate playback
  playMusic(): void {
    try {
      if (this.isMusicPlaying) {
        return
      }
      if (!this.scene.cache.audio.exists(AUDIO_KEY_MUSIC)) {
        return
      }
      this.musicInstance = this.scene.sound.add(AUDIO_KEY_MUSIC, {
        loop: true,
        volume: MUSIC_VOLUME
      })
      this.musicInstance.play()
      this.isMusicPlaying = true
      this.isMusicPaused = false
    } catch {
      // Silent fail — edge case 5.4
    }
  }

  // Music: full stop (GameOver / Win)
  stopMusic(): void {
    try {
      if (this.musicInstance) {
        this.musicInstance.stop()
        this.musicInstance.destroy()
        this.musicInstance = null
      }
      this.isMusicPlaying = false
      this.isMusicPaused = false
    } catch {
      // Silent fail
    }
  }

  // Music: pause only (PauseScene) — tech contract 4.13
  pauseMusic(): void {
    try {
      if (this.musicInstance && this.isMusicPlaying && !this.isMusicPaused) {
        this.musicInstance.pause()
        this.isMusicPaused = true
      }
    } catch {
      // Silent fail
    }
  }

  // Music: resume after pause — tech contract 4.14
  resumeMusic(): void {
    try {
      if (this.musicInstance && this.isMusicPaused) {
        this.musicInstance.resume()
        this.isMusicPaused = false
      }
    } catch {
      // Silent fail
    }
  }

  // Internal helper: play one-shot sound with silent fail
  private playOneShot(key: string): void {
    try {
      if (!this.scene.cache.audio.exists(key)) {
        return
      }
      this.scene.sound.play(key)
    } catch {
      // Silent fail — edge case 5.4
    }
  }
}
