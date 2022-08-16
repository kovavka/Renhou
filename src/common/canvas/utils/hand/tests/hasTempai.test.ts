import { hasTempai } from '../hasTempai'
import { SuitType } from '../../../core/game-types/SuitType'
import { getTilesFromString } from './testUtils'

describe('hasTempai', () => {
    describe('Chiitoi', () => {
        it('Tempai when there are 6 pairs and a unique tile', () => {
            const tiles = getTilesFromString('1199m1199p1199s5z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there are 6 pairs and 3 duplicate tiles', () => {
            const tiles = getTilesFromString('1199m1199p111s56z')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when there are 4 pairs, 4 duplicate tiles and a unique tile', () => {
            const tiles = getTilesFromString('1199m1199p11119s')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when there are 5 pairs and 3 unique tiles', () => {
            const tiles = getTilesFromString('1199m1199p11999s')
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('Kokushi muso', () => {
        it('Tempai when there are 12 single terminal and honor tiles + pair for one of them', () => {
            const tiles = getTilesFromString('19m19p19s1234566z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 13 single terminal and honor tiles', () => {
            const tiles = getTilesFromString('19m19p19s1234567z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there is at least 1 man/pin/sou tile from 2 to 8', () => {
            const tiles = getTilesFromString('129m19p19s123456z')
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('Simple hand structure', () => {
        it('Tempai when there are 4 sequential melds and 1 tile', () => {
            const tiles = getTilesFromString('123789m123p123s1z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 4 identical melds and 1 tile', () => {
            const tiles = getTilesFromString('111777m111p2229s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 4 melds of any kind and 1 tile', () => {
            const tiles = getTilesFromString('111789m111p2229s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 3 melds, 1 pair and 1 ryanmen', () => {
            const tiles = getTilesFromString('11123m111p22299s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 3 melds, 1 pair and 1 penchan', () => {
            const tiles = getTilesFromString('11112m111p22299s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 3 melds, 1 pair and 1 kanchan', () => {
            const tiles = getTilesFromString('11113m222p22299s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 3 melds and 2 pairs', () => {
            const tiles = getTilesFromString('11m111222p22299s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there are 3 melds and 2 ryanmens', () => {
            const tiles = getTilesFromString('2378m111222p222s')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when there are 3 melds, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('22m111222p222s12z')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when the only wait requires a 5th tile of such kind', () => {
            // we have 3 x 4 sou and a single 4 sou,
            // so the wait is 4 sou, and we don't have any more 4 sou in a game
            const tiles = getTilesFromString('123789m123p4444s')
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('Complicated hand structure in a one suit', () => {
        it('Tempai when there are 4 melds and 1 tile', () => {
            const tiles = getTilesFromString('1223345675559m') // 123 234 567 555
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 3 melds, pair and any wait', () => {
            const tiles = getTilesFromString('1223345556778m') // 123 234 567 55 78
            // could be also interpreted as not a tepmai: 123 234 555 67 78
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there are 3 melds, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('1111232344779m') // 111 123 234 77 49
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('1 tile', () => {
        it('Always tempai', () => {
            expect(hasTempai([{ type: SuitType.MANZU, value: 1 }])).toBe(true)
        })
    })

    describe('4 tiles', () => {
        it('Tempai when there are 1 meld and 1 tile', () => {
            const tiles = getTilesFromString('123m1z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 2 pairs', () => {
            const tiles = getTilesFromString('1133m')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there are 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('113m1z')
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('7 tiles', () => {
        it('Tempai when there are 2 melds and 1 tile', () => {
            const tiles = getTilesFromString('123m111s1z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 1 meld and 2 pairs', () => {
            const tiles = getTilesFromString('1133m111s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there are 1 meld, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('113m111s1z')
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('10 tiles', () => {
        it('Tempai when there are 3 melds and 1 tile', () => {
            const tiles = getTilesFromString('123m222p111s1z')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Tempai when there are 2 melds and 2 pairs', () => {
            const tiles = getTilesFromString('1133m123p111s')
            expect(hasTempai(tiles)).toBe(true)
        })

        it('Not a templai when there are 2 melds, 1 pair and 2 separated tiles', () => {
            const tiles = getTilesFromString('113m123p111s1z')
            expect(hasTempai(tiles)).toBe(false)
        })
    })

    describe('Impossible hand length', () => {
        it('Not a templai when hand is empty', () => {
            expect(hasTempai([])).toBe(false)
        })

        it('Not a templai when tiles length > 13', () => {
            const tiles = getTilesFromString('11122233344455m')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when tiles length > 1 && < 4', () => {
            const tiles = getTilesFromString('11m')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when tiles length > 4 && < 7', () => {
            const tiles = getTilesFromString('11122m')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when tiles length > 7 && < 10', () => {
            const tiles = getTilesFromString('11122233m')
            expect(hasTempai(tiles)).toBe(false)
        })

        it('Not a templai when tiles length > 10 && < 13', () => {
            const tiles = getTilesFromString('11122233344m')
            expect(hasTempai(tiles)).toBe(false)
        })
    })
})
