import { IPlatformConstructor } from '../interfaces/platform.interface';

export class Rope extends Phaser.GameObjects.Graphics {
  body: Phaser.Physics.Arcade.Body;

  // variables

  constructor(aParams: IPlatformConstructor) {
    super(aParams.scene, { x: aParams.x, y: aParams.y });

    this.fillStyle(0xffff00, 1);
    this.fillRect(aParams.x, aParams.y, 4, 40);
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage(): void {
    // image
    // this.displayOriginX = 0;
    // this.displayOriginY = 0;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setSize(4, 40);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  update(): void {
  }
}
