import { isTerminalOrHonorTile } from '../isTerminalOrHonorTile'
import { SuitType } from '../../../game-types/SuitType'

describe('isTerminalOrHonorTile', () => {
    it('should determine man 1 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.MANZU, value: 1 })).toBe(true)
    })
    it('should determine man 9 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.MANZU, value: 9 })).toBe(true)
    })
    it('should determine pin 1 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.PINZU, value: 1 })).toBe(true)
    })
    it('should determine pin 9 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.PINZU, value: 9 })).toBe(true)
    })
    it('should determine sou 1 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.SOUZU, value: 1 })).toBe(true)
    })
    it('should determine sou 9 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.SOUZU, value: 9 })).toBe(true)
    })
    it('should determine ton as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 1 })).toBe(true)
    })
    it('should determine nan as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 2 })).toBe(true)
    })
    it('should determine shaa as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 3 })).toBe(true)
    })
    it('should determine pei as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 4 })).toBe(true)
    })
    it('should determine chun as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 5 })).toBe(true)
    })
    it('should determine haku as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 6 })).toBe(true)
    })
    it('should determine hatsu as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.JIHAI, value: 7 })).toBe(true)
    })
    it('should NOT determine man2 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.MANZU, value: 2 })).toBe(false)
    })
    it('should NOT determine pin 3 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.MANZU, value: 3 })).toBe(false)
    })
    it('should NOT determine sou 8 as terminal or honor tile', () => {
        expect(isTerminalOrHonorTile({ type: SuitType.MANZU, value: 8 })).toBe(false)
    })
})
