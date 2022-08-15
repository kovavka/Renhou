import {getShantenInfo} from "../getShantenInfo";
import {hasTiles} from "../../tiles/tileContains";
import {sortTiles} from "../../game/sortTiles";
import {getTilesFromString} from "./testUtils";
import {SuitType} from "../../../core/game-types/SuitType";
import {Tile} from "../../../core/game-types/Tile";

describe('getShantenInfo', () => {
    describe('Toitoi', () => {
        describe('2 pairs, 2 group of 4 tiles and a unique tile', () => {
            it('Should be 2 shanten, 1 tile to discard and 30 to improve', () => {
                const tiles = getTilesFromString('1199m1111p11119s')
                const shantenInfo = getShantenInfo(tiles)

                // todo doesn't work properly with kans
                //  1. we could add 4th tile for a meld to canDraw (or new field) and make a call using this information
                //  2. we should check if we are going to wait 5th tile of the suit
                expect(shantenInfo[0].value).toBe(2)
                // expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([{type: SuitType.PINZU, value: 1}, {type: SuitType.SOUZU, value: 2}])
                expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([{type: SuitType.SOUZU, value: 9}])
                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 1}, {type: SuitType.MANZU, value: 9}, {type: SuitType.SOUZU, value: 9}])
            })
        })
    })

    describe('Ryanpeikou tempai', () => {
        it('Should be only 1 tile to improve when tanki wait', () => {
            const tiles = getTilesFromString('112233m112233s5z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([{type: SuitType.JIHAI, value: 5}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.JIHAI, value: 5}])
        })
        it('Should be only 1 tile to improve when ryanmen wait', () => {
            const tiles = getTilesFromString('112233m12233s55z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.SOUZU, value: 1}, {type: SuitType.SOUZU, value: 4}])
        })
    })

    describe('Regular structure', () => {
        it('Should be 0 shanten for ryanmen + pair', () => {
            const tiles = getTilesFromString('1145m')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 3}, {type: SuitType.MANZU, value: 6}])
        })
        it('Should be 0 shanten for pair + pair', () => {
            const tiles = getTilesFromString('1144m')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 1}, {type: SuitType.MANZU, value: 4}])
        })
        it('Should be 0 shanten for meld + separated tile', () => {
            const tiles = getTilesFromString('1239m')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([{type: SuitType.MANZU, value: 9}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 9}])
        })
        it('Should get 3 waits for hand like 3334', () => {
            const tiles = getTilesFromString('3334m')
            const shantenInfo = getShantenInfo(tiles)

            // todo doesn't work properly with compicated waits

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 2}, {type: SuitType.MANZU, value: 4}, {type: SuitType.MANZU, value: 5}])
        })
        it('Should get 2 waits for hand like 3555', () => {
            const tiles = getTilesFromString('3555m')
            const shantenInfo = getShantenInfo(tiles)

            // todo doesn't work properly with compicated waits

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([{type: SuitType.MANZU, value: 3}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 3}, {type: SuitType.MANZU, value: 4}])
        })
        it('Should get 5 possible improvements for part like 3555m', () => {
            const tiles = getTilesFromString('3555m149s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(2)
            expect(shantenInfo[0].nextDrawInfo.usefulTiles).toEqual([])

            const separatedTiles = [
                {type: SuitType.MANZU, value: 3},
                {type: SuitType.SOUZU, value: 1},
                {type: SuitType.SOUZU, value: 4},
                {type: SuitType.SOUZU, value: 9},
            ]
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual(separatedTiles)

            const improvements = [
                {type: SuitType.MANZU, value: 1},
                {type: SuitType.MANZU, value: 2},
                {type: SuitType.MANZU, value: 3},
                {type: SuitType.MANZU, value: 4},
                {type: SuitType.MANZU, value: 5},

                {type: SuitType.SOUZU, value: 1},
                {type: SuitType.SOUZU, value: 2},
                {type: SuitType.SOUZU, value: 3},
                {type: SuitType.SOUZU, value: 4},
                {type: SuitType.SOUZU, value: 5},
                {type: SuitType.SOUZU, value: 6},
                {type: SuitType.SOUZU, value: 7},
                {type: SuitType.SOUZU, value: 8},
                {type: SuitType.SOUZU, value: 9},
            ]
            expect(sortTiles(shantenInfo[0].nextDrawInfo.improvements)).toEqual(improvements)
        })
        it('Should be 2 shanten for 3 groups + separated tile', () => {
            const tiles = getTilesFromString('1256m129s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(2)
            expect(shantenInfo[0].nextDrawInfo.usefulTiles).toEqual([
                {type: SuitType.MANZU, value: 1}, // remvoe
                {type: SuitType.MANZU, value: 2}, // remvoe
                {type: SuitType.MANZU, value: 5}, // remvoe
                {type: SuitType.MANZU, value: 6}, // remvoe
                {type: SuitType.MANZU, value: 8},

                {type: SuitType.SOUZU, value: 1},  // remvoe
                {type: SuitType.SOUZU, value: 2}, // remvoe
                {type: SuitType.SOUZU, value: 4},
                {type: SuitType.SOUZU, value: 7},
                {type: SuitType.SOUZU, value: 8},
            ])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([{type: SuitType.SOUZU, value: 9}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([
                ...tiles,
                {type: SuitType.MANZU, value: 3},
                {type: SuitType.MANZU, value: 4},
                {type: SuitType.MANZU, value: 7},

                {type: SuitType.SOUZU, value: 3},
                {type: SuitType.SOUZU, value: 9},
            ])
        })

        it('4 shanten with pair', () => {
            // 9m36799p3567s123z + 4p
            const tiles = getTilesFromString('9m36799p3567s123z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([{type: SuitType.SOUZU, value: 9}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('3 groups without pair + 1 separated tile', () => {
            const tiles = getTilesFromString('1256m129s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('3 groups with pair + 1 separated tile', () => {
            const tiles = getTilesFromString('1256m119s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups without pair', () => {
            const tiles = getTilesFromString('124578m1245s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups with pair', () => {
            const tiles = getTilesFromString('124578m1244s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('4 groups without pair + 2 separated tiles', () => {
            const tiles = getTilesFromString('124578m1259s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups with 1 pair + 2 separated tiles', () => {
            const tiles = getTilesFromString('124578m1159s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups with 2 pairs', () => {
            const tiles = getTilesFromString('124578m1155s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('1 groups and 6 separated tiles', () => {
            const tiles = getTilesFromString('')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.safeToReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })
    })

    describe('problem with sets - chiitoi + regular', () => {
        function shouldContain(tiles: Tile[], tile: Tile): void {
            const isContain = hasTiles(tiles, tile)
            expect(isContain).toBe(true)
        }

        // 7m889p237799s123z + 7p
        it('7m889p237799s123z', () => {
            const tiles = getTilesFromString('7m889p237799s123z')
            const shantenInfo = getShantenInfo(tiles)

            shouldContain(shantenInfo[1].nextDrawInfo.improvements, {type: SuitType.PINZU, value: 7})
        })

        // 18m118p278s14667z + 6z
        it('18m118p278s14667z', () => {
            const tiles = getTilesFromString('18m118p278s14667z')
            const shantenInfo = getShantenInfo(tiles)

            shouldContain(shantenInfo[1].nextDrawInfo.improvements, {type: SuitType.PINZU, value: 6})
        })

        // 67m5778p44668s33z + 7m
        it('67m5778p44668s33z', () => {
            const tiles = getTilesFromString('67m5778p44668s33z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        // 13m45778p12s1134z + 6p
        it('13m45778p12s1134z', () => {
            const tiles = getTilesFromString('13m45778p12s1134z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })
    })

})
