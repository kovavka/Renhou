import { Tile } from '../../game-types/Tile'
import { getBaseShantenCount } from './getBaseShantenCount'
import { GroupingVariant, MeldVariant, splitToGroups, splitToMelds } from './splitHand'
import { getClosestTiles } from './getClosestTiles'
import { getTilesToCompleteSequence } from './getTilesToCompleteSequence'
import { getUniqueTiles } from '../tiles/tileContains'
import { SuitType } from '../../game-types/SuitType'

// todo calculate most useless tile in hand by hand + draw tile

export type GroupingInfo = {
    shanten: number

    splittingInfo: GroupingVariant

    waits: Tile[]

    /**
     * hand has too much groups and more than one pair, so one of groups could be discarded
     */
    canDiscardPair: boolean

    /**
     * hand has too much groups, so one of sequences could be discarded
     */
    canDiscardSeq: boolean
}

export type HandStructureInfo = {
    /**
     *  number of tiles needed for reaching tempai
     */
    minShanten: number

    splittingInfo: MeldVariant

    groupingVariants: GroupingInfo[]
}

/**
 * only regular structure
 */
export function getHandStructureVariants(tiles: Tile[]): HandStructureInfo[] {
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

    const result: HandStructureInfo[] = []

    handSplitVariants.forEach(info => {
        const regular = getRegularHandStructure(info, tiles)
        result.push(regular)
    })

    return result.sort((a, b) => a.minShanten - b.minShanten)
}

function getRegularHandStructure(info: MeldVariant, allTiles: Tile[]): HandStructureInfo {
    const { sequences, triplets, remainingTiles } = info

    if (allTiles.length === 1) {
        return {
            splittingInfo: info,
            groupingVariants: [
                {
                    shanten: 0,
                    splittingInfo: {
                        pairs: [],
                        sequences: [],
                        uselessTiles: allTiles,
                    },
                    waits: allTiles,
                    canDiscardPair: false,
                    canDiscardSeq: false,
                },
            ],
            minShanten: 0,
        }
    }

    const groupingVariants = splitToGroups(remainingTiles)

    let minShantenValue = 6

    const meldsCount = sequences.length + triplets.length
    const maxMeldsLeft = Math.floor(allTiles.length / 3) - meldsCount

    const groupInfos: GroupingInfo[] = []

    groupingVariants.forEach(variant => {
        const { pairs, sequences: sequentialGroups, uselessTiles } = variant
        const hasPair = pairs.length > 0
        const groupsCount = sequentialGroups.length + pairs.length

        const shantenValue = getBaseShantenCount(
            meldsCount,
            groupsCount,
            uselessTiles.length,
            hasPair
        )
        minShantenValue = Math.min(shantenValue, minShantenValue)

        // [123 34 77] - just enough
        // [123 34 78] - too much
        // [12 45 78 12 55] - too much
        const tooMuchGroups = hasPair ? groupsCount - 1 > maxMeldsLeft : groupsCount > maxMeldsLeft

        // [123 34 9 1] - need 1 pair, but not sequence
        // [123 33 9 1] - need 1 pair or sequence
        // [123 6 9 1 4] - need 2 more groups
        const needToGetMoreGroups = hasPair
            ? groupsCount - 1 < maxMeldsLeft
            : groupsCount < maxMeldsLeft

        // when we have too many groups, we have to discard one of them to reach tempai
        // BUT we shouldn't discard pair if it's the only one
        // e.g. [23 56 89 2], 3 < 2 -> can discard
        // [12 45 78 12 5 9], 4 >= 4 -> can not discard
        const canDiscardSeq = tooMuchGroups
        const canDiscardPair = tooMuchGroups && pairs.length > 1
        // todo add tests for canDiscardSeq and canDiscardPair

        //  when we all others groups are sequences,
        //  it's impossible to improve hand with upgrading pair to pon,
        // e.g. 11 45 -> we can improve only with 36
        const canUpgradePairToMeld = !(pairs.length === 1 && groupsCount > maxMeldsLeft)

        // when we have too much sequence groups we could make a pair from one of them
        //  e.g. 13 45 -> we need a pair for one of these tiles
        const shouldMakePairFromSeqGroup = !hasPair && tooMuchGroups

        // when we have structure like 3334, 3335, etc.
        // we have not only tanki wait for 3 or 4, but also pair 33 + waits for 34 or 35.
        // it will be an iprovement when we have tempai
        // or when we don't have too much groups
        const canUnionTripletsWithSeparatedTile =
            uselessTiles.length !== 0 && triplets.length !== 0 && !tooMuchGroups

        // when we have structure like 3567, etc.
        // we have not only tanki wait for 3, but also groups 35 + 67.
        // it will be an iprovement when we don't have enough sequential groups
        const canUnionSequenceWithSeparatedTile =
            uselessTiles.length !== 0 && sequences.length !== 0 && needToGetMoreGroups

        const tilesToImprove: Tile[] = []

        pairs.forEach(pair => {
            if (canUpgradePairToMeld) {
                tilesToImprove.push(pair[0])
            }
        })

        sequentialGroups.forEach(sequence => {
            const [tileA, tileB] = sequence
            if (shouldMakePairFromSeqGroup) {
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

            if (canUnionTripletsWithSeparatedTile) {
                triplets.forEach(meld => {
                    tilesToImprove.push(...getTilesToCompleteSequence(meld[0], tile))
                })
            }

            if (canUnionSequenceWithSeparatedTile && tile.type !== SuitType.JIHAI) {
                // we already added closest tile, so we need only 1 farthest tile
                // for 3567 it will be 8, for 3457 - 2
                sequences.forEach(meld => {
                    if (meld[0].type !== tile.type) {
                        return
                    }
                    const [tileA, tileB, tileC] = meld
                    const maxFromMeld = Math.max(tileA.value, tileB.value, tileC.value)
                    const minFromMeld = Math.min(tileA.value, tileB.value, tileC.value)
                    if (
                        minFromMeld > tile.value &&
                        minFromMeld - tile.value === 2 &&
                        maxFromMeld !== 9
                    ) {
                        // 3 + 567
                        tilesToImprove.push({ type: tile.type, value: maxFromMeld + 1 })
                    } else if (
                        maxFromMeld < tile.value &&
                        tile.value - minFromMeld === 2 &&
                        maxFromMeld !== 1
                    ) {
                        // 345 + 7
                        tilesToImprove.push({ type: tile.type, value: minFromMeld - 1 })
                    }
                })
            }
        })

        groupInfos.push({
            shanten: shantenValue,
            splittingInfo: variant,
            waits: getUniqueTiles(tilesToImprove),
            canDiscardPair,
            canDiscardSeq,
        })
    })

    return {
        splittingInfo: info,
        groupingVariants: groupInfos,
        minShanten: minShantenValue,
    }
}
