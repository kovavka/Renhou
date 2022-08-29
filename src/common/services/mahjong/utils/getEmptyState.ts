import { GameState } from '../state/GameState'
import { Side } from '../../../game-types/Side'
import { generateNewRound } from './generateNewRound'
import { GameTurn } from '../../../game-types/GameTurn'
import { Hand } from '../../../game-types/Hand'

export function getEmptyState(
    dealerSide: Side
): Omit<GameState, 'wind' | 'riichi' | 'renchan' | 'round'> {
    const {
        liveWall,
        deadWall,
        replacementTiles,
        firstDrawTile,
        topTiles,
        rightTiles,
        leftTiles,
        bottomTiles,
    } = generateNewRound()

    const currentTurn: GameTurn = {
        side: dealerSide,
        discardTile: undefined,
        riichiAttempt: false,
        drawTile: firstDrawTile,
    }

    const bottomHand: Hand = {
        tiles: bottomTiles,
        openMelds: [],
        riichi: false,
    }
    const leftHand: Hand = {
        tiles: leftTiles,
        openMelds: [],
        riichi: false,
    }
    const rightHand: Hand = {
        tiles: rightTiles,
        openMelds: [],
        riichi: false,
    }
    const topHand: Hand = {
        tiles: topTiles,
        openMelds: [],
        riichi: false,
    }

    return {
        liveWall,
        deadWall,
        replacementTiles,
        hands: {
            [Side.TOP]: topHand,
            [Side.LEFT]: leftHand,
            [Side.RIGHT]: rightHand,
            [Side.BOTTOM]: bottomHand,
        },
        discards: {
            [Side.TOP]: {
                tiles: [],
                riichiTile: undefined,
            },
            [Side.LEFT]: {
                tiles: [],
                riichiTile: undefined,
            },
            [Side.RIGHT]: {
                tiles: [],
                riichiTile: undefined,
            },
            [Side.BOTTOM]: {
                tiles: [],
                riichiTile: undefined,
            },
        },
        currentDealer: dealerSide,
        currentTurn,
        outcome: undefined,
    }
}
