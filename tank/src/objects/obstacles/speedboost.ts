import { IImageConstructor } from '../../interfaces/image.interface';

export class SpeedBoost extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        this.initImage();
        this.scene.add.existing(this);
    }

    private initImage(): void {
        // image
        this.setOrigin(0, 0);
        this.setScale(0.2, 0.2);

        // physics
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
    }

    update(): void { }
}
