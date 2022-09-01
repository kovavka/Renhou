import { Tile } from '../../core/game-types/Tile'
import { SuitType } from '../../core/game-types/SuitType'

export function isSimpleTile(tile: Tile): boolean {
    return tile.type !== SuitType.JIHAI && tile.value !== 1 && tile.value !== 9
}