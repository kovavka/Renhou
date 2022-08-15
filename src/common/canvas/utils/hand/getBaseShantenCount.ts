export function getBaseShantenCount(
    handSize: number,
    meldsCount: number,
    groupsCount: number,
    hasPair: boolean
) {
    // 13 -> 6; 10 -> 6; 7 -> 4; 4 -> 2;
    const maxPossibleShantenCount = Math.min(6, ((handSize - 1) / 3) * 2)

    const maxMeldsCount = Math.floor(handSize / 3)
    let meldsLeft = maxMeldsCount - meldsCount

    if (meldsLeft === 0) {
        return 0
    }

    if (meldsLeft === 1 && groupsCount === 2 && hasPair) {
        return 0
    }

    // each group needs 1 tile to become a meld
    let shatenCount = Math.min(groupsCount, meldsLeft)
    meldsLeft = Math.max(meldsLeft - groupsCount, 0)

    // each separated tile needs 2 tiles to become a meld
    while (meldsLeft > 0) {
        shatenCount += 2
        meldsLeft--
    }

    return Math.min(shatenCount, maxPossibleShantenCount)
}
