import {Tile} from "../../core/game-types/Tile";

export function excludeTiles(all: Tile[], ...tilesToExclude: Tile[]): Tile[] {
    const result: Tile[] = []

    all.forEach(tile => {
        const excludeIndex = tilesToExclude.findIndex(x => x.type === tile.type && x.value === tile.value)
        if (excludeIndex === -1) {
            result.push(tile)
        } else {
            tilesToExclude = [...tilesToExclude.slice(0, excludeIndex), ...tilesToExclude.slice(excludeIndex + 1)]
        }
    })
    return result
}

export function hasTiles(all: Tile[], ...tiles: Tile[]): boolean {
    return tiles.every(tile => all.findIndex(x => x.value === tile.value && x.type === tile.type) !== -1)
}

export function getIdenticalTileCount(all: Tile[], tile: Tile): number {
    return  all.filter(x => isTheSameTile(x, tile)).length
}

export function hasIdenticalTiles(all: Tile[], tile: Tile, count: number): boolean {
    return getIdenticalTileCount(all, tile) >= count
}

export function isTheSameTile(tileA: Tile, tileB: Tile): boolean {
    return tileA.type === tileB.type && tileA.value === tileB.value
}

export function getUniqueTiles(tiles: Tile[]): Tile[] {
    return tiles.reduce<Tile[]>((acc, tile) => {
        const element = acc.find(x => isTheSameTile(x, tile))
        if (element === undefined) {
            acc.push(tile)
        }

        return acc
    }, [])
}
