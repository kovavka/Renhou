import { Tile } from '../../../core/game-types/Tile'
import { DrawTile } from '../../../core/game-types/DrawTile'
import { Hand } from '../../../core/game-types/Hand'

export interface IBotPlayer {
    setHand(hand: Hand): void

    /**
     * @return Tile from hand
     * @return undefined if draw tile
     */
    chooseTile(drawTile: DrawTile): Tile | undefined
}
