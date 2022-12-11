export default class Eat {

    constructor(scene, {id, mx, my}) {
        this.scene = scene;
        this.id = id
        this.mx = mx
        this.my = my
    }

    render() {
        this.ceil = this.scene.add.rectangle(this.mx * this.scene.width, this.my * this.scene.height, this.scene.width, this.scene.height, 0x49ff03).setOrigin(0);
    }

    destroy() {
        if(this.ceil) {
            this.ceil.destroy(true)
        }
    }
}