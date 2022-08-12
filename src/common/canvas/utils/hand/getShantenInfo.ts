import {Tile} from "../../core/game-types/Tile";
import {SuitType} from "../../core/game-types/SuitType";
import {
    getIdenticalTileCount,
    excludeTiles,
    getUniqueTiles,
    hasIdenticalTiles, hasTiles,
    isTheSameTile
} from "../tiles/tileContains";
import {isTerminalOrHonorTile} from "../tiles/isTerminalOrHonorTile";
import {groupIdenticalTiles} from "../tiles/groupIdenticalTiles";
import {getBaseShantenCount} from "./getBaseShantenCount";

export enum HandStructureType {
    REGULAR,
    CHIITOI,
    KOKUSHI_MUSO,
}

type HandStructureVariant = {
    // todo maybe we don't need it?
    splittingInfo: HandSpittingInfo

    structureType: HandStructureType

    /**
     * tiles player can get to increase shanten count
     */
    tilesToImprove: Tile[]

    /**
     * tiles player can replace without shanten changing (especially decrease)
     */
    possibleReplacements: Tile[]

    /**
     * tiles player have to discard to complete chiitoi or kokushi muso
     */
    tilesToDiscard: Tile[]

    shantenCount: number
}

type MeldTileGroup = [Tile, Tile, Tile]
type TwoTilesGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
type SingleTileGroup = [Tile]

type HandSpittingInfo = {
    melds: MeldTileGroup[]

    groups: (TwoTilesGroup)[]

    /**
     * tiles we can not use to complete melds
     */
    separatedTiles: Tile[]
}


// todo when it's 0 shanten and tanki wait we have tile to replace

export function getShantenInfo(tiles: Tile[]): HandStructureVariant[] {
    const handSplitVariants = processTiles(tiles)

    const result: HandStructureVariant[] = []

    handSplitVariants.forEach(info => {
        const regular = getRegularHandStructure(info, tiles)
        result.push(regular)
    })

    const kokushiMuso = getKokushiMusoStructure(tiles)
    if (kokushiMuso !== undefined && kokushiMuso.shantenCount < 7) {
        result.push(kokushiMuso)
    }

    const chiitoi = getChiitoiStructure(tiles)
    if (chiitoi !== undefined) {
        result.push(chiitoi)
    }

    return result.sort((a, b) => a.shantenCount - b.shantenCount)
}

function getRegularHandStructure(info: HandSpittingInfo, allTiles: Tile[]): HandStructureVariant {
    const {melds, groups, separatedTiles} = info

    if (allTiles.length === 1) {
        return {
            splittingInfo: info,
            structureType: HandStructureType.REGULAR,
            tilesToImprove: [],
            possibleReplacements: separatedTiles,
            tilesToDiscard: [],
            shantenCount: 0,
        }
    }

    const pairs = groups.filter(x => isTheSameTile(x[0], x[1]))
    const hasPair = pairs.length > 0

    const shantenCount = getBaseShantenCount(allTiles.length, melds.length, groups.length, hasPair)

    const tilesToDiscard: Tile[] = []
    const tilesToImprove: Tile[] = []
    const possibleReplacements: Tile[] = []


    const maxMeldsToComplete = Math.floor(allTiles.length / 3) - melds.length
    const canDiscardSomeMelds = maxMeldsToComplete > groups.length
    const needToGetMoreGroups = groups.length < shantenCount


    // it's impossible to improve hand using 3rd tile for pair, when we have incompleted sequence meld,
    // e.g. 11 45 -> we can improve only with 36
    const canUpgradePairToMeld = pairs.length !== 1 || separatedTiles.length !== 0

    // when we have only sequence groups we should beak one of them to make a pair
    //  e.g. 13 45 -> we need a pair for one of these tiles
    const shouldMakePairFromSeqMeld = !hasPair && separatedTiles.length === 0

    groups.forEach(group => {
        const [tileA, tileB] = group

        if (isTheSameTile(tileA, tileB)) {
            if (canUpgradePairToMeld) {
                tilesToImprove.push(tileA)
            }
        } else {
            // sequence meld

            if (shouldMakePairFromSeqMeld) {
                tilesToImprove.push(tileA)
                tilesToImprove.push(tileB)
            }

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
                    type: tileA.type,
                    value: maxValue + 1
                })
            } else if (maxValue === 9) {
                // penchan _89
                tilesToImprove.push({
                    type: tileA.type,
                    value: minValue - 1
                })
            } else {
                // ryanmen 23
                tilesToImprove.push({
                    type: tileA.type,
                    value: minValue - 1
                })
                tilesToImprove.push({
                    type: tileA.type,
                    value: maxValue + 1
                })
            }
        }

        if (canDiscardSomeMelds) {
            tilesToDiscard.push(tileA)
            tilesToDiscard.push(tileB)
        }
    })

    separatedTiles.forEach(tile => {
        if (!hasPair) {
            tilesToImprove.push(tile)
            possibleReplacements.push(tile)
        } else if (needToGetMoreGroups) {
            tilesToImprove.push(tile)
            if (tile.type !== SuitType.JIHAI) {
                if (tile.value > 1) {
                    tilesToImprove.push({
                        type: tile.type,
                        value: tile.value + 1
                    })
                }
                if (tile.value < 9) {
                    tilesToImprove.push({
                        type: tile.type,
                        value: tile.value - 1
                    })
                }
            }

            possibleReplacements.push(tile)
        } else {
            tilesToDiscard.push(tile)
        }
    })

    return {
        splittingInfo: info,
        structureType: HandStructureType.REGULAR,
        tilesToImprove: getUniqueTiles(tilesToImprove),
        possibleReplacements,
        tilesToDiscard,
        shantenCount,
    }
}

function getChiitoiStructure(allTiles: Tile[]): HandStructureVariant | undefined {
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

    const infoGroups: (TwoTilesGroup)[] = []
    const separatedTiles: Tile[] = []

    for(const group of identicalGroups) {
        if (group.count === 2) {
            infoGroups.push([group.tile, group.tile])
        } if (group.count > 2) {
            tilesToDiscard.push(group.tile)

            separatedTiles.push(group.tile)
            if (group.count === 4) {
                separatedTiles.push(group.tile)
            }
        } else if (group.count === 1) {
            // if player gets pair, it will increase shanten
            tilesToImprove.push(group.tile)
            // if player replaces tile, it won't affect shanten
            possibleReplacements.push(group.tile)

            separatedTiles.push(group.tile)
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

    const info: HandSpittingInfo = {
        melds: [],
        groups: infoGroups,
        separatedTiles,
    }

    // todo test size in info = 13

    return {
        splittingInfo: info,
        structureType: HandStructureType.CHIITOI,
        tilesToImprove,
        possibleReplacements,
        tilesToDiscard,
        shantenCount,
    }
}

function getKokushiMusoStructure(allTiles: Tile[]): HandStructureVariant | undefined {
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

    const info: HandSpittingInfo = {
        melds: [],
        groups: terminalHonorPairs.map(tile => [tile, tile]),
        separatedTiles: singleTiles,
    }
    // todo test size in info = 13

    return {
        splittingInfo: info,
        structureType: HandStructureType.KOKUSHI_MUSO,
        tilesToImprove,
        possibleReplacements: [],
        tilesToDiscard,
        shantenCount,
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

function processTiles(all: Tile[]): HandSpittingInfo[] {
    const allVariants = getAllVariants(all, [])
    return allVariants.map((groupingVariant) => {
        const melds: MeldTileGroup[] = []
        const separatedTiles: Tile[] = []
        const meldsToComplete: TwoTilesGroup[] = []

        groupingVariant.forEach(group => {
            if (group.length === 3) {
                melds.push(group)
            } else if (group.length === 2) {
                meldsToComplete.push(group)
            } else {
                separatedTiles.push(group[0])
            }
        })

        return {
            melds,
            separatedTiles,
            groups: meldsToComplete,
        }
    })
}

type TilesGroup = MeldTileGroup | TwoTilesGroup | SingleTileGroup
type GroupingVariant = TilesGroup[]

/**
 * Get all possible variation of hand developing in current suit.
 * Separated tiles will be added to result only if they are not a part of any group
 */
function getAllVariants(remainingTiles: Tile[], currentVariant: GroupingVariant): GroupingVariant[] {
    if (remainingTiles.length === 0) {
       return [currentVariant]
    }

    const variants: GroupingVariant[] = []
    const tile = remainingTiles[0]

    const hasPon = hasIdenticalTiles(remainingTiles, tile, 3)
    if (hasPon) {
        // identical meld (222)
        const newGroup: TilesGroup = [tile, tile, tile]
        const nextRemaining = excludeTiles(remainingTiles, ...newGroup)
        const nextVariants = getAllVariants(nextRemaining, [newGroup])
        variants.push(...nextVariants)
    }

    const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
    if (hasPair) {
        const newGroup: TilesGroup = [tile, tile]
        const nextRemaining = excludeTiles(remainingTiles, ...newGroup)
        const nextVariants = getAllVariants(nextRemaining, [newGroup])
        variants.push(...nextVariants)
    }

    const isNumberedSuit = tile.type !== SuitType.JIHAI
    if (isNumberedSuit) {
        const nextTile = {
            type: tile.type,
            value: tile.value + 1,
        }
        const nextNextTile = {
            type: tile.type,
            value: tile.value + 2,
        }

        const hasNextNumber = tile.value < 9 && hasTiles(remainingTiles, nextTile)
        const hasNextNextNumber = tile.value < 8 && hasTiles(remainingTiles, nextNextTile)

        if (hasNextNumber && hasNextNextNumber) {
            // sequential meld (123)
            const newGroup: TilesGroup = [tile, nextTile, nextNextTile]
            const nextRemaining = excludeTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariants(nextRemaining, [newGroup])
            variants.push(...nextVariants)
        }

        if (hasNextNumber) {
            // waits like 12_, 23_
            const newGroup: TilesGroup = [tile, nextTile]
            const nextRemaining = excludeTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariants(nextRemaining, [newGroup])
            variants.push(...nextVariants)
        }

        if (hasNextNextNumber) {
            // waits like 1_3
            const newGroup: TilesGroup = [tile, nextNextTile]
            const nextRemaining = excludeTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariants(nextRemaining, [newGroup])
            variants.push(...nextVariants)
        }
    }

    if (variants.length === 0) {
        // just 1 separated tile
        const nextRemaining = remainingTiles.slice(1)
        const newGroup: TilesGroup = [tile]
        const nextVariants = getAllVariants(nextRemaining, [newGroup])
        variants.push(...nextVariants)
    }

    return variants.map(variant => currentVariant.concat(variant))
}
