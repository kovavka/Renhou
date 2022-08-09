import {GameState, IMahjongService} from "./IMahjongService";
import {Hand} from "../../core/game-types/Hand";
import {DeadWallTile} from "../../core/game-types/DeadWallTile";
import {generateWall} from "../../utils/tile/wallGenerator";
import {Side} from "../../core/game-types/Side";
import {GameTurn} from "../../core/game-types/GameTurn";
import {DrawTile} from "../../core/game-types/DrawTile";
import {sortTiles} from "../../utils/tile/sortTiles";
import {getNextSide} from "../../utils/tile/prevNextSide";
import signals from "signals";
import {Tile} from "../../core/game-types/Tile";

export class MahjongServiceImpl implements IMahjongService {
    gameState: GameState | undefined

    stateChanged: signals.Signal<GameState> = new signals.Signal()

    start(): void {
        this.initState()

        console.log('turn', Side[this.gameState?.currentTurn.side ?? 8])

        setTimeout(() => {
            this.tryRunBotTurn()
        }, 1000)
    }

    handTileClick(tile: Tile): void {
        if (this.gameState === undefined) {
            return
        }

        const {currentTurn, liveWall, bottomHand} = this.gameState
        const {side, drawTile} = currentTurn

        if (side !== Side.BOTTOM || liveWall.length === 0) {
            // we can highlight tile here
            return
        }
        bottomHand.tiles = bottomHand.tiles.filter(x => x !== tile)
        bottomHand.tiles.push(drawTile)
        bottomHand.tiles = sortTiles(bottomHand.tiles)

        this.gameState.currentTurn = this.prepareNextTurn(side, liveWall)
        this.stateChanged.dispatch(this.gameState)

        this.tryRunBotTurn()
    }

    drawTileClick(): void {
        if (this.gameState === undefined) {
            return
        }

        const {currentTurn, liveWall} = this.gameState
        const {side} = currentTurn

        if (side !== Side.BOTTOM || liveWall.length === 0) {
            // we can highlight tile here
            return
        }

        this.gameState.currentTurn = this.prepareNextTurn(side, liveWall)
        this.stateChanged.dispatch(this.gameState)

        this.tryRunBotTurn()
    }

    private prepareNextTurn(side: Side, liveWall: Tile[]): GameTurn {
        return {
            side: getNextSide(side),
            discard: undefined,
            riichiAttempt: false,
            drawTile: {
                ...liveWall.shift()!,
                fromDeadWall: false,
            },
        }
    }

    private tryRunBotTurn() {
        if (this.gameState === undefined) {
            return
        }

        const {currentTurn, liveWall} = this.gameState
        const {side} = currentTurn
        if (side !== Side.BOTTOM && liveWall.length !== 0) {
            this.gameState.currentTurn = this.prepareNextTurn(side, liveWall)

            console.log('turn', Side[this.gameState?.currentTurn.side ?? 8])

            this.stateChanged.dispatch(this.gameState)

            setTimeout(() => {
                this.tryRunBotTurn()
            }, 5000)
        }
    }

    private initState(): void {
        const wall = generateWall()

        const bottomTiles = wall.splice(0, 13)
        const leftTiles = wall.splice(0, 13)
        const rightTiles = wall.splice(0, 13)
        const topTiles = wall.splice(0, 13)

        const bottomHand: Hand = {
            tiles: sortTiles(bottomTiles),
            openMelds: [],
            riichi: false,
        }
        const leftHand: Hand = {
            tiles: sortTiles(leftTiles),
            openMelds: [],
            riichi: false,
        }
        const rightHand: Hand = {
            tiles: sortTiles(rightTiles),
            openMelds: [],
            riichi: false,
        }
        const topHand: Hand = {
            tiles: sortTiles(topTiles),
            openMelds: [],
            riichi: false,
        }

        const dealerSide = Math.floor(Math.random() * 4) as Side

        const drawTile: DrawTile = {
            ...wall.shift()!,
            fromDeadWall: false,
        }

        const currentTurn: GameTurn = {
            side: dealerSide,
            discard: undefined,
            riichiAttempt: false,
            drawTile,
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
        this.stateChanged.dispatch(this.gameState)
    }
}