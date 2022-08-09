import signals from "signals";

export enum ScreenType {
    MENU,
    MAJHONG,
}

export interface IAppService {
    readonly currentScreen: ScreenType
    screenChanged: signals.Signal<ScreenType>

    startMahjongGame(): void
}