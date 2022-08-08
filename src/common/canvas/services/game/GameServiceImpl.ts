import {IGameService} from "./IGameService";
import {Tile} from "../../core/game-types/Tile";
import {Hand} from "../../core/game-types/Hand";
import {DeadWallTile} from "../../core/game-types/DeadWallTile";
import {Discard} from "../../core/game-types/Discard";
import {generateWall} from "../../utils/generator/wallGenerator";

type GameState = {
    bottomHand: Hand
    leftHand: Hand
    rightHand: Hand
    topHand: Hand
    liveWall: Tile[]
    deadWall: DeadWallTile[]
    bottomDiscard: Discard
    leftDiscard: Discard
    rightDiscard: Discard
    topDiscard: Discard
}

export class GameServiceImpl implements IGameService {
    private gameState: GameState | undefined

    start(): void {
        const wall = generateWall()

    }
}