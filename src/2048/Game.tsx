// src/2048/Game.tsx
import { useEffect, useRef } from "react";

const Game: React.FC = () => {
  const gameBoardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/2048/styles.css";
    document.head.appendChild(link);

    // helper to make module scripts with typed handlers
    const addModule = (src: string) => {
      const s = document.createElement("script");
      s.type = "module";
      s.async = true;
      s.src = src;
      s.onload = () => console.log(`${src} loaded`);
      s.onerror = (e) => console.error(`Error loading ${src}`, e);
      document.body.appendChild(s);
      return s;
    };

    const script = addModule("/2048/script.js");
    const gridScript = addModule("/2048/Grid.js");
    const tileScript = addModule("/2048/Tile.js");

    return () => {
      if (link.parentNode) document.head.removeChild(link);
      [script, gridScript, tileScript].forEach((el) => {
        if (el.parentNode) document.body.removeChild(el);
      });
    };
  }, []);

  return <div><div id="game-board" ref={gameBoardRef} /></div>;
};

export default Game;
