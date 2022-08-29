import {Wind} from "../../services/mahjong/state/Wind";

// should match images
export function getTileByWind(wind: Wind): number {
    switch (wind) {
        case Wind.EAST:
            return 1
        case Wind.SOUTH:
            return 2
        case Wind.WEST:
            return 3
        case Wind.NORTH:
            return 4
        default:
            throw new Error('unknown wind type')
    }
}