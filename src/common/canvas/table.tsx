import React, {CSSProperties, MouseEvent, useEffect, useRef} from "react";
import {colors} from "../design-tokens/colors";

const STYLES: CSSProperties = {
    // width: '100vw',
    // height: '100vh',
    position: 'absolute',
    zIndex: '1'
}

export const Table: React.FunctionComponent = () => {
    const ref = useRef<HTMLCanvasElement>(null)

    const onClick = (e: MouseEvent) => {
        const context = ref.current!.getContext('2d')
        if (context) {
            const {clientX, clientY} = e
            if (clientX > 10 && clientX < 100 && clientY > 20 && clientY < 100) {
                console.log('111')
            }
        }
    }

    useEffect(() => {
        if (ref.current) {
            const context = ref.current.getContext('2d')
            if (context) {
                const width =  ref.current.width
                const height =  ref.current.height

                context.beginPath();
                context.fillStyle = colors.tableBackground
                context.fillRect(0, 0, width, height);


                context.beginPath();
                context.fillStyle = 'blue';
                context.fillRect(10, 20, 100, 200)
                context.closePath();
            }
        }
    }, [ref.current])

    return <canvas ref={ref} style={STYLES} onClick={onClick} width={window.innerWidth}  height={window.innerHeight}></canvas>
}