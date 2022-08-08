import {CanvasObject} from "../../core/CanvasObject";
import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {Orientation} from "./Orientation";
import {drawRoundRect} from "../../utils/drawing/roundRect";
import {drawImageRotated} from "../../utils/drawing/image";
import sou9 from "../../../img/tiles/sou9.svg";
import {colors} from "../../../design-tokens/colors";
import {SpriteLoader} from "../../services/sprite-loader/SpriteLoader";
import {SuitType} from "../../core/SuitType";

const SIDE_A = 480
const SIDE_B = 380
const RADIUS = 24

const IMG_WIDTH = 300
const IMG_HEIGHT = 400

/**
 * @return [width, height]
 */
function getSize(orientation: Orientation): [number, number] {
    if ([Orientation.TOP, Orientation.BOTTOM].includes(orientation)) {
        return [SIDE_A, SIDE_B]
    }

    return [SIDE_B, SIDE_A]
}

export class Tile extends CanvasObject {
    private _isHidden: boolean
    private _orientation: Orientation
    private _type: SuitType
    private _value: number

    constructor(context: Context, type: SuitType, value: number, x: number, y: number, orientation: Orientation, isHidden: boolean) {
        const [height, width] = getSize(orientation)
        super(context, new Rectangle(x, y, width, height));

        this._isHidden = isHidden
        this._orientation = orientation
        this._type = type
        this._value = value
    }

    set isHidden(value: boolean) {
        this._isHidden = value
    }

    set orientation(value: Orientation) {
        this._orientation = value
        this.updateSize()
    }

    render(): void {
        if (this._isHidden) {
            drawRoundRect(this.context, colors.tileBack, this.bounds, RADIUS)
        } else {
            drawRoundRect(this.context, colors.tileFront, this.bounds, RADIUS)

            const img = SpriteLoader.instance.getTile(this._type, this._value)
            drawImageRotated(this.context, img, IMG_WIDTH, IMG_HEIGHT, this.bounds, this._orientation)
        }
    }

    private updateSize(): void {
        const [height, width] = getSize(this._orientation)
        this.bounds = new Rectangle(this.position.x, this.position.y, width, height)
    }
}