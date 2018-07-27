export interface Moveable {

    x: number
    y: number
    width: number
    height: number
    velocity: number

    moveLeft(): void

    moveRight(): void

    moveUp(): void

    moveDown(): void

    collides(other: Moveable): boolean

}

export class Position {

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    x: number
    y: number
}