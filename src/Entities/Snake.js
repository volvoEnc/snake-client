import {socket} from "../../main.js";

export default class Snake {
    body = [];
    direction = 'up';
    isAppend = false;

    constructor(scene, playerID, body) {
        this.body = body;
        this.scene = scene;
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
        for (const bodyCeil of this.body) {
            if (bodyCeil.ceil !== undefined) {
                bodyCeil.ceil.destroy(true)
            }
        }

        this.body = body;
        this.draw()
    }
    calcLines() {
        const directions = ['up', 'down', 'left', 'right'];
        const state = {
            t: 0,
            d: 0,
            l: 0,
            r: 0
        };
        for (const direction of directions) {
            let blocks = 0 ;
            let detect = false;
            do {
                switch (direction) {
                    case 'up':
                        if (this.scene.map[this.body[0].my - (blocks + 1)][this.body[0].mx] === 0) {
                            blocks++;
                        } else { detect = true; state.t = blocks; }
                        break;
                    case 'down':
                        if (this.scene.map[this.body[0].my + (blocks + 1)][this.body[0].mx] === 0) {
                            blocks++;
                        } else { detect = true; state.d = blocks; }
                        break;
                    case 'left':
                        if (this.scene.map[this.body[0].my][this.body[0].mx - (blocks + 1)] === 0) {
                            blocks++;
                        } else { detect = true; state.l = blocks; }
                        break;
                    case 'right':
                        if (this.scene.map[this.body[0].my][this.body[0].mx + (blocks + 1)] === 0) {
                            blocks++;
                        } else { detect = true; state.r = blocks; }
                        break;
                }
            } while (!detect)
        }

        return state;
    }

    checkEat() {
        if (this.scene.eat && this.body[0].mx === this.scene.eat.mx && this.body[0].my === this.scene.eat.my) {
            this.appendBody();
            return true;
        }
        return false;
    }

    updateDirection() {
        if (this.keyWDown && this.direction !== 'down') {
            this.direction = 'up';
        }
        if ( this.keySDown && this.direction !== 'up') {
            this.direction = 'down';
        }
        if (this.keyADown && this.direction !== 'right') {
            this.direction = 'left';
        }
        if (this.keyDDown && this.direction !== 'left') {
            this.direction = 'right';
        }

        this.keyWDown = false;
        this.keySDown = false;
        this.keyADown = false;
        this.keyDDown = false;
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

    draw() {
        for (const bodyCeil of this.body) {
            if (bodyCeil.ceil === undefined) {
                bodyCeil.ceil = this.scene.add.rectangle(0, 0, this.scene.width, this.scene.height, 0xff0000).setOrigin(0);
            }

            const x = bodyCeil.mx * this.scene.width;
            const y = bodyCeil.my * this.scene.height;
            bodyCeil.ceil.x = x;
            bodyCeil.ceil.y = y;
        }
    }

    move() {
        for (let i = (this.body.length - 1); i >= 0; i--) {
            // Голова
            if (i === 0) {
                switch (this.direction) {
                    case 'up': this.body[i].my -= 1; break;
                    case 'down':this.body[i].my += 1; break;
                    case 'left': this.body[i].mx -= 1; break;
                    case 'right': this.body[i].mx += 1; break;
                }
                break;
            }

            // Хвост
            if (i === (this.body.length - 1) && this.isAppend) {
                this.isAppend = false;
                this.body.push({mx: this.body[i].mx, my: this.body[i].my, ceil: null});
            }

            this.body[i].mx = this.body[i - 1].mx;
            this.body[i].my = this.body[i - 1].my;
        }
    }


    /** Замейка растет */
    appendBody() {
        this.isAppend = true;
    }


}