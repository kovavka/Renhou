import {IAppService, ScreenType} from "./IAppService";
import signals from "signals";
import {MahjongService} from "../mahjong/MahjongService";

export class AppServiceImpl implements IAppService {
    private _currentScreen: ScreenType = ScreenType.MENU

    screenChanged: signals.Signal<ScreenType> = new signals.Signal()

    get currentScreen(): ScreenType {
        return this._currentScreen
    }

    startMahjongGame(): void {
        this._currentScreen = ScreenType.MAJHONG
        this.screenChanged.dispatch(this._currentScreen)
        MahjongService.instance.start()
    }
}