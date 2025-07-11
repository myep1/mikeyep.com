import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Buffer } from "buffer";
import * as bip39 from "bip39";
import BIP39SelectorSet from "./BIP39SelectorSet";
import { Eye, EyeOff, Lock } from "lucide-react"; // optional, or use emoji/icons

window.Buffer = Buffer;

const BIP39Panel = forwardRef(({ count: forcedCount }, ref) => {
  const [mode, setMode] = useState(forcedCount || 12);
  const [words, setWords] = useState(Array(mode).fill(""));
  const [hex, setHex] = useState("");
  const [bits, setBits] = useState("");
  const [error, setError] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (index, word) => {
    const updated = [...words];
    updated[index] = word;
    setWords(updated);
  };

  const generateRandom = () => {
    const entropyBytes = mode === 12 ? 16 : 32;
    const entropy = Buffer.from(crypto.getRandomValues(new Uint8Array(entropyBytes))).toString("hex");
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
      } catch (e) {
        setHex("");
        setBits("");
        setError("BAD CHECKSUM", e);
      }
    }
  }, [words]);

  useEffect(() => {
    if (hex.length) {
      const validLengths = { 12: 32, 24: 64 };
      if (hex.length !== validLengths[mode]) return;
      try {
        const mnemonic = bip39.entropyToMnemonic(hex);
        const newWords = mnemonic.split(" ");
        setWords(newWords);
        const binary = BigInt("0x" + hex)
          .toString(2)
          .padStart(hex.length * 4, "0");
        setBits(binary);
        setError("");
      } catch (e) {
        setBits("");
        setError("BAD CHECKSUM", e);
      }
    }
  }, [hex, mode]);

  useEffect(() => {
    setWords(Array(mode).fill(""));
    setHex("");
    setBits("");
    setError("");
  }, [mode]);

  useImperativeHandle(ref, () => ({
    async getSecretKey() {
      const mnemonic = words.join(" ");
      if (!bip39.validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic");
      const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
      return new Uint8Array(seed).subarray(0, 32);
    },
  }));

  return (
    <div>
      {!forcedCount && (
        <div>
          <label>
            <input
              type="radio"
              checked={mode === 12}
              onChange={() => setMode(12)}
            />
            12 words
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              checked={mode === 24}
              onChange={() => setMode(24)}
            />
            24 words
          </label>
        </div>
      )}
      <button onClick={generateRandom}>Generate</button>
      <BIP39SelectorSet
        count={mode}
        values={words}
        onChange={handleChange}
        key={words.join("-")}
      />
      <label>Optional passphrase:</label>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
        <input
          type={show ? "text" : "password"}
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="passphrase"
          style={{ flex: 1 }}
        />
        <button
          onClick={() => setShow((prev) => !prev)}
          style={{ marginLeft: "0.5rem" }}
        >
          {show ? <Eye size={16} /> : <Lock size={16} />}
        </button>
      </div>
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
});

export default BIP39Panel;
