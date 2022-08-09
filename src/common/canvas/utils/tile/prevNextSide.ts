import {Side} from "../../core/game-types/Side";

export function getNextSide(side: Side): Side {
    let nextSide = side + 1
    if (nextSide > 3) {
        nextSide = 0
    }

    return nextSide
}

export function getPrevSide(side: Side): Side {
    let nextSide = side - 1
    if (nextSide < 0) {
        nextSide = 3
    }

    return nextSide
}