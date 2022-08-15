import { CanvasObject } from '../../../core/CanvasObject'
import { Context } from '../../../core/Context'
import { TableView } from '../../components/table/TableView'
import { MahjongService } from '../../../services/mahjong/MahjongService'
import { TileView } from '../../components/tile/TileView'
import { Side } from '../../../core/game-types/Side'
import { EdgeType } from '../../components/tile/EdgeType'
import { GameState } from '../../../services/mahjong/IMahjongService'
import { TILE_SIDE_B } from '../../components/tile/consts'
import { getTileSize } from '../../components/tile/getTileSize'
import { Discard } from '../../../core/game-types/Discard'
import { drawRoundRect } from '../../../utils/drawing/roundRect'
import { colors } from '../../../../design-tokens/colors'
import { Rectangle } from '../../../core/Rectangle'

const TILE_OFFSET = 2
const DRAW_TILE_OFFSET = 8
const SCREEN_OFFSET = 10

const OTHER_HANDS_SCALE_PERCENT = 0.8

export class TableContainer {
    private static renderTop(
        context: Context,
        gameState: GameState,
        gameObjects: CanvasObject[],
        endX: number,
        y: number,
        scale: number
    ): void {
        const edgeType = EdgeType.FRONT
        const [width] = getTileSize(Side.TOP, edgeType, scale)
        let posX = endX - width

        gameState.hands[Side.TOP].tiles.forEach(tile => {
            const tileView = new TileView(context, tile, posX, y, scale, Side.TOP, edgeType)
            tileView.render()
            gameObjects.push(tileView)

            posX -= width + TILE_OFFSET
        })

        posX -= DRAW_TILE_OFFSET - TILE_OFFSET

        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.TOP) {
            const tileView = new TileView(
                context,
                gameState.currentTurn.drawTile,
                posX,
                y,
                scale,
                Side.TOP,
                edgeType,
                drawTileClick
            )
            tileView.render()
            gameObjects.push(tileView)
        }
    }

    private static renderLeft(
        context: Context,
        gameState: GameState,
        gameObjects: CanvasObject[],
        x: number,
        y: number,
        scale: number
    ): void {
        const edgeType = EdgeType.FRONT
        let posY = y
        gameState.hands[Side.LEFT].tiles.forEach(tile => {
            const tileView = new TileView(context, tile, x, posY, scale, Side.LEFT, edgeType)
            tileView.render()
            gameObjects.push(tileView)

            posY += tileView.bounds.height + TILE_OFFSET
        })

        posY += -TILE_OFFSET + DRAW_TILE_OFFSET
        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.LEFT) {
            const tileView = new TileView(
                context,
                gameState.currentTurn.drawTile,
                x,
                posY,
                scale,
                Side.LEFT,
                edgeType,
                drawTileClick
            )
            tileView.render()
            gameObjects.push(tileView)
        }
    }

    private static renderRight(
        context: Context,
        gameState: GameState,
        gameObjects: CanvasObject[],
        screenWidth: number,
        rightSideOffset: number,
        endY: number,
        scale: number
    ): void {
        const edgeType = EdgeType.FRONT
        const [width, height] = getTileSize(Side.RIGHT, edgeType, scale)
        const posX = screenWidth - rightSideOffset - width

        let posY = endY - height

        gameState.hands[Side.RIGHT].tiles.forEach(tile => {
            const tileView = new TileView(context, tile, posX, posY, scale, Side.RIGHT, edgeType)
            tileView.render()
            gameObjects.push(tileView)

            posY -= height + TILE_OFFSET
        })

        posY -= DRAW_TILE_OFFSET - TILE_OFFSET

        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.RIGHT) {
            const tileView = new TileView(
                context,
                gameState.currentTurn.drawTile,
                posX,
                posY,
                scale,
                Side.RIGHT,
                edgeType,
                drawTileClick
            )
            tileView.render()
            gameObjects.push(tileView)
        }
    }

    private static renderBottom(
        context: Context,
        gameState: GameState,
        gameObjects: CanvasObject[],
        screenHeight: number,
        x: number,
        bottomSideOffset: number,
        scale: number
    ): void {
        const edgeType = EdgeType.FRONT
        const [, height] = getTileSize(Side.BOTTOM, edgeType, scale)
        const posY = screenHeight - bottomSideOffset - height

        let posX = x
        gameState.hands[Side.BOTTOM].tiles.forEach(tile => {
            const handTileClick = () => MahjongService.instance.handTileClick(tile)
            const tileView = new TileView(
                context,
                tile,
                posX,
                posY,
                scale,
                Side.BOTTOM,
                edgeType,
                handTileClick
            )
            tileView.render()
            gameObjects.push(tileView)

            posX += tileView.bounds.width + TILE_OFFSET
        })

        posX += -TILE_OFFSET + DRAW_TILE_OFFSET
        const drawTileClick = MahjongService.instance.drawTileClick.bind(MahjongService.instance)
        if (gameState.currentTurn.side === Side.BOTTOM) {
            const tileView = new TileView(
                context,
                gameState.currentTurn.drawTile,
                posX,
                posY,
                scale,
                Side.BOTTOM,
                edgeType,
                drawTileClick
            )
            tileView.render()
            gameObjects.push(tileView)
        }
    }

    private static renderDiscard(
        context: Context,
        gameObjects: CanvasObject[],
        startX: number,
        startY: number,
        xOffset: number,
        yOffset: number,
        discard: Discard,
        side: Side,
        scale: number
    ): void {
        const isHorizontalSide = [Side.TOP, Side.BOTTOM].includes(side)

        let posX = startX
        let posY = startY

        discard.tiles.forEach((tile, index) => {
            const tileView = new TileView(context, tile, posX, posY, scale, side, EdgeType.FRONT)
            tileView.render()
            gameObjects.push(tileView)

            if (index === 5 || index === 11) {
                // new line
                if (isHorizontalSide) {
                    posX = startX
                    posY += yOffset
                } else {
                    posY = startY
                    posX += xOffset
                }
            } else {
                if (isHorizontalSide) {
                    posX += xOffset
                } else {
                    posY += yOffset
                }
            }
        })
    }

    private static renderCenter(
        context: Context,
        gameObjects: CanvasObject[],
        gameState: GameState,
        screenWidth: number,
        screenHeight: number,
        tileScale: number
    ): void {
        const edgeType = EdgeType.FRONT
        const [minTileSide, maxTileSide] = getTileSize(Side.BOTTOM, edgeType, tileScale)
        const discardSize = Math.min(minTileSide) * 6 + 5 * TILE_OFFSET

        const centerPanelX = (screenWidth - discardSize) / 2
        const centerPanelY = (screenHeight - discardSize) / 2
        drawRoundRect(
            context,
            colors.mahjongCenterPanel,
            new Rectangle(centerPanelX, centerPanelY, discardSize, discardSize),
            4
        )

        context.font = '48px serif'
        context.textBaseline = 'middle'
        const tilesLeft = gameState.liveWall.length.toString()
        const textObj = context.measureText(tilesLeft)
        context.fillStyle = colors.mahjongCenterText
        context.fillText(tilesLeft, (screenWidth - textObj.width) / 2, screenHeight / 2)

        const minTileSideOffset = minTileSide + TILE_OFFSET
        const maxTileSideOffset = maxTileSide + TILE_OFFSET

        const topX = centerPanelX + discardSize - minTileSide
        const topY = centerPanelY - maxTileSide
        TableContainer.renderDiscard(
            context,
            gameObjects,
            topX,
            topY,
            -minTileSideOffset,
            -maxTileSideOffset,
            gameState.discards[Side.TOP],
            Side.TOP,
            tileScale
        )

        const leftX = centerPanelX - maxTileSide
        TableContainer.renderDiscard(
            context,
            gameObjects,
            leftX,
            centerPanelY,
            -maxTileSideOffset,
            minTileSideOffset,
            gameState.discards[Side.LEFT],
            Side.LEFT,
            tileScale
        )

        const rightX = centerPanelX + discardSize
        const rightY = centerPanelY + discardSize - minTileSide
        TableContainer.renderDiscard(
            context,
            gameObjects,
            rightX,
            rightY,
            maxTileSideOffset,
            -minTileSideOffset,
            gameState.discards[Side.RIGHT],
            Side.RIGHT,
            tileScale
        )

        const bottomY = centerPanelY + discardSize
        TableContainer.renderDiscard(
            context,
            gameObjects,
            centerPanelX,
            bottomY,
            minTileSideOffset,
            maxTileSideOffset,
            gameState.discards[Side.BOTTOM],
            Side.BOTTOM,
            tileScale
        )
    }

    static render(context: Context, width: number, height: number): CanvasObject[] {
        const gameObjects: CanvasObject[] = []
        const gameState = MahjongService.instance.gameState

        const table = new TableView(context, width, height)
        gameObjects.push(table)
        table.render()

        if (gameState !== undefined) {
            const maxSizeToDrawTilesOnly =
                Math.min(width, height) - SCREEN_OFFSET * 2 - TILE_OFFSET * 12 - DRAW_TILE_OFFSET
            const bottomSideScale = maxSizeToDrawTilesOnly / TILE_SIDE_B / 14
            const otherTilesScale = bottomSideScale * OTHER_HANDS_SCALE_PERCENT

            const bottomHandMaxSize =
                bottomSideScale * TILE_SIDE_B * 14 + TILE_OFFSET * 12 + DRAW_TILE_OFFSET
            const otherHandsMaxSize = bottomHandMaxSize * OTHER_HANDS_SCALE_PERCENT

            const topHandX = Math.floor((width + otherHandsMaxSize) / 2)
            TableContainer.renderTop(
                context,
                gameState,
                gameObjects,
                topHandX,
                SCREEN_OFFSET,
                otherTilesScale
            )

            const leftHandY = Math.floor((height - otherHandsMaxSize) / 2)
            TableContainer.renderLeft(
                context,
                gameState,
                gameObjects,
                SCREEN_OFFSET,
                leftHandY,
                otherTilesScale
            )

            const rightHandY = Math.floor((height + otherHandsMaxSize) / 2)
            TableContainer.renderRight(
                context,
                gameState,
                gameObjects,
                width,
                SCREEN_OFFSET,
                rightHandY,
                otherTilesScale
            )

            const bottomHandX = Math.floor((width - bottomHandMaxSize) / 2)
            TableContainer.renderBottom(
                context,
                gameState,
                gameObjects,
                height,
                bottomHandX,
                SCREEN_OFFSET,
                bottomSideScale
            )

            this.renderCenter(context, gameObjects, gameState, width, height, otherTilesScale)
        }

        return gameObjects
    }
}
