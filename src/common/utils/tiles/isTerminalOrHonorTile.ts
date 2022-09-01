import { Tile } from '../../core/game-types/Tile'
import { SuitType } from '../../core/game-types/SuitType'

export function isTerminalOrHonorTile(tile: Tile): boolean {
    return tile.type === SuitType.JIHAI || isTerminal(tile)
}

export function isTerminal(tile: Tile): boolean {
    return tile.type !== SuitType.JIHAI && (tile.value === 1 || tile.value === 9)
}