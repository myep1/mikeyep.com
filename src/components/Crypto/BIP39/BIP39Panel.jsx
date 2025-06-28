import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import * as bip39 from "bip39";
import BIP39SelectorSet from "./BIP39SelectorSet";

window.Buffer = Buffer;

export default function BIP39Panel({ count }) {
  const [words, setWords] = useState(Array(count).fill(""));
  const [hex, setHex] = useState("");
  const [bits, setBits] = useState("");
  const [error, setError] = useState("");

  const handleChange = (index, word) => {
    const updated = [...words];
    updated[index] = word;
    setWords(updated);
  };

  const generateRandom = () => {
    const entropyBytes = count === 12 ? 16 : 32; // 128 or 256 bits
    const entropy = Buffer.from(crypto.getRandomValues(new Uint8Array(entropyBytes))).toString("hex");
    console.log("Generated hex:", entropy);
    setHex(entropy);
  };

  useEffect(() => {
    const allFilled = words.every((w) => w);
    if (allFilled) {
      try {
        const mnemonic = words.join(" ");
        const entropy = bip39.mnemonicToEntropy(mnemonic);
        setHex(entropy);
        const binary = BigInt("0x" + entropy)
          .toString(2)
          .padStart(entropy.length * 4, "0");
        setBits(binary);
        setError("");
        console.log("Mnemonic to entropy:", entropy);
        console.log("Updated binary:", binary);
      } catch (e) {
        console.error("mnemonicToEntropy error:", e);
        setHex("");
        setBits("");
        setError("BAD CHECKSUM");
      }
    }
  }, [words]);

  useEffect(() => {
    if (hex.length) {
      console.log("HEX updated:", hex);
      const validLengths = {
        12: 32,
        24: 64,
      };
      const neededLength = validLengths[count];
      if (neededLength && hex.length !== neededLength) {
        return; // Don't attempt until hex is the correct length for the word count
      }
      try {
        const mnemonic = bip39.entropyToMnemonic(hex);
        const newWords = mnemonic.split(" ");
        setWords(newWords);
        const binary = BigInt("0x" + hex)
          .toString(2)
          .padStart(hex.length * 4, "0");
        setBits(binary);
        setError("");
        console.log("Entropy to mnemonic:", mnemonic);
        console.log("Updated binary:", binary);
      } catch (e) {
        console.error("entropyToMnemonic error:", e);
        setBits("");
        setError("BAD CHECKSUM");
      }
    }
  }, [hex, count]);

  return (
    <div>
      <button onClick={generateRandom}>Generate Random</button>
      <BIP39SelectorSet
        count={count}
        values={words}
        onChange={handleChange}
        key={words.join("-")} // re-render when words change
      />
      <label>Hex:</label>
      <input
        value={hex}
        onChange={(e) => setHex(e.target.value.trim())}
        style={{ width: "100%" }}
      />
      <label>Binary:</label>
      <div
        style={{
          wordWrap: "break-word",
          fontFamily: "monospace",
          background: "#111",
          color: "lime",
          padding: "0.5rem",
        }}
      >
        {bits}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
