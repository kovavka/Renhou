
// todo calc
//  tilesToComplete: number[]


export type WaitVariant = {
    /**
     * undefined when there are more than one pairs -> pairs will be used as waits
     */
    pair: number | undefined
    separatedTiles: number[]
    meldsToComplete: ([number, number])[]
}

/**
 * variant of hand developing
 */
export type SuitStructure = {
    melds: ([number, number, number])[]

    /**
     * tiles we can not use to complete melds
     */
    separatedTiles: number[]

    meldsToComplete: ([number, number])[]
}