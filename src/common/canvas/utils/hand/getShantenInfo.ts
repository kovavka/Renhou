import {Tile} from "../../core/game-types/Tile";
import {SuitType} from "../../core/game-types/SuitType";
import {getIdenticalTileCount, getUniqueTiles, hasTiles} from "../tiles/tileContains";
import {isTerminalOrHonorTile} from "../tiles/isTerminalOrHonorTile";
import {groupIdenticalTiles} from "../tiles/groupIdenticalTiles";
import {getBaseShantenCount} from "./getBaseShantenCount";
import {MeldVariant, splitHand, splitToGroups} from "./splitHand";

export enum HandStructureType {
    REGULAR,
    CHIITOI,
    KOKUSHI_MUSO,
}

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

    /**
     * tiles player should discard to complete chiitoi or kokushi muso
     */
    toDiscard: Tile[]

    /**
     * todo might not work properly for different splitting variants (e.g. in chinitsu)
     * tiles player can NOT discard without shanten increasing
     * todo won't work for chiitoi and kokushi muso -> fix or add a comment if it should stay this way
     */
    toLeave: Tile[]
}

export type ShantenInfo = {
    // todo maybe we don't need it?
    splittingInfo: MeldVariant

    structureType: HandStructureType

    nextDrawInfo: NextDrawInfo

    /**
     *  number of tiles needed for reaching tempai
     */
    value: number
}

// todo test waits like 3334 - should be 245

export function getShantenInfo(tiles: Tile[]): ShantenInfo[] {
    if (tiles.length !== 1 && tiles.length !== 4 && tiles.length !== 7 && tiles.length !== 10 && tiles.length !== 13) {
        throw new Error('unsupported hand size')
    }

    const handSplitVariants = splitHand(tiles)

    const result: ShantenInfo[] = []

    handSplitVariants.forEach(info => {
        const regular = getRegularHandStructure(info, tiles)
        result.push(regular)
    })

    const kokushiMusoInfo = getKokushiMusoInfo(tiles)
    if (kokushiMusoInfo !== undefined && kokushiMusoInfo.value < 7) {
        result.push(kokushiMusoInfo)
    }

    const chiitoiInfo = getChiitoiInfo(tiles)
    if (chiitoiInfo !== undefined) {
        result.push(chiitoiInfo)
    }

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
            value: tile.value - 1
        })
    }

    if (tile.value >= 3) {
        // kanchan 3_1
        tilesToImprove.push({
            type: tile.type,
            value: tile.value - 2
        })
    }

    if (tile.value <= 7) {
        // kanchan 7_9
        tilesToImprove.push({
            type: tile.type,
            value: tile.value + 2
        })
    }

    if (tile.value <= 8) {
        // ryanmen _78_
        // penchan _89
        tilesToImprove.push({
            type: tile.type,
            value: tile.value + 1
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
    const minValue =  Math.min(tileA.value, tileB.value)
    const maxValue =  Math.max(tileA.value, tileB.value)
    if ((maxValue - minValue) === 2) {
        // kanchan 1_3
        tilesToImprove.push({
            type: tileA.type,
            value: minValue + 1
        })
    } else if (minValue === 1) {
        // penchan 12_
        tilesToImprove.push({
            type: tileB.type,
            value: maxValue + 1
        })
    } else if (maxValue === 9) {
        // penchan _89
        tilesToImprove.push({
            type: tileA.type,
            value: minValue - 1
        })
    } else {
        // ryanmen _23_
        tilesToImprove.push({
            type: tileA.type,
            value: minValue - 1
        })
        tilesToImprove.push({
            type: tileB.type,
            value: maxValue + 1
        })
    }

    return tilesToImprove
}

function getRegularHandStructure(info: MeldVariant, allTiles: Tile[]): ShantenInfo {
    const {melds, remainingTiles} = info

    if (allTiles.length === 1) {
        const singeTile = allTiles[0]
        return {
            splittingInfo: info,
            structureType: HandStructureType.REGULAR,
            nextDrawInfo: {
                improvements: [singeTile],
                usefulTiles: [],
                safeToReplace: [singeTile],
                toDiscard: [],
                // it's just one tile and we can replace it
                toLeave: [],
                allConnectors: getConnectors(singeTile),
            },
            value: 0,
        }
    }

    let minShantenValue = 6

    const groupingVariants = splitToGroups(info.remainingTiles)

    groupingVariants.forEach(variant => {
        const {pairs, sequences} = variant

        const shantenValue = getBaseShantenCount(allTiles.length, melds.length, sequences.length + pairs.length, pairs.length > 0)
        minShantenValue = Math.min(shantenValue, minShantenValue)
    })

    const tilesToImprove: Tile[] = []
    const possibleReplacements: Tile[] = []
    const usefulDrawTiles: Tile[] = [] // todo should we add more tiles here?
    const importantTilesToLeave: Tile[] = []
    const allConnectors: Tile[] = []

    groupingVariants.forEach(variant => {
        const {pairs, sequences, uselessTiles} = variant
        const hasPair = pairs.length > 0
        const groupsCount = sequences.length + pairs.length


        const shantenValue = getBaseShantenCount(allTiles.length, melds.length, groupsCount, pairs.length > 0)
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
        structureType: HandStructureType.REGULAR,
        nextDrawInfo: {
            improvements: getUniqueTiles(tilesToImprove),
            usefulTiles: usefulDrawTiles,
            safeToReplace: possibleReplacements,
            toDiscard: [],
            toLeave: getUniqueTiles(importantTilesToLeave),
            allConnectors,
        },
        value: minShantenValue,
    }
}

function getChiitoiInfo(allTiles: Tile[]): ShantenInfo | undefined {
    if (allTiles.length !== 13) {
        return undefined
    }

    const tilesToDiscard: Tile[] = []
    const tilesToImprove: Tile[] = []
    const possibleReplacements: Tile[] = []

    const identicalGroups = groupIdenticalTiles(allTiles)
    const pairsCount = identicalGroups.filter(x => x.count > 1).length
    let shantenCount = 6 - pairsCount

    // group of 4 affect shanten, because we have to discard 2 tiles for each group,
    // while group of 3 is just 1 tile to discard and we could replace it to a tile without pair we already have
    const groupsOf4Count = identicalGroups.filter(x => x.count === 4).length
    if (groupsOf4Count !== 0) {
        shantenCount += groupsOf4Count * 2 - 1
    }

    const tilesWithoutGroup = identicalGroups.filter(x => x.count === 1)
    // it's possible only when we have 5 pairs and group of 3.
    // In that case we need to replace third tile to something else
    const needUniqueTile = tilesWithoutGroup.length === 0
    if (needUniqueTile) {
        shantenCount++
    }

    const pairs: Tile[] = []

    for(const group of identicalGroups) {
        if (group.count === 2) {
            pairs.push(group.tile)
        } else if (group.count > 2) {
            tilesToDiscard.push(group.tile)
        } else if (group.count === 1) {
            // if player gets pair, it will increase shanten
            tilesToImprove.push(group.tile)
            // if player replaces unique tile, it won't affect shanten
            possibleReplacements.push(group.tile)
        }
    }

    // add all possible tiles (except tile in the hand) as tiles to improve.
    // it will increase shanten when we have at least one group with length > 2
    // and less than 2 tiles without group
    if (identicalGroups.filter(x => x.count > 2).length > 0 && tilesWithoutGroup.length < 2) {
        for (let i = 1; i < 10; i++) {
            const manTile = {type: SuitType.MANZU, value: i}
            if (!hasTiles(allTiles, manTile)) {
                tilesToImprove.push(manTile)
            }
            const pinTile = {type: SuitType.PINZU, value: i}
            if (!hasTiles(allTiles, pinTile)) {
                tilesToImprove.push(pinTile)
            }
            const souTile = {type: SuitType.SOUZU, value: i}
            if (!hasTiles(allTiles, souTile)) {
                tilesToImprove.push(souTile)
            }

            if (i < 8) {
                const jihaiTile = {type: SuitType.JIHAI, value: i}
                if (!hasTiles(allTiles, jihaiTile)) {
                    tilesToImprove.push(jihaiTile)
                }
            }
        }
    }


    return {
        splittingInfo: {
            melds: [],
            remainingTiles: allTiles,
        },
        structureType: HandStructureType.CHIITOI,
        nextDrawInfo: {
            improvements: getUniqueTiles(tilesToImprove),
            usefulTiles: [],
            safeToReplace: possibleReplacements,
            toDiscard: tilesToDiscard,
            toLeave: pairs,
            allConnectors: []
        },
        value: shantenCount,
    }
}

function getKokushiMusoInfo(allTiles: Tile[]): ShantenInfo | undefined {
    if (allTiles.length !== 13) {
        return undefined
    }

    const tilesToDiscard: Tile[] = []

    // only unique
    const missingTiles: Tile[] = []

    const singleTiles: Tile[] = []
    const terminalHonorPairs: Tile[] = []

    getAllTerimalAndHonorTiles().forEach(tile => {
        const count = getIdenticalTileCount(allTiles, tile)
        if (count === 0) {
            missingTiles.push(tile)
        }

        if (count === 1) {
            singleTiles.push(tile)
        }

        if (count >= 2) {
            terminalHonorPairs.push(tile)
        }

        if (count > 2) {
            tilesToDiscard.push(tile)
        }
    })

    const tilesToImprove: Tile[] = missingTiles.slice()
    let shantenCount = 0

    // it's tempai when we have 12 tiles and a pair for one of them
    if (terminalHonorPairs.length !== 1 || singleTiles.length !== 11) {
        shantenCount = missingTiles.length
        if (terminalHonorPairs.length === 0) {
            // it could be a tempai with takni wait or n-shanten without pair
            singleTiles.forEach(tile => {
                tilesToImprove.push(tile)
            })
        } else if (terminalHonorPairs.length > 1) {
            terminalHonorPairs.forEach(tile => {
                if (!tilesToDiscard.includes(tile)) {
                    tilesToDiscard.push(tile)
                }
            })
        }
    }

    allTiles.filter(tile => !isTerminalOrHonorTile(tile)).forEach(tile => {
        tilesToDiscard.push(tile)
    })

    return {
        splittingInfo: {
            melds: [],
            remainingTiles: allTiles,
        },
        structureType: HandStructureType.KOKUSHI_MUSO,
        nextDrawInfo: {
            improvements: tilesToImprove,
            usefulTiles: [],
            safeToReplace: [],
            toDiscard: tilesToDiscard,
            toLeave: singleTiles,
            allConnectors: []
        },
        value: shantenCount,
    }
}

export function getAllTerimalAndHonorTiles(): Tile[] {
    return [
        {type: SuitType.MANZU, value: 1},
        {type: SuitType.MANZU, value: 9},
        {type: SuitType.PINZU, value: 1},
        {type: SuitType.PINZU, value: 9},
        {type: SuitType.SOUZU, value: 1},
        {type: SuitType.SOUZU, value: 9},
        {type: SuitType.JIHAI, value: 1},
        {type: SuitType.JIHAI, value: 2},
        {type: SuitType.JIHAI, value: 3},
        {type: SuitType.JIHAI, value: 4},
        {type: SuitType.JIHAI, value: 5},
        {type: SuitType.JIHAI, value: 6},
        {type: SuitType.JIHAI, value: 7},
    ]
}

