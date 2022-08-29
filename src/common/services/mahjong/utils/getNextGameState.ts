import { GameState } from '../state/GameState'
import { Side } from '../../../game-types/Side'
import { getEmptyState } from './getEmptyState'
import { getNextWind } from './getNextWind'
import { OutcomeType } from '../state/OutcomeType'

export function getNextGameState(oldState: GameState): GameState {
    const dealerSide = Math.floor(Math.random() * 4) as Side
    const emptyState = getEmptyState(dealerSide)

    let wind = oldState.wind
    let round = oldState.round + 1
    if (round > 4) {
        round = 1
        wind = getNextWind(wind)
    }

    let renchan = 0
    if (
        oldState.outcome !== undefined &&
        (oldState.outcome.type === OutcomeType.ABORTIVE_DRAW ||
            oldState.outcome.type === OutcomeType.DRAW)
    ) {
        renchan = oldState.renchan + 1
    }

    // todo calc scores

    return {
        ...emptyState,
        wind,
        round,
        renchan,
        riichi: [],
    }
}
