import { Tile } from '../../core/game-types/Tile'
import { SuitType } from '../../core/game-types/SuitType'

export function getTilesToCompleteSequence(tileA: Tile, tileB: Tile): [Tile] | [Tile, Tile] | [] {
    if (tileA.type !== tileB.type || tileA.type === SuitType.JIHAI) {
        return []
    }
    const type = tileA.type
    const minValue = Math.min(tileA.value, tileB.value)
    const maxValue = Math.max(tileA.value, tileB.value)

    if (maxValue - minValue === 2) {
        // kanchan 1_3
        return [
            {
                type,
                value: minValue + 1,
            },
        ]
    }

    if (maxValue - minValue === 1) {
        if (minValue === 1) {
            // penchan 12_
            return [
                {
                    type,
                    value: maxValue + 1,
                },
            ]
        }

        if (maxValue === 9) {
            // penchan _89
            return [
                {
                    type,
                    value: minValue - 1,
                },
            ]
        }

        // ryanmen _23_
        return [
            {
                type,
                value: minValue - 1,
            },
            {
                type,
                value: maxValue + 1,
            },
        ]
    }

    return []
}
