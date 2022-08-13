import {Tile} from "../../core/game-types/Tile";
import {excludeTiles, hasIdenticalTiles, hasTiles} from "../tiles/tileContains";
import {SuitType} from "../../core/game-types/SuitType";
import {sortTiles} from "../game/sortTiles";

export type MeldTileGroup = [Tile, Tile, Tile]
export type TwoTilesGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
export type SingleTileGroup = [Tile]

type TileGroup = MeldTileGroup | SingleTileGroup
type SplittingVariant = TileGroup[]

export type HandSpittingInfo = {
    melds: MeldTileGroup[]

    /**
     * tiles we are not using in melds
     */
    remainingTiles: Tile[]
}

type GroupingVariant = {
    sequence: TwoTilesGroup[]
    pairs: TwoTilesGroup[]
    remainingTiles: Tile[]
}

const TILE_TYPES = {
    [SuitType.MANZU]: 'm',
    [SuitType.PINZU]: 'p',
    [SuitType.SOUZU]: 's',
    [SuitType.JIHAI]: 'z',
}

export function splitHand(all: Tile[]): HandSpittingInfo[] {
    const allVariants = splitTiles(all)

    const result: HandSpittingInfo[] = []
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

        const newInfo: HandSpittingInfo = {
            melds,
            remainingTiles,
        }

        // we might have duplicates for complicated hand like chinitsu
        const alreadyAdded = result.some(x => splitInfoToString(x) === splitInfoToString(newInfo))

        if (!alreadyAdded) {
            result.push(newInfo)
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

export function splitInfoToString(info: HandSpittingInfo, printType: boolean = false): string {
    const melds = info.melds.map(x => groupToString(x, printType))
    const separatedTiles = sortTiles(info.remainingTiles).map(x => tileToString(x, printType))

    const all = []
    if (melds.length) all.push(...melds)
    if (separatedTiles.length) all.push(...separatedTiles)

    return [...melds.sort(), ...separatedTiles].join(' ')
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

function splitTiles(allTiles: Tile[]): SplittingVariant[] {
    if (allTiles.length === 0) {
        return []
    }

    const variants: SplittingVariant[] = []

    for (let i = 0; i < allTiles.length && allTiles.length > 1; i++) {
        const tile = allTiles[i]
        const allPossibleMelds = getAllMeldsForTile(tile, allTiles)

        const groupVariants: SplittingVariant[] = []

        allPossibleMelds.forEach(group => {
            const remainingTiles: Tile[] = excludeTiles(allTiles, ...group)
            const nextVariants = splitTiles(remainingTiles)

            if (nextVariants.length === 0) {
                groupVariants.push([group])
            } else {
                nextVariants.forEach(variant => {
                    groupVariants.push([group, ...variant])
                })
            }
        })

        variants.push(...groupVariants)
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

    return []
}

/**
 * split remaining tiles to pairs and unfinished sequential melds
 */
export function splitToGroups(allTiles: Tile[]): GroupingVariant[] {
    if (allTiles.length === 0) {
        return []
    }

    const variants: GroupingVariant[] = []

    for (let i = 0; i < allTiles.length && allTiles.length > 1; i++) {
        const tile = allTiles[i]
        const allPossibleGroups = getAllGroupsForTile(tile, allTiles)

        const combinedGroups: TwoTilesGroup[] = []
        const singleTiles: Tile[] = []

        allPossibleGroups.forEach(group => {
            const remainingTiles: Tile[] = excludeTiles(allTiles, ...group)
            const nextVariants = splitToGroups(remainingTiles)

            if (nextVariants.length === 0) {
                combinedGroups.push(group)
            } else {
                nextVariants.forEach(variant => {
                    combinedGroups.push(...variant.groups)
                    singleTiles.push(...variant.remainingTiles)
                })
            }
        })

        variants.push({
            groups: combinedGroups,
            remainingTiles: singleTiles,
        })
    }

    if (variants.length === 0) {
        return [{
            groups: [],
            remainingTiles: allTiles,
        }]
    }

    return variants
}

