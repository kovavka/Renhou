import {Tile} from "../../core/game-types/Tile";
import {getShantenInfo} from "./getShantenInfo";

export function hasTempai(tiles: Tile[]): boolean {
    if (tiles.length !== 1 && tiles.length !== 4 && tiles.length !== 7 && tiles.length !== 10 && tiles.length !== 13) {
        return false
    }

    const shantenInfo = getShantenInfo(tiles)
    return shantenInfo.some(x => x.value === 0)
}