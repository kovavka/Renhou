import {getShantenInfos, hasTiles} from "../shantenCalculator";
import {man1, man2, man3, man4} from "./testVariables";

describe('shantenCalculator', () => {
    it('', () => {
        const tiles = [man1, man1, man2, man3, man4]
        const t = getShantenInfos(tiles)
    })
})
