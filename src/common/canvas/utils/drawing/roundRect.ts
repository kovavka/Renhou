import { Context } from '../../core/Context'
import { Rectangle } from '../../core/Rectangle'

export function makeRoundRect(context: Context, rect: Rectangle, r: number): void {
    const { x, y, width, height } = rect
    if (width < 2 * r) r = width / 2
    if (height < 2 * r) r = height / 2
    context.beginPath()
    context.moveTo(x + r, y)
    context.arcTo(x + width, y, x + width, y + height, r)
    context.arcTo(x + width, y + height, x, y + height, r)
    context.arcTo(x, y + height, x, y, r)
    context.arcTo(x, y, x + width, y, r)
    context.closePath()
}

export function drawRoundRect(context: Context, color: string, rect: Rectangle, r: number) {
    context.fillStyle = color
    makeRoundRect(context, rect, r)
    context.fill()
}
