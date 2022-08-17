import { getBaseShantenCount } from '../getBaseShantenCount'

// todo add tests with more separated tiles

describe('getBaseShantenCount', () => {
    describe('13 tiles', () => {
        describe('Should be 0 shanten', () => {
            it('tanki wait tempai', () => {
                expect(getBaseShantenCount(4, 0, 1, false)).toBe(0)
            })

            it('ryanmen/penchan/kanchan/shanpon tempai', () => {
                expect(getBaseShantenCount(3, 2, 0, true)).toBe(0)
            })
        })

        describe('Should be 1 shanten', () => {
            it('3 melds, 2 sequential groups', () => {
                expect(getBaseShantenCount(3, 2, 0, false)).toBe(1)
            })

            it('2 melds, 3 groups including pair', () => {
                expect(getBaseShantenCount(2, 3, 1, true)).toBe(1)
            })
        })

        describe('Should be 2 shanten', () => {
            it('2 melds, 3 sequential groups', () => {
                expect(getBaseShantenCount(2, 3, 1, false)).toBe(2)
            })

            it('3 melds and 0 groups', () => {
                expect(getBaseShantenCount(3, 0, 4, false)).toBe(2)
            })

            it('2 melds and 2 sequential groups', () => {
                expect(getBaseShantenCount(2, 2, 3, false)).toBe(2)
            })

            it('2 melds and 2 groups including pair', () => {
                expect(getBaseShantenCount(2, 2, 3, true)).toBe(2)
            })

            it('1 meld and 4 groups including pair', () => {
                // 123 56 89 12 55 9 1
                expect(getBaseShantenCount(1, 4, 2, true)).toBe(2)
            })
        })

        describe('Should be 3 shanten', () => {
            it('1 meld and 4 sequential groups', () => {
                expect(getBaseShantenCount(1, 4, 2, false)).toBe(3)
            })

            it('0 melds and 6 groups including pair', () => {
                // 12 56 89 12 45 77 9
                expect(getBaseShantenCount(0, 6, 1, true)).toBe(3)
            })
        })

        describe('Should be 4 shanten', () => {
            it('0 melds and 6 sequential groups', () => {
                expect(getBaseShantenCount(0, 6, 1, false)).toBe(4)
            })
        })

        describe('Should be 5 shanten', () => {
            it('0 melds and 3 sequential groups', () => {
                expect(getBaseShantenCount(0, 3, 7, false)).toBe(5)
            })

            it('0 melds and 3 groups including pair', () => {
                expect(getBaseShantenCount(0, 3, 7, true)).toBe(5)
            })
        })

        describe('Should be 6 shanten', () => {
            it('0 melds and 0 groups', () => {
                expect(getBaseShantenCount(0, 0, 13, false)).toBe(6)
            })
        })
    })

    // todo add more
    describe('10 tiles', () => {
        describe('Should be 0 shanten', () => {})

        describe('Should be 1 shanten', () => {})

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

        describe('Should be 4 shanten', () => {})

        describe('Should be 5 shanten', () => {})

        describe('Should be 6 shanten', () => {})
    })

    describe('7 tiles', () => {
        describe('Should be 0 shanten', () => {})

        describe('Should be 1 shanten', () => {
            it('0 melds and 3 groups including pair', () => {
                expect(getBaseShantenCount(0, 3, 1, true)).toBe(1)
            })
        })

        describe('Should be 2 shanten', () => {
            it('0 melds and 3 sequential groups', () => {
                expect(getBaseShantenCount(0, 3, 1, false)).toBe(2)
            })
        })

        describe('Should be 3 shanten', () => {})

        describe('Should be 4 shanten', () => {})
    })

    describe('4 tiles', () => {
        describe('Should be 0 shanten', () => {})

        describe('Should be 1 shanten', () => {})

        describe('Should be 2 shanten', () => {})
    })
})
