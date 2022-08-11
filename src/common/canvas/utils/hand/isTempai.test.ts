import {isTempai} from "./isTempai";
import {Tile} from "../../core/game-types/Tile";
import {SuitType} from "../../core/game-types/SuitType";

const man1 =  {type: SuitType.MANZU, value: 1}
const man2 =  {type: SuitType.MANZU, value: 2}
const man3 =  {type: SuitType.MANZU, value: 3}
const man4 =  {type: SuitType.MANZU, value: 4}
const man5 =  {type: SuitType.MANZU, value: 5}
const man6 =  {type: SuitType.MANZU, value: 6}
const man7 =  {type: SuitType.MANZU, value: 7}
const man8 =  {type: SuitType.MANZU, value: 8}
const man9 =  {type: SuitType.MANZU, value: 9}
const pin1 =  {type: SuitType.PINZU, value: 1}
const pin2 =  {type: SuitType.PINZU, value: 2}
const pin3 =  {type: SuitType.PINZU, value: 3}
const pin9 =  {type: SuitType.PINZU, value: 9}
const sou1 =  {type: SuitType.SOUZU, value: 1}
const sou2 =  {type: SuitType.SOUZU, value: 2}
const sou3 =  {type: SuitType.SOUZU, value: 3}
const sou9 =  {type: SuitType.SOUZU, value: 9}
const haku =  {type: SuitType.JIHAI, value: 1}
const hatsu =  {type: SuitType.JIHAI, value: 2}
const chun =  {type: SuitType.JIHAI, value: 3}
const ton =  {type: SuitType.JIHAI, value: 4}
const nan =  {type: SuitType.JIHAI, value: 5}
const shaa =  {type: SuitType.JIHAI, value: 6}
const pei =  {type: SuitType.JIHAI, value: 7}

describe('isTempai', () => {
    describe('Chiitoi', () => {
        it('Tempai when there are 6 pairs and a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, haku]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 6 pairs and a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, haku]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there are 6 pairs and 1 not a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou9, sou9, sou9]
            expect(isTempai(tiles)).toBe(false)
        })
        it('Not a templai when there are 4 pairs, 4 duplicate tiles and a unique tile', () => {
            const tiles = [man1, man1, man9, man9, pin1, pin1, pin9, pin9, sou1, sou1, sou1, sou1, sou9]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('Kokushi muso', () => {
        it('Tempai when there are 12 single terminal and honor tiles + pair for one of them', () => {
            const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, shaa]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 13 single terminal and honor tiles', () => {
            const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, pei]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there is at least 1 man/oin/sou tile from 2 to 8', () => {
            const tiles = [man1, man9, pin1, pin9, sou1, sou9, haku, hatsu, chun, ton, nan, shaa, man2]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('Simple hand structure', () => {
        it('Tempai when there are 4 sequential melds and 1 tile', () => {
            const tiles = [man1, man2, man3, man7, man8, man9, pin1, pin2, pin3, sou1, sou2, sou3, hatsu]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 4 identical melds and 1 tile', () => {
            const tiles = [man1, man1, man1, man7, man7, man7, pin1, pin1, pin1, sou2, sou2, sou2, sou9]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 4 melds and 1 tile', () => {
            const tiles = [man1, man1, man1, man7, man8, man9, pin1, pin1, pin1, sou2, sou2, sou2, sou9]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 3 melds, 1 pair and 1 ryanmen', () => {
            const tiles = [man1, man1, man1, pin1, pin1, pin1, sou2, sou2, sou2, sou9, sou9, man2, man3]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 3 melds, 1 pair and 1 penchan', () => {
            const tiles = [pin1, pin1, pin1, pin2, pin2, pin2, sou2, sou2, sou2, sou9, sou9, man1, man2]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 3 melds, 1 pair and 1 kanchan', () => {
            const tiles = [pin1, pin1, pin1, pin2, pin2, pin2, sou2, sou2, sou2, sou9, sou9, man1, man3]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 3 melds and 2 pairs', () => {
            const tiles = [pin1, pin1, pin1, pin2, pin2, pin2, sou2, sou2, sou2, sou9, sou9, man1, man1]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there are 3 melds and 2 ryanmens', () => {
            const tiles = [pin1, pin1, pin1, pin2, pin2, pin2, sou2, sou2, sou2, man2, man3, man7, man8]
            expect(isTempai(tiles)).toBe(false)
        })
        it('Not a templai when there are 3 melds, 1 pair and 2 separated tiles', () => {
            const tiles = [pin1, pin1, pin1, pin2, pin2, pin2, sou2, sou2, sou2, man2, man2, haku, hatsu]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('Complicated hand structure in a one suit', () => {
        it('Tempai when there are 4 melds and 1 tile', () => {
            const meld1 = [man1, man2, man3]
            const meld2 = [man2, man3, man4]
            const meld3 = [man5, man6, man7]
            const meld4 = [man5, man5, man5]
            const tiles = [...meld1, ...meld2, ...meld3, ...meld4, man9]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 3 melds, pair and any wait', () => {
            const meld1 = [man1, man2, man3]
            const meld2 = [man2, man3, man4]
            const meld3 = [man5, man6, man7]
            const pair = [man5, man5]
            const wait = [man7, man8]
            // could be also interpreted as not a tepmai: 123 234 555 67 78
            const tiles = [...meld1, ...meld2, ...meld3, ...pair, ...wait]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there are 3 melds, 1 pair and 2 separated tiles', () => {
            const meld1 = [man1, man1, man1]
            const meld2 = [man1, man2, man3]
            const meld3 = [man2, man3, man4]
            const pair = [man7, man7]
            const separatedTiles = [man4, man9]
            const tiles = [...meld1, ...meld2, ...meld3, ...pair, ...separatedTiles]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('1 tile', () => {
        it('Always tempai', () => {
            expect(isTempai([man1])).toBe(false)
        })
    })

    describe('4 tiles', () => {
        it('Tempai when there are 1 meld and 1 tile', () => {
            const tiles = [man1, man2, man3, hatsu]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 2 pairs', () => {
            const tiles = [man1, man1, man3, man3]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there are 1 pair and 2 separated tiles', () => {
            const tiles = [man1, man1, man3, hatsu]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('7 tiles', () => {
        it('Tempai when there are 2 melds and 1 tile', () => {
            const tiles = [man1, man2, man3, sou1, sou1, sou1, hatsu]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 1 meld and 2 pairs', () => {
            const tiles = [sou1, sou1, sou1, man1, man1, man3, man3]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there are 1 meld, 1 pair and 2 separated tiles', () => {
            const tiles = [sou1, sou1, sou1, man1, man1, man3, hatsu]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('9 tiles', () => {
        it('Tempai when there are 3 melds and 1 tile', () => {
            const tiles = [man1, man2, man3, sou1, sou1, sou1, pin2, pin2, pin2, hatsu]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Tempai when there are 2 melds and 2 pairs', () => {
            const tiles = [sou1, sou1, sou1, pin1, pin2, pin3, man1, man1, man3, man3]
            expect(isTempai(tiles)).toBe(true)
        })
        it('Not a templai when there are 2 melds, 1 pair and 2 separated tiles', () => {
            const tiles = [sou1, sou1, sou1, pin1, pin2, pin3, man1, man1, man3, hatsu]
            expect(isTempai(tiles)).toBe(false)
        })
    })

    describe('Impossible hand length', () => {
        it('Not a templai when hand is empty', () => {
            expect(isTempai([])).toBe(false)
        })
        it('Not a templai when tiles length > 13', () => {
            const tiles: Tile[] = []
            for (let i = 0; i < 15; i++) {
                tiles.push({type: SuitType.MANZU, value: 1})
            }
            expect(isTempai(tiles)).toBe(false)
        })
        it('Not a templai when tiles length > 1 && < 4', () => {
            const tiles: Tile[] = []
            for (let i = 1; i < 4; i++) {
                tiles.push({type: SuitType.MANZU, value: 1})
            }
            expect(isTempai(tiles)).toBe(false)
        })
        it('Not a templai when tiles length > 1 && < 7', () => {
            const tiles: Tile[] = []
            for (let i = 1; i < 7; i++) {
                tiles.push({type: SuitType.MANZU, value: 1})
            }
            expect(isTempai(tiles)).toBe(false)
        })
        it('Not a templai when tiles length > 4 && < 10', () => {
            const tiles: Tile[] = []
            for (let i = 1; i < 10; i++) {
                tiles.push({type: SuitType.MANZU, value: 1})
            }
            expect(isTempai(tiles)).toBe(false)
        })
        it('Not a templai when tiles length > 10 && < 13', () => {
            const tiles: Tile[] = []
            for (let i = 1; i < 13; i++) {
                tiles.push({type: SuitType.MANZU, value: 1})
            }
            expect(isTempai(tiles)).toBe(false)
        })
    })

})