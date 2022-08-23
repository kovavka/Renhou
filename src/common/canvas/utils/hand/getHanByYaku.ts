import { SimpleYaky } from '../../core/game-types/Yaku'

const closedOnly = [
    SimpleYaky.MENZEN_TSUMO,
    SimpleYaky.RIICHI,
    SimpleYaky.IPPATSU,
    SimpleYaky.PINFU,
    SimpleYaky.IIPEIKOU,
    SimpleYaky.DOUBLE_RIICHI,
    SimpleYaky.CHIITOITSU,
    SimpleYaky.RYANPEIKOU,
]

export function getHanByYaku(yaku: SimpleYaky, isOpen: boolean): number {
    if (closedOnly.includes(yaku) && isOpen) {
        throw new Error(`yaku ${SimpleYaky[yaku]} cannot exist in open hand`)
    }
    switch (yaku) {
        case SimpleYaky.MENZEN_TSUMO:
        case SimpleYaky.RIICHI:
        case SimpleYaky.IPPATSU:
        case SimpleYaky.PINFU:
        case SimpleYaky.IIPEIKOU:
            return 1
        case SimpleYaky.HAITEI:
        case SimpleYaky.HOUTEI:
        case SimpleYaky.RINSHAN:
        case SimpleYaky.CHANKAN:
        case SimpleYaky.TANYAO:
        case SimpleYaky.YAKUHAI:
            return 1
        case SimpleYaky.DOUBLE_RIICHI:
        case SimpleYaky.SANSHOKU_DOUKOU:
        case SimpleYaky.TOITOI:
        case SimpleYaky.SHANANKOU:
        case SimpleYaky.SANKANTSU:
        case SimpleYaky.CHIITOITSU:
        case SimpleYaky.HONROUTOU:
        case SimpleYaky.SHOSANGEN:
            return 2
        case SimpleYaky.CHANTA:
        case SimpleYaky.SANSHOKU:
        case SimpleYaky.ITTSU:
            return isOpen ? 1 : 2
        case SimpleYaky.HONITSU:
        case SimpleYaky.JUNCHAN:
            return isOpen ? 2 : 3
        case SimpleYaky.RYANPEIKOU:
            return 3
        case SimpleYaky.CHINITSU:
            return isOpen ? 5 : 6
    }
}
