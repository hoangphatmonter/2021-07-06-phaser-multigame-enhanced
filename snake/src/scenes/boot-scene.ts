export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload(): void {
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
  }

  update(): void {
    this.scene.start('MainMenuScene');
  }
}
