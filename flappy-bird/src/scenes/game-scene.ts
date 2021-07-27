import { Bird } from '../objects/bird';
import { Coin } from '../objects/coin';
import { Pipe } from '../objects/pipe';

export class GameScene extends Phaser.Scene {
  private bird: Bird;
  private pipes: Phaser.GameObjects.Group;
  private coins: Phaser.GameObjects.Group;
  private background: Phaser.GameObjects.TileSprite;
  private scoreText: Phaser.GameObjects.BitmapText;
  private timer: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', -1);
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, 390, 600, 'background')
      .setOrigin(0, 0);

    this.scoreText = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        'font',
        this.registry.values.score
      )
      .setDepth(2);

    this.pipes = this.add.group({});
    this.coins = this.add.group({});

    this.bird = new Bird({
      scene: this,
      x: 50,
      y: 100,
      texture: 'bird'
    });

    this.addNewRowOfPipes();

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addNewRowOfPipes,
      callbackScope: this,
      loop: true
    });
  }

  update(): void {
    if (!this.bird.getDead()) {
      this.background.tilePositionX += 4;
      this.bird.update();
      this.physics.overlap(
        this.bird,
        this.pipes,
        function () {
          this.bird.setDead(true);
        },
        null,
        this
      );
      this.physics.overlap(
        this.bird,
        this.coins,
        (bird: Bird, coin: Coin) => {
          console.log('alo')
          this.registry.values.score += 10;
          this.add.tween({
            targets: this.scoreText,
            alpha: 0,
            yoyo: true,
            duration: 100,
            repeat: 3
          })
          coin.destroyParticle();
          coin.destroy();
        },
        null,
        this
      );
    } else {
      Phaser.Actions.Call(
        this.pipes.getChildren(),
        function (pipe: Pipe) {
          pipe.body.setVelocityX(0);
        },
        this
      );
      Phaser.Actions.Call(
        this.coins.getChildren(),
        function (coin: Coin) {
          coin.body.setVelocityX(0);
        },
        this
      );

      if (this.bird.y > this.sys.canvas.height) {
        this.scene.start('MainMenuScene');
      }
    }
  }

  private addNewRowOfPipes(): void {
    // update the score
    this.registry.values.score += 1;
    this.scoreText.setText(this.registry.values.score);
    if (this.registry.values.score !== 0 && this.registry.values.score % 5 === 0) {
      this.add.tween({
        targets: this.scoreText,
        alpha: 0,
        yoyo: true,
        duration: 100,
        repeat: 3
      })
    }

    // randomly pick a number between 1 and 5
    let hole = Math.floor(Math.random() * 5) + 1;

    // add 6 pipes with one big hole at position hole and hole + 1
    for (let i = 0; i < 10; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        if (i === hole - 1) {
          this.addPipe(400, i * 60, 0);
        } else if (i === hole + 3) {
          this.addPipe(400, i * 60, 1);
        } else {
          this.addPipe(400, i * 60, 2);
        }
      }
    }
    // add coin
    let rnd = Math.random();
    if (rnd < 0.2) {
      if (rnd < 0.11)
        this.addCoin(550, (hole + 4) * 60, 0);
      else
        this.addCoin(550, (hole - 2) * 60, 0);
    }
  }

  private addPipe(x: number, y: number, frame: number): void {
    // create a new pipe at the position x and y and add it to group
    this.pipes.add(
      new Pipe({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        texture: 'pipe'
      })
    );
  }
  private addCoin(x: number, y: number, frame: number): void {
    this.coins.add(
      new Coin({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        texture: 'coin'
      })
    );
  }
}
