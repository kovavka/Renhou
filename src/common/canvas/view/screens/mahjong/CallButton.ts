import { CanvasObject } from '../../../core/CanvasObject'
import { drawRoundRect } from '../../../drawing-utils/roundRect'
import { colors } from '../../../../design-tokens/colors'
import { Context } from '../../../core/Context'
import { Rectangle } from '../../../core/Rectangle'
import { drawText } from '../../../drawing-utils/text'

// todo add scale
export class CallButton extends CanvasObject {
    private readonly text: string

    constructor(context: Context, text: string, bounds: Rectangle, clickHandler: () => void) {
        super(context, bounds, clickHandler)

        this.text = text
    }

    render() {
        drawRoundRect(this.context, colors.callButton, this.bounds, 8)
        drawText(this.context, this.text, 24, colors.callButtonText, this.bounds)
    }
}
