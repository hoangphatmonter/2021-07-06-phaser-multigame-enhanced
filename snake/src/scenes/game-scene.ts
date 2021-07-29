import { Apple } from '../objects/apple';
import { Snake } from '../objects/snake';
import { CONST } from '../const/const';
import { Wall } from '../objects/wall';

export class GameScene extends Phaser.Scene {
  // field and game setting

  private gameHeight: number;
  private gameWidth: number;
  private boardWidth: number;
  private boardHeight: number;
  private horizontalFields: number;
  private verticalFields: number;
  private tick: number;

  // objects
  private player: Snake;
  private apple: Apple;
  private gameBorder: Phaser.GameObjects.Graphics[];
  private listWall: Wall[];

  // texts
  private scoreText: Phaser.GameObjects.BitmapText;

  private ending: boolean;
  private particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter[];
  private endingScore: number;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.boardWidth = this.gameWidth - 2 * CONST.FIELD_SIZE;
    this.boardHeight = this.gameHeight - 2 * CONST.FIELD_SIZE;
    this.horizontalFields = this.boardWidth / CONST.FIELD_SIZE;
    this.verticalFields = this.boardHeight / CONST.FIELD_SIZE;
    this.tick = 0;

    this.ending = false;
    this.emitter = []
    this.endingScore = 0;
  }

  create(): void {
    // objects
    this.gameBorder = [];
    let i = 0;
    for (let x = 0; x < this.gameWidth / CONST.FIELD_SIZE; x++) {
      for (let y = 0; y < this.gameHeight / CONST.FIELD_SIZE; y++) {
        if (
          y === 0 ||
          y === this.gameHeight / CONST.FIELD_SIZE - 1 ||
          x === 0 ||
          x === this.gameWidth / CONST.FIELD_SIZE - 1
        ) {
          this.gameBorder[i] = this.add
            .graphics({
              x: -CONST.FIELD_SIZE + x * CONST.FIELD_SIZE,
              y: -CONST.FIELD_SIZE + y * CONST.FIELD_SIZE,
              fillStyle: { color: 0x61e85b, alpha: 0.3 }
            })
            .fillRect(
              CONST.FIELD_SIZE,
              CONST.FIELD_SIZE,
              CONST.FIELD_SIZE,
              CONST.FIELD_SIZE
            );
          i++;
        }
      }
    }

    this.player = new Snake(this);
    this.apple = new Apple({
      scene: this,
      options: {
        x: this.rndXPos(),
        y: this.rndYPos()
      }
    });

    // text
    this.scoreText = this.add.bitmapText(
      this.gameWidth / 2,
      1,
      'snakeFont',
      '' + CONST.SCORE,
      8
    );

    // dark apple
    this.listWall = [];
  }

  update(time: number, delta: number): void {
    if (this.tick === 0) {
      this.tick = time;
    }
    if (!this.player.isDead()) {
      if (time - this.tick > 100) {
        this.player.move();
        this.checkCollision();
        this.tick = time;
      }
      this.player.handleInput();
    } else {
      if (!this.ending) {
        let obj = {
          getRandomPoint: (vec: any) => {
            vec.x = this.scoreText.x;
            vec.y = this.scoreText.y;
            return vec;
          }
        }
        this.particle = this.add.particles('flares');
        this.emitter.push(this.particle.createEmitter({
          frame: { frames: ['blue', 'green', 'red', 'yellow'] },
          x: 0,
          y: 0,
          moveToX: this.sys.canvas.width / 9,
          moveToY: this.sys.canvas.height,
          lifespan: 1000,
          scale: 0.1,
          quantity: 1,
          blendMode: 'ADD',
          gravityX: 200,
          frequency: 100,
          emitZone: { source: obj },
        }))
        this.emitter.push(this.particle.createEmitter({
          frame: { frames: ['blue', 'green', 'red', 'yellow'] },
          x: 0,
          y: 0,
          moveToX: this.sys.canvas.width - this.sys.canvas.width / 10,
          moveToY: this.sys.canvas.height,
          lifespan: 1000,
          scale: 0.1,
          quantity: 1,
          blendMode: 'ADD',
          gravityX: -200,
          emitZone: { source: obj },
          frequency: 100
        }))
        this.emitter.push(this.particle.createEmitter({
          frame: { frames: ['blue'] },
          x: this.sys.canvas.width / 2,
          y: this.sys.canvas.height - 5,
          lifespan: 5000,
          scale: 0.1,
          quantity: 1,
          // delay: 10000,
          blendMode: 'ADD',
          frequency: 100
        }))
        this.emitter.push(this.particle.createEmitter({
          frame: 'blue',
          x: this.sys.canvas.width / 2,
          y: this.sys.canvas.height - 5,
          angle: { min: 180, max: 360 },
          speed: 400,
          gravityY: 500,
          lifespan: 4000,
          quantity: 6,
          scale: { start: 0.04, end: 0.4 },
          blendMode: 'ADD',
          active: false
        }));
        // stop go to bottom
        this.time.delayedCall(2000, this.emitter[0].explode, [0, 0, 0], this.emitter[0]);
        this.time.delayedCall(2000, this.emitter[1].explode, [0, 0, 0], this.emitter[1]);
        // stop growing big cirle
        this.time.delayedCall(5000, this.emitter[2].explode, [0, 0, 0], this.emitter[2]);
        // start shoot particle
        this.time.delayedCall(5000, () => { this.emitter[3].active = true }, [], this.emitter[3]);
        // stop shoot particle
        this.time.delayedCall(10000, this.emitter[3].explode, [0, 0, 0], this.emitter[3]);
        // go to main menu
        this.time.delayedCall(12000, this.scene.start, ['MainMenuScene'], this.scene);
        // this.scene.start('MainMenuScene');
        this.ending = true;
      }
      if (this.endingScore <= CONST.SCORE) {
        this.endingScore += CONST.SCORE / 2000 * delta;
        let showScore = Math.ceil(CONST.SCORE - this.endingScore);
        this.scoreText.setText('' + showScore);
      }

    }
  }

  private checkCollision(): void {
    const { x: headX, y: headY } = this.player.getHead();

    // player vs. apple collision
    if (headX === this.apple.x && headY === this.apple.y) {
      this.player.growSnake();
      CONST.SCORE++;
      this.scoreText.setText('' + CONST.SCORE);
      // add more wall
      this.listWall.push(new Wall({
        scene: this,
        options: {
          x: this.rndXPos(),
          y: this.rndYPos()
        }
      }))
      // prevent spawn apple on walls
      let x = this.rndXPos();
      let y = this.rndYPos();
      for (let i = 0; i < this.listWall.length; i++) {
        if (x === this.listWall[i].getXPosition() &&
          y === this.listWall[i].getYPosition()
        ) {
          x = this.rndXPos();
          y = this.rndYPos();
          i = -1;
        }
      }
      this.apple.newApplePosition(x, y);
    }

    // border vs. snake collision
    for (const { x, y } of this.gameBorder) {
      if (headX === x && headY === y) {
        this.player.setDead(true);
      }
    }

    // snake vs wall collision
    for (let i = 0; i < this.listWall.length; i++) {
      if (headX === this.listWall[i].x && headY === this.listWall[i].y) {
        this.player.setDead(true);
      }
    }

    // snake vs. snake collision
    this.player.checkSnakeSnakeCollision();
  }

  private rndXPos(): number {
    return (
      Phaser.Math.RND.between(1, this.horizontalFields - 1) * CONST.FIELD_SIZE
    );
  }

  private rndYPos(): number {
    return (
      Phaser.Math.RND.between(1, this.verticalFields - 1) * CONST.FIELD_SIZE
    );
  }
}
