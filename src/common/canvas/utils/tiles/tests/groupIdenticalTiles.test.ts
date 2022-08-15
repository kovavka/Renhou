import { groupIdenticalTiles } from '../groupIdenticalTiles'
import { getTilesFromString } from '../../hand/tests/testUtils'
import { SuitType } from '../../../core/game-types/SuitType'

describe('groupIdenticalTiles', () => {
    it('should group unique items with count = 0', () => {
        const tiles = getTilesFromString('234m')
        const result = [
            {
                tile: { type: SuitType.MANZU, value: 2 },
                count: 1,
            },
            {
                tile: { type: SuitType.MANZU, value: 3 },
                count: 1,
            },
            {
                tile: { type: SuitType.MANZU, value: 4 },
                count: 1,
            },
        ]
        expect(groupIdenticalTiles(tiles)).toEqual(result)
    })
    it('should group items with count > 1', () => {
        const tiles = getTilesFromString('11999m7777p')
        const result = [
            {
                tile: { type: SuitType.MANZU, value: 1 },
                count: 2,
            },
            {
                tile: { type: SuitType.MANZU, value: 9 },
                count: 3,
            },
            {
                tile: { type: SuitType.PINZU, value: 7 },
                count: 4,
            },
        ]
        expect(groupIdenticalTiles(tiles)).toEqual(result)
    })
})
