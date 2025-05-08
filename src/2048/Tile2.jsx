// File: src/2048/Tile2.jsx
import React from 'react';

const Tile2 = ({ x, y, value }) => {
  const tileStyle = {
    position: 'absolute',
    width: 'var(--cell-size)',
    height: 'var(--cell-size)',
    top: `calc(${y} * (var(--cell-size) + var(--cell-gap)) + var(--cell-gap))`,
    left: `calc(${x} * (var(--cell-size) + var(--cell-gap)) + var(--cell-gap))`,
    backgroundColor: 'hsl(200, 50%, var(--background-lightness))',
    color: 'hsl(200, 25%, var(--text-lightness))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    borderRadius: '1vmin',
    fontSize: 'calc(var(--cell-size) / 2)',
    animation: 'show 200ms ease-in-out',
    transition: '100ms ease-in-out',
  };

  return (
    <div style={tileStyle}>
      {value}
    </div>
  );
};

export default Tile2;
