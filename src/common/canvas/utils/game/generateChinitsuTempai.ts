// todo refactor (really old code)

enum WaitPatternType {
    TANKI,
    SHANPON,
    KANCHAN,
    RYANMEN_PENCHAN,
}

export function generateChinitsuTempai(handLength: number): {
    hand: number[]
    possibleTilesToWait: number[]
} {
    let tileLeftByValue: number[] = []
    for (let i = 1; i <= 9; i++) {
        tileLeftByValue[i] = 4
    }

    let forms = getForms()

    let hand: number[] = []
    while (hand.length < handLength) {
        let remaining = handLength - hand.length
        if (remaining > 4 || remaining === 3) {
            let rand = Math.floor(Math.random() * forms.length)
            let formTiles = forms[rand]
            formTiles.forEach(tile => {
                tileLeftByValue[tile]--
                hand.push(tile)
            })

            forms = updateForms(forms, tileLeftByValue)
        } else {
            if (remaining === 1 || Math.floor(Math.random() * 4) === WaitPatternType.TANKI) {
                let tile = getRandomTile(tileLeftByValue)
                tileLeftByValue[tile]--
                hand.push(tile)
                forms = updateForms(forms, tileLeftByValue)
            } else {
                let pair = getRandomTile(tileLeftByValue.map(x => (x > 1 ? x : 0)))
                tileLeftByValue[pair] -= 2
                hand.push(pair)
                hand.push(pair)

                let waits = getWaitPatterns()
                waits = updateForms(waits, tileLeftByValue)

                let rand = Math.floor(Math.random() * waits.length)
                let waitTiles = waits[rand]
                waitTiles.forEach(tile => {
                    tileLeftByValue[tile]--
                    hand.push(tile)
                })
            }
        }
    }

    return {
        hand: hand.sort(),
        possibleTilesToWait: getPossibleTilesToWait(tileLeftByValue),
    }
}

function getForms(): number[][] {
    let formsStr = [
        '123',
        '234',
        '345',
        '456',
        '567',
        '678',
        '789',
        '111',
        '222',
        '333',
        '444',
        '555',
        '666',
        '777',
        '888',
        '999',
    ]

    let forms: number[][] = []
    formsStr.forEach(formStr => {
        let form = formStr.split('').map(x => Number(x))
        forms.push(form)
    })

    return forms
}

function getWaitPatterns(): number[][] {
    let formsStr = [
        '11',
        '12',
        '13',
        '22',
        '23',
        '24',
        '33',
        '34',
        '35',
        '44',
        '45',
        '46',
        '55',
        '56',
        '57',
        '66',
        '67',
        '68',
        '77',
        '78',
        '79',
        '88',
        '89',
        '99',
    ]

    let forms: number[][] = []
    formsStr.forEach(formStr => {
        let form = formStr.split('').map(x => Number(x))
        forms.push(form)
    })

    return forms
}

function updateForms(forms: number[][], tileCounts: number[]): number[][] {
    let updatedForms: number[][] = []

    forms.forEach(form => {
        if (form[0] === form[1]) {
            let tile = form[0]
            if (tileCounts[tile] >= form.length) {
                updatedForms.push(form)
            }
        } else {
            let tile1 = form[0]
            let tile2 = form[1]
            let tile3 = form[2]

            if (tileCounts[tile1] !== 0 && tileCounts[tile2] !== 0 && tileCounts[tile3] !== 0) {
                updatedForms.push(form)
            }
        }
    })

    return updatedForms
}

function getRandomTile(tileCounts: number[]): number {
    let count = tileCounts.reduce((a, b) => a + b)
    let rand = 1 + Math.random() * (count - 1)

    for (let tile in tileCounts) {
        let tileCount = tileCounts[tile]
        if (rand > tileCount) {
            rand -= tileCount
        } else {
            if (Number(tile) === 0) {
                console.log(6776667676767)
            }
            return Number(tile)
        }
    }

    throw new Error('something went wrong')
}

function getPossibleTilesToWait(tileCounts: number[]): number[] {
    let tiles: number[] = []

    tileCounts.forEach((tileCount, tile) => {
        if (tileCount !== 0) {
            tiles.push(tile)
        }
    })

    return tiles
}
