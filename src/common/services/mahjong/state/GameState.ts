import { Tile } from '../../../core/game-types/Tile'
import { DeadWallTile } from '../../../core/game-types/DeadWallTile'
import { Side } from '../../../core/game-types/Side'
import { Hand } from '../../../core/game-types/Hand'
import { Discard } from '../../../core/game-types/Discard'
import { GameTurn } from '../../../core/game-types/GameTurn'
import { Wind } from './Wind'
import { Outcome } from './Outcome'
import { Meld } from '../../../core/game-types/Meld'

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
