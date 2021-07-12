import { ICrystalConstructor } from '../interfaces/crystal.interface';

export class OriginalApple extends Phaser.GameObjects.Image {
    private randomAlpha: number;

    constructor(aParams: ICrystalConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        this.initVariables(aParams.alpha);
        this.initImage();
        this.scene.add.existing(this);
    }

    private initVariables(alpha: number): void {
        this.randomAlpha = alpha;
    }

    private initImage(): void {
        this.setOrigin(0.5);
        this.setScale(0.5);
        this.setAlpha(this.randomAlpha);
    }
}
