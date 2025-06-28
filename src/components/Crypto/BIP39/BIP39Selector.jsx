// BIP39Selector.jsx
import React, { useState, useEffect } from "react";
import './BIP39Selector.css';
import bip39Wordlist from "./bip39-wordlist"; // array of 2048 words

const BIP39Selector = ({ index, value, onChange }) => {
  const [stage, setStage] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setStage((s) => (s > 0 ? s - 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredWords = bip39Wordlist.filter(word =>
    selectedLetter ? word.startsWith(selectedLetter.toLowerCase()) : false
  );

  const selectWord = (word) => {
    onChange(index, word);
    setStage(0);
    setSelectedLetter(null);
  };

  return (
    <div className="bip39-slot">
      {stage === 0 && (
        <button
          onClick={() => setStage(1)}
          className={`bip39-button ${value ? "selected" : "unselected"}`}
        >
          {value || "Select"}
        </button>
      )}

      {stage === 1 && (
        <div className="az-grid">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
            <button
              key={l}
              onClick={() => {
                setSelectedLetter(l);
                setStage(2);
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {stage === 2 && (
        <div className="word-list">
          <button className="back-button" onClick={() => setStage(1)}>← Back</button>
          {filteredWords.map((word) => (
            <button key={word} onClick={() => selectWord(word)}>
              {word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BIP39Selector;