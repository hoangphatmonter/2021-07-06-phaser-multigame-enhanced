import { IImageConstructor } from '../interfaces/image.interface';

export class Coin extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    private particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        // image
        this.setScale(0.2);
        this.setOrigin(0, 0);

        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityX(-200);
        this.body.setSize(20, 20);

        let circle = new Phaser.Geom.Circle(0, 0, this.displayWidth / 1.5);
        this.particle = this.scene.add.particles('flares');
        this.emitter = this.particle.createEmitter({
            frame: 'yellow',
            x: this.x, y: this.y,
            lifespan: 200,
            quantity: 1,
            scale: 0.1,
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitZone: { type: 'edge', source: circle, quantity: 50 }
        }).startFollow(this);

        this.scene.add.existing(this);
    }

    public destroyParticle() {
        this.particle.destroy();
    }
}
