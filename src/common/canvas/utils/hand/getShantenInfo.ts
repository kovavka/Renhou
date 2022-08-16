import { Tile } from '../../core/game-types/Tile'
import { getBaseShantenCount } from './getBaseShantenCount'
import { GroupingVariant, MeldVariant, splitToMelds, splitToGroups } from './splitHand'
import { getClosestTiles } from './getClosestTiles'
import { getTilesToCompleteSequence } from './getTilesToCompleteSequence'
import { getUniqueTiles } from '../tiles/tileContains'

// todo calculate most useless tile in hand by hand + draw tile

export type GroupingInfo = {
    shanten: number
    splittingInfo: GroupingVariant
    waits: Tile[]
    canDiscardPair: boolean
    canDiscardGroup: boolean
}

// todo maybe rename
export type ShantenInfo = {
    /**
     *  number of tiles needed for reaching tempai
     */
    value: number

    // todo maybe we don't need it?
    splittingInfo: MeldVariant

    variants: GroupingInfo[]
}

// todo maybe rename to getHandStructure

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

    const handSplitVariants = splitToMelds(tiles)

    const result: ShantenInfo[] = []

    handSplitVariants.forEach(info => {
        const regular = getRegularHandStructure(info, tiles)
        result.push(regular)
    })

    // todo maybe remove sort?
    return result.sort((a, b) => a.value - b.value)
}

function getRegularHandStructure(info: MeldVariant, allTiles: Tile[]): ShantenInfo {
    const { sequences, triplets, remainingTiles } = info

    if (allTiles.length === 1) {
        return {
            splittingInfo: info,
            variants: [
                {
                    shanten: 0,
                    splittingInfo: {
                        pairs: [],
                        sequences: [],
                        uselessTiles: allTiles,
                    },
                    waits: allTiles,
                    canDiscardPair: false,
                    canDiscardGroup: false,
                },
            ],
            value: 0,
        }
    }

    const groupingVariants = splitToGroups(remainingTiles)

    const tilesToImprove: Tile[] = []

    let minShantenValue = 6
    const meldsCount = sequences.length + triplets.length
    const groupInfos: GroupingInfo[] = []

    groupingVariants.forEach(variant => {
        const { pairs, sequences, uselessTiles } = variant
        const hasPair = pairs.length > 0
        const groupsCount = sequences.length + pairs.length

        const shantenValue = getBaseShantenCount(allTiles.length, meldsCount, groupsCount, hasPair)
        minShantenValue = Math.min(shantenValue, minShantenValue)

        // we don't have enough groups when shanten >= groups length,
        // so it order to reach tempai we need to get 1+ groups
        // e.g. [12 59] need one 1 more groups
        // [23 56 89 2] don't need any more groups
        const needToGetMoreGroups = shantenValue !== 0 && groupsCount <= minShantenValue

        // we have too many groups and we have to discard one of them to reach tempai
        // BUT we shouldn't discard pair if it's the only one
        // e.g. [23 56 89 2], 3 < 2 -> can discard
        // [12 45 78 12 5 9], 4 >= 4 -> can not discard
        const canDiscardGroup = groupsCount > minShantenValue
        const canDiscardPair = canDiscardGroup && pairs.length > 1

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
        })

        sequences.forEach(sequence => {
            const [tileA, tileB] = sequence
            if (shouldMakePairFromSeqMeld) {
                tilesToImprove.push(tileA)
                tilesToImprove.push(tileB)
            }

            tilesToImprove.push(...getTilesToCompleteSequence(tileA, tileB))
        })

        uselessTiles.forEach(tile => {
            if (!hasPair) {
                // for tempai only this 1 tile will be an improvement;
                // for shanten > 0 if we don't have a pair we can decrease shanten by creating one
                tilesToImprove.push(tile)
            }

            if (needToGetMoreGroups) {
                tilesToImprove.push(tile)
                tilesToImprove.push(...getClosestTiles(tile))
            }
        })

        if (uselessTiles.length === 1 && shantenValue === 0 && triplets.length !== 0) {
            // when we have structure like 3334, 3335, etc.
            // we have not only tanki wait for 3 or 4, but also pair 33 + waits for 34 or 35
            triplets.forEach(meld => {
                tilesToImprove.push(...getTilesToCompleteSequence(meld[0], uselessTiles[0]))
            })
        }

        groupInfos.push({
            shanten: shantenValue,
            splittingInfo: variant,
            waits: getUniqueTiles(tilesToImprove),
            canDiscardPair,
            canDiscardGroup,
        })
    })

    return {
        splittingInfo: info,
        variants: groupInfos,
        value: minShantenValue,
    }
}
