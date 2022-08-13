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

        const minShanten = this.shantenInfo[0].value

        if (minShanten === 0) {
            // todo call tsumo,
            //  maybe we will check if could call tsumo before choosing tile,
            //  so here it will be just draw or replacement to something better to wait
            return undefined
        }

        // const toDiscard: Tile[] = []

        // we can check han and fu as well
        for(const info of this.shantenInfo) {
            if (info.value > minShanten) {
                break
            }

            // todo rename canDraw and canReplace, looks like it's boolean
            const {improvements, canDraw, canReplace, toDiscard, toLeave} = info.nextDrawInfo

            if (hasTiles(improvements, drawTile)) {
                const find = this.findSomethingToDiscard(info.splittingInfo.remainingTiles, drawTile, toDiscard, toLeave)
                if (find !== undefined) {
                    return find
                }
            }

            // todo canDraw and canReplace
        }

        for(const info of this.shantenInfo) {
            if (info.value > minShanten) {
                break
            }

            const {improvements, canDraw, canReplace, toDiscard, toLeave} = info.nextDrawInfo

            if (hasTiles(canDraw, drawTile)) {
                const find = this.findSomethingToDiscard(info.splittingInfo.remainingTiles, drawTile, toDiscard, toLeave)
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

    // problem with sets
    // 7m889p237799s123z + 7p
    // 18m118p278s14667z + 6z
    // 67m5778p44668s33z + 7m

    private findSomethingToDiscard(remainingTiles: Tile[], drawTile: Tile, toDiscard: Tile[], toLeave: Tile[]): Tile | undefined {
        if (toDiscard.length > 0) {
            return toDiscard[0]
        }

        const tilesMightDiscard = excludeTiles(remainingTiles, ...toLeave, drawTile).find(tile => {
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