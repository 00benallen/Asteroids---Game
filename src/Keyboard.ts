import { Observable, Observer } from 'rxjs'

export class KeyboardService {

    public keyDownEventStream: Observable<KeyboardEvent>
    public keyUpEventStream: Observable<KeyboardEvent>

    constructor() {

        
        this.keyDownEventStream = Observable.create((obs: Observer<KeyboardEvent>) => {

            window.onkeydown = (event) => {
                obs.next(event)

            }
        })

        this.keyUpEventStream = Observable.create((obs: Observer<KeyboardEvent>) => {

            window.onkeyup = (event) => {
                obs.next(event)

            }
        })
        console.log("Keyboard event streams initialialized.")

    }

}