// src/objects/Coin.ts
// Collectible coin with spinning animation

import Phaser from 'phaser'
import { COIN_W, COIN_H } from '../data/gameConfig'

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coinGold')

    scene.add.existing(this)
    scene.physics.add.existing(this, true)

    const body = this.body as Phaser.Physics.Arcade.StaticBody
    body.setSize(COIN_W, COIN_H, true)

    this.play('coin_spin')
  }

  collect(): void {
    this.disableBody(true, true)
  }

  resetCoin(): void {
    this.enableBody(true, this.x, this.y, true, true)
    this.play('coin_spin')
  }
}
