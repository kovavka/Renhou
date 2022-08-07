import {Rectangle} from "./Rectangle";
import {Context} from "./Context";


export abstract class CanvasObject {
    bounds: Rectangle
    context: Context

    constructor(context: Context, bounds: Rectangle) {
        this.context = context
        this.bounds = bounds
    }

    destroy() {
        this.context.fillRect(...this.rect);
    }

    get rect(): [number, number, number, number] {
        return [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height]
    }

    abstract render(): void
}