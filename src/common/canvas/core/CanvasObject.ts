import { Rectangle } from './Rectangle'
import { Context } from './Context'
import { Position } from './Position'

export abstract class CanvasObject {
    bounds: Rectangle
    context: Context

    private _clickHandler: (() => void) | undefined

    constructor(context: Context, bounds: Rectangle, clickHandler?: () => void) {
        this.context = context
        this.bounds = bounds
        this._clickHandler = clickHandler
    }

    get position(): Position {
        return {
            x: this.bounds.x,
            y: this.bounds.y,
        }
    }

    get rect(): [number, number, number, number] {
        return [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height]
    }

    abstract render(): void

    clickHandler(): void {
        this._clickHandler?.()
    }
}
