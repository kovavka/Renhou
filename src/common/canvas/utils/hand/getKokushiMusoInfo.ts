import { Tile } from '../../core/game-types/Tile'
import { getIdenticalTileCount, getUniqueTiles } from '../tiles/tileContains'
import { isTerminalOrHonorTile } from '../tiles/isTerminalOrHonorTile'
import { getTerimalAndHonors } from './getTerimalAndHonors'

export type KokushiMusoInfo = {
    shanten: number

    /**
     * all terminals and honors + pair for one if we don't have it yet
     */
    tilesToImprove: Tile[]

    /**
     * tiles cannot be upgraded to group because player has 2-3 its duplicates
     * (according to rules, chiitoi can contain only different pairs)
     */
    tilesToDiscard: Tile[]
}

export function getKokushiMusoInfo(allTiles: Tile[]): KokushiMusoInfo | undefined {
    if (allTiles.length !== 13) {
        return undefined
    }

    // only unique
    const missingTiles: Tile[] = []

    const orphansWithoutPair: Tile[] = []

    // groups of 2, 3 and 4
    const identicalGroups: Tile[] = []

    // number of additional tile we have for unique orphans
    // e.g. for 11m333p it wil be 3
    let duplicatesCount = 0

    const allTerimalAndHonors = getTerimalAndHonors()

    allTerimalAndHonors.forEach(tile => {
        const count = getIdenticalTileCount(allTiles, tile)
        if (count === 0) {
            missingTiles.push(tile)
        }

        if (count === 1) {
            orphansWithoutPair.push(tile)
        }

        if (count >= 2) {
            identicalGroups.push(tile)

            duplicatesCount += count - 1
        }
    })

    if (duplicatesCount === 0 && orphansWithoutPair.length === 13) {
        // we don't have a pair, but we do have all 13 orphans -> tempai with 13 waits (any terminal or honor)
        return {
            tilesToImprove: allTerimalAndHonors,
            tilesToDiscard: [],
            shanten: 0,
        }
    }

    if (duplicatesCount === 1 && orphansWithoutPair.length === 11) {
        // we do have a pair, but we have only 12 orphans in hand -> tempai with the only wait to the missing tile
        return {
            tilesToImprove: missingTiles,
            tilesToDiscard: [],
            shanten: 0,
        }
    }

    const redundantTiles = getUniqueTiles(allTiles.filter(tile => !isTerminalOrHonorTile(tile)))

    if (duplicatesCount === 0) {
        // we don't have all terminals or honors AND we don't have pair.
        // we might have redundant tiles or/and too much groups of 2/3/4 tiles

        // 1. when we get all missing it will be 13 orphans -> tempai,
        // 2. or it will be (<number of missing tiles> - 1) tiles from tiles we are lack of
        //    + we need to get pair (+1) to wait for 1 left tile when we have tempai
        const shanten = missingTiles.length
        return {
            tilesToImprove: allTerimalAndHonors, // we need a pair anyway
            tilesToDiscard: redundantTiles,
            shanten,
        }
    }

    // otherwise we don't have all terminals or honors, but we do have at least 1 pair

    const tilesToDiscard = redundantTiles.slice()

    if (duplicatesCount > 1) {
        // we have too much identical groups (> 1 group of 2/3/4) and need to discard some to have only one pair;
        // or we have 1 group of 3 or 4 and need to make it pair
        identicalGroups.forEach(tile => {
            tilesToDiscard.push(tile)
        })
    }

    // if we have a pair, we need to get (<number of missing tiles> - 1) tiles for tempai,
    // if don't, <number of missing tiles> would be enough
    const shanten = missingTiles.length + (duplicatesCount >= 1 ? -1 : 0)
    return {
        tilesToImprove: missingTiles.slice(),
        tilesToDiscard: tilesToDiscard,
        shanten,
    }
}
