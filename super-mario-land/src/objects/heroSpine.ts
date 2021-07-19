// export default class HeroSpine extends window.SpinePlugin.SpineGameObject {
//     body: Phaser.Physics.Arcade.Body;
//     private sgo: any

//     get spine() {
//         return this.sgo
//     }

//     constructor(scene: Phaser.Scene, x: number, y: number, key: string, anim: string, loop = false) {
//         super(scene, x, y);
//         // super(scene, window.SpinePlugin, x, y);

//         this.sgo = scene.add.spine(14, 100, 'set1.spineboy', 'idle', true).setScale(0.05);

//         scene.physics.add.existing(this)
//         // this.body.setCollideWorldBounds(true);

//         const bounds = this.sgo.getBounds()
//         const width = bounds.size.x
//         const height = bounds.size.y
//         this.setPhysicsSize(width, height)

//         this.add(this.sgo)
//     }

//     faceDirection(dir: 1 | -1) {
//         if (this.sgo.scaleX === dir) {
//             return
//         }

//         this.sgo.scaleX = dir
//     }

//     setPhysicsSize(width: number, height: number) {
//         const body = this.body as Phaser.Physics.Arcade.Body
//         body.setOffset(width * -0.5, -height)
//         body.setSize(width, height)
//     }
// }