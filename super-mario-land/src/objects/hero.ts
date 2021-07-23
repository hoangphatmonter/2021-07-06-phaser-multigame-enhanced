import { Scene } from "phaser";

export default class Hero {
    // body: Phaser.Physics.Arcade.Body;
    private scene: Scene
    private sgo: any;

    // variables
    private currentScene: Phaser.Scene;
    private marioSize: string;
    private acceleration: number;
    private isJumping: boolean;
    private isDying: boolean;
    private isVulnerable: boolean;
    private vulnerableCounter: number;

    private isRunning: boolean;
    private isSitting: boolean;
    private scale: number;
    private offsetX: number;
    private offsetY: number;
    private isFlying: boolean;

    private allowClimb: boolean;
    private isClimbing: boolean;

    private allowSwing: boolean;
    private swing: { isSwinging: boolean, objX: number, objY: number }

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

    /**
     * This set the state of the hero. Set this will make the hero change state
     */
    set climb(val: boolean) {
        this.allowClimb = val;
    }

    get climb() {
        return this.allowClimb;
    }

    /**
     * This set the state of the hero. Set this will make the hero change state
     */
    public setSwing(val: boolean, x: number, y: number) {
        this.allowSwing = val;
        this.swing.objX = x;
        this.swing.objY = y;
    }

    get isSwing() {
        return this.allowSwing;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, anim: string, loop = false) {
        // super(scene, x, y);
        // super(scene, window.SpinePlugin, x, y);
        this.scene = scene;
        this.sgo = scene.add.spine(14, 100, 'spineboy', 'idle', true);
        this.sgo.depth = 100;
        this.sgo.setScale(0.02);
        scene.physics.add.existing(this.sgo, false);

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
    //#region privatemethod
    private initSprite() {
        // variables
        this.marioSize = this.currentScene.registry.get('marioSize');
        this.acceleration = 500;
        this.isJumping = false;
        this.isDying = false;
        this.isVulnerable = true;
        this.vulnerableCounter = 100;

        this.isRunning = false;
        this.isSitting = false;
        this.scale = 0.02;
        this.offsetX = this.sgo.width;
        this.offsetY = this.sgo.height;
        this.isFlying = false;
        this.isClimbing = false;
        this.allowClimb = false;

        this.allowSwing = false;
        this.swing = { isSwinging: false, objX: 0, objY: 0 }

        // sprite
        // this.sgo.setOrigin(0.5, 0.5);
        // this.sgo.setFlipX(false);

        // input
        this.keys = new Map([
            ['LEFT', this.addKey('LEFT')],
            ['RIGHT', this.addKey('RIGHT')],
            ['DOWN', this.addKey('DOWN')],
            ['JUMP', this.addKey('SPACE')],
            ['FLY', this.addKey('Z')],
            ['UP', this.addKey('UP')]
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
        // console.log(this.spine.body.velocity, this.spine.body.acceleration)
        if (!this.isDying) {
            // console.log(this.spine.body.wasTouching.none ? 'notouch' : 'touch', this.spine.body.touching.none ? 'notouch' : 'touch', this.spine.body.touching.up, this.spine.body.touching.down, this.spine.body.touching.left, this.spine.body.touching.right)
            if (!this.spine.body.embedded) {
                // console.log(this.spine.body.width, this.spine.body.height)
                // out of the ladder
                this.allowClimb = false;
                this.isClimbing = false;

                if (this.allowSwing)
                    this.sgo.body.setAllowGravity(true);
                this.allowSwing = false;
                this.swing.isSwinging = false;
                this.spine.body.setAccelerationY(0)
                // console.log('out of the ladder');
            }

            if (this.keys.get('FLY').isDown && !this.allowClimb && !this.allowSwing) {
                this.keys.get('FLY').isDown = false;
                if (this.sgo.body.allowGravity === false) {
                    this.sgo.body.setAllowGravity(true);
                } else {
                    this.sgo.body.setAllowGravity(false);
                    this.sgo.play('fly', false);
                    this.sgo.y -= this.scene.sys.canvas.height / 50;
                }
            } else if (this.allowSwing) {
                this.sgo.body.setAllowGravity(false);
                if (Math.abs(this.sgo.y - this.sgo.displayHeight - this.swing.objY) < 5) {
                    console.log(this.sgo.y - this.sgo.displayHeight - this.swing.objY)
                    this.sgo.body.setVelocityY(0);
                    this.sgo.body.setAccelerationY(0);
                }
            }

            if (this.sgo.body.allowGravity) {
                this.handleInput();
                if (this.allowClimb) {
                    this.isRunning = false;
                    this.isSitting = false;
                    this.swing.isSwinging = false;
                    this.handleClimb();
                    this.handleClimbAnimations();
                } else {
                    this.handleGroundAnimations();
                }
            } else {
                if (this.allowSwing) {
                    this.isRunning = false;
                    this.isSitting = false;
                    this.isClimbing = false;
                    this.handleSwing();
                    this.handleSwingAnimations();
                }
                else {
                    this.handleAirInput();
                    this.handleAirAnimations();
                }
            }
        } else {
            // this.sgo.setFrame(12);
            this.sgo.play('death', false);
            if (this.spine.y > this.currentScene.sys.canvas.height) {
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

    //#region ground method

    private handleInput() {
        if (this.spine.y > this.currentScene.sys.canvas.height) {
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
            if (this.sgo.scaleX < 0) {    // if not have if, body will fluctuate
                this.sgo.setScale(this.scale, this.scale); // this.sgo.setFlipX(false);
                this.offsetX = 0;
                this.offsetY = 0;
                this.sgo.body.setOffset(this.offsetX, this.offsetY);
            }
        } else if (this.keys.get('LEFT').isDown) {
            this.sgo.body.setAccelerationX(-this.acceleration);
            // this.sgo.setFlipX(true);
            if (this.sgo.scaleX > 0) {
                this.sgo.setScale(-this.scale, this.scale); // this.sgo.setFlipX(true);
                // this.sgo.setSize(this.sgo.width, this.sgo.height);
                this.offsetX = this.sgo.width;
                this.offsetY = 0;
                this.sgo.body.setOffset(this.offsetX, this.offsetY);
                // console.log(this.sgo.x, this.sgo.displayWidth, this.sgo.width, this.sgo.width * 0.5, this.sgo.scaleX, this.sgo.scaleY)
            }
        } else if (this.keys.get('DOWN').isDown) {
            this.sgo.body.setVelocityY(this.acceleration);
        } else {
            this.sgo.body.setVelocityX(0);
            this.sgo.body.setAccelerationX(0);
        }

        // handle jumping
        if (this.keys.get('JUMP').isDown && !this.isJumping && this.sgo.body.allowGravity === true) {
            this.sgo.body.setVelocityY(-180);
            this.isJumping = true;
            this.isRunning = false;
            this.isSitting = false;
        }
    }

    private handleGroundAnimations(): void {
        if (this.sgo.getCurrentAnimation().name === 'idle')
            this.sgo.refresh();
        if (this.sgo.body.velocity.y !== 0) {
            // mario is jumping or falling
            if (this.keys.get('DOWN').isDown && !this.isSitting) {
                this.sgo.play('sit', false);
                this.sgo.body.setSize(this.sgo.width, this.sgo.height / 1.5);
                if (this.sgo.scaleX > 0) {
                    this.offsetX = 0;
                } else {
                    this.offsetX = this.sgo.width;
                }
                this.offsetY = this.sgo.height - this.sgo.height / 1.5;
                this.sgo.body.setOffset(this.offsetX, this.offsetY);
                this.isRunning = false;
                this.isSitting = true;
                // console.log('sit')
            }
            else if (!this.isSitting) {
                this.sgo.play('idle', true);
                this.sgo.body.setSize(this.sgo.width, this.sgo.height);
                if (this.sgo.scaleX > 0) {
                    this.offsetX = 0;
                } else {
                    this.offsetX = this.sgo.width;
                }
                this.offsetY = 0;
                this.sgo.body.setOffset(this.offsetX, this.offsetY);
                this.isRunning = false;
                // this.isSitting = false;
            }
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

            if (Math.abs(this.sgo.body.velocity.x) > 0.05 && !this.isRunning) {
                this.isRunning = true;
                this.isSitting = false;
                this.sgo.play('run', true);
                // console.log('runaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                this.sgo.body.setSize(this.sgo.width, this.sgo.height);
                // this.sgo.body.setOffset(0, 0);
            }
            else if (Math.abs(this.sgo.body.velocity.x) <= 0.05) {
                this.isRunning = false;
            }
            // else {
            //     this.sgo.play('run', true);
            // }
        } else {
            // mario is standing still
            this.sgo.play('idle', true);
            this.sgo.body.setSize(this.sgo.width, this.sgo.height);
            if (this.sgo.scaleX > 0) {
                this.offsetX = 0;
            } else {
                this.offsetX = this.sgo.width;
            }
            this.offsetY = 0;
            this.sgo.body.setOffset(this.offsetX, this.offsetY);
            this.isRunning = false;
            this.isSitting = false;
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
    //#endregion

    //#region air method
    private handleAirInput() {
        if (this.spine.y > this.currentScene.sys.canvas.height) {
            // mario fell into a hole
            this.isDying = true;
        }

        // handle movements to left and right
        if (this.keys.get('RIGHT').isDown) {
            this.sgo.body.setAccelerationX(this.acceleration);
            if (this.sgo.scaleX < 0) {    // if not have if, body will fluctuate
                this.sgo.setScale(this.scale, this.scale); // this.sgo.setFlipX(false);
                // this.sgo.body.setSize(this.sgo.body.height, this.sgo.body.width / 2);
            }
        } else if (this.keys.get('LEFT').isDown) {
            this.sgo.body.setAccelerationX(-this.acceleration);
            if (this.sgo.scaleX > 0) {
                this.sgo.setScale(-this.scale, this.scale); // this.sgo.setFlipX(true);
                // this.sgo.body.setSize(this.sgo.body.height, this.sgo.body.width / 2);
            }
        } else if (this.keys.get('DOWN').isDown) {
            this.sgo.body.setAccelerationY(this.acceleration);

        } else if (this.keys.get('UP').isDown) {
            this.sgo.body.setAccelerationY(-this.acceleration);
        } else {
            this.sgo.body.setVelocityX(0);
            this.sgo.body.setAccelerationX(0);

            this.sgo.body.setVelocityY(0);
            this.sgo.body.setAccelerationY(0);
        }
    }

    private handleAirAnimations(): void {
        this.sgo.refresh();
        // this.sgo.body.setSize(this.sgo.height, this.sgo.width / 2);
        // if (this.sgo.scaleX > 0) {
        //     this.offsetX = this.sgo.width / 2;
        // } else {
        //     this.offsetX = this.sgo.width * 2;
        // }
        // this.offsetY = this.sgo.height / 1.5;
        this.sgo.body.setSize(this.sgo.width, this.sgo.height);
        if (this.sgo.scaleX > 0) {
            this.offsetX = 0;
        } else {
            this.offsetX = this.sgo.width;
        }
        // this.offsetY = this.sgo.height / 1.5;
        // console.log(this.sgo.width, this.sgo.height)
        this.sgo.body.setOffset(this.offsetX, this.offsetY);
    }

    //#endregion

    //#region  climb method

    private handleClimb() {
        if (this.spine.y > this.currentScene.sys.canvas.height) {
            // mario fell into a hole
            this.isDying = true;
        }


        if (this.keys.get('DOWN').isDown) {     // will duplicate the DOWN in the hanldGroundAnimation and Input
            this.sgo.body.setAccelerationY(this.acceleration);

        } else if (this.keys.get('UP').isDown) {
            this.sgo.body.setAccelerationY(-this.acceleration);
        } else if (this.keys.get('LEFT').isDown) {
            // use ground method
        } else if (this.keys.get('RIGHT').isDown) {
            // use ground method
        }
        // else {

        //     this.sgo.body.setVelocityY(0);
        //     this.sgo.body.setAccelerationY(0);
        // }
    }

    private handleClimbAnimations() {
        if (!this.isClimbing) {
            this.sgo.play('climb', true);
            // this.sgo.state.timeScale = 0;
            this.isClimbing = true;
            this.sgo.refresh();
        }
        this.sgo.body.setSize(this.sgo.width, this.sgo.height);
        if (this.sgo.scaleX > 0) {
            this.offsetX = 0;
        } else {
            this.offsetX = this.sgo.width;
        }
        this.sgo.body.setOffset(this.offsetX, this.offsetY);
    }

    //#endregion

    //#region swing method

    private handleSwing() {
        // console.log(this.sgo.body.allowGravity)
        if (this.spine.y > this.currentScene.sys.canvas.height) {
            // mario fell into a hole
            this.isDying = true;
        }

        if (this.keys.get('RIGHT').isDown) {
            this.sgo.body.setAccelerationX(this.acceleration);
            if (this.sgo.scaleX < 0) {    // if not have if, body will fluctuate
                this.sgo.setScale(this.scale, this.scale); // this.sgo.setFlipX(false);
                this.offsetX = 0;
                this.offsetY = 0;
                this.sgo.body.setOffset(this.offsetX, this.offsetY);
            }
        } else if (this.keys.get('LEFT').isDown) {
            this.sgo.body.setAccelerationX(-this.acceleration);
            // this.sgo.setFlipX(true);
            if (this.sgo.scaleX > 0) {
                this.sgo.setScale(-this.scale, this.scale); // this.sgo.setFlipX(true);
                // this.sgo.setSize(this.sgo.width, this.sgo.height);
                this.offsetX = this.sgo.width;
                this.offsetY = 0;
                this.sgo.body.setOffset(this.offsetX, this.offsetY);
            }
        }
        else {
            this.sgo.body.setVelocityX(0);
            this.sgo.body.setAccelerationX(0);

            // this.sgo.body.setVelocityY(0);
            // this.sgo.body.setAccelerationY(0);
        }
    }
    private handleSwingAnimations() {
        if (!this.swing.isSwinging) {
            this.sgo.play('swing', true);
            // this.sgo.state.timeScale = 0;
            this.swing.isSwinging = true;
        }
        this.sgo.refresh();
        this.sgo.body.setSize(this.sgo.width, this.sgo.height);
        if (this.sgo.scaleX > 0) {
            this.offsetX = 0;
        } else {
            this.offsetX = this.sgo.width;
        }
        this.sgo.body.setOffset(this.offsetX, this.offsetY);
    }

    //#endregion

    private shrinkMario(): void {
        this.marioSize = 'small';
        this.currentScene.registry.set('marioSize', 'small');
        this.adjustPhysicBodyToSmallSize();
    }

    private adjustPhysicBodyToSmallSize(): void {
        this.scale = 0.02;
        // this.sgo.body.setSize(6, 12);
        // this.sgo.body.setOffset(6, 4);
        if (this.sgo.scaleX > 0) {
            this.sgo.setScale(this.scale, this.scale);
        }
        else
            this.sgo.setScale(-this.scale, this.scale);
        this.sgo.body.setSize(this.sgo.width, this.sgo.height);
    }

    private adjustPhysicBodyToBigSize(): void {
        // this.sgo.body.setSize(8, 16);
        // this.sgo.body.setOffset(4, 0);
        this.scale = 0.025;
        if (this.sgo.scaleX > 0) {
            this.sgo.setScale(this.scale, this.scale); // this.sgo.setFlipX(true);
            this.sgo.body.setSize(this.sgo.width, this.sgo.height);
            this.sgo.body.setOffset(0, 0);
        } else {
            this.sgo.setScale(-this.scale, this.scale); // this.sgo.setFlipX(true);
            // this.sgo.setSize(this.sgo.width, this.sgo.height);
            // this.sgo.body.setSize(1, 1);
            this.sgo.body.setOffset(this.sgo.width, 0);
        }
    }

    //#endregion

    public growMario(): void {
        this.marioSize = 'big';
        this.currentScene.registry.set('marioSize', 'big');
        this.adjustPhysicBodyToBigSize();
    }

    public bounceUpAfterHitEnemyOnHead(): void {
        this.currentScene.add.tween({
            targets: this.sgo,
            props: { y: this.spine.y - 5 },
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
            this.sgo.body.setSize(this.sgo.width, this.sgo.height);
            this.sgo.body.setOffset(0, 0);
            this.isRunning = false;
            this.isSitting = false;

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