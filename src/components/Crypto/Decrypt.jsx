import { useState } from "react";

export default function Decrypt() {
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("text");

  const fromBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const dec = new TextDecoder();
  const enc = new TextEncoder();

  const decryptText = async () => {
    setError("");
    try {
      const parts = ciphertext.trim().split("$");
      if (parts.length !== 6 || parts[0] !== "@aes256gcm") throw new Error("Invalid format");

      const [, kdf, iterations, saltB64, ivB64, ctB64] = parts;
      if (kdf !== "pbkdf2") throw new Error("Unsupported KDF");

      const salt = fromBase64(saltB64);
      const iv = fromBase64(ivB64);
      const ct = fromBase64(ctB64);
      const password = prompt("Enter password to decrypt");
      if (!password) return;

      const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: parseInt(iterations), hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

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
      const password = prompt("Enter password to decrypt");
      if (!password) return;

      const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

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
