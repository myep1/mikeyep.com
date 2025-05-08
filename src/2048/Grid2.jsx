// src/2048/Grid2.jsx
import React from "react";

const Grid2 = ({ gridSize, tiles }) => {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    backgroundColor: "#CCC",
    gap: "2vmin",
    borderRadius: "1vmin",
    padding: "2vmin",
    position: "relative",
  };

  return (
    <div id="game-board" style={gridStyle}>
      {tiles.map((tile, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${tile.y * 20 + 2}vmin`,  // Adjust positioning as needed
            left: `${tile.x * 20 + 2}vmin`,
            backgroundColor: tile.value === 2 ? "#f5f5f5" : "#ffcc00",
            fontSize: "2vmin",
            color: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20vmin",
            height: "20vmin",
            borderRadius: "1vmin",
            textAlign: "center",
          }}
        >
          <span>{tile.value}</span>
        </div>
      ))}
    </div>
  );
};

export default Grid2;
