import { Tile } from '../../game-types/Tile'
import { TILE_TYPES_STR } from '../../game-types/SuitType'

export function tileToString(tile: Tile, printType: boolean): string {
    const typeStr = printType ? TILE_TYPES_STR[tile.type] : ''
    return tile.value + typeStr
}
