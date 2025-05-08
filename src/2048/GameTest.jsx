import React, { useEffect, useState } from "react";
import { loadResources, loadCss } from "./loadResources"; // Custom loader function for scripts and CSS
import Grid2 from "./Grid2";  // Grid component (JSX)
import Tile2 from "./Tile2";  // Tile component (JSX)

const GameTest = () => {
  const [boardSize, setBoardSize] = useState(4);
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    const loadAllResources = async () => {
      // Dynamically load the GameTest-specific CSS
      await loadCss("/2048/styles.css");  // Game-specific styles

      // Initialize __G before loading other scripts
      window.__G = {
        moves: [],
        boardSize: 4, // Set the initial board size
      };

      // Dynamically load the external resources (scripts)
      await loadResources([
        "/2048/hammer.min.js",
        "/2048/script2.js",  // script2.js is loaded after __G is initialized
      ]);
      
      // Step 3: Initialize the grid and tiles
      const initialTiles = generateRandomTiles(3);  // Generate 3 initial random tiles
      setTiles(initialTiles); // Set tiles state
    };

    loadAllResources();

  }, []);

  // Generate random tiles for the grid
  const generateRandomTiles = (count) => {
    const generatedTiles = [];
    const existingTiles = [];

    for (let i = 0; i < count; i++) {
      let x, y, value;

      // Ensure that each tile has a unique position
      do {
        x = Math.floor(Math.random() * boardSize);
        y = Math.floor(Math.random() * boardSize);
      } while (existingTiles.some((tile) => tile.x === x && tile.y === y));

      value = Math.random() > 0.5 ? 2 : 4;  // Randomly choose 2 or 4

      generatedTiles.push({ x, y, value });
      existingTiles.push({ x, y });
    }

    return generatedTiles;
  };

  return (
    <div>
      <div id="game-frame">
        <select
          id="brdsz"
          value={boardSize}
          onChange={(e) => setBoardSize(parseInt(e.target.value))}
          style={{ float: "left" }}
        >
          {[4, 5, 6, 7, 8].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {/* Pass tiles as a prop to Grid2 */}
        <Grid2 gridSize={boardSize} tiles={tiles}>
          {tiles.map((tile, index) => (
            <Tile2
              key={index}
              x={tile.x}
              y={tile.y}
              value={tile.value}
            />
          ))}
        </Grid2>

        <span id="msg">Last swipe</span>
        <span id="msg2">Last key</span>
      </div>
    </div>
  );
};

export default GameTest;
