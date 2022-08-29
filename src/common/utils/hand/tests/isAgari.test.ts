import { SuitType } from '../../../game-types/SuitType'
import { getTilesFromString } from '../getTilesFromString'
import { isAgari } from '../isAgari'

describe('isAgari', () => {
    describe('Chiitoi', () => {
        it('Agari when tempai + improvement', () => {
            const tiles = getTilesFromString('1199m1199p1199s5z')
            const tile = { type: SuitType.JIHAI, value: 5 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Not agari when tempai + non-improvement', () => {
            const tiles = getTilesFromString('1199m1199p1199s5z')
            const tile = { type: SuitType.JIHAI, value: 6 }
            expect(isAgari(tiles, tile)).toBe(false)
        })

        it('Not agari when there are 4 pairs, 4 duplicate tiles and a unique tile', () => {
            const tiles = getTilesFromString('1199m1199p11119s')
            const tile = { type: SuitType.SOUZU, value: 9 }
            expect(isAgari(tiles, tile)).toBe(false)
        })

        it('Not agari when there are 5 pairs and 3 duplicate tiles + 4th tile', () => {
            const tiles = getTilesFromString('1199m1199p11999s')
            const tile = { type: SuitType.SOUZU, value: 9 }
            expect(isAgari(tiles, tile)).toBe(false)
        })
    })

    describe('Kokushi muso', () => {
        it('Agari when there are single wait tempai + improvement', () => {
            const tiles = getTilesFromString('19m19p19s1234566z')
            const tile = { type: SuitType.JIHAI, value: 7 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Not agari when there are single wait tempai + non-improvement', () => {
            const tiles = getTilesFromString('19m19p19s1234566z')
            const tile = { type: SuitType.JIHAI, value: 5 }
            expect(isAgari(tiles, tile)).toBe(false)
        })

        it('Agari when there are 13 waits tempai + improvement', () => {
            const tiles = getTilesFromString('19m19p19s1234567z')
            const tile = { type: SuitType.JIHAI, value: 5 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Not agari when there are 13 waits tempai + non-improvement', () => {
            const tiles = getTilesFromString('19m19p19s1234567z')
            const tile = { type: SuitType.MANZU, value: 5 }
            expect(isAgari(tiles, tile)).toBe(false)
        })

        it('Not agari when there is at least 1 man/pin/sou tile from 2 to 8', () => {
            const tiles = getTilesFromString('129m19p19s123456z')
            const tile = { type: SuitType.JIHAI, value: 7 }
            expect(isAgari(tiles, tile)).toBe(false)
        })
    })

    describe('Ryanpeiko', () => {
        it('Agari for tanki wait', () => {
            const tiles = getTilesFromString('112233m11223p55s')
            expect(isAgari(tiles, { type: SuitType.PINZU, value: 3 })).toBe(true)
        })

        it('Agari for ryanmen wait', () => {
            const tiles = getTilesFromString('112233m12233p55s')
            expect(isAgari(tiles, { type: SuitType.PINZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.PINZU, value: 4 })).toBe(true)
        })
    })

    describe('Simple hand structure', () => {
        it('Agari for sequential melds and 1 tile', () => {
            const tiles = getTilesFromString('123789m123p123s1z')
            const tile = { type: SuitType.JIHAI, value: 1 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Agari for 4 identical melds and 1 tile', () => {
            const tiles = getTilesFromString('111777m111p2229s')
            const tile = { type: SuitType.SOUZU, value: 9 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Agari for 4 melds of any kind and 1 tile', () => {
            const tiles = getTilesFromString('111789m111p2229s')
            const tile = { type: SuitType.SOUZU, value: 9 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Not agari for 4 melds of any kind and 1 tile', () => {
            const tiles = getTilesFromString('111789m111p2229s')
            const tile = { type: SuitType.SOUZU, value: 2 }
            expect(isAgari(tiles, tile)).toBe(false)
        })

        it('Agari for 4 sequential melds + 1 tile next to one', () => {
            const tiles = getTilesFromString('123789m123p1234s')
            const tile = { type: SuitType.SOUZU, value: 1 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Not agari for 4 sequential melds + 1 tile next to one', () => {
            const tiles = getTilesFromString('123789m123p1234s')
            const tile = { type: SuitType.SOUZU, value: 2 }
            expect(isAgari(tiles, tile)).toBe(false)
        })

        it('Agari for 3 melds, 1 pair and 1 ryanmen', () => {
            const tiles = getTilesFromString('11123m111p22299s')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 4 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.SOUZU, value: 9 })).toBe(true)
        })

        it('Agari for 3 melds, 1 pair and 1 penchan', () => {
            const tiles = getTilesFromString('11112m111p22299s')
            const tile = { type: SuitType.MANZU, value: 3 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Agari for 3 melds, 1 pair and 1 kanchan', () => {
            const tiles = getTilesFromString('11113m222p22299s')
            const tile = { type: SuitType.MANZU, value: 2 }
            expect(isAgari(tiles, tile)).toBe(true)
        })

        it('Agari for 3 melds and 2 pairs', () => {
            const tiles = getTilesFromString('11m111222p22299s')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.SOUZU, value: 9 })).toBe(true)
        })

        it('Not agari for 3 melds and 2 ryanmens', () => {
            const tiles = getTilesFromString('2378m111222p222s')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(false)
        })

        it('Not agari for there are 3 melds, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('22m111222p222s12z')
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(false)
        })
    })

    describe('Complicated hand structure in a one suit', () => {
        it('Agari for 4 melds and 1 tile', () => {
            const tiles = getTilesFromString('1223345675559m') // 123 234 567 555
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 9 })).toBe(true)
        })

        it('Agari for 3 melds, pair and any wait', () => {
            const tiles = getTilesFromString('1223345556778m') // 123 234 567 55 78
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 6 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 9 })).toBe(true)
            // could be also interpreted as not a tepmai: 123 234 555 67 78
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 5 })).toBe(false)
        })

        it('Not agari for 3 melds, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('1111232344779m') // 111 123 234 77 49
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 4 })).toBe(false)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 9 })).toBe(false)
        })
    })

    describe('1 tile', () => {
        it('Agari for the same tile', () => {
            expect(
                isAgari([{ type: SuitType.MANZU, value: 1 }], { type: SuitType.MANZU, value: 1 })
            ).toBe(true)
        })

        it('Not agari for different tile', () => {
            expect(
                isAgari([{ type: SuitType.MANZU, value: 1 }], { type: SuitType.MANZU, value: 2 })
            ).toBe(false)
        })
    })

    describe('4 tiles', () => {
        it('Agari for sequence of 4 tiles', () => {
            const tiles = getTilesFromString('1234m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 4 })).toBe(true)
        })

        it('Agari for 1 meld and 1 tile', () => {
            const tiles = getTilesFromString('123m1z')
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(true)
        })

        it('Agari for 2 pairs', () => {
            const tiles = getTilesFromString('1133m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 3 })).toBe(true)
        })

        it('Not agari for 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('113m1z')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 3 })).toBe(false)
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(false)
        })
    })

    describe('7 tiles', () => {
        it('Agari for 2 melds and 1 tile', () => {
            const tiles = getTilesFromString('123m111s1z')
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(true)
        })

        it('Agari for 1 meld and 2 pairs', () => {
            const tiles = getTilesFromString('1133m111s')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 3 })).toBe(true)
        })

        it('Not agari for 1 meld, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('113m111s1z')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 3 })).toBe(false)
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(false)
        })
    })

    describe('10 tiles', () => {
        it('Agari for 3 melds and 1 tile', () => {
            const tiles = getTilesFromString('123m222p111s1z')
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(true)
        })

        it('Agari for 2 melds and 2 pairs', () => {
            const tiles = getTilesFromString('1133m123p111s')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(true)
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 3 })).toBe(true)
        })

        it('Not agari for 2 melds, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('113m123p111s1z')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 3 })).toBe(false)
            expect(isAgari(tiles, { type: SuitType.JIHAI, value: 1 })).toBe(false)
        })
    })

    describe('Impossible hand length', () => {
        it('Not a templai when hand is empty', () => {
            expect(isAgari([], { type: SuitType.MANZU, value: 1 })).toBe(false)
        })

        it('Not a templai when tiles length > 13', () => {
            const tiles = getTilesFromString('11122233344455m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(false)
        })

        it('Not a templai when tiles length > 1 && < 4', () => {
            const tiles = getTilesFromString('11m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(false)
        })

        it('Not a templai when tiles length > 4 && < 7', () => {
            const tiles = getTilesFromString('11122m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(false)
        })

        it('Not a templai when tiles length > 7 && < 10', () => {
            const tiles = getTilesFromString('11122233m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(false)
        })

        it('Not a templai when tiles length > 10 && < 13', () => {
            const tiles = getTilesFromString('11122233344m')
            expect(isAgari(tiles, { type: SuitType.MANZU, value: 1 })).toBe(false)
        })
    })
})
