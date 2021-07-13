import { IBulletConstructor } from '../interfaces/bullet.interface';

export class Bomb extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    private bombSpeed: number;

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        this.initVariables(aParams);
        this.initImage();
        this.initPhysics();

        this.scene.add.existing(this);
    }

    private initVariables(aParams: IBulletConstructor): void {
        this.bombSpeed = aParams.bulletProperties.speed;
    }

    private initImage(): void {
        this.setOrigin(0.5, 0.5);
        this.setScale(0.05);
    }

    private initPhysics(): void {
        this.scene.physics.world.enable(this);
        this.body.setVelocityY(this.bombSpeed);
        this.body.setSize();
    }

    update(): void {
        if (this.y < 0 || this.y > this.scene.sys.canvas.height) {
            this.destroy();
        }
    }
}
