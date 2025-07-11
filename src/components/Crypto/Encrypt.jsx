import { useState, useRef } from "react";
import SecretKey from "./SecretKey";
import BIP39Panel from "./BIP39/BIP39Panel";

export default function Encrypt() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [mode, setMode] = useState("ascii"); // "ascii" or "bip39"
  const asciiRef = useRef();
  const bip39Ref = useRef();

  const handleEncrypt = async () => {
    let keyData;

    if (mode === "ascii") {
      keyData = await asciiRef.current?.getKey();
      console.log("[Encrypt] ASCII keyData:", keyData);
      if (!keyData) return alert("Missing ASCII key info");
    } else {
      const passphrase = asciiRef.current?.getPassword?.() || "";
      try {
        const rawKey = await bip39Ref.current?.getSecretKey(passphrase);
        if (!rawKey) throw new Error("Invalid BIP39 key");
        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          rawKey,
          { name: "AES-GCM" },
          false,
          ["encrypt", "decrypt"]
        );
        keyData = { key: cryptoKey, salt: null, iv: null };
        console.log("[Encrypt] BIP39 keyData:", keyData);
      } catch (err) {
        console.error("[Encrypt] BIP39 Error:", err);
        return alert("BIP39 Error: " + err.message);
      }
    }

    const enc = new TextEncoder();
    const ptBytes = enc.encode(plaintext);
    const { key, salt, iv } = keyData;
    if (!key) {
      console.error("[Encrypt] SubtleCrypto.encrypt key is undefined");
      return alert("Encryption key is missing");
    }

    const ivActual = iv || crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: ivActual }, key, ptBytes);
    const ctBytes = new Uint8Array(ct);

    const header = {
      algo: "AES-256-GCM",
      kdf: salt ? "PBKDF2" : "BIP39",
      iterations: salt ? 100000 : 0,
      iv: btoa(String.fromCharCode(...ivActual)),
      salt: salt ? btoa(String.fromCharCode(...salt)) : null
    };

    const combined = `${btoa(JSON.stringify(header))}\n${btoa(String.fromCharCode(...ctBytes))}`;
    setCiphertext(combined);
  };

  return (
    <div>
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          <input
            type="radio"
            checked={mode === "ascii"}
            onChange={() => setMode("ascii")}
          />
          ASCII
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            checked={mode === "bip39"}
            onChange={() => setMode("bip39")}
          />
          BIP39
        </label>
      </div>

      {mode === "ascii" && <SecretKey ref={asciiRef} />}
      {mode === "bip39" && <BIP39Panel ref={bip39Ref} />}

      <textarea
        placeholder="Plaintext"
        rows={4}
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <textarea
        placeholder="Ciphertext Output"
        rows={10}
        value={ciphertext}
        readOnly
        style={{ width: "100%", marginTop: "0.5rem" }}
      />
    </div>
  );
}
