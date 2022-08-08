import {Tile} from "./Tile";
import {Meld} from "./Meld";
import {DrawTile} from "./DrawTile";

export type Hand = {
    tiles: Tile[]
    openMelds: Meld[]
    drawTile: DrawTile | undefined
    riichi: boolean
    // selectedTile
}
