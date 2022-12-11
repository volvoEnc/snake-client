import './style.css';

import Phaser from "phaser";
import MainScene from "./src/scenes/MainScene.js";
import {io} from "socket.io-client";

export const socket = io('ws://localhost:8091');
export const phaserConfig = {
    type: Phaser.AUTO,
    width: 768,
    height: 480,
    backgroundColor: '#FEFEF4',
    parent: 'app',
    fullscreenTarget: 'app',
    scene: [MainScene],
    banner: false,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        },
    },
};

new Phaser.Game(phaserConfig);