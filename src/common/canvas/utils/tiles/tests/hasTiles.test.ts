import {man1, man2, man3, man4, sou1, sou9} from "../../hand/tests/testVariables";
import {hasTiles} from "../tileContains";

describe('hasTiles', () => {
    it('should find a tile in a list if exists', () => {
        const all = [man2, man3, man4]
        expect(hasTiles(all, man3)).toBe(true)
    })
    it('should find 2 tiles in a list if exist', () => {
        const all = [man2, man3, man4]
        expect(hasTiles(all, man2, man3)).toBe(true)
    })
    it('should find 2 different suit tiles in a list', () => {
        const all = [man2, man3, sou9]
        expect(hasTiles(all, man2, sou9)).toBe(true)
    })
    it('should not find a tile if does not exist', () => {
        const all = [man2, man3, man4]
        expect(hasTiles(all, sou9)).toBe(false)
    })
    it('should not find a tile when it has different suit type from tiles in a list', () => {
        const all = [man1, man3, man4]
        expect(hasTiles(all, sou1)).toBe(false)
    })
})