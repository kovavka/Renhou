import { Tile } from '../../core/game-types/Tile'
import { SuitType } from '../../core/game-types/SuitType'
import { getUniqueTiles } from '../tiles/tileContains'
import { getBaseShantenCount } from './getBaseShantenCount'
import { MeldVariant, splitHand, splitToGroups } from './splitHand'

// todo calculate most useless tile in hand by hand + draw tile

type NextDrawInfo = {
    /**
     * tiles player can get to decrease shanten
     */
    improvements: Tile[]

    /**
     * todo remove?
     * useful tiles player can get without shanten changing,
     * not including actual improvements.
     * e.g. all connector for separated tile when don't need to improve it to group (23456 for 4)
     */
    usefulTiles: Tile[]

    /**
     * connectors for all tiles in hand (23456 for 4).
     * not working for
     */
    allConnectors: Tile[]

    /**
     * tiles player can replace without shanten or ukeire changing.
     * not aware of live/dead tiles
     */
    safeToReplace: Tile[]
}

export type ShantenInfo = {
    // todo maybe we don't need it?
    splittingInfo: MeldVariant

    nextDrawInfo: NextDrawInfo

    /**
     *  number of tiles needed for reaching tempai
     */
    value: number
}

/**
 * only regular structure
 */
export function getShantenInfo(tiles: Tile[]): ShantenInfo[] {
    if (
        tiles.length !== 1 &&
        tiles.length !== 4 &&
        tiles.length !== 7 &&
        tiles.length !== 10 &&
        tiles.length !== 13
    ) {
        throw new Error('unsupported hand size')
    }

    const handSplitVariants = splitHand(tiles)

    const result: ShantenInfo[] = []

    handSplitVariants.forEach(info => {
        const regular = getRegularHandStructure(info, tiles)
        result.push(regular)
    })

    // todo maybe remove sort?
    return result.sort((a, b) => a.value - b.value)
}

// todo add tests
function getClosestTiles(tile: Tile): Tile[] {
    if (tile.type === SuitType.JIHAI) {
        return []
    }

    const tilesToImprove: Tile[] = []

    if (tile.value >= 2) {
        // ryanmen _32_
        // penchan 21_
        tilesToImprove.push({
            type: tile.type,
            value: tile.value - 1,
        })
    }

    if (tile.value >= 3) {
        // kanchan 3_1
        tilesToImprove.push({
            type: tile.type,
            value: tile.value - 2,
        })
    }

    if (tile.value <= 7) {
        // kanchan 7_9
        tilesToImprove.push({
            type: tile.type,
            value: tile.value + 2,
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

    return tilesToImprove
}

// todo add tests
function getConnectors(tile: Tile): Tile[] {
    return [...getClosestTiles(tile), tile]
}

function getTilesToCompleteSequence(tileA: Tile, tileB: Tile): Tile[] {
    const tilesToImprove: Tile[] = []
    const minValue = Math.min(tileA.value, tileB.value)
    const maxValue = Math.max(tileA.value, tileB.value)
    if (maxValue - minValue === 2) {
        // kanchan 1_3
        tilesToImprove.push({
            type: tileA.type,
            value: minValue + 1,
        })
    } else if (minValue === 1) {
        // penchan 12_
        tilesToImprove.push({
            type: tileB.type,
            value: maxValue + 1,
        })
    } else if (maxValue === 9) {
        // penchan _89
        tilesToImprove.push({
            type: tileA.type,
            value: minValue - 1,
        })
    } else {
        // ryanmen _23_
        tilesToImprove.push({
            type: tileA.type,
            value: minValue - 1,
        })
        tilesToImprove.push({
            type: tileB.type,
            value: maxValue + 1,
        })
    }

    return tilesToImprove
}

function getRegularHandStructure(info: MeldVariant, allTiles: Tile[]): ShantenInfo {
    const { melds, remainingTiles } = info

    if (allTiles.length === 1) {
        const singeTile = allTiles[0]
        return {
            splittingInfo: info,
            nextDrawInfo: {
                improvements: [singeTile],
                usefulTiles: [],
                safeToReplace: [singeTile],
                allConnectors: getConnectors(singeTile),
            },
            value: 0,
        }
    }

    let minShantenValue = 6

    const groupingVariants = splitToGroups(info.remainingTiles)

    groupingVariants.forEach(variant => {
        const { pairs, sequences } = variant

        const shantenValue = getBaseShantenCount(
            allTiles.length,
            melds.length,
            sequences.length + pairs.length,
            pairs.length > 0
        )
        minShantenValue = Math.min(shantenValue, minShantenValue)
    })

    const tilesToImprove: Tile[] = []
    const possibleReplacements: Tile[] = []
    const usefulDrawTiles: Tile[] = [] // todo should we add more tiles here?
    const importantTilesToLeave: Tile[] = []
    const allConnectors: Tile[] = []

    groupingVariants.forEach(variant => {
        const { pairs, sequences, uselessTiles } = variant
        const hasPair = pairs.length > 0
        const groupsCount = sequences.length + pairs.length

        const shantenValue = getBaseShantenCount(
            allTiles.length,
            melds.length,
            groupsCount,
            pairs.length > 0
        )
        if (shantenValue > minShantenValue) {
            return // todo maybe we should also check improvements for variants with shanten - 1?
        }

        // we don't have enough groups when shanten >= groups length,
        // so it order to reach tempai we need to get 1+ groups
        // e.g. [12 59] need one 1 more groups
        // [23 56 89 2] don't need any more groups
        const needToGetMoreGroups = shantenValue !== 0 && groupsCount <= minShantenValue

        // we have too many groups and we have to discard one of them to reach tempai
        // BUT we shouldn't discard pair if it's the only one
        // e.g. [23 56 89 2], 3 < 2 -> can discard
        // [12 45 78 12 5 9], 4 >= 4 -> can not discard
        const canDiscardSomeGroups = groupsCount > minShantenValue
        const canDiscardPair = canDiscardSomeGroups && pairs.length > 1

        // it's impossible to improve hand with upgrading pair to pon,
        // when we all others groups are sequences
        // e.g. 11 45 -> we can improve only with 36
        const canUpgradePairToMeld = pairs.length !== 1 || uselessTiles.length !== 0

        // when we have only sequence groups we could make a pair from one of them
        //  e.g. 13 45 -> we need a pair for one of these tiles
        const shouldMakePairFromSeqMeld = !hasPair && uselessTiles.length === 0

        pairs.forEach(pair => {
            if (canUpgradePairToMeld) {
                tilesToImprove.push(pair[0])
            }

            if (!canDiscardPair) {
                importantTilesToLeave.push(pair[0])
            }
        })

        sequences.forEach(sequence => {
            const [tileA, tileB] = sequence
            if (shouldMakePairFromSeqMeld) {
                tilesToImprove.push(tileA)
                tilesToImprove.push(tileB)
            } else {
                // // todo check
                // usefulDrawTiles.push(tileA)
                // usefulDrawTiles.push(tileB)
            }
            if (!canDiscardSomeGroups) {
                importantTilesToLeave.push(tileA)
                importantTilesToLeave.push(tileB)
            }

            tilesToImprove.push(...getTilesToCompleteSequence(tileA, tileB))
        })

        uselessTiles.forEach(tile => {
            if (!hasPair) {
                // for tempai only this 1 tile will be an improvement;
                // for shanten > 0 if we don't have a pair we can decrease shanten by creating one
                tilesToImprove.push(tile)
            } else {
                // if (minShantenValue !== 0) {
                //     // because for tempai it will be improvement anyway (to win)
                //     usefulDrawTiles.push(tile)
                // }
            }

            possibleReplacements.push(tile)

            if (needToGetMoreGroups) {
                tilesToImprove.push(tile)
                tilesToImprove.push(...getClosestTiles(tile))
            }

            // todo check if bot can decide to discard separated tile to make a sequence with another one
            //  when it's just 2 separated tiles and we don't have a pair
            //  e.g [12m 45m 2p 9s] + 3p -> [12m 45m 23p] and 9 to discard
            // although it could be useful to improve pair to sequence and discard tile from other one instead

            // else {
            //     usefulDrawTiles.push(tile)
            //     usefulDrawTiles.push(...getClosestTiles(tile))
            // }
        })
    })

    allTiles.forEach(tile => {
        allConnectors.push(...getConnectors(tile))
    })

    return {
        splittingInfo: info,
        nextDrawInfo: {
            improvements: getUniqueTiles(tilesToImprove),
            usefulTiles: usefulDrawTiles,
            safeToReplace: possibleReplacements,
            allConnectors,
        },
        value: minShantenValue,
    }
}
