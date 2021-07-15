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
                0,
                this.scene.systems.canvas.height,
                `Points: ${this.points}`,
                {
                    font: '15px',
                    color: '#FFFF00',
                    backgroundColor: '#000000'
                }
            ).setOrigin(0, 1)
        );
        this.statTexts.push(
            this.add.text(
                this.scene.systems.canvas.width / 2,
                this.scene.systems.canvas.height / 2,
                `Victory`,
                {
                    font: '30px',
                    color: '#FFFF00',
                    backgroundColor: '#000000'
                }
            ).setOrigin(0.5, 0.5).setVisible(false)
        );

        // create events
        const level = this.scene.get('GameScene');
        level.events.on('pointsChanged', this.updatePoints, this);
        level.events.on('victory', this.showVictory, this);
    }

    private updatePoints(number = 0) {
        this.points += number;
        // this.texts[2].setText(`Points: ${this.registry.get('points')}`);
        this.statTexts[0].setText(`Points: ${this.points}`);
        console.log(this.points);
    }
    private showVictory() {
        this.statTexts[1].setVisible(true);
    }
}
