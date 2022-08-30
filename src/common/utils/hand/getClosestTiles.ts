import { Tile } from '../../core/game-types/Tile'
import { SuitType } from '../../core/game-types/SuitType'

export function getClosestTiles(tile: Tile): Tile[] {
    if (tile.type === SuitType.JIHAI) {
        return []
    }

    const tilesToImprove: Tile[] = []

    if (tile.value >= 3) {
        // kanchan 3_1
        tilesToImprove.push({
            type: tile.type,
            value: tile.value - 2,
        })
    }

    if (tile.value >= 2) {
        // ryanmen _32_
        // penchan 21_
        tilesToImprove.push({
            type: tile.type,
            value: tile.value - 1,
        })
    }

    if (tile.value <= 8) {
        // ryanmen _78_
        // penchan _89
        tilesToImprove.push({
            type: tile.type,
            value: tile.value + 1,
        })
    }

    if (tile.value <= 7) {
        // kanchan 7_9
        tilesToImprove.push({
            type: tile.type,
            value: tile.value + 2,
        })
    }

    return tilesToImprove
}
