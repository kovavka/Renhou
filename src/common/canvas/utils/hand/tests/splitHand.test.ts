import {MeldVariant, splitHand, handInfoToString, splitToGroups, GroupingVariant} from "../splitHand";
import {getTilesFromString} from "./testUtils";

describe('splitHand', () => {
    function variantsToString(variants: MeldVariant[], printType: boolean = false): string[] {
        return variants.map(x => handInfoToString(x.melds, x.remainingTiles, printType))
    }

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

describe('splitToGroups', () => {
    function variantsToString(variants: GroupingVariant[], printType: boolean = false): string[] {
        return variants.map(x => handInfoToString([...x.pairs, ...x.sequences], x.uselessTiles, printType))
    }

    it('Complicated structure', () => {
        const tiles = getTilesFromString('11224m')
        const variants = splitToGroups(tiles)
        expect(variantsToString(variants)).toEqual([
            '11 22 4',
            '11 24 2',
            '12 12 4',
            '12 24 1',

        ])
    })
    it('One suit', () => {
        const tiles = getTilesFromString('1145m')
        const variants = splitToGroups(tiles)
        expect(variantsToString(variants)).toEqual([
            '11 45',
        ])
    })
    it('Different suits', () => {
        const tiles = getTilesFromString('11m1289p24s')
        const variants = splitToGroups(tiles)
        expect(variantsToString(variants, true)).toEqual([
            '11m 12p 24s 89p',
        ])
    })
    it('Should find only pairs for honors', () => {
        const tiles = getTilesFromString('1123445z')
        const variants = splitToGroups(tiles)
        expect(variantsToString(variants)).toEqual([
            '11 44 2 3 5',
        ])
    })
})
