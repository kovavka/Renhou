import { Tile } from '../../game-types/Tile'
import { SuitType } from '../../game-types/SuitType'

export function getTerimalAndHonors(): Tile[] {
    return [
        { type: SuitType.MANZU, value: 1 },
        { type: SuitType.MANZU, value: 9 },
        { type: SuitType.PINZU, value: 1 },
        { type: SuitType.PINZU, value: 9 },
        { type: SuitType.SOUZU, value: 1 },
        { type: SuitType.SOUZU, value: 9 },
        { type: SuitType.JIHAI, value: 1 },
        { type: SuitType.JIHAI, value: 2 },
        { type: SuitType.JIHAI, value: 3 },
        { type: SuitType.JIHAI, value: 4 },
        { type: SuitType.JIHAI, value: 5 },
        { type: SuitType.JIHAI, value: 6 },
        { type: SuitType.JIHAI, value: 7 },
    ]
}
