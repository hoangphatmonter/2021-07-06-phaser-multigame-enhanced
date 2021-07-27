import { IImageConstructor } from '../interfaces/image.interface';

export class Coin extends Phaser.GameObjects.Image {
  private centerOfScreen: number;
  private changePositionTimer: Phaser.Time.TimerEvent;
  private lastPosition: string;

  private particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.particle = this.scene.add.particles('flares');
    let circle = new Phaser.Geom.Circle(0, 0, this.width / 1.5);
    let weightedCircle = {
      getRandomPoint: function (vec: any) {
        var t = Phaser.Math.PI2 * Math.random();
        var r = Math.pow(Math.random(), -0.1);

        vec.x = circle.x + r * Math.cos(t) * circle.radius;
        vec.y = circle.y + r * Math.sin(t) * circle.radius;

        return vec;
      }
    };
    this.particleEmitter = this.particle.createEmitter({
      frame: 'yellow',
      x: this.x, y: this.y,
      lifespan: 200,
      quantity: 1,
      scale: 0.1,
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      emitZone: { type: 'random', source: weightedCircle }
      // emitZone: { type: 'random', source: circle } // a whole circle
      // emitZone: { type: 'edge', source: circle, quantity: 50 }
    })
    this.initEvents();

    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.centerOfScreen = this.scene.sys.canvas.width / 2;
    this.changePositionTimer = null;
    this.setFieldSide();
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initEvents(): void {
    this.changePositionTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true
    });
  }

  update(): void { }

  public changePosition(): void {
    this.setNewPosition();
    this.setFieldSide();
    this.particleEmitter.killAll();
    this.particleEmitter.setPosition(this.x, this.y);

    this.changePositionTimer.reset({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true
    });
  }

  private setNewPosition(): void {
    if (this.lastPosition == 'right') {
      this.x = Phaser.Math.RND.integerInRange(100, this.centerOfScreen);
    } else {
      this.x = Phaser.Math.RND.integerInRange(385, 700);
    }
    this.y = Phaser.Math.RND.integerInRange(100, 500);
  }

  private setFieldSide(): void {
    if (this.x <= this.centerOfScreen) {
      this.lastPosition = 'left';
    } else {
      this.lastPosition = 'right';
    }
  }
}
