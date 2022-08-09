import {ICanvasService} from "./ICanvasService";
import {Context} from "../../core/Context";
import {TileView} from "../../view/components/tile/TileView";
import {Side} from "../../core/game-types/Side";
import signals from "signals";
import {SpriteLoader} from "../sprite-loader/SpriteLoader";
import {TableView} from "../../view/components/table/TableView";
import {MahjongService} from "../mahjong/MahjongService";
import {EdgeType} from "../../view/components/tile/EdgeType";
import {CanvasObject} from "../../core/CanvasObject";
import {TableContainer} from "../../view/screens/mahjong/TableContainer";
import {AppService} from "../app/AppService";
import {ScreenType} from "../app/IAppService";
import {MenuContainer} from "../../view/screens/menu/MenuContainer";

export class CanvasServiceImpl implements ICanvasService {
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

        MahjongService.instance.stateChanged.add(this.render, this)
        AppService.instance.screenChanged.add(this.render, this)
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
        const {gameObjects} = this
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i]

            if (x > obj.bounds.x && x < obj.bounds.bottomRight.x && y > obj.bounds.y && y < obj.bounds.bottomRight.y) {
                obj.clickHandler()
                return
            }
        }
    }

    private canRender(): boolean {
        return SpriteLoader.instance.allLoaded && this.width !== 0 && this.height !== 0
    }

    private gameObjects: CanvasObject[] = []

    private render(): void {
        this.gameObjects = []
        const {canvas, context, width, height} = this
        if (!this.canRender() || context === undefined || canvas === undefined) {
            return
        }

        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, width, height)

        switch (AppService.instance.currentScreen) {
            case ScreenType.MENU:
                this.gameObjects = MenuContainer.render(context, width, height)
                break
            case ScreenType.MAJHONG:
                this.gameObjects = TableContainer.render(context, width, height)
                break
        }
    }
}