import { CloneApple } from '../objects/clone-apple';
import { CloneCrystal } from '../objects/clone-crystal';
import { OriginalApple } from '../objects/original-apple';
import { OriginalCrystal } from '../objects/original-crystal';

enum ObjTypes { CRYSTAL, APPLE };

export class GameScene extends Phaser.Scene {
  private cloneCrystal: Phaser.GameObjects.Image;
  private originalCrystal: Phaser.GameObjects.Image;
  private playerHasClicked: boolean;
  private alphaDifferenceText: Phaser.GameObjects.Text;
  private feedbackText: Phaser.GameObjects.Text;
  private wonderfulText: Phaser.GameObjects.Text;
  private wonderfulCount: number;

  private nextElement: ObjTypes;
  private isCountUpdate: boolean;

  constructor() {
    super({
      key: 'GameScene'
    });

    this.nextElement = ObjTypes.CRYSTAL;
    this.wonderfulCount = 0;
  }

  preload(): void {
    this.load.image('crystal', './assets/images/crystal.png');
    this.load.image('apple', './assets/images/apple.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
  }

  init(): void {
    this.playerHasClicked = false;
    this.isCountUpdate = false;
    this.alphaDifferenceText = null;
    this.feedbackText = null;
    this.wonderfulText = this.add.text(
      0,
      0,
      `Wonderful Streak: ${this.wonderfulCount}`,
      {
        fontFamily: 'Arial',
        fontSize: 50 + 'px',
        stroke: '#000000',
        strokeThickness: 8,
        color: '#ffffff'
      }
    ).setOrigin(0, 0);
  }

  create(): void {
    // add particle
    if (this.wonderfulCount !== 0) {
      var logoSource = {
        getRandomPoint: (vec: any) => {
          var x = Phaser.Math.Between(0, this.wonderfulText.width - 1);
          var y = Phaser.Math.Between(0, this.wonderfulText.height - 1);

          return vec.setTo(x + this.wonderfulText.getTopLeft().x, y + this.wonderfulText.getTopLeft().y);
        }
      };

      let frameColor: string = 'white';
      if (this.wonderfulCount <= 5 && this.wonderfulCount > 1)
        frameColor = 'green';
      else if (this.wonderfulCount <= 10)
        frameColor = 'blue';
      else if (this.wonderfulCount <= 20)
        frameColor = 'red';
      else if (this.wonderfulCount > 20)
        frameColor = 'yellow';

      this.add.particles('flares').createEmitter({
        frame: frameColor,
        x: 0,
        y: 0,
        lifespan: 1000,
        gravityY: 10,
        scale: { start: 0, end: 0.25, ease: 'Quad.easeOut' },
        alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
        blendMode: 'ADD',
        emitZone: { type: 'random', source: logoSource },
        quantity: 5
      });
    }
    // create game objects
    switch (this.nextElement) {
      case ObjTypes.APPLE:
        this.cloneCrystal = new CloneApple({
          scene: this,
          x: this.sys.canvas.width / 2 - 150,
          y: this.sys.canvas.height / 2,
          texture: 'apple'
        });
        this.originalCrystal = new OriginalApple({
          scene: this,
          x: this.sys.canvas.width / 2 + 150,
          y: this.sys.canvas.height / 2,
          texture: 'apple',
          alpha: Phaser.Math.RND.realInRange(0, 1)
        });
        // change next ele
        this.nextElement = ObjTypes.CRYSTAL;
        console.log('apple');
        break;
      case ObjTypes.CRYSTAL:
        this.cloneCrystal = new CloneCrystal({
          scene: this,
          x: this.sys.canvas.width / 2 - 150,
          y: this.sys.canvas.height / 2,
          texture: 'crystal'
        });
        this.originalCrystal = new OriginalCrystal({
          scene: this,
          x: this.sys.canvas.width / 2 + 150,
          y: this.sys.canvas.height / 2,
          texture: 'crystal',
          alpha: Phaser.Math.RND.realInRange(0, 1)
        });
        this.nextElement = ObjTypes.APPLE;
        console.log('ctystal');
        break;
    }

    this.tweens.add({
      targets: [this.cloneCrystal, this.originalCrystal],
      angle: 360,
      _ease: 'Sine.easeInOut',
      ease: 'Power2',
      duration: 1000,
      onStart: () => { this.input.mouse.enabled = false },
      onComplete: () => { this.input.mouse.enabled = true }
    })

    this.input.on(
      'pointerdown',
      function () {
        if (!this.playerHasClicked) {
          this.playerHasClicked = true;
        } else {
          this.scene.start('GameScene');
        }
      },
      this
    );
  }

  update(): void {
    if (!this.playerHasClicked) {
      this.cloneCrystal.update();
    } else {
      let difference = this.calculateAlphaDifference();
      this.createResultTexts(difference);
    }
  }

  private calculateAlphaDifference(): number {
    return Math.abs(this.cloneCrystal.alpha - this.originalCrystal.alpha);
  }

  private createResultTexts(difference: number): void {
    this.alphaDifferenceText = this.add.text(
      this.sys.canvas.width / 2 - 100,
      this.sys.canvas.height / 2 + 100,
      difference.toFixed(2) + '',
      {
        fontFamily: 'Arial',
        fontSize: 100 + 'px',
        stroke: '#000000',
        strokeThickness: 8,
        color: '#ffffff'
      }
    );

    let textConfig: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: 50 + 'px',
      stroke: '#000000',
      strokeThickness: 8,
      color: '#ffffff'
    };

    if (difference >= 0.1) {
      this.updateWonderfulCount(true);
      if (difference >= 0.5) {
        this.feedbackText = this.add.text(
          this.sys.canvas.width / 2 - 250,
          this.sys.canvas.height / 2 - 150,
          'You can do better!',
          textConfig
        );
      } else if (difference < 0.5 && difference >= 0.3) {
        this.feedbackText = this.add.text(
          this.sys.canvas.width / 2 - 40,
          this.sys.canvas.height / 2 - 150,
          'OK!',
          textConfig
        );
      } else if (difference < 0.3 && difference >= 0.1) {
        this.feedbackText = this.add.text(
          this.sys.canvas.width / 2 - 90,
          this.sys.canvas.height / 2 - 150,
          'Great!',
          textConfig
        );
      }
    } else {
      this.updateWonderfulCount(false);
      if (difference < 0.1 && difference > 0.005) {
        this.feedbackText = this.add.text(
          this.sys.canvas.width / 2 - 145,
          this.sys.canvas.height / 2 - 150,
          'Wonderful!',
          textConfig
        );
      } else if (difference <= 0.005) {
        this.feedbackText = this.add.text(
          this.sys.canvas.width / 2 - 145,
          this.sys.canvas.height / 2 - 150,
          'Unbelievable!',
          textConfig
        );
      }
    }
  }

  updateWonderfulCount(reset: boolean) {
    if (!this.isCountUpdate) {
      if (reset)
        this.wonderfulCount = 0;
      else
        this.wonderfulCount += 1;
      this.isCountUpdate = true;
    }
  }
}
