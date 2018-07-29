import { KeyboardService } from "./Keyboard";
import { Main } from './Main'
import { Moveable } from "./Moveable";

class VectorRel {

    dX: number
    dY: number

    constructor(dX: number, dY: number) {

        this.dX = dX
        this.dY = dY

    }

    add(other: VectorRel) {

        this.dX += other.dX
        this.dY += other.dY

    }

    toVectorAng(): VectorAng {

        let magnitude = Math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2))

        let angle = Math.asin(this.dY / magnitude)

        return new VectorAng(angle, magnitude)

    }

}

class VectorAng {

    angle: number //degrees
    magnitude: number //pixels

    constructor(angle: number, magnitude: number) {
        this.angle = angle
        this.magnitude = magnitude
    }

    add(other: VectorAng) {

        let thisConvert = this.toVectorRel()
        thisConvert.add(other.toVectorRel())

        let thisAdded = thisConvert.toVectorAng()

        this.angle = thisAdded.angle
        this.magnitude = thisAdded.magnitude

    }

    toVectorRel(): VectorRel {

        let dX = this.magnitude * Math.sin(this.angle)
        let dY = this.magnitude * Math.cos(this.angle)

        return new VectorRel(dX, dY)

    }

}

export class Player {

    /*
     * Input
     */
    private keyboard: KeyboardService
    private up: boolean
    private down: boolean
    private left: boolean
    private right: boolean

    /*
    * Physics
    */
    private x: number
    private y: number
    private velocity: VectorRel
    private thrust: VectorAng

    /*
     * Graphics
     */
    private width: number
    private height: number
    private image: HTMLImageElement

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        imageUrl: string,
        keyboard: KeyboardService) {

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.thrust = new VectorAng(0, 1);
        this.velocity = new VectorRel(0, 0)

        this.image = new Image(width, height)
        this.image.src = imageUrl

        this.keyboard = keyboard
        this.subscribeToKeyboardEvents()

        console.log("Player initalized.")
    }

    subscribeToKeyboardEvents() {
        this.keyboard.keyDownEventStream.subscribe((event) => {

            if (event.key.toUpperCase() === 'W' || event.key.toUpperCase() === 'ARROWUP') {
                event.preventDefault();

                this.up = true
            }
            if (event.key.toUpperCase() === 'A' || event.key.toUpperCase() === 'ARROWLEFT') {
                event.preventDefault();
                this.left = true
            }
            if (event.key.toUpperCase() === 'S' || event.key.toUpperCase() === 'ARROWDOWN') {
                event.preventDefault();
                this.down = true
            }
            if (event.key.toUpperCase() === 'D' || event.key.toUpperCase() === 'ARROWRIGHT') {
                event.preventDefault();
                this.right = true
            }
        })

        this.keyboard.keyUpEventStream.subscribe((event) => {

            if (event.key.toUpperCase() === 'W' || event.key.toUpperCase() === 'ARROWUP') {
                event.preventDefault();
                this.up = false
            }
            if (event.key.toUpperCase() === 'A' || event.key.toUpperCase() === 'ARROWLEFT') {
                event.preventDefault();
                this.left = false
            }
            if (event.key.toUpperCase() === 'S' || event.key.toUpperCase() === 'ARROWDOWN') {
                event.preventDefault();
                this.down = false
            }
            if (event.key.toUpperCase() === 'D' || event.key.toUpperCase() === 'ARROWRIGHT') {
                event.preventDefault();
                this.right = false
            }
        })
    }

    update() {

        if (this.up) {
            this.accelerate()
        }
        if (this.left) {
            this.turn(-1)
        }
        if (this.right) {
            this.turn(1)
        }
        if (this.down) {
            this.deccelerate()
        }

        this.x += this.velocity.dX
        this.y += this.velocity.dY

    }

    accelerate() {

        this.velocity.add(this.thrust.toVectorRel())

        console.log(this.velocity)
    }

    deccelerate() {

        let antiThrust = this.thrust
        antiThrust.magnitude *= -0.5
        this.velocity.add(antiThrust.toVectorRel())
        console.log(this.velocity)
    }

    turn(angle: number) {

        this.thrust.angle += angle

        if(this.thrust.angle >= 360) {
            this.thrust.angle -= 360
        }
        if(this.thrust.angle <= 0) {
            this.thrust.angle += 360
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
        let ctx = Main.context
        if (ctx) {
            ctx.save();
            ctx.translate(this.x, this.y); 
            ctx.rotate(this.thrust.angle);
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            ctx.restore(); 
        } else {
            throw new Error("Cannot draw rectangle, game context has not been initialized.")
        }
    }






}