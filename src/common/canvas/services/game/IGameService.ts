import {Tile} from "../../core/game-types/Tile";
import {DeadWallTile} from "../../core/game-types/DeadWallTile";
import {Hand} from "../../core/game-types/Hand";
import {Discard} from "../../core/game-types/Discard";
import {Side} from "../../core/game-types/Side";
import {GameTurn} from "../../core/game-types/GameTurn";

export type GameState = {
    liveWall: Tile[]
    deadWall: DeadWallTile[]
    replacementTiles: Tile[]
    bottomHand: Hand
    leftHand: Hand
    rightHand: Hand
    topHand: Hand
    bottomDiscard: Discard
    leftDiscard: Discard
    rightDiscard: Discard
    topDiscard: Discard
    currentDealer: Side
    // lastTurn: GameTurn | undefined
    currentTurn: GameTurn
}


export interface IGameService {
    readonly gameState: GameState | undefined
    start(): void
}