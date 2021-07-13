export class HUDScene extends Phaser.Scene {
  private bitmapTexts: Phaser.GameObjects.BitmapText[];

  constructor() {
    super({
      key: 'HUDScene'
    });
  }

  init(): void {
    this.bitmapTexts = [];
  }

  create(): void {
    // create bitmap texts
    this.bitmapTexts.push(
      this.add.bitmapText(
        10,
        this.scene.systems.canvas.height - 20,
        'font',
        `Lives: ${this.registry.get('lives')}`,
        8
      )
    );
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.scene.systems.canvas.width,
        this.scene.systems.canvas.height - 20,
        'font',
        `Shield Cd: ${this.registry.get('curShieldCooldown') > 0 ? `${Math.floor(this.registry.get('curShieldCooldown') / 1000)}s` : 'Ready'}`,
        8
      ).setOrigin(1, 0)
    );
    this.bitmapTexts.push(
      this.add.bitmapText(
        10,
        10,
        'font',
        `Points: ${this.registry.get('points')}`,
        8
      )
    );

    // create events
    const level = this.scene.get('GameScene');
    level.events.on('pointsChanged', this.updatePoints, this);
    level.events.on('livesChanged', this.updateLives, this);
    level.events.on('shield', this.updateShield, this);
  }

  private updatePoints() {
    this.bitmapTexts[2].setText(`Points: ${this.registry.get('points')}`);
  }

  private updateLives() {
    this.bitmapTexts[0].setText(`Lives: ${this.registry.get('lives')}`);
  }
  private updateShield() {
    this.bitmapTexts[1].setText(`Shield Cd: ${this.registry.get('curShieldCooldown') > 0 ? `${Math.floor(this.registry.get('curShieldCooldown') / 1000)}s` : 'Ready'}`);
  }
}
