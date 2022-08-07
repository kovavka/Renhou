import {CanvasObject} from "../../core/CanvasObject";
import {colors} from "../../../design-tokens/colors";
import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {makeRoundRect} from "../../utils/drawing/roundRect";
import man1 from "../../../img/tiles/man1.svg";
import {ICanvasObjectView} from "../../core/ICanvasObjectView";
import {TileStraightView} from "./TileStraightView";
import {Direction, Orientation} from "./Orientation";
import {TileSideView} from "./TileSideView";

const WIDTH = 300

const HEIGHT_FRONT = 420
const HEIGHT_SHADOW = 17
const HEIGHT_BACK = 7


const HEIGHT = HEIGHT_FRONT + HEIGHT_SHADOW + HEIGHT_BACK


export class Tile extends CanvasObject {
    isHidden: boolean = true
    isFallen: boolean = false
    direction: Orientation = Orientation.LEFT

    private view: ICanvasObjectView

    constructor(context: Context, x: number, y: number) {
        super(context, new Rectangle(x, y, WIDTH, HEIGHT));

        if (this.direction === Orientation.BOTTOM || this.direction === Orientation.TOP) {
            this.view = new TileStraightView(context, this.bounds.tolLeft, this.isHidden)
        } else {
            this.view = new TileSideView(context, this.bounds.tolLeft)
        }
    }

    render() {
        this.view.render()
    }
}