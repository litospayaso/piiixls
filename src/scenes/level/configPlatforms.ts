import { LevelProperties } from '@/core/LevelProperties';
import { colorWheel } from '@/core/Piiixls';
export const ConfigPlatforms = function(props: LevelProperties) {

    props.scene.add.image(this.textures.get('level1-background').get().width / 2, this.textures.get('level1-background').get().height / 2, 'level1-background');

    props.levelData.platforms.ground.forEach((e) => {
        if (Number(e.texture) !== 17) {
            const tile = props.platforms.create(e.x, e.y, 'ground_tiles').setFrame(e.texture);
            if (Number(e.texture) < 10) {
                tile.body.setSize(16, 1, 0, 0);
            }
        }
        if (Number(e.texture) === 17) {
            console.log(`%c this`, `background: #df03fc; color: #f8fc03`, this);
            const tile = props.platforms.create(e.x, e.y);
            tile.angle -= 45;
            console.log(`%c tile`, `background: #df03fc; color: #f8fc03`, tile);

            // console.log(`%c tile`, `background: #df03fc; color: #f8fc03`, tile);

            // // console.log(`%c props`, `background: #df03fc; color: #f8fc03`, props);

            // const testRect = Phaser.Geom.Triangle(400, 400);
            // testRect.beginFill(0x0000FF, 1);
            // testRect.drawRoundedRect(0, 0, 100, 100, 10);
            // props.platforms.add(testRect);
            // console.log(`%c tile.body`, `background: #df03fc; color: #f8fc03`, tile);
            // const {x, y} = e;
            // const polygon = new Phaser.Geom.Polygon([8, 8, 8, - 8, - 24, 8]);
            // const graphics = this.add.graphics({ x, y });

            // graphics.lineStyle(2, 0x00aa00);

            // graphics.beginPath();

            // // graphics.moveTo(polygon.points[0].x, polygon.points[0].y);

            // for (let i = 1; i < polygon.points.length; i++) {
            //     graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
            // }

            // graphics.closePath();
            // graphics.strokePath();

            // props.platforms.add(graphics);

            // this.physics.add.existing(graphics);
            // // props.scene.physics.add.collider(props.player, graphics);
            // console.log(`%c this.physics`, `background: #df03fc; color: #f8fc03`, this.physics.add.existing);

            // console.log(`%c triangle`, `background: #df03fc; color: #f8fc03`, triangle);
        }
    });

    props.levelData.platforms.enemyWalls.forEach((e) => {
        props.enemyWalls.create(e.x, e.y, e.texture).visible = false;
    });

    props.levelData.platforms.colorWalls.forEach((e) => {
        props.colorWalls.create(e.x, e.y).setDisplaySize(16, 16).setTintFill(`0x${colorWheel[e.texture].slice(0, -2)}`).setAlpha(0.5).body.setSize(16, 16).setOffset(8, 8).color = colorWheel[e.texture].slice(0, -2);
    });

    props.levelData.platforms.elevators.forEach((e) => {
        props.elevators.create(e.x, e.y, e.texture).setScale(e.scale).setImmovable(true).setVelocityY(e.speed).delay = e.delay;
    });

    props.elevators.children.iterate((child) => {
        props.scene.time.addEvent({
            delay: child.delay,
            loop: true,
            callback() {
                child.body.velocity.y *= -1;
            },
        });
    }, this);

    props.levelData.platforms.shifters.forEach((e) => {
        props.shifters.create(e.x, e.y, e.texture).setScale(e.scale).setImmovable(true).setVelocityX(e.speed).delay = e.delay;
    });

    props.shifters.children.iterate((child) => {
        props.scene.time.addEvent({
            delay: child.delay,
            loop: true,
            callback() {
                child.body.velocity.x *= -1;
            },
        });
    }, this);

    props.finishPlatform.create(props.levelData.platforms.finishPlatform.x, props.levelData.platforms.finishPlatform.y)
    .setScale(props.levelData.platforms.finishPlatform.scale)
    .setTintFill(`0x${props.levelData.platforms.finishPlatform.tint}`)
    .setAlpha(0.5).body.color = props.levelData.platforms.finishPlatform.tint;

    props.scene.add.sprite(props.levelData.platforms.finishPlatform.x, props.levelData.platforms.finishPlatform.y, 'sparkles')
    .setScale(props.levelData.platforms.finishPlatform.scale).anims.play('animateSparkles');

};
