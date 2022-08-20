import { generateWall } from '../../../utils/game/wallGenerator'
import { sortTiles } from '../../../utils/game/sortTiles'
import { DeadWallTile } from '../../../core/game-types/DeadWallTile'
import { DrawTile } from '../../../core/game-types/DrawTile'
import { Tile } from '../../../core/game-types/Tile'

export type RoundState = {
    liveWall: Tile[]
    deadWall: DeadWallTile[]
    replacementTiles: Tile[]

    topTiles: Tile[]
    leftTiles: Tile[]
    rightTiles: Tile[]
    bottomTiles: Tile[]

    firstDrawTile: DrawTile
}

export function generateNewRound(): RoundState {
    const wall = generateWall()

    const bottomTiles = wall.splice(0, 13)
    const leftTiles = wall.splice(0, 13)
    const rightTiles = wall.splice(0, 13)
    const topTiles = wall.splice(0, 13)

    const drawTile: DrawTile = {
        ...wall.shift()!,
        fromDeadWall: false,
    }

    const tilesForDeadWall = wall.splice(0, 14)
    const deadWall: DeadWallTile[] = tilesForDeadWall.map((value, index) => ({
        ...value,
        isHidden: index !== 5,
    }))

    const replacementTiles = deadWall.slice(0, 4)

    return {
        liveWall: wall,
        deadWall,
        replacementTiles,
        topTiles: sortTiles(topTiles),
        leftTiles: sortTiles(leftTiles),
        rightTiles: sortTiles(rightTiles),
        bottomTiles: sortTiles(bottomTiles),
        firstDrawTile: drawTile,
    }
}
