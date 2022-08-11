import {Tile} from "../../core/game-types/Tile";
import {SuitStructure, WaitPatternType} from "./types";
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

type WaitPairStructure =  Omit<SuitStructure, 'melds'>
function findPairsAndWaits(tiles: number[], isNumberedSuit: boolean): WaitPairStructure[] {
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
                    unusedTiles: [],
                    waitPatterns: [{
                        tiles,
                        type: WaitPatternType.TANKI
                    }],
                    pair: undefined,
                }
            ]
        }

        if (singleGroup.amount !== 2) {
            throw new Error('it should process 3 or 4 identical tiles as meld')
        }
        return [
            {
                unusedTiles: [],
                waitPatterns: [],
                pair: singleGroup.value,
            }
        ]
    }

    const result: WaitPairStructure[] = []

    for (let i = 0; i < groups.length - 1; i++) {
        const groupA = groups[i]
        for (let j = i + 1; i < groups.length; j++) {
            const groupB = groups[j]
            const unusedTiles = tiles.filter(x => x !== groupA.value && x !== groupB.value)
            // result.push({
            //     waitPatterns: [{
            //         tiles: [groupA.value, groupA.value, groupB.value, groupB.value],
            //         type: WaitPatternType.SHANPON,
            //     }],
            //     unusedTiles,
            // })

        }
    }

    groups.forEach(group => {
        const pai: WaitPairStructure = {
            unusedTiles: [],
            waitPatterns: [{
                tiles,
                type: WaitPatternType.TANKI
            }],
            pair: undefined,
        }

        result.push({

        })
    })
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
