import {CanvasObject} from "../../core/CanvasObject";
import {Rectangle} from "../../core/Rectangle";
import {Context} from "../../core/Context";
import {colors} from "../../../design-tokens/colors";

export class TableView extends CanvasObject {
    constructor(context: Context, width: number, height: number) {
        super(context, new Rectangle(0, 0, width, height));
    }

    render(): void {
        this.context.fillStyle = colors.tableBackground
        this.context.fillRect(...this.rect)
    }
}