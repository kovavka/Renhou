import {CanvasObject} from "../core/CanvasObject";
import {colors} from "../../design-tokens/colors";
import {Context} from "../core/Context";
import {Rectangle} from "../core/Rectangle";
import {makeRoundRect} from "../utils/drawing/roundRect";
import man1 from "../../img/tiles/man1.svg";

const WIDTH = 300

const HEIGHT_FRONT = 420
const HEIGHT_SHADOW = 17
const HEIGHT_BACK = 7

const HEIGHT_FRONT_FALLEN = 420
const HEIGHT_SHADOW_FALLEN = 17
const HEIGHT_BACK_FALLEN = 7

const HEIGHT = HEIGHT_FRONT + HEIGHT_SHADOW + HEIGHT_BACK
const HEIGHT_FALLEN = HEIGHT_FRONT_FALLEN + HEIGHT_SHADOW_FALLEN + HEIGHT_BACK_FALLEN

const RADIUS = 12

export class Tile extends CanvasObject {
    isHidden: boolean = false
    isFallen: boolean = false

    constructor(context: Context, x: number, y: number) {
        super(context, new Rectangle(x, y, WIDTH, HEIGHT));
    }

    private drawBack() {
        const height = this.isFallen ? HEIGHT_FALLEN : HEIGHT

        this.context.beginPath();
        this.context.fillStyle = colors.tileBack
        makeRoundRect(this.context, this.bounds.x, this.bounds.y, WIDTH, height, RADIUS)
        this.context.fill()
        this.context.closePath();
    }

    private drawSide() {
        const height = this.isFallen ? HEIGHT_FRONT_FALLEN + HEIGHT_SHADOW_FALLEN : HEIGHT_FRONT + HEIGHT_SHADOW

        this.context.beginPath();
        this.context.fillStyle = colors.tileShadow
        makeRoundRect(this.context, this.bounds.x, this.bounds.y, WIDTH, height, RADIUS)
        this.context.fill()
        this.context.closePath();
    }

    private drawFront() {
        const height = this.isFallen ? HEIGHT_FRONT_FALLEN : HEIGHT_FRONT

        this.context.beginPath();
        this.context.fillStyle = colors.tileFront
        makeRoundRect(this.context, this.bounds.x, this.bounds.y, WIDTH, HEIGHT_FRONT, RADIUS)
        this.context.fill()
        this.context.closePath();
    }

    private drawImg() {
        const img = new Image()
        img.src = man1;

        // const imgX = (this.bounds.x + WIDTH) / 2 - WIDTH_IMG / 2
        // const imgY = (this.bounds.y + HEIGHT_FRONT) / 2 - HEIGHT_IMG / 2

        const imgX = (this.bounds.x + WIDTH) / 2
        const imgY = (this.bounds.y + HEIGHT_FRONT) / 2


        img.onload = () => {
            this.context.drawImage(img, 0, 0, img.width, img.height)
        }
    }

    render() {
        this.drawBack()
        this.drawSide()
        this.drawFront()
        this.drawImg()
    }
}