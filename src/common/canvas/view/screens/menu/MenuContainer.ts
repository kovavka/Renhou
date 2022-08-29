import { Context } from '../../../core/Context'
import { CanvasObject } from '../../../core/CanvasObject'
import { MenuButton } from './MenuButton'
import { colors } from '../../../../design-tokens/colors'
import { Rectangle } from '../../../core/Rectangle'
import { AppService } from '../../../../services/app/AppService'

export class MenuContainer {
    static render(context: Context, width: number, height: number): CanvasObject[] {
        context.fillStyle = colors.menuBackground
        context.fillRect(0, 0, width, height)

        const buttonWidth = 100
        const buttonHeight = 48
        const x = width / 2 - buttonWidth / 2
        const y = height / 2 - buttonHeight / 2

        const buttonClick = AppService.instance.startMahjongGame.bind(AppService.instance)
        const menuButton = new MenuButton(
            context,
            new Rectangle(x, y, buttonWidth, buttonHeight),
            buttonClick
        )
        menuButton.render()

        return [menuButton]
    }
}
