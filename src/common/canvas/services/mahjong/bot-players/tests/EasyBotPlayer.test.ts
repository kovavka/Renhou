import { EasyBotPlayer } from '../EasyBotPlayer'

describe('EasyBotPlayer', () => {
    let botPlayer: EasyBotPlayer

    beforeEach(() => {
        botPlayer = new EasyBotPlayer()
    })

    describe('chooseTile', () => {
        // 9m36799p3567s123z + 4p
        /*
        describe('problem with sets - chiitoi + regular', () => {
            function shouldContain(tiles: Tile[], tile: Tile): void {
                const isContain = hasTiles(tiles, tile)
                expect(isContain).toBe(true)
            }

            // 7m889p237799s123z + 7p
            it('7m889p237799s123z', () => {
                const tiles = getTilesFromString('7m889p237799s123z')
                const shantenInfo = getShantenInfo(tiles)

                shouldContain(shantenInfo[1].nextDrawInfo.improvements, {
                    type: SuitType.PINZU,
                    value: 7,
                })
            })

            // 18m118p278s14667z + 6z
            it('18m118p278s14667z', () => {
                const tiles = getTilesFromString('18m118p278s14667z')
                const shantenInfo = getShantenInfo(tiles)

                shouldContain(shantenInfo[1].nextDrawInfo.improvements, {
                    type: SuitType.PINZU,
                    value: 6,
                })
            })

            // 67m5778p44668s33z + 7m
            it('67m5778p44668s33z', () => {
                const tiles = getTilesFromString('67m5778p44668s33z')
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
            })

            // 13m45778p12s1134z + 6p
            it('13m45778p12s1134z', () => {
                const tiles = getTilesFromString('13m45778p12s1134z')
                const shantenInfo = getShantenInfo(tiles)

                expect(shantenInfo[0].nextDrawInfo.improvements).toEqual([])
            })
        })
         */
    })
})
