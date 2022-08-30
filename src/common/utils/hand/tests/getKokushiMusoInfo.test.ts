import { getKokushiMusoInfo } from '../getKokushiMusoInfo'
import { getTilesFromString } from '../getTilesFromString'
import { SuitType } from '../../../core/game-types/SuitType'
import { getTerimalAndHonors } from '../../tiles/getTerimalAndHonors'
import { sortTiles } from '../../game/sortTiles'

describe('getKokushiMusoInfo', () => {
    describe('Tempai', () => {
        it('Should be 0 shanten and only 1 tile to improve for 11 single orphans + pair', () => {
            const tiles = getTilesFromString('19m19p19s1234566z')
            const info = getKokushiMusoInfo(tiles)

            if (info === undefined) {
                throw new Error('cannot be undefined')
            }

            expect(info.shanten).toBe(0)
            expect(info.tilesToImprove).toEqual([{ type: SuitType.JIHAI, value: 7 }])
            expect(info.tilesToDiscard).toEqual([])
        })

        it('Should be 0 shanten and 13 tiles to improve for 13 orphans', () => {
            const tiles = getTilesFromString('19m19p19s1234567z')
            const info = getKokushiMusoInfo(tiles)

            if (info === undefined) {
                throw new Error('cannot be undefined')
            }

            expect(info.shanten).toBe(0)
            expect(info.tilesToImprove).toEqual(getTerimalAndHonors())
            expect(info.tilesToDiscard).toEqual([])
        })
    })

    describe('Not a tempai', () => {
        describe('Has non-orphan tiles (2-8 man/pin/sou)', () => {
            it('1 shanten and 13 tiles to improve for 12 orphans + 1 other', () => {
                const tiles = getTilesFromString('129m19p19s123456z')
                const info = getKokushiMusoInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(sortTiles(info.tilesToImprove)).toEqual(getTerimalAndHonors())
                expect(info.tilesToDiscard).toEqual([{ type: SuitType.MANZU, value: 2 }])
            })

            it('1 shanten and 2 tiles to improve for 10 single orphans + orphan pair + 1 other tile', () => {
                const tiles = getTilesFromString('129m19p19s123455z')
                const info = getKokushiMusoInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(info.tilesToImprove).toEqual([
                    { type: SuitType.JIHAI, value: 6 },
                    { type: SuitType.JIHAI, value: 7 },
                ])
                expect(info.tilesToDiscard).toEqual([{ type: SuitType.MANZU, value: 2 }])
            })

            it('3 shanten and 13 tiles to improve for 11 orphans + 1 other + 1 non-orphan pair', () => {
                const tiles = getTilesFromString('129m1559p19s1234z')
                const info = getKokushiMusoInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(3)
                expect(info.tilesToImprove).toEqual(getTerimalAndHonors())
                expect(info.tilesToDiscard).toEqual([
                    { type: SuitType.MANZU, value: 2 },
                    { type: SuitType.PINZU, value: 5 },
                ])
            })
        })

        describe('Has only terminals and honors, but too many duplicates', () => {
            it('Should be 1 shanten and 2 tile to improve for 9 single orphans + 2 pairs', () => {
                const tiles = getTilesFromString('19m11p9s12345567z')
                const info = getKokushiMusoInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(info.tilesToImprove).toEqual([
                    { type: SuitType.PINZU, value: 9 },
                    { type: SuitType.SOUZU, value: 1 },
                ])
                expect(info.tilesToDiscard).toEqual([
                    { type: SuitType.PINZU, value: 1 },
                    { type: SuitType.JIHAI, value: 5 },
                ])
            })

            it('Should be 2 shanten and 2 tile to improve for 8 single orphans + 1 pairs + 1 pon', () => {
                const tiles = getTilesFromString('19m111p12345567z')
                const info = getKokushiMusoInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.tilesToImprove).toEqual([
                    { type: SuitType.PINZU, value: 9 },
                    { type: SuitType.SOUZU, value: 1 },
                    { type: SuitType.SOUZU, value: 9 },
                ])
                expect(info.tilesToDiscard).toEqual([
                    { type: SuitType.PINZU, value: 1 },
                    { type: SuitType.JIHAI, value: 5 },
                ])
            })

            it('Should be 2 shanten and 2 tile to improve for 10 single orphans + 1 pon', () => {
                const tiles = getTilesFromString('19m111p1s1234567z')
                const info = getKokushiMusoInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(info.tilesToImprove).toEqual([
                    { type: SuitType.PINZU, value: 9 },
                    { type: SuitType.SOUZU, value: 9 },
                ])
                expect(info.tilesToDiscard).toEqual([{ type: SuitType.PINZU, value: 1 }])
            })
        })
    })

    describe('Hand length !== 13', () => {
        it('Should be undefined for 10 tiles', () => {
            const tiles = getTilesFromString('19m19p19s1234z')
            expect(getKokushiMusoInfo(tiles)).toBe(undefined)
        })
        it('Should be undefined for 7 tiles', () => {
            const tiles = getTilesFromString('19m19p19s1z')
            expect(getKokushiMusoInfo(tiles)).toBe(undefined)
        })
        it('Should be undefined for 4 tiles', () => {
            const tiles = getTilesFromString('19m19p')
            expect(getKokushiMusoInfo(tiles)).toBe(undefined)
        })
        it('Should be undefined for 1 tiles', () => {
            const tiles = getTilesFromString('1m')
            expect(getKokushiMusoInfo(tiles)).toBe(undefined)
        })
    })
})
