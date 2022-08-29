import { Side } from '../../game-types/Side'

export function getNextSide(side: Side): Side {
    switch (side) {
        case Side.TOP:
            return Side.LEFT
        case Side.LEFT:
            return Side.BOTTOM
        case Side.BOTTOM:
            return Side.RIGHT
        case Side.RIGHT:
            return Side.TOP
        default:
            throw new Error('unknown tile type')
    }
}

export function getPrevSide(side: Side): Side {
    switch (side) {
        case Side.TOP:
            return Side.RIGHT
        case Side.LEFT:
            return Side.TOP
        case Side.BOTTOM:
            return Side.LEFT
        case Side.RIGHT:
            return Side.BOTTOM
        default:
            throw new Error('unknown tile type')
    }
}
