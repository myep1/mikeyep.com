import { useRef, useState } from "react";
import SecretKey from "./SecretKey";
import BIP39Panel from "./BIP39/BIP39Panel";

export default function Decrypt() {
  const [ciphertext, setCiphertext] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [mode, setMode] = useState("ascii");
  const asciiRef = useRef();
  const bip39Ref = useRef();

  const handleDecrypt = async () => {
    const [headerB64, ctB64] = ciphertext.split("\n");
    if (!headerB64 || !ctB64) return alert("Invalid ciphertext format");

    let header;
    try {
      header = JSON.parse(atob(headerB64));
    } catch (e) {
      return alert("Failed to parse header", e);
    }

    const iv = new Uint8Array(atob(header.iv).split("").map(c => c.charCodeAt(0)));
    const salt = header.salt ? new Uint8Array(atob(header.salt).split("").map(c => c.charCodeAt(0))) : null;
    const ctBytes = new Uint8Array(atob(ctB64).split("").map(c => c.charCodeAt(0)));

    let key;
    try {
      if (header.kdf === "PBKDF2") {
        const keyData = await asciiRef.current?.deriveKey(asciiRef.current?.getPassword(), salt, iv);
        key = keyData?.key;
      } else if (header.kdf === "BIP39") {
        const passphrase = asciiRef.current?.getPassword?.() || "";
        const rawKey = await bip39Ref.current?.getSecretKey(passphrase);
        key = await crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"]);
      } else {
        return alert("Unknown KDF");
      }
    } catch (e) {
      return alert("Key derivation failed: " + e.message);
    }

    try {
      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ctBytes);
      setPlaintext(new TextDecoder().decode(pt));
    } catch (e) {
      alert("Decryption failed: " + e.message);
    }
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
        placeholder="Ciphertext Input"
        rows={10}
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button onClick={handleDecrypt}>Decrypt</button>
      <textarea
        placeholder="Plaintext Output"
        rows={4}
        value={plaintext}
        readOnly
        style={{ width: "100%", marginTop: "0.5rem" }}
      />
    </div>
  );
}
