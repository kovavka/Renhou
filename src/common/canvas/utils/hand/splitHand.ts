import { Tile } from '../../core/game-types/Tile'
import { excludeTiles, hasIdenticalTiles, hasTiles, isTheSameTile } from '../tiles/tileContains'
import { SuitType, TILE_TYPES_STR } from '../../core/game-types/SuitType'
import { sortTiles } from '../game/sortTiles'
import { tileToString } from '../tiles/tileToString'

export type MeldTileGroup = [Tile, Tile, Tile]
export type TwoTilesGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
export type SingleTileGroup = [Tile]

export type MeldVariant = {
    sequences: MeldTileGroup[]

    triplets: MeldTileGroup[]

    /**
     * tiles we are not using in melds
     */
    remainingTiles: Tile[]
}

export type GroupingVariant = {
    sequences: TwoTilesGroup[]
    pairs: TwoTilesGroup[]
    uselessTiles: Tile[]
}

export function splitToMelds(all: Tile[]): MeldVariant[] {
    const allVariants = splitTiles(all, getAllMeldsForTile)

    const result: MeldVariant[] = []
    allVariants.forEach(groupingVariant => {
        const sequences: MeldTileGroup[] = []
        const triplets: MeldTileGroup[] = []
        const remainingTiles: Tile[] = []

        groupingVariant.forEach(group => {
            if (group.length === 3) {
                if (group[0].value === group[1].value) {
                    triplets.push(group)
                } else {
                    sequences.push(group)
                }
            } else {
                remainingTiles.push(group[0])
            }
        })

        // we might have duplicates even for simple structures and it's easier to check it here than in splitTiles
        const alreadyAdded = result.some(
            x =>
                splittingVariantToString(x.sequences, x.triplets, x.remainingTiles) ===
                splittingVariantToString(sequences, triplets, remainingTiles)
        )

        if (!alreadyAdded) {
            result.push({
                sequences,
                triplets,
                remainingTiles,
            })
        }
    })

    return result
}

/**
 * split remaining tiles to pairs and unfinished sequential melds
 */
export function splitToGroups(allTiles: Tile[]): GroupingVariant[] {
    const allVariants = splitTiles(allTiles, getAllGroupsForTile)

    const result: GroupingVariant[] = []
    allVariants.map(groupingVariant => {
        const pairs: TwoTilesGroup[] = []
        const sequences: TwoTilesGroup[] = []
        const uselessTiles: Tile[] = []

        groupingVariant.forEach(group => {
            if (group.length === 2) {
                if (isTheSameTile(group[0], group[1])) {
                    pairs.push(group)
                } else {
                    sequences.push(group)
                }
            } else {
                uselessTiles.push(group[0])
            }
        })

        // we might have duplicates even for simple structures and it's easier to check it here than in splitTiles
        const alreadyAdded = result.some(
            x =>
                splittingVariantToString(x.pairs, x.sequences, x.uselessTiles) ===
                splittingVariantToString(pairs, sequences, uselessTiles)
        )

        if (!alreadyAdded) {
            result.push({
                pairs,
                sequences,
                uselessTiles,
            })
        }
    })

    return result
}

function groupToString(tiles: Tile[], printType: boolean): string {
    const typeStr = printType ? TILE_TYPES_STR[tiles[0].type] : ''
    return tiles.map(tile => tile.value).join('') + typeStr
}

export function splittingVariantToString<T extends Tile[]>(
    groups1: T[],
    groups2: T[],
    remainingTiles: Tile[],
    printType: boolean = false
) {
    const groupStr = [...groups1, ...groups2].map(x => groupToString(x, printType)).sort()
    const separatedTiles = sortTiles(remainingTiles).map(x => tileToString(x, printType))

    return [...groupStr, ...separatedTiles].join(' ')
}

function getNextTilesForSequence(tile: Tile): SingleTileGroup | TwoTilesGroup | undefined {
    if (tile.type === SuitType.JIHAI) {
        return undefined
    }

    const nextTile = {
        type: tile.type,
        value: tile.value + 1,
    }

    const nextNextTile = {
        type: tile.type,
        value: tile.value + 2,
    }

    if (tile.value <= 7) {
        return [nextTile, nextNextTile]
    } else if (tile.value <= 8) {
        return [nextTile]
    }

    return undefined
}

/**
 * only 1 group because we won't have any melds in remaining tiles after splitting
 */
function getSequentialGroup(tile: Tile, remainingTiles: Tile[]): TwoTilesGroup | undefined {
    const nextTilesForSequence = getNextTilesForSequence(tile)
    if (nextTilesForSequence === undefined) {
        return undefined
    }

    const [tile2] = nextTilesForSequence
    if (hasTiles(remainingTiles, tile2)) {
        // waits like 12_, 23_
        return [tile, tile2]
    }

    if (nextTilesForSequence.length === 2) {
        const [, tile3] = nextTilesForSequence
        if (hasTiles(remainingTiles, tile3)) {
            // waits like 1_3
            return [tile, tile3]
        }
    }

    return undefined
}

function getPair(tile: Tile, remainingTiles: Tile[]): TwoTilesGroup | undefined {
    const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
    if (hasPair) {
        return [tile, tile]
    }
    return undefined
}

function getAllMeldsForTile(tile: Tile, remainingTiles: Tile[]): MeldTileGroup[] {
    const melds: MeldTileGroup[] = []

    const hasPon = hasIdenticalTiles(remainingTiles, tile, 3)
    if (hasPon) {
        melds.push([tile, tile, tile])
    }

    const nextTilesForSequence = getNextTilesForSequence(tile)
    if (nextTilesForSequence !== undefined && nextTilesForSequence.length === 2) {
        const [tile2, tile3] = nextTilesForSequence
        if (hasTiles(remainingTiles, tile2) && hasTiles(remainingTiles, tile3)) {
            // sequential meld (123)
            melds.push([tile, tile2, tile3])
        }
    }

    return melds
}

function splitTiles<T extends Tile[]>(
    allTiles: Tile[],
    getTileGroups: (tile: Tile, remainingTiles: Tile[]) => T[]
): (T | SingleTileGroup)[][] {
    if (allTiles.length === 0) {
        return []
    }

    const variants: (T | SingleTileGroup)[][] = []

    let previousTile: Tile | undefined = undefined
    for (let i = 0; i < allTiles.length && allTiles.length > 1; i++) {
        const tile = allTiles[i]

        if (previousTile !== undefined && isTheSameTile(previousTile, tile)) {
            continue
        }

        const allPossibleGroups = getTileGroups(tile, allTiles)

        const groupVariants: (T | SingleTileGroup)[][] = []

        allPossibleGroups.forEach(group => {
            const remainingTiles: Tile[] = excludeTiles(allTiles, ...group)
            const nextVariants = splitTiles(remainingTiles, getTileGroups)

            if (nextVariants.length === 0) {
                groupVariants.push([group])
            } else {
                nextVariants.forEach(variant => {
                    groupVariants.push([group, ...variant])
                })
            }
        })

        variants.push(...groupVariants)
        previousTile = tile
    }

    if (variants.length === 0) {
        return [allTiles.map(x => [x])]
    }

    return variants
}

function getAllGroupsForTile(tile: Tile, remainingTiles: Tile[]): TwoTilesGroup[] {
    const groups: TwoTilesGroup[] = []

    const pair = getPair(tile, remainingTiles)
    if (pair !== undefined) {
        groups.push(pair)
    }

    const sequentialGroup = getSequentialGroup(tile, remainingTiles)
    if (sequentialGroup !== undefined) {
        groups.push(sequentialGroup)
    }

    return groups
}
