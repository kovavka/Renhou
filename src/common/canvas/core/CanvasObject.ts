import {Rectangle} from "./Rectangle";
import {Context} from "./Context";
import {Position} from "./Position";


export abstract class CanvasObject {
    bounds: Rectangle
    context: Context

    protected constructor(context: Context, bounds: Rectangle) {
        this.context = context
        this.bounds = bounds
    }

    get position(): Position {
        return {
            x: this.bounds.x,
            y: this.bounds.y,
        }
    }

    abstract render(): void
}