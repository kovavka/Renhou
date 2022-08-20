import { IBotPlayer } from './IBotPlayer'
import { Tile } from '../../../core/game-types/Tile'
import { DrawTile } from '../../../core/game-types/DrawTile'
import {
    getHandStructureVariants,
    HandStructureInfo,
} from '../../../utils/hand/getHandStructureVariants'
import { Hand } from '../../../core/game-types/Hand'
import { getUniqueTiles, hasTiles, isTheSameTile } from '../../../utils/tiles/tileContains'
import { getTilesToCompleteSequence } from '../../../utils/hand/getTilesToCompleteSequence'
import { ChiitoiInfo, getChiitoiInfo } from '../../../utils/hand/getChiitoiInfo'
import { getKokushiMusoInfo, KokushiMusoInfo } from '../../../utils/hand/getKokushiMusoInfo'
import { tileToString } from '../../../utils/tiles/tileToString'

// todo check if bot can decide to discard separated tile to make a sequence with another one
//  when it's just 2 separated tiles and we don't have a pair
//  e.g [12m 45m 2p 9s] + 3p -> [12m 45m 23p] and 9 to discard
// although it could be useful to improve pair to sequence and discard tile from other one instead

export class EasyBotPlayer implements IBotPlayer {
    private shantenInfo: HandStructureInfo[] = []
    private hand: Hand | undefined

    setHand(hand: Hand): void {
        this.hand = hand
        this.shantenInfo = getHandStructureVariants(hand.tiles)
    }

    chooseTile(drawTile: DrawTile): Tile | undefined {
        if (this.hand === undefined) {
            return undefined
        }

        const handTiles = this.hand.tiles
        const minShanten = this.shantenInfo[0].minShanten

        const chiitoiInfo = getChiitoiInfo(handTiles)
        if (
            chiitoiInfo !== undefined &&
            chiitoiInfo.shanten <= 2 &&
            minShanten > chiitoiInfo.shanten
        ) {
            return this.chooseDiscardForChiitoi(chiitoiInfo, drawTile)
        }

        const kokushiMusoInfo = getKokushiMusoInfo(handTiles)
        if (
            kokushiMusoInfo !== undefined &&
            kokushiMusoInfo.shanten <= 3 &&
            minShanten > kokushiMusoInfo.shanten
        ) {
            return this.chooseDiscardForKokushiMuso(kokushiMusoInfo, drawTile)
        }

        if (this.shantenInfo[0].minShanten === 0) {
            // todo call tsumo,
            //  maybe we will check if could call tsumo before choosing tile,
            //  so here it will be just draw or replacement to something better to wait
            return undefined
        }

        // tiles for each variant we don't need
        const allTilesToDiscard: Tile[] = []

        // tiles we don't need for all variants
        const uselessTilesToDiscard: Tile[] = []

        const discardInfo: {
            [tile: string]: {
                tile: Tile
                cannonDiscardCount: number
                canDiscardCount: number
            }
        } = {}

        // we can check han and fu as well (for more smart bots)
        for (const info of this.shantenInfo) {
            const { splittingInfo, minShanten, groupingVariants } = info
            const { remainingTiles, sequences, triplets } = splittingInfo
            if (minShanten > minShanten) {
                break
            }

            // const tilesInMelds: Tile[] = []
            // sequences.forEach(x => x.forEach(tile => tilesInMelds.push(tile)))
            // triplets.forEach(x => tilesInMelds.push(x[0]))

            for (const groupInfo of groupingVariants) {
                const {
                    shanten,
                    splittingInfo: groupSplittingInfo,
                    waits,
                    canDiscardSeq,
                    canDiscardPair,
                } = groupInfo
                const { pairs, sequences, uselessTiles } = groupSplittingInfo
                if (shanten > minShanten) {
                    break
                }

                if (hasTiles(waits, drawTile)) {
                    const canDiscard = uselessTiles.filter(x => !isTheSameTile(x, drawTile))

                    if (canDiscardPair) {
                        pairs.forEach(x => {
                            if (!isTheSameTile(x[0], drawTile) && !hasTiles(canDiscard, x[0])) {
                                canDiscard.push(x[0])
                            }
                        })
                    }

                    if (canDiscardSeq) {
                        sequences.forEach(x => {
                            const [tileA, tileB] = x
                            const neededTiles = getTilesToCompleteSequence(tileA, tileB)
                            if (!hasTiles(neededTiles, drawTile)) {
                                if (!hasTiles(canDiscard, tileA)) {
                                    canDiscard.push(tileA)
                                }
                                if (!hasTiles(canDiscard, tileB)) {
                                    canDiscard.push(tileB)
                                }
                            }
                        })
                    }

                    const cannotDiscard: Tile[] = []
                    getUniqueTiles(remainingTiles).forEach(tile => {
                        if (!hasTiles(canDiscard, tile)) {
                            cannotDiscard.push(tile)
                        }
                    })

                    canDiscard.forEach(tile => {
                        const str = tileToString(tile, true)
                        const data = discardInfo[str]
                        if (data !== undefined) {
                            data.canDiscardCount = data.canDiscardCount + 1
                        } else {
                            discardInfo[str] = {
                                tile,
                                cannonDiscardCount: 0,
                                canDiscardCount: 0,
                            }
                        }
                    })

                    cannotDiscard.forEach(tile => {
                        const str = tileToString(tile, true)
                        const data = discardInfo[str]
                        if (data !== undefined) {
                            data.cannonDiscardCount = data.cannonDiscardCount + 1
                        } else {
                            discardInfo[str] = {
                                tile,
                                cannonDiscardCount: 0,
                                canDiscardCount: 0,
                            }
                        }
                    })
                }
            }
        }

        const discardValues = Object.values(discardInfo)
        if (discardValues.length === 0) {
            return undefined
        }

        let bestToDiscard = discardValues[0]

        discardValues.forEach(data => {
            const { canDiscardCount, cannonDiscardCount } = data
            if (cannonDiscardCount < bestToDiscard.cannonDiscardCount) {
                bestToDiscard = data
            } else if (
                cannonDiscardCount === bestToDiscard.cannonDiscardCount &&
                canDiscardCount > bestToDiscard.canDiscardCount
            ) {
                bestToDiscard = data
            }
        })

        // for smarter bots we should keep draw tile when we have many shanten and draw tile is more useful than separated tile:
        //  - it's a pair to something else
        //  - it's more centered
        //  - it could help increase hand cost

        return bestToDiscard.tile
    }

    private chooseDiscardForChiitoi(info: ChiitoiInfo, drawTile: DrawTile): Tile | undefined {
        const { tilesToDiscard, singleTiles } = info
        if (hasTiles(singleTiles, drawTile)) {
            if (tilesToDiscard.length !== 0) {
                return tilesToDiscard[0]
            }

            return singleTiles.find(x => !isTheSameTile(x, drawTile))
        }

        return undefined
    }

    private chooseDiscardForKokushiMuso(
        info: KokushiMusoInfo,
        drawTile: DrawTile
    ): Tile | undefined {
        const { tilesToDiscard, tilesToImprove } = info
        if (hasTiles(tilesToImprove, drawTile) && tilesToDiscard.length !== 0) {
            return tilesToDiscard[0]
        }

        return undefined
    }
}
