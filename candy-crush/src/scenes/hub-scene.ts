export class HUDScene extends Phaser.Scene {
    private statTexts: Phaser.GameObjects.Text[];
    private points: number;

    constructor() {
        console.log('what on')
        super({
            key: 'HUBScene'
        });
    }

    init(): void {
        this.statTexts = [];
        this.points = 0;
    }

    create(): void {
        // create bitmap texts
        this.statTexts.push(
            this.add.text(
                10,
                this.scene.systems.canvas.height - 20,
                `Points: ${this.points}`,
                {
                    font: '30px',
                }
            ).setOrigin(0, 1)
        );

        // create events
        const level = this.scene.get('GameScene');
        level.events.on('pointsChanged', this.updatePoints, this);
    }

    private updatePoints(number = 0) {
        this.points += number;
        // this.texts[2].setText(`Points: ${this.registry.get('points')}`);
        this.statTexts[0].setText(`Points: ${this.points}`);
    }
}
