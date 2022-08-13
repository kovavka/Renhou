import {test2} from "../getShantenInfo";
import {
    haku, hatsu,
    man2,
    man3,
    man5,
    man6,
    man7,
    man9,
    pin3,
    pin6,
    pin7,
    pin9,
    sou3,
    sou5,
    sou6,
    sou7, ton
} from "./testVariables";

describe('splitHand', () => {
    it('', () => {
        const tiles = [man2, man3, man5, man6, man7]
        const info = test2(tiles)
        expect(info).toEqual([])
    })
    it('', () => {
        const tiles = [sou3, sou5, sou6, sou7]
        const info = test2(tiles)
        expect(info).toEqual([])
    })
})