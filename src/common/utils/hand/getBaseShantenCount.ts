export function getBaseShantenCount(
    meldsNumber: number,
    groupsNumber: number,
    separatedTilesNumber: number,
    hasPair: boolean
) {
    const handSize = meldsNumber * 3 + groupsNumber * 2 + separatedTilesNumber

    if (handSize !== 1 && handSize !== 4 && handSize !== 7 && handSize !== 10 && handSize !== 13) {
        throw new Error('wrong hand size')
    }

    // 13 -> 6; 10 -> 6; 7 -> 4; 4 -> 2;
    const maxPossibleShantenCount = Math.min(6, ((handSize - 1) / 3) * 2)

    const maxMeldsCount = Math.floor(handSize / 3)
    let meldsLeft = maxMeldsCount - meldsNumber

    if (meldsLeft === 0 || (meldsLeft === 1 && separatedTilesNumber === 0 && hasPair)) {
        return 0
    }

    if (groupsNumber === meldsLeft) {
        // it doesn't matter if we have a pair:
        //   - if we don't have it, we will use all groups to create melds + 1 left tile for tanki wait
        //   - if we have a pair, we will use other groups to create melds + convert 2 separated tiles to group
        return meldsLeft
    }

    if (groupsNumber > meldsLeft) {
        if (hasPair) {
            // we will use pair and will create all melds except one to get a wait
            return meldsLeft - 1
        }

        // will create all melds and use 1 left tile as a tanki wait
        return meldsLeft
    }

    // each group needs 1 tile to become a meld
    let shatenCount = Math.min(groupsNumber, meldsLeft)
    meldsLeft = Math.max(meldsLeft - groupsNumber, 0)

    // each separated tile needs 2 tiles to become a meld
    while (meldsLeft > 0) {
        shatenCount += 2
        meldsLeft--
    }

    return Math.min(shatenCount, maxPossibleShantenCount)
}
