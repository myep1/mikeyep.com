import { useState, useRef } from "react";
import SecretKey from "./SecretKey";

export default function Decrypt() {
  const secretKeyRef = useRef();
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("text");

  const fromBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const dec = new TextDecoder();

  const decryptText = async () => {
  setError("");
  try {
    const parts = ciphertext.trim().split("$");
    if (parts.length !== 6 || parts[0] !== "@aes256gcm") throw new Error("Invalid format");

    const [, , , saltB64, ivB64, ctB64] = parts;
    const salt = fromBase64(saltB64);
    const iv = fromBase64(ivB64);
    const ct = fromBase64(ctB64);

    const password = secretKeyRef.current.getPassword?.();
    if (!password) throw new Error("No password");

    const { key } = await secretKeyRef.current.deriveKey(password, salt, iv);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);

    setDecrypted(dec.decode(pt));
  } catch (e) {
    setError("Decryption failed: " + e.message);
    setDecrypted("");
  }
};

const decryptFile = async () => {
  setError("");
  if (!file) return;

  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const ct = bytes.slice(28);

    const password = secretKeyRef.current.getPassword?.();
    if (!password) throw new Error("No password");

    const { key } = await secretKeyRef.current.deriveKey(password, salt, iv);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);

    const blob = new Blob([pt]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(/\.enc$/, "") || "decrypted.out";
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    setError("Decryption failed: " + e.message);
  }
};


  return (
    <div>
      {/* Key input */}
      <SecretKey ref={secretKeyRef} />

      {/* Mode Toggle */}
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          <input type="radio" value="text" checked={mode === "text"} onChange={() => setMode("text")} />
          Text
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input type="radio" value="file" checked={mode === "file"} onChange={() => setMode("file")} />
          File
        </label>
      </div>

      {/* Text Mode */}
      {mode === "text" && (
        <>
          <textarea
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Paste ciphertext here"
            rows={4}
            style={{ width: "100%" }}
          />
          <button onClick={decryptText}>Decrypt</button>
          <textarea
            value={decrypted}
            readOnly
            rows={4}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </>
      )}

      {/* File Mode */}
      {mode === "file" && (
        <>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "0.5rem" }}
          />
          <button onClick={decryptFile} disabled={!file} style={{ marginTop: "0.5rem", display: "block" }}>
            Decrypt File
          </button>
        </>
      )}

      {error && <div style={{ color: "red", marginTop: "0.5rem" }}>{error}</div>}
    </div>
  );
}
