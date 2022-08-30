import { getTilesToCompleteSequence } from '../getTilesToCompleteSequence'
import { SuitType } from '../../../core/game-types/SuitType'

describe('getTilesToCompleteSequence', () => {
    describe('Sequential group', () => {
        it('Penchan 12_', () => {
            const tileA = { type: SuitType.MANZU, value: 1 }
            const tileB = { type: SuitType.MANZU, value: 2 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 3 },
            ])
        })
        it('Penchan 21_', () => {
            const tileA = { type: SuitType.MANZU, value: 2 }
            const tileB = { type: SuitType.MANZU, value: 1 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 3 },
            ])
        })
        it('Penchan _89', () => {
            const tileA = { type: SuitType.MANZU, value: 8 }
            const tileB = { type: SuitType.MANZU, value: 9 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 7 },
            ])
        })
        it('Penchan _98', () => {
            const tileA = { type: SuitType.MANZU, value: 9 }
            const tileB = { type: SuitType.MANZU, value: 8 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 7 },
            ])
        })
        it('Ryanmen 23', () => {
            const tileA = { type: SuitType.MANZU, value: 2 }
            const tileB = { type: SuitType.MANZU, value: 3 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 4 },
            ])
        })
        it('Ryanmen 56', () => {
            const tileA = { type: SuitType.MANZU, value: 5 }
            const tileB = { type: SuitType.MANZU, value: 6 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 7 },
            ])
        })
        it('Ryanmen 87', () => {
            const tileA = { type: SuitType.MANZU, value: 8 }
            const tileB = { type: SuitType.MANZU, value: 7 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
            ])
        })
        it('Kanchan 1_3', () => {
            const tileA = { type: SuitType.MANZU, value: 1 }
            const tileB = { type: SuitType.MANZU, value: 3 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 2 },
            ])
        })
        it('Kanchan 4_6', () => {
            const tileA = { type: SuitType.MANZU, value: 4 }
            const tileB = { type: SuitType.MANZU, value: 6 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 5 },
            ])
        })
        it('Kanchan 9_7', () => {
            const tileA = { type: SuitType.MANZU, value: 9 }
            const tileB = { type: SuitType.MANZU, value: 7 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.MANZU, value: 8 },
            ])
        })
        it('Pin suit', () => {
            const tileA = { type: SuitType.PINZU, value: 4 }
            const tileB = { type: SuitType.PINZU, value: 5 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 6 },
            ])
        })
        it('Sou suit', () => {
            const tileA = { type: SuitType.SOUZU, value: 6 }
            const tileB = { type: SuitType.SOUZU, value: 7 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([
                { type: SuitType.SOUZU, value: 5 },
                { type: SuitType.SOUZU, value: 8 },
            ])
        })
    })
    describe('NOT a sequential group', () => {
        it('2 tiles between', () => {
            const tileA = { type: SuitType.MANZU, value: 1 }
            const tileB = { type: SuitType.MANZU, value: 4 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([])
        })
        it('Identical tiles', () => {
            const tileA = { type: SuitType.MANZU, value: 4 }
            const tileB = { type: SuitType.MANZU, value: 4 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([])
        })
        it('Different suits', () => {
            const tileA = { type: SuitType.MANZU, value: 1 }
            const tileB = { type: SuitType.PINZU, value: 4 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([])
        })
        it('Honor tiles', () => {
            const tileA = { type: SuitType.JIHAI, value: 2 }
            const tileB = { type: SuitType.JIHAI, value: 3 }
            expect(getTilesToCompleteSequence(tileA, tileB)).toEqual([])
        })
    })
})
