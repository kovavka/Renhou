import {CanvasObject} from "../../core/CanvasObject";
import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {Side} from "../../core/game-types/Side";
import {drawRoundRect} from "../../utils/drawing/roundRect";
import {drawImageRotated} from "../../utils/drawing/image";
import {colors} from "../../../design-tokens/colors";
import {SpriteLoader} from "../../services/sprite-loader/SpriteLoader";
import {Tile} from "../../core/game-types/Tile";
import {EdgeType} from "./EdgeType";
import {drawRotatedObject} from "../../utils/drawing/rotated";

const RADIUS = 24

const IMG_WIDTH = 300
const IMG_HEIGHT = 400

const IMG_OFFSET = 80
const SIDE_A = IMG_HEIGHT + IMG_OFFSET
const SIDE_B = IMG_WIDTH + IMG_OFFSET
const SIDE_C =  200

const SIDE_BACK_PERCENT = 0.4


// todo get from screen size
const SCALE = 0.13

/**
 * @return [width, height]
 */
function getSize(side: Side, edge: EdgeType, scale: number): [number, number] {
    let width: number
    let height: number

    const isVertical = [Side.TOP, Side.BOTTOM].includes(side)
    if (edge === EdgeType.SIDE) {
        if (isVertical) {
            width = SIDE_B
            height = SIDE_C
        } else {
            width = SIDE_C
            height = SIDE_B
        }
    } else {
        if (isVertical) {
            width = SIDE_B
            height = SIDE_A
        } else {
            width = SIDE_A
            height = SIDE_B
        }
    }

    return [width * scale, height * scale]
}

export class TileView extends CanvasObject {
    private _side: Side
    private _tile: Tile
    private _edge: EdgeType

    constructor(context: Context, tile: Tile, x: number, y: number, side: Side, edge: EdgeType) {
        const [width, height] = getSize(side, edge, SCALE)
        super(context, new Rectangle(x, y, width, height));

        this._edge = edge
        this._side = side
        this._tile = tile
    }

    set side(value: Side) {
        this._side = value
        this.updateSize()
    }

    render(): void {
        const radius = RADIUS * SCALE
        const {_edge: edge, _tile: tile, bounds, _side: side, context} = this
        switch (edge) {
            case EdgeType.FRONT: {
                drawRoundRect(context, colors.tileFront, bounds, radius)

                const img = SpriteLoader.instance.getTileImage(tile.type, tile.value)
                drawImageRotated(context, img, IMG_WIDTH * SCALE, IMG_HEIGHT * SCALE, bounds, side)
                break
            }
            case EdgeType.BACK: {
                drawRoundRect(context, colors.tileBack, bounds, radius)
                break
            }
            case EdgeType.SIDE: {
                const {width, height} = bounds

                const sideHeight = Math.min(width, height)
                const sideWidth = Math.max(width, height)
                const backHeight = sideHeight * SIDE_BACK_PERCENT
                const frontHeight = sideHeight * (1 - SIDE_BACK_PERCENT)

                const drawingFunc = () => {
                    drawRoundRect(context, colors.tileBack, new Rectangle(0, 0, sideWidth, sideHeight), radius)
                    drawRoundRect(context, colors.tileFront, new Rectangle(0, backHeight, sideWidth, frontHeight), radius)
                }

                drawRotatedObject(context, bounds, side, drawingFunc)
                break
            }
        }
    }

    private updateSize(): void {
        const [height, width] = getSize(this._side, this._edge, SCALE)
        this.bounds = new Rectangle(this.position.x, this.position.y, width, height)
    }
}