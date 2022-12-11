import Snake from "../Entities/Snake.js";
import * as tf from "@tensorflow/tfjs";
import {model} from "@tensorflow/tfjs";
import {socket} from "../../main.js";

export default class MainScene extends Phaser.Scene {
    w = 32;
    h = 24;
    width;
    height;

    constructor() {
        super({key: 'MainScene', active: true});
    }

    preload() {

    }

    create() {
        this.map = [];
        this.snake = new Snake(this, 12, 12);
        this.eat = null;
        this.reward = 0;
        this.linesState = null;

        this.w = 32;
        this.h = 24;
        this.width = this.game.canvas.width / this.w;
        this.height = this.game.canvas.height / this.h;
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.h; i++) {
            const rowMap = [];
            for (let j = 0; j < this.w; j++) {
                x = this.width * j;
                y = this.height * i;
                const ceil = this.add.rectangle(x, y, this.width, this.height).setStrokeStyle(1, 0x000000).setOrigin(0).setDepth(10);
                let ceilValue = 0;
                if (j === 0 || j === (this.w - 1) || i === 0 || i === (this.h - 1)) {
                    ceil.setFillStyle(0xcccccc);
                    ceil.setStrokeStyle();
                    ceilValue = 1;
                }
                rowMap.push(ceilValue);
            }
            this.map.push(rowMap);
        }

        this.gameLoop = this.time.addEvent({
            repeat: -1,
            delay: 200,
            callback: () => {
                if (this.eat === null) {
                    this.eat = this.spawnEat();
                }

                try {
                    this.linesState = this.snake.calcLines();
                } catch (e) {
                    this.gameLoop.destroy();
                    this.reward = -100;
                    console.log('lose')
                }
                const state = this.getMapState();
                this.saveMapState(state);

                this.snake.updateDirection();
                this.snake.move();
                this.reward -= 1;
                if (this.snake.checkEat()) {
                    this.eat.ceil.destroy(true);
                    this.eat = null;
                    this.reward += 30;
                }
                this.snake.draw();

                let tmpDelay = 200 - this.reward / 2;
                if (tmpDelay < 50) {
                    tmpDelay = 25;
                }
                if (tmpDelay > 400) {
                    tmpDelay = 400;
                }
                this.gameLoop.delay = tmpDelay;
            }
        });


        // const tmodal = tf.sequential();
        // tmodal.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [2]}));
        // // tmodal.add(tf.layers.dense({units: 1, inputShape: [1]}));
        // // tmodal.compile({loss: 'meanSquaredError', optimizer: 'sgd'}
        //
        // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
        //
        // tmodal.fit(xs, ys).then(() => {
        //     tmodal.predict(tf.tensor2d([3], [1, 1])).print(true);
        // });

    }

    spawnEat() {
        let isBlocked = false;
        let eat = null;
        const mx = Phaser.Math.Between(0, this.width);
        const my = Phaser.Math.Between(0, this.height);

        if (this.map[my][mx] === 1) {
            isBlocked = true;
        }
        for (const bodyCeil of this.snake.body) {
            if (bodyCeil.mx === mx && bodyCeil.my === my) {
                isBlocked = true;
                break;
            }
        }
        if (!isBlocked) {
            const ceil = this.add.rectangle(this.width * mx, this.height * my, this.width, this.height, 0x00ff00).setOrigin(0);
            eat = {mx, my, ceil};
        }

        return eat;
    }

    saveMapState(state) {
        socket.emit('write_state', state);
    }

    getMapState() {
        const eatState = {eatx: -1, eaty: -1};
        if (this.eat) {
            eatState.eatx = this.eat.mx;
            eatState.eaty = this.eat.my;
        }
        return {
            reward: this.reward,
            dir: this.snake.direction,
            mx: this.snake.body[0].mx,
            my: this.snake.body[0].my,
            eatx: eatState.eatx,
            eaty: eatState.eaty,
            lt: this.linesState.t,
            ld: this.linesState.d,
            ll: this.linesState.l,
            lr: this.linesState.r,
        };
    }

    update(time, delta) {
        this.snake.update();
        super.update(time, delta);
    }
}