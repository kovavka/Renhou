import { SuitType } from '../../game-types/SuitType'

export interface ISpriteLoader {
    readonly allLoaded: boolean
    readonly doOnLoad: Promise<void>
    getTileImage(type: SuitType, value: number): HTMLImageElement
}
