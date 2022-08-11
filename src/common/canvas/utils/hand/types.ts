export enum WaitPatternType {
    TANKI,
    SHANPON,
    RYANMEN,
    KANCHAN, // 1_3
    PENCHAN, // 12_, _89
}

export type WaitPattern = {
    tiles: number[]
    type: WaitPatternType
}

// todo calc
//  tilesToComplete: number[]

export type SuitStructure = {
    melds: number[][]

    /**
     * includes separated tiles we can not use for waits,
     * empty when wait pattern is tanki
     */
    unusedTiles: number[]

    waitPatterns: WaitPattern[]

    /**
     * undefined when more than pairs -> pairs could be used as waits
     *
     */
    pair: number | undefined
}