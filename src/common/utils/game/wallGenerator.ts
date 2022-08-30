import { SuitType } from '../../core/game-types/SuitType'
import { Tile } from '../../core/game-types/Tile'

function addTiles(all: Tile[], type: SuitType, value: number) {
    const tile = { type, value }

    all.push(tile)
    all.push(Object.assign({}, tile))
    all.push(Object.assign({}, tile))
    all.push(Object.assign({}, tile))
}

function initTiles(): Tile[] {
    const all: Tile[] = []
    for (let i = 1; i < 10; i++) {
        addTiles(all, SuitType.MANZU, i)
        addTiles(all, SuitType.PINZU, i)
        addTiles(all, SuitType.SOUZU, i)

        if (i < 8) {
            addTiles(all, SuitType.JIHAI, i)
        }
    }
    return all
}

function shuffle(tiles: Tile[]): Tile[] {
    return tiles.sort(function () {
        return 0.5 - Math.random()
    })
}

function randomShuffle(tiles: Tile[]): Tile[] {
    let rand = 1 + Math.random() * 10
    let shuffled = tiles
    for (let i = 0; i < rand; i++) {
        shuffled = shuffle(shuffled)
    }

    return shuffled
}

export function generateWall() {
    return randomShuffle(initTiles())
}
