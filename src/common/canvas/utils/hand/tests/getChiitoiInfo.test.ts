import {getTilesFromString} from "./testUtils";
import {SuitType} from "../../../core/game-types/SuitType";
import {getChiitoiInfo} from "../getChiitoiInfo";

describe('getChiitoiInfo', () => {
    describe('Tempai', () => {
        it('Should be only 1 single tile for 6*2t + 1*1t', () => {
            const tiles = getTilesFromString('1199m1199p1199s5z')
            const info = getChiitoiInfo(tiles)

            if (info === undefined) {
                throw new Error('cannot be undefined')
            }

            expect(info.shanten).toBe(0)
            expect(info.groups).toEqual([
                {type: SuitType.MANZU, value: 1},
                {type: SuitType.MANZU, value: 9},
                {type: SuitType.PINZU, value: 1},
                {type: SuitType.PINZU, value: 9},
                {type: SuitType.SOUZU, value: 1},
                {type: SuitType.SOUZU, value: 9},
            ])
            expect(info.singleTiles).toEqual([{type: SuitType.JIHAI, value: 5}])
            expect(info.tilesToDiscard).toEqual([])
        })
    })

    describe('Not a tempai', () => {
        describe('Only pairs + single tiles', () => {
            it('Should be 1 shanten and 3 single tiles for 5*2t + 3*1t', () => {
                const tiles = getTilesFromString('1199m1199p11s567z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                    {type: SuitType.JIHAI, value: 7},
                ])
                expect(info.tilesToDiscard).toEqual([])
            })

            it('Should be 2 shanten and 5 single tiles for 4*2t + 5*1t', () => {
                const tiles = getTilesFromString('1199m1199p19s567z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.SOUZU, value: 1},
                    {type: SuitType.SOUZU, value: 9},
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                    {type: SuitType.JIHAI, value: 7},
                ])
                expect(info.tilesToDiscard).toEqual([])
            })

            it('Should be 3 shanten and 7 single tiles for 3*2t + 7*1t', () => {
                const tiles = getTilesFromString('1199m1189p19s567z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(3)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.PINZU, value: 8},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                    {type: SuitType.SOUZU, value: 9},
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                    {type: SuitType.JIHAI, value: 7},
                ])
                expect(info.tilesToDiscard).toEqual([])
            })
        })

        describe('Only pairs + groups of 3 + single tiles', () => {
            it('Should be 1 shanten and 1 tile to discard for 5*2t + 1*3t', () => {
                const tiles = getTilesFromString('1199m1199p11999s')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                    {type: SuitType.SOUZU, value: 9},
                ])
                expect(info.singleTiles).toEqual([])
                expect(info.tilesToDiscard).toEqual([{type: SuitType.SOUZU, value: 9}])
            })

            it('Should be 1 shanten and 1 tiles to discard for 4*2t + 1*3t + 2*1t', () => {
                const tiles = getTilesFromString('1199m1199p111s56z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(1)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
                expect(info.tilesToDiscard).toEqual([{type: SuitType.SOUZU, value: 1}])
            })

            it('Should be 2 shanten and 1 tiles to discard for 3*2t + 1*3t + 4*1t', () => {
                const tiles = getTilesFromString('11m1199p111s3456z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 3},
                    {type: SuitType.JIHAI, value: 4},
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
                expect(info.tilesToDiscard).toEqual([{type: SuitType.SOUZU, value: 1}])
            })

            it('Should be 2 shanten and 2 tiles to discard for 3*2t + 2*3t + 1*1t', () => {
                const tiles = getTilesFromString('1199m11444p555s5z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })

            it('Should be 2 shanten and 2 tiles to discard for 2*2t + 2*3t + 3*1t', () => {
                const tiles = getTilesFromString('1199m111444p567z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 4},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                    {type: SuitType.JIHAI, value: 7},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 4},
                ])
            })

            it('Should be 3 shanten and 3 tiles to discard for 2*2t + 3*3t', () => {
                const tiles = getTilesFromString('1199m444p555s666z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(3)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
                expect(info.singleTiles).toEqual([])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
            })

            it('Should be 3 shanten and 3 tiles to discard for 1*2t + 3*3t + 2*1t', () => {
                const tiles = getTilesFromString('11999m444p555s56z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(3)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })

            it('Should be 3 shanten and 3 tiles to discard for 4*3t + 1*1t', () => {
                const tiles = getTilesFromString('111999m444p555s5z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(4)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })
        })

        describe('Only pairs + groups of 4 + single tiles', () => {
            it('Should be 2 shanten and 1 tile to discard for 4*2t + 1*4t + 1*1t', () => {
                const tiles = getTilesFromString('1199m1199p11119s')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                ])
                expect(info.singleTiles).toEqual([{type: SuitType.SOUZU, value: 9}])
                expect(info.tilesToDiscard).toEqual([{type: SuitType.SOUZU, value: 1}])
            })

            it('Should be 2 shanten and 1 tile to discard for 3*2t + 1*4t + 3*1t', () => {
                const tiles = getTilesFromString('11m1199p11119s56z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(2)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.PINZU, value: 1},
                    {type: SuitType.PINZU, value: 9},
                    {type: SuitType.SOUZU, value: 1},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.SOUZU, value: 9},
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
                expect(info.tilesToDiscard).toEqual([{type: SuitType.SOUZU, value: 1}])
            })

            it('Should be 4 shanten and 1 tiles to discard for 2*2t + 2*4t + 1*1t', () => {
                const tiles = getTilesFromString('1199m4444p5555s5z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(4)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })

            it('Should be 4 shanten and 1 tiles to discard for 1*2t + 2*4t + 3*1t', () => {
                const tiles = getTilesFromString('11m4444p5555s567z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(4)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                    {type: SuitType.JIHAI, value: 7},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })
        })

        describe('Mix groups of 2/3/4 + single tiles', () => {
            it('Should be 3 shanten and 2 tiles to discard for 2*2t + 1*3t + 1*4t + 2*1t', () => {
                const tiles = getTilesFromString('1199m444p5555s56z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(3)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })

            it('Should be 3 shanten and 2 tiles to discard for 1*2t + 2*3t + 1*4t + 1*1t', () => {
                const tiles = getTilesFromString('11999m444p5555s5z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(4)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.MANZU, value: 9},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })

            it('Should be 3 shanten and 2 tiles to discard for 2*3t + 1*4t + 2*1t', () => {
                const tiles = getTilesFromString('111m444p5555s567z')
                const info = getChiitoiInfo(tiles)

                if (info === undefined) {
                    throw new Error('cannot be undefined')
                }

                expect(info.shanten).toBe(4)
                expect(info.groups).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
                expect(info.singleTiles).toEqual([
                    {type: SuitType.JIHAI, value: 5},
                    {type: SuitType.JIHAI, value: 6},
                    {type: SuitType.JIHAI, value: 7},
                ])
                expect(info.tilesToDiscard).toEqual([
                    {type: SuitType.MANZU, value: 1},
                    {type: SuitType.PINZU, value: 4},
                    {type: SuitType.SOUZU, value: 5},
                ])
            })
        })
    })

    describe('Hand length !== 13', () => {
        it('Should be undefined for 10 tiles', () => {
            const tiles = getTilesFromString('19m19p19s1234z')
            expect(getChiitoiInfo(tiles)).toBe(undefined)
        })
        it('Should be undefined for 7 tiles', () => {
            const tiles = getTilesFromString('19m19p19s1z')
            expect(getChiitoiInfo(tiles)).toBe(undefined)
        })
        it('Should be undefined for 4 tiles', () => {
            const tiles = getTilesFromString('19m19p')
            expect(getChiitoiInfo(tiles)).toBe(undefined)
        })
        it('Should be undefined for 1 tiles', () => {
            const tiles = getTilesFromString('1m')
            expect(getChiitoiInfo(tiles)).toBe(undefined)
        })
    })
})