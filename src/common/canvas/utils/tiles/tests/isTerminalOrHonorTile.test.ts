import {isTerminalOrHonorTile} from "../isTerminalOrHonorTile";
import {
    chun,
    haku,
    hatsu,
    man1, man2,
    man9,
    nan,
    pei,
    pin1, pin3,
    pin9,
    shaa,
    sou1, sou8,
    sou9,
    ton
} from "../../hand/tests/testVariables";

describe('isTerminalOrHonorTile', () => {
    it('should determine man 1 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(man1)).toBe(true)
    })
    it('should determine man 9 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(man9)).toBe(true)
    })
    it('should determine pin 1 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(pin1)).toBe(true)
    })
    it('should determine pin 9 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(pin9)).toBe(true)
    })
    it('should determine sou 1 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(sou1)).toBe(true)
    })
    it('should determine sou 9 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(sou9)).toBe(true)
    })
    it('should determine haku as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(haku)).toBe(true)
    })
    it('should determine hatsu as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(hatsu)).toBe(true)
    })
    it('should determine chun as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(chun)).toBe(true)
    })
    it('should determine ton as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(ton)).toBe(true)
    })
    it('should determine nan as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(nan)).toBe(true)
    })
    it('should determine shaa as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(shaa)).toBe(true)
    })
    it('should determine pei as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(pei)).toBe(true)
    })
    it('should NOT determine man2 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(man2)).toBe(false)
    })
    it('should NOT determine pin 3 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(pin3)).toBe(false)
    })
    it('should NOT determine sou 8 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile(sou8)).toBe(false)
    })
})