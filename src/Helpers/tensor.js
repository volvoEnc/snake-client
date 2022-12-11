/** Превращаем игровое состояние в тензор состояния для скармливания в нейронку */
import * as tf from "@tensorflow/tfjs";

export default function getStateTensor(state, w, h) {
    const buffer = tf.buffer([state.length, w, h, 2]);
}