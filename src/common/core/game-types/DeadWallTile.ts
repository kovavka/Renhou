import { Tile } from './Tile'

export type DeadWallTile = Tile & {
    isHidden: boolean
}
