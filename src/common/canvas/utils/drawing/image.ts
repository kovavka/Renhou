import {Context} from "../../core/Context";
import {Rectangle} from "../../core/Rectangle";
import {Side} from "../../core/game-types/Side";
import {drawRotatedObject} from "./rotated";

export function drawImageRotated(context: Context, img: HTMLImageElement, width: number, height: number, container: Rectangle, side: Side) {
    const {x: containerX, y: containerY, width: containerWidth, height: containerHeight} = container

    let posX = 0
    let posY = 0

    switch (side) {
        case Side.TOP:
            posX = (containerX + containerWidth / 2) - width / 2
            posY = (containerY + containerHeight / 2) - height / 2
            break
        case Side.LEFT:
            posX = (containerX + containerWidth / 2) - height / 4
            posY = (containerY + containerHeight / 2) - width / 2
            break
        case Side.BOTTOM:
            posX = (containerX + containerWidth / 2) - width / 2
            posY = (containerY + containerHeight / 2) - height / 2
            break
        case Side.RIGHT:
            posX = (containerX + containerWidth / 2) - height / 2
            posY = (containerY + containerHeight / 4) - width / 2
            break
    }


    const drawingFunc = () => {
        context.fillStyle = '#444'
        // context.fillRect(0, 0, containerWidth, containerHeight)
        context.drawImage(img, 0, 0, width, height)
    }

    drawRotatedObject(context, new Rectangle(posX, posY, width, height), side, drawingFunc)

    // let dx = 0
    // let dy = 0
    // let degrees = 0
    //
    // let actualWidth = width
    // let actualHeight = height
    //
    // switch (orientation) {
    //     case Side.TOP:
    //         dx = -width
    //         dy = -height
    //         degrees = 180
    //         break
    //     case Side.LEFT:
    //         dx = 0
    //         dy = -height
    //         degrees = 90
    //         actualWidth = height
    //         actualHeight = width
    //         break
    //     case Side.BOTTOM:
    //         dx = 0
    //         dy = 0
    //         degrees = 0
    //         break
    //     case Side.RIGHT:
    //         dx = -width
    //         dy = 0
    //         degrees = -90
    //         actualWidth = height
    //         actualHeight = width
    //         break
    // }
    //
    // const {x: containerX, y: containerY, width: containerWidth, height: containerHeight} = container
    // const posX = (containerX + containerWidth / 2) -  actualWidth / 2
    // const posY = (containerY + containerHeight / 2) -  actualHeight / 2
    //
    // context.setTransform(1, 0, 0, 1, posX, posY)
    // context.rotate(Math.PI * degrees / 180)
    //
    //
    // context.drawImage(img, dx, dy, width, height)
    // context.setTransform(1, 0, 0, 1, 0, 0)
}
