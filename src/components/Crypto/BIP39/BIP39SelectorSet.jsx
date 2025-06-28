import React, { useState } from "react";
import './BIP39SelectorSet.css';
import BIP39Selector from "./BIP39Selector";

const BIP39SelectorSet = ({ count = 12, onComplete }) => {
  const [words, setWords] = useState(Array(count).fill(""));

  const handleSelect = (index, word) => {
    const updated = [...words];
    updated[index] = word;
    setWords(updated);

    if (updated.every(w => w)) {
      onComplete?.(updated);
    }
  };

  return (
    <div className="bip39-grid">
        {words.map((word, i) => (
            <BIP39Selector
                key={i}
                index={i}
                value={word}
                onChange={handleSelect}
            />
        ))}
    </div>
  );
};

export default BIP39SelectorSet;
