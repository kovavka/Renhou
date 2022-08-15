import { Tile } from '../../core/game-types/Tile'
import { groupIdenticalTiles } from '../tiles/groupIdenticalTiles'

export type ChiitoiInfo = {
    /**
     * groups of 2, 3 or 4 identical tiles
     */
    groups: Tile[]

    /**
     * tiles player can improve or replace
     */
    singleTiles: Tile[]

    /**
     * tiles cannot be upgraded to group because player has 2-3 its duplicates
     * (according to rules, chiitoi can contain only different pairs)
     */
    tilesToDiscard: Tile[]

    shanten: number
}

const MAX_PAIRS_NUMBER = 6

export function getChiitoiInfo(allTiles: Tile[]): ChiitoiInfo | undefined {
    if (allTiles.length !== 13) {
        return undefined
    }

    const tilesToDiscard: Tile[] = []
    const singleTiles: Tile[] = []

    // group of 4 affect shanten, because we have to discard 2 tiles for each group
    let groupsOf4Count = 0

    // group of 3 affect shanten when its number > 1, because we have to discard 1 tiles for each group.
    // We also could replace it to a tile without pair we already have
    let groupsOf3Count = 0

    const groups: Tile[] = []
    groupIdenticalTiles(allTiles).forEach(({ tile, count }) => {
        switch (count) {
            case 1:
                singleTiles.push(tile)
                break
            case 2:
                groups.push(tile)
                break
            case 3:
                groups.push(tile)
                tilesToDiscard.push(tile)
                groupsOf3Count++
                break
            case 4:
                groups.push(tile)
                tilesToDiscard.push(tile)
                groupsOf4Count++
                break
            default:
                throw new Error('Impossible number of identical tiles')
        }
    })

    const tilesToDiscardSize = groupsOf3Count + groupsOf4Count * 2

    // in order to get tempai we need to replace 3rd and 4th tiles to something else.
    // if we have enough single tiles we will replace it to one of those and make a pair at once
    // otherwise we need to draw something different and get a pair in another turn
    const tooMuchTilesToDiscard =
        tilesToDiscardSize !== 0 && tilesToDiscardSize >= singleTiles.length

    const baseShantenCount = MAX_PAIRS_NUMBER - groups.length
    // in most cases tilesToDiscardSize and baseShantenCount would be the same,
    // but it's better to keep it this way to not make the condition more complicated
    const shantenCount = tooMuchTilesToDiscard ? tilesToDiscardSize : baseShantenCount

    return {
        groups,
        singleTiles,
        tilesToDiscard,
        shanten: shantenCount,
    }
}
