import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';

export class Player extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  private bullets: Phaser.GameObjects.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private flyingSpeed: number;
  private lastShoot: number;
  private shootingKey: Phaser.Input.Keyboard.Key;

  private shield: Phaser.GameObjects.Graphics;
  private turnOnShield: Phaser.Input.Keyboard.Key;
  private isShieldOn: boolean;
  private shieldDuration: number;

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.initInput();
    this.initPhysics();

    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.bullets = this.scene.add.group({
      runChildUpdate: true
    });
    this.lastShoot = 0;
    this.flyingSpeed = 100;
    this.shield = null;
    this.isShieldOn = false;
    this.shieldDuration = this.scene.registry.values.shieldLast;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
    this.scene.add.particles('flares').createEmitter({
      frame: 'blue',
      gravityY: 50,
      scale: { start: 0.05, end: 0.005 },
      lifespan: 500
    }).startFollow(this, 0, 5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.shootingKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.turnOnShield = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.V
    )
  }

  private initPhysics(): void {
    this.scene.physics.world.enable(this);
    this.body.setSize(13, 8);
  }

  update(time: number, delta: number): void {
    this.handleFlying();
    this.handleShooting();
    this.handleShield(delta);
  }

  private handleFlying(): void {
    if (
      this.cursors.right.isDown &&
      this.x < this.scene.sys.canvas.width - this.width / 2
    ) {
      this.body.setVelocityX(this.flyingSpeed);
    } else if (this.cursors.left.isDown && this.x > this.width / 2) {
      this.body.setVelocityX(-this.flyingSpeed);
    } else {
      this.body.setVelocityX(0);
    }
  }

  private handleShooting(): void {
    if (this.shootingKey.isDown && this.scene.time.now > this.lastShoot) {
      if (this.bullets.getLength() < 1) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            bulletProperties: {
              speed: -300
            },
            x: this.x,
            y: this.y - this.height,
            texture: 'bullet'
          })
        );

        this.lastShoot = this.scene.time.now + 500;
      }
    }
  }

  private handleShield(delta: number) {
    if (this.turnOnShield.isDown && !this.isShieldOn && this.scene.registry.get('curShieldCooldown') <= 0) {
      this.shield = this.scene.add
        .graphics({
          x: this.x,
          y: this.y,
          fillStyle: { color: 0x0000ff, alpha: 0.3 }
        })
        .fillCircle(0, 0, 8);
      this.isShieldOn = true;
      this.scene.registry.values.curShieldCooldown = this.scene.registry.values.shieldCooldown;
      this.scene.events.emit('shield');
    }
    else if (this.isShieldOn) {
      this.shield.setX(this.x);
      this.shield.setY(this.y);
      this.shieldDuration -= delta;
    }

    if (this.shieldDuration < 0) {
      this.shieldDuration = this.scene.registry.values.shieldLast;
      this.isShieldOn = false;
      this.shield.destroy();
    }

    if (this.scene.registry.values.curShieldCooldown > 0) {
      this.scene.registry.values.curShieldCooldown -= delta;
      this.scene.events.emit('shield');
    }
  }

  public gotHurt() {
    // update lives
    let currentLives = this.scene.registry.get('lives');
    this.scene.registry.set('lives', currentLives - 1);
    this.scene.events.emit('livesChanged');

    // reset position
    this.x = this.scene.sys.canvas.width / 2;
    this.y = this.scene.sys.canvas.height - 40;
  }
  public isShieldTurnOn() {
    return this.isShieldOn;
  }
}
