import {man1, man2, man3, man4, man9, pin1, pin9, sou1, sou9} from "../../hand/tests/testVariables";
import {groupIdenticalTiles} from "../groupIdenticalTiles";

describe('groupIdenticalTiles', () => {
    it('should group unique items with count = 0', () => {
        const tiles = [man2, man3, man4]
        const result = [
            {
                tile: man2,
                count: 1,
            },
            {
                tile: man3,
                count: 1,
            },
            {
                tile: man4,
                count: 1,
            },
        ]
        expect(groupIdenticalTiles(tiles)).toEqual(result)
    })
    it('should group items with count > 1', () => {
        const tiles = [man1, man1, man9, man9, man9]
        const result = [
            {
                tile: man1,
                count: 2,
            },
            {
                tile: man9,
                count: 3,
            },
        ]
        expect(groupIdenticalTiles(tiles)).toEqual(result)
    })
})