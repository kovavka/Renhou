import { Rectangle } from '../core/Rectangle'
import { Context } from '../core/Context'

export function drawText(
    context: Context,
    text: string,
    fontSize: number,
    color: string,
    container: Rectangle
): void {
    context.font = `${fontSize}px serif`
    context.textBaseline = 'middle'

    const textObj = context.measureText(text)
    context.fillStyle = color

    const x = container.x + (container.width - textObj.width) / 2
    const y = container.y + container.height / 2
    context.fillText(text, x, y)
}
