import { Side } from '../../../../game-types/Side'
import { EdgeType } from './EdgeType'
import { TILE_SIDE_A, TILE_SIDE_B, TILE_SIDE_C } from './consts'

/**
 * @return [width, height]
 */
export function getTileSize(side: Side, edge: EdgeType, scale: number): [number, number] {
    let width: number
    let height: number

    const isVerticalTile = [Side.TOP, Side.BOTTOM].includes(side)
    if (edge === EdgeType.SIDE) {
        if (isVerticalTile) {
            width = TILE_SIDE_B
            height = TILE_SIDE_C
        } else {
            width = TILE_SIDE_C
            height = TILE_SIDE_B
        }
    } else {
        if (isVerticalTile) {
            width = TILE_SIDE_B
            height = TILE_SIDE_A
        } else {
            width = TILE_SIDE_A
            height = TILE_SIDE_B
        }
    }

    return [Math.floor(width * scale), Math.floor(height * scale)]
}
