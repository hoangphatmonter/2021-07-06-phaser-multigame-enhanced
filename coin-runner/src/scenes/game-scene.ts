import { Apple } from '../objects/apple';
import { Coin } from '../objects/coin';
import { Player } from '../objects/player';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private coin: Coin;
  private coinsCollectedText: Phaser.GameObjects.Text;
  private collectedCoins: number;
  private player: Player;
  private apples: Apple[];
  private spawnAppleTimer: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.image('background', './assets/images/background.png');
    this.load.image('player', './assets/images/player.png');
    this.load.image('coin', './assets/images/coin.png');
    this.load.image('apple', './assets/images/apple.png');
  }

  init(): void {
    this.collectedCoins = 0;
    this.apples = [];

    this.spawnAppleTimer = this.time.addEvent({
      delay: 4000,
      callback: this.spawnNewApple,
      callbackScope: this,
      loop: true
    });
  }

  create(): void {
    // create background
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

    // create objects
    this.coin = new Coin({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      texture: 'coin'
    });
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      texture: 'player'
    });

    // create texts
    this.coinsCollectedText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      this.collectedCoins + '',
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      }
    );
  }

  update(): void {
    // update objects
    this.player.update();
    this.coin.update();
    this.apples.forEach(apple => {
      apple.update();
    })

    // do the collision check
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.coin.getBounds()
      )
    ) {
      this.updateCoinStatus();
    }

    // do the collision check with apple
    for (let i = 0; i < this.apples.length; i++) {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          this.apples[i].getBounds()
        )
      ) {
        this.buyApple();
        this.apples[i].destroy();
        this.apples.splice(i, 1);
        i--;
      }
    }
  }

  private updateCoinStatus(): void {
    this.collectedCoins++;
    this.coinsCollectedText.setText(this.collectedCoins + '');
    this.coin.changePosition();
  }
  private buyApple(): void {
    this.collectedCoins--;
    this.coinsCollectedText.setText(this.collectedCoins + '');
  }
  private spawnNewApple(): void {
    this.apples.push(new Apple({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      texture: 'apple'
    }));
  }
}
