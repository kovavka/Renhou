import {Tile} from "./Tile";
import {Meld} from "./Meld";
import {DrawTile} from "./DrawTile";

export type Hand = {
    closePart: Tile[]
    openMelds: Meld[]
    drawTile: DrawTile | undefined
    // selectedTile
}
