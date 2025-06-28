import React from "react";
import './BIP39SelectorSet.css';
import BIP39Selector from "./BIP39Selector";

const BIP39SelectorSet = ({ count = 12, values = [], onChange }) => {
  const handleSelect = (index, word) => {
    onChange?.(index, word);
  };

  return (
    <div className="bip39-grid">
      {Array.from({ length: count }).map((_, i) => (
        <BIP39Selector
          key={i}
          index={i}
          value={values[i] || ""}
          onChange={handleSelect}
        />
      ))}
    </div>
  );
};

export default BIP39SelectorSet;
