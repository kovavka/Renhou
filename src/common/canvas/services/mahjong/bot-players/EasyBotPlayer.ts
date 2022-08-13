import {IBotPlayer} from "./IBotPlayer";
import {Tile} from "../../../core/game-types/Tile";
import {DrawTile} from "../../../core/game-types/DrawTile";
import {getShantenInfo, ShantenInfo} from "../../../utils/hand/getShantenInfo";

export class EasyBotPlayer implements IBotPlayer {
    private shantenInfo: ShantenInfo[] = []
    // private handTiles: Tile[] = []

    setHand(handTiles: Tile[]): void {
        // this.handTiles = getShantenInfo(handTiles)
        this.shantenInfo = getShantenInfo(handTiles)
    }

    chooseTile(drawTile: DrawTile): Tile | undefined {
        // const minShantenCount = this.shantenInfo[0].shantenCount
        // // todo if 0 call tsumo
        //
        // // const toDiscard: Tile[] = []
        //
        // // we can check han and fu as well
        // for(const info of this.shantenInfo) {
        //     if (info.shantenCount > minShantenCount) {
        //         break
        //     }
        //
        //     if (hasTiles(info.tilesToImprove, drawTile)) {
        //         if (info.tilesToDiscard.length > 0) {
        //             return info.tilesToDiscard[0]
        //         }
        //
        //         const splittingInfo = info.splittingInfo
        //         const separatedTiles = splittingInfo.separatedTiles.filter(x => !isTheSameTile(x, drawTile))
        //         if (separatedTiles.length > 0) {
        //             return separatedTiles[0]
        //         }
        //
        //         const pairs = splittingInfo.groups.filter(x => isTheSameTile(x[0], x[1]))
        //         // todo check if draw tiles goes here
        //         if (pairs.length > 1) {
        //             return pairs[0]
        //         } else {
        //             const seqGroups = splittingInfo.groups.filter(x => !isTheSameTile(x[0], x[1]))
        //             if (seqGroups.length > 0) {
        //                 return seqGroups[0]
        //             }
        //         }
        //     }
        // }

        //  we should keep it draw tile when we have many shanten and draw tile is more useful than separated tile:
        // - it's a pair to something else
        // it's more centered
        // it could help increase hand cost



        return undefined
    }
}