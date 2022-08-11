import {Tile} from "../../core/game-types/Tile";
import {SuitType} from "../../core/game-types/SuitType";

enum WaitPatternType {
    TANKI,
    SHANPON,
    RYANMEN,
    KANCHAN, // 13
    PENCHAN, // 12, 89
}

interface WaitPattern {
    tiles: number[]
    type: WaitPatternType
}

interface SuitStructure {
    sets: number[][]
    unusedTiles: number[]
    waitPatterns: WaitPattern[]
    pair: number | undefined
}

interface HandStructure {
    manTiles: number[]
    pinTiles: number[]
    souTiles: number[]
    honorTiles: number[]
}

interface HandWaitStructure {
    man?: SuitStructure
    pin?: SuitStructure
    sou?: SuitStructure
    honors?: SuitStructure
}

export function isTempai(tiles: Tile[]): boolean {
    if (tiles.length !== 1 && tiles.length !== 4 && tiles.length !== 7 && tiles.length !== 10 && tiles.length !== 13) {
        return false
    }

    if (isChiitoiTempai(tiles) || isKokushiMusoTempai(tiles)) {
        return true
    }

    return false

    const hand = getHand(tiles)
    const {manTiles, pinTiles, souTiles, honorTiles} = hand

    const manSuits = processSuit([], getSimpleSuitStructure(manTiles))
    const pinSuits = processSuit([], getSimpleSuitStructure(pinTiles))
    const souSuits = processSuit([], getSimpleSuitStructure(souTiles))
    const honors = processSuit([], getSimpleSuitStructure(honorTiles))

    const possibleManSuits = getPossibleStructures(manSuits)
    const possiblePinSuits = getPossibleStructures(pinSuits)
    const possibleSouSuits = getPossibleStructures(souSuits)
    const possibleHonors = getPossibleStructures(honors)


    let handWaitStructures: HandWaitStructure[] =
        processPossibleManSuits(possibleManSuits, possiblePinSuits, possibleSouSuits, possibleHonors)

    for (let handWaitStructure of handWaitStructures) {
        if (isReadyHand(handWaitStructure)) {
            return true
        }
    }

    return false
}

function isReadyHand(hand: HandWaitStructure) {
    let pairsCount = 0
    let waits: WaitPattern[] = []
    if (hand.man) {
        if (hand.man.pair) {
            pairsCount++
        }
        waits.push(...hand.man.waitPatterns)
    }
    if (hand.pin) {
        if (hand.pin.pair) {
            pairsCount++
        }
        waits.push(...hand.pin.waitPatterns)
    }
    if (hand.sou) {
        if (hand.sou.pair) {
            pairsCount++
        }
        waits.push(...hand.sou.waitPatterns)
    }
    if (hand.honors) {
        if (hand.honors.pair) {
            pairsCount++
        }
        waits.push(...hand.honors.waitPatterns)
    }

    if (pairsCount > 2 || waits.length > 2) {
        return false
    }

    if (pairsCount === 2 && waits.length === 0) {
        return true //SHANPON
    }

    if (
        pairsCount === 0 &&
        ((waits.length === 1 && waits[0].type === WaitPatternType.TANKI) ||
            (waits.length === 2 && waits.every(pattern => pattern.type === WaitPatternType.SHANPON)))
    ) {
        return true
    }

    if (
        pairsCount === 1 &&
        waits.length === 1 &&
        [WaitPatternType.KANCHAN, WaitPatternType.RYANMEN, WaitPatternType.PENCHAN].includes(waits[0].type)
    ) {
        return true
    }

    return false
}

function processPossibleManSuits(
    possibleManSuits: SuitStructure[],
    possiblePinSuits: SuitStructure[],
    possibleSouSuits: SuitStructure[],
    possibleHonors: SuitStructure[]
) {
    if (!possibleManSuits.length) {
        return processPossiblePinSuits(undefined, possiblePinSuits, possibleSouSuits, possibleHonors)
    }

    let handPatterns: HandWaitStructure[] = []
    for (let manStructure of possibleManSuits) {
        handPatterns.push(
            ...processPossiblePinSuits(manStructure, possiblePinSuits, possibleSouSuits, possibleHonors)
        )
    }
    return handPatterns
}

function processPossibleSouSuits(
    manStructure: SuitStructure | undefined,
    pinStructure: SuitStructure | undefined,
    possibleSouSuits: SuitStructure[],
    possibleHonors: SuitStructure[]
) {
    if (!possibleSouSuits.length) {
        return processPossibleHonors(manStructure, pinStructure, undefined, possibleHonors)
    }

    let handPatterns: HandWaitStructure[] = []
    for (let souStructure of possibleSouSuits) {
        handPatterns.push(...processPossibleHonors(manStructure, pinStructure, souStructure, possibleHonors))
    }
    return handPatterns
}

function processPossiblePinSuits(
    manStructure: SuitStructure | undefined,
    possiblePinSuits: SuitStructure[],
    possibleSouSuits: SuitStructure[],
    possibleHonors: SuitStructure[]
) {
    if (!possiblePinSuits.length) {
        return processPossibleSouSuits(manStructure, undefined, possibleSouSuits, possibleHonors)
    }

    let handPatterns: HandWaitStructure[] = []
    for (let pinStructure of possiblePinSuits) {
        handPatterns.push(...processPossibleSouSuits(manStructure, pinStructure, possibleSouSuits, possibleHonors))
    }
    return handPatterns
}

function processPossibleHonors(
    manStructure: SuitStructure | undefined,
    pinStructure: SuitStructure | undefined,
    souStructure: SuitStructure | undefined,
    possibleHonors: SuitStructure[]
) {
    if (!possibleHonors.length) {
        return [
            <HandWaitStructure>{
                man: manStructure,
                pin: pinStructure,
                sou: souStructure,
            },
        ]
    }

    let handPatterns: HandWaitStructure[] = []
    for (let honorStructure of possibleHonors) {
        handPatterns.push(<HandWaitStructure>{
            man: manStructure,
            pin: pinStructure,
            sou: souStructure,
            honors: honorStructure,
        })
    }

    return handPatterns
}

function getHand(tiles: Tile[]): HandStructure {
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

    return {
        manTiles,
        pinTiles,
        souTiles,
        honorTiles,
    }
}

function isChiitoiTempai(tiles: Tile[]): boolean {
    if (tiles.length !== 13) {
        return false
    }

    return groupIdenticalTiles(tiles).length === 7
}

function isKokushiMusoTempai(tiles: Tile[]): boolean {
    if (tiles.length !== 13) {
        return false
    }

    if (tiles.some(tile => tile.value > 1 && tile.value < 9 && tile.type !== SuitType.JIHAI)) {
        return false
    }


    const duplicateGroups = groupIdenticalTiles(tiles)
    // it's either 12 single tiles + pair for one of them or 13 single tiles
    return duplicateGroups.length > 11
}

function getSimpleSuitStructure(tiles: number[]): SuitStructure {
    return <SuitStructure>{
        sets: [],
        unusedTiles: [],
        waitPatterns: [],
        pair: undefined
    }
}

function getPossibleStructures(structures: SuitStructure[] | undefined): SuitStructure[] {
    if (!structures || !structures.length) {
        return []
    }

    return structures.filter(structure => isPossibleWaitPatterns(structure.waitPatterns))
}

function isPossibleWaitPatterns(patterns: WaitPattern[]): boolean {
    if (!patterns.length) {
        return true
    }
    if (patterns.length > 2) {
        return false
    }
    if (
        patterns.length === 1 &&
        [WaitPatternType.TANKI, WaitPatternType.KANCHAN, WaitPatternType.RYANMEN, WaitPatternType.PENCHAN].includes(patterns[0].type)
    ) {
        return true
    }
    if (patterns.length === 2 && patterns.every(pattern => pattern.type === WaitPatternType.SHANPON)) {
        return true
    }
    return false
}

function processSuit(allVariations: SuitStructure[], structure: SuitStructure, remainingTiles: number[], isHonors: boolean = false): SuitStructure[] {
    if (structure.remainingTiles.length < 3) {
        structure.unusedTiles = structure.unusedTiles.concat(structure.remainingTiles)
        structure.remainingTiles = []
        // return [structure]
        trySetStructure(allVariations, structure, isHonors)
        return allVariations
    }

    let unusedTiles = structure.unusedTiles.slice(0)
    let remainingHand = structure.remainingTiles.slice(0)

    // let childStructures: HandStructure[] = []
    for (let tile of structure.remainingTiles) {
        let sets = getSets(tile, remainingHand)
        for (let set of sets) {
            let newStructure = <SuitStructure>{
                sets: structure.sets.length ? structure.sets.concat([set]) : [set],
                remainingTiles: nextTiles(remainingHand, ...set),
                unusedTiles: unusedTiles.slice(0),
            }
            processSuit(allVariations, newStructure, isHonors)
        }
        unusedTiles.push(tile)
        remainingHand = nextTiles(remainingHand, tile)
    }

    let parentStructure = <SuitStructure>{
        sets: structure.sets,
        remainingTiles: remainingHand,
        unusedTiles: unusedTiles,
    }
    trySetStructure(allVariations, parentStructure, isHonors)

    return allVariations
}

function trySetStructure(allVariations: SuitStructure[], structure: SuitStructure, isHonors: boolean) {
    let possibleStructures = allVariations.filter(
        x =>
            x.sets.length === structure.sets.length &&
            x.unusedTiles.join('') === structure.unusedTiles.join('') &&
            x.sets.map(n => n.join('')).join(' ') === structure.sets.map(n => n.join('')).join(' ')
    )

    if (!possibleStructures.length) {
        let data = getPairsAndWaitings(structure.unusedTiles, isHonors)
        structure.pair = data.pair
        structure.waitPatterns = data.waitPatterns
        allVariations.push(structure)
    }
}

function getPairsAndWaitings(
    unusedTiles: number[],
    isHonors: boolean
): {pair: number | undefined; waitPatterns: WaitPattern[]} {
    let allPairs = getPairs(unusedTiles, true)

    let availablePair: number | undefined
    let remainingTiles = unusedTiles.slice(0)

    //if wait pattern is shanpon or hand has too mush pairs or pair and other tiles -> there is no pair, it's waitings
    if (allPairs.length === 1) {
        availablePair = allPairs[0]
        let pairTile = allPairs[0]
        remainingTiles = nextTiles(remainingTiles, pairTile, pairTile)
    }
    if (!remainingTiles.length) {
        return {pair: availablePair, waitPatterns: []}
    }

    let waitPatterns: WaitPattern[] = []
    while (remainingTiles.length) {
        let waitPattern = getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
        waitPatterns.push(waitPattern)
        remainingTiles = nextTiles(remainingTiles, ...waitPattern.tiles)
    }

    //it's impossible hand contains pair and tanki wait
    if (waitPatterns.find(x => x.type === WaitPatternType.TANKI)) {
        availablePair = undefined
        waitPatterns = []
        remainingTiles = unusedTiles.slice(0)
        while (remainingTiles.length) {
            let waitPattern = getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
            waitPatterns.push(waitPattern)
            remainingTiles = nextTiles(remainingTiles, ...waitPattern.tiles)
        }
    }

    return {pair: availablePair, waitPatterns: waitPatterns}
}

function nextTiles(hand: number[], ...tiles: number[]): number[] {
    let str = hand.join('')
    for (let tile of tiles) {
        str = str.replace(tile.toString(), '')
    }
    return str.split('').map(x => Number(x))
}

function getSets(tile: number, str: number[]): number[][] {
    let sets: number[][] = []
    let chii = getChii(tile, str)
    if (chii) {
        sets.push(chii)
    }

    let pon = getPon(tile, str)
    if (pon) {
        sets.push(pon)
    }
    return sets
}

function getChii(tile: number, handPart: number[]): number[] | undefined {
    if (tile >= 8) {
        return undefined
    }

    let next1 = tile + 1
    let next2 = tile + 2
    if (hasUniqueTiles(handPart, tile, next1, next2)) {
        return [tile, next1, next2]
    }

    return undefined
}

function getPon(tile: number, handPart: number[]): number[] | undefined {
    if (hasDuplicateTiles(handPart, tile, 3)) {
        return [tile, tile, tile]
    }
    return undefined
}

function getWaitPatternFrom(tile: number, handPart: number[], isHonors: boolean): WaitPattern {
    if (hasDuplicateTiles(handPart, tile, 2)) {
        return <WaitPattern>{
            tiles: [tile, tile],
            type: WaitPatternType.SHANPON,
        }
    }

    if (tile === 9 || isHonors) {
        //not shanpon => only tanki
        return <WaitPattern>{
            tiles: [tile],
            type: WaitPatternType.TANKI,
        }
    }

    let next1 = tile + 1
    if (hasUniqueTiles(handPart, tile, next1)) {
        return <WaitPattern>{
            tiles: [tile, next1],
            type: tile === 1 || next1 === 9 ? WaitPatternType.PENCHAN : WaitPatternType.RYANMEN,
        }
    }

    if (tile === 8) {
        //not shanpon, ryanmen or penchan => only tanki
        return <WaitPattern>{
            tiles: [tile],
            type: WaitPatternType.TANKI,
        }
    }

    let next2 = tile + 2
    if (hasUniqueTiles(handPart, tile, next2)) {
        return <WaitPattern>{
            tiles: [tile, next2],
            type: WaitPatternType.KANCHAN,
        }
    }

    //only tanki
    return <WaitPattern>{
        tiles: [tile],
        type: WaitPatternType.TANKI,
    }
}

function groupIdenticalTiles(tiles: Tile[]): {tile: Tile, amount: number}[] {
    return tiles.reduce<{tile: Tile, amount: number}[]>((acc, tile) => {
        const element = acc.find(x => x.tile.type === tile.type && x.tile.value === tile.value)
        if (element !== undefined) {
            const index = acc.indexOf(element)
            acc[index].amount = acc[index].amount + 1
        } else {
            acc.push({
                tile,
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
        if (!onlyUnique && hasDuplicateTiles(suitTiles, tile, 4)) {
            pairs.push(tile)
            pairs.push(tile)
        } else if (hasDuplicateTiles(suitTiles, tile, 2)) {
            pairs.push(tile)
        }
    }

    return pairs
}

function hasUniqueTiles(suitTiles: number[], ...tiles: number[]): boolean {
    return tiles.every(tile => suitTiles.includes(tile))
}

function hasDuplicateTiles(suitTiles: number[], tile: number, amount: number): boolean {
    return suitTiles.filter(x => x === tile).length >= amount
}
