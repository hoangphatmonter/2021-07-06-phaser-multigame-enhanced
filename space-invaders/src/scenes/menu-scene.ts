export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
    this.initRegistry();
  }

  create(): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 65,
        this.sys.canvas.height / 2,
        'font',
        'PRESS S TO PLAY',
        8
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 60,
        this.sys.canvas.height / 2 - 40,
        'font',
        'SPACE INVADERS',
        8
      )
    );
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2 + 40,
        'font',
        'PRESS V TO TURN ON SHIELD IN GAME\n\nPRESS SPACE TO SHOOT',
        6
      ).setOrigin(0.5)
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('HUDScene');
      this.scene.start('GameScene');
      this.scene.bringToTop('HUDScene');
    }
  }

  /**
   * Build-in global game data manager to exchange data between scenes.
   * Here we initialize our variables with a key.
   */
  private initRegistry(): void {
    this.registry.set('points', 0);
    this.registry.set('lives', 3);
    this.registry.set('level', 1);
    this.registry.set('shieldCooldown', 10000);
    this.registry.set('curShieldCooldown', 0);
    this.registry.set('shieldLast', 3000);
  }
}
