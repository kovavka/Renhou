import {colors} from "../../../design-tokens/colors";
import {TILE_DEFAULT_HEIGHT, TILE_DEFAULT_WIDTH, TILE_FRONT_DEFAULT_THICKNESS, TILE_BACK_DEFAULT_THICKNESS} from "./consts";
import {TileView} from "./TileView";
import {Context} from "../../core/Context";
import {Position} from "../../core/Position";

const WIDTH = TILE_DEFAULT_WIDTH
const HEIGHT = TILE_DEFAULT_HEIGHT

const BACK_HEIGHT = TILE_BACK_DEFAULT_THICKNESS * 0.5
const SIDE_HEIGHT = TILE_FRONT_DEFAULT_THICKNESS * 0.5
const FRONT_OFFSET = BACK_HEIGHT + SIDE_HEIGHT

export class TileStraightView extends TileView {
    private isHidden: boolean

    constructor(context: Context, position: Position, isHidden: boolean) {
        super(context, position)

        this.isHidden = isHidden
    }

    render() {
        if (this.isHidden) {
            this.drawRect(colors.tileFront, 0,0, WIDTH, HEIGHT)
            this.drawRect(colors.tileBack, 0, SIDE_HEIGHT, WIDTH, HEIGHT)
            this.drawRect(colors.tileBackShadow, 0, FRONT_OFFSET, WIDTH, HEIGHT)
        } else {
            this.drawRect(colors.tileBackShadow, 0, 0, WIDTH, HEIGHT)
            this.drawRect(colors.tileFrontShadow, 0, BACK_HEIGHT, WIDTH, HEIGHT)
            this.drawRect(colors.tileFront, 0, FRONT_OFFSET, WIDTH, HEIGHT)

            this.drawImg(WIDTH, HEIGHT, FRONT_OFFSET)
        }
    }
}