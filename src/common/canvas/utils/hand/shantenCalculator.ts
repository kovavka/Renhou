import {Tile} from "../../core/game-types/Tile";
import {HandSpittingInfo, TwoTilesGroup, MeldTileGroup, SingleTileGroup} from "./types";
import {SuitType} from "../../core/game-types/SuitType";

// todo what is we wait for 5th tile

enum HandStructureType {
    REGULAR,
    CHIITOI,
    KOKUSHI_MUSO,
}

type HandStructureVariant = {
    splittingInfo: HandSpittingInfo

    structureType: HandStructureType

    /**
     * tiles player can get to increase shanten count
     */
    tilesToImprove: Tile[]

    /**
     * tiles player can replace without shanten decrease
     */
    possibleReplacements: Tile[]

    /**
     * tiles player have to discard to complete chiitoi or kokushi muso
     */
    tilesToDiscard: Tile[]

    shantenCount: number
}

export function getShantenInfo(tiles: Tile[]): HandStructureVariant[] {
    const handSplitVariants = processTiles(tiles)

    const result: HandStructureVariant[] = []

    const kokushiMuso = getKokushiMusoStructure(tiles)
    if (kokushiMuso !== undefined && kokushiMuso.shantenCount < 7) {
        result.push(kokushiMuso)
    }

    const chiitoi = getChiitoiStructure(tiles)
    if (chiitoi !== undefined) {
        result.push(chiitoi)
    }

    handSplitVariants.forEach(info => {
        const {melds, groups, separatedTiles} = info

    })

    // honorVariant.separatedTiles.length + honorVariant.meldsToComplete.length
    // return shanten < 7 ? shanten : -1

    return []
}

function getHandSizeForStructure(info: HandSpittingInfo) {
    const {melds, groups, separatedTiles} = info
    return melds.length * 3 + groups.length * 2 + separatedTiles.length
}

function getChiitoiStructure(allTiles: Tile[]): HandStructureVariant | undefined {
    if (allTiles.length !== 13) {
        return undefined
    }

    const tilesToDiscard: Tile[] = []
    const tilesToImprove: Tile[] = []
    const possibleReplacements: Tile[] = []
    let shantenCount = 0

    const identicalGroups = groupIdenticalTiles(allTiles)

    const infoGroups: (TwoTilesGroup)[] = []
    const separatedTiles: Tile[] = []

    for(const group of identicalGroups) {
        if (group.count === 2) {
            infoGroups.push([group.tile, group.tile])
        } if (group.count > 2) {
            shantenCount++
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
    let missingTilesLength = 0

    const singleTiles: Tile[] = []
    const terminalHonorPairs: Tile[] = []

    getAllTerimalAndHonorTiles().forEach(tile => {
        const count = getIdenticalTileCount(allTiles, tile)
        if (count === 0) {
            missingTilesLength++
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

    let shantenCount = missingTilesLength
    const tilesToImprove: Tile[] = missingTiles.slice()

    if (terminalHonorPairs.length === 0) {
        shantenCount++
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

function getAllTerimalAndHonorTiles(): Tile[] {
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

    const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
    if (hasPair) {
        const newGroup: TilesGroup = [tile, tile]
        const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
        const nextVariants = getAllVariants(nextRemaining, [newGroup])
        variants.push(...nextVariants)
    }

    const hasPon = hasIdenticalTiles(remainingTiles, tile, 3)
    if (hasPon) {
        // identical meld (222)
        const newGroup: TilesGroup = [tile, tile, tile]
        const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
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

        if (hasNextNumber) {
            // waits like 12_, 23_
            const newGroup: TilesGroup = [tile, nextTile]
            const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariants(nextRemaining, [newGroup])
            variants.push(...nextVariants)
        }

        if (hasNextNextNumber) {
            // waits like 1_3
            const newGroup: TilesGroup = [tile, nextNextTile]
            const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariants(nextRemaining, [newGroup])
            variants.push(...nextVariants)
        }

        if (hasNextNumber && hasNextNextNumber) {
            // sequential meld (123)
            const newGroup: TilesGroup = [tile, nextTile, nextNextTile]
            const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
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

function getRemainingTiles(all: Tile[], ...tilesToExclude: Tile[]): Tile[] {
    const result: Tile[] = []

    all.forEach(tile => {
        const excludeIndex = tilesToExclude.findIndex(x => x.type === tile.type && x.value === tile.value)
        if (excludeIndex === -1) {
            result.push(tile)
        } else {
            tilesToExclude = [...tilesToExclude.slice(0, excludeIndex), ...tilesToExclude.slice(excludeIndex + 1)]
        }
    })
    return result
}

export function hasTiles(all: Tile[], ...tiles: Tile[]): boolean {
    return tiles.every(tile => all.findIndex(x => x.value === tile.value && x.type === tile.type) !== -1)
}

export function getIdenticalTileCount(all: Tile[], tile: Tile): number {
    return  all.filter(x => isTheSameTile(x, tile)).length
}

function hasIdenticalTiles(all: Tile[], tile: Tile, count: number): boolean {
    return getIdenticalTileCount(all, tile) >= count
}

function isTheSameTile(tileA: Tile, tileB: Tile): boolean {
    return tileA.type === tileB.type && tileA.value === tileB.value
}


function groupIdenticalTiles(tiles: Tile[]): {tile: Tile, count: number}[] {
    return tiles.reduce<{ tile: Tile, count: number }[]>((acc, tile) => {
        const element = acc.find(x => isTheSameTile(x.tile, tile))
        if (element !== undefined) {
            const index = acc.indexOf(element)
            acc[index].count = acc[index].count + 1
        } else {
            acc.push({
                tile,
                count: 1,
            })
        }

        return acc
    }, [])
}
