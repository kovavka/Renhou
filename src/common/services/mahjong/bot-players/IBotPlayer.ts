import { Tile } from '../../../game-types/Tile'
import { DrawTile } from '../../../game-types/DrawTile'
import { Hand } from '../../../game-types/Hand'

export interface IBotPlayer {
    setHand(hand: Hand): void

    /**
     * @return Tile from hand
     * @return undefined if draw tile
     */
    chooseTile(drawTile: DrawTile): Tile | undefined
}
