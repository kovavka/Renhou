import {
    MeldVariant,
    splitToMelds,
    handInfoToString,
    splitToGroups,
    GroupingVariant,
} from '../splitHand'
import { getTilesFromString } from './testUtils'

function meldVariantsToString(variants: MeldVariant[], printType: boolean = false): string[] {
    return variants.map(x => handInfoToString(x.melds, x.remainingTiles, printType))
}
function groupingVariantsToString(
    variants: GroupingVariant[],
    printType: boolean = false
): string[] {
    return variants.map(x =>
        handInfoToString([...x.pairs, ...x.sequences], x.uselessTiles, printType)
    )
}

describe('splitHand', () => {
    describe('splitToMelds', () => {
        it('13 tiles with complicated structure', () => {
            const tiles = getTilesFromString('2225566777889m')
            const info = splitToMelds(tiles)
            expect(meldVariantsToString(info)).toEqual([
                '222 567 567 789 8',
                '222 567 678 789 5',
                '222 678 678 5 5 7 9',
                '222 777 5 5 6 6 8 8 9',
                '222 567 5 6 7 7 8 8 9',
            ])
        })

        it('The only variant is 4 melds + 1 tile', () => {
            const tiles = getTilesFromString('1235m345789p234s')
            const info = splitToMelds(tiles)
            expect(meldVariantsToString(info, true)).toEqual(['123m 345p 789p 234s 5m'])
        })

        it('The only variant is 1 meld + 2 tiles', () => {
            const tiles = getTilesFromString('23567m')
            const info = splitToMelds(tiles)
            expect(meldVariantsToString(info)).toEqual(['567 2 3'])
        })

        it('Should not find seqiential melds in honors', () => {
            const tiles = getTilesFromString('1112233444567z')
            const info = splitToMelds(tiles)
            expect(meldVariantsToString(info)).toEqual(['111 444 2 2 3 3 5 6 7'])
        })
    })
    describe('Mixed waits', () => {
        it('3 identical + the next one', () => {
            const tiles = getTilesFromString('3334m')
            const meldVariants = splitToMelds(tiles)
            expect(meldVariantsToString(meldVariants)).toEqual(['333 4', '3 3 3 4'])

            const groupingVariants1 = splitToGroups(meldVariants[0].remainingTiles)
            expect(groupingVariantsToString(groupingVariants1)).toEqual(['4'])

            const groupingVariants2 = splitToGroups(meldVariants[1].remainingTiles)
            expect(groupingVariantsToString(groupingVariants2)).toEqual(['33 34'])
        })
        it('3 identical + the previous one', () => {
            const tiles = getTilesFromString('2333m')
            const meldVariants = splitToMelds(tiles)
            expect(meldVariantsToString(meldVariants)).toEqual(['333 2', '2 3 3 3'])

            const groupingVariants1 = splitToGroups(meldVariants[0].remainingTiles)
            expect(groupingVariantsToString(groupingVariants1)).toEqual(['2'])

            const groupingVariants2 = splitToGroups(meldVariants[1].remainingTiles)
            expect(groupingVariantsToString(groupingVariants2)).toEqual(['23 33'])
        })
        it('3 identical + [tile + 2]', () => {
            const tiles = getTilesFromString('3335m')
            const meldVariants = splitToMelds(tiles)
            expect(meldVariantsToString(meldVariants)).toEqual(['333 5', '3 3 3 5'])

            const groupingVariants1 = splitToGroups(meldVariants[0].remainingTiles)
            expect(groupingVariantsToString(groupingVariants1)).toEqual(['5'])

            const groupingVariants2 = splitToGroups(meldVariants[1].remainingTiles)
            expect(groupingVariantsToString(groupingVariants2)).toEqual(['33 35'])
        })
        it('3 identical + [tile - 2]', () => {
            const tiles = getTilesFromString('3555m')
            const meldVariants = splitToMelds(tiles)
            expect(meldVariantsToString(meldVariants)).toEqual(['555 3', '3 5 5 5'])

            const groupingVariants1 = splitToGroups(meldVariants[0].remainingTiles)
            expect(groupingVariantsToString(groupingVariants1)).toEqual(['3'])

            const groupingVariants2 = splitToGroups(meldVariants[1].remainingTiles)
            expect(groupingVariantsToString(groupingVariants2)).toEqual(['35 55'])
        })
        it('3 identical + the previous one + next sequence', () => {
            const tiles = getTilesFromString('3444567m')
            const meldVariants = splitToMelds(tiles)
            expect(meldVariantsToString(meldVariants)).toEqual([
                '345 4 4 6 7',
                '444 567 3',
                '456 3 4 4 7',
                '567 3 4 4 4',
            ])

            const groupingVariants1 = splitToGroups(meldVariants[0].remainingTiles)
            expect(groupingVariantsToString(groupingVariants1)).toEqual(['44 67', '46 4 7'])

            const groupingVariants2 = splitToGroups(meldVariants[1].remainingTiles)
            expect(groupingVariantsToString(groupingVariants2)).toEqual(['3'])

            const groupingVariants3 = splitToGroups(meldVariants[2].remainingTiles)
            expect(groupingVariantsToString(groupingVariants3)).toEqual(['34 4 7', '44 3 7'])

            const groupingVariants4 = splitToGroups(meldVariants[3].remainingTiles)
            expect(groupingVariantsToString(groupingVariants4)).toEqual(['34 44'])
        })
        it('4 identical + the previous one + the next one + [tile + 3]', () => {
            const tiles = getTilesFromString('3444457m')
            const meldVariants = splitToMelds(tiles)
            expect(meldVariantsToString(meldVariants)).toEqual(['345 444 7', '345 4 4 4 7'])

            const groupingVariants1 = splitToGroups(meldVariants[0].remainingTiles)
            expect(groupingVariantsToString(groupingVariants1)).toEqual(['7'])

            const groupingVariants2 = splitToGroups(meldVariants[1].remainingTiles)
            expect(groupingVariantsToString(groupingVariants2)).toEqual(['44 4 7'])
        })
    })

    describe('splitToGroups', () => {
        it('Complicated structure', () => {
            const tiles = getTilesFromString('11224m')
            const variants = splitToGroups(tiles)
            expect(groupingVariantsToString(variants)).toEqual([
                '11 22 4',
                '11 24 2',
                '12 12 4',
                '12 24 1',
            ])
        })
        it('One suit', () => {
            const tiles = getTilesFromString('1145m')
            const variants = splitToGroups(tiles)
            expect(groupingVariantsToString(variants)).toEqual(['11 45'])
        })
        it('Different suits', () => {
            const tiles = getTilesFromString('11m1289p24s')
            const variants = splitToGroups(tiles)
            expect(groupingVariantsToString(variants, true)).toEqual(['11m 12p 24s 89p'])
        })
        it('Should find only pairs for honors', () => {
            const tiles = getTilesFromString('1123445z')
            const variants = splitToGroups(tiles)
            expect(groupingVariantsToString(variants)).toEqual(['11 44 2 3 5'])
        })
    })
})
