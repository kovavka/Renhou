import {Tile} from "../../core/game-types/Tile";
import {excludeTiles, hasIdenticalTiles, hasTiles, isTheSameTile} from "../tiles/tileContains";
import {SuitType} from "../../core/game-types/SuitType";
import {sortTiles} from "../game/sortTiles";

export type MeldTileGroup = [Tile, Tile, Tile]
export type TwoTilesGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
export type SingleTileGroup = [Tile]

export type MeldVariant = {
    melds: MeldTileGroup[]

    /**
     * tiles we are not using in melds
     */
    remainingTiles: Tile[]
}

export type GroupingVariant = {
    sequences: TwoTilesGroup[]
    pairs: TwoTilesGroup[]
    remainingTiles: Tile[]
}

const TILE_TYPES = {
    [SuitType.MANZU]: 'm',
    [SuitType.PINZU]: 'p',
    [SuitType.SOUZU]: 's',
    [SuitType.JIHAI]: 'z',
}

export function splitHand(all: Tile[]): MeldVariant[] {
    const allVariants = splitTiles(all, getAllMeldsForTile)

    const result: MeldVariant[] = []
    allVariants.forEach((groupingVariant) => {
        const melds: MeldTileGroup[] = []
        const remainingTiles: Tile[] = []

        groupingVariant.forEach(group => {
            if (group.length === 3) {
                melds.push(group)
            } else {
                remainingTiles.push(group[0])
            }
        })

        // we might have duplicates even for simple structures and it's easier to check it here than in splitTiles
        const alreadyAdded = result.some(x => handInfoToString(x.melds, x.remainingTiles) === handInfoToString(melds, remainingTiles))

        if (!alreadyAdded) {
            result.push({
                melds,
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
    allVariants.map((groupingVariant) => {
        const pairs: TwoTilesGroup[] = []
        const sequences: TwoTilesGroup[] = []
        const remainingTiles: Tile[] = []

        groupingVariant.forEach(group => {
            if (group.length === 2) {
                if (isTheSameTile(group[0], group[1])) {
                    pairs.push(group)
                } else {
                    sequences.push(group)
                }
            } else {
                remainingTiles.push(group[0])
            }
        })

        // we might have duplicates even for simple structures and it's easier to check it here than in splitTiles
        const alreadyAdded = result.some(x =>
            handInfoToString([...x.pairs, ...x.sequences], x.remainingTiles) === handInfoToString([...pairs, ...sequences], remainingTiles)
        )

        if (!alreadyAdded) {
            result.push({
                pairs,
                sequences,
                remainingTiles,
            })
        }
    })

    return result
}

function groupToString(tiles: Tile[], printType: boolean): string {
    const typeStr = printType ? TILE_TYPES[tiles[0].type] : ''
    return tiles.map(tile => tile.value).join('') + typeStr
}

function tileToString(tile: Tile, printType: boolean): string {
    const typeStr = printType ? TILE_TYPES[tile.type] : ''
    return tile.value + typeStr
}

export function handInfoToString(groups: MeldTileGroup[] | TwoTilesGroup[], remainingTiles: Tile[], printType: boolean = false): string {
    const groupsStr = groups.map(x => groupToString(x, printType))
    const separatedTiles = sortTiles(remainingTiles).map(x => tileToString(x, printType))

    return [...groupsStr.sort(), ...separatedTiles].join(' ')
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

function splitTiles<T extends Tile[]>(allTiles: Tile[], getTileGroups: (tile: Tile, remainingTiles: Tile[]) => T[]): T[][] {
    if (allTiles.length === 0) {
        return []
    }

    const variants: T[][] = []

    let previousTile: Tile | undefined = undefined
    for (let i = 0; i < allTiles.length && allTiles.length > 1; i++) {
        const tile = allTiles[i]

        if (previousTile !== undefined && isTheSameTile(previousTile, tile)) {
            continue
        }

        const allPossibleGroups = getTileGroups(tile, allTiles)

        const groupVariants: T[][] = []

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
        return [allTiles.map(x => [x] as T)]
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
