import { hasTiles } from '../tileContains'
import { getTilesFromString } from '../../hand/getTilesFromString'
import { SuitType } from '../../../core/game-types/SuitType'

describe('hasTiles', () => {
    it('should find a tile in a list if exists', () => {
        const tiles = getTilesFromString('234m')
        expect(hasTiles(tiles, { type: SuitType.MANZU, value: 3 })).toBe(true)
    })
    it('should find 2 tiles in a list if exist', () => {
        const tiles = getTilesFromString('234m')
        expect(
            hasTiles(tiles, { type: SuitType.MANZU, value: 2 }, { type: SuitType.MANZU, value: 3 })
        ).toBe(true)
    })
    it('should find 2 different suit tiles in a list', () => {
        const tiles = getTilesFromString('23m9s')
        expect(
            hasTiles(tiles, { type: SuitType.MANZU, value: 2 }, { type: SuitType.SOUZU, value: 9 })
        ).toBe(true)
    })
    it('should not find a tile if does not exist', () => {
        const tiles = getTilesFromString('234m')
        expect(hasTiles(tiles, { type: SuitType.SOUZU, value: 9 })).toBe(false)
    })
    it('should not find a tile when it has different suit type but similar value to others', () => {
        const tiles = getTilesFromString('234m')
        expect(hasTiles(tiles, { type: SuitType.SOUZU, value: 2 })).toBe(false)
    })
})
