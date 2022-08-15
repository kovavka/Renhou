import { ISpriteLoader } from './ISpriteLoader'
import { SuitType } from '../../core/game-types/SuitType'

type TileLoadType = { img: HTMLImageElement; type: SuitType; value: number }

export class SpriteLoaderImpl implements ISpriteLoader {
    private _allLoaded = false

    readonly doOnLoad: Promise<void>

    get allLoaded(): boolean {
        return this._allLoaded
    }

    getTileImage(type: SuitType, value: number): HTMLImageElement {
        return this.tiles[type][value - 1]
    }

    private tiles: {
        man: HTMLImageElement[]
        pin: HTMLImageElement[]
        sou: HTMLImageElement[]
        jihai: HTMLImageElement[]
    } = {
        man: [],
        pin: [],
        sou: [],
        jihai: [],
    }

    constructor() {
        this.doOnLoad = new Promise<void>(resolve => {
            this.initTiles().then(() => {
                resolve()
            })
        })
    }

    private async initTiles() {
        const all: Promise<TileLoadType>[] = []
        for (let i = 1; i < 10; i++) {
            all.push(this.loadTile(SuitType.MANZU, i))
            all.push(this.loadTile(SuitType.PINZU, i))
            all.push(this.loadTile(SuitType.SOUZU, i))

            if (i < 8) {
                all.push(this.loadTile(SuitType.JIHAI, i))
            }
        }

        const data = await Promise.all(all)
        data.forEach(result => {
            const { img, type, value } = result
            switch (type) {
                case SuitType.MANZU:
                    this.tiles.man[value - 1] = img
                    break
                case SuitType.PINZU:
                    this.tiles.pin[value - 1] = img
                    break
                case SuitType.SOUZU:
                    this.tiles.sou[value - 1] = img
                    break
                case SuitType.JIHAI:
                    this.tiles.jihai[value - 1] = img
                    break
            }
        })

        this._allLoaded = true
    }

    private async loadTile(type: SuitType, value: number): Promise<TileLoadType> {
        return new Promise<TileLoadType>(resolve => {
            const img = new Image()
            img.src = require(`../../../img/tiles/${type}${value}.svg`)
            img.onload = () => {
                return resolve({ img, type, value })
            }
        })
    }
}
