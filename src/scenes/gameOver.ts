declare const Phaser;

export const GameOver = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize() {
        Phaser.Scene.call(this, { key: 'gameover' });
        window['OVER'] = this;
    },

    create() {
        console.log('%c GameOver ', 'background: green; color: white; display: block;');

        this.add.sprite(400, 300, 'ayu');

        this.add.text(300, 500, 'Game Over - Click to start restart', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerup', (event) => {
            this.scene.start('mainmenu');
        }, this);
    },

});
