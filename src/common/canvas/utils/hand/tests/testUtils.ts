import { SuitType } from '../../../core/game-types/SuitType'
import { Tile } from '../../../core/game-types/Tile'

const tilesRegexp = new RegExp('^(([1-9]*)m)?(([1-9]*)p)?(([1-9]*)s)?(([1-7]*)z)?$')

export function getTilesFromString(tilesStr: string): Tile[] {
    const matches = tilesStr.match(tilesRegexp)

    if (!matches) {
        throw new Error('incorrect hand structure')
    }

    const manTiles =
        matches[2]?.split('').map(x => ({ type: SuitType.MANZU, value: Number(x) })) ?? []
    const pinTiles =
        matches[4]?.split('').map(x => ({ type: SuitType.PINZU, value: Number(x) })) ?? []
    const souTiles =
        matches[6]?.split('').map(x => ({ type: SuitType.SOUZU, value: Number(x) })) ?? []
    const honorTiles =
        matches[8]?.split('').map(x => ({ type: SuitType.JIHAI, value: Number(x) })) ?? []

    return [...manTiles, ...pinTiles, ...souTiles, ...honorTiles]
}
