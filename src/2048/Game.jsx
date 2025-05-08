// src/2048/Game.jsx
import React, { useEffect, useRef } from 'react';

const Game = () => {
  const gameBoardRef = useRef(null);

  useEffect(() => {
    // Dynamically load the 2048 game styles from the public/2048 folder
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/2048/styles.css'; // Correct path to the game's CSS file in public/2048/
    document.head.appendChild(link);

    // Dynamically load the 2048 game script
    const script = document.createElement('script');
    script.src = '/2048/script.js';  // Path to the game script in public/2048/
    script.async = true;
    script.type = 'module';  // Ensure it's loaded as a module
    script.onload = () => {
      console.log('Game script loaded successfully');
    };
    script.onerror = (error) => {
      console.error('Error loading game script:', error);
    };
    document.body.appendChild(script);

    // Load Grid.js and Tile.js modules dynamically
    const gridScript = document.createElement('script');
    gridScript.src = '/2048/Grid.js'; // Path to Grid.js in public/2048/
    gridScript.async = true;
    gridScript.type = 'module';
    document.body.appendChild(gridScript);

    const tileScript = document.createElement('script');
    tileScript.src = '/2048/Tile.js'; // Path to Tile.js in public/2048/
    tileScript.async = true;
    tileScript.type = 'module';
    document.body.appendChild(tileScript);

    // Cleanup: remove styles and scripts when the component is unmounted
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      document.body.removeChild(gridScript);
      document.body.removeChild(tileScript);
    };
  }, []);

  return (
    <div>      
      <div id="game-board" ref={gameBoardRef}></div> {/* The div where the game will render */}
    </div>
  );
};

export default Game;
