import { getBaseShantenCount } from '../getBaseShantenCount'

describe('getBaseShantenCount', () => {
    describe('13 tiles', () => {
        it('should be 0 shanten when hand has 4 melds and 0 groups', () => {
            expect(getBaseShantenCount(13, 4, 0, false)).toBe(0)
        })
        it('should be 0 shanten when hand has 3 melds and 2 groups including at least 1 pair', () => {
            expect(getBaseShantenCount(13, 3, 2, true)).toBe(0)
        })
        it('should be 0 shanten when hand has 4 melds and 0 groups', () => {
            expect(getBaseShantenCount(13, 4, 0, false)).toBe(0)
        })

        it('should be 1 shanten when hand has 3 melds and 2 sequence groups', () => {
            expect(getBaseShantenCount(13, 3, 2, false)).toBe(1)
        })
        it('should be 2 shanten when hand has 3 melds and 0 groups', () => {
            expect(getBaseShantenCount(13, 3, 0, false)).toBe(2)
        })
        it('should be 4 shanten when hand has 0 melds and 6 groups', () => {
            expect(getBaseShantenCount(13, 0, 6, false)).toBe(4)
        })
        it('should be 5 shanten when hand has 0 melds and 3 groups', () => {
            expect(getBaseShantenCount(13, 0, 3, false)).toBe(5)
        })
        it('should be 6 shanten when hand has 0 melds and 0 groups', () => {
            expect(getBaseShantenCount(13, 0, 0, false)).toBe(6)
        })
    })

    // todo add more
    describe('10 tiles', () => {
        it('should be 3 shanten when hand has 5 groups without pair', () => {
            expect(getBaseShantenCount(10, 0, 5, false)).toBe(3)
        })
        it('should be 2 shanten when hand has 5 groups with 1 pair', () => {
            expect(getBaseShantenCount(10, 0, 5, true)).toBe(3)
        })
    })

    describe('7 tiles', () => {})

    describe('4 tiles', () => {})
})
