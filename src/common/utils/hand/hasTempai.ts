import { Tile } from '../../core/game-types/Tile'
import { getHandStructureVariants } from './getHandStructureVariants'
import { hasIdenticalTiles } from '../tiles/tileContains'
import { getChiitoiInfo } from './getChiitoiInfo'
import { getKokushiMusoInfo } from './getKokushiMusoInfo'

export function hasTempai(tiles: Tile[]): boolean {
    if (
        tiles.length !== 1 &&
        tiles.length !== 4 &&
        tiles.length !== 7 &&
        tiles.length !== 10 &&
        tiles.length !== 13
    ) {
        return false
    }

    const chiitoiInfo = getChiitoiInfo(tiles)
    if (chiitoiInfo !== undefined && chiitoiInfo.shanten === 0) {
        return true
    }

    const kokushiMusoInfo = getKokushiMusoInfo(tiles)
    if (kokushiMusoInfo !== undefined && kokushiMusoInfo.shanten === 0) {
        return true
    }

    const variants = getHandStructureVariants(tiles)
    return variants.some(info => {
        if (info.minShanten !== 0) {
            return false
        }

        return info.groupingVariants.some(groupingInfo => {
            if (groupingInfo.shanten !== 0) {
                return false
            }

            const { waits } = groupingInfo
            // it's not a tempai when the only wait is the 5th tile, and we have all 4 in the hand
            if (waits.length === 1 && hasIdenticalTiles(tiles, waits[0], 4)) {
                return false
            }

            return true
        })
    })
}
