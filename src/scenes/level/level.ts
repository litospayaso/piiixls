import { ItemImterface } from '@/assets/levels/IlevelInterface';
// import levelData from '@/assets/levels/level1.json';
import { AnimateSprites } from '@/core/AnimateSprites';
import { ConfigControls } from '@/core/configControls';
import { LevelProperties } from '@/core/LevelProperties';
import { transparentColor } from '@/core/Piiixls';
import { PlayerObject } from '@/core/PlayerObject';
import { ConfigColliders } from './ConfigColliders';
import { ConfigEnemies } from './ConfigEnemies';
import { ConfigItems } from './ConfigItems';
import { ConfigPlatforms } from './ConfigPlatforms';
import { ConfigPlayer } from './ConfigPlayer';

export class Level extends Phaser.Scene {

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
    private configControls = ConfigControls.bind(this);
    private lastButtonPressed = 'Right';
    private levelData: any;

    constructor(levelData) {

        /**
         * @TODO crear interfaz del level property.
         */
        super({
            key: levelData.key,
        });
        this.levelData = levelData;
    }

    // initialize() {}

    preload() {
        this.levelProperties = new LevelProperties(this, this.levelData);
    }

    initLevel() {
        this.animateSprites(this.levelProperties);
        this.setLevelProperties(this.levelProperties);
        this.configPlatforms(this.levelProperties);
        this.configEnemies(this.levelProperties);
        this.configItems(this.levelProperties);
        this.configPlayer(this.levelProperties);
        this.configColliders(this.levelProperties);
        this.configControls(this.levelProperties);
        this.handleBrowserFocus();
    }

    setLevelProperties(props: LevelProperties) {
        props.scene.cameras.main.setBounds(0, 0, props.levelData.levelProperties.dimensions.width, props.levelData.levelProperties.dimensions.height + 100);
        props.scene.physics.world.setBounds(0, 0, props.levelData.levelProperties.dimensions.width, props.levelData.levelProperties.dimensions.height);
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.score = 0;
        this.initLevel();

        this.add.sprite(Number(this.game.config.width) - 30, 30, 'uiButtons').setScrollFactor(0).setScale(2.5).setFrame(11).setInteractive().on('pointerup', () => {
            this.scene.launch('pauseModal', { scene: 'level1' });
            this.scene.pause();
        });

        this.cameras.main.startFollow(this.levelProperties.player, true, 0.09, 0.09);
        // this.cameras.main.startFollow(this.levelProperties.player, true, 0.09, 0.09).zoom = 1.7;

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#0000FF', fontFamily: 'pixel' }).setScrollFactor(0);
        this.positionText = this.add.text(16, 50, 'x: 0; y: 0', { fontSize: '32px', fill: '#0000FF' }).setScrollFactor(0);

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
                    const ball = this.levelProperties.fireballs.create(enemy.x, enemy.y, 'pixelBall').setScale(1.5);
                    ball.anims.play('shootPixelBall');
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
                if (!this.levelProperties.player.isInAPlatform) {
                    this.levelProperties.player.setVelocityX(0);
                }
                this.levelProperties.player.anims.play(`piiixlsTurn${this.lastButtonPressed}`, true);
            }
        }
    }

    inputKeyboard() {
        this.input.keyboard.on('keydown', (key) => {
            if (key.key === 'ArrowUp' && this.levelProperties.player.body.blocked.down) {
                this.levelProperties.player.setVelocityY(-350);
            }
        });
    }

    itemCollision(pl: PlayerObject, item: ItemImterface) {
        switch (item.itemType) {
            case 'bucket':
                pl.piiixls.paint(item.color);
                break;
            case 'pixel':
                item.disableBody(true, true);
                pl.piiixls.addColor(item.color);
                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);
                break;
            case 'star':
                this.scene.launch('dialogsModal', { text: this.levelProperties.levelData.authorInfo, scene: 'level1' });
                item.disableBody(true, true);
                this.levelProperties.cursors.left.isDown = false;
                this.levelProperties.cursors.right.isDown = false;
                this.scene.pause();
                break;
            case 'book':
                this.scene.launch('dialogsModal', { text: this.levelProperties.levelData.periodInfo, scene: 'level1' });
                item.disableBody(true, true);
                this.levelProperties.cursors.left.isDown = false;
                this.levelProperties.cursors.right.isDown = false;
                this.scene.pause();
                break;
            case 'palette':
                this.scene.launch('dialogsModal', { text: this.levelProperties.levelData.pieceInfo, scene: 'level1' });
                item.disableBody(true, true);
                this.levelProperties.cursors.left.isDown = false;
                this.levelProperties.cursors.right.isDown = false;
                this.scene.pause();
                break;
        }
    }

    collideFinishPlatform(player: PlayerObject, platform: Phaser.Physics.Arcade.Sprite) {
        if (player.piiixls.getColor() === platform.body['color']) {
            this.scene.start('gameover');
        }
    }

    setBottomBlocked(player: Phaser.Physics.Arcade.Sprite, platform: Phaser.Physics.Arcade.Sprite) {
        if (player.body.touching.down) {
            player.body.velocity.y = Math.abs(platform.body['speed']);
            this.levelProperties.player.body.blocked.down = true;
        }
    }

    directionBlocked(player: Phaser.Physics.Arcade.Sprite, platform: Phaser.Physics.Arcade.Sprite) {
        if (player.body.touching.down) {
            this.levelProperties.player.isInAPlatform = true;
            this.levelProperties.player.setVelocityX(Number(platform.body.velocity.x));
            this.levelProperties.player.body.blocked.down = true;
        }
        setTimeout(() => this.levelProperties.player.isInAPlatform = false, 500);
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
            this.levelProperties.player.setVelocityY(this.levelProperties.cursors.up.isDown ? -350 : -220);
        } else {
            if (player.piiixls.backgroundColor === transparentColor) {
                player.anims.play('piiixlsDie');
                // player.disableBody(true);
                // this.cameras.main.fadeOut(1500);
            } else {
                player.anims.play('piiixlsHit');
                this.levelProperties.player.piiixls.paint(transparentColor);
                player.blockPlayer = player.playerHitted = true;
                this.changeSpriteDirection(player);
                player.setVelocityY(-300);
                this.flashSprite(player);
                setTimeout(() => player.blockPlayer = false, 1000);
                // this.scene.start('level1');
            }
        }
    }

    hitSpikes(player: PlayerObject, spikes: Phaser.Physics.Arcade.Sprite) {
        if (player.piiixls.backgroundColor === transparentColor) {
            player.anims.play('piiixlsDie');
            // player.disableBody(true);
            // this.cameras.main.fadeOut(1500);
        } else {
            player.anims.play('piiixlsHit');
            this.levelProperties.player.piiixls.paint(transparentColor);
            player.blockPlayer = player.playerHitted = true;
            this.changeSpriteDirection(player);
            player.setVelocityY(-300);
            this.flashSprite(player);
            setTimeout(() => player.blockPlayer = false, 1000);
            // this.scene.start('level1');
        }
    }

    hitAnEnemy(player: PlayerObject, enemy: Phaser.Physics.Arcade.Sprite) {
        if (enemy.body.touching.up && player.body.touching.down) {
            player.setVelocityY(this.levelProperties.cursors.up.isDown ? -350 : -220);
            enemy.anims.play('enemiiixlsDie');
            // enemy.destroy();
            // enemy.disableBody(true, true);
        } else {
            if (player.piiixls.backgroundColor === transparentColor) {
                player.anims.play('piiixlsDie');
            } else {
                player.anims.play('piiixlsHit');
                player.piiixls.paint(transparentColor);
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

    handleBrowserFocus() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.scene.launch('pauseModal', { scene: 'level1' });
                this.scene.pause();
            }
        }, false);
    }

}
