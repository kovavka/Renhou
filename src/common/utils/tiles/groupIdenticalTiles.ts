import { Tile } from '../../game-types/Tile'
import { isTheSameTile } from './tileContains'

export function groupIdenticalTiles(tiles: Tile[]): { tile: Tile; count: number }[] {
    return tiles.reduce<{ tile: Tile; count: number }[]>((acc, tile) => {
        const element = acc.find(x => isTheSameTile(x.tile, tile))
        if (element !== undefined) {
            const index = acc.indexOf(element)
            acc[index].count = acc[index].count + 1
        } else {
            acc.push({
                tile,
                count: 1,
            })
        }

        return acc
    }, [])
}
