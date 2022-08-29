import { getHandStructureVariants, HandStructureInfo } from '../getHandStructureVariants'
import { getUniqueTiles, hasTiles } from '../../tiles/tileContains'
import { sortTiles } from '../../game/sortTiles'
import { getTilesFromString } from '../getTilesFromString'
import { SuitType } from '../../../game-types/SuitType'
import { Tile } from '../../../game-types/Tile'

describe('getHandStructureVariants', () => {
    // todo add test for useful tiles (and maybe check it in smart bot):
    //  we can replace 1235 to 1234 or 2345 without shanten changing, but with imrpoving ukeire

    function shouldContain(tilesList: Tile[], toContain: Tile[]): void {
        const isContain = hasTiles(tilesList, ...toContain)
        expect(isContain).toBe(true)
    }

    function shouldNotContain(tilesList: Tile[], toContain: Tile[]): void {
        const isContain = hasTiles(tilesList, ...toContain)
        expect(isContain).toBe(false)
    }

    function getAllUniqueWaits(handVariants: HandStructureInfo[], shantenValue: number) {
        const allWaits = handVariants.reduce<Tile[]>((acc, info) => {
            if (info.minShanten === shantenValue) {
                info.groupingVariants.forEach(groupingVariant => {
                    if (groupingVariant.shanten === shantenValue) {
                        acc.push(...groupingVariant.waits)
                    }
                })
            }

            return acc
        }, [])

        return sortTiles(getUniqueTiles(allWaits))
    }
    describe('structure like 3334, 3335, etc.', () => {
        it('tempai with 3 identical + the next one', () => {
            const tiles = getTilesFromString('1236667m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.MANZU, value: 8 },
            ])
        })

        it('tempai with 3 identical + [tile + 2]', () => {
            const tiles = getTilesFromString('1236668m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.MANZU, value: 8 },
            ])
        })

        it('tempai with 3 identical + the previous one', () => {
            const tiles = getTilesFromString('1235666m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 7 },
            ])
        })

        it('tempai with 3 identical + [tile - 2]', () => {
            const tiles = getTilesFromString('1235777m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
            ])
        })

        it('tempai with structure like 3334555', () => {
            const tiles = getTilesFromString('3334555m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(2)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
            ])
        })

        it('tempai with structure like 3334666', () => {
            const tiles = getTilesFromString('3334666m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
            ])
        })

        it('tempai with structure like 3335666', () => {
            const tiles = getTilesFromString('3335666m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 7 },
            ])
        })

        it('tempai with structure like 3335777', () => {
            const tiles = getTilesFromString('3335777m789p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
            ])
        })

        it('3 shanten with structure like 6667 and 4 sequential groups', () => {
            const tiles = getTilesFromString('1256m126667p125s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)

            // pin 5 and 8 won't be improvements, because we have too much groups,
            // and it will be 1 meld (678), pair (66) + 4 other groups which is still 3 shanten
            shouldNotContain(uniqueWaits, [
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
            ])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 7 },
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 2 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 5 },
            ])
        })

        it('2 shanten with structure like 6667 + 1 meld and 3 sequential groups', () => {
            const tiles = getTilesFromString('1256m126667p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            // pin 5 and 8 won't be improvements, because we have too much groups
            shouldNotContain(uniqueWaits, [
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
            ])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 7 },
            ])
        })

        it('2 shanten with structure like 6667 + 1 meld and 2 sequential groups', () => {
            const tiles = getTilesFromString('1259m126667p123s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            // pin 5 and 8 will be improvements, because we have just enough groups,
            // but we don't have a pair, and 66 + 678 will give us a pair
            shouldContain(uniqueWaits, [
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
            ])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 7 },
                { type: SuitType.PINZU, value: 8 },
            ])
        })

        it('3 shanten with structure like 6667 + 1 meld and 1 sequential groups', () => {
            const tiles = getTilesFromString('159m126667p1239s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)

            // pin 5 and 8 will be improvements, because we don't have just enough groups
            shouldContain(uniqueWaits, [
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
            ])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 6 },
                { type: SuitType.PINZU, value: 7 },
                { type: SuitType.PINZU, value: 8 },
                { type: SuitType.PINZU, value: 9 },
                { type: SuitType.SOUZU, value: 7 },
                { type: SuitType.SOUZU, value: 8 },
                { type: SuitType.SOUZU, value: 9 },
            ])
        })

        it('1 shanten with structure like 6667 + 2 meld and 1 sequential groups', () => {
            const tiles = getTilesFromString('1236667m78p1239s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(1)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 1)

            shouldContain(uniqueWaits, [
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 8 },
            ])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.PINZU, value: 6 },
                { type: SuitType.PINZU, value: 9 },
                { type: SuitType.SOUZU, value: 9 },
            ])
        })
    })

    describe('structure like 3567, 3457, etc.', () => {
        it('not enough groups with 3567 + 1 pair + 1 seq group', () => {
            const tiles = getTilesFromString('88m3567p1269s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            // 8 pin will be an improvement, because making 35 + 678 from 3567 will decrease shanten
            shouldContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 4 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 4 },
                { type: SuitType.SOUZU, value: 5 },
                { type: SuitType.SOUZU, value: 6 },
                { type: SuitType.SOUZU, value: 7 },
                { type: SuitType.SOUZU, value: 8 },
                { type: SuitType.SOUZU, value: 9 },
            ])
        })

        it('not enough groups with 3567 + 1 pair + 4 separated tiles', () => {
            const tiles = getTilesFromString('88m3567p1234z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)
            shouldContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 4 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
                { type: SuitType.JIHAI, value: 1 },
                { type: SuitType.JIHAI, value: 2 },
                { type: SuitType.JIHAI, value: 3 },
                { type: SuitType.JIHAI, value: 4 },
            ])
        })

        it('not enough groups with 3567 + 1 pair + 1 separated tiles', () => {
            const tiles = getTilesFromString('88m3567p1s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(1)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 1)
            shouldContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 4 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 2 },
                { type: SuitType.SOUZU, value: 3 },
            ])
        })

        it('not enough groups with 3567 without pair', () => {
            const tiles = getTilesFromString('78m3567p1234z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)
            shouldContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])
            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 4 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
                { type: SuitType.JIHAI, value: 1 },
                { type: SuitType.JIHAI, value: 2 },
                { type: SuitType.JIHAI, value: 3 },
                { type: SuitType.JIHAI, value: 4 },
            ])
        })

        it('just enough groups with 3567 without pair', () => {
            const tiles = getTilesFromString('78m3567p1s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(1)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 1)
            shouldNotContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])
            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.SOUZU, value: 1 },
            ])
        })

        it('just enough groups with 3567 + 1 pair + 2 group', () => {
            const tiles = getTilesFromString('88m3567p1256s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(1)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 1)
            shouldNotContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])

            expect(uniqueWaits).toEqual([
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 4 },
                { type: SuitType.SOUZU, value: 7 },
            ])
        })

        it('too much seq groups with 3567 + 0 pair + 3 group', () => {
            const tiles = getTilesFromString('89m3567p1256s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)
            shouldNotContain(uniqueWaits, [{ type: SuitType.PINZU, value: 8 }])

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 2 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 4 },
                { type: SuitType.SOUZU, value: 5 },
                { type: SuitType.SOUZU, value: 6 },
                { type: SuitType.SOUZU, value: 7 },
            ])
        })
    })

    describe('Toitoi structure', () => {
        it('2 shanten with 2 pairs, 2 group of 4 tiles and a unique tile', () => {
            const tiles = getTilesFromString('1199m1111p11119s')
            const handVariants = getHandStructureVariants(tiles)

            // todo should be in bot:
            //  1. make a call if we have a kan and how it change the structure
            //     (should not for riichi and should not increase shanten)
            //  2. we should check if we are going to wait 5th tile of the suit

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 2 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 7 },
                { type: SuitType.SOUZU, value: 8 },
                { type: SuitType.SOUZU, value: 9 },
            ])
        })

        it('0 shanten with 4 triplets and a not a unique tile', () => {
            // it's 0 shanten, but it's not a tempai, because we are waiting for 5th tile with 4 in the hand
            const tiles = getTilesFromString('999m1111p111777s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([{ type: SuitType.PINZU, value: 1 }])
        })

        it('tempai with 3 triplets and 2 pairs', () => {
            const tiles = getTilesFromString('1199m111p111777s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 9 },
            ])
        })

        it('tempai with 4 triplets and a unique tile', () => {
            const tiles = getTilesFromString('1999m111p111777s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([{ type: SuitType.MANZU, value: 1 }])
        })
    })

    describe('Ryanpeikou tempai', () => {
        it('Should be only 1 tile to improve when tanki wait', () => {
            const tiles = getTilesFromString('112233m112233s5z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([{ type: SuitType.JIHAI, value: 5 }])
        })

        it('Should be only 1 tile to improve when ryanmen wait', () => {
            const tiles = getTilesFromString('112233m12233s55z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 4 },
            ])
        })
    })

    describe('Regular structure', () => {
        it('0 shanten for ryanmen + pair', () => {
            const tiles = getTilesFromString('1145m')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 6 },
            ])
        })

        it('0 shanten for pair + pair', () => {
            const tiles = getTilesFromString('1144m')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 4 },
            ])
        })

        it('0 shanten for meld + separated tile', () => {
            const tiles = getTilesFromString('1239m')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([{ type: SuitType.MANZU, value: 9 }])
        })

        it('0 shanten for structure like 2345', () => {
            const tiles = getTilesFromString('2345m')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(2)
            expect(handVariants[0].minShanten).toBe(0)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 0)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 5 },
            ])
        })

        it('2 shanten for 3 groups + separated tile', () => {
            const tiles = getTilesFromString('1256m129s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 5 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 7 },

                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 2 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 9 },
            ])
        })

        it('4 shanten with 1 meld, 1 pair and 1 seq group', () => {
            const tiles = getTilesFromString('9m36799p1567s123z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(4)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 4)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.MANZU, value: 8 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.PINZU, value: 1 },
                { type: SuitType.PINZU, value: 2 },
                { type: SuitType.PINZU, value: 3 },
                { type: SuitType.PINZU, value: 4 },
                { type: SuitType.PINZU, value: 5 },
                { type: SuitType.PINZU, value: 8 },
                { type: SuitType.PINZU, value: 9 },
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 2 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.JIHAI, value: 1 },
                { type: SuitType.JIHAI, value: 2 },
                { type: SuitType.JIHAI, value: 3 },
            ])
        })

        it('3 groups without pair + 1 separated tile', () => {
            const tiles = getTilesFromString('1256m129s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)
            const result: Tile[] = [
                ...tiles,
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 7 },
                { type: SuitType.SOUZU, value: 3 },
            ]

            expect(uniqueWaits).toEqual(sortTiles(result))
        })

        it('3 groups with pair + 1 separated tile', () => {
            const tiles = getTilesFromString('1256m119s')
            const handVariants = getHandStructureVariants(tiles)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(1)

            const uniqueWaits = getAllUniqueWaits(handVariants, 1)

            // 1 won't be an improvement, because we would have 12 and 56 groups left -> still 1 shanten
            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.MANZU, value: 7 },
            ])
        })

        it('5 groups without pair', () => {
            const tiles = getTilesFromString('124578m1245s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)
            const result: Tile[] = [
                ...tiles,
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.SOUZU, value: 3 },
                { type: SuitType.SOUZU, value: 6 },
            ]

            expect(uniqueWaits).toEqual(sortTiles(result))
        })

        it('5 groups with pair', () => {
            const tiles = getTilesFromString('124578m1244s')
            const handVariants = getHandStructureVariants(tiles)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            // 4 sou won't be an improvement, because we would still have 2 shanten

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.SOUZU, value: 3 },
            ])
        })

        it('4 groups without pair + 2 separated tiles', () => {
            const tiles = getTilesFromString('124578m1259s')
            const handVariants = getHandStructureVariants(tiles)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)

            const result: Tile[] = [
                ...tiles,
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.SOUZU, value: 3 },
            ]

            expect(uniqueWaits).toEqual(sortTiles(result))
        })

        it('4 groups with 1 pair + 2 separated tiles', () => {
            const tiles = getTilesFromString('124578m1159s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
            ])
        })

        it('5 groups with 2 pairs', () => {
            const tiles = getTilesFromString('124578m1155s')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(2)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(true)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(true)

            const uniqueWaits = getAllUniqueWaits(handVariants, 2)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 3 },
                { type: SuitType.MANZU, value: 6 },
                { type: SuitType.MANZU, value: 9 },
                { type: SuitType.SOUZU, value: 1 },
                { type: SuitType.SOUZU, value: 5 },
            ])
        })

        it('1 seq group and 5 separated tiles', () => {
            const tiles = getTilesFromString('23m12345z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 1 },
                { type: SuitType.MANZU, value: 4 },
                { type: SuitType.JIHAI, value: 1 },
                { type: SuitType.JIHAI, value: 2 },
                { type: SuitType.JIHAI, value: 3 },
                { type: SuitType.JIHAI, value: 4 },
                { type: SuitType.JIHAI, value: 5 },
            ])
        })

        it('1 pair and 5 separated tiles', () => {
            const tiles = getTilesFromString('22m12345z')
            const handVariants = getHandStructureVariants(tiles)

            expect(handVariants.length).toBe(1)
            expect(handVariants[0].minShanten).toBe(3)
            expect(handVariants[0].groupingVariants[0].canDiscardSeq).toBe(false)
            expect(handVariants[0].groupingVariants[0].canDiscardPair).toBe(false)

            const uniqueWaits = getAllUniqueWaits(handVariants, 3)

            expect(uniqueWaits).toEqual([
                { type: SuitType.MANZU, value: 2 },
                { type: SuitType.JIHAI, value: 1 },
                { type: SuitType.JIHAI, value: 2 },
                { type: SuitType.JIHAI, value: 3 },
                { type: SuitType.JIHAI, value: 4 },
                { type: SuitType.JIHAI, value: 5 },
            ])
        })
    })
})
