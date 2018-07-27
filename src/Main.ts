import { Rectangle } from './Rectangle'
import { KeyboardService } from './Keyboard';

const enemyColors: string[] = [
    "blue",
    "green",
    "yellow",
    "black",
    "purple",
    "cyan",
    "pink"
]

export class Main {

    /**
     * Graphics vars
     */
    public static canvas: HTMLCanvasElement
    public static context: CanvasRenderingContext2D
    public static keyboard: KeyboardService

    private scoreElement: HTMLElement
    private score: number
    private scoreText: string = "Score: "
    private win: boolean = false

    private redRect: Rectangle

    private enemyRect: Rectangle
    private enemyColorI: number = 0

    private up: boolean
    private down: boolean
    private left: boolean
    private right: boolean

    private isEnemyOnScreen: boolean

    start() {
        this.createGameCanvas();

        this.scoreElement = document.getElementById("score")
        this.score = 0

        this.initializeKeyboardListener();
        this.initializeObjects();

        setInterval(this.render.bind(this), 20);
        console.log("Render loop initialized.")

        setInterval(this.update.bind(this), 20);
        console.log("Update loop initialized.")

        setInterval(this.updateScore.bind(this), 500);
        console.log("Score loop initialized.")
    }

    createGameCanvas() {
        Main.canvas = document.createElement("canvas");
        Main.canvas.width = 480;
        Main.canvas.height = 270;
        Main.context = Main.canvas.getContext("2d");
        document.body.insertAdjacentElement('afterend', Main.canvas);
        console.log("Canvas initialized.")
    }

    initializeKeyboardListener() {

        Main.keyboard = new KeyboardService()
        Main.keyboard.keyDownEventStream.subscribe((event) => {

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

        Main.keyboard.keyUpEventStream.subscribe((event) => {

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

        console.log("Keyboard event streams registered.")
    }

    initializeObjects() {

        this.redRect = new Rectangle(10, 120, 30, 30, 'red')

        this.createRandomEnemy()

        console.log("Screen objects initialized.")

    }

    render() {
        Main.context.clearRect(0, 0, Main.canvas.width, Main.canvas.height)
        this.redRect.draw()

        if (this.enemyRect) {
            this.enemyRect.draw()
        }
    }

    update() {

        this.movePlayerRect()

        if (!this.enemyRect) {
            this.createRandomEnemy()
        } else {
            this.checkEnemyCollision()
        }

        this.scoreElement.textContent = this.scoreText + this.score

    }

    movePlayerRect() {
        if (this.up) {
            this.redRect.moveUp()
        }
        if (this.left) {
            this.redRect.moveLeft()
        }
        if (this.right) {
            this.redRect.moveRight()
        }
        if (this.down) {
            this.redRect.moveDown()
        }
    }

    checkEnemyCollision() {

        if (this.redRect.collides(this.enemyRect)) {
            this.enemyRect = null
            this.score += 10
        }

    }

    createRandomEnemy() {

        var newEnemyRect;
        do {

            newEnemyRect = new Rectangle(
                (Math.random() * (Main.canvas.width - 30)),
                (Math.random() * (Main.canvas.height - 30)),
                30,
                30,
                enemyColors[this.enemyColorI++])

            if (this.enemyColorI >= enemyColors.length) {
                this.enemyColorI = 0
            }
            console.log("Random enemy spawned, but overlapped player.")

        } while (newEnemyRect.collides(this.redRect))

        this.enemyRect = newEnemyRect
    }

    updateScore() {
        if (!this.win) {

            if (this.score > 0) {
                this.score -= 1
            }

            if (this.score >= 500) {
                this.win = true
                this.scoreText += "WINNER "
            }
        }
    }
}


let app = new Main()
app.start()
console.log("App startup complete.")