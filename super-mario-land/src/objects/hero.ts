export default class Hero extends Phaser.GameObjects.Container {
    // body: Phaser.Physics.Arcade.Body;
    private sgo: any;

    // variables
    private currentScene: Phaser.Scene;
    private marioSize: string;
    private acceleration: number;
    private isJumping: boolean;
    private isDying: boolean;
    private isVulnerable: boolean;
    private vulnerableCounter: number;

    // input
    private keys: Map<string, Phaser.Input.Keyboard.Key>;

    public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
        return this.keys;
    }

    public getVulnerable(): boolean {
        return this.isVulnerable;
    }

    get spine() {
        return this.sgo
    }

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, anim: string, loop = false) {
        super(scene, x, y);
        // super(scene, window.SpinePlugin, x, y);

        this.sgo = scene.add.spine(14, 100, 'set1.spineboy', 'idle', true).setScale(0.02);
        scene.physics.add.existing(this.sgo)

        // scene.physics.add.existing(this)
        // this.sgo.body.setCollideWorldBounds(true);

        // this.add(this.sgo)       // make the spine disappear

        this.currentScene = scene;
        this.initSprite();
    }

    faceDirection(dir: 1 | -1) {
        if (this.sgo.scaleX === dir) {
            return
        }

        this.sgo.scaleX = dir
    }



    ///////////////////////////////
    private initSprite() {
        // variables
        this.marioSize = this.currentScene.registry.get('marioSize');
        this.acceleration = 500;
        this.isJumping = false;
        this.isDying = false;
        this.isVulnerable = true;
        this.vulnerableCounter = 100;

        // sprite
        // this.sgo.setOrigin(0.5, 0.5);
        this.sgo.setFlipX(false);

        // input
        this.keys = new Map([
            ['LEFT', this.addKey('LEFT')],
            ['RIGHT', this.addKey('RIGHT')],
            ['DOWN', this.addKey('DOWN')],
            ['JUMP', this.addKey('SPACE')]
        ]);

        // physics
        // this.currentScene.physics.world.enable(this);
        // this.adjustPhysicBodyToSmallSize();
        this.sgo.body.maxVelocity.x = 50;
        this.sgo.body.maxVelocity.y = 300;
    }

    private addKey(key: string): Phaser.Input.Keyboard.Key {
        return this.currentScene.input.keyboard.addKey(key);
    }

    update(): void {
        if (!this.isDying) {
            this.handleInput();
            this.handleAnimations();
        } else {
            // this.sgo.setFrame(12);
            this.sgo.play('death', false);
            if (this.y > this.currentScene.sys.canvas.height) {
                this.currentScene.scene.stop('GameScene');
                this.currentScene.scene.stop('HUDScene');
                this.currentScene.scene.start('MenuScene');
            }
        }

        if (!this.isVulnerable) {
            if (this.vulnerableCounter > 0) {
                this.vulnerableCounter -= 1;
            } else {
                this.vulnerableCounter = 100;
                this.isVulnerable = true;
            }
        }
    }

    private handleInput() {
        if (this.y > this.currentScene.sys.canvas.height) {
            // mario fell into a hole
            this.isDying = true;
        }

        // evaluate if player is on the floor or on object
        // if neither of that, set the player to be jumping
        if (
            this.sgo.body.onFloor() ||
            this.sgo.body.touching.down ||
            this.sgo.body.blocked.down
        ) {
            this.isJumping = false;
            //this.sgo.body.setVelocityY(0);
        }

        // handle movements to left and right
        if (this.keys.get('RIGHT').isDown) {
            this.sgo.body.setAccelerationX(this.acceleration);
            this.sgo.setFlipX(false);
        } else if (this.keys.get('LEFT').isDown) {
            this.sgo.body.setAccelerationX(-this.acceleration);
            this.sgo.setFlipX(true);
        } else {
            this.sgo.body.setVelocityX(0);
            this.sgo.body.setAccelerationX(0);
        }

        // handle jumping
        if (this.keys.get('JUMP').isDown && !this.isJumping) {
            this.sgo.body.setVelocityY(-180);
            this.isJumping = true;
        }
    }

    private handleAnimations(): void {
        if (this.sgo.body.velocity.y !== 0) {
            // mario is jumping or falling
            this.sgo.play('idle', true);
            if (this.marioSize === 'small') {
                // this.sgo.setFrame(4);
            } else {
                // this.sgo.setFrame(10);
            }
        } else if (this.sgo.body.velocity.x !== 0) {
            // mario is moving horizontal

            // check if mario is making a quick direction change
            if (
                (this.sgo.body.velocity.x < 0 && this.sgo.body.acceleration.x > 0) ||
                (this.sgo.body.velocity.x > 0 && this.sgo.body.acceleration.x < 0)
            ) {
                if (this.marioSize === 'small') {
                    // this.sgo.setFrame(5);
                } else {
                    // this.sgo.setFrame(11);
                }
            }

            if (this.sgo.body.velocity.x > 0) {
                this.sgo.play('run', true);
            } else {
                this.sgo.play('run', true);
            }
        } else {
            // mario is standing still
            this.sgo.play('idle', true);
            if (this.marioSize === 'small') {
                // this.sgo.setFrame(0);
            } else {
                if (this.keys.get('DOWN').isDown) {
                    // this.sgo.setFrame(13);
                } else {
                    // this.sgo.setFrame(6);
                }
            }
        }
    }

    public growMario(): void {
        this.marioSize = 'big';
        this.currentScene.registry.set('marioSize', 'big');
        this.adjustPhysicBodyToBigSize();
    }

    private shrinkMario(): void {
        this.marioSize = 'small';
        this.currentScene.registry.set('marioSize', 'small');
        // this.adjustPhysicBodyToSmallSize();
    }

    //   private adjustPhysicBodyToSmallSize(): void {
    //     this.sgo.body.setSize(6, 12);
    //     this.sgo.body.setOffset(6, 4);
    //   }

    private adjustPhysicBodyToBigSize(): void {
        this.sgo.body.setSize(8, 16);
        this.sgo.body.setOffset(4, 0);
    }

    public bounceUpAfterHitEnemyOnHead(): void {
        this.currentScene.add.tween({
            targets: this.sgo,
            props: { y: this.y - 5 },
            duration: 200,
            ease: 'Power1',
            yoyo: true
        });
    }

    public gotHit(): void {
        this.isVulnerable = false;
        if (this.marioSize === 'big') {
            this.shrinkMario();
        } else {
            // mario is dying
            this.isDying = true;

            // sets acceleration, velocity and speed to zero
            // stop all animations
            // this.sgo.body.stop();
            this.sgo.play('idle', true);

            // make last dead jump and turn off collision check
            this.sgo.body.setVelocityY(-180);

            // this.sgo.body.checkCollision.none did not work for me
            this.sgo.body.checkCollision.up = false;
            this.sgo.body.checkCollision.down = false;
            this.sgo.body.checkCollision.left = false;
            this.sgo.body.checkCollision.right = false;
        }
    }
}