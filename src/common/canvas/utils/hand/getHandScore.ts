import { Tile } from '../../core/game-types/Tile'
import { getHandStructureVariants } from './getHandStructureVariants'
import { KanType, Meld, SetType } from '../../core/game-types/Meld'
import { MeldTileGroup, TwoTilesGroup } from './splitHand'
import { getHanByYaku } from './getHanByYaku'
import { SimpleYaky, Yakuman } from '../../core/game-types/Yaku'

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

function getYaku(
    sequences: MeldTileGroup[],
    triplets: MeldTileGroup[],
    openMelds: Meld[],
    seqGroup: TwoTilesGroup,
    pairs: TwoTilesGroup[],
    winningTile: Tile[],
    isTsumo: boolean
): SimpleYaky[] {
    const isOpenHand = openMelds.some(
        meld => meld.type !== SetType.KAN || meld.kanType !== KanType.CLOSED
    )

    return []
}
