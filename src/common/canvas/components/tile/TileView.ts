import {colors} from "../../../design-tokens/colors";
import {makeRoundRect, makeRoundRectBySide} from "../../utils/drawing/roundRect";
import man1 from "../../../img/tiles/man1.svg";
import sou9 from "../../../img/tiles/sou9.svg";
import {Context} from "../../core/Context";
import {TILE_DEFAULT_HEIGHT, TILE_DEFAULT_WIDTH, TILE_RADIUS} from "./consts";
import {ICanvasObjectView} from "../../core/ICanvasObjectView";
import {Position} from "../../core/Position";

export abstract class TileView implements ICanvasObjectView {
    protected readonly context: Context
    protected readonly position: Position

    constructor(context: Context, position: Position) {
        this.context = context
        this.position = position
    }

    protected drawRect(color: string, x: number, y: number, w: number, h: number) {
        this.context.fillStyle = color
        makeRoundRect(this.context,  this.position.x + x, this.position.y + y, w, h, TILE_RADIUS)
        this.context.fill()
    }

    protected drawPartRounderRect(color: string, x: number, y: number, w: number, h: number, {topLeft = false, topRight = false, bottomLeft = false, bottomRight = false}: {
        topLeft?: boolean, topRight?: boolean, bottomLeft?: boolean, bottomRight?: boolean
    }) {
        this.context.fillStyle = color
        makeRoundRectBySide(this.context,  this.position.x + x, this.position.y + y, w, h, topRight ? TILE_RADIUS : 0, bottomRight ? TILE_RADIUS : 0, bottomLeft ? TILE_RADIUS : 0, topLeft ? TILE_RADIUS : 0)
        this.context.fill()
    }

    protected drawImg(width: number, height: number, topOffset: number) {
        const img = new Image()
        img.src = sou9;
        img.onload = () => {
            const x = (this.position.x + width / 2) -  img.width / 2
            const y = (this.position.y + height / 2) -  img.height / 2 + topOffset

            this.context.drawImage(img, x, y, img.width, img.height)
        }
    }

    abstract render(): void
}