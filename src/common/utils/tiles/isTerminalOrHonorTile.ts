import { Tile } from '../../game-types/Tile'
import { SuitType } from '../../game-types/SuitType'

export function isTerminalOrHonorTile(tile: Tile): boolean {
    return tile.type === SuitType.JIHAI || tile.value === 1 || tile.value === 9
}
