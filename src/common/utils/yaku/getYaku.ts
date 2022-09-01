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

function getAllTripletsNumber(
    triplets: MeldTileGroup[],
    openMelds: Meld[],
    waitPatternType: WaitPatternType
): number {
    let count = triplets.length

    const closedKansNumber = openMelds.filter(
        x => x.type === SetType.KAN || x.type === SetType.PON
    ).length
    count += closedKansNumber

    if (waitPatternType === WaitPatternType.SHANPON) {
        count++
    }

    return count
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
    const notAllMeldsContainTerminalOrHonor = allMelds.some(x => {
        const [tileA, tileB, tileC] = x
        return !isTerminalOrHonorTile(tileA) && !isTerminalOrHonorTile(tileB) && !isTerminalOrHonorTile(tileC)
    })

    if (notAllMeldsContainTerminalOrHonor) {
        return false
    }

    return isTerminalOrHonorTile(pairTile)
}

function isJunchan(
    allMelds: MeldTileGroup[],
    pairTile: Tile
): boolean {
    const notAllMeldsContainTerminal = allMelds.some(x => {
        const [tileA, tileB, tileC] = x
        return !isTerminal(tileA) && !isTerminal(tileB) && !isTerminal(tileC)
    })

    if (notAllMeldsContainTerminal) {
        return false
    }

    return isTerminal(pairTile)
}

// const isOpenHand = openMelds.some(
//     meld => meld.type !== SetType.KAN || meld.kanType !== KanType.CLOSED
// )
// const waitPatternType = getWaitPatternType(seqGroup, pairs)
// const completedMeld = getCompletedMeld(seqGroup, pairs, winningTile, waitPatternType)
// const finalPairTile = getPairTile(pairs, winningTile, waitPatternType)

// todo tests for 3 closed kans -> should be sanankou + sankantsu

// todo some yaku are also suitable for chiitoi, maybe split?
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
): SimpleYaky[] | Yakuman {
    const yakuList: SimpleYaky[] = []

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
        return Yakuman.SUUANKOU
    }

    if (closedTripletsNumber === 3) {
        yakuList.push(SimpleYaky.SANANKOU)
    }

    const kansNumber = openMelds.filter(x => x.type === SetType.KAN).length
    if (kansNumber === 4) {
        return Yakuman.SUUKANTSU
    }

    if (kansNumber === 3) {
        yakuList.push(SimpleYaky.SANKANTSU)
    }

    const allTripletsNumber = getAllTripletsNumber(triplets, openMelds, waitPatternType)
    if (allTripletsNumber === 4) {
        yakuList.push(SimpleYaky.TOITOI)
    }

    const onlyGreens = allTiles.every(isGreenTile)
    if (onlyGreens) {
        return Yakuman.RYUUIISOU
    }

    const onlyTerminals = allTiles.every(
        x => x.type !== SuitType.JIHAI && (x.value === 1 || x.value === 9)
    )
    if (onlyTerminals) {
        return Yakuman.CHINROUTOU
    }

    const onlyHonors = allTiles.every(x => x.type === SuitType.JIHAI)
    if (onlyHonors) {
        return Yakuman.TSUUIISOU
    }

    const onlySimples = allTiles.every(
        x => x.type !== SuitType.JIHAI && x.value !== 1 && x.value !== 9
    )
    if (onlySimples) {
        yakuList.push(SimpleYaky.TANYAO)
    }

    // TSUUIISOU and CHINROUTOU should be checked before
    const onlyTerminalsOrHonors = allTiles.every(isTerminalOrHonorTile)
    if (onlyTerminalsOrHonors) {
        yakuList.push(SimpleYaky.HONROUTOU)
    } else if (isJunchan(allMelds, finalPairTile)) {
        yakuList.push(SimpleYaky.JUNCHAN)
    } else if (isChanta(allMelds, finalPairTile)) {
        yakuList.push(SimpleYaky.CHANTA)
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

    const chun = { value: CHUN_VALUE, type: SuitType.JIHAI }
    const haku = { value: HAKU_VALUE, type: SuitType.JIHAI }
    const hatsu = { value: HANTSU_VALUE, type: SuitType.JIHAI }

    const hasChun = hasTriplet(chun, triplets, openMelds, completedMeld, waitPatternType)
    const hasHaku = hasTriplet(haku, triplets, openMelds, completedMeld, waitPatternType)
    const hasHatsu = hasTriplet(hatsu, triplets, openMelds, completedMeld, waitPatternType)

    const dragonsNumber = Number(hasChun) + Number(hasHaku) + Number(hasHatsu)

    if (dragonsNumber === 3) {
        return Yakuman.DAISANGEN
    }

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
        return Yakuman.DAISUUSHII
    } else if (windsNumber === 3) {
        if (
            (!hasEast && isTheSameTile(finalPairTile, east)) ||
            (!hasSouth && isTheSameTile(finalPairTile, south)) ||
            (!hasWest && isTheSameTile(finalPairTile, west)) ||
            (!hasNorth && isTheSameTile(finalPairTile, north))
        ) {
            return Yakuman.SHOUSIISHI
        }

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

    return []
}
