import {getShantenInfo} from "../getShantenInfo";
import {
    chun,
    haku,
    hatsu,
    man1,
    man2,
    man3,
    man4,
    man9,
    nan,
    pei,
    pin1,
    pin9,
    shaa,
    sou1,
    sou9,
    ton
} from "./testVariables";
import {hasTempai} from "../hasTempai";
import {hasTiles} from "../../tiles/tileContains";

describe('getShantenInfo', () => {
    describe('Chiitoi', () => {
        it('Should be only 1 tile to improve when there are 6 pairs and a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, haku]
            const shantenInfo = getShantenInfo(tiles)
            expect(shantenInfo[0].tilesToDiscard).toEqual([])
            expect(shantenInfo[0].possibleReplacements).toEqual([])
            expect(shantenInfo[0].tilesToImprove).toEqual([haku])
        })
        it('Should be only 1 tile to discard and 28 other tiles to imprpove when there are 6 pairs and 1 not a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, sou9]
            const shantenInfo = getShantenInfo(tiles)
            expect(shantenInfo[0].tilesToDiscard).toEqual([sou9])
            expect(shantenInfo[0].possibleReplacements).toEqual([])

            const tilesToImprove = shantenInfo[0].tilesToImprove
            expect(hasTiles(tilesToImprove, ...tiles)).toBe(false)
            expect(tilesToImprove.length).toBe(28)
        })
        it('Not a templai when there are 4 pairs, 4 duplicate tiles and a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou1, sou1, sou9]
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('Kokushi muso', () => {
        it('Tempai when there are 12 single terminal and honor tiles + pair for one of them', () => {
            const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, shaa]
            expect(hasTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 13 single terminal and honor tiles', () => {
            const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, pei]
            expect(hasTempai(tiles)).toBe(true)
        })
        it('Not a templai when there is at least 1 man/pin/sou tile from 2 to 8', () => {
            const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, man2]
            expect(hasTempai(tiles)).toBe(false)
        })
    })
})
