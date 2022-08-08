import {Tile} from "./Tile";
import {Side} from "./Side";

export enum SetType {
    PON,
    CHII,
    KAN,
}

export enum KanType {
    CLOSED,
    OPENED,
    UPGRADED,
}

export type Pon = BaseSet & {
    fromHand: [Tile, Tile]
    type: SetType.PON
}

export type Chii = BaseSet & {
    fromHand: [Tile, Tile]
    type: SetType.CHII
}


export type Kan = BaseSet & {
    fromHand: [Tile, Tile, Tile]
    kanType: KanType
    type: SetType.KAN
}

export type BaseSet = {
    fromPlayers: Tile
    playerSide: Side
    type: SetType
}

export type Meld = Chii | Pon | Kan
