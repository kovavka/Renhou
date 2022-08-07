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
import {makeRoundRect, makeRoundRectBySide} from "../../utils/drawing/roundRect";


const TOP_HEIGHT = TILE_DEFAULT_WIDTH * 0.3
const BOTTOM_HEIGHT = TILE_DEFAULT_HEIGHT *0.5

const WIDTH = TILE_FRONT_DEFAULT_THICKNESS + TILE_BACK_DEFAULT_THICKNESS
const HEIGHT = TOP_HEIGHT + BOTTOM_HEIGHT

const TOP_ANGLE = 18
const BOTTOM_ANGLE = 20

function calcProjection(angle: number, height: number): number {
    return Math.round(Math.sin(Math.PI / 180 * angle) * height)
}

export class TileSideView extends TileView {
    private drawTop(color: string, x: number, y: number, width: number) {
        const posX = this.position.x + x
        const posY = this.position.y + y

        const xOffset = calcProjection(TOP_ANGLE, TOP_HEIGHT)
        const yOffset = calcProjection(90 - TOP_ANGLE, TOP_HEIGHT)

        this.context.fillStyle = color
        this.context.beginPath()
        this.context.moveTo(posX + xOffset, posY)
        this.context.lineTo(posX + xOffset + width, posY)
        this.context.lineTo(posX + width, posY + yOffset)
        this.context.lineTo(posX, posY + yOffset)
        this.context.closePath()
        this.context.fill()
    }

    private drawTop1(color: string, x: number, y: number, width: number) {
        const posX = this.position.x + x
        const posY = this.position.y + y

        const xOffset = calcProjection(TOP_ANGLE, TOP_HEIGHT)
        const yOffset = calcProjection(90 - TOP_ANGLE, TOP_HEIGHT)

        const r = 8

        this.context.fillStyle = color
        this.context.beginPath()

        const topLeft = {x: posX + xOffset, y: posY}
        const topRight = {x: posX + xOffset + width, y: posY}
        const bottomRight = {x: posX + width, y: posY + yOffset}
        const bottomLeft = {x: posX, y: posY + yOffset}


        this.context.moveTo(topLeft.x + r, topLeft.y)
        this.context.arcTo(topRight.x, topRight.y, bottomRight.x, bottomRight.y, r)
        this.context.arcTo(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, r)
        this.context.arcTo(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, r)
        this.context.arcTo(topLeft.x, topLeft.y, topRight.x, topRight.y, r)


        this.context.closePath()
        this.context.fill()
    }

    private drawBottom(color: string, x: number, y: number, width: number) {
        const posX = this.position.x + x
        const posY = this.position.y + y

        const xOffset = calcProjection(BOTTOM_ANGLE, BOTTOM_HEIGHT)
        const yOffset = calcProjection(90 - BOTTOM_ANGLE, BOTTOM_HEIGHT)

        this.context.fillStyle = color
        this.context.beginPath()
        this.context.moveTo(posX, posY)
        this.context.lineTo(posX + width, posY)
        this.context.lineTo(posX + width + xOffset, posY + yOffset)
        this.context.lineTo(posX + xOffset, posY + yOffset)
        this.context.closePath()
        this.context.fill()
    }

    private drawRight(color: string) {
        const posX = this.position.x
        const posY = this.position.y

        const xOffsetTop = calcProjection(TOP_ANGLE, TOP_HEIGHT)
        const yOffsetTop = calcProjection(90 - TOP_ANGLE, TOP_HEIGHT)

        const xOffsetBottom = calcProjection(BOTTOM_ANGLE, BOTTOM_HEIGHT)
        const yOffsetBottom = calcProjection(90 - BOTTOM_ANGLE, BOTTOM_HEIGHT)

        this.context.fillStyle = color
        this.context.beginPath()
        this.context.moveTo(posX + xOffsetTop + WIDTH, posY)
        this.context.lineTo(posX + xOffsetTop + WIDTH + xOffsetBottom, posY + yOffsetBottom)
        this.context.lineTo(posX + WIDTH + xOffsetBottom, posY + yOffsetBottom + yOffsetTop)
        this.context.lineTo(posX + WIDTH, posY + yOffsetTop)
        this.context.closePath()
        this.context.fill()
    }


    render() {
        const actualTopHeight = Math.round(Math.sin(Math.PI / 180 * (90 - TOP_ANGLE)) * TOP_HEIGHT)
        const actualBottomHeight = Math.sin(Math.PI / 180 * BOTTOM_ANGLE) * BOTTOM_HEIGHT

        this.drawTop(colors.tileFront, 0, 0, TILE_FRONT_DEFAULT_THICKNESS)
        this.drawTop(colors.tileBack, TILE_FRONT_DEFAULT_THICKNESS, 0, TILE_BACK_DEFAULT_THICKNESS)
        this.drawBottom(colors.tileFrontShadow, 0, actualTopHeight, TILE_FRONT_DEFAULT_THICKNESS)
        this.drawBottom(colors.tileBackShadow, TILE_FRONT_DEFAULT_THICKNESS, actualTopHeight, TILE_BACK_DEFAULT_THICKNESS)
        this.drawRight(colors.tileBackShadow)
        // this.drawPartRounderRect(colors.tileFront, 0,0, TILE_FRONT_DEFAULT_THICKNESS, TOP_HEIGHT, {topLeft: true})
        // this.drawPartRounderRect(colors.tileBack, TILE_FRONT_DEFAULT_THICKNESS,0, TILE_BACK_DEFAULT_THICKNESS, TOP_HEIGHT, {topRight: true})
        //
        // this.drawPartRounderRect(colors.tileFrontShadow, 0, TOP_HEIGHT, TILE_FRONT_DEFAULT_THICKNESS, HEIGHT, {bottomLeft: true})
        // this.drawPartRounderRect(colors.tileBackShadow, TILE_FRONT_DEFAULT_THICKNESS, TOP_HEIGHT, TILE_BACK_DEFAULT_THICKNESS, HEIGHT, {bottomRight: true})
    }
}