import {getAllTerimalAndHonorTiles, getShantenInfo, HandStructureType} from "../getShantenInfo";
import {
    chun,
    haku,
    hatsu,
    man1,
    man2,
    man3,
    man4, man5, man6, man7,
    man9,
    nan,
    pei,
    pin1,
    pin9,
    shaa,
    sou1, sou2, sou3, sou4,
    sou9,
    ton
} from "./testVariables";
import {hasTempai} from "../hasTempai";
import {hasTiles} from "../../tiles/tileContains";
import {sortTiles} from "../../game/sortTiles";

describe('getShantenInfo', () => {
    describe('Chiitoi', () => {
        describe('6 pairs and a unique tile', () => {
            it('Should be 0 shanten and only 1 tile to improve', () => {
                const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, haku]
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].shantenCount).toBe(0)
                expect(shantenInfo[0].tilesToDiscard).toEqual([])
                expect(shantenInfo[0].possibleReplacements).toEqual([haku])
                expect(shantenInfo[0].tilesToImprove).toEqual([haku])
            })
        })
         describe('5 pairs and group of 3 tiles', () => {
             it('Should be 1 shanten, 1 tile to discard and 28 tiles to improve', () => {
                 const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, sou9]
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].shantenCount).toBe(1)
                 expect(shantenInfo[0].tilesToDiscard).toEqual([sou9])
                 expect(shantenInfo[0].possibleReplacements).toEqual([])

                 const tilesToImprove = shantenInfo[0].tilesToImprove
                 expect(hasTiles(tilesToImprove, ...tiles)).toBe(false)
                 expect(tilesToImprove.length).toBe(28)
             })
        })
         describe('4 pairs, 1 group of 4 tiles and a unique tile', () => {
             it('Should be 2 shanten, 1 tile to discard and 29 to improve', () => {
                 const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou1, sou1, sou9]
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].shantenCount).toBe(2)
                 expect(shantenInfo[0].tilesToDiscard).toEqual([sou1])
                 expect(shantenInfo[0].possibleReplacements).toEqual([sou9])

                 const tilesToImprove = shantenInfo[0].tilesToImprove
                 expect(hasTiles(tilesToImprove, ...tiles)).toBe(false)
                 expect(tilesToImprove.length).toBe(29)
             })
        })
        describe('4 pairs, 1 group of 3 tiles and 2 different unique tiles', () => {
             it('Should be 1 shanten and 3 tiles to improve', () => {
                 const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou1, hatsu, chun]
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].shantenCount).toBe(1)
                 expect(shantenInfo[0].tilesToDiscard).toEqual([sou1])
                 expect(shantenInfo[0].tilesToImprove).toEqual([hatsu, chun])
                 expect(shantenInfo[0].possibleReplacements).toEqual([hatsu, chun])
             })
        })
        describe('5 pairs and 3 different unique tiles', () => {
             it('Should be 1 shanten and 3 tiles to improve', () => {
                 const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, haku, hatsu, chun]
                 const shantenInfo = getShantenInfo(tiles)

                 expect(shantenInfo[0].shantenCount).toBe(1)
                 expect(shantenInfo[0].tilesToDiscard).toEqual([])
                 expect(shantenInfo[0].tilesToImprove).toEqual([haku, hatsu, chun])
                 expect(shantenInfo[0].possibleReplacements).toEqual([haku, hatsu, chun])
             })
        })
    })

    describe('Toitoi', () => {
        describe('2 pairs, 2 group of 4 tiles and a unique tile', () => {
            it('Should be 2 shanten, 1 tile to discard and 30 to improve', () => {
                const tiles = [man1, man1, man9, man9, pin1, pin1, pin1, pin1, sou1, sou1, sou1, sou1, sou9]
                const shantenInfo = getShantenInfo(tiles)

                // todo doesn't work properly with kans
                expect(shantenInfo[0].shantenCount).toBe(2)
                expect(shantenInfo[0].tilesToDiscard).toEqual([pin1, sou1])
                expect(shantenInfo[0].possibleReplacements).toEqual([sou9])
                expect(shantenInfo[0].tilesToImprove).toEqual([man1, man9, sou9])
            })
        })
    })

    describe('Ryanpeikou tempai', () => {
        it('Should be only 1 tile to improve when tanki wait', () => {
            const tiles = [man1, man1, man2, man2, man3, man3, sou1, sou1, sou2, sou2, sou3, sou3, haku]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].structureType).toBe(HandStructureType.REGULAR)
            expect(shantenInfo[0].shantenCount).toBe(0)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([haku])
            expect(shantenInfo[0].tilesToImprove).toEqual([haku])
        })
        it('Should be only 1 tile to improve when ryanmen wait', () => {
            const tiles = [man1, man1, man2, man2, man3, man3, sou1, sou2, sou2, sou3, sou3, haku, haku]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].shantenCount).toBe(0)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([])
            expect(shantenInfo[0].tilesToImprove).toEqual([sou1, sou4])
        })
    })

    describe('Kokushi muso', () => {
        describe('12 single terminal and honor tiles + pair for one of them', () => {
            it('Should be 0 shanten and only 1 tile to improve', () => {
                const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, shaa]
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].shantenCount).toBe(0)
                expect(shantenInfo[0].tilesToDiscard).toEqual([])
                expect(shantenInfo[0].possibleReplacements).toEqual([])
                expect(shantenInfo[0].tilesToImprove).toEqual([pei])
            })
        })
        describe('13 single terminal and honor tiles', () => {
            it('Should be 0 shanten and 13 tiles to improve', () => {
                const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, pei]
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].shantenCount).toBe(0)
                expect(shantenInfo[0].tilesToDiscard).toEqual([])
                expect(shantenInfo[0].possibleReplacements).toEqual([])
                expect(shantenInfo[0].tilesToImprove).toEqual(getAllTerimalAndHonorTiles())
            })
        })
        describe('12 single terminal and honor tiles + 1 man/pin/sou tile from 2 to 8', () => {
            it('Should be 1 shanten and 14 tiles to improve', () => {
                const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, man2]
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].shantenCount).toBe(1)
                expect(shantenInfo[0].tilesToDiscard).toEqual([man2])
                expect(shantenInfo[0].possibleReplacements).toEqual([])
                expect(sortTiles(shantenInfo[0].tilesToImprove)).toEqual([...getAllTerimalAndHonorTiles()])
            })
        })
    })
    describe('Regular structure', () => {
        it('Should be 0 shanten for ryanmen + pair', () => {
            const tiles = [man1, man1, man4, man5]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].shantenCount).toBe(0)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([])
            expect(shantenInfo[0].tilesToImprove).toEqual([man3, man6])
        })
        it('Should be 0 shanten for pair + pair', () => {
            const tiles = [man1, man1, man4, man4]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].shantenCount).toBe(0)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([])
            expect(shantenInfo[0].tilesToImprove).toEqual([man1, man4])
        })
        it('Should be 0 shanten for meld + separated tile', () => {
            const tiles = [man1, man2, man3, man9]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].shantenCount).toBe(0)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([man9])
            expect(shantenInfo[0].tilesToImprove).toEqual([man9])
        })
        it('Should get 3 waits for tiles 3334', () => {
            const tiles = [man3, man3, man3, man4]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].shantenCount).toBe(0)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([man4]) // todo maybe remove it from possible because it affect waits?
            expect(shantenInfo[0].tilesToImprove).toEqual([man4])


            expect(shantenInfo[1].shantenCount).toBe(0)
            expect(shantenInfo[1].tilesToDiscard).toEqual([])
            expect(shantenInfo[1].possibleReplacements).toEqual([])
            expect(shantenInfo[1].tilesToImprove).toEqual([man2, man5])
        })
        it('Should be 3 shanten for 3 groups + separated tile', () => {
            const tiles = [man1, man2, man5, man6, sou1, sou2, sou9]
            const shantenInfo = getShantenInfo(tiles)

            expect(shantenInfo[0].shantenCount).toBe(2)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([sou9]) // todo maybe add one of groups to possible replacement somehow?
            expect(shantenInfo[0].tilesToImprove).toEqual([man3, man4, man7, sou3, sou9])
        })
    })

})
