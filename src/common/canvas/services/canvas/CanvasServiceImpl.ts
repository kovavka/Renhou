import {ICanvasService} from "./ICanvasService";
import {Context} from "../../core/Context";
import {TileView} from "../../components/tile/TileView";
import {Side} from "../../core/game-types/Side";
import signals from "signals";
import {SpriteLoader} from "../sprite-loader/SpriteLoader";
import {TableView} from "../../components/table/TableView";
import {GameService} from "../game/GameService";
import {EdgeType} from "../../components/tile/EdgeType";
import {SuitType} from "../../core/game-types/SuitType";
import {CanvasObject} from "../../core/CanvasObject";
import {CanvasService} from "./CanvasService";

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

        GameService.instance.stateChanged.add(this.render, this)
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
        for (let i = gameObjects.length - 1; i > 0; i--) {
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
        const {canvas, context, gameObjects} = this
        if (!this.canRender() || context === undefined || canvas === undefined) {
            return
        }

        context.setTransform(1, 0, 0, 1, 0, 0)
        const table = new TableView(context, this.width, this.height)
        this.gameObjects.push(table)
        table.render()

        const {gameState} = GameService.instance
        if (gameState !== undefined) {

            let x = 10
            let y = 10

            const tileOffset = 4


            gameState.topHand.tiles.forEach(tile => {
                const tileView = new TileView(context, tile, x, y, Side.TOP, EdgeType.SIDE)
                gameObjects.push(tileView)
                tileView.render()
                x += tileView.bounds.width + tileOffset
            })

            x = 10
            y = 80

            gameState.leftHand.tiles.forEach(tile => {
                const tileView = new TileView(context, tile, x, y, Side.LEFT, EdgeType.SIDE)
                gameObjects.push(tileView)
                tileView.render()
                y += tileView.bounds.height + tileOffset
            })

            y += 40


            const handTileClick = GameService.instance.handTileClick.bind(GameService.instance)
            const drawTileClick = GameService.instance.drawTileClick.bind(GameService.instance)

            gameState.bottomHand.tiles.forEach(tile => {
                const tileView = new TileView(context, tile, x, y, Side.BOTTOM, EdgeType.FRONT, handTileClick)
                gameObjects.push(tileView)
                tileView.render()
                x += tileView.bounds.width + tileOffset
            })

            if (gameState.currentTurn.side === Side.BOTTOM) {
                const tileView = new TileView(context, gameState.currentTurn.drawTile, x + 4, y, Side.BOTTOM, EdgeType.FRONT, drawTileClick)
                gameObjects.push(tileView)
                tileView.render()
            }

            y = 80

            gameState.rightHand.tiles.forEach(tile => {
                const tileView = new TileView(context, tile, x, y, Side.RIGHT, EdgeType.SIDE)
                gameObjects.push(tileView)
                tileView.render()
                y += tileView.bounds.height + tileOffset
            })

        }
    }
}