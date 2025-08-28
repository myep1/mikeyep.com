import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Buffer } from "buffer";
import * as bip39 from "bip39";
import BIP39SelectorSet from "./BIP39SelectorSet";

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
window.Buffer = Buffer;

type Count = 12 | 24;
export type BIP39Handle = {
  getSecretKey: (passphrase?: string) => Promise<Uint8Array>;
};
type Props = { count?: Count };

const BIP39Panel = forwardRef<BIP39Handle, Props>(({ count: forcedCount }, ref) => {
  const [mode, setMode] = useState<Count>((forcedCount as Count) || 12);
  const [words, setWords] = useState<string[]>(Array(mode).fill(""));
  const [hex, setHex] = useState<string>("");
  const [bits, setBits] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (index: number, word: string) => {
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
    const allFilled = words.every((w) => !!w);
    if (!allFilled) return;
    try {
      const mnemonic = words.join(" ");
      const entropy = bip39.mnemonicToEntropy(mnemonic);
      setHex(entropy);
      const binary = BigInt("0x" + entropy).toString(2).padStart(entropy.length * 4, "0");
      setBits(binary);
      setError("");
    } catch {
      setHex("");
      setBits("");
      setError("BAD CHECKSUM");
    }
  }, [words]);

  useEffect(() => {
    if (!hex.length) return;
    const validLengths: Record<Count, number> = { 12: 32, 24: 64 };
    const needed = validLengths[mode];
    if (hex.length !== needed) return;
    try {
      const mnemonic = bip39.entropyToMnemonic(hex);
      const newWords = mnemonic.split(" ");
      setWords(newWords);
      const binary = BigInt("0x" + hex).toString(2).padStart(hex.length * 4, "0");
      setBits(binary);
      setError("");
    } catch {
      setBits("");
      setError("BAD CHECKSUM");
    }
  }, [hex, mode]);

  useEffect(() => {
    setWords(Array(mode).fill(""));
    setHex("");
    setBits("");
    setError("");
  }, [mode]);

  useImperativeHandle(ref, () => ({
    async getSecretKey(passphrase = "") {
      const mnemonic = words.join(" ");
      if (!bip39.validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic");
      const seed = await bip39.mnemonicToSeed(mnemonic, passphrase); // Buffer in Node, Uint8Array in browser (polyfilled)
      const u8 = seed instanceof Uint8Array ? seed : new Uint8Array(seed as unknown as ArrayBuffer);
      return u8.subarray(0, 32); // 256-bit key
    },
  }));

  return (
    <div>
      {!forcedCount && (
        <div>
          <label>
            <input type="radio" checked={mode === 12} onChange={() => setMode(12)} />
            12 words
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input type="radio" checked={mode === 24} onChange={() => setMode(24)} />
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
      <label>Hex:</label>
      <input
        value={hex}
        onChange={(e) => setHex(e.target.value.trim())}
        style={{ width: "100%" }}
      />
    </div>
  );
});

export default BIP39Panel;
