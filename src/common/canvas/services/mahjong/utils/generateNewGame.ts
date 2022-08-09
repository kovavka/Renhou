import {GameState} from "../IMahjongService";
import {generateWall} from "../../../utils/tile/wallGenerator";
import {Hand} from "../../../core/game-types/Hand";
import {sortTiles} from "../../../utils/tile/sortTiles";
import {Side} from "../../../core/game-types/Side";
import {DrawTile} from "../../../core/game-types/DrawTile";
import {GameTurn} from "../../../core/game-types/GameTurn";
import {DeadWallTile} from "../../../core/game-types/DeadWallTile";

export function generateNewGame(): GameState {
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


    return {
        liveWall: wall,
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
    }
}