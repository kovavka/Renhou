import {MeldTileGroup, TwoTilesGroup} from "../hand/splitHand";
import {SimpleYaky} from "../../game-types/Yaku";
import {KanType, Meld, SetType} from "../../game-types/Meld";
import {Tile} from "../../game-types/Tile";
import {WaitPatternType} from "../../game-types/WaitPatternType";
import {Wind} from "../../services/mahjong/state/Wind";
import {SuitType} from "../../game-types/SuitType";
import {isTheSameTile} from "../tiles/tileContains";

const ERROR_MESSAGE = 'Not a tempai'

function getWaitPatternType(seqGroup: TwoTilesGroup | undefined, pairs: TwoTilesGroup[]): WaitPatternType | undefined {
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

function getCompletedMeld(seqGroup: TwoTilesGroup | undefined, pairs: TwoTilesGroup[],  winningTile: Tile, waitPatternType: WaitPatternType): MeldTileGroup | undefined {
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

function getPairTile(pairs: TwoTilesGroup[], winningTile: Tile, waitPatternType: WaitPatternType): Tile | undefined {
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

    return tile.value > 4 && tile.value <=7
}

export function isWind(tile: Tile): boolean {
    if (tile.type !== SuitType.JIHAI) {
        return false
    }

    return tile.value <= 4
}

export function hasTriplet(tile: Tile, triplets: MeldTileGroup[], openMelds: Meld[], completedMeld: MeldTileGroup | undefined, waitPatternType: WaitPatternType): boolean {
    if (triplets.some(x => isTheSameTile(x[0], tile))) {
        return true
    }

    if (openMelds.some(x => isTheSameTile(x.fromHand[0], tile))) {
        return true
    }

    if (waitPatternType === WaitPatternType.SHANPON && completedMeld !== undefined && isTheSameTile(completedMeld[0], tile)) {
        return true
    }

    return false
}

export function getDragonsNumber(triplets: MeldTileGroup[], openMelds: Meld[], completedMeld: MeldTileGroup | undefined, waitPatternType: WaitPatternType): number {
    let count = 0

    const inTriplets = triplets.filter(x => isDragon(x[0])).length
    count += inTriplets

    const inOpenMelds = openMelds.filter(x => isDragon(x.fromHand[0])).length
    count += inOpenMelds

    if (waitPatternType === WaitPatternType.SHANPON && completedMeld !== undefined && isDragon(completedMeld[0])) {
        count++
    }

    return count
}

export function getYaku(
    sequences: MeldTileGroup[],
    triplets: MeldTileGroup[],
    openMelds: Meld[],
    seqGroup: TwoTilesGroup | undefined,
    pairs: TwoTilesGroup[],
    winningTile: Tile,
    isTsumo: boolean,
    roundWind: Wind,
    placeWind: Wind,
): SimpleYaky[] {
    const yakuList: SimpleYaky[] = []

    const isOpenHand = openMelds.some(
        meld => meld.type !== SetType.KAN || meld.kanType !== KanType.CLOSED
    )

    const waitPatternType = getWaitPatternType(seqGroup, pairs)
    if (waitPatternType === undefined) {
        throw new Error(ERROR_MESSAGE)
    }

    const completedMeld = getCompletedMeld(seqGroup, pairs, winningTile, waitPatternType)
    const finalPairTile = getPairTile(pairs, winningTile, waitPatternType)

    if (finalPairTile === undefined) {
        throw new Error(ERROR_MESSAGE)
    }

    // const dragonsNumber = getDragonsNumber(triplets, openMelds, completedMeld, waitPatternType)
    const chun = {value: 5, type: SuitType.JIHAI}
    const haku = {value: 6, type: SuitType.JIHAI}
    const hatsu = {value: 7, type: SuitType.JIHAI}

    const hasChun =  hasTriplet(chun, triplets, openMelds, completedMeld, waitPatternType)
    const hasHaku =  hasTriplet(haku, triplets, openMelds, completedMeld, waitPatternType)
    const hasHatsu =  hasTriplet(hatsu, triplets, openMelds, completedMeld, waitPatternType)

    const dragonsNumber = Number(hasChun) + Number(hasHaku) + Number(hasHatsu)

    if (dragonsNumber === 3) {
        // DAISANGEN
    }

    if (dragonsNumber === 2) {
        yakuList.push(SimpleYaky.YAKUHAI_DRAGON)
        yakuList.push(SimpleYaky.YAKUHAI_DRAGON)

        if (
            !hasChun && isTheSameTile(finalPairTile, chun) ||
            !hasHaku && isTheSameTile(finalPairTile, haku) ||
            !hasHatsu && isTheSameTile(finalPairTile, hatsu)
        ) {
            yakuList.push(SimpleYaky.SHOSANGEN)
        }
    } else if (dragonsNumber === 1) {
        yakuList.push(SimpleYaky.YAKUHAI_DRAGON)
    }


    const east = {value: 1, type: SuitType.JIHAI}
    const south = {value: 2, type: SuitType.JIHAI}
    const west = {value: 3, type: SuitType.JIHAI}
    const north = {value: 4, type: SuitType.JIHAI}

    const hasEast =  hasTriplet(east, triplets, openMelds, completedMeld, waitPatternType)
    const hasSouth =  hasTriplet(south, triplets, openMelds, completedMeld, waitPatternType)
    const hasWest =  hasTriplet(west, triplets, openMelds, completedMeld, waitPatternType)
    const hasNorth =  hasTriplet(north, triplets, openMelds, completedMeld, waitPatternType)

    const windsNumber = Number(hasEast) + Number(hasSouth) + Number(hasWest) + Number(hasNorth)


    if (windsNumber === 4) {
        // DAISUUSHII
    }



    // todo maybe also check yakumans here? Especially SUUANKOU, DAISANGEN, SHOUSIISHI, DAISUUSHII
    return []
}
