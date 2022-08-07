import {Context} from "../../core/Context";

export function makeRoundRect(context: Context, x: number, y: number, w: number, h: number, r: number): void {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    context.beginPath()
    context.moveTo(x+r, y)
    context.arcTo(x+w, y,   x+w, y+h, r)
    context.arcTo(x+w, y+h, x,   y+h, r)
    context.arcTo(x,   y+h, x,   y,   r)
    context.arcTo(x,   y,   x+w, y,   r)
    context.closePath()
}

/**
 *
 * @param context
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r1 top right
 * @param r2 bottom right
 * @param r3 bottom left
 * @param r4 top left
 */
export function makeRoundRectBySide(context: Context, x: number, y: number, w: number, h: number, r1: number, r2: number, r3: number, r4: number): void {
    context.beginPath();
    context.moveTo(x+r1, y);
    context.arcTo(x+w, y,   x+w, y+h, r1);
    context.arcTo(x+w, y+h, x,   y+h, r2);
    context.arcTo(x,   y+h, x,   y,   r3);
    context.arcTo(x,   y,   x+w, y,   r4);
    context.closePath();
}