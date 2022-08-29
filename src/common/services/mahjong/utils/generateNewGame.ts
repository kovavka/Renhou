import { Side } from '../../../game-types/Side'
import { GameState } from '../state/GameState'
import { Wind } from '../state/Wind'
import { getEmptyState } from './getEmptyState'

export function generateNewGame(): GameState {
    const dealerSide = Math.floor(Math.random() * 4) as Side
    const emptyState = getEmptyState(dealerSide)

    return {
        ...emptyState,
        wind: Wind.EAST,
        round: 1,
        renchan: 0,
        riichi: [],
    }
}
