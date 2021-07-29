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
- [body.touching](https://phaser.discourse.group/t/correct-usage-of-body-touching/1758): body.touching is something wrong in spine
- body.embedded
- When inherit graphics:
  - x,y parameter in the `super()` method will set that position to be the origin of this graphics for all `fill()` method
- [on exit overlap](https://github.com/photonstorm/phaser/issues/1566) (not used)
## Alpha-adjust
- not add particles in `init()`: will make exception

## Candy-crush
- [How to delete completely particle emitter from scene](https://www.html5gamedevs.com/topic/36961-how-to-destroy-particle-emitter/)

## Snake
- [How to stop particle spawn](https://phaser.discourse.group/t/infinite-particles/3065/2)

# References
- [Add Spine Plugin](https://blog.ourcade.co/posts/2020/phaser-3-parcel-typescript-spine/)
- [Spine expample Phaser 3](https://labs.phaser.io/index.html?dir=spine/&q=)
- [Handle exit overlap](https://www.html5gamedevs.com/topic/17601-check-end-of-overlapcollision/)
## Alpha-adjust
- [tween](https://phaser.io/examples/v3/view/tweens/checkerboard-3#)
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\emit%20from%20texture.js)
## Asteroid
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\explode%20test.js)
## Blckade
- [tween](https://youtu.be/VOtZ6yNqH84?t=4419)
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\parallax.js)
## Block
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\emitter%20bounds.js)
## Candy-crush
- [tween](https://labs.phaser.io/edit.html?src=src\tweens\delay.js)
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\emitter%20bounds.js)

## Coin-runner
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\random%20emit%20zone%20custom.js)
## Flappy birds
- [particles](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\follow%20sprite.js)
## Snake
- [tween](https://labs.phaser.io/edit.html?src=src\tweens\stagger%20compare.js)
- [particle](https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\move%20to.js)
- [particle](https://labs.phaser.io/edit.html?src=src/game%20objects/particle%20emitter/create%20emitter%20from%20config%203.js&v=3.55.2)
## Space-invaders
- [tween](https://labs.phaser.io/edit.html?src=src\tweens\update%20to.js)