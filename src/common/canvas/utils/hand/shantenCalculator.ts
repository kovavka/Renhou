import {Tile} from "../../core/game-types/Tile";
import {SuitStructure, WaitPatternType, WaitVariant} from "./types";
import {SuitType} from "../../core/game-types/SuitType";

// todo wait for 5th tile

export function getShanten(tiles: Tile[]) {
    // if (tiles.length !== 1 && tiles.length !== 4 && tiles.length !== 7 && tiles.length !== 10 && tiles.length !== 13) {
    //     return []
    // }

    const [manTiles, pinTiles, souTiles, honorTiles] = splitHand(tiles)
}


function processNumberedSuit(tiles: number[]): SuitStructure[] {
    const emptyStructure = {
        sets: [],
        unusedTiles: [],
        waitPatterns: [],
        pair: undefined,
    }
    return processSuit(emptyStructure, tiles, [])
}

function processSuit(structure: SuitStructure, remainingTiles: number[], allVariations: SuitStructure[]): SuitStructure[] {
    if (remainingTiles.length <= 4) {

    }
}

function variationExist(): boolean {

}

function findPairsAndWaits(tiles: number[], isNumberedSuit: boolean): WaitVariant[] {
    const groups = groupIdenticalTilesForSuit(tiles)
    if (groups.some(x => x.amount === 4)) {
        // we can't wait for 5th tiles, so it's an identical meld and unused tile
        // todo ask
        // todo maybe handle it in melds processing?
    }

    if (groups.length === 1) {
        const singleGroup = groups[0]
        if (singleGroup.amount === 1) {
            return [
                {
                    separatedTiles: tiles,
                    meldsToComplete: [],
                    pair: undefined,
                }
            ]
        }

        if (singleGroup.amount !== 2) {
            throw new Error('it should process 3 or 4 identical tiles as meld')
        }
        return [
            {
                separatedTiles: [],
                meldsToComplete: [],
                pair: singleGroup.value,
            }
        ]
    }

    const variants: WaitVariant[] = []
    let remainingTiles = tiles.slice()

    while (remainingTiles.length > 0) {
        const tile = remainingTiles[0]
        const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
        if (hasPair) {
            variants.push({
                separatedTiles: [],
                meldsToComplete: [[tile, tile]],
                pair: tile
            })
        }
    }

    return variants
}

function getAllWaitsForTile(tile: number, remainingTiles: number[], isNumberedSuit: boolean, waitVariant): void {
    const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
    if (hasPair) {
        const nextRemainingTiles = remainingTiles.slice()
        const newVariant: WaitVariant = {
            pair: tile,
            separatedTiles: [],
            meldsToComplete: []
        }
    }

    {
        const newVariant: WaitVariant = {
            pair: undefined,
            separatedTiles: [tile],
            meldsToComplete: [],
        }
    }

    if (isNumberedSuit) {
        remainingTiles = getRemainingTiles(remainingTiles, tile)

        if (tile < 9) {
            const nextTile = tile + 1
            const hasNextNumber = hasTiles(remainingTiles, nextTile)
            if (hasNextNumber) {
                const newVariant: WaitVariant = {
                    pair: undefined,
                    separatedTiles: [],
                    meldsToComplete: [[tile, nextTile]]
                }
            }
        }
        if (tile < 9) {
            const nextNextTile = tile + 2
            const hasNextNumber = hasTiles(remainingTiles, nextNextTile)
            if (hasNextNumber) {
                const newVariant: WaitVariant = {
                    pair: undefined,
                    separatedTiles: [],
                    meldsToComplete: [[tile, nextNextTile]]
                }
            }
        }

    }

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

function getRemainingTiles(all: number[], ...tilesToExclude: number[]): number[] {
    let str = all.join('')
    for (const tile of tilesToExclude) {
        str = str.replace(tile.toString(), '')
    }
    return str.split('').map(x => Number(x))
}

function groupIdenticalTilesForSuit(tiles: number[]): {value: number, amount: number}[] {
    return tiles.reduce<{value: number, amount: number}[]>((acc, value) => {
        const element = acc.find(x => x.value === value)
        if (element !== undefined) {
            const index = acc.indexOf(element)
            acc[index].amount = acc[index].amount + 1
        } else {
            acc.push({
                value,
                amount: 1,
            })
        }

        return acc
    }, [])
}

function getPairs(suitTiles: number[], onlyUnique: boolean): number[] {
    const unique = suitTiles.filter((x, i, a) => a.indexOf(x) == i)
    const pairs: number[] = []
    for (let tile of unique) {
        if (!onlyUnique && hasIdenticalTiles(suitTiles, tile, 4)) {
            pairs.push(tile)
            pairs.push(tile)
        } else if (hasIdenticalTiles(suitTiles, tile, 2)) {
            pairs.push(tile)
        }
    }

    return pairs
}

function hasTiles(suitTiles: number[], ...tiles: number[]): boolean {
    return tiles.every(tile => suitTiles.includes(tile))
}

function hasIdenticalTiles(suitTiles: number[], tile: number, amount: number): boolean {
    return suitTiles.filter(x => x === tile).length >= amount
}
