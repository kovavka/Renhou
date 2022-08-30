import { Context } from '../core/Context'
import { Rectangle } from '../core/Rectangle'
import { Side } from '../../core/game-types/Side'
import { drawRotatedObject } from './rotated'

export function drawImageRotated(
    context: Context,
    img: HTMLImageElement,
    width: number,
    height: number,
    container: Rectangle,
    side: Side
) {
    const {
        x: containerX,
        y: containerY,
        width: containerWidth,
        height: containerHeight,
    } = container

    let posX = 0
    let posY = 0

    switch (side) {
        case Side.TOP:
            posX = containerX + containerWidth / 2 - width / 2
            posY = containerY + containerHeight / 2 - height / 2
            break
        case Side.LEFT:
            posX = containerX + containerWidth / 2 - height / 4
            posY = containerY + containerHeight / 2 - width / 2
            break
        case Side.BOTTOM:
            posX = containerX + containerWidth / 2 - width / 2
            posY = containerY + containerHeight / 2 - height / 2
            break
        case Side.RIGHT:
            posX = containerX + containerWidth / 2 - height / 2
            posY = containerY + containerHeight / 4 - width / 2
            break
    }

    const drawingFunc = () => {
        context.fillStyle = '#444'
        // context.fillRect(0, 0, containerWidth, containerHeight)
        context.drawImage(img, 0, 0, width, height)
    }

    drawRotatedObject(context, new Rectangle(posX, posY, width, height), side, drawingFunc)
}
