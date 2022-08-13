import {HandSpittingInfo, splitHand, splitInfoToString} from "../splitHand";
import {SuitType} from "../../../core/game-types/SuitType";
import {generateChinitsuTempai} from "../../game/generateChinitsuTempai";
import {getTilesFromString} from "./testUtils";

function variantsToString(variants: HandSpittingInfo[], printType: boolean = false): string[] {
    return variants.map(x => splitInfoToString(x, printType))
}

describe('sddssd', () => {
    it('getTiles', () => {
        const tempai = generateChinitsuTempai(13)
        expect(tempai.possibleTilesToWait.length > 2).toBe(true)
        expect(tempai.hand.join('')).toBe(undefined)
    })
    it('check', () => {
        const tilesStr = '1111237777889'
        const tiles = tilesStr.split('').map(x => ({type: SuitType.MANZU, value: Number(x)}))
        const info = splitHand(tiles)

        expect(variantsToString(info, false)).toBe(undefined)
    })
})

describe('splitHand', () => {
    it('13 tiles with complicated structure', () => {
        const tiles = getTilesFromString('2225566777889m')
        const info = splitHand(tiles)
        expect(variantsToString(info)).toEqual(
            [
                '222 567 567 789 8',
                '222 567 678 789 5',
                '222 678 678 5 5 7 9',
                '222 777 5 5 6 6 8 8 9',
            ]
        )
    })
    it('The only variant is 4 melds + 1 tile', () => {
        const tiles = getTilesFromString('1111237777889m')
        const info = splitHand(tiles)
        expect(variantsToString(info)).toEqual(['111 123 777 789 8'])
    })
    it('The only variant is 1 meld + 2 tiles', () => {
        const tiles = getTilesFromString('23567m')
        const info = splitHand(tiles)
        expect(variantsToString(info)).toEqual(['567 2 3'])
    })
    it('Different suits', () => {
        const tiles = getTilesFromString('1112m3456p46777s')
        const info = splitHand(tiles)
        expect(variantsToString(info, true)).toEqual([
            '111m 345p 777s 2m 6p 4s 6s',
            '111m 456p 777s 2m 3p 4s 6s',
        ])
    })
    it('Should not find seqiential melds in honors', () => {
        const tiles = getTilesFromString('1112233444567z')
        const info = splitHand(tiles)
        expect(variantsToString(info)).toEqual(['111 444 2 2 3 3 5 6 7',])
    })
})
