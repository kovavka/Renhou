/**
 * variant of hand developing
 */
import {Tile} from "../../core/game-types/Tile";

export type MeldTileGroup = [Tile, Tile, Tile]
export type TwoTilesGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
export type SingleTileGroup = [Tile]

export type HandSpittingInfo = {
    melds: MeldTileGroup[]

    groups: (TwoTilesGroup)[]

    /**
     * tiles we can not use to complete melds
     */
    separatedTiles: Tile[]
}
