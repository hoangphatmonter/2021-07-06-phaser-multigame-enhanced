import { IPlatformConstructor } from '../interfaces/platform.interface';

export class Rope extends Phaser.GameObjects.Graphics {
  body: Phaser.Physics.Arcade.Body;

  // variables

  constructor(aParams: IPlatformConstructor, w: number, h: number) {
    super(aParams.scene, { x: aParams.x, y: aParams.y });

    this.fillStyle(0xffff00, 1);
    this.fillRect(aParams.x, aParams.y, w, h);
    this.initImage(w, h);
    this.scene.add.existing(this);
  }

  private initImage(w: number, h: number): void {
    // image
    // this.displayOriginX = 0;
    // this.displayOriginY = 0;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setSize(w, h);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  update(): void {
  }
}
