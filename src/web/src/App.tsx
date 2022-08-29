import React, {useEffect} from 'react';
import './App.css';
import {MainCanvas} from "../../common/canvas/view/mainCanvas";
import {CanvasService} from "../../common/canvas/canvas-service/CanvasService";

function onResize() {
    CanvasService.instance.updateSize(window.innerWidth, window.innerHeight)
}

function App() {
    useEffect(() => {
        onResize()
        window.addEventListener('resize', onResize)
    })

    return (
        <div>
            <MainCanvas />
        </div>
    );
}

export default App;
