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
    it('13 tiles in a one suit with complicated structure', () => {
        const tiles = getTilesFromString('2225566777889m')
        const info = splitHand(tiles)
        expect(variantsToString(info, false)).toEqual(
            [
                '222 5 56 68 777 89',
                '222 5 57 678 678 9',
                '222 567 567 789 8',
                '222 55 66 777 88 9',
                '222 55 678 678 79',
                '222 55 68 68 777 9',
                '222 56 56 88 777 9',
                '222 567 678 789',
            ]
        )
    })
    it('13 tiles in a one suit', () => {
        const tiles = getTilesFromString('1111237777889m')
        const info = splitHand(tiles)
        expect(variantsToString(info, false)).toEqual(['111 123 777 789 8'])
    })
    it('The only variant is sequence + pair', () => {
        const tiles = getTilesFromString('23567m')
        const info = splitHand(tiles)
        expect(variantsToString(info, false)).toEqual(['23 567'])
    })
})