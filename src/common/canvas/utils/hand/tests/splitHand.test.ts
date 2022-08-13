import {HandSpittingInfo, processTiles} from "../getShantenInfo";
import {
    haku, hatsu,
    man2,
    man3,
    man5,
    man6,
    man7,
    man9,
    pin3,
    pin6,
    pin7,
    pin9,
    sou3,
    sou5,
    sou6,
    sou7, ton
} from "./testVariables";
import {Tile} from "../../../core/game-types/Tile";
import {SuitType} from "../../../core/game-types/SuitType";

describe('splitHand', () => {
    const tileTypes = {
        [SuitType.MANZU]: 'm',
        [SuitType.PINZU]: 'p',
        [SuitType.SOUZU]: 's',
        [SuitType.JIHAI]: 'z',
    }

    function groupToString(tiles: Tile[], printType: boolean): string {
        return tiles.map(tile => tile.value).join('') + (printType ? tileTypes[tiles[0].type] : '')
    }

    function tileToString(tile: Tile, printType: boolean): string {
        return tile.value + (printType ? tileTypes[tile.type] : '')
    }

    function infoToString(info: HandSpittingInfo[], printType: boolean): string[] {
        return info.map(x => {
            const melds = x.melds.map(x => groupToString(x, printType))
            const groups = x.groups.map(x => groupToString(x, printType))
            const separatedTiles = x.separatedTiles.map(x => tileToString(x, printType))

            const all = []
            if (melds.length) all.push(...melds)
            if (groups.length) all.push(...groups)
            if (separatedTiles.length) all.push(...separatedTiles)

            return [...melds, ...groups, ...separatedTiles].join(', ')
        })
    }

    it('', () => {
        const tiles = [man2, man3, man5, man6, man7]
        const info = processTiles(tiles)
        expect(info).toEqual([])
    })
    it('', () => {
        const tiles = [sou3, sou5, sou6, sou7]
        const info = processTiles(tiles)
        const result = infoToString(info, false)
        expect(info).toEqual([])
    })
})