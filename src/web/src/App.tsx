import React, {useEffect} from 'react';
import './App.css';
import {MainCanvas} from "../../common/canvas/mainCanvas";
import {CanvasService} from "../../common/canvas/services/canvas/CanvasService";
import {GameService} from "../../common/canvas/services/game/GameService";

function onResize() {
    CanvasService.instance.updateSize(window.innerWidth, window.innerHeight)
}

function App() {
    useEffect(() => {
        onResize()
        window.addEventListener('resize', onResize)

        GameService.instance.start()
    })

    return (
        <div>
            <MainCanvas />
        </div>
    );
}

export default App;
