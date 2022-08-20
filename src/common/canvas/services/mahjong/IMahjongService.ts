import { Tile } from '../../core/game-types/Tile'
import signals from 'signals'
import { GameState } from './state/GameState'

export interface IMahjongService {
    readonly gameState: GameState | undefined
    stateChanged: signals.Signal<GameState>
    start(): void
    handTileClick(tile: Tile): void
    drawTileClick(): void
    tsumoClick(): void
}
