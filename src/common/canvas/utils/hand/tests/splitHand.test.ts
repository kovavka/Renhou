import {test2} from "../getShantenInfo";
import {man2, man3, man5, man6, man7} from "./testVariables";

describe('splitHand', () => {
    it('', () => {
        const tiles = [man2, man3, man5, man6, man7]
        const info = test2(tiles)
        expect(info).toEqual([])
    })
})