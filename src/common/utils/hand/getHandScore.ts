import { getHandStructureVariants } from './getHandStructureVariants'
import { getHanByYaku } from '../yaku/getHanByYaku'
import { SimpleYaky, Yakuman } from '../../game-types/Yaku'
import {Meld} from "../../game-types/Meld";
import {Tile} from "../../game-types/Tile";

type ScoreInfo = {
    yakuList: {
        name: SimpleYaky
        han: number
    }[]
    yakuman: Yakuman | undefined
    value: number
}

export function getHandScore(
    tiles: Tile[],
    openMelds: Meld[],
    winningTile: Tile[],
    isTsumo: boolean
): number {
    const variants = getHandStructureVariants(tiles)
    let bestScore = 0
    variants.forEach(variant => {
        const { minShanten, splittingInfo, groupingVariants } = variant
        if (minShanten !== 0) {
            return
        }

        const han = getHanByYaku(SimpleYaky.RIICHI, false)
    })

    return bestScore
}
