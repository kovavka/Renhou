import { Context } from '../../core/Context'
import { Rectangle } from '../../core/Rectangle'
import { Side } from '../../core/game-types/Side'

export function drawRotatedObject(
    context: Context,
    bounds: Rectangle,
    side: Side,
    drawingFunc: () => void
) {
    const { x, y, width, height } = bounds

    let dx = 0
    let dy = 0
    let degrees = 0

    let actualWidth = width
    let actualHeight = height

    switch (side) {
        case Side.TOP:
            dx = width
            dy = height
            degrees = 180
            break
        case Side.LEFT:
            dx = width
            dy = 0
            degrees = 90
            actualWidth = height
            actualHeight = width
            break
        case Side.BOTTOM:
            dx = 0
            dy = 0
            degrees = 0
            break
        case Side.RIGHT:
            dx = 0
            dy = height
            degrees = -90
            actualWidth = height
            actualHeight = width
            break
    }

    context.setTransform(1, 0, 0, 1, x + dx, y + dy)
    context.rotate((Math.PI * degrees) / 180)

    drawingFunc()
    context.setTransform(1, 0, 0, 1, 0, 0)
}
