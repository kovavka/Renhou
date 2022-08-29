import { getBaseShantenCount } from '../getBaseShantenCount'

// todo add tests with more separated tiles

describe('getBaseShantenCount', () => {
    describe('13 tiles', () => {
        describe('Should be 0 shanten', () => {
            it('tanki wait tempai', () => {
                // 123 456 789 555 9
                expect(getBaseShantenCount(4, 0, 1, false)).toBe(0)
            })

            it('ryanmen/penchan/kanchan/shanpon tempai', () => {
                // 123 456 789 12 55
                expect(getBaseShantenCount(3, 2, 0, true)).toBe(0)
            })
        })

        describe('Should be 1 shanten', () => {
            it('3 melds, 2 sequential groups', () => {
                // 123 456 789 12 45
                expect(getBaseShantenCount(3, 2, 0, false)).toBe(1)
            })

            it('3 melds and 1 sequential group', () => {
                // 123 456 789 12 6 9
                expect(getBaseShantenCount(3, 1, 2, false)).toBe(1)
            })

            it('3 melds and 1 pair', () => {
                // 123 456 789 11 6 9
                expect(getBaseShantenCount(3, 1, 2, true)).toBe(1)
            })

            it('2 melds, 3 groups including pair', () => {
                // 123 456 89 12 55
                expect(getBaseShantenCount(2, 3, 1, true)).toBe(1)
            })
        })

        describe('Should be 2 shanten', () => {
            it('2 melds, 3 sequential groups', () => {
                // 123 456 89 12 45
                expect(getBaseShantenCount(2, 3, 1, false)).toBe(2)
            })

            it('3 melds and 0 groups', () => {
                // 123 456 789 1 4 7 1
                expect(getBaseShantenCount(3, 0, 4, false)).toBe(2)
            })

            it('2 melds and 2 sequential groups', () => {
                // 123 456 89 12 5 9 1
                expect(getBaseShantenCount(2, 2, 3, false)).toBe(2)
            })

            it('2 melds and 2 groups including pair', () => {
                // 123 456 89 11 5 9 1
                expect(getBaseShantenCount(2, 2, 3, true)).toBe(2)
            })

            it('1 meld and 5 groups including pair', () => {
                // 123 56 89 12 45 99
                expect(getBaseShantenCount(1, 5, 0, true)).toBe(2)
            })

            it('1 meld and 4 groups including pair', () => {
                // 123 56 89 12 55 9 1
                expect(getBaseShantenCount(1, 4, 2, true)).toBe(2)
            })
        })

        describe('Should be 3 shanten', () => {
            it('2 melds and 1 sequential group', () => {
                // 123 456 89 1 5 9 1 4
                expect(getBaseShantenCount(2, 1, 5, false)).toBe(3)
            })

            it('2 melds and 1 pair', () => {
                // 123 456 88 1 5 9 1 4
                expect(getBaseShantenCount(2, 1, 5, true)).toBe(3)
            })

            it('1 meld and 5 sequential groups', () => {
                // 123 56 89 12 45 79
                expect(getBaseShantenCount(1, 5, 0, false)).toBe(3)
            })

            it('1 meld and 4 sequential groups', () => {
                // 123 56 89 12 45 9 1
                expect(getBaseShantenCount(1, 4, 2, false)).toBe(3)
            })

            it('1 meld and 3 sequential groups', () => {
                // 123 56 89 12 5 9 1 4
                expect(getBaseShantenCount(1, 3, 4, false)).toBe(3)
            })

            it('1 meld and 3 groups including pair', () => {
                // 123 56 89 11 5 9 1 4
                expect(getBaseShantenCount(1, 3, 4, true)).toBe(3)
            })

            it('0 melds and 6 groups including pair', () => {
                // 12 56 89 12 45 77 9
                expect(getBaseShantenCount(0, 6, 1, true)).toBe(3)
            })
        })

        describe('Should be 4 shanten', () => {
            it('1 meld and 2 sequential groups', () => {
                // 123 56 89 1 5 9 1 4 7
                expect(getBaseShantenCount(1, 2, 6, false)).toBe(4)
            })

            it('1 meld and 2 groups including pair', () => {
                // 123 56 88 1 5 9 1 4 7
                expect(getBaseShantenCount(1, 2, 6, true)).toBe(4)
            })

            it('0 melds and 6 sequential groups', () => {
                expect(getBaseShantenCount(0, 6, 1, false)).toBe(4)
            })
        })

        describe('Should be 5 shanten', () => {
            it('1 meld and 1 sequential group', () => {
                // 123 56 9 m| 1 5 9 |p 1 5 9 s| 1z
                expect(getBaseShantenCount(1, 1, 8, false)).toBe(5)
            })

            it('1 meld and 1 pair', () => {
                // 123 55 9 m| 1 5 9 |p 1 5 9 s| 1z
                expect(getBaseShantenCount(1, 1, 8, true)).toBe(5)
            })

            it('0 melds and 3 sequential groups', () => {
                // 12 45 89 m| 1 5 9 |p 1 5 9 s| 1z
                expect(getBaseShantenCount(0, 3, 7, false)).toBe(5)
            })

            it('0 melds and 3 groups including pair', () => {
                // 12 55 89 m| 1 5 9 |p 1 5 9 s| 1z
                expect(getBaseShantenCount(0, 3, 7, true)).toBe(5)
            })
        })

        describe('Should be 6 shanten', () => {
            it('0 melds and 2 sequential groups', () => {
                // 12 45 9 m| 1 5 9 |p 1 5 9 s| 1 2 z
                expect(getBaseShantenCount(0, 0, 13, false)).toBe(6)
            })

            it('0 melds and 2 groups including pair', () => {
                // 12 55 9 m| 1 5 9 |p 1 5 9 s| 1 2 z
                expect(getBaseShantenCount(0, 0, 13, true)).toBe(6)
            })

            it('0 melds and 0 groups', () => {
                // 159m159p159p1234z
                expect(getBaseShantenCount(0, 0, 13, false)).toBe(6)
            })
        })
    })

    describe('10 tiles', () => {
        describe('Should be 0 shanten', () => {
            it('tanki wait tempai', () => {
                // 456 789 555 9
                expect(getBaseShantenCount(3, 0, 1, false)).toBe(0)
            })

            it('ryanmen/penchan/kanchan/shanpon tempai', () => {
                // 456 789 12 55
                expect(getBaseShantenCount(2, 2, 0, true)).toBe(0)
            })
        })

        describe('Should be 1 shanten', () => {
            it('3 melds, 2 sequential groups', () => {
                // 456 789 12 45
                expect(getBaseShantenCount(2, 2, 0, false)).toBe(1)
            })
        })

        describe('Should be 2 shanten', () => {
            it('0 melds and 5 groups including pair', () => {
                // 12 56 89 12 55
                expect(getBaseShantenCount(0, 5, 0, true)).toBe(2)
            })
        })

        describe('Should be 3 shanten', () => {
            it('0 melds and 5 sequential groups', () => {
                // 12 56 89 12 45
                expect(getBaseShantenCount(0, 5, 0, false)).toBe(3)
            })
        })

        describe('Should be 4 shanten', () => {
            it('0 melds and 2 sequential groups', () => {
                // 56 89 1 5 9 1 4 7
                expect(getBaseShantenCount(0, 2, 6, false)).toBe(4)
            })
        })

        describe('Should be 5 shanten', () => {
            it('0 melds and 1 sequential group', () => {
                // 56 9 m| 1 5 9 |p 1 5 9 s| 1z
                expect(getBaseShantenCount(0, 1, 8, false)).toBe(5)
            })

            it('0 melds and 1 pair', () => {
                // 55 9 m| 1 5 9 |p 1 5 9 s| 1z
                expect(getBaseShantenCount(0, 1, 8, true)).toBe(5)
            })
        })

        describe('Should be 6 shanten', () => {
            it('0 melds and 0 groups', () => {
                // 159m159p159p1234z
                expect(getBaseShantenCount(0, 0, 13, false)).toBe(6)
            })
        })
    })

    describe('7 tiles', () => {
        describe('Should be 0 shanten', () => {
            it('tanki wait tempai', () => {
                // 789 555 9
                expect(getBaseShantenCount(2, 0, 1, false)).toBe(0)
            })

            it('ryanmen/penchan/kanchan/shanpon tempai', () => {
                // 789 12 55
                expect(getBaseShantenCount(1, 2, 0, true)).toBe(0)
            })
        })

        describe('Should be 1 shanten', () => {
            it('0 melds and 3 groups including pair', () => {
                // 12 55 89 1
                expect(getBaseShantenCount(0, 3, 1, true)).toBe(1)
            })
        })

        describe('Should be 2 shanten', () => {
            it('0 melds and 3 sequential groups', () => {
                // 12 56 89 1
                expect(getBaseShantenCount(0, 3, 1, false)).toBe(2)
            })

            it('0 melds and 2 sequential groups', () => {
                // 12 56 9 1 5
                expect(getBaseShantenCount(0, 2, 3, false)).toBe(2)
            })

            it('0 melds and 2 groups including pair', () => {
                // 12 55 9 1 5
                expect(getBaseShantenCount(0, 2, 3, true)).toBe(2)
            })
        })

        describe('Should be 3 shanten', () => {
            it('0 melds and 1 sequential group', () => {
                // 12 5 9 1 5 9
                expect(getBaseShantenCount(0, 1, 5, false)).toBe(3)
            })

            it('0 melds and 1 pair', () => {
                // 11 5 9 1 5 9
                expect(getBaseShantenCount(0, 1, 5, true)).toBe(3)
            })
        })

        describe('Should be 4 shanten', () => {
            it('0 melds and 0 groups', () => {
                // 1 5 9 1 5 9 1
                expect(getBaseShantenCount(0, 0, 7, false)).toBe(4)
            })
        })
    })

    describe('4 tiles', () => {
        describe('Should be 0 shanten', () => {
            it('tanki wait tempai', () => {
                // 789 5
                expect(getBaseShantenCount(1, 0, 1, false)).toBe(0)
            })

            it('ryanmen/penchan/kanchan/shanpon tempai', () => {
                // 12 55
                expect(getBaseShantenCount(0, 2, 0, true)).toBe(0)
            })
        })

        describe('Should be 1 shanten', () => {
            it('0 melds and 2 sequential group', () => {
                // 12 56
                expect(getBaseShantenCount(0, 2, 0, false)).toBe(1)
            })

            it('0 melds and 1 sequential group', () => {
                // 12 5 9
                expect(getBaseShantenCount(0, 1, 2, false)).toBe(1)
            })

            it('0 melds and 1 pair', () => {
                // 12 5 9
                expect(getBaseShantenCount(0, 1, 2, true)).toBe(1)
            })
        })

        describe('Should be 2 shanten', () => {
            it('0 melds and 0 groups', () => {
                // 1 5 9 1
                expect(getBaseShantenCount(0, 0, 4, false)).toBe(2)
            })
        })
    })
})
