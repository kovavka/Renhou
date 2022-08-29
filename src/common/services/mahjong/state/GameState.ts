import { Tile } from '../../../game-types/Tile'
import { DeadWallTile } from '../../../game-types/DeadWallTile'
import { Side } from '../../../game-types/Side'
import { Hand } from '../../../game-types/Hand'
import { Discard } from '../../../game-types/Discard'
import { GameTurn } from '../../../game-types/GameTurn'
import { Wind } from './Wind'
import { Outcome } from './Outcome'
import { Meld } from '../../../game-types/Meld'

// todo add this to game state
type PlayerState = {
    tiles: Tile[]
    openMelds: Meld[]
    riichi: boolean
    furitenTiles: Tile[]
    discard: Discard
    score: number // todo
}

export type GameState = {
    liveWall: Tile[]
    deadWall: DeadWallTile[]
    replacementTiles: Tile[]

    hands: { [side in Side]: Hand }
    discards: { [side in Side]: Discard }

    currentDealer: Side
    currentTurn: GameTurn

    wind: Wind
    round: number
    renchan: number
    riichi: Side[]

    outcome: Outcome | undefined
}
