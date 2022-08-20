import { GameState, IMahjongService } from './IMahjongService'
import { Side } from '../../core/game-types/Side'
import { sortTiles } from '../../utils/game/sortTiles'
import { getNextSide } from '../../utils/game/prevNextSide'
import signals from 'signals'
import { Tile } from '../../core/game-types/Tile'
import { generateNewGame } from './utils/generateNewGame'
import { IBotPlayer } from './bot-players/IBotPlayer'
import { EasyBotPlayer } from './bot-players/EasyBotPlayer'
import { excludeTiles } from '../../utils/tiles/tileContains'
import { isAgari } from '../../utils/hand/isAgari'

const BOT_THINKING_TIMEOUT = 1000

export class MahjongServiceImpl implements IMahjongService {
    gameState: GameState | undefined

    stateChanged: signals.Signal<GameState> = new signals.Signal()

    private botPlayers: { [side in Side]: IBotPlayer | undefined } = {
        [Side.TOP]: new EasyBotPlayer(),
        [Side.LEFT]: new EasyBotPlayer(),
        [Side.RIGHT]: new EasyBotPlayer(),
        [Side.BOTTOM]: undefined,
    }

    start(): void {
        const newState = generateNewGame()

        this.botPlayers[Side.TOP]?.setHand(newState.hands[Side.TOP])
        this.botPlayers[Side.LEFT]?.setHand(newState.hands[Side.LEFT])
        this.botPlayers[Side.RIGHT]?.setHand(newState.hands[Side.RIGHT])

        this.updateState(newState)

        this.tryRunBotTurn(newState)
    }

    handTileClick(tile: Tile): void {
        const { gameState } = this
        if (gameState === undefined) {
            return
        }

        const {
            currentTurn: { side },
        } = gameState

        if (side !== Side.BOTTOM) {
            // we can highlight tile here
            return
        }

        const newState = this.discardTileFromHand(gameState, tile)
        this.finishTurn(newState)
    }

    drawTileClick(): void {
        const { gameState } = this
        if (gameState === undefined) {
            return
        }

        const { currentTurn } = gameState
        const { side } = currentTurn

        if (side !== Side.BOTTOM) {
            // we can highlight tile here
            return
        }

        const newState = this.discardDrawTile(gameState)

        this.finishTurn(newState)
    }

    private finishTurn(gameState: GameState) {
        // todo check if bot wants to make a call

        if (gameState.liveWall.length === 0) {
            // finish game
            return
        }

        const newState = this.moveTurnToNext(gameState)

        this.updateState(newState)

        this.tryRunBotTurn(newState)
    }

    private moveTurnToNext(gameState: GameState): GameState {
        const { side, riichiAttempt, discardTile } = gameState.currentTurn
        const sideDiscard = gameState.discards[side]

        return {
            ...gameState,
            liveWall: gameState.liveWall.slice(1),
            discards: {
                ...gameState.discards,
                [side]: {
                    ...sideDiscard,
                    tiles: [...sideDiscard.tiles, discardTile],
                    riichiTile: sideDiscard.riichiTile || riichiAttempt,
                },
            },
            currentTurn: {
                side: getNextSide(side),
                discardTile: undefined,
                riichiAttempt: false,
                drawTile: {
                    ...gameState.liveWall[0],
                    fromDeadWall: false,
                },
            },
        }
    }

    private tryRunBotTurn(gameState: GameState) {
        const { currentTurn, hands } = gameState
        const { side, drawTile } = currentTurn
        const botPlayer = this.botPlayers[side]
        if (botPlayer !== undefined) {
            const hand = hands[side]
            if (isAgari(hand.tiles, drawTile)) {
                // todo add agari for user + ron for bots

                // todo finish round
                console.log('tsumo', Side[side])
                return
            }

            const tileToDiscard = botPlayer.chooseTile(drawTile)
            const newState =
                tileToDiscard === undefined
                    ? this.discardDrawTile(gameState)
                    : this.discardTileFromHand(gameState, tileToDiscard)

            setTimeout(() => {
                this.finishTurn(newState)
            }, BOT_THINKING_TIMEOUT)
        }
    }

    private updateState(gameState: GameState) {
        console.log(gameState)
        this.gameState = gameState
        this.stateChanged.dispatch(gameState)
    }

    private discardTileFromHand(gameState: GameState, tile: Tile): GameState {
        const { currentTurn, hands } = gameState
        const { side, drawTile } = currentTurn

        const currentHand = hands[side]

        const newHandTiles = excludeTiles(currentHand.tiles, tile)
        newHandTiles.push({
            type: drawTile.type,
            value: drawTile.value,
        })

        const newHand = {
            ...currentHand,
            tiles: sortTiles(newHandTiles),
        }

        const botPlayer = this.botPlayers[side]
        if (botPlayer !== undefined) {
            botPlayer.setHand(newHand)
        }

        return {
            ...gameState,
            hands: {
                ...hands,
                [side]: newHand,
            },
            currentTurn: {
                ...currentTurn,
                discardTile: {
                    ...tile,
                    justDrawn: false,
                },
            },
        }
    }

    private discardDrawTile(gameState: GameState): GameState {
        const { currentTurn } = gameState
        const { drawTile } = currentTurn

        return {
            ...gameState,
            currentTurn: {
                ...currentTurn,
                discardTile: {
                    type: drawTile.type,
                    value: drawTile.value,
                    justDrawn: false,
                },
            },
        }
    }
}
