import {CanvasObject} from "../../core/CanvasObject";
import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {Side} from "./Side";
import {drawRoundRect} from "../../utils/drawing/roundRect";
import {drawImageRotated} from "../../utils/drawing/image";
import {colors} from "../../../design-tokens/colors";
import {SpriteLoader} from "../../services/sprite-loader/SpriteLoader";
import {SuitType} from "../../core/game-types/SuitType";

const RADIUS = 24

const IMG_WIDTH = 300
const IMG_HEIGHT = 400

const IMG_OFFSET = 80
const SIDE_A = IMG_HEIGHT + IMG_OFFSET
const SIDE_B = IMG_WIDTH + IMG_OFFSET


// todo get from screen size
const SCALE = 0.2

/**
 * @return [width, height]
 */
function getSize(orientation: Side, scale: number): [number, number] {
    if ([Side.TOP, Side.BOTTOM].includes(orientation)) {
        return [SIDE_A * scale, SIDE_B * scale]
    }

    return [SIDE_B * scale, SIDE_A * scale]
}

export class TileView extends CanvasObject {
    private _isHidden: boolean
    private _orientation: Side
    private _type: SuitType
    private _value: number

    constructor(context: Context, type: SuitType, value: number, x: number, y: number, orientation: Side, isHidden: boolean) {
        const [height, width] = getSize(orientation, SCALE)
        super(context, new Rectangle(x, y, width, height));

        this._isHidden = isHidden
        this._orientation = orientation
        this._type = type
        this._value = value
    }

    set isHidden(value: boolean) {
        this._isHidden = value
    }

    set orientation(value: Side) {
        this._orientation = value
        this.updateSize()
    }

    render(): void {
        if (this._isHidden) {
            drawRoundRect(this.context, colors.tileBack, this.bounds, RADIUS * SCALE)
        } else {
            drawRoundRect(this.context, colors.tileFront, this.bounds, RADIUS * SCALE)

            const img = SpriteLoader.instance.getTile(this._type, this._value)
            drawImageRotated(this.context, img, IMG_WIDTH * SCALE, IMG_HEIGHT * SCALE, this.bounds, this._orientation)
        }
    }

    private updateSize(): void {
        const [height, width] = getSize(this._orientation, SCALE)
        this.bounds = new Rectangle(this.position.x, this.position.y, width, height)
    }
}