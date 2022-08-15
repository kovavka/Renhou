import signals from 'signals'

export interface ICanvasService {
    onResize: signals.Signal<{ width: number; height: number }>
    updateCanvas(canvas: HTMLCanvasElement): void
    updateSize(width: number, height: number): void
    clickHandler(x: number, y: number): void
}
