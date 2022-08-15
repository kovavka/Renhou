import { Position } from './Position'

export class Rectangle {
    /**
     * top-left position
     */
    x: number

    /**
     * top-left position
     */
    y: number

    width: number

    height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    get tolLeft(): Position {
        return {
            x: this.x,
            y: this.y,
        }
    }

    get topRight(): Position {
        return {
            x: this.x + this.width,
            y: this.y,
        }
    }

    get bottomLeft(): Position {
        return {
            x: this.x,
            y: this.y + this.height,
        }
    }

    get bottomRight(): Position {
        return {
            x: this.x + this.width,
            y: this.y + this.height,
        }
    }
}
