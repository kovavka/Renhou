import React, {useEffect, useState} from 'react';
import './App.css';
import {MainCanvas} from "../../common/canvas/mainCanvas";
import {CanvasService} from "../../common/canvas/services/canvas/CanvasService";
import {GameService} from "../../common/canvas/services/game/GameService";

function onResize() {
    CanvasService.instance.updateSize(window.innerWidth, window.innerHeight)
}

function App() {
    const [gameStarted, setGameStarted] = useState(false)
    useEffect(() => {
        onResize()
        window.addEventListener('resize', onResize)
    })

    useEffect(() => {
        if (gameStarted) {
            GameService.instance.start()
        }
    }, [gameStarted])

    return (
        <div>
            {gameStarted && <MainCanvas />}
            {!gameStarted && <button onClick={() => setGameStarted(true)}>start game</button>}

        </div>
    );
}

export default App;
