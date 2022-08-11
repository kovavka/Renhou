import {Tile} from "../../core/game-types/Tile";
import {HandStructureVariants, ShantenInfo, SuitStructure} from "./types";
import {SuitType} from "../../core/game-types/SuitType";

// todo what is we wait for 5th tile


export function getShantenInfos(tiles: Tile[]): ShantenInfo[] {
    const [manTiles, pinTiles, souTiles, honorTiles] = splitHand(tiles)

    const manVariants = processSuit(manTiles, true)
    const pinVariants = processSuit(pinTiles, true)
    const souVariants = processSuit(souTiles, true)
    const honorVariants = processSuit(honorTiles, false)

}

function calcShantenForVariant(manVariant: SuitStructure, pinVariant: SuitStructure, souVariant: SuitStructure, honorVariant: SuitStructure): number {
    const manCount = manVariant.separatedTiles.length + manVariant.meldsToComplete.length
    const pinCount = pinVariant.separatedTiles.length + pinVariant.meldsToComplete.length
    const souCount = souVariant.separatedTiles.length + souVariant.meldsToComplete.length
    const honorCount = honorVariant.separatedTiles.length + honorVariant.meldsToComplete.length

    const shanten = manCount + pinCount + souCount + honorCount
    return shanten < 7 ? shanten : -1
}

function processSuit(suitTiles: number[],  isNumberedSuit: boolean): SuitStructure[] {
    const allVariants = getAllVariantsForSuit(suitTiles, isNumberedSuit, [])
    return allVariants.map((groupingVariant) => {
        const melds: ([number, number, number])[] = []
        let pair: number | undefined
        const separatedTiles: number[] = []
        const meldsToComplete: ([number, number])[] = []

        groupingVariant.forEach(group => {
            if (group.length === 3) {
                melds.push(group)
            } else if (group.length === 2) {
                if (groupingVariant.length === 0 && group[0] === group[1]) {
                    // the only pair we have
                    pair = group[0]
                } else {
                    meldsToComplete.push(group)
                }
            } else {
                separatedTiles.push(group[0])
            }
        })

        return {
            melds,
            pair,
            separatedTiles,
            meldsToComplete,
        }
    })
}

type TilesGroup = [number] | [number, number] | [number, number, number]
type GroupingVariant = TilesGroup[]

/**
 * Get all possible variation of hand developing in current suit.
 * Separated tiles will be added to result only if they are not a part of any group
 */
function getAllVariantsForSuit(remainingTiles: number[], isNumberedSuit: boolean, currentVariant: GroupingVariant): GroupingVariant[] {
    if (remainingTiles.length === 0) {
       return [currentVariant]
    }

    const variants: GroupingVariant[] = []
    const tile = remainingTiles[0]

    let hasGroupToProcess = false

    const hasPair = hasIdenticalTiles(remainingTiles, tile, 2)
    if (hasPair) {
        const newGroup: TilesGroup = [tile, tile]
        const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
        const nextVariants = getAllVariantsForSuit(nextRemaining, isNumberedSuit, [newGroup])
        variants.push(...nextVariants)
        hasGroupToProcess = true
    }

    const hasPon = hasIdenticalTiles(remainingTiles, tile, 3)
    if (hasPon) {
        // identical meld (222)
        const newGroup: TilesGroup = [tile, tile, tile]
        const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
        const nextVariants = getAllVariantsForSuit(nextRemaining, isNumberedSuit, [newGroup])
        variants.push(...nextVariants)
        hasGroupToProcess = true
    }

    if (isNumberedSuit) {
        const nextTile = tile + 1
        const nextNextTile = tile + 2

        const hasNextNumber = tile < 9 && hasTiles(remainingTiles, nextTile)
        const hasNextNextNumber = tile < 8 && hasTiles(remainingTiles, nextNextTile)

        if (hasNextNumber) {
            // waits like 12_, 23_
            const newGroup: TilesGroup = [tile, nextTile]
            const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariantsForSuit(nextRemaining, isNumberedSuit, [newGroup])
            variants.push(...nextVariants)
        }

        if (hasNextNextNumber) {
            // waits like 1_3
            const newGroup: TilesGroup = [tile, nextNextTile]
            const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariantsForSuit(nextRemaining, isNumberedSuit, [newGroup])
            variants.push(...nextVariants)
        }

        if (hasNextNumber && hasNextNextNumber) {
            // sequential meld (123)
            const newGroup: TilesGroup = [tile, nextTile, nextNextTile]
            const nextRemaining = getRemainingTiles(remainingTiles, ...newGroup)
            const nextVariants = getAllVariantsForSuit(nextRemaining, isNumberedSuit, [newGroup])
            variants.push(...nextVariants)
        }

        hasGroupToProcess = hasGroupToProcess || hasNextNumber || hasNextNextNumber
    }

    if (!hasGroupToProcess) {
        // just 1 separated tile
        const nextRemaining = remainingTiles.slice(1)
        const newGroup: TilesGroup = [tile]
        const nextVariants = getAllVariantsForSuit(nextRemaining, isNumberedSuit, [newGroup])
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
