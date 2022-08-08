import {ICanvasService} from "./ICanvasService";
import {Context} from "../../core/Context";
import {colors} from "../../../design-tokens/colors";
import {TileView} from "../../components/tile/TileView";
import {Side} from "../../components/tile/Side";
import signals from "signals";
import {SpriteLoader} from "../sprite-loader/SpriteLoader";
import {SuitType} from "../../core/game-types/SuitType";

export class CanvasServiceImpl implements ICanvasService {
    private isReady = false

    private context: Context | undefined
    private canvas: HTMLCanvasElement | undefined
    private _width: number = 0
    private _height: number = 0

    onResize: signals.Signal<{width: number, height: number}> = new signals.Signal()

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    constructor() {
        SpriteLoader.instance.doOnLoad.then(() => {
            this.render()
        })
    }

    updateCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.context = canvas.getContext('2d') ?? undefined

        this.render()
    }

    updateSize(width: number, height: number): void {
        this._width = width
        this._height = height
        this.onResize.dispatch({width, height})
        this.render()
    }

    clickHandler(x: number, y: number): void {

    }

    private canRender(): boolean {
        return SpriteLoader.instance.allLoaded && this.width !== 0 && this.height !== 0
    }

    private render(): void {
        const {canvas, context} = this
        if (this.canRender() && context !== undefined && canvas !== undefined) {
            context.beginPath();
            context.fillStyle = colors.tableBackground
            context.fillRect(0, 0, this.width, this.height)

            const tile1 = new TileView(context, SuitType.MANZU, 9, 100, 100, Side.LEFT, false)
            tile1.render()
        }
    }
}