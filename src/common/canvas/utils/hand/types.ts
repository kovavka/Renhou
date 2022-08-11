
/**
 * variant of hand developing
 */
export type SuitStructure = {
    melds: ([number, number, number])[]

    /**
     * undefined when there are more than one pairs -> pairs will be used as waits
     */
    pair: number | undefined

    /**
     * tiles we can not use to complete melds
     */
    separatedTiles: number[]

    meldsToComplete: ([number, number])[]
}

export type ShantenInfo = {
    man: SuitStructure
    pin: SuitStructure
    sou: SuitStructure
    honor: SuitStructure
    amount: number
}