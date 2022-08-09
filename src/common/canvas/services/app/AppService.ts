import {IAppService} from "./IAppService";
import {AppServiceImpl} from "./AppServiceImpl";

export class AppService {
    private static _instance: IAppService | undefined

    static get instance(): IAppService {
        if (!this._instance) {
            this._instance = new AppServiceImpl()
        }

        return this._instance
    }
}