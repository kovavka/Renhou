import {Tile} from "./Tile";

export type DiscardTile = Tile & {
    justDrawn: boolean
}
export type Discard = {
    tiles: DiscardTile[]
    riichiTile: DiscardTile | undefined
}