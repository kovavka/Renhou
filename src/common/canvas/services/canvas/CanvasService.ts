import {ICanvasService} from "./ICanvasService";
import {CanvasServiceImpl} from "./CanvasServiceImpl";

export class CanvasService {
    private static _instance: ICanvasService | undefined

    static get instance(): ICanvasService {
        if (!this._instance) {
            this._instance = new CanvasServiceImpl()
        }

        return this._instance
    }
}