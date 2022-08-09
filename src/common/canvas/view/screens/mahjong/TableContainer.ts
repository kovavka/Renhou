import {CanvasObject} from "../../../core/CanvasObject";
import {Context} from "../../../core/Context";
import {TableView} from "../../components/table/TableView";
import {MahjongService} from "../../../services/mahjong/MahjongService";
import {TileView} from "../../components/tile/TileView";
import {Side} from "../../../core/game-types/Side";
import {EdgeType} from "../../components/tile/EdgeType";
import {GameState} from "../../../services/mahjong/IMahjongService";
import {TILE_SIDE_A, TILE_SIDE_B} from "../../components/tile/consts";
import {getTileSize} from "../../components/tile/getTileSize";

const TILE_OFFSET = 2
const DRAW_TILE_OFFSET = 8
const SCREEN_OFFSET = 10

const OTHER_HANDS_SCALE_PERCENT = 0.8

export class TableContainer {
    private static renderTop(context: Context, gameState: GameState, gameObjects: CanvasObject[], x: number, y: number, scale: number): void {
        let posX = x

        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.TOP) {
            const tileView = new TileView(context, gameState.currentTurn.drawTile, posX, y, scale, Side.TOP, EdgeType.SIDE, drawTileClick)
            tileView.render()
            gameObjects.push(tileView)

            posX +=  tileView.bounds.width + DRAW_TILE_OFFSET
        }

        gameState.topHand.tiles.forEach(tile => {
            const tileView = new TileView(context, tile, posX, y, scale, Side.TOP, EdgeType.SIDE)
            tileView.render()
            gameObjects.push(tileView)

            posX += tileView.bounds.width + TILE_OFFSET
        })
    }

    private static renderLeft(context: Context, gameState: GameState, gameObjects: CanvasObject[], x: number, y: number, scale: number): void {
        let posY = y
        gameState.leftHand.tiles.forEach(tile => {
            const tileView = new TileView(context, tile, x, posY, scale, Side.LEFT, EdgeType.SIDE)
            tileView.render()
            gameObjects.push(tileView)

            posY += tileView.bounds.height + TILE_OFFSET
        })

        posY += -TILE_OFFSET + DRAW_TILE_OFFSET
        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.LEFT) {
            const tileView = new TileView(context, gameState.currentTurn.drawTile, x, posY, scale, Side.LEFT, EdgeType.SIDE, drawTileClick)
            tileView.render()
            gameObjects.push(tileView)
        }
    }

    private static renderRight(context: Context, gameState: GameState, gameObjects: CanvasObject[], screenWidth: number, rightSideOffset: number, y: number, scale: number): void {
        const [width] = getTileSize(Side.RIGHT, EdgeType.SIDE, scale)
        const posX = screenWidth - rightSideOffset - width

        let posY = y

        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.RIGHT) {
            const tileView = new TileView(context, gameState.currentTurn.drawTile, posX, posY, scale, Side.RIGHT, EdgeType.SIDE, drawTileClick)
            tileView.render()
            gameObjects.push(tileView)

            posY += tileView.bounds.height + DRAW_TILE_OFFSET
        }

        gameState.rightHand.tiles.forEach(tile => {
            const tileView = new TileView(context, tile, posX, posY, scale, Side.RIGHT, EdgeType.SIDE)
            tileView.render()
            gameObjects.push(tileView)

            posY += tileView.bounds.height + TILE_OFFSET
        })
    }

    private static renderBottom(context: Context, gameState: GameState, gameObjects: CanvasObject[], screenHeight: number, x: number, bottomSideOffset: number, scale: number): void {
        const [, height] = getTileSize(Side.BOTTOM, EdgeType.FRONT, scale)
        const posY = screenHeight - bottomSideOffset - height

        let actualWidth = 0

        let posX = x
        gameState.bottomHand.tiles.forEach(tile => {
            const handTileClick = () => MahjongService.instance.handTileClick(tile)
            const tileView = new TileView(context, tile, posX, posY, scale, Side.BOTTOM, EdgeType.FRONT, handTileClick)
            tileView.render()
            gameObjects.push(tileView)

            posX += tileView.bounds.width + TILE_OFFSET
            actualWidth += tileView.bounds.width + TILE_OFFSET
        })

        posX += -TILE_OFFSET + DRAW_TILE_OFFSET
        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.BOTTOM) {
            const tileView = new TileView(context, gameState.currentTurn.drawTile, posX, posY, scale, Side.BOTTOM, EdgeType.FRONT, drawTileClick)
            tileView.render()
            gameObjects.push(tileView)

            actualWidth += tileView.bounds.width + DRAW_TILE_OFFSET -TILE_OFFSET
            console.log(actualWidth, posX + tileView.bounds.width - x)
        }
    }

    static render(context: Context, width: number, height: number): CanvasObject[] {
        const gameObjects: CanvasObject[] = []
        const gameState = MahjongService.instance.gameState

        const table = new TableView(context, width, height)
        gameObjects.push(table)
        table.render()

        if (gameState !== undefined) {
            const maxSizeToDrawTilesOnly = Math.min(width, height) - SCREEN_OFFSET * 2 - TILE_OFFSET * 12 - DRAW_TILE_OFFSET
            const max_scale = maxSizeToDrawTilesOnly / TILE_SIDE_B / 14
            const min_scale = max_scale * OTHER_HANDS_SCALE_PERCENT

            const bottomHandMaxSize = max_scale * TILE_SIDE_B * 14 + TILE_OFFSET * 12 + DRAW_TILE_OFFSET
            const otherHandsMaxSize = bottomHandMaxSize * OTHER_HANDS_SCALE_PERCENT

            const topHandX = Math.floor((width - otherHandsMaxSize) / 2)
            TableContainer.renderTop(context, gameState, gameObjects, topHandX, SCREEN_OFFSET, min_scale)

            const leftRightHandY = Math.floor((height - otherHandsMaxSize) / 2)
            TableContainer.renderLeft(context, gameState, gameObjects, SCREEN_OFFSET, leftRightHandY, min_scale)
            TableContainer.renderRight(context, gameState, gameObjects, width, SCREEN_OFFSET, leftRightHandY, min_scale)

            const bottomHandX = Math.floor((width - bottomHandMaxSize) / 2)
            TableContainer.renderBottom(context, gameState, gameObjects, height, bottomHandX, SCREEN_OFFSET, max_scale)
        }

        return gameObjects
    }
}