// src/2048/GameTest.tsx
import { useEffect, useState } from "react";
import { loadResources, loadCss } from "./loadResources";
import Grid2 from "./Grid2";
import Tile2 from "./Tile2";

type Tile = { x: number; y: number; value: number };

const GameTest: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(4);
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    const loadAllResources = async () => {
      await loadCss("/2048/styles.css");

      // initialize global used by external scripts
      window.__G = { moves: [], boardSize: 4 };

      await loadResources([
        "/2048/hammer.min.js",
        "/2048/script2.js",
      ]);

      setTiles(generateRandomTiles(3));
    };
    loadAllResources();
  }, []);

  const generateRandomTiles = (count: number): Tile[] => {
    const generated: Tile[] = [];
    const occupied = new Set<string>();

    while (generated.length < count) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      const key = `${x},${y}`;
      if (occupied.has(key)) continue;
      occupied.add(key);
      generated.push({ x, y, value: Math.random() > 0.5 ? 2 : 4 });
    }
    return generated;
  };

  return (
    <div>
      <div id="game-frame">
        <select
          id="brdsz"
          value={boardSize}
          onChange={(e) => setBoardSize(parseInt(e.target.value, 10))}
          style={{ float: "left" }}
        >
          {[4, 5, 6, 7, 8].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <Grid2 gridSize={boardSize} tiles={tiles}>
          {tiles.map((t, i) => (
            <Tile2 key={i} x={t.x} y={t.y} value={t.value} />
          ))}
        </Grid2>

        <span id="msg">Last swipe</span>
        <span id="msg2">Last key</span>
      </div>
    </div>
  );
};

export default GameTest;
