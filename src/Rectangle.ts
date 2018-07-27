import { Main } from './Main'
import { Moveable } from './Moveable'

export class Rectangle implements Moveable {

    x: number
    y: number
    width: number
    height: number
    velocity: number

    color: string

    constructor(x: number, y: number, width: number, height: number, color: string) {

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;

        this.velocity = 3
        console.log("Rectangle constructed.")
    }

    moveLeft() {
        if (this.x - this.velocity >= 0) {
            this.x -= this.velocity
        }
    }

    moveRight() {
        if (this.x + this.velocity + this.width <= Main.canvas.width) {
            this.x += this.velocity
        }
    }

    moveUp() {
        if (this.y - this.velocity >= 0) {
            this.y -= this.velocity
        }
    }

    moveDown() {
        if (this.y + this.velocity + this.height <= Main.canvas.height) {
            this.y += this.velocity
        }
    }

    collides(other: Moveable): boolean {

        if (this.x + this.width >= other.x && this.y + this.height >= other.y
        && this.x <= other.x + other.width
        && this.y <= other.y + other.height) {
            return true
        } else {
            return false
        }
    }

    draw() {

        this.redraw()

    }

    private redraw() {
        let ctx = Main.context
        if (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            throw new Error("Cannot draw rectangle, game context has not been initialized.")
        }
    }
}