// src/scenes/BootScene.ts
// Initialization scene — detect device type (desktop/mobile)

import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  create(): void {
    // Detect if the device is mobile or desktop
    const isMobile = !this.sys.game.device.os.desktop
    this.registry.set('isMobile', isMobile)

    // Proceed to preload
    this.scene.start('PreloadScene')
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
