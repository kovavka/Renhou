import {Tile} from "../../../core/game-types/Tile";
import {DrawTile} from "../../../core/game-types/DrawTile";

export interface IBotPlayer {
    setHand(handTiles: Tile[]): void

    /**
     * @return Tile from hand
     * @return undefined if draw tile
     */
    chooseTile(drawTile: DrawTile): Tile | undefined
}