import { IBulletConstructor } from '../interfaces/bullet.interface';
import { Player } from './player';

export class Bomb extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    private bombSpeed: number;

    private tween: Phaser.Tweens.Tween;
    private player: Player;

    constructor(aParams: IBulletConstructor, player: Player) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);
        this.player = player;

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
        this.tween = this.scene.add.tween({
            targets: this,
            x: 0,
            y: 0,
            ease: 'Sine.easeIn',
            duration: 1000,
            speedY: 100
            // pause: true
        }); // after this done, it will effect by the global gravity because it have a body
        // this.tween.play();
    }

    update(): void {
        if (this.y < 0 || this.y > this.scene.sys.canvas.height) {
            this.destroy();
        }
        // play tween
        if (this.tween.isPlaying() && this.tween.progress < 0.2) {
            this.tween.updateTo('x', this.player.x, false);
            this.tween.updateTo('y', this.player.y, false);
        }
    }
}
