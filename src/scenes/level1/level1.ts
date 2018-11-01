import { AnimateSprites } from '../../core/AnimateSprites';
import { ItemObject } from '../../core/ItemObject';
import { LevelProperties } from '../../core/LevelProperties';
import { PlayerObject } from '../../core/PlayerObject';
import { ConfigColliders } from './ConfigColliders';
import { ConfigEnemies } from './ConfigEnemies';
import { ConfigItems } from './ConfigItems';
import { ConfigPlatforms } from './ConfigPlatforms';
import { ConfigPlayer } from './ConfigPlayer';

export class Level1 extends Phaser.Scene {

    private scoreText: Phaser.GameObjects.Text;
    private positionText: Phaser.GameObjects.Text;
    private levelProperties: LevelProperties;
    private score = 0;

    private animateSprites = AnimateSprites.bind(this);
    private configColliders = ConfigColliders.bind(this);
    private configEnemies = ConfigEnemies.bind(this);
    private configItems = ConfigItems.bind(this);
    private configPlatforms = ConfigPlatforms.bind(this);
    private configPlayer = ConfigPlayer.bind(this);
    private lastButtonPressed = 'Right';

    constructor() {
        super({
            key: 'level1',
        });
    }

    // initialize() {}

    preload() {
        this.levelProperties = new LevelProperties(this);
    }

    initLevel() {
        this.animateSprites(this.levelProperties);
        this.configPlatforms(this.levelProperties);
        this.configEnemies(this.levelProperties);
        this.configPlayer(this.levelProperties);
        this.configItems(this.levelProperties);
        this.configColliders(this.levelProperties);
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.score = 0;
        this.initLevel();

        this.add.sprite(770, 30, 'uiButtons').setScrollFactor(0).setScale(2.5).setFrame(11).setInteractive().on('pointerup', () => {
            this.scene.launch('dialogsModal', { text: 'hola' });
            this.scene.pause();
        });

        this.cameras.main.startFollow(this.levelProperties.player, true, 0.09, 0.09);

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
        this.positionText = this.add.text(16, 50, 'x: 0; y: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

        this.inputKeyboard();

        this.cameras.main.on('camerafadeoutcomplete', () => this.scene.start('level1'));
    }

    update() {
        this.positionText.setText(`x: ${this.levelProperties.player.x};y: ${this.levelProperties.player.y};`);
        this.handleKeyboardDownInput();
        this.enemyShotFireball();
    }

    enemyShotFireball() {
        this.levelProperties.enemies.children.iterate((enemy) => {
            if (Math.round(enemy.y + (enemy.height / 2)) === Math.floor((this.levelProperties.player.y) + (this.levelProperties.player.height / 2))) {
                if (!enemy.hasShotted) {
                    enemy.hasShotted = true;
                    const ball = this.levelProperties.fireballs.create(enemy.x, enemy.y, 'ball').setScale(0.5);
                    ball.setVelocityX(enemy.body.velocity.x * 2);
                    ball.setCollideWorldBounds(true);
                    ball.body.onWorldBounds = true;
                    ball.remove = ball.destroy;
                    setTimeout(() => enemy.hasShotted = false, 1500);
                }
            }
        }, this);
    }

    handleKeyboardDownInput() {
        if (!this.levelProperties.player.blockPlayer) {
            if (this.levelProperties.cursors.left.isDown) {
                this.lastButtonPressed = 'Left';
                this.levelProperties.player.setVelocityX(-160);
                this.levelProperties.player.anims.play('piiixlsLeft', true);
            } else if (this.levelProperties.cursors.right.isDown) {
                this.lastButtonPressed = 'Right';
                this.levelProperties.player.setVelocityX(160);
                this.levelProperties.player.anims.play('piiixlsRight', true);
            } else {
                this.levelProperties.player.setVelocityX(0);
                this.levelProperties.player.anims.play(`piiixlsTurn${this.lastButtonPressed}`, true);
            }
        }
    }

    inputKeyboard() {
        this.input.keyboard.on('keydown', (key) => {
            if (key.key === 'ArrowUp' && this.levelProperties.player.body.blocked.down) {
                this.levelProperties.player.setVelocityY(-470);
            }
        });
    }

    collectStar(pl: PlayerObject, item: ItemObject) {
        switch (item.texture.key) {
            case 'bucket':
                pl.piiixls.paint(item.color);
                break;
            case 'star':
                item.disableBody(true, true);
                pl.piiixls.addColor(item.color);
                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);
                // if (this.score === 120) {
                //     this.scene.start('gameover');
                // }
                break;
        }
    }

    setBottomBlocked(player: Phaser.Physics.Arcade.Sprite, platform: Phaser.Physics.Arcade.Sprite) {
        if (player.body.touching.down) {
            player.body.velocity.y = Math.abs(platform.body['speed']);
            this.levelProperties.player.body.blocked.down = true;
        }
    }

    changeSpriteDirection(sprite: Phaser.Physics.Arcade.Sprite) {
        if (sprite.body.touching.right || sprite.body.blocked.right) {
            sprite.setVelocityX(-100);
            if (sprite.texture.key === 'enemiiixls' && sprite.anims.currentFrame.textureFrame < 10) {
                sprite.anims.play('enemiiixlsLeft', true);
            }
        } else if (sprite.body.touching.left || sprite.body.blocked.left) {
            sprite.setVelocityX(100);
            if (sprite.texture.key === 'enemiiixls' && sprite.anims.currentFrame.textureFrame < 10) {
                sprite.anims.play('enemiiixlsRight', true);
            }
        }
    }

    flashSprite(sprite: Phaser.Physics.Arcade.Sprite) {
        let alfa = 0;
        const interval = setInterval(() => {
            sprite.setAlpha(alfa);
            alfa = alfa ? 0 : 1;
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            this.levelProperties.player.playerHitted = false;
            sprite.setAlpha(1);
        }, 2500);
    }

    hitAFireball(player: PlayerObject, enemy: Phaser.Physics.Arcade.Sprite) {
        enemy.disableBody(true, true);
        if (enemy.body.touching.up && player.body.touching.down) {
            this.levelProperties.player.setVelocityY(this.levelProperties.cursors.up.isDown ? -470 : -220);
        } else {
            if (player.piiixls.backgroundColor === '00000005') {
                player.anims.play('piiixlsDie');
                // player.disableBody(true);
                // this.cameras.main.fadeOut(1500);
            } else {
                player.anims.play('piiixlsHit');
                this.levelProperties.player.piiixls.paint('00000005');
                player.blockPlayer = player.playerHitted = true;
                this.changeSpriteDirection(player);
                player.setVelocityY(-300);
                this.flashSprite(player);
                setTimeout(() => player.blockPlayer = false, 1000);
                // this.scene.start('level1');
            }
        }
    }

    hitAnEnemy(player: PlayerObject, enemy: Phaser.Physics.Arcade.Sprite) {
        if (enemy.body.touching.up && player.body.touching.down) {
            player.setVelocityY(this.levelProperties.cursors.up.isDown ? -470 : -220);
            enemy.anims.play('enemiiixlsDie');
            // enemy.destroy();
            // enemy.disableBody(true, true);
        } else {
            if (player.piiixls.backgroundColor === '00000005') {
                player.anims.play('piiixlsDie');
            } else {
                player.anims.play('piiixlsHit');
                player.piiixls.paint('00000005');
                player.blockPlayer = player.playerHitted = true;
                this.changeSpriteDirection(enemy);
                this.changeSpriteDirection(player);
                player.setVelocityY(-300);
                this.flashSprite(player);
                setTimeout(() => player.blockPlayer = false, 1000);
                // this.scene.start('level1');
            }
        }
    }

}
