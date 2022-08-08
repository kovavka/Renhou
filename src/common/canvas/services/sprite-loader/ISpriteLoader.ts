import {SuitType} from "../../core/SuitType";

export interface ISpriteLoader {
    readonly allLoaded: boolean
    readonly doOnLoad: Promise<void>
    getTile(type: SuitType, value: number): HTMLImageElement
}