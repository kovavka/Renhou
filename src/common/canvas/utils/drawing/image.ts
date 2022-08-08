import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {Side} from "../../components/tile/Side";

export function drawImageRotated(context: Context, img: HTMLImageElement, width: number, height: number, container: Rectangle, orientation: Side) {
    let dx = 0
    let dy = 0
    let degrees = 0

    let actualWidth = width
    let actualHeight = height

    switch (orientation) {
        case Side.TOP:
            dx = -width
            dy = -height
            degrees = 180
            break
        case Side.LEFT:
            dx = 0
            dy = -height
            degrees = 90
            actualWidth = height
            actualHeight = width
            break
        case Side.BOTTOM:
            dx = 0
            dy = 0
            degrees = 0
            break
        case Side.RIGHT:
            dx = -width
            dy = 0
            degrees = -90
            actualWidth = height
            actualHeight = width
            break
    }

    const {x: containerX, y: containerY, width: containerWidth, height: containerHeight} = container
    const posX = (containerX + containerWidth / 2) -  actualWidth / 2
    const posY = (containerY + containerHeight / 2) -  actualHeight / 2

    context.setTransform(1, 0, 0, 1, posX, posY)
    context.rotate(Math.PI * degrees / 180)


    context.drawImage(img, dx, dy, width, height)
    context.setTransform(1, 0, 0, 1, 0, 0)
}

export function drawImageRotated1(context: Context, src: string, container: Rectangle, orientation: Side) {
    // context.clearRect(0,0, 1000, 1000);
    // context.save();
    let dx = 0
    let dy = 0
    let dergees = 0

    const width = 300
    const height = 400

    switch (orientation) {
        case Side.TOP:
            dx = 0
            dy = 0
            dergees = 180
            break
        case Side.LEFT:
            dx = 0
            dy = -height
            dergees = 90
            break
        case Side.BOTTOM:
            dx = 0
            dy = 0
            break
        case Side.RIGHT:
            dx = 0
            dy = 0
            break
    }

    context.rotate(Math.PI * dergees / 360)

    const img = new Image()
    img.src = src
    img.onload = () => {
        context.drawImage(img, dx, dy)
    }

    // context.restore()
}
