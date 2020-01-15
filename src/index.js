import Phaser from "phaser"
import logoImg from "./assets/logo.png"
import adventurerJson from "./assets/adventurer.json"
import adventurerSheet from "./assets/adventurer.png"

const config = {
  type: Phaser.AUTO,
  parent: "phaserCanvas",
  transparent: true,
  pixelArt: true,
  roundPixels: true,
  width: 896,
  height: 504,
  scene: {
    preload: preload,
    create: create
  }
}

const game = new Phaser.Game(config)

function preload() {
  this.load.atlas('adventurer', adventurerSheet, adventurerJson)
}

function create() {
  const idleFrames = this.anims.generateFrameNames('adventurer', {
    start: 0, end: 4, zeroPad: 2,
    prefix: 'adventurer-idle-', suffix: '.png'
  })
  const runFrames = this.anims.generateFrameNames('adventurer', {
    start: 0, end: 5, zeroPad: 2,
    prefix: 'adventurer-run-', suffix: '.png'
  })
  this.anims.create({ key: 'idle', frames: idleFrames, frameRate: 8, repeat: -1 })
  this.anims.create({ key: 'run', frames: runFrames, frameRate: 10, repeat: -1 })

  const adventurer = this.add.sprite(100, 370, 'adventurer', 'adventurer-slide-00.png')
  adventurer.setScale(4, 4)
  adventurer.anims.play('idle')

  this.tweens.add({
    targets: adventurer,
    x: { from: 100, to: 800 },
    delay: 5000,
    onStart: () => {
      adventurer.anims.play('run')
    },
    onRepeat: () => {
      adventurer.setScale(4, 4)
    },
    onYoyo: () => {
      adventurer.setScale(-4, 4)
    },
    ease: 'Linear',
    duration: 3000,
    repeat: -1,
    yoyo: true
  })
}
