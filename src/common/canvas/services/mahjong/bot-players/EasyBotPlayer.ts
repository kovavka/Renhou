import { IBotPlayer } from './IBotPlayer'
import { Tile } from '../../../core/game-types/Tile'
import { DrawTile } from '../../../core/game-types/DrawTile'
import {
    getHandStructureVariants,
    HandStructureInfo,
} from '../../../utils/hand/getHandStructureVariants'
import { Hand } from '../../../core/game-types/Hand'
import { excludeTiles, hasTiles, isTheSameTile } from '../../../utils/tiles/tileContains'
import { SuitType } from '../../../core/game-types/SuitType'
import { getClosestTiles } from '../../../utils/hand/getClosestTiles'
import { getTilesToCompleteSequence } from '../../../utils/hand/getTilesToCompleteSequence'

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
        // if (this.hand === undefined) {
        //     return undefined
        // }

        // todo chiitoi and kokushi muso

        const minShanten = this.shantenInfo[0].minShanten

        if (this.shantenInfo[0].minShanten === 0) {
            // todo call tsumo,
            //  maybe we will check if could call tsumo before choosing tile,
            //  so here it will be just draw or replacement to something better to wait
            return undefined
        }

        // we should create some rating
        let uselessTilesCouldDiscard: Tile[] = []

        // we can check han and fu as well (for more smart bots)
        for (const info of this.shantenInfo) {
            const { splittingInfo, minShanten, groupingVariants } = info
            const { remainingTiles } = splittingInfo
            if (minShanten > minShanten) {
                break
            }

            for (const groupInfo of groupingVariants) {
                // todo make canDiscardSequence instead of canDiscardGroup
                const {
                    shanten,
                    splittingInfo: groupSplittingInfo,
                    waits,
                    canDiscardSeq,
                    canDiscardPair,
                } = groupInfo
                const { pairs, sequences, uselessTiles } = groupSplittingInfo
                if (info.minShanten > minShanten) {
                    break
                }

                // todo save all discards and choose most useless tile

                if (hasTiles(waits, drawTile)) {
                    uselessTilesCouldDiscard = uselessTiles

                    if (canDiscardPair) {
                        // todo it doesn't make sense to store 2 tiles in pairs
                        const find = pairs.find(x => !isTheSameTile(x[0], drawTile))
                        if (find !== undefined) {
                            return find[0]
                        }
                    }

                    if (canDiscardSeq) {
                        const find = sequences.find(x => {
                            const [tileA, tileB] = x
                            const waits = getTilesToCompleteSequence(tileA, tileB)
                            if (!hasTiles(waits, drawTile)) {
                                return tileA // todo or tileB
                            }
                        })
                        if (find !== undefined) {
                            return find[0]
                        }
                    }

                    {
                        const find = uselessTiles.find(x => {
                            const useful = getClosestTiles(x)
                            if (!hasTiles(waits, drawTile)) {
                                return useful[0] // todo might choose another
                            }
                        })
                        if (find !== undefined) {
                            return find
                        }
                    }
                }
            }
        }

        if (uselessTilesCouldDiscard.length) {
            return uselessTilesCouldDiscard[0]
        }

        // todo checl connectors

        // we should keep draw tile when we have many shanten and draw tile is more useful than separated tile:
        //  - it's a pair to something else
        //  - it's more centered
        //  - it could help increase hand cost

        return undefined
    }
}
