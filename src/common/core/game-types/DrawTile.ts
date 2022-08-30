import { Tile } from './Tile'

export type DrawTile = Tile & {
    fromDeadWall: boolean
}
