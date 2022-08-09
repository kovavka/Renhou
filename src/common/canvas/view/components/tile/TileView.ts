import {CanvasObject} from "../../../core/CanvasObject";
import {Context} from "../../../core/Context";
import {Rectangle} from "../../../core/Rectangle";
import {Side} from "../../../core/game-types/Side";
import {drawRoundRect} from "../../../utils/drawing/roundRect";
import {drawImageRotated} from "../../../utils/drawing/image";
import {colors} from "../../../../design-tokens/colors";
import {SpriteLoader} from "../../../services/sprite-loader/SpriteLoader";
import {Tile} from "../../../core/game-types/Tile";
import {EdgeType} from "./EdgeType";
import {drawRotatedObject} from "../../../utils/drawing/rotated";
import {TILE_IMG_HEIGHT, TILE_IMG_WIDTH, TILE_SIDE_A, TILE_SIDE_B, TILE_SIDE_BACK_PERCENT, TILE_SIDE_C} from "./consts";
import {getTileSize} from "./getTileSize";

const RADIUS = 24

export class TileView extends CanvasObject {
    private _scale: Side
    private _side: Side
    private _tile: Tile
    private _edge: EdgeType

    constructor(context: Context, tile: Tile, x: number, y: number, scale: number, side: Side, edge: EdgeType, clickHandler?: () => void) {
        const [width, height] = getTileSize(side, edge, scale)
        super(context, new Rectangle(x, y, width, height), clickHandler);

        this._scale = scale
        this._edge = edge
        this._side = side
        this._tile = tile
    }

    set side(value: Side) {
        this._side = value
        this.updateSize()
    }

    render(): void {
        const {_edge: edge, _tile: tile, bounds, _side: side, context, _scale: scale} = this
        const radius = RADIUS * scale
        switch (edge) {
            case EdgeType.FRONT: {
                drawRoundRect(context, colors.tileFront, bounds, radius)

                const img = SpriteLoader.instance.getTileImage(tile.type, tile.value)
                drawImageRotated(context, img, TILE_IMG_WIDTH * scale, TILE_IMG_HEIGHT * scale, bounds, side)
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
                const backHeight = sideHeight * TILE_SIDE_BACK_PERCENT
                const frontHeight = sideHeight * (1 - TILE_SIDE_BACK_PERCENT)

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
        const [height, width] = getTileSize(this._side, this._edge, this._scale)
        this.bounds = new Rectangle(this.position.x, this.position.y, width, height)
    }
}