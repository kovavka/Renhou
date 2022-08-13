import {Tile} from "../../core/game-types/Tile";
import {excludeTiles, hasIdenticalTiles, hasTiles, isTheSameTile} from "../tiles/tileContains";
import {SuitType} from "../../core/game-types/SuitType";
import isEqual from "lodash/isEqual";

export type MeldTileGroup = [Tile, Tile, Tile]
export type TwoTilesGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
export type SingleTileGroup = [Tile]

type TileGroup = MeldTileGroup | TwoTilesGroup | SingleTileGroup
type SplittingVariant = TileGroup[]

export type HandSpittingInfo = {
    melds: MeldTileGroup[]

    groups: TwoTilesGroup[]

    /**
     * tiles we can not use to complete melds
     */
    separatedTiles: Tile[]
}

const TILE_TYPES = {
    [SuitType.MANZU]: 'm',
    [SuitType.PINZU]: 'p',
    [SuitType.SOUZU]: 's',
    [SuitType.JIHAI]: 'z',
}

export function splitHand(all: Tile[]): HandSpittingInfo[] {
    const allVariants = getAllVariants(all, [])

    const result: HandSpittingInfo[] = []
    allVariants.forEach((groupingVariant) => {
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

        const hasSplitMelds = separatedTiles.some(x => {
            return meldsToComplete.some(y => isMeld([x, y[0], y[1]]))
        })

        // we don't need variants where we split groups and melds to separated tiles
        const isSplitTooMuch = hasGroups(separatedTiles) || hasSplitMelds

        if (!isSplitTooMuch) {
            const newInfo = {
                melds,
                separatedTiles,
                groups: meldsToComplete,
            }

            // we might have duplicates for complicated hand like chinitsu
            const alreadyAdded = result.some(x => splitInfoToString(x) === splitInfoToString(newInfo))

            if (!alreadyAdded) {
                result.push(newInfo)
            }
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
    const groups = info.groups.map(x => groupToString(x, printType))
    const separatedTiles = info.separatedTiles.map(x => tileToString(x, printType))

    const all = []
    if (melds.length) all.push(...melds)
    if (groups.length) all.push(...groups)
    if (separatedTiles.length) all.push(...separatedTiles)

    return [...melds, ...groups, ...separatedTiles].sort().join(' ')
}

function hasGroups(allTiles: Tile[]): boolean {
    if (allTiles.length <= 1) {
        return false
    }

    return allTiles.some(tile => getAllGroupsForTile(tile, allTiles).length > 0)
}

function isMeld(tiles: MeldTileGroup): boolean {
    if (tiles[0].type !== tiles[1].type || tiles[0].type !== tiles[2].type) {
        return false
    }

    if (hasIdenticalTiles(tiles, tiles[0], 3)) {
        // pon
        return true
    }

    if (tiles[0].type === SuitType.JIHAI) {
        return false
    }

    const sorted = tiles.sort()
    return sorted[2].value - sorted[1].value === 1 && sorted[1].value - sorted[0].value === 1
}

function getAllGroupsForTile(tile: Tile, remainingTiles: Tile[]): (MeldTileGroup | TwoTilesGroup)[] {
    const groups: (MeldTileGroup | TwoTilesGroup)[] = []

    const hasPon = hasIdenticalTiles(remainingTiles, tile, 3)
    if (hasPon) {
        groups.push([tile, tile, tile])
    }
    const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
    if (hasPair) {
        groups.push([tile, tile])
    }

    const isNumberedSuit = tile.type !== SuitType.JIHAI
    if (isNumberedSuit) {
        // sequential meld (123)
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
        const hasSequentialMeld = hasNextNumber && hasNextNextNumber // like 123

        if (hasSequentialMeld) {
            groups.push([tile, nextTile, nextNextTile])
        }

        if (hasNextNumber) {
            // waits like 12_, 23_
            groups.push([tile, nextTile])
        }

        if (hasNextNextNumber) {
            // waits like 1_3
            groups.push([tile, nextNextTile])
        }
    }

    return groups
}

/**
 * Get all possible variation of hand developing
 */
function getAllVariants(remainingTiles: Tile[], currentVariant: SplittingVariant): SplittingVariant[] {
    if (remainingTiles.length === 0) {
        return [currentVariant]
    }

    const tile = remainingTiles[0]
    const variants: SplittingVariant[] = []


    const allPossibleGroups: TileGroup[] = getAllGroupsForTile(tile, remainingTiles)

    // just 1 separated tile
    allPossibleGroups.push([tile])

    allPossibleGroups.forEach(group => {
        const nextRemaining: Tile[] = excludeTiles(remainingTiles, ...group)
        const nextVariants = getAllVariants(nextRemaining, [group])
        variants.push(...nextVariants)
    })

    return variants.map(variant => currentVariant.concat(variant))
}
