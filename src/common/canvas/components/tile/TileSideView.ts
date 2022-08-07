import {colors} from "../../../design-tokens/colors";
import {
    TILE_BACK_DEFAULT_THICKNESS,
    TILE_DEFAULT_HEIGHT,
    TILE_DEFAULT_WIDTH,
    TILE_FRONT_DEFAULT_THICKNESS, TILE_RADIUS
} from "./consts";
import {TileView} from "./TileView";
import {Context} from "../../core/Context";
import {Position} from "../../core/Position";
import {makeRoundRectBySide} from "../../utils/drawing/roundRect";


const TOP_HEIGHT = TILE_DEFAULT_WIDTH * 0.3
const BOTTOM_HEIGHT = TILE_DEFAULT_HEIGHT

const WIDTH = TILE_FRONT_DEFAULT_THICKNESS + TILE_BACK_DEFAULT_THICKNESS
const HEIGHT = TOP_HEIGHT + BOTTOM_HEIGHT

export class TileSideView extends TileView {
    render() {
        this.drawPartRounderRect(colors.tileFront, 0,0, TILE_FRONT_DEFAULT_THICKNESS, TOP_HEIGHT, {topLeft: true})
        this.drawPartRounderRect(colors.tileBack, TILE_FRONT_DEFAULT_THICKNESS,0, TILE_BACK_DEFAULT_THICKNESS, TOP_HEIGHT, {topRight: true})

        this.drawPartRounderRect(colors.tileFrontShadow, 0, TOP_HEIGHT, TILE_FRONT_DEFAULT_THICKNESS, HEIGHT, {bottomLeft: true})
        this.drawPartRounderRect(colors.tileBackShadow, TILE_FRONT_DEFAULT_THICKNESS, TOP_HEIGHT, TILE_BACK_DEFAULT_THICKNESS, HEIGHT, {bottomRight: true})
    }
}