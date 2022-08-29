import { CanvasObject } from '../../../core/CanvasObject'
import { drawRoundRect } from '../../../drawing-utils/roundRect'
import { colors } from '../../../../design-tokens/colors'

export class MenuButton extends CanvasObject {
    render() {
        drawRoundRect(this.context, colors.menuButton, this.bounds, 4)
    }
}
