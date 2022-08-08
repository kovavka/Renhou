import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {Orientation} from "../../components/tile/Orientation";

export function drawImageRotated(context: Context, img: HTMLImageElement, width: number, height: number, container: Rectangle, orientation: Orientation) {
    let dx = 0
    let dy = 0
    let degrees = 0

    let imgWidth = width
    let imgHeight = height

    switch (orientation) {
        case Orientation.TOP:
            dx = -width
            dy = -height
            degrees = 180
            break
        case Orientation.LEFT:
            dx = 0
            dy = -height
            degrees = 90
            imgWidth = height
            imgHeight = width
            break
        case Orientation.BOTTOM:
            dx = 0
            dy = 0
            degrees = 0
            break
        case Orientation.RIGHT:
            dx = -width
            dy = 0
            degrees = -90
            imgWidth = height
            imgHeight = width
            break
    }

    const {x: containerX, y: containerY, width: containerWidth, height: containerHeight} = container
    const posX = (containerX + containerWidth / 2) -  imgWidth / 2
    const posY = (containerY + containerHeight / 2) -  imgHeight / 2

    context.setTransform(1, 0, 0, 1, posX, posY)
    context.rotate(Math.PI * degrees / 180)


    context.drawImage(img, dx, dy)
    context.setTransform(1, 0, 0, 1, 0, 0)
}

export function drawImageRotated1(context: Context, src: string, container: Rectangle, orientation: Orientation) {
    // context.clearRect(0,0, 1000, 1000);
    // context.save();
    let dx = 0
    let dy = 0
    let dergees = 0

    const width = 300
    const height = 400

    switch (orientation) {
        case Orientation.TOP:
            dx = 0
            dy = 0
            dergees = 180
            break
        case Orientation.LEFT:
            dx = 0
            dy = -height
            dergees = 90
            break
        case Orientation.BOTTOM:
            dx = 0
            dy = 0
            break
        case Orientation.RIGHT:
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
