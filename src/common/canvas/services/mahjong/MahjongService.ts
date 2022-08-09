import {IMahjongService} from "./IMahjongService";
import {MahjongServiceImpl} from "./MahjongServiceImpl";

export class MahjongService {
    private static _instance: IMahjongService | undefined

    static get instance(): IMahjongService {
        if (!this._instance) {
            this._instance = new MahjongServiceImpl()
        }

        return this._instance
    }
}