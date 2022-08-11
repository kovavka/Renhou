/**
 * variant of hand developing
 */
import {Tile} from "../../core/game-types/Tile";

export type MeldTileGroup = [Tile, Tile, Tile]
export type IncompleteMeldTileGroup = [Tile, Tile] // pair or 2/3 sequential meld tiles
export type SingleTileGroup = [Tile]

export type HandStructure = {
    melds: MeldTileGroup[]

    /**
     * undefined when there are more than one pairs -> pairs will be used as waits
     */
    pair: Tile | undefined

    /**
     * tiles we can not use to complete melds
     */
    separatedTiles: Tile[]

    meldsToComplete: (IncompleteMeldTileGroup)[]
}

export type ShantenInfo = {
    variant: HandStructure
    amount: number
}