import { CONST } from '../const/const';
import { ICursorConstructor } from '../interfaces/cursor.interface';

export class Cursor extends Phaser.GameObjects.Image {
  private currentPosition: [number, number];
  private activated: boolean;

  private particles: Phaser.GameObjects.Particles.ParticleEmitter;
  private rect: Phaser.Geom.Rectangle;

  constructor(aParams: ICursorConstructor) {
    super(
      aParams.scene,
      aParams.x,
      aParams.y,
      aParams.texture,
      aParams.cursorStartPosition
    );

    this.currentPosition = aParams.cursorStartPosition;
    this.initVariables();
    this.initImage();
    this.initParticle();

    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.activated = false;
  }

  private initImage(): void {
    this.setOrigin(0, 0);
  }

  private initParticle(): void {
    this.rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);

    this.particles = this.scene.add.particles('flares').createEmitter({
      frame: 'red',
      lifespan: 1000,
      scale: { start: 0.05, end: 0 },
      emitZone: { type: 'edge', source: this.rect, quantity: 60 }
    });

    // var logoSource = {
    //   getRandomPoint: (vec: any) => {
    //     var x = Phaser.Math.Between(0, this.width - 1);
    //     var y = Phaser.Math.Between(0, this.height - 1);

    //     return vec.setTo(x + this.getTopLeft().x, y + this.getTopLeft().y);
    //   }
    // };
    // this.particles = this.scene.add.particles('flares').createEmitter({
    //   frame: 'yellow',
    //   x: 0,
    //   y: 0,
    //   lifespan: 150,
    //   gravityY: 10,
    //   scale: { start: 0, end: 0.25, ease: 'Quad.easeOut' },
    //   alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
    //   blendMode: 'ADD',
    //   emitZone: { type: 'random', source: logoSource },
    //   quantity: 1,
    //   active: false
    // });
  }
  update(): void {
    if (this.activated) {
      this.particles.setPosition(this.x, this.y);
      this.particles.active = true;
    }
    else {
      this.particles.active = false;
      this.particles.killAll();
    }
  }

  public moveTo(x: number, y: number): void {
    this.currentPosition = [x, y];
    this.setPosition(x * CONST.tileSize, y * CONST.tileSize);
  }

  public getX(): number {
    return this.currentPosition[0];
  }

  public getY(): number {
    return this.currentPosition[1];
  }

  public isActivated(): boolean {
    return this.activated;
  }

  public setActivated(): void {
    this.activated = !this.activated;
  }
}
