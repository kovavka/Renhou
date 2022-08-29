import { Tile } from '../../game-types/Tile'
import { SuitType } from '../../game-types/SuitType'

function typeToNumber(type: SuitType) {
    switch (type) {
        case SuitType.MANZU:
            return 0
        case SuitType.PINZU:
            return 1
        case SuitType.SOUZU:
            return 2
        case SuitType.JIHAI:
            return 3
        default:
            throw new Error('unknown tile type')
    }
}

export function sortTiles(tiles: Tile[]): Tile[] {
    return tiles.sort((a, b) => {
        if (a.type === b.type) return a.value - b.value

        return typeToNumber(a.type) - typeToNumber(b.type)
    })
}
