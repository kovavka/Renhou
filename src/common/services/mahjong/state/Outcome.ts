import { OutcomeType } from './OutcomeType'
import { Side } from '../../../game-types/Side'

export type DrawOutcome = {
    type: OutcomeType.DRAW
    winners: Side[]
}

export type NagashiOutcome = {
    type: OutcomeType.NAGASHI
    winners: Side[]
}

export type TsumoOutcome = {
    type: OutcomeType.TSUMO
    winner: Side
}

export type RonOutcome = {
    type: OutcomeType.RON
    winners: Side[]
    loser: Side
}

export type AbortiveDrawOutcome = {
    type: OutcomeType.ABORTIVE_DRAW
}

export type Outcome = DrawOutcome | AbortiveDrawOutcome | TsumoOutcome | RonOutcome
