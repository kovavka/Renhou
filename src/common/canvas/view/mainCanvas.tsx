import React, {CSSProperties, MouseEvent, useEffect, useRef} from "react";
import {colors} from "../../design-tokens/colors";
import {TileView} from "./components/tile/TileView";
import {Rectangle} from "../core/Rectangle";
import {Side} from "../core/game-types/Side";
import {CanvasService} from "../services/canvas/CanvasService";

const STYLES: CSSProperties = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    zIndex: '1'
}

export const MainCanvas: React.FunctionComponent = () => {
    const ref = useRef<HTMLCanvasElement>(null)

    const onClick = (e: MouseEvent) => {
        CanvasService.instance.clickHandler(e.clientX, e.clientY)
    }

    useEffect(() => {
        if (ref.current) {
            console.log('render')
            CanvasService.instance.updateCanvas(ref.current)
        }

        CanvasService.instance.onResize.add(({width, height}) => {
            if (ref.current) {
                ref.current.width = width
                ref.current.height = height
            }
        })
    }, [ref.current])

    return <canvas ref={ref} style={STYLES} onClick={onClick}></canvas>
}