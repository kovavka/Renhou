import { Tile } from './Tile'
import { Meld } from './Meld'

export type Hand = {
    tiles: Tile[]
    openMelds: Meld[]
    riichi: boolean
    // selectedTile
}
