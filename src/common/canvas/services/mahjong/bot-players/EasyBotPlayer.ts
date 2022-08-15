import {IBotPlayer} from "./IBotPlayer";
import {Tile} from "../../../core/game-types/Tile";
import {DrawTile} from "../../../core/game-types/DrawTile";
import {getShantenInfo, ShantenInfo} from "../../../utils/hand/getShantenInfo";
import {Hand} from "../../../core/game-types/Hand";
import {excludeTiles, hasTiles} from "../../../utils/tiles/tileContains";
import {SuitType} from "../../../core/game-types/SuitType";

export class EasyBotPlayer implements IBotPlayer {
    private shantenInfo: ShantenInfo[] = []
    private hand: Hand | undefined

    setHand(hand: Hand): void {
        this.hand = hand
        this.shantenInfo = getShantenInfo(hand.tiles)
    }

    chooseTile(drawTile: DrawTile): Tile | undefined {
        // if (this.hand === undefined) {
        //     return undefined
        // }

        const onlyRegular = this.shantenInfo
        const minRegularShanten = onlyRegular.length !== 0 ? onlyRegular[0].value : -1

        if (this.shantenInfo[0].value === 0) {
            // todo call tsumo,
            //  maybe we will check if could call tsumo before choosing tile,
            //  so here it will be just draw or replacement to something better to wait
            return undefined
        }

        // const toDiscard: Tile[] = []

        // we can check han and fu as well
        for(const info of this.shantenInfo) {
            if (info.value > minRegularShanten) {
                break
            }

            const {improvements} = info.nextDrawInfo


            // if (info.structureType === HandStructureType.CHIITOI) {
            //     // for easy bot we won't check all hand development possibilities
            //     // and chiitoi could be too ineffective,
            //     // so it doesn't make much sense to get chiitoi when shanten > 2
            //     if (info.value > 2) {
            //         break
            //     }
            //
            //
            //     // add all possible tiles (except tile in the hand) as tiles to improve.
            //     // it will increase shanten when we have at least one group with length > 2
            //     // and less than 2 tiles without group
            //     // if (identicalGroups.filter(x => x.count > 2).length > 0 && tilesWithoutGroup.length < 2)
            //     //    then add all others (1-9 man-jihai)
            //
            //
            //     // we can replace waits if draw tile has more live tiles to pair
            //
            //     if (hasTiles(improvements, drawTile)) {
            //         if (toDiscard.length > 0) {
            //             return toDiscard[0]
            //         }
            //     }
            // }

            // if (info.structureType === HandStructureType.KOKUSHI_MUSO) {
            //     // for easy bit we won't check all hand development possibilities
            //     // and kokushi muso is not effective for most cases,
            //     // so it doesn't make much sense to get kokushi muso when shanten > 2
            //     if (info.value > 3) {
            //         break
            //     }
            //
            //     if (hasTiles(improvements, drawTile)) {
            //         if (toDiscard.length > 0) {
            //             return toDiscard[0]
            //         }
            //     }
            // }

            if (hasTiles(improvements, drawTile)) {
                const find = this.findSomethingToDiscard(info.splittingInfo.remainingTiles, drawTile)
                if (find !== undefined) {
                    return find
                }
            }

            // todo canDraw and canReplace
        }

        for(const info of this.shantenInfo) {
            if (info.value > minRegularShanten) {
                break
            }

            const {improvements, usefulTiles} = info.nextDrawInfo

            if (hasTiles(usefulTiles, drawTile)) {
                const find = this.findSomethingToDiscard(info.splittingInfo.remainingTiles, drawTile)
                if (find !== undefined) {
                    return find
                }
            }
        }

        // we should keep draw tile when we have many shanten and draw tile is more useful than separated tile:
        //  - it's a pair to something else
        //  - it's more centered
        //  - it could help increase hand cost



        return undefined
    }

    private findSomethingToDiscard(remainingTiles: Tile[], drawTile: Tile): Tile | undefined {
               const tilesMightDiscard = excludeTiles(remainingTiles, drawTile).find(tile => {
            if (tile.type !== drawTile.type || tile.type === SuitType.JIHAI) {
                return true
            }

            // they cant form sequential group together
            return Math.abs(tile.value - drawTile.value) > 2
        })
        if (tilesMightDiscard !== undefined) {
            return tilesMightDiscard
        }
    }
}