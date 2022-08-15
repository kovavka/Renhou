import { SuitType } from '../../../core/game-types/SuitType'
import { getClosestTiles } from '../getClosestTiles'

describe('getClosestTiles', () => {
    it('Should find [23] for 1', () => {
        const tile = { type: SuitType.MANZU, value: 1 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 2 },
            { type: SuitType.MANZU, value: 3 },
        ])
    })
    it('Should find [134] for 2', () => {
        const tile = { type: SuitType.MANZU, value: 2 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 1 },
            { type: SuitType.MANZU, value: 3 },
            { type: SuitType.MANZU, value: 4 },
        ])
    })
    it('Should find [1245] for 3', () => {
        const tile = { type: SuitType.MANZU, value: 3 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 1 },
            { type: SuitType.MANZU, value: 2 },
            { type: SuitType.MANZU, value: 4 },
            { type: SuitType.MANZU, value: 5 },
        ])
    })
    it('Should find [2356] for 4', () => {
        const tile = { type: SuitType.MANZU, value: 4 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 2 },
            { type: SuitType.MANZU, value: 3 },
            { type: SuitType.MANZU, value: 5 },
            { type: SuitType.MANZU, value: 6 },
        ])
    })
    it('Should find [3467] for 5', () => {
        const tile = { type: SuitType.MANZU, value: 5 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 3 },
            { type: SuitType.MANZU, value: 4 },
            { type: SuitType.MANZU, value: 6 },
            { type: SuitType.MANZU, value: 7 },
        ])
    })
    it('Should find [4578] for 6', () => {
        const tile = { type: SuitType.MANZU, value: 6 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 4 },
            { type: SuitType.MANZU, value: 5 },
            { type: SuitType.MANZU, value: 7 },
            { type: SuitType.MANZU, value: 8 },
        ])
    })
    it('Should find [5689] for 7', () => {
        const tile = { type: SuitType.MANZU, value: 7 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 5 },
            { type: SuitType.MANZU, value: 6 },
            { type: SuitType.MANZU, value: 8 },
            { type: SuitType.MANZU, value: 9 },
        ])
    })
    it('Should find [679] for 8', () => {
        const tile = { type: SuitType.MANZU, value: 8 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 6 },
            { type: SuitType.MANZU, value: 7 },
            { type: SuitType.MANZU, value: 9 },
        ])
    })
    it('Should find [78] for 9', () => {
        const tile = { type: SuitType.MANZU, value: 9 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.MANZU, value: 7 },
            { type: SuitType.MANZU, value: 8 },
        ])
    })
    it('Should find [1245] for 3 pin', () => {
        const tile = { type: SuitType.PINZU, value: 3 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.PINZU, value: 1 },
            { type: SuitType.PINZU, value: 2 },
            { type: SuitType.PINZU, value: 4 },
            { type: SuitType.PINZU, value: 5 },
        ])
    })
    it('Should find [1245] for 3 sou', () => {
        const tile = { type: SuitType.SOUZU, value: 3 }
        expect(getClosestTiles(tile)).toEqual([
            { type: SuitType.SOUZU, value: 1 },
            { type: SuitType.SOUZU, value: 2 },
            { type: SuitType.SOUZU, value: 4 },
            { type: SuitType.SOUZU, value: 5 },
        ])
    })
    it('Should not anything for 1 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 1 }
        expect(getClosestTiles(tile)).toEqual([])
    })
    it('Should not anything for 2 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 2 }
        expect(getClosestTiles(tile)).toEqual([])
    })
    it('Should not anything for 3 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 3 }
        expect(getClosestTiles(tile)).toEqual([])
    })
    it('Should not anything for 4 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 4 }
        expect(getClosestTiles(tile)).toEqual([])
    })
    it('Should not anything for 5 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 5 }
        expect(getClosestTiles(tile)).toEqual([])
    })
    it('Should not anything for 6 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 6 }
        expect(getClosestTiles(tile)).toEqual([])
    })
    it('Should not anything for 7 jihai', () => {
        const tile = { type: SuitType.JIHAI, value: 7 }
        expect(getClosestTiles(tile)).toEqual([])
    })
})
