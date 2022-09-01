import {MeldTileGroup, TwoTilesGroup} from '../hand/splitHand'
import {SimpleYaky, Yakuman} from '../../core/game-types/Yaku'
import {KanType, Meld, SetType} from '../../core/game-types/Meld'
import {Tile} from '../../core/game-types/Tile'
import {WaitPatternType} from '../../core/game-types/WaitPatternType'
import {Wind} from '../../services/mahjong/state/Wind'
import {SuitType} from '../../core/game-types/SuitType'
import {isTheSameTile} from '../tiles/tileContains'
import {getTileByWind} from '../tiles/getTileByWind'
import {CHUN_VALUE, HAKU_VALUE, HANTSU_VALUE} from '../../core/consts/honors'
import {isTerminal, isTerminalOrHonorTile} from "../tiles/isTerminalOrHonorTile";
import {isSimpleTile} from "../tiles/isSimpleTile";

const ERROR_MESSAGE = 'Not a tempai'

function getWaitPatternType(
    seqGroup: TwoTilesGroup | undefined,
    pairs: TwoTilesGroup[]
): WaitPatternType | undefined {
    if (seqGroup === undefined) {
        if (pairs.length === 2) {
            return WaitPatternType.SHANPON
        }

        if (pairs.length === 0) {
            return WaitPatternType.TANKI
        }

        return undefined
    }

    if (pairs.length === 1) {
        const [tileA, tileB] = seqGroup
        const minValue = Math.min(tileA.value, tileB.value)
        const maxValue = Math.max(tileA.value, tileB.value)

        const diff = maxValue - minValue

        if (diff > 2 || diff === 0 || tileA.type !== tileB.type) {
            throw new Error(ERROR_MESSAGE)
        }

        if (maxValue - minValue === 2) {
            return WaitPatternType.KANCHAN
        }

        if (maxValue === 9 || minValue === 1) {
            return WaitPatternType.PENCHAN
        }

        return WaitPatternType.RYANMEN
    }

    return undefined
}

function getCompletedMeld(
    seqGroup: TwoTilesGroup | undefined,
    pairs: TwoTilesGroup[],
    winningTile: Tile,
    waitPatternType: WaitPatternType
): MeldTileGroup | undefined {
    switch (waitPatternType) {
        case WaitPatternType.TANKI:
            return undefined
        case WaitPatternType.SHANPON:
            if (isTheSameTile(pairs[0][0], winningTile)) {
                return [...pairs[0], winningTile]
            }

            if (isTheSameTile(pairs[1][0], winningTile)) {
                return [...pairs[1], winningTile]
            }

            // maybe throw error?
            return undefined
        case WaitPatternType.KANCHAN:
        case WaitPatternType.PENCHAN:
        case WaitPatternType.RYANMEN:
            if (seqGroup === undefined) {
                return undefined
            }
            return [...seqGroup, winningTile]
        default:
            // maybe throw error?
            return undefined
    }
}

function getPairTile(
    pairs: TwoTilesGroup[],
    winningTile: Tile,
    waitPatternType: WaitPatternType
): Tile | undefined {
    switch (waitPatternType) {
        case WaitPatternType.TANKI:
            return winningTile
        case WaitPatternType.SHANPON: {
            if (pairs.length !== 2) {
                // maybe throw error?
                return undefined
            }

            const tileA = pairs[0][0]
            const tileB = pairs[1][0]

            if (isTheSameTile(tileA, winningTile)) {
                return tileB
            }

            return tileA
        }
        case WaitPatternType.KANCHAN:
        case WaitPatternType.PENCHAN:
        case WaitPatternType.RYANMEN:
            if (pairs.length !== 1) {
                // maybe throw error?
                return undefined
            }
            return pairs[0][0]
        default:
            return undefined
    }
}

export function isDragon(tile: Tile): boolean {
    if (tile.type !== SuitType.JIHAI) {
        return false
    }

    return tile.value > 4 && tile.value <= 7
}

export function isWind(tile: Tile): boolean {
    if (tile.type !== SuitType.JIHAI) {
        return false
    }

    return tile.value <= 4
}

export function hasTriplet(
    tile: Tile,
    triplets: MeldTileGroup[],
    openMelds: Meld[],
    completedMeld: MeldTileGroup | undefined,
    waitPatternType: WaitPatternType
): boolean {
    if (triplets.some(x => isTheSameTile(x[0], tile))) {
        return true
    }

    if (openMelds.some(x => isTheSameTile(x.fromHand[0], tile))) {
        return true
    }

    if (
        waitPatternType === WaitPatternType.SHANPON &&
        completedMeld !== undefined &&
        isTheSameTile(completedMeld[0], tile)
    ) {
        return true
    }

    return false
}


function getClosedTripletsNumber(triplets: MeldTileGroup[], openMelds: Meld[]): number {
    let count = triplets.length

    const closedKansNumber = openMelds.filter(
        x => x.type === SetType.KAN && x.kanType === KanType.CLOSED
    ).length
    count += closedKansNumber

    return count
}

function getAllTripletTiles(
    triplets: MeldTileGroup[],
    openMelds: Meld[],
    completedMeld: MeldTileGroup | undefined,,
    waitPatternType: WaitPatternType
): Tile[] {
    const allTriplets: Tile[] = triplets.map(x => x[0])

    openMelds.forEach(x => {
        if (x.type === SetType.KAN || x.type === SetType.PON) {
            allTriplets.push(x.fromHand[0])
        }
    })

    if (waitPatternType === WaitPatternType.SHANPON && completedMeld !== undefined) {
        allTriplets.push(completedMeld[0])
    }

    return allTriplets
}

function isGreenTile(tile: Tile): boolean {
    if (tile.type === SuitType.JIHAI && tile.value === HANTSU_VALUE) {
        return true
    }

    if (tile.type !== SuitType.SOUZU) {
        return false
    }

    return (
        tile.value === 2 ||
        tile.value === 3 ||
        tile.value === 4 ||
        tile.value === 6 ||
        tile.value === 8
    )
}

function isTsuuiisou(allTiles: Tile[]): boolean {
    return allTiles.every(x => x.type === SuitType.JIHAI)
}


function isPinfu(
    sequences: MeldTileGroup[],
    finalPairTile: Tile,
    waitPatternType: WaitPatternType,
    roundWindTile: Tile,
    placeWindTile: Tile
): boolean {
    if (isDragon(finalPairTile)) {
        return false
    }

    if (
        isTheSameTile(finalPairTile, roundWindTile) ||
        isTheSameTile(finalPairTile, placeWindTile)
    ) {
        return false
    }

    return sequences.length === 3 && waitPatternType === WaitPatternType.RYANMEN
}

function isChanta(
    allMelds: MeldTileGroup[],
    pairTile: Tile
): boolean {
    let hasSimpleTile = false
    const allMeldsContainTerminalOrHonor = allMelds.every(x => {
        const [tileA, tileB, tileC] = x
        const meldHasTerminalOrHonor = isTerminalOrHonorTile(tileA) || isTerminalOrHonorTile(tileB) || isTerminalOrHonorTile(tileC)
        hasSimpleTile = isSimpleTile(tileA) || isSimpleTile(tileB) || isSimpleTile(tileC)

        return meldHasTerminalOrHonor
    })

    return allMeldsContainTerminalOrHonor && isTerminalOrHonorTile(pairTile) && hasSimpleTile
}

function isJunchan(
    allMelds: MeldTileGroup[],
    pairTile: Tile
): boolean {
    let hasNonTerminalTile = false
    const allMeldsContainTerminal = allMelds.every(x => {
        const [tileA, tileB, tileC] = x
        const meldHasTerminal = isTerminal(tileA) || isTerminal(tileB) || isTerminal(tileC)
        hasNonTerminalTile = !isTerminal(tileA) || !isTerminal(tileB) || !isTerminal(tileC)

        return meldHasTerminal
    })

    return allMeldsContainTerminal && isTerminal(pairTile) && hasNonTerminalTile
}

function isChuurenPoutou(allTiles: Tile[]): boolean {
    const suit = allTiles[0].type
    if (suit === SuitType.JIHAI) {
        return false
    }

    const tilesCount: number[] = []
    let hasAdditionalTile = false // any tile for 111-2-3-4-5-6-7-8-999 stucture

    for(const tile of allTiles) {
        if (tile.type !== suit) {
            return false
        }

        const fromArray = tilesCount[tile.value]
        const numberOfTiles = fromArray + 1

        tilesCount[tile.value] = numberOfTiles

        if (
            (tile.value === 1 || tile.value === 1) && numberOfTiles > 3 ||
            (tile.value !== 1 && tile.value === 9 && numberOfTiles > 1)
        ) {
            if (hasAdditionalTile) {
                return false
            } else {
                hasAdditionalTile = true
            }
        }
    }

    return true
}

function differentSuitsButSameValues(tileA: Tile, tileB: Tile, tileC: Tile): boolean {
    if (tileA.type === SuitType.JIHAI || tileB.type === SuitType.JIHAI || tileC.type === SuitType.JIHAI) {
        return false
    }

    const haveDifferentTypes = tileA.type !== tileB.type && tileA.type !== tileC.type && tileB.type !== tileC.type
    const haveSameValues =  tileA.value === tileB.value &&  tileA.value === tileC.value
    return haveDifferentTypes && haveSameValues
}

function isSanshokuDoukou(allTripletTiles: Tile[]): boolean {
    if (allTripletTiles.length < 3) {
        return false
    }

    const [tileA,tileB, tileC, tileD] = allTripletTiles

    if (differentSuitsButSameValues(tileA,tileB, tileC)) {
        return true
    }

    if (tileD !== undefined) {
        if (differentSuitsButSameValues(tileA, tileB, tileD)) {
            return true
        }

        if (differentSuitsButSameValues(tileA, tileC, tileD)) {
            return true
        }

        if (differentSuitsButSameValues(tileB, tileC, tileD)) {
            return true
        }
    }

    return false
}

// const isOpenHand = openMelds.some(
//     meld => meld.type !== SetType.KAN || meld.kanType !== KanType.CLOSED
// )
// const waitPatternType = getWaitPatternType(seqGroup, pairs)
// const completedMeld = getCompletedMeld(seqGroup, pairs, winningTile, waitPatternType)
// const finalPairTile = getPairTile(pairs, winningTile, waitPatternType)

// todo tests for 3 closed kans -> should be sanankou + sankantsu

export function getYakuByStructure(
    allTiles: Tile[],
    sequences: MeldTileGroup[],
    triplets: MeldTileGroup[],
    openMelds: Meld[],
    completedMeld: MeldTileGroup | undefined,
    finalPairTile: Tile,
    waitPatternType: WaitPatternType,
    roundWind: Wind,
    placeWind: Wind,
    isOpenHand: boolean
): SimpleYaky[] | Yakuman[] {
    const yakuList: SimpleYaky[] = []
    const yakumanList: Yakuman[] = []

    const allMelds: MeldTileGroup[] = sequences.concat(triplets)
    openMelds.forEach(x => {
        const [tileA, tileB] = x.fromHand
        const tileC = x.type === SetType.CHII ? x.fromPlayers : Object.assign({}, tileB)

        allMelds.push([tileA, tileB, tileC])
    })
    if (completedMeld !== undefined) {
        allMelds.push(completedMeld)
    }

    const closedTripletsNumber = getClosedTripletsNumber(triplets, openMelds)
    if (closedTripletsNumber === 4) {
        yakumanList.push(Yakuman.SUUANKOU)
    }

    const kansNumber = openMelds.filter(x => x.type === SetType.KAN).length
    if (kansNumber === 4) {
        yakumanList.push(Yakuman.SUUKANTSU)
    }

    const onlyGreens = allTiles.every(isGreenTile)
    if (onlyGreens) {
        yakumanList.push(Yakuman.RYUUIISOU)
    }

    const onlyTerminals = allTiles.every(
        x => x.type !== SuitType.JIHAI && (x.value === 1 || x.value === 9)
    )
    if (onlyTerminals) {
        yakumanList.push(Yakuman.CHINROUTOU)
    }

    if (isTsuuiisou(allTiles)) {
        yakumanList.push(Yakuman.TSUUIISOU)
    }

    const chun = { value: CHUN_VALUE, type: SuitType.JIHAI }
    const haku = { value: HAKU_VALUE, type: SuitType.JIHAI }
    const hatsu = { value: HANTSU_VALUE, type: SuitType.JIHAI }

    const hasChun = hasTriplet(chun, triplets, openMelds, completedMeld, waitPatternType)
    const hasHaku = hasTriplet(haku, triplets, openMelds, completedMeld, waitPatternType)
    const hasHatsu = hasTriplet(hatsu, triplets, openMelds, completedMeld, waitPatternType)

    const dragonsNumber = Number(hasChun) + Number(hasHaku) + Number(hasHatsu)

    if (dragonsNumber === 3) {
        yakumanList.push(Yakuman.DAISANGEN)
    }

    const east = getTileByWind(Wind.EAST)
    const south = getTileByWind(Wind.SOUTH)
    const west = getTileByWind(Wind.WEST)
    const north = getTileByWind(Wind.NORTH)

    const hasEast = hasTriplet(east, triplets, openMelds, completedMeld, waitPatternType)
    const hasSouth = hasTriplet(south, triplets, openMelds, completedMeld, waitPatternType)
    const hasWest = hasTriplet(west, triplets, openMelds, completedMeld, waitPatternType)
    const hasNorth = hasTriplet(north, triplets, openMelds, completedMeld, waitPatternType)

    const windsNumber = Number(hasEast) + Number(hasSouth) + Number(hasWest) + Number(hasNorth)

    const roundWindTile = getTileByWind(roundWind)
    const placeWindTile = getTileByWind(placeWind)

    if (windsNumber === 4) {
        yakumanList.push(Yakuman.DAISUUSHII)
    } else if (windsNumber === 3) {
        if (
            (!hasEast && isTheSameTile(finalPairTile, east)) ||
            (!hasSouth && isTheSameTile(finalPairTile, south)) ||
            (!hasWest && isTheSameTile(finalPairTile, west)) ||
            (!hasNorth && isTheSameTile(finalPairTile, north))
        ) {
            yakumanList.push(Yakuman.SHOUSIISHI)
        }
    }

    if (isChuurenPoutou(allTiles)) {
        yakumanList.push(Yakuman.CHUUREN_POUTOU)
    }

    if (yakumanList.length !== 0) {
        return yakumanList
    }

    const commonList = getCommonSimpleYaky(allTiles)
    yakuList.concat(commonList)

    if (dragonsNumber === 2) {
        yakuList.push(SimpleYaky.YAKUHAI_DRAGON)
        yakuList.push(SimpleYaky.YAKUHAI_DRAGON)

        if (
            (!hasChun && isTheSameTile(finalPairTile, chun)) ||
            (!hasHaku && isTheSameTile(finalPairTile, haku)) ||
            (!hasHatsu && isTheSameTile(finalPairTile, hatsu))
        ) {
            yakuList.push(SimpleYaky.SHOSANGEN)
        }
    } else if (dragonsNumber === 1) {
        yakuList.push(SimpleYaky.YAKUHAI_DRAGON)
    }

    if (windsNumber === 3) {
        if (hasTriplet(roundWindTile, triplets, openMelds, completedMeld, waitPatternType)) {
            yakuList.push(SimpleYaky.YAKUHAI_WIND)
        }

        if (hasTriplet(placeWindTile, triplets, openMelds, completedMeld, waitPatternType)) {
            yakuList.push(SimpleYaky.YAKUHAI_WIND)
        }
    }

    if (isPinfu(sequences, finalPairTile, waitPatternType, roundWindTile, placeWindTile)) {
        yakuList.push(SimpleYaky.PINFU)
    }

    if (closedTripletsNumber === 3) {
        yakuList.push(SimpleYaky.SANANKOU)
    }

    if (kansNumber === 3) {
        yakuList.push(SimpleYaky.SANKANTSU)
    }

    if (isJunchan(allMelds, finalPairTile)) {
        yakuList.push(SimpleYaky.JUNCHAN)
    } else if (isChanta(allMelds, finalPairTile)) {
        yakuList.push(SimpleYaky.CHANTA)
    }

    const allTripletTiles = getAllTripletTiles(triplets, openMelds, completedMeld, waitPatternType)
    if (allTripletTiles.length === 4) {
        yakuList.push(SimpleYaky.TOITOI)
    }

    if (isSanshokuDoukou(allTripletTiles)) {
        yakuList.push(SimpleYaky.SANSHOKU_DOUKOU)
    }

    return []
}

/**
 * yaky suitable for regular structure and chiitoi
 */
function getCommonSimpleYaky(allTiles: Tile[]): SimpleYaky[] {
    const yakuList: SimpleYaky[] = []

    const onlySimples = allTiles.every(
        x => x.type !== SuitType.JIHAI && x.value !== 1 && x.value !== 9
    )
    if (onlySimples) {
        yakuList.push(SimpleYaky.TANYAO)
    }

    const onlyTerminalsOrHonors = allTiles.every(isTerminalOrHonorTile)
    if (onlyTerminalsOrHonors) {
        yakuList.push(SimpleYaky.HONROUTOU)
    }

    const theOnlyPossibleSuit = allTiles.find(x => x.type !== SuitType.JIHAI)?.type
    if (theOnlyPossibleSuit !== undefined) {
        const onlyOneSuit = allTiles.every(x => x.type === theOnlyPossibleSuit)
        if (onlyOneSuit) {
            yakuList.push(SimpleYaky.CHINITSU)
        }

        const onlyOneSuitAndHonors = allTiles.every(x => x.type === theOnlyPossibleSuit || x.type === SuitType.JIHAI)
        if (onlyOneSuitAndHonors) {
            yakuList.push(SimpleYaky.HONITSU)
        }
    }

    return yakuList
}

export function getChiitoiYaku(allTiles: Tile[]): SimpleYaky[] | Yakuman {
    if (isTsuuiisou(allTiles)) {
        return Yakuman.TSUUIISOU
    }

    return getCommonSimpleYaky(allTiles)
}