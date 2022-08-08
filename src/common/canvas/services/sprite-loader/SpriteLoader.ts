import {ISpriteLoader} from "./ISpriteLoader";
import {SpriteLoaderImpl} from "./SpriteLoaderImpl";

export class SpriteLoader {
    private static _instance: ISpriteLoader | undefined

    static get instance(): ISpriteLoader {
        if (!this._instance) {
            this._instance = new SpriteLoaderImpl()
        }

        return this._instance
    }
}