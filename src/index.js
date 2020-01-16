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
let adventurer, running

function preload() {
  this.load.atlas('adventurer', adventurerSheet, adventurerJson)

  let ws = new WebSocket('ws://159.89.201.140:15674/ws');
  let client = Stomp.over(ws);

  var on_connect = function() {
    let id = client.subscribe("/topic/test", function(d) {
        if(['attack', 'jump'].includes(d.body)) {
          if(running) return
          adventurer.anims.play(d.body)
        }
        if(d.body == 'run') {
          const scene = game.scene.scenes[0]
          scene.tweens.add({
            targets: adventurer,
            x: { from: 100, to: 800 },
            onStart: () => {
              running = true
              adventurer.anims.play('run')
            },
            onComplete: () => {
              running = false
              adventurer.setScale(4, 4)
              adventurer.anims.play('idle')
            },
            onRepeat: () => {
              adventurer.setScale(4, 4)
            },
            onYoyo: () => {
              adventurer.setScale(-4, 4)
            },
            ease: 'Linear',
            duration: 3000,
            repeat: 0,
            yoyo: true
          })
        }
    })
  }
  var on_error =  function() {
    console.log('error')
  }
  client.connect('guest', 'guest', on_connect, on_error, '/')
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
  const attackFrames = this.anims.generateFrameNames('adventurer', {
    start: 0, end: 5, zeroPad: 2,
    prefix: 'adventurer-attack2-', suffix: '.png'
  })
  const jumpFrames = this.anims.generateFrameNames('adventurer', {
    start: 0, end: 3, zeroPad: 2,
    prefix: 'adventurer-jump-', suffix: '.png'
  })
  const sheatheFrames = this.anims.generateFrameNames('adventurer', {
    start: 0, end: 3, zeroPad: 2,
    prefix: 'adventurer-swrd-shte-', suffix: '.png'
  })

  this.anims.create({ key: 'idle', frames: idleFrames, frameRate: 8, repeat: -1 })
  this.anims.create({ key: 'run', frames: runFrames, frameRate: 10, repeat: -1 })
  this.anims.create({ key: 'jump', frames: jumpFrames, frameRate: 7, repeat: 0, yoyo: true })
  this.anims.create({ key: 'attack', frames: attackFrames, frameRate: 7, repeat: 0 })
  this.anims.create({ key: 'sheathe', frames: sheatheFrames, frameRate: 7, repeat: 0 })

  adventurer = this.add.sprite(100, 370, 'adventurer', 'adventurer-slide-00.png')
  adventurer.setScale(4, 4)
  adventurer.anims.play('idle')
  adventurer.on('animationcomplete', function (anim, frame) {
    if(anim.key == 'jump') {
      this.anims.play('idle')
    }
    if(anim.key == 'attack') {
      this.anims.play('sheathe')
    }
    if(anim.key == 'sheathe') {
      this.anims.play('idle')
    }
  }, adventurer)
}
