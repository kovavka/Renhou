import { Tile } from '../../game-types/Tile'
import { getHandStructureVariants } from './getHandStructureVariants'
import { hasTiles, isTheSameTile } from '../tiles/tileContains'
import { getChiitoiInfo } from './getChiitoiInfo'
import { getKokushiMusoInfo } from './getKokushiMusoInfo'

// todo check yaku
export function isAgari(handTiles: Tile[], tile: Tile): boolean {
    if (
        handTiles.length !== 1 &&
        handTiles.length !== 4 &&
        handTiles.length !== 7 &&
        handTiles.length !== 10 &&
        handTiles.length !== 13
    ) {
        return false
    }

    const kokushiMusoInfo = getKokushiMusoInfo(handTiles)
    if (kokushiMusoInfo !== undefined && kokushiMusoInfo.shanten === 0) {
        return hasTiles(kokushiMusoInfo.tilesToImprove, tile)
    }

    const chiitoiInfo = getChiitoiInfo(handTiles)
    // it could be chiitoi or ryanpeiko with ryanmen wait
    if (
        chiitoiInfo !== undefined &&
        chiitoiInfo.shanten === 0 &&
        hasTiles(chiitoiInfo.singleTiles, tile)
    ) {
        return true
    }

    const variants = getHandStructureVariants(handTiles)
    return variants.some(info => {
        if (info.minShanten !== 0) {
            return false
        }

        return info.groupingVariants.some(groupingInfo => {
            if (groupingInfo.shanten !== 0) {
                return false
            }

            const { waits } = groupingInfo
            return waits.some(x => isTheSameTile(x, tile))
        })
    })
}
