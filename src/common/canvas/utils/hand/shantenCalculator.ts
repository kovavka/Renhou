import {Tile} from "../../core/game-types/Tile";
import {HandStructure, IncompleteMeldTileGroup, MeldTileGroup, ShantenInfo, SingleTileGroup} from "./types";
import {SuitType} from "../../core/game-types/SuitType";

// todo what is we wait for 5th tile

export function getShantenInfos(tiles: Tile[]) {
    const [manTiles, pinTiles, souTiles, honorTiles] = splitHand(tiles)

    const handStructureVariants = processTiles(tiles)
    // honorVariant.separatedTiles.length + honorVariant.meldsToComplete.length
    // return shanten < 7 ? shanten : -1

    return handStructureVariants
}

function processTiles(all: Tile[]): HandStructure[] {
    const allVariants = getAllVariants(all, [])
    return allVariants.map((groupingVariant) => {
        const melds: MeldTileGroup[] = []
        let pair: Tile | undefined
        const separatedTiles: Tile[] = []
        const meldsToComplete: IncompleteMeldTileGroup[] = []

        let possiblePairTile: Tile | undefined

        groupingVariant.forEach(group => {
            if (group.length === 3) {
                melds.push(group)
            } else if (group.length === 2) {
                if (possiblePairTile === undefined && group[0] === group[1]) {
                    // the only pair we have
                    possiblePairTile = group[0]
                } else {
                    meldsToComplete.push(group)
                }
            } else {
                separatedTiles.push(group[0])
            }
        })

        if (possiblePairTile !== undefined) {
            if (meldsToComplete.length > 0) {
                meldsToComplete.push([possiblePairTile, possiblePairTile])
            } else {
                pair = possiblePairTile
            }
        }

        return {
            melds,
            pair,
            separatedTiles,
            meldsToComplete,
        }
    })
}

type TilesGroup = MeldTileGroup | IncompleteMeldTileGroup | SingleTileGroup
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

    {
        // just 1 separated tile
        const nextRemaining = remainingTiles.slice(1)
        const newGroup: TilesGroup = [tile]
        const nextVariants = getAllVariants(nextRemaining, [newGroup])
        variants.push(...nextVariants)
    }

    return variants.map(variant => currentVariant.concat(variant))
}

function splitHand(tiles: Tile[]): [number[], number[], number[], number[]] {
    const manTiles: number[] = []
    const pinTiles: number[] = []
    const souTiles: number[] = []
    const honorTiles: number[] = []

    tiles.forEach(tile => {
        switch (tile.type) {
            case SuitType.MANZU:
                manTiles.push(tile.value)
                break
            case SuitType.PINZU:
                pinTiles.push(tile.value)
                break
            case SuitType.SOUZU:
                souTiles.push(tile.value)
                break
            case SuitType.JIHAI:
                honorTiles.push(tile.value)
                break
        }
    })

    return [
        manTiles,
        pinTiles,
        souTiles,
        honorTiles,
    ]
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

function hasIdenticalTiles(all: Tile[], tile: Tile, amount: number): boolean {
    return all.filter(x => x.type === tile.type && x.value === tile.value).length >= amount
}
