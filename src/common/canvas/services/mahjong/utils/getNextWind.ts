import { Wind } from '../state/Wind'

export function getNextWind(wind: Wind): Wind {
    switch (wind) {
        case Wind.EAST:
            return Wind.SOUTH
        case Wind.SOUTH:
            return Wind.WEST
        case Wind.WEST:
            return Wind.NORTH
        case Wind.NORTH:
            return Wind.EAST
        default:
            throw new Error('unknown wind type')
    }
}
