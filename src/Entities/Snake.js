import {socket} from "../../main.js";

export default class Snake {
    body = [];
    direction = 'up';
    isAppend = false;

    constructor(scene, playerID, body, color) {
        this.body = body;
        this.scene = scene;
        this.color = color;
        this.playerID = playerID;

        if(this.scene.playerID === this.playerID) {
            this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.keyWDown = false;
            this.keySDown = false;
            this.keyADown = false;
            this.keyDDown = false;
        }
    }

    updateBody(body) {
        this.destroy()

        this.body = body;
        this.draw();

        for (const bodyCeil of this.body) {
            const bodyGroups = {
                up: [],
                down: [],
                left: [],
                right: []
            };
            if (bodyCeil.ceil) {
                switch (bodyCeil.d) {
                    case 'up': bodyGroups.up.push(bodyCeil.ceil); break;
                    case 'down': bodyGroups.down.push(bodyCeil.ceil); break;
                    case 'left': bodyGroups.left.push(bodyCeil.ceil); break;
                    case 'right': bodyGroups.right.push(bodyCeil.ceil); break;
                }
            }

            this.scene.tweens.add({
                targets: bodyGroups.up,
                ease: 'Linear',
                duration: 300,
                y: `-=${this.scene.width}`
            });
            this.scene.tweens.add({
                targets: bodyGroups.down,
                ease: 'Linear',
                duration: 300,
                y: `+=${this.scene.width}`
            });
            this.scene.tweens.add({
                targets: bodyGroups.left,
                ease: 'Linear',
                duration: 300,
                x: `-=${this.scene.width}`
            });
            this.scene.tweens.add({
                targets: bodyGroups.right,
                ease: 'Linear',
                duration: 300,
                x: `+=${this.scene.width}`
            });
        }
    }

    update() {
        let direction = this.direction

        //
        if(this.keyW.isDown && !this.keyWDown) {
            direction = 'up'
            this.keyWDown = true;
        }

        if(this.keyW.isUp && this.keyWDown) {
            this.keyWDown = false;
        }

        //
        if(this.keyS.isDown && !this.keySDown) {
            direction = 'down'
            this.keySDown = true;
        }

        if(this.keyS.isUp && this.keySDown) {
            this.keySDown = false;
        }

        //
        if(this.keyA.isDown && !this.keyADown) {
            direction = 'left'
            this.keyADown = true;
        }

        if(this.keyA.isUp && this.keyADown) {
            this.keyADown = false;
        }

        //
        if(this.keyD.isDown && !this.keyDDown) {
            direction = 'right'
            this.keyDDown = true;
        }

        if(this.keyD.isUp && this.keyDDown) {
            this.keyDDown = false;
        }

        if(this.direction !== direction) {
            socket.emit('direction', {
                id: this.playerID,
                direction: direction
            })
            this.direction = direction
        }
    }

    animationMove() {
        // for (const bodyElement of this.body) {
        //
        // }
    }

    draw() {
        for (const bodyCeil of this.body) {
            if (bodyCeil.ceil === undefined) {
                bodyCeil.ceil = this.scene.add.circle(0, 0, 12, parseInt(this.color)).setOrigin(0);
                if(this.scene.playerID === this.playerID) {
                    bodyCeil.ceil.setStrokeStyle(1, 0x000000)
                }
            }

            const x = bodyCeil.mx * this.scene.width;
            const y = bodyCeil.my * this.scene.height;
            bodyCeil.ceil.x = x;
            bodyCeil.ceil.y = y;
        }
    }

    destroy() {
        for (const bodyCeil of this.body) {
            if (bodyCeil.ceil !== undefined) {
                bodyCeil.ceil.destroy(true)
            }
        }
    }
}