import {getAllTerimalAndHonorTiles, getShantenInfo, HandStructureType} from "../getShantenInfo";
import {hasTiles} from "../../tiles/tileContains";
import {sortTiles} from "../../game/sortTiles";
import {getTilesFromString} from "./testUtils";
import {SuitType} from "../../../core/game-types/SuitType";

describe('getShantenInfo', () => {
    describe('Chiitoi', () => {
        describe('6 pairs and a unique tile', () => {
            it('Should be 0 shanten and only 1 tile to improve', () => {
                const tiles = getTilesFromString('1199m1199p1199s5z')
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].value).toBe(0)
                expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
                expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.JIHAI, value: 5}])
                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.JIHAI, value: 5}])
                expect(shantenInfo[0].nextDrawInfo.toLeave).toEqual([

                ])
                expect(shantenInfo[0].nextDrawInfo.canDraw).toEqual([])
            })
        })
         describe('5 pairs and group of 3 tiles', () => {
             it('Should be 1 shanten, 1 tile to discard and 28 tiles to improve', () => {
                 const tiles = getTilesFromString('1199m1199p11999s')
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].value).toBe(1)
                 expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([{type: SuitType.SOUZU, value: 9}])
                 expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])

                 const tilesToImprove = shantenInfo[0].nextDrawInfo.improvements
                 expect(hasTiles(tilesToImprove, ...tiles)).toBe(false)
                 expect(tilesToImprove.length).toBe(28)
             })
        })
         describe('4 pairs, 1 group of 4 tiles and a unique tile', () => {
             it('Should be 2 shanten, 1 tile to discard and 29 to improve', () => {
                 const tiles = getTilesFromString('1199m1199p11119s')
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].value).toBe(2)
                 expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([{type: SuitType.SOUZU, value: 1}])
                 expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.SOUZU, value: 9}])

                 const tilesToImprove = shantenInfo[0].nextDrawInfo.improvements
                 expect(hasTiles(tilesToImprove, ...tiles)).toBe(false)
                 expect(tilesToImprove.length).toBe(29)
             })
        })
        describe('4 pairs, 1 group of 3 tiles and 2 different unique tiles', () => {
             it('Should be 1 shanten and 3 tiles to improve', () => {
                 const tiles = getTilesFromString('1199m1199p111s56z')
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].value).toBe(1)
                 expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([{type: SuitType.SOUZU, value: 1}])
                 expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.JIHAI, value: 5}, {type: SuitType.JIHAI, value: 6}])
                 expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.JIHAI, value: 5}, {type: SuitType.JIHAI, value: 6}])
             })
        })
        describe('5 pairs and 3 different unique tiles', () => {
             it('Should be 1 shanten and 3 tiles to improve', () => {
                 const tiles = getTilesFromString('1199m1199p11s567z')
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].value).toBe(1)
                 expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])

                 const separatedTiles = [{type: SuitType.JIHAI, value: 5}, {type: SuitType.JIHAI, value: 6}, {type: SuitType.JIHAI, value: 7}]
                 expect(shantenInfo[0].nextDrawInfo.improvements).toEqual(separatedTiles)
                 expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual(separatedTiles)
             })
        })
    })

    describe('Toitoi', () => {
        describe('2 pairs, 2 group of 4 tiles and a unique tile', () => {
            it('Should be 2 shanten, 1 tile to discard and 30 to improve', () => {
                const tiles = getTilesFromString('1199m1111p11119s')
                const shantenInfo = getShantenInfo(tiles)

                // todo doesn't work properly with kans
                //  1. we could add 4th tile for a meld to canDraw (or new field) and make a call using this information
                //  2. we should check if we are going to wait 5th tile of the suit
                expect(shantenInfo[0].value).toBe(2)
                expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([{type: SuitType.PINZU, value: 1}, {type: SuitType.SOUZU, value: 2}])
                expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.SOUZU, value: 9}])
                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 1}, {type: SuitType.MANZU, value: 9}, {type: SuitType.SOUZU, value: 9}])
            })
        })
    })

    describe('Ryanpeikou tempai', () => {
        it('Should be only 1 tile to improve when tanki wait', () => {
            const tiles = getTilesFromString('112233m112233s5z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].structureType).toBe(HandStructureType.REGULAR)
            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.JIHAI, value: 5}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.JIHAI, value: 5}])
        })
        it('Should be only 1 tile to improve when ryanmen wait', () => {
            const tiles = getTilesFromString('112233m12233s55z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.SOUZU, value: 1}, {type: SuitType.SOUZU, value: 4}])
        })
    })

    describe('Kokushi muso', () => {
        describe('12 single terminal and honor tiles + pair for one of them', () => {
            it('Should be 0 shanten and only 1 tile to improve', () => {
                const tiles = getTilesFromString('19m19p19s1234566z')
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].value).toBe(0)
                expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
                expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.JIHAI, value: 7}])
            })
        })
        describe('13 single terminal and honor tiles', () => {
            it('Should be 0 shanten and 13 tiles to improve', () => {
                const tiles = getTilesFromString('19m19p19s1234567z')
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].value).toBe(0)
                expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
                expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual(getAllTerimalAndHonorTiles())
            })
        })
        describe('12 single terminal and honor tiles + 1 man/pin/sou tile from 2 to 8', () => {
            it('Should be 1 shanten and 14 tiles to improve', () => {
                const tiles = getTilesFromString('129m19p19s123456z')
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].value).toBe(1)
                expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([{type: SuitType.MANZU, value: 2}])
                expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
                expect(sortTiles(shantenInfo[0].nextDrawInfo.improvements)).toEqual(getAllTerimalAndHonorTiles())
            })
        })
    })
    describe('Regular structure', () => {
        it('Should be 0 shanten for ryanmen + pair', () => {
            const tiles = getTilesFromString('1145m')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 3}, {type: SuitType.MANZU, value: 6}])
        })
        it('Should be 0 shanten for pair + pair', () => {
            const tiles = getTilesFromString('1144m')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 1}, {type: SuitType.MANZU, value: 4}])
        })
        it('Should be 0 shanten for meld + separated tile', () => {
            const tiles = getTilesFromString('1239m')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.MANZU, value: 9}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 9}])
        })
        it('Should get 3 waits for hand like 3334', () => {
            const tiles = getTilesFromString('3334m')
            const shantenInfo = getShantenInfo(tiles)

            // todo doesn't work properly with compicated waits

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 2}, {type: SuitType.MANZU, value: 4}, {type: SuitType.MANZU, value: 5}])
        })
        it('Should get 2 waits for hand like 3555', () => {
            const tiles = getTilesFromString('3555m')
            const shantenInfo = getShantenInfo(tiles)

            // todo doesn't work properly with compicated waits

            expect(shantenInfo[0].value).toBe(0)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.MANZU, value: 3}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([{type: SuitType.MANZU, value: 3}, {type: SuitType.MANZU, value: 4}])
        })
        it('Should get 5 possible improvements for part like 3555m', () => {
            const tiles = getTilesFromString('3555m149s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(2)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.toLeave).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canDraw).toEqual([])

            const separatedTiles = [
                {type: SuitType.MANZU, value: 3},
                {type: SuitType.SOUZU, value: 1},
                {type: SuitType.SOUZU, value: 4},
                {type: SuitType.SOUZU, value: 9},
            ]
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual(separatedTiles)

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
        it('Should be 3 shanten for 3 groups + separated tile', () => {
            const tiles = getTilesFromString('1256m129s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(2)
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.SOUZU, value: 9}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual(tiles)
        })

        it('4 shanten with pair', () => {
            // 9m36799p3567s123z + 4p
            const tiles = getTilesFromString('9m36799p3567s123z')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([{type: SuitType.SOUZU, value: 9}])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('3 groups without pair + 1 separated tile', () => {
            const tiles = getTilesFromString('1256m129s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('3 groups with pair + 1 separated tile', () => {
            const tiles = getTilesFromString('1256m119s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups without pair', () => {
            const tiles = getTilesFromString('124578m1245s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups with pair', () => {
            const tiles = getTilesFromString('124578m1244s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('4 groups without pair + 2 separated tiles', () => {
            const tiles = getTilesFromString('124578m1259s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups with 1 pair + 2 separated tiles', () => {
            const tiles = getTilesFromString('124578m1159s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })

        it('5 groups with 2 pairs', () => {
            const tiles = getTilesFromString('124578m1155s')
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].value).toBe(4)
            expect(shantenInfo[0].splittingInfo.melds).toEqual([[]])
            expect(shantenInfo[0].nextDrawInfo.toDiscard).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.canReplace).toEqual([])
            expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
        })
    })

})
