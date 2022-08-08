import {IGameService} from "./IGameService";
import {GameServiceImpl} from "./GameServiceImpl";

export class GameService {
    private static _instance: IGameService | undefined

    static get instance(): IGameService {
        if (!this._instance) {
            this._instance = new GameServiceImpl()
        }

        return this._instance
    }
}