import { Wind } from '../../services/mahjong/state/Wind'
import { Tile } from '../../core/game-types/Tile'
import { SuitType } from '../../core/game-types/SuitType'
import { EAST_VALUE, NORTH_VALUE, SOUTH_VALUE, WEST_VALUE } from '../../core/consts/honors'

export function getTileByWind(wind: Wind): Tile {
    switch (wind) {
        case Wind.EAST:
            return { value: EAST_VALUE, type: SuitType.JIHAI }
        case Wind.SOUTH:
            return { value: SOUTH_VALUE, type: SuitType.JIHAI }
        case Wind.WEST:
            return { value: WEST_VALUE, type: SuitType.JIHAI }
        case Wind.NORTH:
            return { value: NORTH_VALUE, type: SuitType.JIHAI }
        default:
            throw new Error('unknown wind type')
    }
}
