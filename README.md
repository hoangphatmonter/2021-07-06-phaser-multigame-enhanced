# Assets
- [Mario](https://dotstudio.itch.io/super-mario-1-remade-assets)
# Note
- [Declaration Merging typescript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- [spine arcade physics container](https://blog.ourcade.co/posts/2020/simple-phaser-3-spine-arcade-physics-container/)
- [~~extending spine gameobject~~](https://phaser.discourse.group/t/extending-spinegameobject/8580/3)
- [spine example](https://phaser.discourse.group/t/phaser-3-spine-examples-change-skins-animations-and-attachments/1042)
- [Flip error](https://github.com/photonstorm/phaser/issues/5016)
- [sprite vs sprite.body](https://phaser.discourse.group/t/solved-setsize-not-working-on-scaled-sprites/3714)
- About spine:
  - scale object will not automatically update collider: need update `spine.body.setSize(x,y)`
  - in a time of a animation: size of spine will assign to a first frame of a animetion => require `spine.refresh()` to update the data (position, size, rotation) of the spine. This can make the collider bounce because of the change every update()
- About order of objects display:
  - `setDepth`: higher means closer
  - ~~`this.children.depthSort()`: sort the display list to rearrange the order after `setDepth`~~ : it just sort the display list
# References
- [Add Spine Plugin](https://blog.ourcade.co/posts/2020/phaser-3-parcel-typescript-spine/)
- [Spine expample Phaser 3](https://labs.phaser.io/index.html?dir=spine/&q=)