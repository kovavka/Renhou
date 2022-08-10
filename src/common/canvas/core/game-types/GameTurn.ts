import {Side} from "./Side";
import {DiscardTile} from "./Discard";
import {DrawTile} from "./DrawTile";

export type GameTurn = {
    side: Side
    discardTile: DiscardTile | undefined
    riichiAttempt: boolean
    drawTile: DrawTile
}