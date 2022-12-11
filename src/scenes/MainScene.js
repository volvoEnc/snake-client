import Snake from "../Entities/Snake.js";
import {socket} from "../../main.js";
import Eat from "../Entities/Eat.js";

export default class MainScene extends Phaser.Scene {
    w = 32;
    h = 24;
    width;
    height;

    snakes = []
    eats = []

    push

    constructor() {
        super({key: 'MainScene', active: true});
    }

    preload() {

    }

    create() {
        this.map = [];

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

        socket.on('create-id', (data) => {
            this.playerID = data.id
            socket.emit('ready')
        })
        socket.on('create', (data) => {
            data.players.forEach((snake) => {
                this.snakes.push(new Snake(this, snake.id, snake.body, snake.color));
            })
        })

        socket.on('step', (data) => {
            data.eats.forEach((data) => {
                if(data) {
                    const candidate = this.eats.find((eat) => eat.id === data.id)
                    if(!candidate) {
                        const eat = new Eat(this, data)
                        eat.render()
                        this.eats.push(eat)
                    }
                }


            })
            data.players.forEach((dataSnake) => {
                const candidate = this.snakes.find((snake) => snake.playerID === dataSnake.id)
                if (candidate) {
                    candidate.updateBody(dataSnake.body)
                }
            })
        })

        socket.on('delete-player', (data) => {
            const candidate = this.snakes.find((snake) => data.id === snake.playerID)
            if (candidate) {
                candidate.destroy()
            }
        })

        socket.on('delete-eat', (data) => {
            const candidate = this.eats.find((eat) => eat.id === data.id)
            if(candidate) {
                candidate.destroy()
            }
        })

        socket.emit('init');
    }

    update(time, delta) {
        this.snakes.forEach((snake) => {
            if(this.playerID !== undefined && this.playerID === snake.playerID) {
                snake.update();
            }
        })
        super.update(time, delta);
    }
}