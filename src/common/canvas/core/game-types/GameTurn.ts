import {Side} from "./Side";
import {DiscardTile} from "./Discard";

export type GameTurn = {
    side: Side
    discard: DiscardTile | undefined
    riichiAttempt: boolean
}