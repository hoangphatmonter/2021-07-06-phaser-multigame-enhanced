import { IImageConstructor } from '../interfaces/image.interface';

export class Box extends Phaser.GameObjects.Image {
    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.setOrigin(0.5, 0.5);
        this.setAlpha(0.1);
        this.scene.add.existing(this);
    }

    update(): void {
        if (this.alpha < 1) {
            this.setAlpha(this.alpha + 0.01);
        } else {
            this.setAlpha(1);
        }
    }

    isCompletelyShowed() {
        return this.alpha === 1 ? true : false;
    }
}
