export default class Eat {

    radius = 8
    constructor(scene, {id, mx, my}) {
        this.scene = scene;
        this.id = id
        this.mx = mx
        this.my = my
    }

    render() {
        this.ceil = this.scene.add.circle(this.mx * this.scene.width + (this.radius / 2), this.my * this.scene.height + (this.radius / 2), 8, 0x49ff03).setOrigin(0);
    }

    destroy() {
        if(this.ceil) {
            this.ceil.destroy(true)
        }
    }
}