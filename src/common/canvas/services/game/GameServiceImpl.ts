import {GameState, IGameService} from "./IGameService";
import {Hand} from "../../core/game-types/Hand";
import {DeadWallTile} from "../../core/game-types/DeadWallTile";
import {generateWall} from "../../utils/generator/wallGenerator";
import {Side} from "../../core/game-types/Side";
import {GameTurn} from "../../core/game-types/GameTurn";
import {DrawTile} from "../../core/game-types/DrawTile";

export class GameServiceImpl implements IGameService {
    gameState: GameState | undefined

    start(): void {
        this.initState()

    }

    private initState(): void {
        const wall = generateWall()

        const bottomTiles = wall.splice(0, 13)
        const leftTiles = wall.splice(0, 13)
        const rightTiles = wall.splice(0, 13)
        const topTiles = wall.splice(0, 13)

        const bottomHand: Hand = {
            tiles: bottomTiles,
            openMelds: [],
            drawTile: undefined,
            riichi: false,
        }
        const leftHand: Hand = {
            tiles: leftTiles,
            openMelds: [],
            drawTile: undefined,
            riichi: false,
        }
        const rightHand: Hand = {
            tiles: rightTiles,
            openMelds: [],
            drawTile: undefined,
            riichi: false,
        }
        const topHand: Hand = {
            tiles: topTiles,
            openMelds: [],
            drawTile: undefined,
            riichi: false,
        }

        const dealerSide = Math.floor(Math.random() * 5) as Side

        const currentTurn: GameTurn = {
            side: dealerSide,
            discard: undefined,
            riichiAttempt: false,
        }

        const drawTile: DrawTile = {
            ...wall.shift()!,
            fromDeadWall: false,
        }

        switch (dealerSide) {
            case Side.BOTTOM:
                bottomHand.drawTile = drawTile
                break
            case Side.RIGHT:
                rightHand.drawTile = drawTile
                break
            case Side.TOP:
                topHand.drawTile = drawTile
                break
            case Side.LEFT:
                leftHand.drawTile = drawTile
                break
        }

        const tilesForDeadWall = wall.splice(0, 14)
        const deadWall: DeadWallTile[] = tilesForDeadWall.map((value, index) => ({
            ...value,
            isHidden: index !== 5
        }))

        const replacementTiles = deadWall.slice(0, 4)


        this.gameState = {
            liveWall: wall,
            deadWall,
            replacementTiles,
            bottomHand,
            leftHand,
            rightHand,
            topHand,
            bottomDiscard: {
                tiles: [],
                riichiTile: undefined,
            },
            leftDiscard: {
                tiles: [],
                riichiTile: undefined,
            },
            rightDiscard: {
                tiles: [],
                riichiTile: undefined,
            },
            topDiscard: {
                tiles: [],
                riichiTile: undefined,
            },

            currentDealer: dealerSide,
            currentTurn,
        }
    }
}